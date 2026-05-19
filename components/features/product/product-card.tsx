"use client"

import Link from "next/link";
import { ShoppingCart, ClipboardList } from "lucide-react";
import { ProductWithImages } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductImage } from "@/components/ui/product-image";
import { WishlistButton } from "@/components/features/wishlist/wishlist-button";
import { useCartStore } from "@/stores/cart-store";
import { useUIStore } from "@/stores/ui-store";
import { toast } from "sonner";
import { useState, useEffect } from "react";

interface ProductCardProps {
    product: ProductWithImages;
    variant?: "default" | "compact" | "featured";
    isWishlisted?: boolean;
}

export function ProductCard({ product, variant = "default", isWishlisted = false }: ProductCardProps) {
    const mainImage = product.images?.[0]?.image_url;
    const inStock = product.stock_quantity > 0;
    const [rating, setRating] = useState<{ average: number; count: number; reviewCount: number } | null>(null);
    const [loading, setLoading] = useState(true);
    
    const addItem = useCartStore((s) => s.addItem);
    const openCart = useUIStore((s) => s.openCart);

    // Fetch reviews for this product
    useEffect(() => {
        const fetchRating = async () => {
            try {
                const res = await fetch(`/api/products/${product.id}/reviews`, {
                    cache: 'no-store',
                });
                if (res.ok) {
                    const data = await res.json();
                    setRating(data);
                }
            } catch (err) {
                console.error('Failed to fetch reviews:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchRating();
    }, [product.id]);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        addItem({
            productId: product.id,
            variantId: null,
            name: product.name,
            price: product.base_price,
            image: mainImage || null,
            sku: product.sku,
            maxStock: product.stock_quantity,
        }, 1);

        toast.success(`${product.name} added to cart`);
        openCart();
    };

    // Parse specifications
    const specs = product.specifications as Record<string, any> || {};
    // If reviews exist, show 3 specs, otherwise show 4 to maintain consistent card height
    const maxSpecs = !loading && rating && rating.count > 0 ? 3 : 4;
    const specEntries = Object.entries(specs)
        .filter(([_, value]) => value != null && value !== '')
        .slice(0, maxSpecs);

    return (
        <Link href={`/products/${product.slug}`} className="group">
            <div className="h-full bg-white border border-neutral-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
                {/* Image section */}
                <div className="relative aspect-square w-full overflow-hidden bg-neutral-100 px-4 py-6 shrink-0">
                    <ProductImage
                        src={mainImage}
                        alt={product.name}
                        aspectRatio="square"
                        className="object-contain transition-transform duration-300 group-hover:scale-105 h-full w-full"
                    />
                    
                    {/* Badge overlay */}
                    {!product.is_active && (
                        <Badge variant="secondary" className="absolute left-4 top-4">
                            Draft
                        </Badge>
                    )}
                    {!inStock && (
                        <Badge variant="destructive" className="absolute left-4 top-4">
                            Out of Stock
                        </Badge>
                    )}
                    
                    {/* Wishlist Button */}
                    <div className="absolute right-4 top-4">
                        <WishlistButton
                            productId={product.id}
                            isWishlisted={isWishlisted}
                            variant="card-overlay"
                        />
                    </div>
                </div>

                {/* Content section */}
                <div className="p-4 space-y-3 flex flex-col grow">
                    {/* Product Name and Rating */}
                    <div>
                        <h3 className="line-clamp-2 text-sm font-medium text-neutral-900 mb-2">
                            {product.name}
                        </h3>
                        {/* Show rating only if it exists */}
                        {!loading && rating && rating.count > 0 && (
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1 bg-green-600 text-white px-2 py-0.5 rounded text-xs font-semibold">
                                    <span>{rating.average.toFixed(1)}</span>
                                    <span>★</span>
                                </div>
                                <span className="text-xs text-neutral-600">
                                    {rating.count} Rating{rating.count !== 1 ? 's' : ''} & {rating.reviewCount} Review{rating.reviewCount !== 1 ? 's' : ''}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Specs List - Only if specs exist */}
                    {specEntries.length > 0 && (
                        <ul className="space-y-1.5 text-xs text-neutral-700 grow">
                            {specEntries.map(([key, value]) => (
                                <li key={key} className="flex items-start gap-2">
                                    <span className="text-neutral-400 mt-0.5">•</span>
                                    <span className="line-clamp-1">{String(value)}</span>
                                </li>
                            ))}
                        </ul>
                    )}

                    {/* Price section */}
                    <div className="pt-2 border-t border-neutral-200 mt-auto">
                        <div className="flex items-baseline gap-2 mb-2">
                            <span className="text-lg font-bold text-neutral-900">
                                ₹{product.base_price.toLocaleString('en-IN')}
                            </span>
                        </div>
                        {inStock && product.stock_quantity <= 5 && (
                            <p className="text-xs text-orange-600 font-medium mb-2">
                                Only {product.stock_quantity} left
                            </p>
                        )}
                    </div>

                    {/* Action Button */}
                    <Button
                        className="w-full"
                        disabled={!inStock}
                        onClick={(e) => {
                            e.preventDefault();
                            handleAddToCart(e);
                        }}
                        variant={inStock ? "default" : "secondary"}
                    >
                        {product.is_quote_only ? (
                            <>
                                <ClipboardList className="h-4 w-4 mr-2" />
                                Request Quote
                            </>
                        ) : inStock ? (
                            <>
                                <ShoppingCart className="h-4 w-4 mr-2" />
                                Add to Cart
                            </>
                        ) : (
                            "Out of Stock"
                        )}
                    </Button>
                </div>
            </div>
        </Link>
    );
}

"use client";

import React, { useState, useEffect } from "react";
import { ShoppingCart, Heart, Minus, Plus, Check, AlertCircle, Star, ZoomIn } from "lucide-react";
import { ProductWithImages } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductImage } from "@/components/ui/product-image";
import { PriceDisplay } from "@/components/ui/price-display";
import { RatingDisplay } from "@/components/ui/rating-display";
import { CertificationBadge, CertificationType } from "@/components/ui/certification-badge";
import { Separator } from "@/components/ui/separator";
import { WishlistButton } from "@/components/features/wishlist/wishlist-button";
import { ProductImageModal } from "@/components/features/product/product-image-modal";
import { useCartStore } from "@/stores/cart-store";
import { useUIStore } from "@/stores/ui-store";
import { toast } from "sonner";
import { QuoteModal } from "@/components/features/product/quote-modal";

interface Address {
    id: string
    full_name: string
    address_line1: string
    city: string
    state: string
    postal_code: string
}

interface ProductHeroProps {
    product: ProductWithImages;
    isWishlisted?: boolean;
    userAddresses?: Address[];
    averageRating?: number;
    totalReviews?: number;
}

export function ProductHero({ product, isWishlisted = false, userAddresses = [], averageRating = 0, totalReviews = 0 }: ProductHeroProps) {
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [isAdding, setIsAdding] = useState(false);
    const [isBuyingNow, setIsBuyingNow] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [rating, setRating] = useState<{ average: number; count: number; reviewCount: number } | null>(null);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);

    const addItem = useCartStore((s) => s.addItem);
    const openCart = useUIStore((s) => s.openCart);

    useEffect(() => {
        // Check if user is admin
        const checkAdmin = async () => {
            try {
                const response = await fetch('/api/auth/check-admin')
                const data = await response.json()
                setIsAdmin(data.isAdmin)
            } catch (error) {
                setIsAdmin(false)
            } finally {
                setIsLoading(false)
            }
        }

        checkAdmin()
        
        // Fetch fresh rating data
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
            }
        };

        fetchRating()
    }, [product.id])

    const handleQuantityChange = (delta: number) => {
        setQuantity((prev) => Math.max(1, Math.min(prev + delta, product.stock_quantity)));
    };

    const handleAddToCart = () => {
        setIsAdding(true);

        const primaryImage = product.images?.find((img) => img.is_primary) || product.images?.[0];

        addItem({
            productId: product.id,
            variantId: null,
            name: product.name,
            price: product.base_price,
            image: primaryImage?.image_url || null,
            sku: product.sku,
            maxStock: product.stock_quantity,
        }, quantity);

        toast.success(`${product.name} added to cart`, {
            description: `Quantity: ${quantity}`,
        });

        openCart();

        setTimeout(() => setIsAdding(false), 600);
    };

    const handleBuyNow = () => {
        setIsBuyingNow(true);

        const primaryImage = product.images?.find((img) => img.is_primary) || product.images?.[0];

        addItem({
            productId: product.id,
            variantId: null,
            name: product.name,
            price: product.base_price,
            image: primaryImage?.image_url || null,
            sku: product.sku,
            maxStock: product.stock_quantity,
        }, quantity);

        toast.success(`${product.name} added to cart`, {
            description: `Quantity: ${quantity}`,
        });

        // Navigate to checkout after a brief delay
        setTimeout(() => {
            window.location.href = '/products/checkout'
            setIsBuyingNow(false)
        }, 300);
    };

    const mainImage = product.images?.[selectedImage]?.image_url;

    if (isLoading) return null;

    return (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
            {/* Product Images */}
            <div className="space-y-4">
                <div className="relative group cursor-pointer" onClick={() => setIsImageModalOpen(true)}>
                    <ProductImage
                        src={mainImage}
                        alt={product.name}
                        aspectRatio="square"
                        className="rounded-2xl border"
                    />
                    <div className="absolute inset-0 rounded-2xl bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="bg-white rounded-full p-3 shadow-lg">
                                <ZoomIn className="h-6 w-6 text-neutral-900" />
                            </div>
                        </div>
                    </div>
                </div>
                {product.images && product.images.length > 1 && (
                    <div className="flex gap-4 overflow-x-auto pb-2">
                        {product.images.map((image, index) => (
                            <button
                                key={image.id}
                                onClick={() => setSelectedImage(index)}
                                className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 ${selectedImage === index
                                    ? "border-primary-600"
                                    : "border-transparent hover:border-neutral-300"
                                    }`}
                            >
                                <ProductImage
                                    src={image.image_url}
                                    alt={`${product.name} thumbnail ${index + 1}`}
                                    aspectRatio="square"
                                    className="object-cover"
                                />
                            </button>
                        ))}
                    </div>
                )}
                
                {/* Image Modal */}
                <ProductImageModal
                    src={mainImage || ""}
                    alt={product.name}
                    isOpen={isImageModalOpen}
                    onClose={() => setIsImageModalOpen(false)}
                />
            </div>

            {/* Product Details */}
            <div className="flex flex-col">
                <div className="mb-4">
                    <h1 className="font-heading text-3xl font-bold text-neutral-900 sm:text-4xl">
                        {product.name}
                    </h1>
                    <div className="mt-3 flex flex-wrap items-center gap-4">
                        {/* Rating */}
                        {rating && rating.count > 0 && (
                            <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
                                <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                    <span className="font-semibold text-amber-900">
                                        {rating.average.toFixed(1)}
                                    </span>
                                </div>
                                <span className="text-xs text-amber-700">
                                    ({rating.count} {rating.count === 1 ? 'rating' : 'ratings'})
                                </span>
                            </div>
                        )}
                        
                        {/* Stock Status */}
                        {product.stock_quantity > 0 ? (
                            product.stock_quantity < 5 ? (
                                <span className="text-sm font-medium text-red-600 flex items-center gap-1">
                                    <AlertCircle className="h-4 w-4" />
                                    Hurry, few left in stock!
                                </span>
                            ) : (
                                <span className="text-sm font-medium text-green-600">
                                    ✓ In Stock
                                </span>
                            )
                        ) : (
                            <span className="text-sm font-medium text-red-600">
                                Out of Stock
                            </span>
                        )}
                    </div>
                </div>

                <div className="mb-6 flex items-baseline gap-4">
                    <PriceDisplay
                        amount={product.base_price}
                        variant="large"
                        className="text-3xl"
                    />
                </div>

                <p className="mb-8 text-neutral-600 leading-relaxed">
                    {product.description}
                </p>

                <Separator className="mb-8" />

                {/* Admin Warning */}
                {isAdmin && (
                    <div className="mb-6 bg-orange-50 border border-orange-200 rounded-lg p-4 flex gap-3">
                        <AlertCircle className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
                        <div className="text-sm text-orange-900">
                            <p className="font-medium">Admin Access Detected</p>
                            <p className="text-xs mt-1">Checkout and cart features are for customers only. Please use a customer account to test the checkout flow.</p>
                        </div>
                    </div>
                )}

                <div className="mb-8 flex flex-col gap-4 sm:flex-row">
                    {/* Conditional: Add to Cart or Request Quote */}
                    {product.is_quote_only ? (
                        <QuoteModal product={product} />
                    ) : (
                        <>
                            {/* Quantity Selector */}
                            <div className="flex items-center rounded-md border border-neutral-300">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-10 w-10 rounded-none"
                                    onClick={() => handleQuantityChange(-1)}
                                    disabled={quantity <= 1 || isAdmin}
                                >
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <div className="flex h-10 w-12 items-center justify-center border-l border-r border-neutral-300 bg-neutral-50 font-medium">
                                    {quantity}
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-10 w-10 rounded-none"
                                    onClick={() => handleQuantityChange(1)}
                                    disabled={quantity >= product.stock_quantity || isAdmin}
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>

                            {/* Buy Now Button */}
                            <Button
                                size="lg"
                                className="flex-1 gap-2 text-base bg-orange-600 hover:bg-orange-700 text-white font-semibold"
                                disabled={product.stock_quantity === 0 || isBuyingNow || isAdmin}
                                onClick={handleBuyNow}
                                title={isAdmin ? "Admin accounts cannot buy" : "Buy now"}
                            >
                                {isBuyingNow ? (
                                    <>
                                        <Check className="h-5 w-5" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart className="h-5 w-5" />
                                        Buy Now
                                    </>
                                )}
                            </Button>

                            {/* Add to Cart Button */}
                            <Button
                                size="lg"
                                className="flex-1 gap-2 text-base bg-primary-600 hover:bg-primary-700 text-white font-semibold"
                                disabled={product.stock_quantity === 0 || isAdding || isAdmin}
                                onClick={handleAddToCart}
                                title={isAdmin ? "Admin accounts cannot add to cart" : "Add to cart"}
                            >
                                {isAdding ? (
                                    <>
                                        <Check className="h-5 w-5" />
                                        Added!
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart className="h-5 w-5" />
                                        Add to Cart
                                    </>
                                )}
                            </Button>

                            {/* Wishlist Button */}
                            <WishlistButton
                                productId={product.id}
                                isWishlisted={isWishlisted}
                            />
                        </>
                    )}
                </div>

            </div>
        </div>
    );
}

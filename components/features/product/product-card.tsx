"use client";

import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductImage } from "@/components/ui/product-image";
import { PriceDisplay } from "@/components/ui/price-display";
import { RatingDisplay } from "@/components/ui/rating-display";

interface ProductCardProps {
    product: Product;
    variant?: "default" | "compact" | "featured";
}

export function ProductCard({ product, variant = "default" }: ProductCardProps) {
    return (
        <div className="group relative flex flex-col overflow-hidden rounded-lg bg-white border shadow-sm transition-all hover:shadow-lg">
            <Link href={`/products/${product.slug}`} className="relative aspect-square overflow-hidden bg-neutral-100">
                <ProductImage
                    src={product.images[0]}
                    alt={product.name}
                    aspectRatio="square"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {product.salePrice && (
                    <Badge className="absolute left-2 top-2 bg-red-500 hover:bg-red-600">
                        Sale
                    </Badge>
                )}
                {!product.inStock && (
                    <Badge variant="destructive" className="absolute left-2 top-2">
                        Out of Stock
                    </Badge>
                )}
                {/* Wishlist Button */}
                <button className="absolute right-2 top-2 rounded-full bg-white/80 p-1.5 text-neutral-600 opacity-0 transition-opacity hover:bg-white hover:text-red-500 group-hover:opacity-100">
                    <Heart className="h-5 w-5" />
                    <span className="sr-only">Add to wishlist</span>
                </button>
            </Link>

            <div className="flex flex-1 flex-col p-4">
                <div className="mb-2">
                    <RatingDisplay rating={product.rating} reviewCount={product.reviewCount} showCount size="sm" />
                </div>
                <Link href={`/products/${product.slug}`} className="mb-2">
                    <h3 className="line-clamp-2 text-sm font-medium text-neutral-900 group-hover:text-primary-600">
                        {product.name}
                    </h3>
                </Link>
                <div className="mt-auto flex items-center justify-between">
                    <div className="flex flex-col">
                        {product.salePrice ? (
                            <>
                                <PriceDisplay amount={product.salePrice} variant="sale" />
                                <PriceDisplay amount={product.price} variant="original" />
                            </>
                        ) : (
                            <PriceDisplay amount={product.price} />
                        )}
                    </div>
                    <Button size="icon" disabled={!product.inStock}>
                        <ShoppingCart className="h-4 w-4" />
                        <span className="sr-only">Add to cart</span>
                    </Button>
                </div>
            </div>
        </div>
    );
}

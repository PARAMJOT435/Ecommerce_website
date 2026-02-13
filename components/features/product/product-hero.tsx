"use client";

import React, { useState } from "react";
import { ShoppingCart, Heart, Minus, Plus } from "lucide-react";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductImage } from "@/components/ui/product-image";
import { PriceDisplay } from "@/components/ui/price-display";
import { RatingDisplay } from "@/components/ui/rating-display";
import { CertificationBadge, CertificationType } from "@/components/ui/certification-badge";
import { Separator } from "@/components/ui/separator";

interface ProductHeroProps {
    product: Product;
}

export function ProductHero({ product }: ProductHeroProps) {
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);

    const handleQuantityChange = (delta: number) => {
        setQuantity((prev) => Math.max(1, prev + delta));
    };

    return (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
            {/* Product Images */}
            <div className="space-y-4">
                <ProductImage
                    src={product.images[selectedImage]}
                    alt={product.name}
                    aspectRatio="square"
                    className="rounded-2xl border"
                />
                {product.images.length > 1 && (
                    <div className="flex gap-4 overflow-x-auto pb-2">
                        {product.images.map((image, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedImage(index)}
                                className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 ${selectedImage === index
                                        ? "border-primary-600"
                                        : "border-transparent hover:border-neutral-300"
                                    }`}
                            >
                                <ProductImage
                                    src={image}
                                    alt={`${product.name} thumbnail ${index + 1}`}
                                    aspectRatio="square"
                                    className="object-cover"
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Product Details */}
            <div className="flex flex-col">
                <div className="mb-4">
                    <Badge variant="outline" className="mb-2 border-primary-200 bg-primary-50 text-primary-700">
                        {product.category}
                    </Badge>
                    <h1 className="font-heading text-3xl font-bold text-neutral-900 sm:text-4xl">
                        {product.name}
                    </h1>
                    <div className="mt-2 flex items-center gap-4">
                        <RatingDisplay rating={product.rating} reviewCount={product.reviewCount} showCount />
                        {product.inStock ? (
                            <span className="text-sm font-medium text-green-600">In Stock</span>
                        ) : (
                            <span className="text-sm font-medium text-red-600">Out of Stock</span>
                        )}
                    </div>
                </div>

                <div className="mb-6 flex items-baseline gap-4">
                    <PriceDisplay
                        amount={product.salePrice || product.price}
                        variant="large"
                        className="text-3xl"
                    />
                    {product.salePrice && (
                        <PriceDisplay amount={product.price} variant="original" className="text-xl" />
                    )}
                </div>

                <p className="mb-8 text-neutral-600 leading-relaxed">
                    {product.description}
                </p>

                <Separator className="mb-8" />

                <div className="mb-8 flex flex-col gap-4 sm:flex-row">
                    {/* Quantity Selector */}
                    <div className="flex items-center rounded-md border border-neutral-300">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 rounded-none"
                            onClick={() => handleQuantityChange(-1)}
                            disabled={quantity <= 1}
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
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>

                    <Button size="lg" className="flex-1 gap-2 text-base" disabled={!product.inStock}>
                        <ShoppingCart className="h-5 w-5" />
                        Add to Cart
                    </Button>

                    <Button variant="outline" size="lg" className="px-4">
                        <Heart className="h-5 w-5" />
                    </Button>
                </div>

                {/* Certifications */}
                {product.certifications && product.certifications.length > 0 && (
                    <div className="mt-auto">
                        <h4 className="mb-3 text-sm font-semibold text-neutral-900">Certifications</h4>
                        <div className="flex flex-wrap gap-4">
                            {product.certifications.map((cert) => (
                                <CertificationBadge key={cert} type={cert as CertificationType} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

"use client"

import React from "react"
import Link from "next/link"
import { ProductCard } from "@/components/features/product/product-card"
import { ProductWithImages } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface RelatedProductsProps {
    products: ProductWithImages[]
    currentProductId: string
    wishlistIds: string[]
}

export function RelatedProducts({ products, currentProductId, wishlistIds }: RelatedProductsProps) {
    // Filter out current product and limit to 4
    const relatedProducts = products
        .filter(p => p.id !== currentProductId && p.is_active)
        .slice(0, 4)

    if (relatedProducts.length === 0) {
        return null
    }

    return (
        <div className="mt-16">
            <h2 className="text-2xl font-heading font-bold text-neutral-900 mb-6">
                Related Products
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {relatedProducts.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        isWishlisted={wishlistIds.includes(product.id)}
                    />
                ))}
            </div>
        </div>
    )
}

"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { ProductWithImages } from "@/types"
import { ProductCard } from "@/components/features/product/product-card"
import { Button } from "@/components/ui/button"

interface ProductCategoryGridProps {
    products: ProductWithImages[]
    title: string
    description?: string
    categorySlug?: string
    wishlistIds?: string[]
}

export function ProductCategoryGrid({
    products,
    title,
    description,
    categorySlug,
    wishlistIds = [],
}: ProductCategoryGridProps) {
    // Show 3 products in grid, rest link to "View All"
    const displayedProducts = products.slice(0, 3)
    const hasMore = products.length > 3

    return (
        <section className="py-12">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-neutral-900">{title}</h2>
                    {description && (
                        <p className="text-neutral-600 text-sm mt-1">{description}</p>
                    )}
                </div>
                {categorySlug && hasMore && (
                    <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
                        <Link href={`/products?category=${categorySlug}`}>
                            View All <ArrowRight className="h-4 w-4 ml-1" />
                        </Link>
                    </Button>
                )}
            </div>

            {/* Grid - 3 columns on desktop, 2 on tablet, 1 on mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedProducts.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        isWishlisted={wishlistIds.includes(product.id)}
                    />
                ))}
                
                {/* "View All" card if there are more products */}
                {hasMore && (
                    <Link href={`/products?category=${categorySlug}`}>
                        <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-neutral-300 rounded-lg p-8 hover:border-primary-500 hover:bg-primary-50 transition-all group cursor-pointer">
                            <div className="text-center">
                                <div className="text-4xl font-bold text-neutral-400 mb-2 group-hover:text-primary-600 transition-colors">
                                    +{products.length - 3}
                                </div>
                                <p className="text-neutral-600 font-medium group-hover:text-primary-700">
                                    View All {products.length} Products
                                </p>
                                <p className="text-xs text-neutral-500 mt-2">
                                    Explore the full collection
                                </p>
                            </div>
                        </div>
                    </Link>
                )}
            </div>
        </section>
    )
}

"use client"

import { ProductWithImages } from "@/types"
import { ProductCategoryGrid } from "@/components/features/home/product-category-grid"
import { FeaturedShowcase } from "@/components/features/home/featured-showcase"
import { Container } from "@/components/ui/container"

interface ModernProductsShowcaseProps {
    productsByCategory: {
        categoryName: string
        categorySlug: string
        products: ProductWithImages[]
    }[]
    featuredProduct?: ProductWithImages
    wishlistIds: string[]
}

export function ModernProductsShowcase({
    productsByCategory,
    featuredProduct,
    wishlistIds,
}: ModernProductsShowcaseProps) {
    return (
        <div className="relative z-10 w-full bg-white">
            <Container>
                {/* Main Featured Showcase */}
                {featuredProduct && (
                    <div className="py-12 border-b border-neutral-200">
                        <FeaturedShowcase
                            product={featuredProduct}
                            badge="Best Seller"
                        />
                    </div>
                )}

                {/* Category Grids - 3 cards per category */}
                <div className="space-y-20 py-16">
                    {productsByCategory.map((category) => (
                        <div key={category.categorySlug}>
                            <ProductCategoryGrid
                                products={category.products}
                                title={category.categoryName}
                                description={`Explore our ${category.categoryName.toLowerCase()} collection`}
                                categorySlug={category.categorySlug}
                                wishlistIds={wishlistIds}
                            />
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    )
}

"use client"

import React, { useState } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import { ProductWithImages } from "@/types"
import { ProductCard } from "@/components/features/product/product-card"
import { Button } from "@/components/ui/button"

interface ProductCarouselProps {
    products: ProductWithImages[]
    title: string
    description?: string
    categorySlug?: string
    wishlistIds?: string[]
}

export function ProductCarousel({
    products,
    title,
    description,
    categorySlug,
    wishlistIds = [],
}: ProductCarouselProps) {
    const [scrollPosition, setScrollPosition] = useState(0)
    const scrollContainerRef = React.useRef<HTMLDivElement>(null)

    const scroll = (direction: "left" | "right") => {
        if (scrollContainerRef.current) {
            const scrollAmount = 400
            const newPosition =
                direction === "left"
                    ? Math.max(0, scrollPosition - scrollAmount)
                    : scrollPosition + scrollAmount

            scrollContainerRef.current.scrollTo({
                left: newPosition,
                behavior: "smooth",
            })
            setScrollPosition(newPosition)
        }
    }

    const canScrollLeft = scrollPosition > 0
    const canScrollRight = scrollPosition < (products.length - 4) * 300

    return (
        <section className="py-12">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 px-4 md:px-0">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-neutral-900">{title}</h2>
                    {description && (
                        <p className="text-neutral-600 text-sm mt-1">{description}</p>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    {/* Carousel Controls */}
                    <button
                        onClick={() => scroll("left")}
                        disabled={!canScrollLeft}
                        className="p-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                        onClick={() => scroll("right")}
                        disabled={!canScrollRight}
                        className="p-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>

                    {/* View All Button */}
                    {categorySlug && (
                        <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
                            <Link href={`/products?category=${categorySlug}`}>
                                View All <ArrowRight className="h-4 w-4 ml-1" />
                            </Link>
                        </Button>
                    )}
                </div>
            </div>

            {/* Carousel */}
            <div className="relative overflow-hidden">
                <div
                    ref={scrollContainerRef}
                    className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-4 md:px-0"
                    style={{ scrollBehavior: "smooth" }}
                >
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="shrink-0 w-64 md:w-72"
                        >
                            <ProductCard
                                product={product}
                                isWishlisted={wishlistIds.includes(product.id)}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { ProductWithImages } from "@/types"
import Image from "next/image"

interface FeaturedShowcaseProps {
    product: ProductWithImages
    badge?: string
}

export function FeaturedShowcase({ product, badge }: FeaturedShowcaseProps) {
    const mainImage = product.images?.[0]?.image_url

    return (
        <Link href={`/products/${product.slug}`}>
            <div className="relative group overflow-hidden rounded-lg bg-linear-to-br from-neutral-50 to-neutral-100 border border-neutral-200 hover:border-neutral-300 transition-all duration-300">
                {/* Layout: Image on right, content on left */}
                <div className="flex items-stretch min-h-80">
                    {/* Content Side */}
                    <div className="flex-1 p-8 flex flex-col justify-between bg-white">
                        {badge && (
                            <div className="inline-flex items-center gap-1 bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-xs font-semibold w-fit mb-3">
                                <span>⭐</span>
                                <span>{badge}</span>
                            </div>
                        )}

                        <div>
                            <h3 className="text-2xl font-bold text-neutral-900 mb-3 line-clamp-2">
                                {product.name}
                            </h3>
                            <p className="text-sm text-neutral-600 mb-4 line-clamp-3">
                                {product.short_description || product.description || "Premium quality industrial equipment"}
                            </p>
                        </div>

                        <div className="flex items-end justify-between">
                            <div className="text-3xl font-bold text-neutral-900">
                                ₹{product.base_price.toLocaleString('en-IN')}
                            </div>
                            <div className="flex items-center gap-1 text-primary-600 group-hover:translate-x-1 transition-transform">
                                <span className="text-sm font-semibold">View</span>
                                <ArrowRight className="h-4 w-4" />
                            </div>
                        </div>
                    </div>

                    {/* Image Side */}
                    <div className="flex-1 relative overflow-hidden bg-linear-to-br from-neutral-100 to-neutral-200 flex items-center justify-center p-8">
                        {mainImage ? (
                            <Image
                                src={mainImage}
                                alt={product.name}
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-contain group-hover:scale-110 transition-transform duration-300"
                                priority
                            />
                        ) : (
                            <div className="text-neutral-400 text-center">
                                <p className="text-sm">Image not available</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    )
}

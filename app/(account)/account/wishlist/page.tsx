import React from "react"
import Link from "next/link"
import { Heart, ShoppingCart, Trash2 } from "lucide-react"
import { getWishlist } from "@/app/actions/wishlist"
import { ProductImage } from "@/components/ui/product-image"
import { PriceDisplay } from "@/components/ui/price-display"
import { RemoveWishlistButton } from "./_components/remove-wishlist-button"

export const dynamic = 'force-dynamic'

export default async function WishlistPage() {
    const { items, error } = await getWishlist()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-heading font-bold text-neutral-900">Wishlist</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    {items.length} {items.length === 1 ? "item" : "items"} saved
                </p>
            </div>

            {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
                    {error}
                </div>
            )}

            {items.length === 0 ? (
                <div className="rounded-xl border border-neutral-200 bg-white py-16 text-center">
                    <Heart className="mx-auto h-12 w-12 text-neutral-300" />
                    <h3 className="mt-4 text-lg font-semibold text-neutral-900">Your wishlist is empty</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Browse products and tap the heart icon to save items here.
                    </p>
                    <Link
                        href="/products"
                        className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
                    >
                        Browse Products →
                    </Link>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                    {items.map((item: any) => {
                        const product = item.product
                        if (!product) return null
                        const mainImage = product.images?.[0]?.image_url

                        return (
                            <div key={item.id} className="flex gap-4 rounded-xl border bg-white p-4">
                                <Link href={`/products/${product.slug}`} className="shrink-0">
                                    <div className="h-24 w-24 rounded-lg overflow-hidden bg-neutral-100">
                                        <ProductImage
                                            src={mainImage}
                                            alt={product.name}
                                            aspectRatio="square"
                                            className="object-cover h-full w-full"
                                        />
                                    </div>
                                </Link>
                                <div className="flex flex-1 flex-col justify-between min-w-0">
                                    <div>
                                        <Link href={`/products/${product.slug}`}>
                                            <h3 className="text-sm font-medium text-neutral-900 hover:text-primary-600 truncate">
                                                {product.name}
                                            </h3>
                                        </Link>
                                        <PriceDisplay amount={product.base_price} className="mt-1" />
                                        <p className={`text-xs mt-1 ${product.stock_quantity > 0 ? "text-green-600" : "text-red-500"}`}>
                                            {product.stock_quantity > 0 ? "In Stock" : "Out of Stock"}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3 mt-2">
                                        <Link
                                            href={`/products/${product.slug}`}
                                            className="inline-flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700"
                                        >
                                            <ShoppingCart className="h-3.5 w-3.5" />
                                            View Product
                                        </Link>
                                        <RemoveWishlistButton productId={product.id} />
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

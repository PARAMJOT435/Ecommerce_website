"use client"

import React from "react"
import Link from "next/link"
import { ArrowLeft, ShoppingBag, Trash2 } from "lucide-react"
import { Container } from "@/components/ui/container"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useCartStore } from "@/stores/cart-store"
import { CartItemCard } from "@/components/features/cart/cart-item-card"
import { CartSummary } from "@/components/features/cart/cart-summary"

export default function CartPage() {
    const items = useCartStore((s) => s.items)
    const clearCart = useCartStore((s) => s.clearCart)
    const totalItems = useCartStore((s) => s.totalItems)

    if (items.length === 0) {
        return (
            <Container>
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100">
                        <ShoppingBag className="h-10 w-10 text-neutral-400" />
                    </div>
                    <h1 className="text-2xl font-heading font-bold text-neutral-900">
                        Your cart is empty
                    </h1>
                    <p className="mt-2 max-w-md text-muted-foreground">
                        Looks like you haven&apos;t added any products yet. Browse our collection
                        to find something you&apos;ll love!
                    </p>
                    <Button
                        className="mt-8 bg-primary-600 hover:bg-primary-700 text-white gap-2"
                        size="lg"
                        asChild
                    >
                        <Link href="/products">
                            <ArrowLeft className="h-4 w-4" />
                            Continue Shopping
                        </Link>
                    </Button>
                </div>
            </Container>
        )
    }

    return (
        <Container>
            <div className="py-8 md:py-12">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-heading font-bold text-neutral-900">
                            Shopping Cart
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {totalItems()} {totalItems() === 1 ? 'item' : 'items'} in your cart
                        </p>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 gap-2"
                        onClick={clearCart}
                    >
                        <Trash2 className="h-4 w-4" />
                        Clear Cart
                    </Button>
                </div>

                {/* Cart Grid */}
                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Items List */}
                    <div className="lg:col-span-2">
                        <div className="rounded-xl border border-neutral-200 bg-white">
                            <div className="divide-y divide-neutral-100 px-6">
                                {items.map((item) => (
                                    <CartItemCard
                                        key={`${item.productId}-${item.variantId}`}
                                        item={item}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Continue Shopping Link */}
                        <div className="mt-6">
                            <Button variant="ghost" className="gap-2 text-primary-600" asChild>
                                <Link href="/products">
                                    <ArrowLeft className="h-4 w-4" />
                                    Continue Shopping
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <CartSummary />
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    )
}

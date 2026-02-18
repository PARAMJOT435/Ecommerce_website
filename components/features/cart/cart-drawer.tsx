"use client"

import React from "react"
import Link from "next/link"
import { ShoppingBag, X } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useCartStore } from "@/stores/cart-store"
import { useUIStore } from "@/stores/ui-store"
import { CartItemCard } from "./cart-item-card"

export function CartDrawer() {
    const isCartOpen = useUIStore((s) => s.isCartOpen)
    const closeCart = useUIStore((s) => s.closeCart)
    const items = useCartStore((s) => s.items)
    const subtotal = useCartStore((s) => s.subtotal)
    const totalItems = useCartStore((s) => s.totalItems)

    return (
        <Sheet open={isCartOpen} onOpenChange={(open) => !open && closeCart()}>
            <SheetContent className="flex w-full flex-col sm:max-w-md p-0">
                <SheetHeader className="px-6 py-4 border-b">
                    <div className="flex items-center justify-between">
                        <SheetTitle className="flex items-center gap-2">
                            <ShoppingBag className="h-5 w-5" />
                            Cart ({totalItems()})
                        </SheetTitle>
                    </div>
                </SheetHeader>

                {items.length === 0 ? (
                    /* Empty State */
                    <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
                            <ShoppingBag className="h-8 w-8 text-neutral-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-neutral-900">Your cart is empty</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Add some products to get started
                        </p>
                        <Button
                            className="mt-6 bg-primary-600 hover:bg-primary-700 text-white"
                            onClick={closeCart}
                            asChild
                        >
                            <Link href="/products">Browse Products</Link>
                        </Button>
                    </div>
                ) : (
                    <>
                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto px-6">
                            <div className="divide-y divide-neutral-100">
                                {items.map((item) => (
                                    <CartItemCard
                                        key={`${item.productId}-${item.variantId}`}
                                        item={item}
                                        compact
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="border-t px-6 py-4 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-base font-medium text-neutral-600">Subtotal</span>
                                <span className="text-lg font-bold text-neutral-900">
                                    ₹{subtotal().toFixed(2)}
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Shipping & taxes calculated at checkout
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                                <Button variant="outline" onClick={closeCart} asChild>
                                    <Link href="/cart">View Cart</Link>
                                </Button>
                                <Button
                                    className="bg-primary-600 hover:bg-primary-700 text-white"
                                    onClick={closeCart}
                                    asChild
                                >
                                    <Link href="/checkout">Checkout</Link>
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </SheetContent>
        </Sheet>
    )
}

"use client"

import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useCartStore } from "@/stores/cart-store"
import { ShieldCheck, Truck, RotateCcw } from "lucide-react"

export function CartSummary() {
    const subtotal = useCartStore((s) => s.subtotal)
    const totalItems = useCartStore((s) => s.totalItems)

    const shipping = subtotal() >= 499 ? 0 : 49
    const tax = Math.round(subtotal() * 0.18 * 100) / 100 // 18% GST
    const total = subtotal() + shipping + tax

    return (
        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-neutral-900">Order Summary</h3>

            <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600">Subtotal ({totalItems()} items)</span>
                    <span className="font-medium">₹{subtotal().toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600">Shipping</span>
                    <span className="font-medium">
                        {shipping === 0 ? (
                            <span className="text-green-600">Free</span>
                        ) : (
                            `₹${shipping.toFixed(2)}`
                        )}
                    </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600">Estimated Tax (GST 18%)</span>
                    <span className="font-medium">₹{tax.toFixed(2)}</span>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                    <span className="text-base font-semibold text-neutral-900">Total</span>
                    <span className="text-xl font-bold text-neutral-900">₹{total.toFixed(2)}</span>
                </div>
            </div>

            {shipping > 0 && (
                <p className="mt-3 text-xs text-primary-600">
                    Add ₹{(499 - subtotal()).toFixed(2)} more for free shipping!
                </p>
            )}

            <Button
                className="mt-6 w-full bg-primary-600 hover:bg-primary-700 text-white text-base py-6"
                asChild
            >
                <Link href="/checkout">Proceed to Checkout</Link>
            </Button>

            {/* Trust Indicators */}
            <div className="mt-6 space-y-3">
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <ShieldCheck className="h-4 w-4 text-green-500" />
                    <span>Secure checkout</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <Truck className="h-4 w-4 text-blue-500" />
                    <span>Free shipping on orders over ₹499</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <RotateCcw className="h-4 w-4 text-orange-500" />
                    <span>Easy 7-day returns</span>
                </div>
            </div>
        </div>
    )
}

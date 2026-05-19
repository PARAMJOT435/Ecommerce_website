"use client"

import React, { useState } from "react"
import Image from "next/image"
import { Minus, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCartStore, type CartItem } from "@/stores/cart-store"
import {
    Sheet,
    SheetContent,
} from "@/components/ui/sheet"

interface CartItemCardProps {
    item: CartItem
    compact?: boolean
}

export function CartItemCard({ item, compact = false }: CartItemCardProps) {
    const updateQuantity = useCartStore((s) => s.updateQuantity)
    const removeItem = useCartStore((s) => s.removeItem)
    const [showRemoveConfirm, setShowRemoveConfirm] = useState(false)

    const handleRemoveClick = () => {
        setShowRemoveConfirm(true)
    }

    const handleRemoveConfirm = () => {
        setShowRemoveConfirm(false)
        removeItem(item.productId, item.variantId)
    }

    return (
        <div className="flex gap-4 py-4">
            {/* Image */}
            <div className={`relative overflow-hidden rounded-lg bg-neutral-100 flex-shrink-0 ${compact ? 'h-16 w-16' : 'h-20 w-20'}`}>
                {item.image ? (
                    <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-neutral-400 text-xs">
                        No img
                    </div>
                )}
            </div>

            {/* Details */}
            <div className="flex flex-1 flex-col justify-between min-w-0">
                <div>
                    <h4 className="font-medium text-sm text-neutral-900 truncate">{item.name}</h4>
                    <p className="text-sm text-primary-600 font-semibold mt-0.5">
                        ₹{item.price.toFixed(2)}
                    </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1 rounded-md border border-neutral-200">
                        <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variantId)}
                            className="flex h-7 w-7 items-center justify-center hover:bg-neutral-50 transition-colors"
                            aria-label="Decrease quantity"
                        >
                            <Minus className="h-3 w-3" />
                        </button>
                        <span className="flex h-7 w-8 items-center justify-center text-sm font-medium">
                            {item.quantity}
                        </span>
                        <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variantId)}
                            disabled={item.quantity >= item.maxStock}
                            className="flex h-7 w-7 items-center justify-center hover:bg-neutral-50 transition-colors disabled:opacity-40"
                            aria-label="Increase quantity"
                        >
                            <Plus className="h-3 w-3" />
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-neutral-900">
                            ₹{(item.price * item.quantity).toFixed(2)}
                        </span>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-neutral-400 hover:text-red-500"
                            onClick={handleRemoveClick}
                            aria-label={`Remove ${item.name} from cart`}
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                </div>
            </div>

            {showRemoveConfirm && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg space-y-4">
                        <h2 className="text-lg font-semibold">Remove Item?</h2>
                        <p className="text-sm text-muted-foreground">
                            Are you sure you want to remove <strong>{item.name}</strong> from your cart?
                        </p>
                        <div className="flex gap-2 justify-end">
                            <Button variant="outline" onClick={() => setShowRemoveConfirm(false)}>Keep Item</Button>
                            <Button
                                onClick={handleRemoveConfirm}
                                className="bg-red-600 hover:bg-red-700 text-white"
                            >
                                Remove
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

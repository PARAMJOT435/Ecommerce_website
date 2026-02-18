"use client"

import { useState, useTransition } from "react"
import { Trash2 } from "lucide-react"
import { removeFromWishlist } from "@/app/actions/wishlist"
import { toast } from "sonner"

export function RemoveWishlistButton({ productId }: { productId: string }) {
    const [isPending, startTransition] = useTransition()

    function handleRemove() {
        startTransition(async () => {
            const result = await removeFromWishlist(productId)
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success("Removed from wishlist")
            }
        })
    }

    return (
        <button
            onClick={handleRemove}
            disabled={isPending}
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-red-500 disabled:opacity-50"
        >
            <Trash2 className="h-3.5 w-3.5" />
            Remove
        </button>
    )
}

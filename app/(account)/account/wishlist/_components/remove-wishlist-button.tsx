"use client"

import { useState, useTransition } from "react"
import { Trash2 } from "lucide-react"
import { removeFromWishlist } from "@/app/actions/wishlist"
import { toast } from "sonner"
import {
    Sheet,
    SheetContent,
} from "@/components/ui/sheet"

export function RemoveWishlistButton({ productId }: { productId: string }) {
    const [isPending, startTransition] = useTransition()
    const [showConfirm, setShowConfirm] = useState(false)

    function handleRemoveConfirm() {
        setShowConfirm(false)
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
        <>
            <button
                onClick={() => setShowConfirm(true)}
                disabled={isPending}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-red-500 disabled:opacity-50"
            >
                <Trash2 className="h-3.5 w-3.5" />
                Remove
            </button>

            {showConfirm && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg space-y-4">
                        <h2 className="text-lg font-semibold">Remove from Wishlist?</h2>
                        <p className="text-sm text-muted-foreground">Are you sure you want to remove this item from your wishlist?</p>
                        <div className="flex gap-2 justify-end">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="px-3 py-2 text-sm rounded border border-neutral-300 hover:bg-neutral-50"
                            >
                                Keep Item
                            </button>
                            <button
                                onClick={handleRemoveConfirm}
                                disabled={isPending}
                                className="px-3 py-2 text-sm rounded bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
                            >
                                {isPending ? "Removing..." : "Remove"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

"use client"

import { useState, useTransition } from "react"
import { Heart } from "lucide-react"
import { toggleWishlistItem } from "@/app/actions/wishlist"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface WishlistButtonProps {
    productId: string
    isWishlisted?: boolean
    variant?: "icon" | "card-overlay"
    className?: string
}

export function WishlistButton({
    productId,
    isWishlisted = false,
    variant = "icon",
    className,
}: WishlistButtonProps) {
    const [wishlisted, setWishlisted] = useState(isWishlisted)
    const [isPending, startTransition] = useTransition()

    function handleToggle(e: React.MouseEvent) {
        e.preventDefault()
        e.stopPropagation()

        startTransition(async () => {
            const result = await toggleWishlistItem(productId)
            if (result.error === 'Not authenticated') {
                toast.error("Please sign in to add items to your wishlist")
                return
            }
            if (result.error) {
                toast.error(result.error)
                return
            }
            setWishlisted(result.added)
            toast.success(result.added ? "Added to wishlist" : "Removed from wishlist")
        })
    }

    if (variant === "card-overlay") {
        return (
            <button
                onClick={handleToggle}
                disabled={isPending}
                className={cn(
                    "absolute right-2 top-2 rounded-full bg-white/80 p-1.5 transition-all hover:bg-white z-10",
                    wishlisted ? "text-red-500 opacity-100" : "text-neutral-600 opacity-0 group-hover:opacity-100 hover:text-red-500",
                    isPending && "opacity-50",
                    className
                )}
            >
                <Heart className={cn("h-5 w-5", wishlisted && "fill-current")} />
                <span className="sr-only">{wishlisted ? "Remove from" : "Add to"} wishlist</span>
            </button>
        )
    }

    return (
        <button
            onClick={handleToggle}
            disabled={isPending}
            className={cn(
                "inline-flex items-center gap-1.5 text-sm font-medium transition-colors",
                wishlisted ? "text-red-500" : "text-muted-foreground hover:text-red-500",
                isPending && "opacity-50",
                className
            )}
        >
            <Heart className={cn("h-4 w-4", wishlisted && "fill-current")} />
            {wishlisted ? "In Wishlist" : "Add to Wishlist"}
        </button>
    )
}

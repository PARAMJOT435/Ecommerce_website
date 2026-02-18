"use client"

import { useState } from "react"
import { cancelOrder } from "@/app/actions/account"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { X } from "lucide-react"

interface CancelOrderButtonProps {
    orderId: string
    status: string
}

const CANCELLABLE = ["pending", "processing", "confirmed"]

export function CancelOrderButton({ orderId, status }: CancelOrderButtonProps) {
    const [loading, setLoading] = useState(false)
    const [confirming, setConfirming] = useState(false)

    if (!CANCELLABLE.includes(status)) return null

    async function handleCancel() {
        if (!confirming) {
            setConfirming(true)
            return
        }

        setLoading(true)
        const result = await cancelOrder(orderId)
        setLoading(false)

        if (result.error) {
            toast.error(result.error)
            setConfirming(false)
        } else {
            toast.success("Order cancelled successfully")
        }
    }

    return (
        <div className="flex items-center gap-2">
            {confirming && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setConfirming(false)}
                    disabled={loading}
                    className="text-xs"
                >
                    No, keep it
                </Button>
            )}
            <Button
                variant={confirming ? "destructive" : "outline"}
                size="sm"
                onClick={handleCancel}
                disabled={loading}
                className="text-xs gap-1"
            >
                <X className="h-3 w-3" />
                {loading ? "Cancelling..." : confirming ? "Yes, cancel order" : "Cancel Order"}
            </Button>
        </div>
    )
}

"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { deleteOrder } from "@/app/actions/admin-orders"
import { toast } from "sonner"

export function DeleteOrderButton({ orderId }: { orderId: string }) {
    const [confirming, setConfirming] = useState(false)
    const [loading, setLoading] = useState(false)

    async function handleDelete() {
        if (!confirming) {
            setConfirming(true)
            return
        }

        setLoading(true)
        const result = await deleteOrder(orderId)
        setLoading(false)

        if (result.error) {
            toast.error(result.error)
            setConfirming(false)
        } else {
            toast.success("Order deleted")
        }
    }

    if (confirming) {
        return (
            <div className="flex items-center gap-1">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setConfirming(false)}
                    disabled={loading}
                    className="text-xs h-8 px-2"
                >
                    No
                </Button>
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDelete}
                    disabled={loading}
                    className="text-xs h-8 px-2"
                >
                    {loading ? "..." : "Yes, delete"}
                </Button>
            </div>
        )
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            className="text-muted-foreground hover:text-red-600"
            title="Delete order"
        >
            <Trash2 className="h-4 w-4" />
        </Button>
    )
}

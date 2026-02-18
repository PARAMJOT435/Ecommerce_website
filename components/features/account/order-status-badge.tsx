import React from "react"
import { Badge } from "@/components/ui/badge"

type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded"

const STATUS_CONFIG: Record<OrderStatus, { label: string; className: string }> = {
    pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
    processing: { label: "Processing", className: "bg-blue-100 text-blue-800 border-blue-200" },
    shipped: { label: "Shipped", className: "bg-purple-100 text-purple-800 border-purple-200" },
    delivered: { label: "Delivered", className: "bg-green-100 text-green-800 border-green-200" },
    cancelled: { label: "Cancelled", className: "bg-red-100 text-red-800 border-red-200" },
    refunded: { label: "Refunded", className: "bg-neutral-100 text-neutral-800 border-neutral-200" },
}

interface OrderStatusBadgeProps {
    status: string
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
    const config = STATUS_CONFIG[status as OrderStatus] || STATUS_CONFIG.pending

    return (
        <Badge variant="outline" className={`text-xs font-medium ${config.className}`}>
            {config.label}
        </Badge>
    )
}

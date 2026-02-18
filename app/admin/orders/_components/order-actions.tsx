"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateOrderStatus, addShipmentTracking } from "@/app/actions/admin-orders"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Truck } from "lucide-react"

const STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "processing", label: "Processing" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
    { value: "refunded", label: "Refunded" },
]

interface OrderActionsProps {
    orderId: string
    currentStatus: string
    shipment: { carrier?: string; tracking_number?: string } | null
}

export function OrderActions({ orderId, currentStatus, shipment }: OrderActionsProps) {
    const router = useRouter()
    const [status, setStatus] = useState(currentStatus)
    const [updating, setUpdating] = useState(false)

    const [carrier, setCarrier] = useState(shipment?.carrier || "")
    const [tracking, setTracking] = useState(shipment?.tracking_number || "")
    const [savingTracking, setSavingTracking] = useState(false)

    const handleStatusUpdate = async () => {
        if (status === currentStatus) return
        setUpdating(true)
        const { error } = await updateOrderStatus(orderId, status)
        setUpdating(false)
        if (error) {
            toast.error(error)
        } else {
            toast.success(`Status updated to ${status}`)
            router.refresh()
        }
    }

    const handleTrackingSave = async () => {
        if (!carrier.trim() || !tracking.trim()) {
            toast.error("Please enter both carrier and tracking number")
            return
        }
        setSavingTracking(true)
        const { error } = await addShipmentTracking(orderId, carrier, tracking)
        setSavingTracking(false)
        if (error) {
            toast.error(error)
        } else {
            toast.success("Tracking info saved")
            router.refresh()
        }
    }

    const isTerminal = currentStatus === "delivered" || currentStatus === "cancelled" || currentStatus === "refunded"

    return (
        <div className="space-y-6">
            {/* Status Update */}
            <div className="rounded-lg border border-neutral-200 p-4">
                <h3 className="text-sm font-semibold mb-3">Update Status</h3>
                <div className="flex gap-2">
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        disabled={isTerminal}
                        className="flex-1 rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        {STATUS_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                    <Button
                        onClick={handleStatusUpdate}
                        disabled={updating || status === currentStatus || isTerminal}
                        size="sm"
                    >
                        {updating ? "Updating..." : "Update"}
                    </Button>
                </div>
                {isTerminal && (
                    <p className="text-xs text-muted-foreground mt-2">
                        This order is in a terminal state and cannot be updated.
                    </p>
                )}
            </div>

            {/* Shipment Tracking */}
            <div className="rounded-lg border border-neutral-200 p-4">
                <div className="flex items-center gap-2 mb-3">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-semibold">Shipment Tracking</h3>
                </div>
                <div className="space-y-3">
                    <div>
                        <Label htmlFor="carrier" className="text-xs">Carrier</Label>
                        <Input
                            id="carrier"
                            value={carrier}
                            onChange={(e) => setCarrier(e.target.value)}
                            placeholder="e.g. Delhivery, BlueDart"
                        />
                    </div>
                    <div>
                        <Label htmlFor="tracking" className="text-xs">Tracking Number</Label>
                        <Input
                            id="tracking"
                            value={tracking}
                            onChange={(e) => setTracking(e.target.value)}
                            placeholder="Tracking ID"
                        />
                    </div>
                    <Button
                        onClick={handleTrackingSave}
                        disabled={savingTracking}
                        size="sm"
                        className="w-full"
                    >
                        {savingTracking ? "Saving..." : "Save Tracking"}
                    </Button>
                </div>
            </div>
        </div>
    )
}

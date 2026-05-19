"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronDown, MapPin, CreditCard, Package } from "lucide-react"
import { OrderStatusBadge } from "./order-status-badge"
import { Button } from "@/components/ui/button"
import { ReviewModal } from "@/components/features/reviews/review-modal"
import { checkUserReview } from "@/app/actions/reviews"

interface OrderItem {
    id: string
    product_id: string
    product_name: string
    quantity: number
    unit_price: number
    total_price: number
    product?: {
        slug: string
    }
}

interface OrderCardProps {
    order: {
        id: string
        order_number: string
        created_at: string
        total: number
        status: string
        items: OrderItem[]
        shipping_address?: {
            full_name: string
            address_line1: string
            address_line2?: string
            city: string
            state: string
            postal_code: string
        } | null
        payment?: Array<{
            payment_method: string
        }> | null
    }
}

export function OrderCard({ order }: OrderCardProps) {
    const [expanded, setExpanded] = useState(false)
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null)
    const [reviewedProducts, setReviewedProducts] = useState<Set<string>>(new Set())
    const [isLoadingReviews, setIsLoadingReviews] = useState(true)
    
    const isDelivered = order.status === 'delivered'

    const paymentMethod = order.payment?.[0]?.payment_method
    const shippingAddress = order.shipping_address

    // Check which products user has already reviewed
    useEffect(() => {
        const checkReviews = async () => {
            if (!isDelivered || !order.items) return

            setIsLoadingReviews(true)
            const reviewed = new Set<string>()

            for (const item of order.items) {
                const { hasReviewed } = await checkUserReview(item.product_id)
                if (hasReviewed) {
                    reviewed.add(item.product_id)
                }
            }

            setReviewedProducts(reviewed)
            setIsLoadingReviews(false)
        }

        checkReviews()
    }, [isDelivered, order.items])

    return (
        <>
            <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden hover:shadow-md transition-shadow">
                {/* Order Header - Click to expand */}
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="w-full text-left hover:bg-neutral-50 transition-colors"
                >
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b px-6 py-4">
                        <div className="flex items-center gap-6 flex-1 min-w-0">
                            <div>
                                <p className="text-xs text-muted-foreground">Order Number</p>
                                <p className="text-sm font-semibold text-neutral-900 font-mono">
                                    {order.order_number || `#${order.id.slice(0, 8)}`}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Date</p>
                                <p className="text-sm font-medium">
                                    {new Date(order.created_at).toLocaleDateString('en-IN', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                    })}
                                </p>
                            </div>
                            <div className="hidden sm:block">
                                <p className="text-xs text-muted-foreground">Total</p>
                                <p className="text-sm font-semibold">₹{Number(order.total).toFixed(2)}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <OrderStatusBadge status={order.status} />
                            <ChevronDown
                                className={`h-5 w-5 text-neutral-400 transition-transform ${
                                    expanded ? 'rotate-180' : ''
                                }`}
                            />
                        </div>
                    </div>
                </button>

                {/* Order Items - Always visible */}
                <div className="divide-y divide-neutral-50 px-6">
                    {order.items?.map((item) => (
                        <Link
                            key={item.id}
                            href={`/products/${item.product?.slug}`}
                            className="flex items-center justify-between py-3 hover:bg-neutral-50 transition-colors group"
                        >
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-neutral-900 group-hover:text-primary-600 truncate">
                                    {item.product_name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Qty: {item.quantity} × ₹{Number(item.unit_price).toFixed(2)}
                                </p>
                            </div>
                            <span className="text-sm font-semibold ml-4 shrink-0">
                                ₹{Number(item.total_price).toFixed(2)}
                            </span>
                        </Link>
                    ))}
                </div>

                {/* Expanded Details */}
                {expanded && (
                    <div className="border-t bg-neutral-50 px-6 py-4 space-y-4">
                        {/* Shipping Address */}
                        {shippingAddress && (
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm font-semibold text-neutral-900">
                                    <MapPin className="h-4 w-4" />
                                    Shipping Address
                                </div>
                                <div className="ml-6 text-sm text-neutral-600 space-y-1">
                                    <p>{shippingAddress.full_name}</p>
                                    <p>{shippingAddress.address_line1}</p>
                                    {shippingAddress.address_line2 && <p>{shippingAddress.address_line2}</p>}
                                    <p>
                                        {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postal_code}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Payment Method */}
                        {paymentMethod && (
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm font-semibold text-neutral-900">
                                    <CreditCard className="h-4 w-4" />
                                    Payment Method
                                </div>
                                <p className="ml-6 text-sm text-neutral-600 capitalize">{paymentMethod}</p>
                            </div>
                        )}

                        {/* Review Button - Only for delivered orders and unreviewed products */}
                        {isDelivered && (
                            <div className="pt-2 border-t">
                                <div className="flex items-center gap-2 text-sm font-semibold text-neutral-900 mb-3">
                                    <Package className="h-4 w-4" />
                                    Leave a Review
                                </div>
                                <div className="ml-6 space-y-2">
                                    {isLoadingReviews ? (
                                        <p className="text-xs text-neutral-600">Loading review status...</p>
                                    ) : (
                                        <>
                                            {order.items?.map((item) => {
                                                const hasReviewed = reviewedProducts.has(item.product_id)
                                                return (
                                                    <Button
                                                        key={item.id}
                                                        variant={hasReviewed ? "secondary" : "outline"}
                                                        size="sm"
                                                        onClick={() => !hasReviewed && setSelectedProductId(item.product_id)}
                                                        disabled={hasReviewed}
                                                        className="w-full text-left justify-start text-xs"
                                                    >
                                                        {hasReviewed ? '✓ Reviewed' : 'Review'}: {item.product_name}
                                                    </Button>
                                                )
                                            })}
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Review Modal */}
            {selectedProductId && (
                <ReviewModal
                    productId={selectedProductId}
                    isOpen={!!selectedProductId}
                    onClose={() => setSelectedProductId(null)}
                />
            )}
        </>
    )
}

import React from "react"
import Link from "next/link"
import { Package, ArrowRight } from "lucide-react"
import { getOrders } from "@/app/actions/account"
import { OrderStatusBadge } from "@/components/features/account/order-status-badge"
import { CancelOrderButton } from "@/components/features/account/cancel-order-button"

export const dynamic = 'force-dynamic'

export default async function OrdersPage() {
    const { orders, error } = await getOrders()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-heading font-bold text-neutral-900">Orders</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    View and track all your orders
                </p>
            </div>

            {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
                    {error}
                </div>
            )}

            {orders.length === 0 ? (
                <div className="rounded-xl border border-neutral-200 bg-white py-16 text-center">
                    <Package className="mx-auto h-12 w-12 text-neutral-300" />
                    <h3 className="mt-4 text-lg font-semibold text-neutral-900">No orders yet</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        When you place orders, they&apos;ll appear here.
                    </p>
                    <Link
                        href="/products"
                        className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
                    >
                        Browse Products
                        <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order: any) => (
                        <div key={order.id} className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
                            {/* Order Header */}
                            <div className="flex flex-wrap items-center justify-between gap-4 border-b px-6 py-4 bg-neutral-50">
                                <div className="flex items-center gap-6">
                                    <div>
                                        <p className="text-xs text-muted-foreground">Order Number</p>
                                        <p className="text-sm font-semibold text-neutral-900">
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
                                    <div>
                                        <p className="text-xs text-muted-foreground">Total</p>
                                        <p className="text-sm font-semibold">₹{Number(order.total).toFixed(2)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CancelOrderButton orderId={order.id} status={order.status} />
                                    <OrderStatusBadge status={order.status} />
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="divide-y divide-neutral-50 px-6">
                                {order.items?.map((item: any) => (
                                    <div key={item.id} className="flex items-center justify-between py-3">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-neutral-900 truncate">
                                                {item.product_name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Qty: {item.quantity} × ₹{Number(item.unit_price).toFixed(2)}
                                            </p>
                                        </div>
                                        <span className="text-sm font-semibold ml-4">
                                            ₹{Number(item.total_price).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Payment Info */}
                            {order.payment && order.payment.length > 0 && (
                                <div className="border-t px-6 py-3 bg-neutral-50">
                                    <p className="text-xs text-muted-foreground">
                                        Payment: <span className="capitalize">{order.payment[0].payment_method}</span> —{' '}
                                        <span className="capitalize">{order.payment[0].status}</span>
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

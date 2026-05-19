import React from "react"
import Link from "next/link"
import { Package, ArrowRight } from "lucide-react"
import { getOrders } from "@/app/actions/account"
import { OrderCard } from "@/components/features/account/order-card"
import { CancelOrderButton } from "@/components/features/account/cancel-order-button"

export const dynamic = 'force-dynamic'

export default async function OrdersPage() {
    const { orders, error } = await getOrders()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-heading font-bold text-neutral-900">Orders</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    View and track all your orders. Click to expand for details and leave reviews.
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
                        <div key={order.id} className="flex gap-3 items-start">
                            <div className="flex-1">
                                <OrderCard order={order} />
                            </div>
                            <div className="shrink-0 pt-6">
                                <CancelOrderButton orderId={order.id} status={order.status} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

import React, { Suspense } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, ListOrdered } from "lucide-react"
import { getAdminOrders } from "@/app/actions/admin-orders"
import { OrderFilters } from "./_components/order-filters"
import { DeleteOrderButton } from "./_components/delete-order-button"

export const dynamic = 'force-dynamic'

const STATUS_COLORS: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    refunded: "bg-neutral-100 text-neutral-800",
}

interface AdminOrdersPageProps {
    searchParams: Promise<{ status?: string; search?: string; page?: string }>
}

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
    const params = await searchParams
    const status = params.status || "all"
    const search = params.search || ""
    const page = parseInt(params.page || "1")

    const { orders, total, error } = await getAdminOrders(status, search, page)

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-xl font-bold sm:text-2xl tracking-tight">Orders</h1>
                <span className="text-xs sm:text-sm text-muted-foreground">{total} total</span>
            </div>

            <Suspense fallback={<div className="text-sm">Loading filters...</div>}>
                <OrderFilters />
            </Suspense>

            {error && (
                <div className="rounded-md bg-red-50 border border-red-200 p-3 text-xs sm:text-sm text-red-700">
                    {error}
                </div>
            )}

            {/* Mobile: Card View | Desktop: Table View */}
            <div className="block md:hidden">
                <div className="space-y-3">
                    {orders.map((order: any) => {
                        const customerName = order.user
                            ? `${order.user.first_name || ""} ${order.user.last_name || ""}`.trim() || order.user.email
                            : "Unknown"

                        return (
                            <div key={order.id} className="border rounded-lg p-3 space-y-2">
                                <div className="flex items-start justify-between">
                                    <div className="min-w-0">
                                        <Link href={`/admin/orders/${order.id}`} className="font-mono text-xs font-medium hover:underline text-primary-600">
                                            {order.order_number}
                                        </Link>
                                        <p className="text-xs text-muted-foreground">{customerName}</p>
                                    </div>
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize shrink-0 ${STATUS_COLORS[order.status] || "bg-neutral-100 text-neutral-800"}`}>
                                        {order.status}
                                    </span>
                                </div>
                                <div className="text-xs space-y-1 pt-2 border-t">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Date:</span>
                                        <span>{new Date(order.created_at).toLocaleDateString("en-IN", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        })}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Items:</span>
                                        <span>{order.items?.length || 0}</span>
                                    </div>
                                    <div className="flex justify-between font-semibold">
                                        <span>Total:</span>
                                        <span>₹{parseFloat(order.total).toFixed(2)}</span>
                                    </div>
                                </div>
                                <div className="flex gap-1 pt-2 border-t">
                                    <Button variant="ghost" size="sm" asChild className="flex-1">
                                        <Link href={`/admin/orders/${order.id}`}>
                                            <Eye className="h-3 w-3 mr-1" />
                                            View
                                        </Link>
                                    </Button>
                                    <DeleteOrderButton orderId={order.id} />
                                </div>
                            </div>
                        )
                    })}
                    {orders.length === 0 && (
                        <div className="text-center py-8">
                            <ListOrdered className="mx-auto h-10 w-10 text-neutral-300 mb-2" />
                            <p className="text-xs sm:text-sm text-muted-foreground">No orders found</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Desktop: Table View */}
            <div className="hidden md:block border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-xs sm:text-sm">Order</TableHead>
                                <TableHead className="text-xs sm:text-sm">Customer</TableHead>
                                <TableHead className="text-xs sm:text-sm">Date</TableHead>
                                <TableHead className="text-xs sm:text-sm">Items</TableHead>
                                <TableHead className="text-xs sm:text-sm">Total</TableHead>
                                <TableHead className="text-xs sm:text-sm">Status</TableHead>
                                <TableHead className="text-right text-xs sm:text-sm">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((order: any) => {
                                const customerName = order.user
                                    ? `${order.user.first_name || ""} ${order.user.last_name || ""}`.trim() || order.user.email
                                    : "Unknown"

                                return (
                                    <TableRow key={order.id}>
                                        <TableCell className="font-mono text-xs sm:text-sm font-medium">
                                            {order.order_number}
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="text-xs sm:text-sm font-medium">{customerName}</p>
                                                {order.shipping_address && (
                                                    <p className="text-xs text-muted-foreground">
                                                        {order.shipping_address.city}, {order.shipping_address.state}
                                                    </p>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-xs sm:text-sm text-muted-foreground">
                                            {new Date(order.created_at).toLocaleDateString("en-IN", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </TableCell>
                                        <TableCell className="text-xs sm:text-sm">
                                            {order.items?.length || 0}
                                        </TableCell>
                                        <TableCell className="text-xs sm:text-sm font-semibold">
                                            ₹{parseFloat(order.total).toFixed(2)}
                                        </TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[order.status] || "bg-neutral-100 text-neutral-800"}`}>
                                                {order.status}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right py-2">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link href={`/admin/orders/${order.id}`}>
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <DeleteOrderButton orderId={order.id} />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                            {orders.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-12">
                                        <ListOrdered className="mx-auto h-10 w-10 text-neutral-300 mb-2" />
                                        <p className="text-xs sm:text-sm text-muted-foreground">No orders found</p>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}

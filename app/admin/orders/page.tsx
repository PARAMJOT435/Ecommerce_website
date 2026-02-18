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
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
                <span className="text-sm text-muted-foreground">{total} total</span>
            </div>

            <Suspense fallback={<div>Loading filters...</div>}>
                <OrderFilters />
            </Suspense>

            {error && (
                <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Items</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map((order: any) => {
                            const customerName = order.user
                                ? `${order.user.first_name || ""} ${order.user.last_name || ""}`.trim() || order.user.email
                                : "Unknown"

                            return (
                                <TableRow key={order.id}>
                                    <TableCell className="font-mono text-sm font-medium">
                                        {order.order_number}
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <p className="text-sm font-medium">{customerName}</p>
                                            {order.shipping_address && (
                                                <p className="text-xs text-muted-foreground">
                                                    {order.shipping_address.city}, {order.shipping_address.state}
                                                </p>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {new Date(order.created_at).toLocaleDateString("en-IN", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </TableCell>
                                    <TableCell className="text-sm">
                                        {order.items?.length || 0}
                                    </TableCell>
                                    <TableCell className="font-semibold">
                                        ₹{parseFloat(order.total).toFixed(2)}
                                    </TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[order.status] || "bg-neutral-100 text-neutral-800"}`}>
                                            {order.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button variant="ghost" size="icon" asChild>
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
                                    <p className="text-sm text-muted-foreground">No orders found</p>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

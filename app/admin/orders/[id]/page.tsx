import React from "react"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { ArrowLeft, User, MapPin, CreditCard, Package, Truck, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { getAdminOrderById } from "@/app/actions/admin-orders"
import { OrderActions } from "../_components/order-actions"

export const dynamic = 'force-dynamic'

const STATUS_COLORS: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    refunded: "bg-neutral-100 text-neutral-800",
}

interface OrderDetailPageProps {
    params: Promise<{ id: string }>
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
    const { id } = await params
    const { order, shipment, payment, error } = await getAdminOrderById(id)

    if (!order || error) {
        notFound()
    }

    const customer = order.user as any
    const address = order.shipping_address as any
    const items = (order.items || []) as any[]

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/orders"><ArrowLeft className="h-4 w-4" /></Link>
                </Button>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold tracking-tight font-mono">{order.order_number}</h1>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(order.created_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </p>
                </div>
                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium capitalize ${STATUS_COLORS[order.status] || ""}`}>
                    {order.status}
                </span>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                {/* Main Content */}
                <div className="space-y-6">
                    {/* Items */}
                    <div className="rounded-lg border border-neutral-200 overflow-hidden">
                        <div className="bg-neutral-50 px-4 py-3 flex items-center gap-2">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <h2 className="text-sm font-semibold">Order Items</h2>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product</TableHead>
                                    <TableHead className="text-center">Qty</TableHead>
                                    <TableHead className="text-right">Unit Price</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items.map((item: any) => {
                                    const imgUrl = item.product?.images?.find((i: any) => i.is_primary)?.image_url
                                        || item.product?.images?.[0]?.image_url
                                    return (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="relative h-10 w-10 rounded bg-neutral-100 overflow-hidden flex-shrink-0">
                                                        {imgUrl ? (
                                                            <Image src={imgUrl} alt={item.product_name} fill className="object-cover" sizes="40px" />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center text-[8px] text-neutral-400">N/A</div>
                                                        )}
                                                    </div>
                                                    <span className="text-sm font-medium">{item.product_name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">{item.quantity}</TableCell>
                                            <TableCell className="text-right">₹{parseFloat(item.unit_price).toFixed(2)}</TableCell>
                                            <TableCell className="text-right font-medium">₹{parseFloat(item.total_price).toFixed(2)}</TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>

                        {/* Totals */}
                        <div className="border-t px-4 py-3 space-y-1 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>₹{parseFloat(order.subtotal).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Shipping</span>
                                <span>{parseFloat(order.shipping_cost) === 0 ? "Free" : `₹${parseFloat(order.shipping_cost).toFixed(2)}`}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Tax (GST)</span>
                                <span>₹{parseFloat(order.tax).toFixed(2)}</span>
                            </div>
                            {parseFloat(order.discount) > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span>Discount</span>
                                    <span>-₹{parseFloat(order.discount).toFixed(2)}</span>
                                </div>
                            )}
                            <Separator />
                            <div className="flex justify-between font-bold text-base">
                                <span>Total</span>
                                <span>₹{parseFloat(order.total).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Customer & Address */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        {/* Customer */}
                        <div className="rounded-lg border border-neutral-200 p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <h3 className="text-sm font-semibold">Customer</h3>
                            </div>
                            {customer ? (
                                <div className="text-sm space-y-1">
                                    <p className="font-medium">{customer.first_name} {customer.last_name}</p>
                                    <p className="text-muted-foreground">{customer.email}</p>
                                    {customer.phone && <p className="text-muted-foreground">{customer.phone}</p>}
                                    <Link
                                        href={`/admin/customers/${customer.id}`}
                                        className="text-xs text-primary-600 hover:underline inline-block mt-1"
                                    >
                                        View Customer →
                                    </Link>
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">Customer data unavailable</p>
                            )}
                        </div>

                        {/* Address */}
                        <div className="rounded-lg border border-neutral-200 p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <h3 className="text-sm font-semibold">Shipping Address</h3>
                            </div>
                            {address ? (
                                <div className="text-sm space-y-0.5">
                                    <p className="font-medium">{address.full_name}</p>
                                    <p className="text-muted-foreground">{address.address_line1}</p>
                                    {address.address_line2 && <p className="text-muted-foreground">{address.address_line2}</p>}
                                    <p className="text-muted-foreground">{address.city}, {address.state} — {address.postal_code}</p>
                                    {address.phone && <p className="text-muted-foreground">{address.phone}</p>}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">Address unavailable</p>
                            )}
                        </div>
                    </div>

                    {/* Payment Info */}
                    {payment && (
                        <div className="rounded-lg border border-neutral-200 p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <CreditCard className="h-4 w-4 text-muted-foreground" />
                                <h3 className="text-sm font-semibold">Payment</h3>
                            </div>
                            <div className="text-sm space-y-1">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Method</span>
                                    <span className="capitalize">{payment.payment_method}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Status</span>
                                    <span className="capitalize">{payment.status}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Amount</span>
                                    <span>₹{parseFloat(payment.amount).toFixed(2)}</span>
                                </div>
                                {payment.razorpay_payment_id && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Razorpay ID</span>
                                        <span className="font-mono text-xs">{payment.razorpay_payment_id}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Shipment Info */}
                    {shipment && (
                        <div className="rounded-lg border border-neutral-200 p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <Truck className="h-4 w-4 text-muted-foreground" />
                                <h3 className="text-sm font-semibold">Shipment</h3>
                            </div>
                            <div className="text-sm space-y-1">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Carrier</span>
                                    <span>{shipment.carrier || "—"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Tracking #</span>
                                    <span className="font-mono text-xs">{shipment.tracking_number || "—"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Status</span>
                                    <span className="capitalize">{shipment.status}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar — Actions */}
                <OrderActions
                    orderId={order.id}
                    currentStatus={order.status}
                    shipment={shipment}
                />
            </div>
        </div>
    )
}

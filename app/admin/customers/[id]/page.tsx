import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, User, MapPin, ShoppingCart, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getAdminCustomerById } from "@/app/actions/admin-customers"

export const dynamic = 'force-dynamic'

const STATUS_COLORS: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    refunded: "bg-neutral-100 text-neutral-800",
}

interface CustomerDetailPageProps {
    params: Promise<{ id: string }>
}

export default async function CustomerDetailPage({ params }: CustomerDetailPageProps) {
    const { id } = await params
    const { customer, orders, addresses, error } = await getAdminCustomerById(id)

    if (!customer || error) notFound()

    const totalSpent = orders.reduce((sum: number, o: any) => {
        if (['processing', 'shipped', 'delivered'].includes(o.status)) {
            return sum + parseFloat(o.total)
        }
        return sum
    }, 0)

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/customers"><ArrowLeft className="h-4 w-4" /></Link>
                </Button>
                <div className="flex-1 min-w-0">
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight truncate">
                        {customer.first_name || customer.last_name
                            ? `${customer.first_name || ""} ${customer.last_name || ""}`.trim()
                            : "Unnamed Customer"}
                    </h1>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">{customer.email}</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6">
                        <CardTitle className="text-xs sm:text-sm font-medium">Orders</CardTitle>
                        <ShoppingCart className="h-3 sm:h-4 w-3 sm:w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="p-3 sm:p-6 pt-0">
                        <div className="text-lg sm:text-2xl font-bold">{orders.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6">
                        <CardTitle className="text-xs sm:text-sm font-medium">Total Spent</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 sm:p-6 pt-0">
                        <div className="text-lg sm:text-2xl font-bold">₹{totalSpent.toFixed(2)}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6">
                        <CardTitle className="text-xs sm:text-sm font-medium">Joined</CardTitle>
                        <Calendar className="h-3 sm:h-4 w-3 sm:w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="p-3 sm:p-6 pt-0">
                        <div className="text-sm sm:text-lg font-bold">
                            {new Date(customer.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Orders */}
            <div className="rounded-lg border">
                <div className="bg-neutral-50 px-3 sm:px-4 py-2 sm:py-3">
                    <h2 className="text-xs sm:text-sm font-semibold">Order History</h2>
                </div>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-xs sm:text-sm">Order</TableHead>
                                <TableHead className="text-xs sm:text-sm">Date</TableHead>
                                <TableHead className="text-xs sm:text-sm">Total</TableHead>
                                <TableHead className="text-xs sm:text-sm">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((o: any) => (
                                <TableRow key={o.id}>
                                    <TableCell>
                                        <Link href={`/admin/orders/${o.id}`} className="font-mono text-xs hover:underline text-primary-600">
                                            {o.order_number}
                                        </Link>
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm text-muted-foreground">
                                        {new Date(o.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                    </TableCell>
                                    <TableCell className="font-medium text-xs sm:text-sm">₹{parseFloat(o.total).toFixed(2)}</TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[o.status] || ""}`}>
                                            {o.status}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {orders.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-6 text-xs sm:text-sm text-muted-foreground">No orders</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Addresses */}
            {addresses.length > 0 && (
                <div>
                    <h2 className="text-xs sm:text-sm font-semibold mb-3 flex items-center gap-2">
                        <MapPin className="h-3 sm:h-4 w-3 sm:w-4 text-muted-foreground" /> Saved Addresses
                    </h2>
                    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                        {addresses.map((a: any) => (
                            <div key={a.id} className="rounded-lg border border-neutral-200 p-3 sm:p-4 text-xs sm:text-sm space-y-0.5">
                                <p className="font-medium">{a.full_name}</p>
                                <p className="text-muted-foreground">{a.address_line1}</p>
                                {a.address_line2 && <p className="text-muted-foreground">{a.address_line2}</p>}
                                <p className="text-muted-foreground">{a.city}, {a.state} — {a.postal_code}</p>
                                {a.is_default && <span className="inline-block text-xs text-primary-600 font-medium mt-1">Default</span>}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

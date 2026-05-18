import Link from "next/link"
import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    DollarSign,
    ShoppingCart,
    Users,
    Package,
    AlertTriangle,
    MessageSquare,
    ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export const dynamic = 'force-dynamic'

async function getDashboardStats() {
    const supabase = await createServerClient()

    // Revenue
    const { data: revenueData } = await supabase
        .from('orders')
        .select('total')
        .in('status', ['processing', 'shipped', 'delivered'])

    const totalRevenue = revenueData?.reduce((sum, o) => sum + parseFloat(o.total), 0) || 0

    // Order counts
    const { count: totalOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })

    const { count: pendingOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')

    // Customers
    const { count: totalCustomers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })

    // Products
    const { count: totalProducts } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })

    // Low stock (≤5)
    const { data: lowStockProducts } = await supabase
        .from('products')
        .select('id, name, stock_quantity, sku')
        .lte('stock_quantity', 5)
        .eq('is_active', true)
        .order('stock_quantity', { ascending: true })
        .limit(5)

    // Pending reviews
    const { count: pendingReviews } = await supabase
        .from('reviews')
        .select('*', { count: 'exact', head: true })
        .eq('is_approved', false)

    // Recent orders
    const { data: recentOrders } = await supabase
        .from('orders')
        .select('id, order_number, total, status, created_at, user:users(first_name, last_name, email)')
        .order('created_at', { ascending: false })
        .limit(5)

    return {
        totalRevenue,
        totalOrders: totalOrders || 0,
        pendingOrders: pendingOrders || 0,
        totalCustomers: totalCustomers || 0,
        totalProducts: totalProducts || 0,
        pendingReviews: pendingReviews || 0,
        lowStockProducts: lowStockProducts || [],
        recentOrders: recentOrders || [],
    }
}

const STATUS_COLORS: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    refunded: "bg-neutral-100 text-neutral-800",
}

export default async function DashboardPage() {
    const stats = await getDashboardStats()

    return (
        <div className="flex flex-col gap-4 sm:gap-6">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Dashboard</h1>

            {/* Stat Cards — Row 1 - Mobile Optimized */}
            <div className="grid gap-3 sm:gap-4 grid-cols-1 xs:grid-cols-2 lg:grid-cols-4">
                <Card className="min-w-0">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs sm:text-sm font-medium truncate">Total Revenue</CardTitle>
                        <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 shrink-0" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg sm:text-2xl font-bold">₹{stats.totalRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
                        <p className="text-xs text-muted-foreground mt-1">From completed orders</p>
                    </CardContent>
                </Card>

                <Card className="min-w-0">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs sm:text-sm font-medium truncate">Orders</CardTitle>
                        <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 shrink-0" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg sm:text-2xl font-bold">{stats.totalOrders}</div>
                        <p className="text-xs text-muted-foreground mt-1">{stats.pendingOrders} pending</p>
                    </CardContent>
                </Card>

                <Card className="min-w-0">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs sm:text-sm font-medium truncate">Customers</CardTitle>
                        <Users className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600 shrink-0" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg sm:text-2xl font-bold">{stats.totalCustomers}</div>
                        <p className="text-xs text-muted-foreground mt-1">Registered users</p>
                    </CardContent>
                </Card>

                <Card className="min-w-0">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs sm:text-sm font-medium truncate">Products</CardTitle>
                        <Package className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600 shrink-0" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg sm:text-2xl font-bold">{stats.totalProducts}</div>
                        <p className="text-xs text-muted-foreground mt-1">{stats.pendingReviews} reviews pending</p>
                    </CardContent>
                </Card>
            </div>

            {/* Row 2: Recent Orders + Low Stock - Mobile Optimized */}
            <div className="grid gap-4 sm:gap-6 md:grid-cols-1 lg:grid-cols-[2fr_1fr]">
                {/* Recent Orders */}
                <Card className="min-w-0">
                    <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 sm:pb-4">
                        <CardTitle className="text-sm sm:text-base">Recent Orders</CardTitle>
                        <Button variant="ghost" size="sm" asChild className="w-full sm:w-auto text-xs">
                            <Link href="/admin/orders" className="justify-start sm:justify-end">
                                View All <ArrowRight className="h-3 w-3 ml-1" />
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="text-xs">Order</TableHead>
                                        <TableHead className="text-xs hidden sm:table-cell">Customer</TableHead>
                                        <TableHead className="text-xs">Total</TableHead>
                                        <TableHead className="text-xs">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {stats.recentOrders.map((order: any) => {
                                        const name = order.user
                                            ? `${order.user.first_name || ""} ${order.user.last_name || ""}`.trim() || order.user.email
                                            : "—"
                                        return (
                                            <TableRow key={order.id}>
                                                <TableCell>
                                                    <Link href={`/admin/orders/${order.id}`} className="font-mono text-xs hover:underline">
                                                        {order.order_number}
                                                    </Link>
                                                </TableCell>
                                                <TableCell className="text-xs hidden sm:table-cell truncate max-w-[150px]">{name}</TableCell>
                                                <TableCell className="font-medium text-xs sm:text-sm">₹{parseFloat(order.total).toFixed(2)}</TableCell>
                                                <TableCell>
                                                    <span className={`inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[order.status] || ""}`}>
                                                        {order.status}
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                    {stats.recentOrders.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-6 sm:py-8 text-xs sm:text-sm text-muted-foreground">
                                                No orders yet
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* Low Stock */}
                <Card className="min-w-0">
                    <CardHeader className="pb-3 sm:pb-4">
                        <CardTitle className="text-sm sm:text-base flex items-center gap-2 truncate">
                            <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-amber-500 shrink-0" />
                            <span>Low Stock Alerts</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 sm:space-y-3">
                        {stats.lowStockProducts.length > 0 ? (
                            <div className="space-y-2 sm:space-y-3">
                                {stats.lowStockProducts.map((p: any) => (
                                    <div key={p.id} className="flex justify-between items-start sm:items-center gap-2 text-xs sm:text-sm">
                                        <div className="min-w-0 flex-1">
                                            <p className="font-medium truncate">{p.name}</p>
                                            <p className="text-xs text-muted-foreground truncate">{p.sku}</p>
                                        </div>
                                        <span className={`text-xs font-bold px-1.5 sm:px-2 py-0.5 rounded shrink-0 whitespace-nowrap ${p.stock_quantity === 0 ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                                            {p.stock_quantity === 0 ? "Out" : `${p.stock_quantity}`}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs sm:text-sm text-muted-foreground text-center py-4">All stock levels healthy ✓</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

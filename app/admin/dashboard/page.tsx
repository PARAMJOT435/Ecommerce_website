import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, CheckCircle, XCircle, AlertCircle } from "lucide-react"

export const dynamic = 'force-dynamic'

async function getDashboardStats() {
    const supabase = await createServerClient()

    // Total Products
    const { count: totalProducts, error: totalError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })

    // Active Products
    const { count: activeProducts, error: activeError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)

    // Out of Stock
    const { count: outOfStock, error: stockError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('stock_quantity', 0)

    if (totalError || activeError || stockError) {
        console.error("Error fetching stats:", { totalError, activeError, stockError })
    }

    return {
        total: totalProducts || 0,
        active: activeProducts || 0,
        outOfStock: outOfStock || 0,
    }
}

export default async function DashboardPage() {
    const stats = await getDashboardStats()

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center">
                <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <p className="text-xs text-muted-foreground">
                            Total products in database
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Products</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.active}</div>
                        <p className="text-xs text-muted-foreground">
                            Products visible in store
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
                        <AlertCircle className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.outOfStock}</div>
                        <p className="text-xs text-muted-foreground">
                            Products with 0 stock
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

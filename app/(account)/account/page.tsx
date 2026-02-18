import React from "react"
import Link from "next/link"
import { Package, MapPin, ShoppingBag, TrendingUp, ArrowRight } from "lucide-react"
import { createServerClient } from "@/lib/supabase/server"
import { getDashboardStats } from "@/app/actions/account"
import { OrderStatusBadge } from "@/components/features/account/order-status-badge"

export const dynamic = 'force-dynamic'

export default async function AccountDashboard() {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    const { stats } = await getDashboardStats()

    const firstName = user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'there'

    return (
        <div className="space-y-8">
            {/* Welcome */}
            <div>
                <h1 className="text-2xl font-heading font-bold text-neutral-900">
                    Welcome back, {firstName}! 👋
                </h1>
                <p className="mt-1 text-muted-foreground">
                    Here&apos;s a quick overview of your account.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    icon={<Package className="h-5 w-5 text-blue-600" />}
                    label="Total Orders"
                    value={stats?.totalOrders ?? 0}
                    bgColor="bg-blue-50"
                />
                <StatCard
                    icon={<ShoppingBag className="h-5 w-5 text-yellow-600" />}
                    label="Pending"
                    value={stats?.pendingOrders ?? 0}
                    bgColor="bg-yellow-50"
                />
                <StatCard
                    icon={<TrendingUp className="h-5 w-5 text-green-600" />}
                    label="Total Spent"
                    value={`₹${(stats?.totalSpent ?? 0).toFixed(0)}`}
                    bgColor="bg-green-50"
                />
                <StatCard
                    icon={<MapPin className="h-5 w-5 text-purple-600" />}
                    label="Saved Addresses"
                    value={stats?.addressCount ?? 0}
                    bgColor="bg-purple-50"
                />
            </div>

            {/* Recent Orders */}
            <div className="rounded-xl border border-neutral-200 bg-white">
                <div className="flex items-center justify-between border-b px-6 py-4">
                    <h2 className="text-lg font-semibold text-neutral-900">Recent Orders</h2>
                    <Link
                        href="/account/orders"
                        className="flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
                    >
                        View All
                        <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                </div>

                {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                    <div className="divide-y divide-neutral-100">
                        {stats.recentOrders.map((order) => (
                            <div key={order.id} className="flex items-center justify-between px-6 py-3">
                                <div className="flex items-center gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-neutral-900">
                                            Order #{order.id.slice(0, 8)}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(order.created_at).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <OrderStatusBadge status={order.status} />
                                    <span className="text-sm font-semibold">₹{Number(order.total).toFixed(2)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="px-6 py-12 text-center">
                        <Package className="mx-auto h-10 w-10 text-neutral-300" />
                        <p className="mt-3 text-sm text-muted-foreground">No orders yet</p>
                        <Link
                            href="/products"
                            className="mt-2 inline-block text-sm font-medium text-primary-600 hover:text-primary-700"
                        >
                            Start Shopping →
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}

function StatCard({
    icon,
    label,
    value,
    bgColor,
}: {
    icon: React.ReactNode
    label: string
    value: string | number
    bgColor: string
}) {
    return (
        <div className="rounded-xl border border-neutral-200 bg-white p-5">
            <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${bgColor}`}>
                    {icon}
                </div>
                <div>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="text-xl font-bold text-neutral-900">{value}</p>
                </div>
            </div>
        </div>
    )
}

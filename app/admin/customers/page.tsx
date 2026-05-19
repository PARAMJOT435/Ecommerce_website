import React, { Suspense } from "react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Eye, Users } from "lucide-react"
import { getAdminCustomers } from "@/app/actions/admin-customers"

export const dynamic = 'force-dynamic'

interface AdminCustomersPageProps {
    searchParams: Promise<{ search?: string; page?: string }>
}

export default async function AdminCustomersPage({ searchParams }: AdminCustomersPageProps) {
    const params = await searchParams
    const search = params.search || ""
    const page = parseInt(params.page || "1")

    const { customers, total, error } = await getAdminCustomers(search, page)

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-xl font-bold sm:text-2xl tracking-tight">Customers</h1>
                <span className="text-xs sm:text-sm text-muted-foreground">{total} total</span>
            </div>

            {/* Search */}
            <form method="GET" className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <input
                    name="search"
                    placeholder="Search by name or email..."
                    defaultValue={search}
                    className="w-full sm:w-auto sm:max-w-sm flex-1 rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <Button type="submit" size="sm" className="w-full sm:w-auto">Search</Button>
            </form>

            {error && (
                <div className="rounded-md bg-red-50 border border-red-200 p-3 text-xs sm:text-sm text-red-700">{error}</div>
            )}

            {/* Mobile: Card View | Desktop: Table View */}
            <div className="block md:hidden">
                <div className="space-y-3">
                    {customers.map((c: any) => (
                        <div key={c.id} className="border rounded-lg p-3 space-y-2">
                            <div className="flex items-start justify-between">
                                <div className="min-w-0">
                                    <p className="font-medium text-sm truncate">
                                        {c.first_name || c.last_name ? `${c.first_name || ""} ${c.last_name || ""}`.trim() : "—"}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate">{c.email}</p>
                                </div>
                                <Button variant="ghost" size="sm" asChild className="shrink-0">
                                    <Link href={`/admin/customers/${c.id}`}><Eye className="h-3 w-3" /></Link>
                                </Button>
                            </div>
                            <div className="text-xs space-y-1 pt-2 border-t">
                                {c.phone && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Phone:</span>
                                        <span>{c.phone}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Joined:</span>
                                    <span>{new Date(c.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {customers.length === 0 && (
                        <div className="text-center py-8">
                            <Users className="mx-auto h-10 w-10 text-neutral-300 mb-2" />
                            <p className="text-xs sm:text-sm text-muted-foreground">No customers found</p>
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
                                <TableHead className="text-xs sm:text-sm">Name</TableHead>
                                <TableHead className="text-xs sm:text-sm">Email</TableHead>
                                <TableHead className="text-xs sm:text-sm">Phone</TableHead>
                                <TableHead className="text-xs sm:text-sm">Joined</TableHead>
                                <TableHead className="text-right text-xs sm:text-sm">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {customers.map((c: any) => (
                                <TableRow key={c.id}>
                                    <TableCell className="font-medium text-xs sm:text-sm">
                                        {c.first_name || c.last_name ? `${c.first_name || ""} ${c.last_name || ""}`.trim() : "—"}
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">{c.email}</TableCell>
                                    <TableCell className="text-xs sm:text-sm text-muted-foreground">{c.phone || "—"}</TableCell>
                                    <TableCell className="text-xs sm:text-sm text-muted-foreground">
                                        {new Date(c.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                    </TableCell>
                                    <TableCell className="text-right py-2">
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/admin/customers/${c.id}`}><Eye className="h-4 w-4" /></Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {customers.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-12">
                                        <Users className="mx-auto h-10 w-10 text-neutral-300 mb-2" />
                                        <p className="text-xs sm:text-sm text-muted-foreground">No customers found</p>
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

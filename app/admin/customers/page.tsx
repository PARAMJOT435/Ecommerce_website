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
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
                <span className="text-sm text-muted-foreground">{total} total</span>
            </div>

            {/* Search */}
            <form method="GET" className="flex gap-2 max-w-sm">
                <input
                    name="search"
                    placeholder="Search by name or email..."
                    defaultValue={search}
                    className="flex-1 rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <Button type="submit" size="sm">Search</Button>
            </form>

            {error && (
                <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>
            )}

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {customers.map((c: any) => (
                            <TableRow key={c.id}>
                                <TableCell className="font-medium">
                                    {c.first_name || c.last_name ? `${c.first_name || ""} ${c.last_name || ""}`.trim() : "—"}
                                </TableCell>
                                <TableCell className="text-sm">{c.email}</TableCell>
                                <TableCell className="text-sm text-muted-foreground">{c.phone || "—"}</TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                    {new Date(c.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" asChild>
                                        <Link href={`/admin/customers/${c.id}`}><Eye className="h-4 w-4" /></Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {customers.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-12">
                                    <Users className="mx-auto h-10 w-10 text-neutral-300 mb-2" />
                                    <p className="text-sm text-muted-foreground">No customers found</p>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

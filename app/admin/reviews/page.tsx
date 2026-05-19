import React, { Suspense } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Check, X, Star, MessageSquare } from "lucide-react"
import { getAdminReviews, approveReview, rejectReview } from "@/app/actions/admin-reviews"

export const dynamic = 'force-dynamic'

interface AdminReviewsPageProps {
    searchParams: Promise<{ status?: string }>
}

export default async function AdminReviewsPage({ searchParams }: AdminReviewsPageProps) {
    const params = await searchParams
    const status = params.status || "pending"

    const { reviews, error } = await getAdminReviews(status)

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-xl font-bold sm:text-2xl tracking-tight">Reviews</h1>

            {/* Status Tabs */}
            <div className="flex gap-1.5 flex-wrap sm:flex-nowrap overflow-x-auto">
                {[
                    { value: "pending", label: "Pending" },
                    { value: "approved", label: "Approved" },
                    { value: "all", label: "All" },
                ].map((s) => (
                    <a
                        key={s.value}
                        href={`/admin/reviews?status=${s.value}`}
                        className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${status === s.value
                                ? "bg-neutral-900 text-white"
                                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                            }`}
                    >
                        {s.label}
                    </a>
                ))}
            </div>

            {error && (
                <div className="rounded-md bg-red-50 border border-red-200 p-3 text-xs sm:text-sm text-red-700">{error}</div>
            )}

            <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-xs sm:text-sm">Product</TableHead>
                                <TableHead className="hidden sm:table-cell text-xs sm:text-sm">Customer</TableHead>
                                <TableHead className="text-xs sm:text-sm">Rating</TableHead>
                                <TableHead className="hidden md:table-cell text-xs sm:text-sm">Comment</TableHead>
                                <TableHead className="hidden sm:table-cell text-xs sm:text-sm">Status</TableHead>
                                <TableHead className="text-right text-xs sm:text-sm">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {reviews.map((r: any) => (
                                <TableRow key={r.id}>
                                    <TableCell className="font-medium text-xs sm:text-sm max-w-[120px] sm:max-w-[150px] truncate min-w-0">
                                        {r.product?.name || "—"}
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell text-xs sm:text-sm min-w-0">
                                        {r.user ? `${r.user.first_name || ""} ${r.user.last_name || ""}`.trim() || r.user.email : "—"}
                                    </TableCell>
                                    <TableCell className="py-2">
                                        <div className="flex items-center gap-0.5">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${i < r.rating ? "fill-yellow-400 text-yellow-400" : "text-neutral-200"}`}
                                                />
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell text-xs sm:text-sm text-muted-foreground max-w-[200px] truncate">
                                        {r.title ? <span className="font-medium">{r.title}: </span> : null}
                                        {r.comment || "—"}
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        <Badge variant={r.is_approved ? "default" : "secondary"} className="text-xs">
                                            {r.is_approved ? "Approved" : "Pending"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right py-2">
                                        <div className="flex justify-end gap-1">
                                            {!r.is_approved && (
                                                <form action={async () => { "use server"; await approveReview(r.id) }}>
                                                    <Button variant="ghost" size="sm" className="text-green-600" title="Approve">
                                                        <Check className="h-4 w-4" />
                                                    </Button>
                                                </form>
                                            )}
                                            <form action={async () => { "use server"; await rejectReview(r.id) }}>
                                                <Button variant="ghost" size="sm" className="text-destructive" title="Delete">
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </form>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {reviews.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-12">
                                        <MessageSquare className="mx-auto h-10 w-10 text-neutral-300 mb-2" />
                                        <p className="text-xs sm:text-sm text-muted-foreground">No reviews</p>
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

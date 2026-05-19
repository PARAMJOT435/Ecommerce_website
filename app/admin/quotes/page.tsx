import { Metadata } from "next"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ClipboardList } from "lucide-react"
import { getAdminQuotes } from "@/app/actions/quotes"
import { QuoteActionsClient } from "./_components/quote-actions-client"

export const metadata: Metadata = {
    title: "B2B Quotes | Admin",
    description: "Manage incoming B2B quote requests",
}

export const dynamic = 'force-dynamic'

export default async function QuotesPage() {
    const { quotes, error } = await getAdminQuotes()

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">B2B Quotes</h1>
                    <p className="text-muted-foreground">
                        Manage incoming quote requests for high-ticket machinery.
                    </p>
                </div>
            </div>

            {error && (
                <div className="rounded-md bg-red-50 p-4 text-red-700">
                    Failed to load quotes: {error}
                </div>
            )}

            {/* Desktop View */}
            <div className="hidden sm:block rounded-md border bg-white overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Company</TableHead>
                            <TableHead>Product</TableHead>
                            <TableHead>Qty</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!quotes || quotes.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                    <div className="flex flex-col items-center justify-center space-y-3">
                                        <ClipboardList className="h-8 w-8 text-neutral-400" />
                                        <p>No quote requests found.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            quotes.map((quote: any) => (
                                <TableRow key={quote.id}>
                                    <TableCell className="font-medium">
                                        {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(quote.created_at))}
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium">{quote.name}</div>
                                        <div className="text-sm text-muted-foreground">{quote.email}</div>
                                        {quote.phone && <div className="text-xs text-muted-foreground">{quote.phone}</div>}
                                    </TableCell>
                                    <TableCell>{quote.company || '-'}</TableCell>
                                    <TableCell>
                                        <div className="font-medium">{quote.product?.name || 'Unknown Product'}</div>
                                        <div className="text-xs text-muted-foreground">SKU: {quote.product?.sku || 'N/A'}</div>
                                    </TableCell>
                                    <TableCell>{quote.quantity}</TableCell>
                                    <TableCell>
                                        <Badge variant={quote.status === 'pending' ? 'default' : 'secondary'}>
                                            {quote.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <QuoteActionsClient quote={quote} />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile View - Card Layout */}
            <div className="sm:hidden space-y-3">
                {!quotes || quotes.length === 0 ? (
                    <div className="rounded-md border bg-white p-8 text-center text-muted-foreground">
                        <div className="flex flex-col items-center justify-center space-y-3">
                            <ClipboardList className="h-8 w-8 text-neutral-400" />
                            <p>No quote requests found.</p>
                        </div>
                    </div>
                ) : (
                    quotes.map((quote: any) => (
                        <div key={quote.id} className="rounded-md border bg-white p-4 space-y-3">
                            {/* Header Row: Date and Status */}
                            <div className="flex items-start justify-between">
                                <div className="text-sm font-medium text-muted-foreground">
                                    {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(quote.created_at))}
                                </div>
                                <Badge variant={quote.status === 'pending' ? 'default' : 'secondary'}>
                                    {quote.status}
                                </Badge>
                            </div>

                            {/* Customer Info */}
                            <div className="space-y-1">
                                <div className="font-semibold text-sm">{quote.name}</div>
                                <div className="text-xs text-muted-foreground">{quote.email}</div>
                                {quote.phone && <div className="text-xs text-muted-foreground">{quote.phone}</div>}
                                {quote.company && <div className="text-xs text-muted-foreground font-medium">Company: {quote.company}</div>}
                            </div>

                            {/* Product Info */}
                            <div className="space-y-1 border-t pt-2">
                                <div className="text-sm font-medium">{quote.product?.name || 'Unknown Product'}</div>
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <span>SKU: {quote.product?.sku || 'N/A'}</span>
                                    <span>Qty: {quote.quantity}</span>
                                </div>
                            </div>

                            {/* Message if exists */}
                            {quote.message && (
                                <div className="border-t pt-2">
                                    <div className="text-xs text-muted-foreground">
                                        <span className="font-medium">Requirements:</span> {quote.message}
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="border-t pt-2 flex justify-end">
                                <QuoteActionsClient quote={quote} />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

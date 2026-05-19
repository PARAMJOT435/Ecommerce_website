'use client'

import { useState } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Mail, CheckCircle, Clock, Trash2 } from 'lucide-react'
import { updateQuoteStatus, deleteQuote } from '@/app/actions/quotes'
import { toast } from 'sonner'

interface Quote {
    id: string
    email: string
    name: string
    product?: { name: string }
    status: string
}

interface QuoteActionsClientProps {
    quote: Quote
}

export function QuoteActionsClient({ quote }: QuoteActionsClientProps) {
    const [isLoading, setIsLoading] = useState(false)

    const handleStatusChange = async (status: string) => {
        setIsLoading(true)
        try {
            const result = await updateQuoteStatus(quote.id, status)
            if (result.success) {
                toast.success(`Quote status updated to ${status}`)
            } else {
                toast.error(result.error || 'Failed to update status')
            }
        } catch (error) {
            toast.error('An error occurred')
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this quote request?')) {
            return
        }
        
        setIsLoading(true)
        try {
            const result = await deleteQuote(quote.id)
            if (result.success) {
                toast.success('Quote deleted')
            } else {
                toast.error(result.error || 'Failed to delete quote')
            }
        } catch (error) {
            toast.error('An error occurred')
        } finally {
            setIsLoading(false)
        }
    }

    const handleReply = () => {
        const subject = `Regarding your quote request for ${quote.product?.name || 'Machine'}`
        window.location.href = `mailto:${quote.email}?subject=${encodeURIComponent(subject)}`
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    disabled={isLoading}
                >
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={handleReply}>
                    <Mail className="mr-2 h-4 w-4" />
                    <span>Reply to Customer</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <div className="px-2 py-1.5 text-xs font-medium text-gray-600">
                    Update Status
                </div>

                {quote.status !== 'pending' && (
                    <DropdownMenuItem onClick={() => handleStatusChange('pending')}>
                        <Clock className="mr-2 h-4 w-4" />
                        <span>Mark as Pending</span>
                    </DropdownMenuItem>
                )}

                {quote.status !== 'responded' && (
                    <DropdownMenuItem onClick={() => handleStatusChange('responded')}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        <span>Mark as Responded</span>
                    </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Delete Quote</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

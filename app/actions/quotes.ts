'use server'

import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface QuoteRequest {
    product_id: string
    name: string
    email: string
    company?: string
    phone?: string
    quantity: number
    message?: string
}

export async function submitQuote(data: QuoteRequest) {
    const supabase = await createServerClient()

    try {
        // Validate required fields
        if (!data.product_id || !data.name || !data.email || !data.quantity) {
            return {
                success: false,
                error: 'Please fill in all required fields',
            }
        }

        if (data.quantity < 1) {
            return {
                success: false,
                error: 'Quantity must be at least 1',
            }
        }

        // Insert quote into database
        const { error } = await supabase
            .from('quotes')
            .insert({
                product_id: data.product_id,
                name: data.name,
                email: data.email,
                company: data.company || null,
                phone: data.phone || null,
                quantity: data.quantity,
                message: data.message || null,
                status: 'pending',
                created_at: new Date().toISOString(),
            })

        if (error) {
            console.error('Error submitting quote:', error)
            console.error('Error details:', error.message, error.code, error.details)
            return {
                success: false,
                error: `Database error: ${error.message}`,
            }
        }

        // Revalidate the admin quotes page
        revalidatePath('/admin/quotes')

        return {
            success: true,
            error: null,
        }
    } catch (error) {
        console.error('Quote submission error:', error)
        return {
            success: false,
            error: 'An unexpected error occurred',
        }
    }
}

export async function getAdminQuotes() {
    const supabase = await createServerClient()

    try {
        const { data: quotes, error } = await supabase
            .from('quotes')
            .select(`
                *,
                product:products(name, sku, id, slug)
            `)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching quotes:', error)
            return {
                quotes: [],
                error: error.message,
            }
        }

        return {
            quotes: quotes || [],
            error: null,
        }
    } catch (error) {
        console.error('Error fetching admin quotes:', error)
        return {
            quotes: [],
            error: 'Failed to fetch quotes',
        }
    }
}

export async function updateQuoteStatus(quoteId: string, status: string) {
    const supabase = await createServerClient()

    try {
        const { error } = await supabase
            .from('quotes')
            .update({ status })
            .eq('id', quoteId)

        if (error) {
            return {
                success: false,
                error: error.message,
            }
        }

        revalidatePath('/admin/quotes')
        return {
            success: true,
            error: null,
        }
    } catch (error) {
        console.error('Error updating quote status:', error)
        return {
            success: false,
            error: 'Failed to update quote status',
        }
    }
}

export async function deleteQuote(quoteId: string) {
    const supabase = await createServerClient()

    try {
        const { error } = await supabase
            .from('quotes')
            .delete()
            .eq('id', quoteId)

        if (error) {
            return {
                success: false,
                error: error.message,
            }
        }

        revalidatePath('/admin/quotes')
        return {
            success: true,
            error: null,
        }
    } catch (error) {
        console.error('Error deleting quote:', error)
        return {
            success: false,
            error: 'Failed to delete quote',
        }
    }
}

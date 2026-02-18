'use server'

import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getAdminReviews(status?: string) {
    const supabase = await createServerClient()

    let query = supabase
        .from('reviews')
        .select('*, user:users(first_name, last_name, email), product:products(name, slug)')
        .order('created_at', { ascending: false })

    if (status === 'pending') {
        query = query.eq('is_approved', false)
    } else if (status === 'approved') {
        query = query.eq('is_approved', true)
    }

    const { data, error } = await query
    if (error) return { reviews: [], error: error.message }
    return { reviews: data || [], error: null }
}

export async function approveReview(id: string) {
    const supabase = await createServerClient()
    const { error } = await supabase.from('reviews').update({ is_approved: true }).eq('id', id)
    if (error) return { error: error.message }
    revalidatePath('/admin/reviews')
    return { error: null }
}

export async function rejectReview(id: string) {
    const supabase = await createServerClient()
    const { error } = await supabase.from('reviews').delete().eq('id', id)
    if (error) return { error: error.message }
    revalidatePath('/admin/reviews')
    return { error: null }
}

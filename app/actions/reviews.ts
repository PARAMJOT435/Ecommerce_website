'use server'

import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getProductReviews(productId: string) {
    const supabase = await createServerClient()

    const { data, error } = await supabase
        .from('reviews')
        .select(`
            *,
            user:users(first_name, last_name)
        `)
        .eq('product_id', productId)
        .eq('is_approved', true)
        .order('created_at', { ascending: false })

    if (error) return { reviews: [], error: error.message }

    // Calculate average rating
    const reviews = data || []
    const avgRating = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0

    return {
        reviews,
        averageRating: Math.round(avgRating * 10) / 10,
        totalReviews: reviews.length,
        error: null,
    }
}

export async function submitReview(
    productId: string,
    rating: number,
    title: string,
    comment: string
) {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Please log in to submit a review' }

    if (rating < 1 || rating > 5) return { error: 'Rating must be between 1 and 5' }
    if (!comment.trim()) return { error: 'Please write a comment' }

    // Check if user already reviewed this product
    const { data: existing } = await supabase
        .from('reviews')
        .select('id')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .maybeSingle()

    if (existing) {
        return { error: 'You have already reviewed this product' }
    }

    // Check if user has purchased this product (verified purchase)
    const { data: orderItem } = await supabase
        .from('order_items')
        .select('id')
        .eq('product_id', productId)
        .limit(1)
        .maybeSingle()

    const isVerified = !!orderItem

    const { error } = await supabase
        .from('reviews')
        .insert({
            user_id: user.id,
            product_id: productId,
            rating,
            title: title.trim() || null,
            comment: comment.trim(),
            is_verified_purchase: isVerified,
            is_approved: true, // Auto-approve for now
        })

    if (error) return { error: error.message }

    revalidatePath(`/products`)
    return { error: null }
}

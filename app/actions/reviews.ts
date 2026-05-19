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

// Check if user already reviewed a product
export async function checkUserReview(productId: string) {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { hasReviewed: false }

    const { data: existing } = await supabase
        .from('reviews')
        .select('id')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .maybeSingle()

    return { hasReviewed: !!existing }
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

    // Check if user is admin - admins cannot submit reviews
    const { data: admin } = await supabase
        .from('admins')
        .select('id')
        .eq('id', user.id)
        .single()

    if (admin) {
        return { error: 'Admin accounts cannot submit reviews. Reviews are for customers only.' }
    }

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

    // Check if user has purchased AND received this product
    // Must have an order with this product that has been delivered
    const { data: deliveredOrders, error: orderError } = await supabase
        .from('order_items')
        .select(`
            id,
            order:orders(
                id,
                user_id,
                status
            )
        `)
        .eq('product_id', productId)

    if (orderError || !deliveredOrders || deliveredOrders.length === 0) {
        return { error: 'You must have ordered this product to write a review' }
    }

    // Find a delivered order for this user
    let order: { user_id: string; status: string } | null = null
    for (const item of deliveredOrders) {
        let itemOrder: any = item.order
        
        // Extract order (handle both array and object formats)
        if (Array.isArray(itemOrder) && itemOrder.length > 0) {
            itemOrder = itemOrder[0]
        }
        
        if (itemOrder && itemOrder.user_id === user.id && itemOrder.status === 'delivered') {
            order = itemOrder as { user_id: string; status: string }
            break
        }
    }

    if (!order) {
        return { error: 'You must have ordered and received this product to write a review' }
    }

    const isVerified = true // We already verified it's a purchased + delivered item

    const { error } = await supabase
        .from('reviews')
        .insert({
            user_id: user.id,
            product_id: productId,
            rating,
            title: title.trim() || null,
            comment: comment.trim(),
            is_verified_purchase: isVerified,
            is_approved: true, // Auto-approve for verified purchases
        })

    if (error) return { error: error.message }

    revalidatePath(`/products`)
    return { error: null }
}

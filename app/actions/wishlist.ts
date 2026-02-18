'use server'

import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getWishlist() {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { items: [], error: 'Not authenticated' }

    const { data, error } = await supabase
        .from('wishlist_items')
        .select(`
            id,
            product_id,
            created_at,
            product:products(
                id, name, slug, base_price, stock_quantity, is_active,
                images:product_images(image_url, is_primary)
            )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    if (error) return { items: [], error: error.message }
    return { items: data || [], error: null }
}

export async function toggleWishlistItem(productId: string) {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { added: false, error: 'Not authenticated' }

    // Check if already in wishlist
    const { data: existing } = await supabase
        .from('wishlist_items')
        .select('id')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .maybeSingle()

    if (existing) {
        // Remove from wishlist
        const { error } = await supabase
            .from('wishlist_items')
            .delete()
            .eq('id', existing.id)

        if (error) return { added: false, error: error.message }
        revalidatePath('/account/wishlist')
        return { added: false, error: null }
    } else {
        // Add to wishlist
        const { error } = await supabase
            .from('wishlist_items')
            .insert({ user_id: user.id, product_id: productId })

        if (error) return { added: true, error: error.message }
        revalidatePath('/account/wishlist')
        return { added: true, error: null }
    }
}

export async function getWishlistIds() {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { ids: [] }

    const { data } = await supabase
        .from('wishlist_items')
        .select('product_id')
        .eq('user_id', user.id)

    return { ids: data?.map((d: any) => d.product_id) || [] }
}

export async function removeFromWishlist(productId: string) {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Not authenticated' }

    const { error } = await supabase
        .from('wishlist_items')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId)

    if (error) return { error: error.message }

    revalidatePath('/account/wishlist')
    return { error: null }
}

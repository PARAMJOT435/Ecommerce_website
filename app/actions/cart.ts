'use server'

import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getCartItems() {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { items: [], error: 'Not authenticated' }

    const { data, error } = await supabase
        .from('cart_items')
        .select(`
            *,
            product:products(id, name, slug, base_price, stock_quantity, sku),
            variant:product_variants(id, variant_name, price, stock_quantity, sku)
        `)
        .eq('user_id', user.id)

    if (error) {
        console.error('Error fetching cart:', error)
        return { items: [], error: error.message }
    }

    return { items: data, error: null }
}

export async function addToCart(productId: string, quantity: number, variantId?: string | null) {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Not authenticated' }

    // Upsert: if item exists, update quantity; otherwise insert
    const { data: existing } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .is('variant_id', variantId ?? null)
        .maybeSingle()

    if (existing) {
        const { error } = await supabase
            .from('cart_items')
            .update({ quantity: existing.quantity + quantity })
            .eq('id', existing.id)

        if (error) return { error: error.message }
    } else {
        const { error } = await supabase
            .from('cart_items')
            .insert({
                user_id: user.id,
                product_id: productId,
                variant_id: variantId ?? null,
                quantity,
            })

        if (error) return { error: error.message }
    }

    revalidatePath('/cart')
    return { error: null }
}

export async function updateCartItem(itemId: string, quantity: number) {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Not authenticated' }

    if (quantity <= 0) {
        return removeCartItem(itemId)
    }

    const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', itemId)
        .eq('user_id', user.id)

    if (error) return { error: error.message }

    revalidatePath('/cart')
    return { error: null }
}

export async function removeCartItem(itemId: string) {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Not authenticated' }

    const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId)
        .eq('user_id', user.id)

    if (error) return { error: error.message }

    revalidatePath('/cart')
    return { error: null }
}

export async function clearServerCart() {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Not authenticated' }

    const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)

    if (error) return { error: error.message }

    revalidatePath('/cart')
    return { error: null }
}

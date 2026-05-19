'use server'

import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// ─── Profile ───────────────────────────────────────────

export async function getProfile() {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { profile: null, error: 'Not authenticated' }

    // Check if user is admin - admins should not use customer profile
    const { data: adminData } = await supabase
        .from('admins')
        .select('id')
        .eq('id', user.id)
        .single()

    if (adminData) {
        return { profile: null, error: 'Admins cannot access customer account' }
    }

    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

    if (error) return { profile: null, error: error.message }
    return { profile: data, error: null }
}

export async function updateProfile(formData: FormData) {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Not authenticated' }

    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const phone = formData.get('phone') as string
    const profilePicture = formData.get('profilePicture') as File | null

    let profilePictureUrl = null

    // Handle profile picture upload if provided
    if (profilePicture && profilePicture.size > 0) {
        try {
            const fileExt = profilePicture.name.split('.').pop()
            const fileName = `${user.id}-${Date.now()}.${fileExt}`
            const filePath = `profile-pictures/${fileName}`

            // Upload to Supabase storage
            const { error: uploadError } = await supabase.storage
                .from('users')
                .upload(filePath, profilePicture, { upsert: true })

            if (uploadError) {
                return { error: `Failed to upload profile picture: ${uploadError.message}` }
            }

            // Get the public URL
            const { data } = supabase.storage
                .from('users')
                .getPublicUrl(filePath)

            profilePictureUrl = data?.publicUrl
        } catch (err: any) {
            return { error: `Error uploading profile picture: ${err.message}` }
        }
    }

    const updateData: any = {
        first_name: firstName,
        last_name: lastName,
        phone,
        updated_at: new Date().toISOString(),
    }

    // Only update profile_picture_url if a new one was provided
    if (profilePictureUrl) {
        updateData.profile_picture_url = profilePictureUrl
    }

    const { error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', user.id)

    if (error) return { error: error.message }

    // Also update auth metadata so header reflects changes
    await supabase.auth.updateUser({
        data: { first_name: firstName, last_name: lastName },
    })

    revalidatePath('/account')
    return { error: null }
}

export async function changePassword(formData: FormData) {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Not authenticated' }

    const currentPassword = formData.get('currentPassword') as string
    const newPassword = formData.get('newPassword') as string
    const confirmPassword = formData.get('confirmPassword') as string

    // Validate all inputs
    if (!currentPassword) {
        return { error: 'Current password is required' }
    }

    if (!newPassword) {
        return { error: 'New password is required' }
    }

    if (newPassword !== confirmPassword) {
        return { error: 'New passwords do not match' }
    }

    if (newPassword.length < 6) {
        return { error: 'Password must be at least 6 characters' }
    }

    if (currentPassword === newPassword) {
        return { error: 'New password must be different from current password' }
    }

    // Verify current password by attempting to re-authenticate
    const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email!,
        password: currentPassword,
    })

    if (signInError) {
        return { error: 'Current password is incorrect' }
    }

    // Update to new password
    const { error } = await supabase.auth.updateUser({
        password: newPassword,
    })

    if (error) return { error: error.message }
    return { error: null }
}

// ─── Addresses ─────────────────────────────────────────

export async function getAddresses() {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { addresses: [], error: 'Not authenticated' }

    const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false })

    if (error) return { addresses: [], error: error.message }
    return { addresses: data, error: null }
}

export async function addAddress(formData: FormData) {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Not authenticated' }

    const isDefault = formData.get('isDefault') === 'true'

    // If setting as default, unset others first
    if (isDefault) {
        await supabase
            .from('addresses')
            .update({ is_default: false })
            .eq('user_id', user.id)
    }

    const { error } = await supabase
        .from('addresses')
        .insert({
            user_id: user.id,
            address_type: (formData.get('addressType') as string) || 'both',
            full_name: formData.get('fullName') as string,
            address_line1: formData.get('addressLine1') as string,
            address_line2: (formData.get('addressLine2') as string) || null,
            city: formData.get('city') as string,
            state: formData.get('state') as string,
            postal_code: formData.get('postalCode') as string,
            country: 'IN',
            phone: (formData.get('phone') as string) || null,
            is_default: isDefault,
        })

    if (error) return { error: error.message }

    revalidatePath('/account/addresses')
    return { error: null }
}

export async function updateAddress(id: string, formData: FormData) {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Not authenticated' }

    const isDefault = formData.get('isDefault') === 'true'

    if (isDefault) {
        await supabase
            .from('addresses')
            .update({ is_default: false })
            .eq('user_id', user.id)
    }

    const { error } = await supabase
        .from('addresses')
        .update({
            address_type: (formData.get('addressType') as string) || 'both',
            full_name: formData.get('fullName') as string,
            address_line1: formData.get('addressLine1') as string,
            address_line2: (formData.get('addressLine2') as string) || null,
            city: formData.get('city') as string,
            state: formData.get('state') as string,
            postal_code: formData.get('postalCode') as string,
            phone: (formData.get('phone') as string) || null,
            is_default: isDefault,
            updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) return { error: error.message }

    revalidatePath('/account/addresses')
    return { error: null }
}

export async function deleteAddress(id: string) {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Not authenticated' }

    const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) return { error: error.message }

    revalidatePath('/account/addresses')
    return { error: null }
}

export async function setDefaultAddress(id: string) {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Not authenticated' }

    // Unset all defaults
    await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', user.id)

    // Set the selected one
    const { error } = await supabase
        .from('addresses')
        .update({ is_default: true })
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) return { error: error.message }

    revalidatePath('/account/addresses')
    return { error: null }
}

// ─── Orders ────────────────────────────────────────────

export async function getOrders() {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { orders: [], error: 'Not authenticated' }

    const { data, error } = await supabase
        .from('orders')
        .select(`
            *,
            items:order_items(
                *,
                product:products(name, slug)
            ),
            payment:payments(status, payment_method)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    if (error) return { orders: [], error: error.message }
    return { orders: data, error: null }
}

export async function getOrderById(orderId: string) {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { order: null, error: 'Not authenticated' }

    const { data, error } = await supabase
        .from('orders')
        .select(`
            *,
            items:order_items(
                *,
                product:products(name, slug)
            ),
            payment:payments(*),
            shipping_address:addresses!shipping_address_id(*),
            billing_address:addresses!billing_address_id(*)
        `)
        .eq('id', orderId)
        .eq('user_id', user.id)
        .single()

    if (error) return { order: null, error: error.message }
    return { order: data, error: null }
}

export async function cancelOrder(orderId: string) {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Not authenticated' }

    // First verify the order belongs to this user and is cancellable
    const { data: order, error: fetchError } = await supabase
        .from('orders')
        .select('id, status')
        .eq('id', orderId)
        .eq('user_id', user.id)
        .single()

    if (fetchError || !order) return { error: 'Order not found' }

    const cancellableStatuses = ['pending', 'processing', 'confirmed']
    if (!cancellableStatuses.includes(order.status)) {
        return { error: `Cannot cancel an order with status "${order.status}". Only pending, processing, or confirmed orders can be cancelled.` }
    }

    const { error } = await supabase
        .from('orders')
        .update({ status: 'cancelled', updated_at: new Date().toISOString() })
        .eq('id', orderId)
        .eq('user_id', user.id)

    if (error) return { error: error.message }

    // Restore stock for each order item
    const { data: orderItems } = await supabase
        .from('order_items')
        .select('product_id, variant_id, quantity')
        .eq('order_id', orderId)

    if (orderItems) {
        for (const item of orderItems) {
            // Restore main product stock
            const { data: product } = await supabase
                .from('products')
                .select('stock_quantity')
                .eq('id', item.product_id)
                .single()

            if (product) {
                await supabase
                    .from('products')
                    .update({ stock_quantity: (product.stock_quantity || 0) + item.quantity })
                    .eq('id', item.product_id)
            }

            // Restore variant stock if applicable
            if (item.variant_id) {
                const { data: variant } = await supabase
                    .from('product_variants')
                    .select('stock_quantity')
                    .eq('id', item.variant_id)
                    .single()

                if (variant) {
                    await supabase
                        .from('product_variants')
                        .update({ stock_quantity: (variant.stock_quantity || 0) + item.quantity })
                        .eq('id', item.variant_id)
                }
            }
        }
    }

    revalidatePath('/account/orders')
    revalidatePath('/account')
    return { error: null }
}

// ─── Dashboard Stats ───────────────────────────────────

export async function getDashboardStats() {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { stats: null, error: 'Not authenticated' }

    const [ordersResult, addressesResult] = await Promise.all([
        supabase
            .from('orders')
            .select('id, status, total, created_at')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false }),
        supabase
            .from('addresses')
            .select('id')
            .eq('user_id', user.id),
    ])

    const orders = ordersResult.data || []
    const totalOrders = orders.length
    const pendingOrders = orders.filter((o) => o.status === 'pending' || o.status === 'processing').length
    const totalSpent = orders
        .filter((o) => o.status !== 'cancelled' && o.status !== 'refunded')
        .reduce((sum, o) => sum + Number(o.total), 0)
    const recentOrders = orders.slice(0, 5)
    const addressCount = addressesResult.data?.length || 0

    return {
        stats: {
            totalOrders,
            pendingOrders,
            totalSpent,
            recentOrders,
            addressCount,
        },
        error: null,
    }
}

'use server'

import { createServerClient } from '@/lib/supabase/server'

export async function getAdminCustomers(search?: string, page: number = 1, perPage: number = 20) {
    const supabase = await createServerClient()

    let query = supabase
        .from('users')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((page - 1) * perPage, page * perPage - 1)

    if (search) {
        query = query.or(`email.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%`)
    }

    const { data, count, error } = await query
    if (error) return { customers: [], total: 0, error: error.message }
    return { customers: data || [], total: count || 0, error: null }
}

export async function getAdminCustomerById(id: string) {
    const supabase = await createServerClient()

    const { data: customer, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single()

    if (error) return { customer: null, orders: [], addresses: [], error: error.message }

    // Get orders
    const { data: orders } = await supabase
        .from('orders')
        .select('id, order_number, total, status, created_at')
        .eq('user_id', id)
        .order('created_at', { ascending: false })

    // Get addresses
    const { data: addresses } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', id)

    return { customer, orders: orders || [], addresses: addresses || [], error: null }
}

"use server"

import { getAdminClient } from "./utils"

export async function getAdminCustomers(
    search?: string,
    page: number = 1,
    perPage: number = 20
) {
    try {
        const { supabase } = await getAdminClient()

        let query = supabase
            .from("users")
            .select("*", { count: "exact" })
            .order("created_at", { ascending: false })
            .range((page - 1) * perPage, page * perPage - 1)

        if (search) {
            query = query.or(
                `email.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%`
            )
        }

        const { data, count, error } = await query
        if (error) return { customers: [], total: 0, error: error.message }
        return { customers: data || [], total: count || 0, error: null }
    } catch (error: any) {
        return { customers: [], total: 0, error: error.message }
    }
}

export async function getAdminCustomerById(id: string) {
    try {
        const { supabase } = await getAdminClient()

        const { data: customer, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", id)
            .single()

        if (error)
            return {
                customer: null,
                orders: [],
                addresses: [],
                error: error.message,
            }

        // Get orders
        const { data: orders } = await supabase
            .from("orders")
            .select("id, order_number, total, status, created_at")
            .eq("user_id", id)
            .order("created_at", { ascending: false })

        // Get addresses
        const { data: addresses } = await supabase
            .from("addresses")
            .select("*")
            .eq("user_id", id)

        return {
            customer,
            orders: orders || [],
            addresses: addresses || [],
            error: null,
        }
    } catch (error: any) {
        return { customer: null, orders: [], addresses: [], error: error.message }
    }
}

"use server"

import { revalidatePath } from "next/cache"
import { getAdminClient } from "./utils"

export async function getAdminOrders(
    status?: string,
    search?: string,
    page: number = 1,
    perPage: number = 20
) {
    try {
        const { supabase } = await getAdminClient()

        let query = supabase
            .from("orders")
            .select(
                `
            *,
            user:users(first_name, last_name, email),
            shipping_address:addresses!shipping_address_id(full_name, city, state),
            items:order_items(id)
        `,
                { count: "exact" }
            )
            .order("created_at", { ascending: false })
            .range((page - 1) * perPage, page * perPage - 1)

        if (status && status !== "all") {
            query = query.eq("status", status)
        }

        if (search) {
            query = query.or(`order_number.ilike.%${search}%`)
        }

        const { data, count, error } = await query

        if (error) return { orders: [], total: 0, error: error.message }

        return { orders: data || [], total: count || 0, error: null }
    } catch (error: any) {
        return { orders: [], total: 0, error: error.message }
    }
}

export async function getAdminOrderById(id: string) {
    try {
        const { supabase } = await getAdminClient()

        const { data: order, error: orderError } = await supabase
            .from("orders")
            .select(
                `
            *,
            user:users(id, first_name, last_name, email, phone),
            shipping_address:addresses!shipping_address_id(*),
            billing_address:addresses!billing_address_id(*),
            items:order_items(
                *,
                product:products(slug, images:product_images(image_url, is_primary))
            )
        `
            )
            .eq("id", id)
            .single()

        if (orderError)
            return {
                order: null,
                shipment: null,
                payment: null,
                error: orderError.message,
            }

        // Get shipment
        const { data: shipment } = await supabase
            .from("shipments")
            .select("*")
            .eq("order_id", id)
            .maybeSingle()

        // Get payment
        const { data: payment } = await supabase
            .from("payments")
            .select("*")
            .eq("order_id", id)
            .maybeSingle()

        return { order, shipment, payment, error: null }
    } catch (error: any) {
        return { order: null, shipment: null, payment: null, error: error.message }
    }
}

export async function updateOrderStatus(id: string, newStatus: string) {
    try {
        const { supabase } = await getAdminClient()

        const updates: Record<string, any> = {
            status: newStatus,
            updated_at: new Date().toISOString(),
        }

        if (newStatus === "delivered") {
            updates.completed_at = new Date().toISOString()
        }

        const { error } = await supabase
            .from("orders")
            .update(updates)
            .eq("id", id)

        if (error) return { error: error.message }

        // Update shipment status if applicable
        if (newStatus === "shipped") {
            await supabase
                .from("shipments")
                .update({ status: "shipped", shipped_at: new Date().toISOString() })
                .eq("order_id", id)
        } else if (newStatus === "delivered") {
            await supabase
                .from("shipments")
                .update({ status: "delivered", delivered_at: new Date().toISOString() })
                .eq("order_id", id)
        }

        revalidatePath("/admin/orders")
        revalidatePath(`/admin/orders/${id}`)
        return { error: null }
    } catch (error: any) {
        return { error: error.message }
    }
}

export async function addShipmentTracking(
    orderId: string,
    carrier: string,
    trackingNumber: string
) {
    try {
        const { supabase } = await getAdminClient()

        // Upsert shipment
        const { data: existing } = await supabase
            .from("shipments")
            .select("id")
            .eq("order_id", orderId)
            .maybeSingle()

        if (existing) {
            const { error } = await supabase
                .from("shipments")
                .update({
                    carrier,
                    tracking_number: trackingNumber,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", existing.id)

            if (error) return { error: error.message }
        } else {
            const { error } = await supabase.from("shipments").insert({
                order_id: orderId,
                carrier,
                tracking_number: trackingNumber,
                status: "pending",
            })

            if (error) return { error: error.message }
        }

        revalidatePath(`/admin/orders/${orderId}`)
        return { error: null }
    } catch (error: any) {
        return { error: error.message }
    }
}

export async function deleteOrder(orderId: string) {
    try {
        const { supabase } = await getAdminClient()

        // Delete related records first (order_items, shipments, payments)
        await supabase.from("order_items").delete().eq("order_id", orderId)
        await supabase.from("shipments").delete().eq("order_id", orderId)
        await supabase.from("payments").delete().eq("order_id", orderId)

        const { error } = await supabase.from("orders").delete().eq("id", orderId)

        if (error) return { error: error.message }

        revalidatePath("/admin/orders")
        revalidatePath("/admin/dashboard")
        return { error: null }
    } catch (error: any) {
        return { error: error.message }
    }
}

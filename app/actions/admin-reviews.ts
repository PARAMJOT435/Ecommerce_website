"use server"

import { revalidatePath } from "next/cache"
import { getAdminClient } from "./utils"

export async function getAdminReviews(status?: string) {
    try {
        const { supabase } = await getAdminClient()

        let query = supabase
            .from("reviews")
            .select(
                "*, user:users(first_name, last_name, email), product:products(name, slug)"
            )
            .order("created_at", { ascending: false })

        if (status === "pending") {
            query = query.eq("is_approved", false)
        } else if (status === "approved") {
            query = query.eq("is_approved", true)
        }

        const { data, error } = await query
        if (error) return { reviews: [], error: error.message }
        return { reviews: data || [], error: null }
    } catch (error: any) {
        return { reviews: [], error: error.message }
    }
}

export async function approveReview(id: string) {
    try {
        const { supabase } = await getAdminClient()
        const { error } = await supabase
            .from("reviews")
            .update({ is_approved: true })
            .eq("id", id)
        if (error) return { error: error.message }
        revalidatePath("/admin/reviews")
        return { error: null }
    } catch (error: any) {
        return { error: error.message }
    }
}

export async function rejectReview(id: string) {
    try {
        const { supabase } = await getAdminClient()
        const { error } = await supabase.from("reviews").delete().eq("id", id)
        if (error) return { error: error.message }
        revalidatePath("/admin/reviews")
        return { error: null }
    } catch (error: any) {
        return { error: error.message }
    }
}

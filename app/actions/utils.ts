import { createServerClient } from "@/lib/supabase/server"

export async function getAdminClient() {
    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        throw new Error("Unauthorized")
    }

    const { data: admin, error: adminError } = await supabase
        .from("admins")
        .select("role")
        .eq("id", user.id)
        .single()

    if (adminError || !admin) {
        throw new Error("Forbidden")
    }

    return { supabase, user, admin }
}

/**
 * Check if the current user is an admin
 * Returns true if user is an admin, false otherwise
 */
export async function isUserAdmin() {
    try {
        const supabase = await createServerClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return false
        }

        const { data: admin, error: adminError } = await supabase
            .from("admins")
            .select("id")
            .eq("id", user.id)
            .single()

        return !adminError && !!admin
    } catch {
        return false
    }
}

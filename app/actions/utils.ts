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

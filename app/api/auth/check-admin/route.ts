import { createServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const supabase = await createServerClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ isAdmin: false })
        }

        const { data: admin, error: adminError } = await supabase
            .from('admins')
            .select('id')
            .eq('id', user.id)
            .single()

        return NextResponse.json({ isAdmin: !adminError && !!admin })
    } catch (error) {
        console.error('Error checking admin status:', error)
        return NextResponse.json({ isAdmin: false })
    }
}

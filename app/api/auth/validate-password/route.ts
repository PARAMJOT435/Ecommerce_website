import { createServerClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const supabase = await createServerClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            )
        }

        const body = await request.json()
        const { currentPassword } = body

        if (!currentPassword) {
            return NextResponse.json(
                { error: 'Current password is required' },
                { status: 400 }
            )
        }

        // Verify current password by attempting to re-authenticate
        const { error: signInError } = await supabase.auth.signInWithPassword({
            email: user.email!,
            password: currentPassword,
        })

        if (signInError) {
            return NextResponse.json(
                { error: 'Current password is incorrect' },
                { status: 401 }
            )
        }

        return NextResponse.json(
            { success: true },
            { status: 200 }
        )
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        )
    }
}

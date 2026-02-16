import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET() {
    try {
        const supabase = await createServerClient()
        const { count, error } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true })

        if (error) throw error

        return NextResponse.json({
            success: true,
            message: 'Supabase connected!',
            productCount: count
        })
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 })
    }
}

import { createServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const supabase = await createServerClient()

        // Fetch approved reviews for the product
        const { data: reviews, error } = await supabase
            .from('reviews')
            .select('rating')
            .eq('product_id', id)
            .eq('is_approved', true)

        if (error) {
            console.error('Error fetching reviews:', error)
            return NextResponse.json(
                { average: 0, count: 0, reviewCount: 0 },
                { status: 200 }
            )
        }

        if (!reviews || reviews.length === 0) {
            return NextResponse.json(
                { average: 0, count: 0, reviewCount: 0 },
                { status: 200 }
            )
        }

        // Calculate average rating
        const average = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length

        return NextResponse.json(
            {
                average: Math.round(average * 10) / 10, // Round to 1 decimal
                count: reviews.length,
                reviewCount: reviews.length,
            },
            { status: 200 }
        )
    } catch (error) {
        console.error('API error:', error)
        return NextResponse.json(
            { average: 0, count: 0, reviewCount: 0 },
            { status: 200 }
        )
    }
}

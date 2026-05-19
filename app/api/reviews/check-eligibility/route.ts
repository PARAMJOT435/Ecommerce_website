import { createServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const productId = searchParams.get('productId')

        if (!productId) {
            return NextResponse.json({ error: 'Product ID required' }, { status: 400 })
        }

        const supabase = await createServerClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({
                isLoggedIn: false,
                hasPurchased: false,
                isDelivered: false,
                hasReviewed: false,
            })
        }

        // Check if user already reviewed this product
        const { data: existingReview } = await supabase
            .from('reviews')
            .select('id')
            .eq('user_id', user.id)
            .eq('product_id', productId)
            .maybeSingle()

        if (existingReview) {
            return NextResponse.json({
                isLoggedIn: true,
                hasPurchased: true,
                isDelivered: true,
                hasReviewed: true,
            })
        }

        // Check if user has purchased this product
        const { data: orderItems } = await supabase
            .from('order_items')
            .select(`
                id,
                order:orders(id, user_id, status)
            `)
            .eq('product_id', productId)

        if (!orderItems || orderItems.length === 0) {
            return NextResponse.json({
                isLoggedIn: true,
                hasPurchased: false,
                isDelivered: false,
                hasReviewed: false,
            })
        }

        // Find a delivered order for this user
        let order: { id: string; user_id: string; status: string } | null = null
        for (const item of orderItems) {
            let itemOrder: any = item.order
            
            // Extract order (handle both array and object formats)
            if (Array.isArray(itemOrder) && itemOrder.length > 0) {
                itemOrder = itemOrder[0]
            }
            
            if (itemOrder && itemOrder.user_id === user.id && itemOrder.status === 'delivered') {
                order = itemOrder as { id: string; user_id: string; status: string }
                break
            }
        }

        if (!order) {
            return NextResponse.json({
                isLoggedIn: true,
                hasPurchased: orderItems.some((item: any) => {
                    let itemOrder: any = item.order
                    if (Array.isArray(itemOrder) && itemOrder.length > 0) {
                        itemOrder = itemOrder[0]
                    }
                    return itemOrder?.user_id === user.id
                }),
                isDelivered: false,
                hasReviewed: false,
            })
        }

        return NextResponse.json({
            isLoggedIn: true,
            hasPurchased: true,
            isDelivered: true,
            hasReviewed: false,
            orderStatus: order.status,
        })
    } catch (error) {
        console.error('Error checking review eligibility:', error)
        return NextResponse.json(
            {
                isLoggedIn: false,
                hasPurchased: false,
                isDelivered: false,
                hasReviewed: false,
            },
            { status: 500 }
        )
    }
}

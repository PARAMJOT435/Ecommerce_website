'use server'

import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

function generateOrderNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase()
    const random = Math.random().toString(36).substring(2, 6).toUpperCase()
    return `FOM-${timestamp}-${random}`
}

interface CheckoutItem {
    productId: string
    variantId: string | null
    name: string
    price: number
    quantity: number
}

interface ShippingAddress {
    fullName: string
    addressLine1: string
    addressLine2?: string
    city: string
    state: string
    postalCode: string
    phone: string
}

const FREE_SHIPPING_THRESHOLD = 499
const SHIPPING_COST = 49
const TAX_RATE = 0.18

// Save address for future use
export async function saveCheckoutAddress(address: ShippingAddress) {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Not authenticated', addressId: null }

    const { data: addressData, error: addressError } = await supabase
        .from('addresses')
        .insert({
            user_id: user.id,
            address_type: 'shipping',
            full_name: address.fullName,
            address_line1: address.addressLine1,
            address_line2: address.addressLine2 || null,
            city: address.city,
            state: address.state,
            postal_code: address.postalCode,
            country: 'IN',
            phone: address.phone,
            is_default: false,
        })
        .select('id')
        .single()

    if (addressError) return { error: addressError.message, addressId: null }
    return { error: null, addressId: addressData.id }
}

export async function createOrder(
    shippingAddress: ShippingAddress,
    items: CheckoutItem[],
    saveNewAddress: boolean = false,
    existingAddressId?: string
) {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Not authenticated', orderId: null }
    if (items.length === 0) return { error: 'Cart is empty', orderId: null }

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
    const tax = Math.round(subtotal * TAX_RATE * 100) / 100
    const total = subtotal + shipping + tax

    // 1. Handle address
    let addressId: string

    if (existingAddressId) {
        // User selected an existing address - use it directly
        addressId = existingAddressId
    } else {
        // User entered a new address
        const { data: addressData, error: addressError } = await supabase
            .from('addresses')
            .insert({
                user_id: user.id,
                address_type: 'shipping',
                full_name: shippingAddress.fullName,
                address_line1: shippingAddress.addressLine1,
                address_line2: shippingAddress.addressLine2 || null,
                city: shippingAddress.city,
                state: shippingAddress.state,
                postal_code: shippingAddress.postalCode,
                country: 'IN',
                phone: shippingAddress.phone,
                is_default: false,
            })
            .select('id')
            .single()

        if (addressError) return { error: `Address error: ${addressError.message}`, orderId: null }
        addressId = addressData.id
    }

    // 2. Create order
    const orderNumber = generateOrderNumber()
    const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
            order_number: orderNumber,
            user_id: user.id,
            shipping_address_id: addressId,
            billing_address_id: addressId,
            subtotal,
            tax,
            shipping_cost: shipping,
            discount: 0,
            total,
            status: 'pending',
        })
        .select('id')
        .single()

    if (orderError) return { error: `Order error: ${orderError.message}`, orderId: null }

    // 3. Create order items
    const orderItems = items.map((item) => ({
        order_id: orderData.id,
        product_id: item.productId,
        variant_id: item.variantId,
        product_name: item.name,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity,
    }))

    const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

    if (itemsError) return { error: `Items error: ${itemsError.message}`, orderId: null }

    // 4. Decrement stock for each product/variant
    for (const item of items) {
        if (item.variantId) {
            // Decrement variant stock
            const { data: variant } = await supabase
                .from('product_variants')
                .select('stock_quantity')
                .eq('id', item.variantId)
                .single()

            if (variant) {
                await supabase
                    .from('product_variants')
                    .update({ stock_quantity: Math.max(0, (variant.stock_quantity || 0) - item.quantity) })
                    .eq('id', item.variantId)
            }
        }

        // Always decrement main product stock
        const { data: product } = await supabase
            .from('products')
            .select('stock_quantity')
            .eq('id', item.productId)
            .single()

        if (product) {
            await supabase
                .from('products')
                .update({ stock_quantity: Math.max(0, (product.stock_quantity || 0) - item.quantity) })
                .eq('id', item.productId)
        }
    }

    // 5. Clear user's server cart
    await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)

    revalidatePath('/account/orders')

    return { error: null, orderId: orderData.id, orderNumber }
}

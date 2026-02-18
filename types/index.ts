// ============================================
// USER MANAGEMENT
// ============================================

export interface User {
    id: string
    email: string
    first_name: string | null
    last_name: string | null
    phone: string | null
    email_verified: boolean
    created_at: string
    updated_at: string
    last_login: string | null
}

export type AddressType = 'shipping' | 'billing' | 'both'

export interface Address {
    id: string
    user_id: string
    address_type: AddressType
    full_name: string
    address_line1: string
    address_line2: string | null
    city: string
    state: string
    postal_code: string
    country: string
    phone: string | null
    is_default: boolean
    created_at: string
    updated_at: string
}

// ============================================
// PRODUCT CATALOG
// ============================================

export interface Category {
    id: string
    name: string
    slug: string
    description: string | null
    parent_id: string | null
    display_order: number
    is_active: boolean
    created_at: string
    updated_at: string
}

export interface Tag {
    id: string
    name: string
    slug: string
    created_at: string
}

export interface Product {
    id: string
    name: string
    slug: string
    description: string | null
    short_description: string | null
    base_price: number
    category_id: string | null
    is_active: boolean
    is_featured: boolean
    ingredients: string | null
    certifications: string[] | null
    benefits: string | null
    stock_quantity: number
    sku: string
    expiry_date: string | null
    created_at: string
    updated_at: string
}

export interface ProductImage {
    id: string
    product_id: string
    image_url: string
    alt_text: string | null
    display_order: number
    is_primary: boolean
    created_at: string
}

export interface ProductVariant {
    id: string
    product_id: string
    variant_name: string
    price: number
    stock_quantity: number
    sku: string
    attributes: Record<string, any> | null
    is_active: boolean
    created_at: string
    updated_at: string
}

export interface ProductTag {
    product_id: string
    tag_id: string
}

// ============================================
// SHOPPING EXPERIENCE
// ============================================

export interface CartItem {
    id: string
    user_id: string
    product_id: string
    variant_id: string | null
    quantity: number
    created_at: string
    updated_at: string
}

export interface WishlistItem {
    id: string
    user_id: string
    product_id: string
    created_at: string
}

// ============================================
// ORDERS & PAYMENTS
// ============================================

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'

export interface Order {
    id: string
    order_number: string
    user_id: string
    shipping_address_id: string | null
    billing_address_id: string | null
    subtotal: number
    tax: number
    shipping_cost: number
    discount: number
    total: number
    status: OrderStatus
    notes: string | null
    created_at: string
    updated_at: string
    completed_at: string | null
}

export interface OrderItem {
    id: string
    order_id: string
    product_id: string
    variant_id: string | null
    product_name: string
    quantity: number
    unit_price: number
    total_price: number
    created_at: string
}

export type PaymentMethod = 'card' | 'upi' | 'netbanking' | 'wallet'
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded'

export interface Payment {
    id: string
    order_id: string
    payment_method: PaymentMethod
    razorpay_order_id: string | null
    razorpay_payment_id: string | null
    razorpay_signature: string | null
    amount: number
    currency: string
    status: PaymentStatus
    payment_details: Record<string, any> | null
    created_at: string
    updated_at: string
}

export type ShipmentStatus = 'pending' | 'shipped' | 'in_transit' | 'delivered' | 'returned'

export interface Shipment {
    id: string
    order_id: string
    carrier: string | null
    tracking_number: string | null
    status: ShipmentStatus
    shipped_at: string | null
    delivered_at: string | null
    created_at: string
    updated_at: string
}

// ============================================
// SUBSCRIPTIONS
// ============================================

export type SubscriptionStatus = 'active' | 'paused' | 'cancelled' | 'expired'
export type SubscriptionFrequency = 'weekly' | 'biweekly' | 'monthly' | 'bimonthly' | 'quarterly'

export interface Subscription {
    id: string
    user_id: string
    status: SubscriptionStatus
    frequency: SubscriptionFrequency
    next_billing_date: string
    shipping_address_id: string | null
    billing_address_id: string | null
    created_at: string
    updated_at: string
    cancelled_at: string | null
}

export interface SubscriptionItem {
    id: string
    subscription_id: string
    product_id: string
    variant_id: string | null
    quantity: number
    created_at: string
    updated_at: string
}

export interface SubscriptionOrder {
    id: string
    subscription_id: string
    order_id: string
    billing_date: string
    created_at: string
}

// ============================================
// REVIEWS & RATINGS
// ============================================

export interface Review {
    id: string
    user_id: string
    product_id: string
    rating: number
    title: string | null
    comment: string | null
    is_verified_purchase: boolean
    is_approved: boolean
    created_at: string
    updated_at: string
}

// ============================================
// PROMOTIONS
// ============================================

export type DiscountType = 'percentage' | 'fixed'

export interface Coupon {
    id: string
    code: string
    discount_type: DiscountType
    discount_value: number
    min_purchase_amount: number
    max_uses: number | null
    times_used: number
    valid_from: string
    valid_until: string
    is_active: boolean
    created_at: string
    updated_at: string
}

export interface OrderCoupon {
    order_id: string
    coupon_id: string
    discount_amount: number
}

// ============================================
// CONTENT MANAGEMENT (Blog)
// ============================================

export type AdminRole = 'admin' | 'editor' | 'author'

export interface Admin {
    id: string
    email: string
    full_name: string
    role: AdminRole
    created_at: string
    updated_at: string
}

export type BlogPostStatus = 'draft' | 'published' | 'archived'

export interface BlogPost {
    id: string
    title: string
    slug: string
    content: string | null
    excerpt: string | null
    featured_image: string | null
    author_id: string | null
    status: BlogPostStatus
    published_at: string | null
    created_at: string
    updated_at: string
}

export interface BlogComment {
    id: string
    post_id: string
    user_id: string | null
    comment: string
    is_approved: boolean
    created_at: string
}

// ============================================
// COMPOSITE / RELATION TYPES
// ============================================

export type ProductWithImages = Product & {
    images: ProductImage[]
}

export type ProductWithVariants = Product & {
    variants: ProductVariant[]
}

export type ProductWithRelations = Product & {
    images: ProductImage[]
    variants: ProductVariant[]
    category: Category | null
}

export type ProductFull = Product & {
    images: ProductImage[]
    variants: ProductVariant[]
    category: Category | null
    tags: Tag[]
    reviews: Review[]
}

export type OrderWithItems = Order & {
    items: OrderItem[]
}

export type OrderWithRelations = Order & {
    items: OrderItem[]
    payment: Payment | null
    shipment: Shipment | null
    shipping_address: Address | null
    billing_address: Address | null
}

export type CartItemWithProduct = CartItem & {
    product: Product
    variant: ProductVariant | null
}

export type SubscriptionWithItems = Subscription & {
    items: (SubscriptionItem & {
        product: Product
        variant: ProductVariant | null
    })[]
}

export type ReviewWithUser = Review & {
    user: Pick<User, 'id' | 'first_name' | 'last_name'>
}

export type BlogPostWithAuthor = BlogPost & {
    author: Pick<Admin, 'id' | 'full_name'> | null
}

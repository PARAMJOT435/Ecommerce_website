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

// Type helpers
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

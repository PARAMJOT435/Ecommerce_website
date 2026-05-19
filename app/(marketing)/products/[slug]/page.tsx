import { notFound } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { Container } from "@/components/ui/container"
import { ProductHero } from "@/components/features/product/product-hero"
import { ProductDeliveryCalculator } from "@/components/features/product/product-delivery-calculator"
import { ProductHighlights } from "@/components/features/product/product-highlights"
import { ProductDeliveryInfo } from "@/components/features/product/product-delivery-info"
import { ProductWarranty } from "@/components/features/product/product-warranty"
import { ProductFAQ } from "@/components/features/product/product-faq"
import { RelatedProducts } from "@/components/features/product/related-products"
import { ProductWithRelations } from "@/types"
import { getProductReviews } from "@/app/actions/reviews"
import { getWishlistIds } from "@/app/actions/wishlist"
import { ReviewList } from "@/components/features/reviews/review-list"
import { ReviewForm } from "@/components/features/reviews/review-form"

export const dynamic = 'force-dynamic'

interface ProductPageProps {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProductPageProps) {
    const { slug } = await params
    const supabase = await createServerClient()
    const { data } = await supabase
        .from('products')
        .select('name, short_description')
        .eq('slug', slug)
        .single()

    return {
        title: data ? `${data.name} | MMW` : 'Product | MMW',
        description: data?.short_description || 'Premium hygiene products crafted with care.',
    }
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { slug } = await params
    const supabase = await createServerClient()

    const { data: productData, error } = await supabase
        .from('products')
        .select(`
      *,
      images:product_images(*),
      variants:product_variants(*),
      category:categories(*)
    `)
        .eq('slug', slug)
        .eq('is_active', true)
        .single()

    if (error || !productData) {
        if (error && error.code !== 'PGRST116') {
            console.error('Error fetching product:', error)
        }
        notFound()
    }

    const product = productData as unknown as ProductWithRelations

    // Fetch reviews and auth state in parallel
    const [reviewData, authData] = await Promise.all([
        getProductReviews(product.id),
        supabase.auth.getUser(),
    ])

    const user = authData.data.user
    
    // Check if user is admin
    let isAdmin = false
    if (user) {
        const { data: adminCheck } = await supabase
            .from('admins')
            .select('id')
            .eq('id', user.id)
            .single()
        isAdmin = !!adminCheck
    }

    // Check if user has ordered and received this product
    let hasOrderedAndReceived = false
    if (user && !isAdmin) {
        const { data: purchasedItem } = await supabase
            .from('order_items')
            .select(`
                id,
                order:orders(id, user_id, status)
            `)
            .eq('product_id', product.id)
            .single()

        if (purchasedItem && Array.isArray(purchasedItem.order) && purchasedItem.order.length > 0) {
            const order = purchasedItem.order[0] as { user_id: string; status: string }
            if (order.user_id === user.id && order.status === 'delivered') {
                hasOrderedAndReceived = true
            }
        } else if (purchasedItem && !Array.isArray(purchasedItem.order) && purchasedItem.order) {
            const order = purchasedItem.order as { user_id: string; status: string }
            if (order.user_id === user.id && order.status === 'delivered') {
                hasOrderedAndReceived = true
            }
        }
    }

    // Only logged in customers who have ordered and received can write reviews
    const isLoggedIn = !!user && !isAdmin && hasOrderedAndReceived

    // Get wishlist IDs
    const { ids: wishlistIds } = await getWishlistIds()

    // Get user's addresses
    let userAddresses: any[] = []
    if (user && !isAdmin) {
        const { data: addresses } = await supabase
            .from('addresses')
            .select('id, full_name, address_line1, city, state, postal_code')
            .eq('user_id', user.id)
            .eq('is_default', true)
            .limit(5)
        
        userAddresses = addresses || []
    }

    // Get related products
    const { data: allProducts } = await supabase
        .from('products')
        .select(`
            *,
            images:product_images(*)
        `)
        .eq('is_active', true)
        .eq('category_id', product.category_id)
        .limit(10)

    return (
        <Container>
            <div className="py-12 space-y-16">
                {/* Hero Section - Product Image, Details, and Delivery Card */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
                    {/* Left Column: Product Image and Details */}
                    <ProductHero 
                        product={product} 
                        isWishlisted={wishlistIds.includes(product.id)}
                        userAddresses={userAddresses}
                        averageRating={reviewData.averageRating}
                        totalReviews={reviewData.totalReviews}
                    />
                    
                    {/* Right Sidebar: Delivery Card */}
                    {!isAdmin && userAddresses.length > 0 && (
                        <ProductDeliveryCalculator 
                            userAddresses={userAddresses}
                            isAdmin={isAdmin}
                        />
                    )}
                </div>

                {/* Mobile Delivery Card - Below product (lg breakpoint) */}
                {!isAdmin && userAddresses.length > 0 && (
                    <div className="lg:hidden">
                        <ProductDeliveryCalculator 
                            userAddresses={userAddresses}
                            isAdmin={isAdmin}
                        />
                    </div>
                )}

                {/* Highlights Section */}
                <div>
                    <h2 className="text-xl font-bold text-neutral-900 mb-4">Why Choose This Product?</h2>
                    <ProductHighlights />
                </div>

                {/* Two Column Layout: Specs + Sidebar */}
                <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
                    {/* Left Column: Specifications */}
                    <div className="space-y-8">
                        {/* Technical Specifications Section */}
                        {product.specifications && Object.keys(product.specifications).length > 0 && (
                            <div>
                                <h2 className="text-2xl font-heading font-bold text-neutral-900 mb-6 pb-4 border-b">
                                    Technical Specifications
                                </h2>
                                <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
                                    <table className="w-full text-sm text-left">
                                        <tbody className="divide-y divide-neutral-200">
                                            {Object.entries(product.specifications).map(([key, value], index) => (
                                                <tr key={key} className={index % 2 === 0 ? "bg-neutral-50" : "bg-white"}>
                                                    <th className="py-4 px-6 font-medium text-neutral-900 w-1/3">
                                                        {key}
                                                    </th>
                                                    <td className="py-4 px-6 text-neutral-700">
                                                        {String(value)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Product Description */}
                        {product.description && (
                            <div>
                                <h2 className="text-2xl font-heading font-bold text-neutral-900 mb-4 pb-4 border-b">
                                    About This Product
                                </h2>
                                <div className="bg-white rounded-xl border border-neutral-200 p-6">
                                    <p className="text-neutral-700 leading-relaxed whitespace-pre-wrap">
                                        {product.description}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* FAQ Section */}
                        <ProductFAQ />
                    </div>

                    {/* Right Sidebar */}
                    <div className="space-y-6">
                        {/* Delivery Info */}
                        <ProductDeliveryInfo 
                            stockQuantity={product.stock_quantity} 
                            productName={product.name}
                        />

                        {/* Warranty Benefits */}
                        <ProductWarranty />
                    </div>
                </div>

                {/* Reviews Section */}
                <div>
                    <h2 className="text-2xl font-heading font-bold text-neutral-900 mb-6 pb-4 border-b">
                        Customer Reviews
                    </h2>
                    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
                        <ReviewList
                            reviews={reviewData.reviews}
                            averageRating={reviewData.averageRating ?? 0}
                            totalReviews={reviewData.totalReviews ?? 0}
                        />
                        <ReviewForm productId={product.id} isLoggedIn={isLoggedIn} />
                    </div>
                </div>

                {/* Related Products */}
                {allProducts && allProducts.length > 0 && (
                    <RelatedProducts 
                        products={allProducts as any}
                        currentProductId={product.id}
                        wishlistIds={wishlistIds}
                    />
                )}
            </div>
        </Container>
    )
}

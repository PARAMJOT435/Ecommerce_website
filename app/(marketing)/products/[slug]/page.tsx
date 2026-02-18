import { notFound } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { Container } from "@/components/ui/container"
import { ProductHero } from "@/components/features/product/product-hero"
import { ProductWithRelations } from "@/types"
import { getProductReviews } from "@/app/actions/reviews"
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
        title: data ? `${data.name} | fewofmany` : 'Product | fewofmany',
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

    const isLoggedIn = !!authData.data.user

    return (
        <Container>
            <div className="py-12">
                <ProductHero product={product} />

                {/* Additional Details Section */}
                <div className="mt-16 grid gap-12 md:grid-cols-2">
                    {product.ingredients && (
                        <div>
                            <h3 className="text-xl font-bold mb-4">Ingredients</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {product.ingredients}
                            </p>
                        </div>
                    )}

                    {product.benefits && (
                        <div>
                            <h3 className="text-xl font-bold mb-4">Benefits</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {product.benefits}
                            </p>
                        </div>
                    )}
                </div>

                {/* Reviews Section */}
                <div className="mt-16">
                    <h2 className="text-2xl font-heading font-bold text-neutral-900 mb-6">
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
            </div>
        </Container>
    )
}

import { notFound } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { Container } from "@/components/ui/container"
import { ProductHero } from "@/components/features/product/product-hero"
import { Product, ProductWithRelations } from "@/types"

export const dynamic = 'force-dynamic'

interface ProductPageProps {
    params: Promise<{ slug: string }>
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

    // Casting to unknown first to avoid deep type mismatch during dev
    const product = productData as unknown as ProductWithRelations

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
            </div>
        </Container>
    )
}

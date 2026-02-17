import { createServerClient } from "@/lib/supabase/server"
import { Container } from "@/components/ui/container"
import { ProductGrid } from "@/components/features/product/product-grid"
import { EmptyState } from "@/components/ui/empty-state"
import { ProductWithImages } from "@/types"

export const dynamic = 'force-dynamic'

export default async function ProductsPage() {
    const supabase = await createServerClient()

    const { data: products, error } = await supabase
        .from('products')
        .select('*, images:product_images(*)')
        .eq('is_active', true)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching products:', error)
        // In a real app, we might throw an error or show a specific error state
    }

    const typedProducts = (products as unknown as ProductWithImages[]) || []

    return (
        <Container>
            <div className="py-12 space-y-8">
                <div className="space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight">Our Products</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl">
                        Discover our range of natural hygiene products, crafted with care for your well-being.
                    </p>
                </div>

                {typedProducts.length > 0 ? (
                    <ProductGrid products={typedProducts} />
                ) : (
                    <EmptyState
                        title="No products available yet"
                        description="We are working hard to bring you the best natural products. Check back soon!"
                        actionLabel="Coming Soon"
                    />
                )}
            </div>
        </Container>
    )
}

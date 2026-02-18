import { Suspense } from "react"
import { createServerClient } from "@/lib/supabase/server"
import { Container } from "@/components/ui/container"
import { ProductGrid } from "@/components/features/product/product-grid"
import { ProductFilters } from "@/components/features/product/product-filters"
import { EmptyState } from "@/components/ui/empty-state"
import { ProductWithImages } from "@/types"
import { getWishlistIds } from "@/app/actions/wishlist"
import Link from "next/link"
import { X, ArrowRight } from "lucide-react"

export const dynamic = 'force-dynamic'

interface ProductsPageProps {
    searchParams: Promise<{
        search?: string
        category?: string
        minPrice?: string
        maxPrice?: string
        sort?: string
    }>
}

interface Category {
    id: string
    name: string
    slug: string
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
    const params = await searchParams
    const searchQuery = params.search?.trim() || ""
    const categoryFilter = params.category?.trim() || ""
    const minPrice = params.minPrice ? parseFloat(params.minPrice) : null
    const maxPrice = params.maxPrice ? parseFloat(params.maxPrice) : null
    const sortBy = params.sort?.trim() || ""

    const supabase = await createServerClient()

    // Build query
    let query = supabase
        .from('products')
        .select('*, images:product_images(*)')
        .eq('is_active', true)

    if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,sku.ilike.%${searchQuery}%`)
    }

    if (categoryFilter) {
        const { data: cat } = await supabase
            .from('categories')
            .select('id')
            .eq('slug', categoryFilter)
            .maybeSingle()

        if (cat) {
            query = query.eq('category_id', cat.id)
        }
    }

    if (minPrice !== null) {
        query = query.gte('base_price', minPrice)
    }
    if (maxPrice !== null) {
        query = query.lte('base_price', maxPrice)
    }

    // Sorting
    switch (sortBy) {
        case "price_asc":
            query = query.order('base_price', { ascending: true })
            break
        case "price_desc":
            query = query.order('base_price', { ascending: false })
            break
        case "newest":
            query = query.order('created_at', { ascending: false })
            break
        case "name_asc":
            query = query.order('name', { ascending: true })
            break
        case "name_desc":
            query = query.order('name', { ascending: false })
            break
        default:
            query = query
                .order('is_featured', { ascending: false })
                .order('created_at', { ascending: false })
    }

    const { data: products, error } = await query

    if (error) {
        console.error('Error fetching products:', error)
    }

    // Fetch categories
    const { data: categories } = await supabase
        .from('categories')
        .select('id, name, slug')
        .eq('is_active', true)
        .order('display_order', { ascending: true })

    // Count products per category (from ALL active products, ignoring current filters)
    const { data: allProducts } = await supabase
        .from('products')
        .select('category_id')
        .eq('is_active', true)

    const allCategories = (categories as Category[]) || []
    const allProds = allProducts || []

    const categoriesWithCount = allCategories.map((cat) => ({
        ...cat,
        productCount: allProds.filter((p) => p.category_id === cat.id).length,
    }))

    // Get wishlist IDs
    const { ids: wishlistIds } = await getWishlistIds()

    const typedProducts = (products as unknown as ProductWithImages[]) || []

    // Determine if we should show grouped or flat view
    const isFiltered = !!(searchQuery || categoryFilter || minPrice || maxPrice || sortBy)

    // Group products by category when unfiltered
    const groupedProducts: { category: Category | null; products: ProductWithImages[] }[] = []

    if (!isFiltered && allCategories.length > 0) {
        for (const cat of allCategories) {
            const catProducts = typedProducts.filter((p) => p.category_id === cat.id)
            if (catProducts.length > 0) {
                groupedProducts.push({ category: cat, products: catProducts })
            }
        }
        const uncategorized = typedProducts.filter(
            (p) => !p.category_id || !allCategories.some((c) => c.id === p.category_id)
        )
        if (uncategorized.length > 0) {
            groupedProducts.push({ category: null, products: uncategorized })
        }
    }

    return (
        <Container>
            <div className="py-12 space-y-8">
                {/* Page Header */}
                <div className="space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight">
                        {searchQuery ? "Search Results" : "Our Products"}
                    </h1>
                    {searchQuery ? (
                        <div className="flex items-center gap-3">
                            <p className="text-lg text-muted-foreground">
                                {typedProducts.length} result{typedProducts.length !== 1 ? "s" : ""} for &ldquo;{searchQuery}&rdquo;
                            </p>
                            <Link
                                href="/products"
                                className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-medium"
                            >
                                <X className="h-3.5 w-3.5" /> Clear
                            </Link>
                        </div>
                    ) : (
                        <p className="text-xl text-muted-foreground max-w-2xl">
                            Discover our range of natural hygiene products, crafted with care for your well-being.
                        </p>
                    )}
                </div>

                {/* Mobile filter button */}
                <div className="lg:hidden">
                    <Suspense>
                        <ProductFilters categories={categoriesWithCount} />
                    </Suspense>
                </div>

                {/* Content area with sidebar */}
                <div className="flex gap-8">
                    {/* Desktop sidebar */}
                    <Suspense>
                        <div className="hidden lg:block">
                            <ProductFilters categories={categoriesWithCount} />
                        </div>
                    </Suspense>

                    {/* Products */}
                    <div className="flex-1 min-w-0">
                        {typedProducts.length === 0 ? (
                            <EmptyState
                                title={searchQuery ? "No products found" : "No products match these filters"}
                                description={searchQuery
                                    ? `We couldn't find any products matching "${searchQuery}". Try a different search term.`
                                    : "Try adjusting your filters or clearing them to see all products."}
                                actionLabel="Clear Filters"
                                actionHref="/products"
                            />
                        ) : isFiltered ? (
                            <div className="space-y-4">
                                <p className="text-sm text-muted-foreground">
                                    Showing {typedProducts.length} product{typedProducts.length !== 1 ? "s" : ""}
                                </p>
                                <ProductGrid products={typedProducts} wishlistIds={wishlistIds} />
                            </div>
                        ) : groupedProducts.length > 0 ? (
                            <div className="space-y-16">
                                {groupedProducts.map((group) => (
                                    <section key={group.category?.id || "uncategorized"}>
                                        <div className="flex items-end justify-between mb-6">
                                            <div>
                                                <h2 className="text-2xl font-heading font-bold text-neutral-900">
                                                    {group.category?.name || "Other Products"}
                                                </h2>
                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    {group.products.length} product{group.products.length !== 1 ? "s" : ""}
                                                </p>
                                            </div>
                                            {group.category && (
                                                <Link
                                                    href={`/products?category=${group.category.slug}`}
                                                    className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
                                                >
                                                    View all <ArrowRight className="h-3.5 w-3.5" />
                                                </Link>
                                            )}
                                        </div>
                                        <ProductGrid products={group.products} wishlistIds={wishlistIds} />
                                    </section>
                                ))}
                            </div>
                        ) : (
                            <ProductGrid products={typedProducts} wishlistIds={wishlistIds} />
                        )}
                    </div>
                </div>
            </div>
        </Container>
    )
}

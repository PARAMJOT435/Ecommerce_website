import { createServerClient } from "@/lib/supabase/server";
import { Hero } from "@/components/features/home/hero";
import { HeroScrollSnap } from "@/components/features/home/hero-scroll-snap";
import { TrustBadges } from "@/components/features/home/trust-badges";
import { ModernProductsShowcase } from "@/components/features/home/modern-products-showcase";
import { ProductWithImages } from "@/types";
import { getWishlistIds } from "@/app/actions/wishlist";

export default async function HomePage() {
    const supabase = await createServerClient();

    // Fetch featured products from DB
    const { data: products } = await supabase
        .from("products")
        .select("*, images:product_images(*)")
        .eq("is_active", true)
        .eq("is_featured", true)
        .order("created_at", { ascending: false })
        .limit(50);

    const featuredProducts = (products as unknown as ProductWithImages[]) || [];

    // Fetch all categories with their products
    const { data: categories } = await supabase
        .from("categories")
        .select("id, name, slug")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

    // Group featured products by category
    const productsByCategory = (categories || []).map((category: any) => ({
        categoryName: category.name,
        categorySlug: category.slug,
        products: featuredProducts.filter((p) => p.category_id === category.id),
    })).filter((cat) => cat.products.length > 0);

    // Get wishlist IDs for logged-in user
    const { ids: wishlistIds } = await getWishlistIds();

    // Get the best-selling product (or first featured product)
    const featuredProduct = featuredProducts[0] || null;

    return (
        <main className="relative">
            <HeroScrollSnap />
            <Hero />
            <ModernProductsShowcase
                productsByCategory={productsByCategory}
                featuredProduct={featuredProduct}
                wishlistIds={wishlistIds}
            />
            <div className="relative z-10 bg-neutral-50 py-16">
                <TrustBadges />
            </div>
        </main>
    );
}

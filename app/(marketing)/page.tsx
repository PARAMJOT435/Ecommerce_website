import { createServerClient } from "@/lib/supabase/server";
import { Hero } from "@/components/features/home/hero";
import { FeaturedProducts } from "@/components/features/home/featured-products";
import { TrustBadges } from "@/components/features/home/trust-badges";
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
        .limit(8);

    const featuredProducts = (products as unknown as ProductWithImages[]) || [];

    // Get wishlist IDs for logged-in user
    const { ids: wishlistIds } = await getWishlistIds();

    return (
        <main>
            <Hero />
            <FeaturedProducts
                products={featuredProducts}
                wishlistIds={wishlistIds}
                title="Featured Products"
                description="Discover our range of natural hygiene products"
                linkText="View All Products"
                linkHref="/products"
            />
            <TrustBadges />
        </main>
    );
}

import { Hero } from "@/components/features/home/hero";
import { FeaturedProducts } from "@/components/features/home/featured-products";
import { TrustBadges } from "@/components/features/home/trust-badges";
import { Product } from "@/types";

// Mock Data
// Mock Data
const featuredProducts: any[] = [
    {
        id: "1",
        name: "Anti-Dandruff Shampoo",
        slug: "anti-dandruff-shampoo",
        description: "Infused with Piroctone Olamine, Clove oil, Tea tree oil",
        base_price: 599,
        images: [
            {
                id: "img1",
                product_id: "1",
                image_url: "https://placehold.co/1000x1000/f0fdf4/16a34a?text=Anti-Dandruff+Shampoo",
                alt_text: "Anti-Dandruff Shampoo",
                display_order: 0,
                is_primary: true,
                created_at: new Date().toISOString()
            }
        ],
        certifications: ["paraben-free", "sulfate-free", "cruelty-free"],
        category_id: "cat1", // Category string in mock was "Hair Care", but interface expects ID. API returns relations. 
        // For mock, I'll allow extra props if I cast to any[], but let's try to match ProductWithImages as much as possible.
        // Product interface has category_id: string | null.
        stock_quantity: 100,
        sku: "ADS-001",
        is_active: true,
        is_featured: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        // Extra props for UI if component uses them (ProductCard might use extra props?)
        rating: 4.8,
        reviewCount: 156,
    },
    {
        id: "2",
        name: "Vitamin C Shower Gel",
        slug: "vitamin-c-shower-gel",
        description: "Infused with Vitamin C, Hyaluronic Acid, Pomegranate Extract",
        base_price: 329,
        images: [
            {
                id: "img2",
                product_id: "2",
                image_url: "https://placehold.co/1000x1000/fff7ed/f97316?text=Vitamin+C+Shower+Gel",
                alt_text: "Vitamin C Shower Gel",
                display_order: 0,
                is_primary: true,
                created_at: new Date().toISOString()
            }
        ],
        certifications: ["paraben-free", "sulfate-free", "cruelty-free"],
        category_id: "cat2",
        stock_quantity: 50,
        sku: "VSG-002",
        is_active: true,
        is_featured: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        rating: 4.9,
        reviewCount: 89,
    },
    {
        id: "3",
        name: "24k Gold Face Wash",
        slug: "24k-gold-face-wash",
        description: "99.9% pure Gold infused with Licorice, Turmeric & Neem",
        base_price: 379,
        images: [
            {
                id: "img3",
                product_id: "3",
                image_url: "https://placehold.co/1000x1000/fffbeb/f59e0b?text=24k+Gold+Face+Wash",
                alt_text: "24k Gold Face Wash",
                display_order: 0,
                is_primary: true,
                created_at: new Date().toISOString()
            }
        ],
        certifications: ["paraben-free", "sulfate-free", "gmp-certified"],
        category_id: "cat3",
        stock_quantity: 75,
        sku: "GFW-003",
        is_active: true,
        is_featured: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        rating: 4.7,
        reviewCount: 234,
    },
    {
        id: "4",
        name: "Safe Life Sanitary Pads",
        slug: "safe-life-sanitary-pads",
        description: "Natural Cotton, Antibacterial, Odour control & breathable",
        base_price: 149,
        images: [
            {
                id: "img4",
                product_id: "4",
                image_url: "https://placehold.co/1000x1000/f7fee7/84cc16?text=Safe+Life+Pads",
                alt_text: "Safe Life Sanitary Pads",
                display_order: 0,
                is_primary: true,
                created_at: new Date().toISOString()
            }
        ],
        certifications: ["natural", "sulfate-free"],
        category_id: "cat4",
        stock_quantity: 200,
        sku: "SLP-004",
        is_active: true,
        is_featured: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        rating: 4.9,
        reviewCount: 512,
    },
];

export default function HomePage() {
    return (
        <main>
            <Hero />
            <FeaturedProducts
                products={featuredProducts}
                title="Featured Products"
                description="Discover our range of natural hygiene products"
                linkText="View All Products"
                linkHref="/products"
            />
            <TrustBadges />
        </main>
    );
}

import { Hero } from "@/components/features/home/hero";
import { FeaturedProducts } from "@/components/features/home/featured-products";
import { TrustBadges } from "@/components/features/home/trust-badges";
import { Product } from "@/types";

// Mock Data
const featuredProducts: Product[] = [
    {
        id: "1",
        name: "Anti-Dandruff Shampoo",
        slug: "anti-dandruff-shampoo",
        description: "Infused with Piroctone Olamine, Clove oil, Tea tree oil",
        price: 599,
        images: [
            "https://placehold.co/1000x1000/f0fdf4/16a34a?text=Anti-Dandruff+Shampoo",
        ],
        certifications: ["paraben-free", "sulfate-free", "cruelty-free"],
        category: "Hair Care",
        rating: 4.8,
        reviewCount: 156,
        inStock: true,
    },
    {
        id: "2",
        name: "Vitamin C Shower Gel",
        slug: "vitamin-c-shower-gel",
        description: "Infused with Vitamin C, Hyaluronic Acid, Pomegranate Extract",
        price: 329,
        images: [
            "https://placehold.co/1000x1000/fff7ed/f97316?text=Vitamin+C+Shower+Gel",
        ],
        certifications: ["paraben-free", "sulfate-free", "cruelty-free"],
        category: "Body Care",
        rating: 4.9,
        reviewCount: 89,
        inStock: true,
    },
    {
        id: "3",
        name: "24k Gold Face Wash",
        slug: "24k-gold-face-wash",
        description: "99.9% pure Gold infused with Licorice, Turmeric & Neem",
        price: 379,
        images: [
            "https://placehold.co/1000x1000/fffbeb/f59e0b?text=24k+Gold+Face+Wash",
        ],
        certifications: ["paraben-free", "sulfate-free", "gmp-certified"],
        category: "Face Care",
        rating: 4.7,
        reviewCount: 234,
        inStock: true,
    },
    {
        id: "4",
        name: "Safe Life Sanitary Pads",
        slug: "safe-life-sanitary-pads",
        description: "Natural Cotton, Antibacterial, Odour control & breathable",
        price: 149,
        images: ["https://placehold.co/1000x1000/f7fee7/84cc16?text=Safe+Life+Pads"],
        certifications: ["natural", "sulfate-free"],
        category: "Feminine Hygiene",
        rating: 4.9,
        reviewCount: 512,
        inStock: true,
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

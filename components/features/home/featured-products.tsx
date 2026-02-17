import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductWithImages } from "@/types";
import { Container } from "@/components/ui/container";
import { ProductGrid } from "@/components/features/product/product-grid";
import { Button } from "@/components/ui/button";

interface FeaturedProductsProps {
    products: ProductWithImages[];
    title?: string;
    description?: string;
    linkText?: string;
    linkHref?: string;
}

export function FeaturedProducts({
    products,
    title = "Featured Products",
    description = "Our most popular picks for you.",
    linkText = "View All",
    linkHref = "/products",
}: FeaturedProductsProps) {
    return (
        <section className="py-16 md:py-24">
            <Container>
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                    <div>
                        <h2 className="font-heading text-3xl font-bold text-neutral-900">
                            {title}
                        </h2>
                        {description && (
                            <p className="mt-2 text-neutral-600 max-w-2xl">{description}</p>
                        )}
                    </div>
                    {linkHref && (
                        <Button variant="ghost" className="group" asChild>
                            <Link href={linkHref}>
                                {linkText}
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </Button>
                    )}
                </div>

                <ProductGrid products={products} columns={4} />
            </Container>
        </section>
    );
}

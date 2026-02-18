import { ProductWithImages } from "@/types";
import { ProductCard } from "@/components/features/product/product-card";
import { cn } from "@/lib/utils";

interface ProductGridProps {
    products: ProductWithImages[];
    columns?: 2 | 3 | 4;
    className?: string;
    wishlistIds?: string[];
}

export function ProductGrid({ products, columns = 3, className, wishlistIds = [] }: ProductGridProps) {
    const gridCols = {
        2: "sm:grid-cols-2",
        3: "sm:grid-cols-2 lg:grid-cols-3",
        4: "sm:grid-cols-2 lg:grid-cols-4",
    };

    return (
        <div className={cn("grid grid-cols-1 gap-6", gridCols[columns], className)}>
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    isWishlisted={wishlistIds.includes(product.id)}
                />
            ))}
        </div>
    );
}

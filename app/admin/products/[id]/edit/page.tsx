import { notFound } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { ProductForm } from "../../_components/product-form"
import { ProductWithRelations, Category } from "@/types"

interface EditProductPageProps {
    params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: EditProductPageProps) {
    const { id } = await params
    const supabase = await createServerClient()

    const { data: product, error } = await supabase
        .from("products")
        .select("*, images:product_images(*)")
        .eq("id", id)
        .single()

    if (error || !product) {
        notFound()
    }

    const { data: categories } = await supabase
        .from("categories")
        .select("*")
        .order("name")

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center">
                <h1 className="text-2xl font-bold tracking-tight">Edit Product</h1>
            </div>
            <div className="border rounded-lg p-6 bg-card">
                <ProductForm
                    initialData={product as unknown as ProductWithRelations}
                    categories={(categories as unknown as Category[]) || []}
                />
            </div>
        </div>
    )
}

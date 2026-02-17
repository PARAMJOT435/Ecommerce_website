import { createServerClient } from "@/lib/supabase/server"
import { ProductForm } from "../_components/product-form"
import { Category } from "@/types"

export default async function NewProductPage() {
    const supabase = await createServerClient()

    const { data: categories } = await supabase
        .from("categories")
        .select("*")
        .order("name")

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center">
                <h1 className="text-2xl font-bold tracking-tight">New Product</h1>
            </div>
            <div className="border rounded-lg p-6 bg-card">
                <ProductForm categories={(categories as unknown as Category[]) || []} />
            </div>
        </div>
    )
}

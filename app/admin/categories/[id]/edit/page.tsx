import { notFound } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { updateCategory, getAdminCategories } from "@/app/actions/admin-categories"
import { CategoryForm } from "../../_components/category-form"

interface EditCategoryPageProps {
    params: Promise<{ id: string }>
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
    const { id } = await params
    const supabase = await createServerClient()

    const { data: category, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single()

    if (!category || error) notFound()

    const { categories } = await getAdminCategories()
    // Exclude self from parent options
    const parentOptions = categories.filter((c: any) => c.id !== id).map((c: any) => ({ id: c.id, name: c.name }))

    async function handleUpdate(formData: FormData) {
        "use server"
        return updateCategory(id, formData)
    }

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-bold tracking-tight">Edit Category</h1>
            <CategoryForm
                categories={parentOptions}
                action={handleUpdate}
                defaultValues={{
                    name: category.name,
                    description: category.description || "",
                    parent_id: category.parent_id || "",
                    display_order: category.display_order,
                }}
            />
        </div>
    )
}

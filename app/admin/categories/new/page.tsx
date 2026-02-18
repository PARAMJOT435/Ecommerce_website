import { createCategory, getAdminCategories } from "@/app/actions/admin-categories"
import { CategoryForm } from "../_components/category-form"

export default async function NewCategoryPage() {
    const { categories } = await getAdminCategories()

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-bold tracking-tight">New Category</h1>
            <CategoryForm
                categories={categories.map((c: any) => ({ id: c.id, name: c.name }))}
                action={createCategory}
            />
        </div>
    )
}

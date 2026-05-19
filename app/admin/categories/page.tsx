import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, Power, FolderTree } from "lucide-react"
import { getAdminCategories, deleteCategory, toggleCategoryStatus } from "@/app/actions/admin-categories"

export const dynamic = 'force-dynamic'

export default async function AdminCategoriesPage() {
    const { categories, error } = await getAdminCategories()

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-xl font-bold sm:text-2xl tracking-tight">Categories</h1>
                <Button asChild size="sm" className="w-full sm:w-auto">
                    <Link href="/admin/categories/new">
                        <Plus className="mr-2 h-4 w-4" /> New Category
                    </Link>
                </Button>
            </div>

            {error && (
                <div className="rounded-md bg-red-50 border border-red-200 p-3 text-xs sm:text-sm text-red-700">{error}</div>
            )}

            <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-xs sm:text-sm">Name</TableHead>
                                <TableHead className="hidden sm:table-cell text-xs sm:text-sm">Slug</TableHead>
                                <TableHead className="hidden md:table-cell text-xs sm:text-sm">Parent</TableHead>
                                <TableHead className="text-xs sm:text-sm">Order</TableHead>
                                <TableHead className="hidden sm:table-cell text-xs sm:text-sm">Status</TableHead>
                                <TableHead className="text-right text-xs sm:text-sm">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categories.map((cat: any) => (
                                <TableRow key={cat.id}>
                                    <TableCell className="font-medium text-xs sm:text-sm min-w-0">{cat.name}</TableCell>
                                    <TableCell className="hidden sm:table-cell text-xs text-muted-foreground font-mono">{cat.slug}</TableCell>
                                    <TableCell className="hidden md:table-cell text-xs sm:text-sm text-muted-foreground">{cat.parent?.name || "—"}</TableCell>
                                    <TableCell className="text-xs sm:text-sm">{cat.display_order}</TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        <Badge variant={cat.is_active ? "default" : "secondary"} className="text-xs">
                                            {cat.is_active ? "Active" : "Inactive"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right py-2">
                                        <div className="flex justify-end gap-1">
                                            <form action={async () => { "use server"; await toggleCategoryStatus(cat.id, cat.is_active) }}>
                                                <Button variant="ghost" size="sm" title={cat.is_active ? "Deactivate" : "Activate"}>
                                                    <Power className={`h-4 w-4 ${cat.is_active ? "text-green-600" : "text-muted-foreground"}`} />
                                                </Button>
                                            </form>
                                            <Button variant="ghost" size="sm" asChild>
                                                <Link href={`/admin/categories/${cat.id}/edit`}><Edit className="h-4 w-4" /></Link>
                                            </Button>
                                            <form action={async () => { "use server"; await deleteCategory(cat.id) }}>
                                                <Button variant="ghost" size="sm" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                                            </form>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {categories.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-12">
                                        <FolderTree className="mx-auto h-10 w-10 text-neutral-300 mb-2" />
                                        <p className="text-xs sm:text-sm text-muted-foreground">No categories yet</p>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}

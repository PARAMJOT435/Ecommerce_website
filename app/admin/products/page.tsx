import Link from "next/link"
import { createServerClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Edit, Plus, Trash2, Power } from "lucide-react"
import { ProductImage } from "@/components/ui/product-image"
import { PriceDisplay } from "@/components/ui/price-display"
import { deleteProduct, toggleProductStatus } from "@/app/actions/admin"

export const dynamic = 'force-dynamic'

export default async function AdminProductsPage() {
    const supabase = await createServerClient()

    const { data: products, error } = await supabase
        .from('products')
        .select('*, images:product_images(*)')
        .order('created_at', { ascending: false })

    if (error) {
        console.error("Error fetching products:", error)
        return <div>Error loading products.</div>
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Products</h1>
                <Button asChild>
                    <Link href="/admin/products/new">
                        <Plus className="mr-2 h-4 w-4" />
                        New Product
                    </Link>
                </Button>
            </div>

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Image</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>SKU</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products?.map((product) => {
                            // Safe access to image
                            const mainImage = product.images?.[0]?.image_url

                            return (
                                <TableRow key={product.id}>
                                    <TableCell>
                                        <div className="h-12 w-12 overflow-hidden rounded-md border bg-muted/50">
                                            <ProductImage
                                                src={mainImage}
                                                alt={product.name}
                                                aspectRatio="square"
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">{product.name}</TableCell>
                                    <TableCell>{product.sku}</TableCell>
                                    <TableCell>
                                        <PriceDisplay amount={product.base_price} />
                                    </TableCell>
                                    <TableCell>{product.stock_quantity}</TableCell>
                                    <TableCell>
                                        <Badge variant={product.is_active ? "default" : "secondary"}>
                                            {product.is_active ? "Active" : "Draft"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <form action={async () => {
                                                "use server"
                                                await toggleProductStatus(product.id, product.is_active)
                                            }}>
                                                <Button variant="ghost" size="icon" title={product.is_active ? "Deactivate" : "Activate"}>
                                                    <Power className={`h-4 w-4 ${product.is_active ? "text-green-600" : "text-muted-foreground"}`} />
                                                </Button>
                                            </form>
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={`/admin/products/${product.id}/edit`}>
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <form action={async () => {
                                                "use server"
                                                await deleteProduct(product.id)
                                            }}>
                                                <Button variant="ghost" size="icon" className="text-destructive">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </form>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                        {products?.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                    No products found. Create one to get started.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}


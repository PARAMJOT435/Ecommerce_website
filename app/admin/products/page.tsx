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
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-xl font-bold sm:text-2xl tracking-tight">Products</h1>
                <Button asChild size="sm" className="w-full sm:w-auto">
                    <Link href="/admin/products/new">
                        <Plus className="mr-2 h-4 w-4" />
                        New Product
                    </Link>
                </Button>
            </div>

            {/* Mobile: Card View | Desktop: Table View */}
            <div className="block md:hidden">
                <div className="space-y-3">
                    {products?.map((product) => {
                        const mainImage = product.images?.[0]?.image_url
                        return (
                            <div key={product.id} className="border rounded-lg p-3 space-y-2">
                                <div className="flex gap-3">
                                    <div className="h-16 w-16 shrink-0 rounded-md overflow-hidden bg-muted/50">
                                        <ProductImage
                                            src={mainImage}
                                            alt={product.name}
                                            aspectRatio="square"
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm truncate">{product.name}</p>
                                        <p className="text-xs text-muted-foreground">{product.sku}</p>
                                        <p className="text-sm font-semibold mt-1">
                                            <PriceDisplay amount={product.base_price} />
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between gap-2 pt-2 border-t">
                                    <div className="flex items-center gap-2">
                                        <Badge variant={product.is_active ? "default" : "secondary"} className="text-xs">
                                            {product.is_active ? "Active" : "Draft"}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">Stock: {product.stock_quantity}</span>
                                    </div>
                                    <div className="flex gap-1">
                                        <form action={async () => {
                                            "use server"
                                            await toggleProductStatus(product.id, product.is_active)
                                        }}>
                                            <Button variant="ghost" size="sm" title={product.is_active ? "Deactivate" : "Activate"}>
                                                <Power className={`h-3 w-3 ${product.is_active ? "text-green-600" : "text-muted-foreground"}`} />
                                            </Button>
                                        </form>
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/admin/products/${product.id}/edit`}>
                                                <Edit className="h-3 w-3" />
                                            </Link>
                                        </Button>
                                        <form action={async () => {
                                            "use server"
                                            await deleteProduct(product.id)
                                        }}>
                                            <Button variant="ghost" size="sm" className="text-destructive">
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                    {products?.length === 0 && (
                        <div className="text-center py-8 text-sm text-muted-foreground">
                            No products found. Create one to get started.
                        </div>
                    )}
                </div>
            </div>

            {/* Desktop: Table View */}
            <div className="hidden md:block border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">Image</TableHead>
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
                                const mainImage = product.images?.[0]?.image_url

                                return (
                                    <TableRow key={product.id}>
                                        <TableCell className="py-2">
                                            <div className="h-10 w-10 overflow-hidden rounded-md border bg-muted/50">
                                                <ProductImage
                                                    src={mainImage}
                                                    alt={product.name}
                                                    aspectRatio="square"
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium text-sm">{product.name}</TableCell>
                                        <TableCell className="text-sm">{product.sku}</TableCell>
                                        <TableCell className="text-sm font-medium">
                                            <PriceDisplay amount={product.base_price} />
                                        </TableCell>
                                        <TableCell className="text-sm">{product.stock_quantity}</TableCell>
                                        <TableCell>
                                            <Badge variant={product.is_active ? "default" : "secondary"} className="text-xs">
                                                {product.is_active ? "Active" : "Draft"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right py-2">
                                            <div className="flex justify-end gap-1">
                                                <form action={async () => {
                                                    "use server"
                                                    await toggleProductStatus(product.id, product.is_active)
                                                }}>
                                                    <Button variant="ghost" size="sm" title={product.is_active ? "Deactivate" : "Activate"}>
                                                        <Power className={`h-4 w-4 ${product.is_active ? "text-green-600" : "text-muted-foreground"}`} />
                                                    </Button>
                                                </form>
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link href={`/admin/products/${product.id}/edit`}>
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <form action={async () => {
                                                    "use server"
                                                    await deleteProduct(product.id)
                                                }}>
                                                    <Button variant="ghost" size="sm" className="text-destructive">
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
                                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground text-sm">
                                        No products found. Create one to get started.
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


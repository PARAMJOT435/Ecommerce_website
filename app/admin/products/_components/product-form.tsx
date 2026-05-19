"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { ProductWithRelations, Category } from "@/types"
import { createProduct, updateProduct } from "@/app/actions/admin"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { ImageUpload } from "@/components/ui/image-upload"

const productSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    description: z.string().optional(),
    base_price: z.coerce.number().min(0, "Price must be positive"),
    stock_quantity: z.coerce.number().int().min(0, "Stock must be non-negative"),
    sku: z.string().min(3, "SKU is required"),
    specifications: z.string().optional(),
    is_quote_only: z.boolean().default(false),
    is_active: z.boolean().default(true),
    is_featured: z.boolean().default(false),
    category_id: z.string().optional(),
    image: z.union([z.instanceof(File), z.string()]).optional().nullable(),
})

type ProductFormValues = z.infer<typeof productSchema>

interface ProductFormProps {
    initialData?: ProductWithRelations | null
    categories: Category[]
}

export function ProductForm({ initialData, categories }: ProductFormProps) {
    const router = useRouter()

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema as any),
        defaultValues: {
            name: initialData?.name || "",
            description: initialData?.description || "",
            base_price: initialData?.base_price ?? 0,
            stock_quantity: initialData?.stock_quantity ?? 0,
            sku: initialData?.sku || "",
            specifications: initialData?.specifications ? JSON.stringify(initialData.specifications, null, 2) : "{\n  \n}",
            is_quote_only: initialData?.is_quote_only ?? false,
            is_active: initialData?.is_active ?? true,
            is_featured: initialData?.is_featured ?? false,
            category_id: initialData?.category_id || "",
            image: initialData?.images?.[0]?.image_url || null,
        },
    })

    async function onSubmit(data: ProductFormValues) {
        const formData = new FormData()
        Object.entries(data).forEach(([key, value]) => {
            // Skip image field, we handle it separately
            if (key === "image") return

            // Always include booleans and numbers (even 0 / false)
            if (typeof value === "boolean" || typeof value === "number") {
                formData.append(key, value.toString())
            } else if (value !== undefined && value !== null && value !== "") {
                formData.append(key, value.toString())
            }
        })

        // Handle image
        if (data.image instanceof File) {
            formData.append("imageFile", data.image)
        } else if (typeof data.image === "string") {
            formData.append("imageUrl", data.image)
        }

        try {
            if (initialData) {
                const result = await updateProduct(initialData.id, formData)
                if (result?.error) {
                    toast.error(result.error)
                    return
                }
            } else {
                const result = await createProduct(formData)
                if (result?.error) {
                    toast.error(result.error)
                    return
                }
            }
            // redirect() in server actions throws NEXT_REDIRECT, which is fine
        } catch (error: any) {
            // Re-throw Next.js redirect errors — they are NOT real errors
            if (error?.digest?.startsWith("NEXT_REDIRECT")) {
                throw error
            }
            toast.error("Something went wrong")
            console.error(error)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
                <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Product Name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="sku"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>SKU</FormLabel>
                                <FormControl>
                                    <Input placeholder="SKU-123" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Product description" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="base_price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Price</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.01" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="stock_quantity"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Stock</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="category_id"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem key={category.id} value={category.id}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Product Image</FormLabel>
                            <FormControl>
                                <ImageUpload
                                    value={field.value || null}
                                    onChange={field.onChange}
                                />
                            </FormControl>
                            <FormDescription>
                                Upload a product image. Max 5MB.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="specifications"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Technical Specifications (JSON format)</FormLabel>
                            <FormControl>
                                <Textarea 
                                    className="font-mono h-32" 
                                    placeholder='{\n  "Voltage": "220V",\n  "Weight": "400 lbs"\n}' 
                                    {...field} 
                                />
                            </FormControl>
                            <FormDescription>
                                Enter specifications as valid JSON.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                        <FormLabel className="text-base">Active Status</FormLabel>
                        <FormDescription>
                            Visible in the store
                        </FormDescription>
                    </div>
                    <FormField
                        control={form.control}
                        name="is_active"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                        <FormLabel className="text-base">Featured Product</FormLabel>
                        <FormDescription>
                            Show on homepage
                        </FormDescription>
                    </div>
                    <FormField
                        control={form.control}
                        name="is_featured"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex flex-row items-center justify-between rounded-lg border p-4 border-amber-200 bg-amber-50/50">
                    <div className="space-y-0.5">
                        <FormLabel className="text-base text-amber-900">Request Quote Only (B2B)</FormLabel>
                        <FormDescription className="text-amber-700">
                            Hide "Add to Cart" and show "Request Quote" modal
                        </FormDescription>
                    </div>
                    <FormField
                        control={form.control}
                        name="is_quote_only"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button type="submit">
                        {initialData ? "Update Product" : "Create Product"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { Product } from "@/types"

// Helper to generate slug from name
function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "")
}

export async function createProduct(formData: FormData) {
    const supabase = await createServerClient()

    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const base_price = parseFloat(formData.get("base_price") as string)
    const stock_quantity = parseInt(formData.get("stock_quantity") as string)
    const sku = formData.get("sku") as string
    const is_active = formData.get("is_active") === "true"
    const is_featured = formData.get("is_featured") === "true"
    const category_id = formData.get("category_id") as string
    const imageUrl = formData.get("imageUrl") as string

    const slug = generateSlug(name)

    // 1. Insert Product
    const { data: product, error: productError } = await supabase
        .from("products")
        .insert({
            name,
            slug,
            description,
            base_price,
            stock_quantity,
            sku,
            is_active,
            is_featured,
            category_id: category_id || null,
            // Default values for other fields
            ingredients: formData.get("ingredients") as string,
            benefits: formData.get("benefits") as string,
        })
        .select()
        .single()

    if (productError) {
        console.error("Error creating product:", productError)
        return { error: "Failed to create product" }
    }

    // 2. Insert Image if provided
    if (imageUrl) {
        const { error: imageError } = await supabase
            .from("product_images")
            .insert({
                product_id: product.id,
                image_url: imageUrl,
                alt_text: name,
                display_order: 0,
                is_primary: true
            })

        if (imageError) {
            console.error("Error creating product image:", imageError)
            // We don't rollback product creation, just log error
        }
    }

    revalidatePath("/admin/products")
    revalidatePath("/admin/dashboard")
    redirect("/admin/products")
}

export async function updateProduct(id: string, formData: FormData) {
    const supabase = await createServerClient()

    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const base_price = parseFloat(formData.get("base_price") as string)
    const stock_quantity = parseInt(formData.get("stock_quantity") as string)
    const sku = formData.get("sku") as string
    const is_active = formData.get("is_active") === "true"
    const is_featured = formData.get("is_featured") === "true"
    const category_id = formData.get("category_id") as string
    const imageUrl = formData.get("imageUrl") as string

    // Update Product
    const { error: productError } = await supabase
        .from("products")
        .update({
            name,
            description,
            base_price,
            stock_quantity,
            sku,
            is_active,
            is_featured,
            category_id: category_id || null,
            ingredients: formData.get("ingredients") as string,
            benefits: formData.get("benefits") as string,
            updated_at: new Date().toISOString()
        })
        .eq("id", id)

    if (productError) {
        console.error("Error updating product:", productError)
        return { error: "Failed to update product" }
    }

    // Handle Image Update (Simplified: If new URL provided, update primary image or insert new one)
    // In a real app, we'd handle multiple images better.
    if (imageUrl) {
        // Check if there's an existing primary image
        const { data: existingImages } = await supabase
            .from("product_images")
            .select("id")
            .eq("product_id", id)
            .eq("is_primary", true)
            .single()

        if (existingImages) {
            await supabase
                .from("product_images")
                .update({ image_url: imageUrl })
                .eq("id", existingImages.id)
        } else {
            await supabase
                .from("product_images")
                .insert({
                    product_id: id,
                    image_url: imageUrl,
                    alt_text: name,
                    display_order: 0,
                    is_primary: true
                })
        }
    }

    revalidatePath("/admin/products")
    revalidatePath(`/admin/products/${id}/edit`)
    redirect("/admin/products")
}

export async function deleteProduct(id: string) {
    const supabase = await createServerClient()

    const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id)

    if (error) {
        console.error("Error deleting product:", error)
        return { error: "Failed to delete product" }
    }

    revalidatePath("/admin/products")
    revalidatePath("/admin/dashboard")
}

export async function toggleProductStatus(id: string, isActive: boolean) {
    const supabase = await createServerClient()

    const { error } = await supabase
        .from("products")
        .update({ is_active: !isActive })
        .eq("id", id)

    if (error) {
        console.error("Error toggling product status:", error)
        return { error: "Failed to update status" }
    }

    revalidatePath("/admin/products")
}

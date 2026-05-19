"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { Product } from "@/types"
import { getAdminClient } from "./utils"

// Helper to generate slug from name
function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "")
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "")
}



async function uploadProductImage(file: File, supabase: any) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${crypto.randomUUID()}.${fileExt}`
    const filePath = `${fileName}`

    const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file)

    if (uploadError) {
        console.error('Error uploading image:', uploadError)
        return null
    }

    const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath)

    return publicUrl
}

export async function createProduct(formData: FormData) {
    try {
        const { supabase } = await getAdminClient()

        const name = formData.get("name") as string
        const description = formData.get("description") as string
        const base_price = parseFloat(formData.get("base_price") as string)
        const stock_quantity = parseInt(formData.get("stock_quantity") as string)
        const sku = formData.get("sku") as string
        const is_active = formData.get("is_active") === "true"
        const is_featured = formData.get("is_featured") === "true"
        const is_quote_only = formData.get("is_quote_only") === "true"
        const category_id = formData.get("category_id") as string
        const imageUrl = formData.get("imageUrl") as string
        const imageFile = formData.get("imageFile") as File | null
        
        let specifications = {}
        try {
            const specsRaw = formData.get("specifications") as string
            if (specsRaw && specsRaw.trim() !== "") {
                specifications = JSON.parse(specsRaw)
            }
        } catch (e) {
            console.error("Invalid JSON for specifications", e)
            return { error: "Specifications must be valid JSON" }
        }

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
                is_quote_only,
                category_id: category_id || null,
                specifications,
            })
            .select()
            .single()

        if (productError) {
            console.error("Error creating product:", productError)
            return { error: "Failed to create product" }
        }

        // 2. Insert Image if provided
        let finalImageUrl = imageUrl

        if (imageFile) {
            const uploadedUrl = await uploadProductImage(imageFile, supabase)
            if (uploadedUrl) {
                finalImageUrl = uploadedUrl
            }
        }

        if (finalImageUrl) {
            const { error: imageError } = await supabase
                .from("product_images")
                .insert({
                    product_id: product.id,
                    image_url: finalImageUrl,
                    alt_text: name,
                    display_order: 0,
                    is_primary: true
                })

            if (imageError) {
                console.error("Error creating product image:", imageError)
            }
        }

        revalidatePath("/admin/products")
        revalidatePath("/admin/dashboard")
        redirect("/admin/products")
    } catch (error: any) {
        if (error?.digest?.startsWith("NEXT_REDIRECT")) throw error
        console.error("Error creating product:", error)
        return { error: error.message || "Failed to create product" }
    }
}

export async function updateProduct(id: string, formData: FormData) {
    try {
        const { supabase } = await getAdminClient()

        const name = formData.get("name") as string
        const description = formData.get("description") as string
        const base_price = parseFloat(formData.get("base_price") as string)
        const stock_quantity = parseInt(formData.get("stock_quantity") as string)
        const sku = formData.get("sku") as string
        const is_active = formData.get("is_active") === "true"
        const is_featured = formData.get("is_featured") === "true"
        const is_quote_only = formData.get("is_quote_only") === "true"
        const category_id = formData.get("category_id") as string
        const imageUrl = formData.get("imageUrl") as string
        const imageFile = formData.get("imageFile") as File | null

        let specifications = {}
        try {
            const specsRaw = formData.get("specifications") as string
            if (specsRaw && specsRaw.trim() !== "") {
                specifications = JSON.parse(specsRaw)
            }
        } catch (e) {
            console.error("Invalid JSON for specifications", e)
            return { error: "Specifications must be valid JSON" }
        }

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
                is_quote_only,
                category_id: category_id || null,
                specifications,
                updated_at: new Date().toISOString()
            })
            .eq("id", id)

        if (productError) {
            console.error("Error updating product:", productError)
            return { error: "Failed to update product" }
        }

        // Handle Image Update (Simplified: If new URL provided, update primary image or insert new one)
        // In a real app, we'd handle multiple images better.
        // Handle Image Update
        let finalImageUrl = imageUrl

        if (imageFile) {
            const uploadedUrl = await uploadProductImage(imageFile, supabase)
            if (uploadedUrl) {
                finalImageUrl = uploadedUrl
            }
        }

        if (finalImageUrl) {
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
                    .update({ image_url: finalImageUrl })
                    .eq("id", existingImages.id)
            } else {
                await supabase
                    .from("product_images")
                    .insert({
                        product_id: id,
                        image_url: finalImageUrl,
                        alt_text: name,
                        display_order: 0,
                        is_primary: true
                    })
            }
        }

        revalidatePath("/admin/products")
        revalidatePath(`/admin/products/${id}/edit`)
        redirect("/admin/products")
    } catch (error: any) {
        if (error?.digest?.startsWith("NEXT_REDIRECT")) throw error
        console.error("Error updating product:", error)
        return { error: error.message || "Failed to update product" }
    }
}

export async function deleteProduct(id: string) {
    try {
        const { supabase } = await getAdminClient()

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
    } catch (error: any) {
        console.error("Error deleting product:", error)
        return { error: error.message || "Failed to delete product" }
    }
}

export async function toggleProductStatus(id: string, isActive: boolean) {
    try {
        const { supabase } = await getAdminClient()

        const { error } = await supabase
            .from("products")
            .update({ is_active: !isActive })
            .eq("id", id)

        if (error) {
            console.error("Error toggling product status:", error)
            return { error: "Failed to update status" }
        }

        revalidatePath("/admin/products")
    } catch (error: any) {
        console.error("Error toggling product status:", error)
        return { error: error.message || "Failed to update status" }
    }
}

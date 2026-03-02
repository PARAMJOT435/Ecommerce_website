'use server'

import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getAdminClient } from './utils'

function generateSlug(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
}

export async function getAdminCategories() {
    try {
        const { supabase } = await getAdminClient()
        const { data, error } = await supabase
            .from('categories')
            .select('*, parent:categories!parent_id(name)')
            .order('display_order', { ascending: true })

        if (error) return { categories: [], error: error.message }
        return { categories: data || [], error: null }
    } catch (error: any) {
        return { categories: [], error: error.message }
    }
}

export async function createCategory(formData: FormData) {
    try {
        const { supabase } = await getAdminClient()
        const name = formData.get('name') as string
        const description = formData.get('description') as string
        const parent_id = formData.get('parent_id') as string
        const display_order = parseInt(formData.get('display_order') as string) || 0

        const { error } = await supabase.from('categories').insert({
            name,
            slug: generateSlug(name),
            description: description || null,
            parent_id: parent_id || null,
            display_order,
            is_active: true,
        })

        if (error) return { error: error.message }
        revalidatePath('/admin/categories')
        redirect('/admin/categories')
    } catch (error: any) {
        if (error?.digest?.startsWith("NEXT_REDIRECT")) throw error
        return { error: error.message }
    }
}

export async function updateCategory(id: string, formData: FormData) {
    try {
        const { supabase } = await getAdminClient()
        const name = formData.get('name') as string
        const description = formData.get('description') as string
        const parent_id = formData.get('parent_id') as string
        const display_order = parseInt(formData.get('display_order') as string) || 0

        const { error } = await supabase.from('categories').update({
            name,
            slug: generateSlug(name),
            description: description || null,
            parent_id: parent_id || null,
            display_order,
            updated_at: new Date().toISOString(),
        }).eq('id', id)

        if (error) return { error: error.message }
        revalidatePath('/admin/categories')
        redirect('/admin/categories')
    } catch (error: any) {
        if (error?.digest?.startsWith("NEXT_REDIRECT")) throw error
        return { error: error.message }
    }
}

export async function deleteCategory(id: string) {
    try {
        const { supabase } = await getAdminClient()
        const { error } = await supabase.from('categories').delete().eq('id', id)
        if (error) return { error: error.message }
        revalidatePath('/admin/categories')
        return { error: null }
    } catch (error: any) {
        return { error: error.message }
    }
}

export async function toggleCategoryStatus(id: string, isActive: boolean) {
    try {
        const { supabase } = await getAdminClient()
        const { error } = await supabase.from('categories').update({ is_active: !isActive }).eq('id', id)
        if (error) return { error: error.message }
        revalidatePath('/admin/categories')
        return { error: null }
    } catch (error: any) {
        return { error: error.message }
    }
}

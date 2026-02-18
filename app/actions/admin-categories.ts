'use server'

import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

function generateSlug(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
}

export async function getAdminCategories() {
    const supabase = await createServerClient()
    const { data, error } = await supabase
        .from('categories')
        .select('*, parent:categories!parent_id(name)')
        .order('display_order', { ascending: true })

    if (error) return { categories: [], error: error.message }
    return { categories: data || [], error: null }
}

export async function createCategory(formData: FormData) {
    const supabase = await createServerClient()
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
}

export async function updateCategory(id: string, formData: FormData) {
    const supabase = await createServerClient()
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
}

export async function deleteCategory(id: string) {
    const supabase = await createServerClient()
    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (error) return { error: error.message }
    revalidatePath('/admin/categories')
    return { error: null }
}

export async function toggleCategoryStatus(id: string, isActive: boolean) {
    const supabase = await createServerClient()
    const { error } = await supabase.from('categories').update({ is_active: !isActive }).eq('id', id)
    if (error) return { error: error.message }
    revalidatePath('/admin/categories')
    return { error: null }
}

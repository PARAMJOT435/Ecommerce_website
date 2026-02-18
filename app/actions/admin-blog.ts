'use server'

import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

function generateSlug(title: string): string {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
}

export async function getAdminBlogPosts(status?: string) {
    const supabase = await createServerClient()

    let query = supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false })

    if (status && status !== 'all') {
        query = query.eq('status', status)
    }

    const { data, error } = await query
    if (error) return { posts: [], error: error.message }
    return { posts: data || [], error: null }
}

export async function createBlogPost(formData: FormData) {
    const supabase = await createServerClient()
    const title = formData.get('title') as string
    const excerpt = formData.get('excerpt') as string
    const content = formData.get('content') as string
    const featured_image = formData.get('featured_image') as string
    const postStatus = formData.get('status') as string || 'draft'

    const { data: { user } } = await supabase.auth.getUser()

    const { error } = await supabase.from('blog_posts').insert({
        title,
        slug: generateSlug(title),
        excerpt: excerpt || null,
        content,
        featured_image: featured_image || null,
        author_id: user?.id,
        status: postStatus,
        published_at: postStatus === 'published' ? new Date().toISOString() : null,
    })

    if (error) return { error: error.message }
    revalidatePath('/admin/blog')
    redirect('/admin/blog')
}

export async function updateBlogPost(id: string, formData: FormData) {
    const supabase = await createServerClient()
    const title = formData.get('title') as string
    const excerpt = formData.get('excerpt') as string
    const content = formData.get('content') as string
    const featured_image = formData.get('featured_image') as string
    const postStatus = formData.get('status') as string || 'draft'

    const updates: Record<string, any> = {
        title,
        slug: generateSlug(title),
        excerpt: excerpt || null,
        content,
        featured_image: featured_image || null,
        status: postStatus,
        updated_at: new Date().toISOString(),
    }

    if (postStatus === 'published') {
        // Only set published_at if not already published
        const { data: existing } = await supabase.from('blog_posts').select('published_at').eq('id', id).single()
        if (!existing?.published_at) {
            updates.published_at = new Date().toISOString()
        }
    }

    const { error } = await supabase.from('blog_posts').update(updates).eq('id', id)
    if (error) return { error: error.message }
    revalidatePath('/admin/blog')
    redirect('/admin/blog')
}

export async function deleteBlogPost(id: string) {
    const supabase = await createServerClient()
    const { error } = await supabase.from('blog_posts').delete().eq('id', id)
    if (error) return { error: error.message }
    revalidatePath('/admin/blog')
    return { error: null }
}

'use server'

import { createServerClient } from '@/lib/supabase/server'

export async function getBlogPosts() {
    const supabase = await createServerClient()

    const { data, error } = await supabase
        .from('blog_posts')
        .select(`
            *,
            author:admins(full_name)
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false })

    if (error) return { posts: [], error: error.message }
    return { posts: data || [], error: null }
}

export async function getBlogPostBySlug(slug: string) {
    const supabase = await createServerClient()

    const { data, error } = await supabase
        .from('blog_posts')
        .select(`
            *,
            author:admins(full_name)
        `)
        .eq('slug', slug)
        .eq('status', 'published')
        .single()

    if (error) return { post: null, error: error.message }
    return { post: data, error: null }
}

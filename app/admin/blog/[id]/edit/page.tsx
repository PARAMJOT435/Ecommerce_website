import { notFound } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { updateBlogPost } from "@/app/actions/admin-blog"
import { BlogPostForm } from "../../_components/blog-post-form"

interface EditBlogPostPageProps {
    params: Promise<{ id: string }>
}

export default async function EditBlogPostPage({ params }: EditBlogPostPageProps) {
    const { id } = await params
    const supabase = await createServerClient()

    const { data: post, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single()

    if (!post || error) notFound()

    async function handleUpdate(formData: FormData) {
        "use server"
        return updateBlogPost(id, formData)
    }

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Edit Blog Post</h1>
            <BlogPostForm
                action={handleUpdate}
                defaultValues={{
                    title: post.title,
                    excerpt: post.excerpt || "",
                    content: post.content,
                    featured_image: post.featured_image || "",
                    status: post.status,
                }}
            />
        </div>
    )
}

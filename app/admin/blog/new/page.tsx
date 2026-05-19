import { createBlogPost } from "@/app/actions/admin-blog"
import { BlogPostForm } from "../_components/blog-post-form"

export default function NewBlogPostPage() {
    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">New Blog Post</h1>
            <BlogPostForm action={createBlogPost} />
        </div>
    )
}

import React from "react"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Calendar, User } from "lucide-react"
import { Container } from "@/components/ui/container"
import { getBlogPostBySlug } from "@/app/actions/blog"

interface BlogPostPageProps {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: BlogPostPageProps) {
    const { slug } = await params
    const { post } = await getBlogPostBySlug(slug)

    return {
        title: post ? `${post.title} | fewofmany Blog` : 'Blog Post | fewofmany',
        description: post?.excerpt || 'Read more on the fewofmany blog.',
    }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = await params
    const { post, error } = await getBlogPostBySlug(slug)

    if (!post || error) {
        notFound()
    }

    return (
        <Container>
            <article className="py-12 max-w-3xl mx-auto">
                {/* Back Link */}
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-neutral-900 mb-8"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back to Blog
                </Link>

                {/* Header */}
                <header className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-heading font-bold text-neutral-900 leading-tight">
                        {post.title}
                    </h1>

                    <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                        {post.published_at && (
                            <span className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                {new Date(post.published_at).toLocaleDateString("en-IN", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                })}
                            </span>
                        )}
                        {post.author && (
                            <span className="flex items-center gap-1">
                                <User className="h-3.5 w-3.5" />
                                {(post.author as any).full_name}
                            </span>
                        )}
                    </div>
                </header>

                {/* Featured Image */}
                {post.featured_image && (
                    <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-10">
                        <Image
                            src={post.featured_image}
                            alt={post.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 720px"
                            priority
                        />
                    </div>
                )}

                {/* Content */}
                <div className="prose prose-neutral prose-lg max-w-none prose-headings:font-heading prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline">
                    {/* Render content as paragraphs split by newlines */}
                    {post.content?.split('\n\n').map((paragraph: string, i: number) => (
                        <p key={i}>{paragraph}</p>
                    ))}
                </div>

                {/* Footer */}
                <div className="mt-12 pt-8 border-t border-neutral-200">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        Back to all posts
                    </Link>
                </div>
            </article>
        </Container>
    )
}

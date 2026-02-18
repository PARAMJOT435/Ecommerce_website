import React from "react"
import Link from "next/link"
import Image from "next/image"
import { Calendar, ArrowRight, Newspaper } from "lucide-react"
import { Container } from "@/components/ui/container"
import { getBlogPosts } from "@/app/actions/blog"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Blog | fewofmany",
    description: "Tips, guides, and insights on natural hygiene and wellness from fewofmany.",
}

export const dynamic = 'force-dynamic'

export default async function BlogPage() {
    const { posts } = await getBlogPosts()

    return (
        <Container>
            <div className="py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-heading font-bold text-neutral-900">
                        Our Blog
                    </h1>
                    <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
                        Tips, guides, and insights on natural hygiene and wellness.
                    </p>
                </div>

                {posts.length === 0 ? (
                    <div className="rounded-xl border border-neutral-200 bg-white py-20 text-center">
                        <Newspaper className="mx-auto h-12 w-12 text-neutral-300" />
                        <h3 className="mt-4 text-lg font-semibold text-neutral-900">
                            Coming Soon
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                            We&apos;re working on some great content. Check back soon!
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {posts.map((post: any) => (
                            <Link
                                key={post.id}
                                href={`/blog/${post.slug}`}
                                className="group rounded-xl border border-neutral-200 bg-white overflow-hidden transition-shadow hover:shadow-md"
                            >
                                {/* Featured Image */}
                                <div className="relative aspect-[16/10] bg-neutral-100 overflow-hidden">
                                    {post.featured_image ? (
                                        <Image
                                            src={post.featured_image}
                                            alt={post.title}
                                            fill
                                            className="object-cover transition-transform group-hover:scale-105"
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center">
                                            <Newspaper className="h-10 w-10 text-neutral-300" />
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                                        <Calendar className="h-3 w-3" />
                                        {post.published_at
                                            ? new Date(post.published_at).toLocaleDateString("en-IN", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                            })
                                            : "Draft"}
                                        {post.author && (
                                            <>
                                                <span>·</span>
                                                <span>{post.author.full_name}</span>
                                            </>
                                        )}
                                    </div>

                                    <h2 className="text-lg font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                                        {post.title}
                                    </h2>

                                    {post.excerpt && (
                                        <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                                            {post.excerpt}
                                        </p>
                                    )}

                                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary-600">
                                        Read more
                                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </Container>
    )
}

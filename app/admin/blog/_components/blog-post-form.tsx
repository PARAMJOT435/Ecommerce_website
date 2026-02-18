"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface BlogPostFormProps {
    action: (formData: FormData) => Promise<any>
    defaultValues?: {
        title?: string
        excerpt?: string
        content?: string
        featured_image?: string
        status?: string
    }
}

export function BlogPostForm({ action, defaultValues }: BlogPostFormProps) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        setError(null)
        const result = await action(formData)
        if (result?.error) {
            setError(result.error)
            setLoading(false)
        }
    }

    return (
        <form action={handleSubmit} className="max-w-2xl space-y-6">
            {error && (
                <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>
            )}

            <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input id="title" name="title" required defaultValue={defaultValues?.title || ""} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea id="excerpt" name="excerpt" rows={2} defaultValue={defaultValues?.excerpt || ""} placeholder="Short description..." />
            </div>

            <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <Textarea id="content" name="content" required rows={12} defaultValue={defaultValues?.content || ""} placeholder="Write your blog post..." className="font-mono text-sm" />
            </div>

            <div className="space-y-2">
                <Label htmlFor="featured_image">Featured Image URL</Label>
                <Input id="featured_image" name="featured_image" type="url" defaultValue={defaultValues?.featured_image || ""} placeholder="https://..." />
            </div>

            <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                    id="status"
                    name="status"
                    defaultValue={defaultValues?.status || "draft"}
                    className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                </select>
            </div>

            <Button type="submit" disabled={loading} className="bg-primary-600 hover:bg-primary-700 text-white">
                {loading ? "Saving..." : "Save Post"}
            </Button>
        </form>
    )
}

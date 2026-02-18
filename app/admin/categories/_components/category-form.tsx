"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface CategoryFormProps {
    categories: { id: string; name: string }[]
    action: (formData: FormData) => Promise<any>
    defaultValues?: {
        name?: string
        description?: string
        parent_id?: string
        display_order?: number
    }
}

export function CategoryForm({ categories, action, defaultValues }: CategoryFormProps) {
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
        <form action={handleSubmit} className="max-w-xl space-y-6">
            {error && (
                <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>
            )}

            <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input id="name" name="name" required defaultValue={defaultValues?.name || ""} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" rows={3} defaultValue={defaultValues?.description || ""} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="parent_id">Parent Category</Label>
                <select
                    id="parent_id"
                    name="parent_id"
                    defaultValue={defaultValues?.parent_id || ""}
                    className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                    <option value="">None (top-level)</option>
                    {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="display_order">Display Order</Label>
                <Input id="display_order" name="display_order" type="number" defaultValue={defaultValues?.display_order || 0} />
            </div>

            <Button type="submit" disabled={loading} className="bg-primary-600 hover:bg-primary-700 text-white">
                {loading ? "Saving..." : "Save Category"}
            </Button>
        </form>
    )
}

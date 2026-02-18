"use client"

import React, { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"

const STATUSES = [
    { value: "all", label: "All Orders" },
    { value: "pending", label: "Pending" },
    { value: "processing", label: "Processing" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
    { value: "refunded", label: "Refunded" },
]

export function OrderFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const currentStatus = searchParams.get("status") || "all"
    const currentSearch = searchParams.get("search") || ""
    const [search, setSearch] = useState(currentSearch)

    function applyFilters(status?: string, searchTerm?: string) {
        const params = new URLSearchParams()
        const s = status ?? currentStatus
        const q = searchTerm ?? search

        if (s && s !== "all") params.set("status", s)
        if (q) params.set("search", q)

        router.push(`/admin/orders?${params.toString()}`)
    }

    return (
        <div className="space-y-4">
            {/* Status Tabs */}
            <div className="flex flex-wrap gap-1.5">
                {STATUSES.map((s) => (
                    <button
                        key={s.value}
                        onClick={() => applyFilters(s.value)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${currentStatus === s.value
                                ? "bg-neutral-900 text-white"
                                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                            }`}
                    >
                        {s.label}
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className="flex gap-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by order number..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && applyFilters()}
                        className="pl-9"
                    />
                </div>
                <Button onClick={() => applyFilters()} size="sm">Search</Button>
                {currentSearch && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            setSearch("")
                            applyFilters(currentStatus, "")
                        }}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    )
}

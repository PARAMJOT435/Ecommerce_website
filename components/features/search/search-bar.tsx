"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface SearchBarProps {
    className?: string
    inputClassName?: string
    autoFocus?: boolean
    onSearch?: () => void
}

export function SearchBar({ className, inputClassName, autoFocus, onSearch }: SearchBarProps) {
    const [query, setQuery] = useState("")
    const router = useRouter()
    const inputRef = useRef<HTMLInputElement>(null)

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        const trimmed = query.trim()
        if (!trimmed) return

        router.push(`/products?search=${encodeURIComponent(trimmed)}`)
        onSearch?.()
    }

    return (
        <form onSubmit={handleSubmit} className={className}>
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    ref={inputRef}
                    type="search"
                    placeholder="Search products..."
                    className={inputClassName || "w-[200px] lg:w-[300px] pl-8 h-9"}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    autoFocus={autoFocus}
                />
            </div>
        </form>
    )
}

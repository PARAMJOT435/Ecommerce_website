"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useCallback } from "react"
import { Filter, X, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"

interface Category {
    id: string
    name: string
    slug: string
    productCount: number
}

interface ProductFiltersProps {
    categories: Category[]
}

export function ProductFilters({ categories }: ProductFiltersProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const activeCategory = searchParams.get("category") || ""
    const activeMinPrice = searchParams.get("minPrice") || ""
    const activeMaxPrice = searchParams.get("maxPrice") || ""
    const activeSearch = searchParams.get("search") || ""
    const activeSortBy = searchParams.get("sort") || ""

    const [minPrice, setMinPrice] = useState(activeMinPrice)
    const [maxPrice, setMaxPrice] = useState(activeMaxPrice)
    const [isCategoryOpen, setIsCategoryOpen] = useState(true)
    const [isPriceOpen, setIsPriceOpen] = useState(true)

    const activeFilterCount =
        (activeCategory ? 1 : 0) +
        (activeMinPrice || activeMaxPrice ? 1 : 0) +
        (activeSortBy ? 1 : 0)

    const buildUrl = useCallback(
        (overrides: Record<string, string | null>) => {
            const params = new URLSearchParams(searchParams.toString())
            for (const [key, value] of Object.entries(overrides)) {
                if (value === null || value === "") {
                    params.delete(key)
                } else {
                    params.set(key, value)
                }
            }
            const qs = params.toString()
            return `/products${qs ? `?${qs}` : ""}`
        },
        [searchParams]
    )

    const handleCategoryClick = (slug: string) => {
        const newValue = activeCategory === slug ? null : slug
        router.push(buildUrl({ category: newValue }))
    }

    const handlePriceApply = () => {
        router.push(
            buildUrl({
                minPrice: minPrice || null,
                maxPrice: maxPrice || null,
            })
        )
    }

    const handleSortChange = (sort: string) => {
        router.push(buildUrl({ sort: sort || null }))
    }

    const handleClearAll = () => {
        router.push(activeSearch ? `/products?search=${encodeURIComponent(activeSearch)}` : "/products")
    }

    const filterContent = (
        <div className="space-y-6">
            {/* Active Filters */}
            {activeFilterCount > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold text-neutral-900">Active Filters</span>
                        <button onClick={handleClearAll} className="text-xs text-primary-600 hover:text-primary-700 font-medium">
                            Clear all
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {activeCategory && (
                            <Badge
                                variant="secondary"
                                className="gap-1 cursor-pointer hover:bg-neutral-200"
                                onClick={() => handleCategoryClick(activeCategory)}
                            >
                                {categories.find((c) => c.slug === activeCategory)?.name || activeCategory}
                                <X className="h-3 w-3" />
                            </Badge>
                        )}
                        {(activeMinPrice || activeMaxPrice) && (
                            <Badge
                                variant="secondary"
                                className="gap-1 cursor-pointer hover:bg-neutral-200"
                                onClick={() => {
                                    setMinPrice("")
                                    setMaxPrice("")
                                    router.push(buildUrl({ minPrice: null, maxPrice: null }))
                                }}
                            >
                                ₹{activeMinPrice || "0"} – ₹{activeMaxPrice || "∞"}
                                <X className="h-3 w-3" />
                            </Badge>
                        )}
                    </div>
                    <Separator className="mt-4" />
                </div>
            )}

            {/* Sort */}
            <div>
                <Label className="text-sm font-semibold text-neutral-900 mb-2 block">Sort By</Label>
                <select
                    value={activeSortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                    <option value="">Featured</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="newest">Newest First</option>
                    <option value="name_asc">Name: A–Z</option>
                    <option value="name_desc">Name: Z–A</option>
                </select>
            </div>

            <Separator />

            {/* Categories */}
            <div>
                <button
                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                    className="flex w-full items-center justify-between text-sm font-semibold text-neutral-900"
                >
                    Categories
                    {isCategoryOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {isCategoryOpen && (
                    <div className="mt-3 space-y-1">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => handleCategoryClick(cat.slug)}
                                className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors ${activeCategory === cat.slug
                                        ? "bg-primary-50 text-primary-700 font-medium"
                                        : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                                    }`}
                            >
                                <span>{cat.name}</span>
                                <span className="text-xs text-muted-foreground">{cat.productCount}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <Separator />

            {/* Price Range */}
            <div>
                <button
                    onClick={() => setIsPriceOpen(!isPriceOpen)}
                    className="flex w-full items-center justify-between text-sm font-semibold text-neutral-900"
                >
                    Price Range
                    {isPriceOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {isPriceOpen && (
                    <div className="mt-3 space-y-3">
                        <div className="flex items-center gap-2">
                            <div className="flex-1">
                                <Label htmlFor="minPrice" className="text-xs text-muted-foreground">Min (₹)</Label>
                                <Input
                                    id="minPrice"
                                    type="number"
                                    min={0}
                                    placeholder="0"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                    className="h-9"
                                />
                            </div>
                            <span className="mt-5 text-muted-foreground">–</span>
                            <div className="flex-1">
                                <Label htmlFor="maxPrice" className="text-xs text-muted-foreground">Max (₹)</Label>
                                <Input
                                    id="maxPrice"
                                    type="number"
                                    min={0}
                                    placeholder="Any"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    className="h-9"
                                />
                            </div>
                        </div>
                        <Button
                            onClick={handlePriceApply}
                            size="sm"
                            className="w-full bg-primary-600 hover:bg-primary-700 text-white"
                        >
                            Apply Price Filter
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-[260px] flex-shrink-0">
                <div className="sticky top-24 rounded-xl border border-neutral-200 bg-white p-5">
                    <h3 className="text-base font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                        <Filter className="h-4 w-4" /> Filters
                        {activeFilterCount > 0 && (
                            <Badge variant="default" className="ml-auto bg-primary-600 text-white text-[10px] h-5 min-w-5 flex items-center justify-center">
                                {activeFilterCount}
                            </Badge>
                        )}
                    </h3>
                    {filterContent}
                </div>
            </aside>

            {/* Mobile Filter Button + Sheet */}
            <div className="lg:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2">
                            <Filter className="h-4 w-4" />
                            Filters
                            {activeFilterCount > 0 && (
                                <Badge variant="default" className="bg-primary-600 text-white text-[10px] h-5 min-w-5">
                                    {activeFilterCount}
                                </Badge>
                            )}
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] overflow-y-auto">
                        <SheetHeader>
                            <SheetTitle className="flex items-center gap-2">
                                <Filter className="h-4 w-4" /> Filters
                            </SheetTitle>
                        </SheetHeader>
                        <div className="mt-4">
                            {filterContent}
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </>
    )
}

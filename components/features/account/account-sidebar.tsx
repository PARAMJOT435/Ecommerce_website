"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, MapPin, Heart, Settings, ChevronRight } from "lucide-react"

const NAV_ITEMS = [
    { label: "Dashboard", href: "/account", icon: LayoutDashboard },
    { label: "Orders", href: "/account/orders", icon: Package },
    { label: "Wishlist", href: "/account/wishlist", icon: Heart },
    { label: "Addresses", href: "/account/addresses", icon: MapPin },
    { label: "Settings", href: "/account/settings", icon: Settings },
]

export function AccountSidebar() {
    const pathname = usePathname()

    return (
        <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href ||
                    (item.href !== "/account" && pathname.startsWith(item.href))
                const Icon = item.icon

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive
                            ? "bg-primary-50 text-primary-700"
                            : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                            }`}
                    >
                        <Icon className="h-4 w-4 flex-shrink-0" />
                        <span className="flex-1">{item.label}</span>
                        {isActive && <ChevronRight className="h-4 w-4" />}
                    </Link>
                )
            })}
        </nav>
    )
}

export function AccountMobileTabs() {
    const pathname = usePathname()

    return (
        <div className="flex gap-1 overflow-x-auto border-b bg-white px-4 py-2 md:hidden">
            {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href ||
                    (item.href !== "/account" && pathname.startsWith(item.href))
                const Icon = item.icon

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${isActive
                            ? "bg-primary-600 text-white"
                            : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                            }`}
                    >
                        <Icon className="h-3.5 w-3.5" />
                        {item.label}
                    </Link>
                )
            })}
        </div>
    )
}

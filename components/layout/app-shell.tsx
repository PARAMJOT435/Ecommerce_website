"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
    Settings,
    LayoutDashboard,
    ShoppingBag,
    ListOrdered,
    Users,
    LogOut,
    Menu,
    FolderTree,
    MessageSquare,
    FileText,
    User,
    ClipboardList,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { logout } from "@/app/actions/auth"

interface AppShellProps {
    children: React.ReactNode
}

const sidebarLinks = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "Products", icon: ShoppingBag },
    { href: "/admin/categories", label: "Categories", icon: FolderTree },
    { href: "/admin/orders", label: "Orders", icon: ListOrdered },
    { href: "/admin/quotes", label: "Quotes", icon: ClipboardList },
    { href: "/admin/customers", label: "Customers", icon: Users },
    { href: "/admin/reviews", label: "Reviews", icon: MessageSquare },
    { href: "/admin/blog", label: "Blog", icon: FileText },
    { href: "/admin/settings", label: "Settings", icon: Settings },
]


export function AppShell({ children }: AppShellProps) {
    const pathname = usePathname()
    const [isSheetOpen, setIsSheetOpen] = useState(false)

    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            {/* Desktop Sidebar */}
            <div className="hidden border-r bg-muted/40 md:flex md:flex-col">
                <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                    <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <Logo bgClass="bg-muted/40" />
                    </Link>
                </div>
                <nav className="flex-1 overflow-y-auto px-2 py-4 lg:px-4">
                    <div className="space-y-1">
                        {sidebarLinks.map((link) => {
                            const Icon = link.icon
                            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`)
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                                        isActive
                                            ? "bg-primary text-primary-foreground"
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    )}
                                    title={link.label}
                                >
                                    <Icon className="h-5 w-5 shrink-0" />
                                    <span className="hidden lg:inline">{link.label}</span>
                                </Link>
                            )
                        })}
                    </div>
                </nav>
                <div className="border-t p-4">
                    <form action={logout}>
                        <Button 
                            type="submit" 
                            variant="outline" 
                            className="w-full justify-start gap-2 text-sm"
                        >
                            <LogOut className="h-4 w-4" />
                            <span className="hidden lg:inline">Sign Out</span>
                        </Button>
                    </form>
                </div>
            </div>

            <div className="flex flex-col">
                {/* Header */}
                <header className="flex h-14 items-center gap-3 border-b bg-background px-4 lg:h-[60px] lg:px-6">
                    {/* Mobile Menu Button */}
                    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="shrink-0 md:hidden"
                            >
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle navigation menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-64 flex flex-col p-0">
                            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                            <div className="border-b px-4 py-4">
                                <Link
                                    href="/"
                                    className="flex items-center gap-2 font-semibold hover:text-primary transition-colors"
                                    onClick={() => setIsSheetOpen(false)}
                                >
                                    <Logo />
                                </Link>
                            </div>
                            <nav className="flex-1 overflow-y-auto px-4 py-4">
                                <div className="space-y-1">
                                    {sidebarLinks.map((link) => {
                                        const Icon = link.icon
                                        const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`)
                                        return (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                onClick={() => setIsSheetOpen(false)}
                                                className={cn(
                                                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                                                    isActive
                                                        ? "bg-primary text-primary-foreground"
                                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                                )}
                                            >
                                                <Icon className="h-5 w-5 shrink-0" />
                                                {link.label}
                                            </Link>
                                        )
                                    })}
                                </div>
                            </nav>
                            <div className="border-t p-4">
                                <form action={logout} className="w-full">
                                    <Button 
                                        type="submit" 
                                        variant="outline" 
                                        className="w-full justify-start gap-2"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Sign Out
                                    </Button>
                                </form>
                            </div>
                        </SheetContent>
                    </Sheet>

                    {/* Mobile Logo */}
                    <Link href="/" className="flex md:hidden items-center gap-2 font-semibold shrink-0 hover:opacity-80 transition-opacity">
                        <Logo />
                    </Link>

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Logout Button */}
                    <form action={logout}>
                        <Button 
                            type="submit" 
                            variant="ghost" 
                            size="icon" 
                            className="shrink-0"
                            title="Sign out"
                        >
                            <LogOut className="h-4 w-4" />
                            <span className="sr-only">Sign out</span>
                        </Button>
                    </form>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto bg-background">
                    <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}

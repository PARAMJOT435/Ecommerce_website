"use client";

import React from "react";
import Link from "next/link";
import { ShoppingBag, User, Search, Menu, LogOut, Package, Heart, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { logout } from "@/app/actions/auth";
import { useCartStore } from "@/stores/cart-store";
import { useUIStore } from "@/stores/ui-store";
import { SearchBar } from "@/components/features/search/search-bar";

interface HeaderProps {
    user?: {
        email: string
        firstName?: string | null
        lastName?: string | null
    } | null
    isAdmin?: boolean
}

export function Header({ user, isAdmin }: HeaderProps) {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const totalItems = useCartStore((s) => s.totalItems);
    const openCart = useUIStore((s) => s.openCart);

    const cartCount = totalItems();

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <Container className="flex h-16 items-center">
                {/* Mobile Menu */}
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="mr-2 md:hidden">
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                        <nav className="flex flex-col gap-4">
                            <Link href="/" className="font-heading text-lg font-semibold">
                                fewofmany
                            </Link>
                            {isAdmin && (
                                <Link href="/admin/dashboard" className="text-primary-600 font-medium hover:text-primary-700">
                                    Admin Dashboard
                                </Link>
                            )}
                            <Link href="/products" className="text-muted-foreground hover:text-foreground">
                                Products
                            </Link>
                            <Link href="/about" className="text-muted-foreground hover:text-foreground">
                                About
                            </Link>
                            <Link href="/blog" className="text-muted-foreground hover:text-foreground">
                                Blog
                            </Link>
                            {!user && (
                                <>
                                    <Link href="/login" className="text-muted-foreground hover:text-foreground">
                                        Sign In
                                    </Link>
                                    <Link href="/signup" className="text-muted-foreground hover:text-foreground">
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </nav>
                    </SheetContent>
                </Sheet>

                {/* Logo */}
                <div className="mr-4 flex">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <span className="font-heading text-xl font-bold text-primary-600">
                            fewofmany
                        </span>
                    </Link>
                    <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
                        {isAdmin && (
                            <Link href="/admin/dashboard" className="text-primary-600 font-bold hover:text-primary-700">
                                Dashboard
                            </Link>
                        )}
                        <Link href="/products" className="transition-colors hover:text-foreground/80">
                            Products
                        </Link>
                        <Link href="/about" className="transition-colors hover:text-foreground/80">
                            About
                        </Link>
                        <Link href="/blog" className="transition-colors hover:text-foreground/80">
                            Blog
                        </Link>
                    </nav>
                </div>

                {/* Actions */}
                <div className="flex flex-1 items-center justify-end space-x-2">
                    {/* Search */}
                    <div className="w-full flex-1 md:w-auto md:flex-none">
                        <div className="hidden md:block">
                            <SearchBar />
                        </div>
                        {/* Mobile Search Toggle */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                        >
                            <Search className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Cart — opens drawer */}
                    <TooltipProvider delayDuration={200}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="relative"
                                    onClick={openCart}
                                >
                                    <ShoppingBag className="h-5 w-5" />
                                    {cartCount > 0 && (
                                        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary-600 text-[10px] text-white">
                                            {cartCount > 9 ? '9+' : cartCount}
                                        </span>
                                    )}
                                    <span className="sr-only">Cart</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Cart</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    {/* User Menu — Auth-Aware */}
                    {user ? (
                        <DropdownMenu>
                            <TooltipProvider delayDuration={200}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <User className="h-5 w-5" />
                                                <span className="sr-only">User account</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Account</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium">
                                            {user.firstName
                                                ? `${user.firstName}${user.lastName ? ` ${user.lastName}` : ''}`
                                                : user.email}
                                        </p>
                                        {user.firstName && (
                                            <p className="text-xs text-muted-foreground truncate">
                                                {user.email}
                                            </p>
                                        )}
                                        {isAdmin && (
                                            <p className="text-xs font-bold text-primary-600 mt-1">
                                                Administrator
                                            </p>
                                        )}
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {isAdmin && (
                                    <DropdownMenuItem asChild>
                                        <Link href="/admin/dashboard" className="flex items-center font-semibold">
                                            <LayoutDashboard className="mr-2 h-4 w-4" />
                                            Admin Panel
                                        </Link>
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuItem asChild>
                                    <Link href="/account" className="flex items-center">
                                        <User className="mr-2 h-4 w-4" />
                                        My Account
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/account/orders" className="flex items-center">
                                        <Package className="mr-2 h-4 w-4" />
                                        Orders
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/account/wishlist" className="flex items-center">
                                        <Heart className="mr-2 h-4 w-4" />
                                        Wishlist
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <form action={logout} className="w-full">
                                        <button type="submit" className="flex w-full items-center text-red-600">
                                            <LogOut className="mr-2 h-4 w-4" />
                                            Log out
                                        </button>
                                    </form>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="hidden md:flex items-center space-x-2">
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/login">Sign In</Link>
                            </Button>
                            <Button size="sm" className="bg-primary-600 hover:bg-primary-700 text-white" asChild>
                                <Link href="/signup">Sign Up</Link>
                            </Button>
                        </div>
                    )}

                    {/* Mobile: show user icon that links to login when not authenticated */}
                    {!user && (
                        <Button variant="ghost" size="icon" className="md:hidden" asChild>
                            <Link href="/login">
                                <User className="h-5 w-5" />
                                <span className="sr-only">Sign in</span>
                            </Link>
                        </Button>
                    )}
                </div>
            </Container>

            {/* Mobile Search Bar (Expandable) */}
            {isSearchOpen && (
                <div className="border-b md:hidden p-4 bg-background">
                    <SearchBar
                        inputClassName="w-full pl-8"
                        autoFocus
                        onSearch={() => setIsSearchOpen(false)}
                    />
                </div>
            )}
        </header>
    );
}

"use client";

import React from "react";
import Link from "next/link";
import { ShoppingBag, User, Search, Menu, LogOut, Package, Heart, LayoutDashboard, Settings } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/ui/logo";
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
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [isMounted, setIsMounted] = useState(false);
    const totalItems = useCartStore((s) => s.totalItems);
    const openCart = useUIStore((s) => s.openCart);

    useEffect(() => {
        setIsMounted(true);
        setCartCount(totalItems());
    }, [totalItems]);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <Container className="flex h-16 items-center">
                {/* Mobile Menu */}
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="mr-2 md:hidden">
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="flex flex-col p-0 w-72">
                        <div className="flex items-center border-b p-4 h-16">
                            <Link href="/" className="flex items-center" onClick={() => setIsSheetOpen(false)}>
                                <Logo />
                            </Link>
                        </div>
                        
                        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                            {isAdmin && (
                                <Link 
                                    href="/admin/dashboard" 
                                    onClick={() => setIsSheetOpen(false)}
                                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold bg-primary-50 text-primary-700 hover:bg-primary-100 transition-colors"
                                >
                                    <LayoutDashboard className="h-5 w-5" />
                                    Admin Dashboard
                                </Link>
                            )}
                            
                            <div className="pt-2 pb-1">
                                <p className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Store</p>
                            </div>
                            
                            <Link 
                                href="/products" 
                                onClick={() => setIsSheetOpen(false)}
                                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                            >
                                <Package className="h-5 w-5 text-muted-foreground" />
                                Products
                            </Link>
                            <Link 
                                href="/about" 
                                onClick={() => setIsSheetOpen(false)}
                                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                            >
                                <Heart className="h-5 w-5 text-muted-foreground" />
                                Our Story
                            </Link>
                            <Link 
                                href="/blog" 
                                onClick={() => setIsSheetOpen(false)}
                                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                            >
                                <Search className="h-5 w-5 text-muted-foreground" />
                                Blog
                            </Link>
                        </nav>

                        <div className="border-t p-4 bg-muted/20">
                            {user ? (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 px-2">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-700 font-bold">
                                            {user.firstName ? user.firstName[0].toUpperCase() : user.email[0].toUpperCase()}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium leading-none">{user.firstName || 'Account'}</span>
                                            <span className="text-xs text-muted-foreground mt-1 truncate max-w-[150px]">{user.email}</span>
                                        </div>
                                    </div>
                                    <form action={logout}>
                                        <Button type="submit" variant="outline" className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50">
                                            <LogOut className="h-4 w-4" />
                                            Sign Out
                                        </Button>
                                    </form>
                                </div>
                            ) : (
                                <Button className="w-full bg-primary-600 hover:bg-primary-700 text-white" asChild onClick={() => setIsSheetOpen(false)}>
                                    <Link href="/login">
                                        <User className="mr-2 h-4 w-4" />
                                        Sign In / Sign Up
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </SheetContent>
                </Sheet>

                {/* Logo */}
                <div className="mr-4 flex">
                    <Link href="/" className="mr-6 flex items-center">
                        <Logo iconSize="h-10 w-10" textSize="text-base" />
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
                    <div className="flex items-center md:flex-none">
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
                                    {isMounted && cartCount > 0 && (
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
                        <div className="hidden md:flex items-center">
                            <Button size="sm" className="bg-primary-600 hover:bg-primary-700 text-white" asChild>
                                <Link href="/login">Sign In / Sign Up</Link>
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

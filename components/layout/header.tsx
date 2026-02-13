"use client";

import Link from "next/link";
import { ShoppingBag, User, Search, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export function Header() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const cartCount = 0; // TODO: Connect to store

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
                            <Link href="/products" className="text-muted-foreground hover:text-foreground">
                                Products
                            </Link>
                            <Link href="/about" className="text-muted-foreground hover:text-foreground">
                                About
                            </Link>
                            <Link href="/blog" className="text-muted-foreground hover:text-foreground">
                                Blog
                            </Link>
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
                        <div className="relative hidden md:block">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search products..."
                                className="w-[200px] lg:w-[300px] pl-8 h-9"
                            />
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

                    {/* Cart */}
                    <Button variant="ghost" size="icon" className="relative" asChild>
                        <Link href="/cart">
                            <ShoppingBag className="h-5 w-5" />
                            {cartCount > 0 && (
                                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary-600 text-[10px] text-white">
                                    {cartCount}
                                </span>
                            )}
                            <span className="sr-only">Cart</span>
                        </Link>
                    </Button>

                    {/* User Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <User className="h-5 w-5" />
                                <span className="sr-only">User account</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/account/dashboard">Dashboard</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/account/orders">Orders</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Log out</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </Container>

            {/* Mobile Search Bar (Expandable) */}
            {isSearchOpen && (
                <div className="border-b md:hidden p-4 bg-background">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search products..."
                            className="w-full pl-8"
                            autoFocus
                        />
                    </div>
                </div>
            )}
        </header>
    );
}

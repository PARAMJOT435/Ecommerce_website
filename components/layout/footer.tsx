import Link from "next/link";
import { Facebook, Instagram, Twitter, Linkedin, Settings } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Logo } from "@/components/ui/logo";
import { NewsletterForm } from "@/components/forms/newsletter-form";

export function Footer() {
    return (
        <footer className="bg-neutral-50 border-t">
            <Container className="py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand Info */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center">
                            <Logo iconSize="h-12 w-12" textSize="text-xl" bgClass="bg-neutral-50" />
                        </Link>
                        <p className="text-sm text-muted-foreground max-w-xs">
                            Heavy-Duty Tools for Industrial Precision. Premium machinery and equipment engineered for reliability.
                        </p>
                        <div className="flex space-x-4">
                            <Link href="#" className="text-muted-foreground hover:text-primary-600">
                                <Instagram className="h-5 w-5" />
                                <span className="sr-only">Instagram</span>
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary-600">
                                <Facebook className="h-5 w-5" />
                                <span className="sr-only">Facebook</span>
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary-600">
                                <Twitter className="h-5 w-5" />
                                <span className="sr-only">Twitter</span>
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary-600">
                                <Linkedin className="h-5 w-5" />
                                <span className="sr-only">LinkedIn</span>
                            </Link>
                        </div>
                    </div>

                    {/* Shop Links */}
                    <div>
                        <h3 className="font-semibold mb-4">Shop</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/products" className="text-muted-foreground hover:text-primary-600">
                                    All Products
                                </Link>
                            </li>
                            <li>
                                <Link href="/products?category=power-tools" className="text-muted-foreground hover:text-primary-600">
                                    Power Tools
                                </Link>
                            </li>
                            <li>
                                <Link href="/products?category=hand-tools" className="text-muted-foreground hover:text-primary-600">
                                    Hand Tools
                                </Link>
                            </li>
                            <li>
                                <Link href="/products?category=machinery" className="text-muted-foreground hover:text-primary-600">
                                    Machinery
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h3 className="font-semibold mb-4">Support</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/contact" className="text-muted-foreground hover:text-primary-600">
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/faq" className="text-muted-foreground hover:text-primary-600">
                                    FAQs
                                </Link>
                            </li>
                            <li>
                                <Link href="/shipping" className="text-muted-foreground hover:text-primary-600">
                                    Shipping & Returns
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="text-muted-foreground hover:text-primary-600">
                                    Privacy Policy
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="font-semibold mb-4">Stay Updated</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Subscribe to our newsletter for new products and exclusive offers.
                        </p>
                        <NewsletterForm />
                    </div>
                </div>

                <Separator className="my-8" />

                <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
                    <p>© {new Date().getFullYear()} MMW. All rights reserved.</p>
                    <div className="flex space-x-4 mt-4 md:mt-0">
                        <Link href="/terms" className="hover:text-foreground">Terms</Link>
                        <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
                        <Link href="/cookies" className="hover:text-foreground">Cookies</Link>
                    </div>
                </div>
            </Container>
        </footer>
    );
}

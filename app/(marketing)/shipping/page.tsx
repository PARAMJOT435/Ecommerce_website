import { Container } from "@/components/ui/container"
import { Card, CardContent } from "@/components/ui/card"
import { Truck, RotateCcw, Clock, IndianRupee, ShieldCheck, PackageOpen } from "lucide-react"
import Link from "next/link"

export const metadata = {
    title: "Shipping & Returns | fewofmany",
    description: "Learn about fewofmany shipping options, delivery times, return policy, and refund process.",
}

export default function ShippingPage() {
    return (
        <Container className="py-12 md:py-16">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Shipping & Returns</h1>
                    <p className="text-muted-foreground">
                        Everything you need to know about getting your order delivered and our hassle-free return policy.
                    </p>
                </div>

                {/* Highlights */}
                <div className="grid gap-4 sm:grid-cols-3 mb-12">
                    <Card className="text-center">
                        <CardContent className="p-5">
                            <Truck className="h-8 w-8 text-primary-600 mx-auto mb-2" />
                            <p className="font-semibold text-sm">Free Shipping</p>
                            <p className="text-xs text-muted-foreground">Orders above ₹499</p>
                        </CardContent>
                    </Card>
                    <Card className="text-center">
                        <CardContent className="p-5">
                            <RotateCcw className="h-8 w-8 text-primary-600 mx-auto mb-2" />
                            <p className="font-semibold text-sm">7-Day Returns</p>
                            <p className="text-xs text-muted-foreground">Hassle-free process</p>
                        </CardContent>
                    </Card>
                    <Card className="text-center">
                        <CardContent className="p-5">
                            <ShieldCheck className="h-8 w-8 text-primary-600 mx-auto mb-2" />
                            <p className="font-semibold text-sm">Quality Guaranteed</p>
                            <p className="text-xs text-muted-foreground">100% genuine products</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Shipping Section */}
                <div className="space-y-10">
                    <section>
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <Truck className="h-5 w-5 text-primary-600" /> Shipping Policy
                        </h2>
                        <div className="prose prose-sm text-muted-foreground space-y-4">
                            <p>We ship across India through trusted courier partners. Here's what to expect:</p>

                            <div className="rounded-lg border overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead className="bg-neutral-50">
                                        <tr>
                                            <th className="text-left px-4 py-3 font-medium">Shipping Method</th>
                                            <th className="text-left px-4 py-3 font-medium">Delivery Time</th>
                                            <th className="text-left px-4 py-3 font-medium">Cost</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-t">
                                            <td className="px-4 py-3">Standard Shipping</td>
                                            <td className="px-4 py-3">5–7 business days</td>
                                            <td className="px-4 py-3">₹49 (Free above ₹499)</td>
                                        </tr>
                                        <tr className="border-t">
                                            <td className="px-4 py-3">Metro Cities</td>
                                            <td className="px-4 py-3">3–5 business days</td>
                                            <td className="px-4 py-3">₹49 (Free above ₹499)</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <ul className="list-disc list-inside space-y-1.5">
                                <li>Orders placed before 2 PM IST are dispatched the same day (Mon–Sat).</li>
                                <li>You'll receive a confirmation email with tracking details once shipped.</li>
                                <li>Delivery timelines may vary during peak seasons or severe weather.</li>
                                <li>We currently do not offer international shipping.</li>
                            </ul>
                        </div>
                    </section>

                    <hr />

                    {/* Returns Section */}
                    <section>
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <RotateCcw className="h-5 w-5 text-primary-600" /> Return Policy
                        </h2>
                        <div className="prose prose-sm text-muted-foreground space-y-4">
                            <p>We want you to love every product. If something isn't right, here's how returns work:</p>

                            <h3 className="text-foreground font-medium text-sm">Eligible for Return</h3>
                            <ul className="list-disc list-inside space-y-1.5">
                                <li>Returned within <strong>7 days</strong> of delivery</li>
                                <li>Product is <strong>unopened, unused</strong>, and in original packaging</li>
                                <li>Damaged or defective items (photo evidence required)</li>
                                <li>Wrong item received</li>
                            </ul>

                            <h3 className="text-foreground font-medium text-sm">Not Eligible for Return</h3>
                            <ul className="list-disc list-inside space-y-1.5">
                                <li>Opened or used products (for hygiene reasons)</li>
                                <li>Products returned after 7 days</li>
                                <li>Items marked as "Final Sale" or "Non-Returnable"</li>
                            </ul>

                            <h3 className="text-foreground font-medium text-sm">How to Return</h3>
                            <ol className="list-decimal list-inside space-y-1.5">
                                <li>Email us at <a href="mailto:hello@fewofmany.com" className="text-primary-600 hover:underline">hello@fewofmany.com</a> with your order number and reason</li>
                                <li>We'll confirm eligibility and arrange a courier pickup</li>
                                <li>Pack the product securely in its original packaging</li>
                                <li>Hand it to the courier when they arrive</li>
                            </ol>
                        </div>
                    </section>

                    <hr />

                    {/* Refunds Section */}
                    <section>
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <IndianRupee className="h-5 w-5 text-primary-600" /> Refund Policy
                        </h2>
                        <div className="prose prose-sm text-muted-foreground space-y-4">
                            <ul className="list-disc list-inside space-y-1.5">
                                <li>Refunds are initiated within <strong>2 business days</strong> after we receive and inspect the returned item.</li>
                                <li>Amount is credited to your original payment method within <strong>5–7 business days</strong>.</li>
                                <li>For COD orders, refunds are processed via bank transfer (we'll ask for your bank details).</li>
                                <li>Shipping charges are non-refundable unless the return is due to our error.</li>
                            </ul>
                        </div>
                    </section>
                </div>

                {/* CTA */}
                <div className="mt-12 text-center rounded-xl bg-neutral-50 border p-8">
                    <h3 className="font-semibold mb-2">Need help with a return?</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        Our team is here to make it easy.
                    </p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center px-5 py-2.5 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors"
                    >
                        Contact Support
                    </Link>
                </div>
            </div>
        </Container>
    )
}

import React, { Suspense } from "react"
import Link from "next/link"
import { Container } from "@/components/ui/container"
import { Button } from "@/components/ui/button"
import { CheckCircle, Package, ArrowRight, Home } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Order Confirmed | MMW",
    description: "Your order has been placed successfully.",
}

function OrderSuccessContent({ searchParams }: { searchParams: { order?: string } }) {
    const orderNumber = searchParams.order || 'N/A'

    return (
        <Container>
            <div className="py-16 md:py-24 max-w-lg mx-auto text-center">
                {/* Success Icon */}
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 mb-6">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                </div>

                <h1 className="text-3xl font-heading font-bold text-neutral-900">
                    Order Confirmed!
                </h1>
                <p className="mt-3 text-muted-foreground">
                    Thank you for your purchase. Your order has been placed successfully.
                </p>

                {/* Order Number */}
                <div className="mt-6 rounded-xl border border-neutral-200 bg-neutral-50 p-5">
                    <p className="text-xs text-muted-foreground mb-1">Order Number</p>
                    <p className="text-lg font-bold text-neutral-900 font-mono">{orderNumber}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                        Payment: Cash on Delivery
                    </p>
                </div>

                {/* Info */}
                <div className="mt-6 rounded-xl border border-neutral-200 bg-white p-5 text-left space-y-3">
                    <div className="flex items-start gap-3">
                        <Package className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-neutral-900">What&apos;s next?</p>
                            <p className="text-sm text-muted-foreground">
                                We&apos;ll send you an email confirmation shortly. Your order will be
                                processed and shipped within 2-3 business days.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                    <Button asChild className="gap-2 bg-primary-600 hover:bg-primary-700 text-white">
                        <Link href="/account/orders">
                            <Package className="h-4 w-4" />
                            View My Orders
                        </Link>
                    </Button>
                    <Button asChild variant="outline" className="gap-2">
                        <Link href="/">
                            <Home className="h-4 w-4" />
                            Back to Home
                        </Link>
                    </Button>
                </div>
            </div>
        </Container>
    )
}

export default async function OrderSuccessPage({
    searchParams,
}: {
    searchParams: Promise<{ order?: string }>
}) {
    const params = await searchParams
    return (
        <Suspense fallback={<div className="py-16 text-center">Loading...</div>}>
            <OrderSuccessContent searchParams={params} />
        </Suspense>
    )
}

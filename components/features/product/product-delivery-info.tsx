"use client"

import React from "react"
import { MapPin, Calendar, CheckCircle2, Truck } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ProductDeliveryInfoProps {
    stockQuantity: number
    productName?: string
}

export function ProductDeliveryInfo({ stockQuantity, productName }: ProductDeliveryInfoProps) {
    const inStock = stockQuantity > 0

    return (
        <Card className="border-neutral-200">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg">Delivery Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Stock Status */}
                <div className="flex items-start gap-3">
                    <CheckCircle2 className={`h-5 w-5 mt-0.5 shrink-0 ${inStock ? 'text-green-600' : 'text-neutral-300'}`} />
                    <div>
                        <p className="text-sm font-medium text-neutral-900">
                            {inStock ? 'In Stock' : 'Out of Stock'}
                        </p>
                        {inStock && (
                            <p className="text-xs text-neutral-600 mt-0.5">
                                {stockQuantity} {stockQuantity === 1 ? 'item' : 'items'} available
                            </p>
                        )}
                    </div>
                </div>

                {/* Delivery Time */}
                {inStock && (
                    <>
                        <div className="flex items-start gap-3">
                            <Truck className="h-5 w-5 mt-0.5 text-neutral-600 shrink-0" />
                            <div>
                                <p className="text-sm font-medium text-neutral-900">
                                    Delivery in 2-3 days
                                </p>
                                <p className="text-xs text-neutral-600 mt-0.5">
                                    Order before 5 PM for next day delivery
                                </p>
                            </div>
                        </div>

                        {/* Order Processing */}
                        <div className="flex items-start gap-3">
                            <Calendar className="h-5 w-5 mt-0.5 text-neutral-600 shrink-0" />
                            <div>
                                <p className="text-sm font-medium text-neutral-900">
                                    Order Processing
                                </p>
                                <p className="text-xs text-neutral-600 mt-0.5">
                                    Ships within 24 hours
                                </p>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 mt-0.5 text-neutral-600 shrink-0" />
                            <div>
                                <p className="text-sm font-medium text-neutral-900">
                                    Delivery across India
                                </p>
                                <p className="text-xs text-neutral-600 mt-0.5">
                                    Nationwide shipping available
                                </p>
                            </div>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    )
}

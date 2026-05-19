"use client"

import React from "react"
import { Shield, Heart, RotateCcw, Gift } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface WarrantyBenefit {
    icon: React.ReactNode
    title: string
    description: string
}

export function ProductWarranty() {
    const benefits: WarrantyBenefit[] = [
        {
            icon: <Shield className="h-5 w-5 text-blue-600" />,
            title: "1 Year Manufacturer Warranty",
            description: "Coverage against manufacturing defects",
        },
        {
            icon: <Heart className="h-5 w-5 text-red-600" />,
            title: "Authentic Product",
            description: "100% genuine from authorized dealers",
        },
        {
            icon: <RotateCcw className="h-5 w-5 text-green-600" />,
            title: "7 Days Return Policy",
            description: "No questions asked returns within 7 days",
        },
        {
            icon: <Gift className="h-5 w-5 text-purple-600" />,
            title: "Free Support",
            description: "24/7 customer support and after-sales service",
        },
    ]

    return (
        <Card className="border-neutral-200">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg">Why Buy from Us</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {benefits.map((benefit, index) => (
                        <div key={index} className="flex gap-3">
                            <div className="shrink-0 mt-0.5">
                                {benefit.icon}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-neutral-900">
                                    {benefit.title}
                                </p>
                                <p className="text-xs text-neutral-600 mt-1">
                                    {benefit.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

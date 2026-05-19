"use client"

import React from "react"
import { Truck, RotateCcw, Shield, Clock } from "lucide-react"

interface ProductHighlightsProps {
    highlights?: Record<string, string>
}

export function ProductHighlights({ highlights }: ProductHighlightsProps) {
    const defaultHighlights = [
        {
            icon: Truck,
            title: "Free Delivery",
            description: "On orders above ₹500",
        },
        {
            icon: RotateCcw,
            title: "Easy Returns",
            description: "Return within 7 days",
        },
        {
            icon: Shield,
            title: "Secure Payment",
            description: "100% encrypted transactions",
        },
        {
            icon: Clock,
            title: "Fast Processing",
            description: "Ships within 24 hours",
        },
    ]

    return (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {defaultHighlights.map((highlight) => {
                const Icon = highlight.icon
                return (
                    <div
                        key={highlight.title}
                        className="rounded-lg border border-neutral-200 bg-white p-4 text-center hover:shadow-md transition-shadow"
                    >
                        <Icon className="h-8 w-8 mx-auto mb-2 text-primary-600" />
                        <p className="text-xs font-semibold text-neutral-900 mb-1">
                            {highlight.title}
                        </p>
                        <p className="text-xs text-neutral-600">
                            {highlight.description}
                        </p>
                    </div>
                )
            })}
        </div>
    )
}

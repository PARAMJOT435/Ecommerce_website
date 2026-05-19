"use client"

import React, { useState } from "react"
import { ChevronDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface FAQItem {
    question: string
    answer: string
}

export function ProductFAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0)

    const faqs: FAQItem[] = [
        {
            question: "What is the warranty period?",
            answer: "This product comes with 1 year manufacturer's warranty from the date of purchase. Warranty covers manufacturing defects and material faults.",
        },
        {
            question: "What are the delivery charges?",
            answer: "Free delivery on orders above ₹500. For orders below ₹500, a flat delivery charge of ₹49 applies. Delivery typically takes 2-3 business days.",
        },
        {
            question: "Can I return this product?",
            answer: "Yes, you can return this product within 7 days of delivery if it's unused and in original packaging. A return request can be raised from your account.",
        },
        {
            question: "Is this an authentic product?",
            answer: "Yes, all our products are 100% authentic and sourced directly from authorized manufacturers and distributors.",
        },
        {
            question: "How do I track my order?",
            answer: "You can track your order from the 'Orders' section in your account. We provide real-time tracking updates via SMS and email.",
        },
    ]

    return (
        <Card className="border-neutral-200">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg">Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                {faqs.map((faq, index) => (
                    <div key={index} className="border-b border-neutral-200 last:border-0">
                        <button
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            className="w-full text-left py-3 flex items-center justify-between hover:bg-neutral-50 px-1 transition-colors"
                        >
                            <p className="text-sm font-medium text-neutral-900">
                                {faq.question}
                            </p>
                            <ChevronDown
                                className={`h-5 w-5 text-neutral-400 transition-transform shrink-0 ${
                                    openIndex === index ? "rotate-180" : ""
                                }`}
                            />
                        </button>
                        {openIndex === index && (
                            <div className="pb-3 px-1">
                                <p className="text-sm text-neutral-600 leading-relaxed">
                                    {faq.answer}
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}

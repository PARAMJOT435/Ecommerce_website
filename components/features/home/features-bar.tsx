"use client"

import React from "react"
import { Truck, Shield, RotateCcw, Headphones, Zap } from "lucide-react"
import Link from "next/link"

export function FeaturesBar() {
    return (
        <div className="w-full bg-blue-200 border-y-2 border-blue-500 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-bold text-blue-900 mb-6">🔧 Why Choose Us?</h2>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {/* Feature 1 */}
                    <div className="bg-white p-4 rounded-lg border border-blue-300">
                        <div className="flex items-center gap-2 mb-2">
                            <Truck className="h-5 w-5 text-blue-600" />
                            <h3 className="font-semibold text-neutral-900">Free Shipping</h3>
                        </div>
                        <p className="text-sm text-neutral-600">On orders above ₹499</p>
                    </div>

                    {/* Feature 2 */}
                    <div className="bg-white p-4 rounded-lg border border-blue-300">
                        <div className="flex items-center gap-2 mb-2">
                            <RotateCcw className="h-5 w-5 text-blue-600" />
                            <h3 className="font-semibold text-neutral-900">7-Day Returns</h3>
                        </div>
                        <p className="text-sm text-neutral-600">Easy return & exchange</p>
                    </div>

                    {/* Feature 3 */}
                    <div className="bg-white p-4 rounded-lg border border-blue-300">
                        <div className="flex items-center gap-2 mb-2">
                            <Shield className="h-5 w-5 text-blue-600" />
                            <h3 className="font-semibold text-neutral-900">Genuine Products</h3>
                        </div>
                        <p className="text-sm text-neutral-600">100% authentic & certified</p>
                    </div>

                    {/* Feature 4 */}
                    <div className="bg-white p-4 rounded-lg border border-blue-300">
                        <div className="flex items-center gap-2 mb-2">
                            <Zap className="h-5 w-5 text-blue-600" />
                            <h3 className="font-semibold text-neutral-900">Fast Delivery</h3>
                        </div>
                        <p className="text-sm text-neutral-600">Metro cities: 1-2 days</p>
                    </div>

                    {/* Feature 5 */}
                    <div className="bg-white p-4 rounded-lg border border-blue-300">
                        <div className="flex items-center gap-2 mb-2">
                            <Headphones className="h-5 w-5 text-blue-600" />
                            <h3 className="font-semibold text-neutral-900">24/7 Support</h3>
                        </div>
                        <p className="text-sm text-neutral-600">Dedicated customer care</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

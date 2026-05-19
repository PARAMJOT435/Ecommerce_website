"use client"

import React, { useState, useEffect } from "react"
import { MapPin, Truck, Calendar, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface Address {
    id: string
    full_name: string
    address_line1: string
    city: string
    state: string
    postal_code: string
}

interface DeliveryEstimate {
    minDays: number
    maxDays: number
    deliveryDate: string
}

// Simple distance-based delivery calculation
// In production, use actual geolocation or postal code database
const calculateDeliveryDays = (state: string): number => {
    // Base delivery time: 2 days processing + delivery time based on state
    const stateDistanceMap: Record<string, number> = {
        // Metro states: 1-2 days
        "maharashtra": 1,
        "karnataka": 1,
        "tamil-nadu": 1,
        "delhi": 1,
        "gurgaon": 1,
        "bangalore": 1,
        "mumbai": 1,
        "hyderabad": 1,
        // Tier 2 states: 2-3 days
        "punjab": 2,
        "haryana": 2,
        "uttar-pradesh": 2,
        "madhya-pradesh": 2,
        "rajasthan": 2,
        "bihar": 2,
        "west-bengal": 2,
        "telangana": 2,
        "andhra-pradesh": 2,
        "kerala": 2,
        // Tier 3 states: 3-4 days
        "jharkhand": 3,
        "assam": 3,
        "odisha": 3,
        "chhattisgarh": 3,
        "uttarakhand": 3,
        "himachal-pradesh": 3,
        "jammu-kashmir": 4,
        "northeast": 4,
    }
    
    const deliveryDays = stateDistanceMap[state.toLowerCase()] || 2
    return 2 + deliveryDays // 2 days processing + delivery days
}

const getDeliveryEstimate = (state: string): DeliveryEstimate => {
    const daysToDeliver = calculateDeliveryDays(state)
    const minDate = new Date()
    const maxDate = new Date()
    
    minDate.setDate(minDate.getDate() + daysToDeliver)
    maxDate.setDate(maxDate.getDate() + daysToDeliver + 1)
    
    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-IN', {
            weekday: 'short',
            day: 'numeric',
            month: 'short'
        })
    }
    
    return {
        minDays: daysToDeliver,
        maxDays: daysToDeliver + 1,
        deliveryDate: `${formatDate(minDate)} - ${formatDate(maxDate)}`
    }
}

interface ProductDeliveryCalculatorProps {
    userAddresses: Address[]
    isAdmin: boolean
}

export function ProductDeliveryCalculator({ userAddresses, isAdmin }: ProductDeliveryCalculatorProps) {
    const [selectedAddressId, setSelectedAddressId] = useState<string>("")
    const [deliveryEstimate, setDeliveryEstimate] = useState<DeliveryEstimate | null>(null)
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)

    useEffect(() => {
        if (userAddresses.length > 0 && !selectedAddressId) {
            // Select first address by default
            const defaultAddress = userAddresses.find(a => a.id) || userAddresses[0]
            setSelectedAddressId(defaultAddress.id)
            setSelectedAddress(defaultAddress)
            setDeliveryEstimate(getDeliveryEstimate(defaultAddress.state))
        }
    }, [userAddresses, selectedAddressId])

    const handleAddressChange = (addressId: string) => {
        setSelectedAddressId(addressId)
        const address = userAddresses.find(a => a.id === addressId)
        if (address) {
            setSelectedAddress(address)
            setDeliveryEstimate(getDeliveryEstimate(address.state))
        }
    }

    if (isAdmin) {
        return null
    }

    if (!userAddresses || userAddresses.length === 0) {
        return (
            <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="pt-6">
                    <div className="flex gap-3">
                        <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-yellow-900">No address found</p>
                            <p className="text-xs text-yellow-800 mt-1">
                                Add a delivery address to see estimated delivery time
                            </p>
                            <Button 
                                size="sm" 
                                variant="outline"
                                className="mt-3 border-yellow-600 text-yellow-900 hover:bg-yellow-100"
                                asChild
                            >
                                <a href="/account/addresses">Add Address</a>
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="border-neutral-200 bg-white h-fit">
            <CardHeader className="pb-3 border-b border-neutral-200">
                <CardTitle className="text-sm font-semibold flex items-center gap-2 text-neutral-900">
                    <Truck className="h-4 w-4 text-blue-600" />
                    Delivery Details
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
                {/* Address Selector */}
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-neutral-700">Deliver to:</label>
                    <Select value={selectedAddressId} onValueChange={handleAddressChange}>
                        <SelectTrigger className="w-full bg-neutral-50 border-neutral-300 text-xs h-9">
                            <SelectValue placeholder="Select address" />
                        </SelectTrigger>
                        <SelectContent>
                            {userAddresses.map((address) => (
                                <SelectItem key={address.id} value={address.id}>
                                    <div className="flex items-center gap-2 text-xs">
                                        <MapPin className="h-3 w-3" />
                                        {address.full_name} - {address.city}
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Selected Address Details */}
                {selectedAddress && (
                    <div className="bg-neutral-50 rounded-lg p-3 border border-neutral-200">
                        <p className="text-xs font-semibold text-neutral-900 mb-1">{selectedAddress.full_name}</p>
                        <p className="text-xs text-neutral-600 leading-relaxed">
                            {selectedAddress.address_line1}
                        </p>
                        <p className="text-xs text-neutral-600 leading-relaxed">
                            {selectedAddress.city}, {selectedAddress.state} {selectedAddress.postal_code}
                        </p>
                    </div>
                )}

                {/* Delivery Timeline */}
                {deliveryEstimate && (
                    <div className="border-t border-neutral-200 pt-3">
                        <div className="flex items-start gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                                <Calendar className="h-4 w-4 text-green-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-neutral-600 mb-1">
                                    Estimated Delivery
                                </p>
                                <p className="text-sm font-bold text-green-600 leading-tight">
                                    {deliveryEstimate.deliveryDate}
                                </p>
                                <p className="text-xs text-neutral-500 mt-1">
                                    Order processing: 2 days
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Info */}
                <div className="bg-blue-50 rounded-lg p-2.5 border border-blue-200">
                    <p className="text-xs text-blue-900 leading-relaxed">
                        <span className="font-semibold">ℹ️ Note:</span> Delivery times are estimates. Actual delivery may vary based on your location.
                    </p>
                </div>

                {/* Change Address Button */}
                <Button 
                    size="sm" 
                    variant="outline"
                    className="w-full text-blue-600 border-blue-300 hover:bg-blue-50 text-xs h-8"
                    asChild
                >
                    <a href="/account/addresses">Change Address</a>
                </Button>
            </CardContent>
        </Card>
    )
}

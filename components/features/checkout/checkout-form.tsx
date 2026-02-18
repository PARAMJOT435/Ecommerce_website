"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ArrowRight, MapPin, ClipboardList, CreditCard, Check, Truck, Shield, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useCartStore, CartItem } from "@/stores/cart-store"
import { createOrder } from "@/app/actions/checkout"
import { toast } from "sonner"

const STEPS = [
    { id: 1, label: "Address", icon: MapPin },
    { id: 2, label: "Review", icon: ClipboardList },
    { id: 3, label: "Payment", icon: CreditCard },
]

const FREE_SHIPPING_THRESHOLD = 499
const SHIPPING_COST = 49
const TAX_RATE = 0.18

const INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Delhi", "Chandigarh", "Puducherry", "Ladakh", "Lakshadweep",
    "Andaman and Nicobar Islands", "Dadra and Nagar Haveli and Daman and Diu", "Jammu and Kashmir",
]

interface SavedAddress {
    id: string
    full_name: string
    address_line1: string
    address_line2?: string | null
    city: string
    state: string
    postal_code: string
    phone: string
}

interface CheckoutFormProps {
    savedAddresses?: SavedAddress[]
}

export function CheckoutForm({ savedAddresses = [] }: CheckoutFormProps) {
    const router = useRouter()
    const items = useCartStore((s) => s.items)
    const clearCart = useCartStore((s) => s.clearCart)
    const subtotal = useCartStore((s) => s.subtotal)()

    const [step, setStep] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [selectedAddressId, setSelectedAddressId] = useState<string | "new">(
        savedAddresses.length > 0 ? savedAddresses[0].id : "new"
    )

    // Address state — pre-fill from first saved address if available
    const firstSaved = savedAddresses[0]
    const [address, setAddress] = useState({
        fullName: firstSaved?.full_name || "",
        addressLine1: firstSaved?.address_line1 || "",
        addressLine2: firstSaved?.address_line2 || "",
        city: firstSaved?.city || "",
        state: firstSaved?.state || "",
        postalCode: firstSaved?.postal_code || "",
        phone: firstSaved?.phone || "",
    })

    const handleSelectAddress = (id: string) => {
        setSelectedAddressId(id)
        if (id === "new") {
            setAddress({ fullName: "", addressLine1: "", addressLine2: "", city: "", state: "", postalCode: "", phone: "" })
        } else {
            const saved = savedAddresses.find((a) => a.id === id)
            if (saved) {
                setAddress({
                    fullName: saved.full_name,
                    addressLine1: saved.address_line1,
                    addressLine2: saved.address_line2 || "",
                    city: saved.city,
                    state: saved.state,
                    postalCode: saved.postal_code,
                    phone: saved.phone,
                })
            }
        }
    }

    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
    const tax = Math.round(subtotal * TAX_RATE * 100) / 100
    const total = subtotal + shipping + tax

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const isAddressValid = () => {
        return (
            address.fullName.trim() &&
            address.addressLine1.trim() &&
            address.city.trim() &&
            address.state.trim() &&
            address.postalCode.trim() &&
            address.phone.trim() &&
            /^\d{6}$/.test(address.postalCode) &&
            /^\d{10}$/.test(address.phone.replace(/\D/g, ''))
        )
    }

    const handlePlaceOrder = async () => {
        setIsSubmitting(true)

        const checkoutItems = items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
        }))

        const result = await createOrder(address, checkoutItems)

        if (result.error) {
            toast.error(result.error)
            setIsSubmitting(false)
            return
        }

        clearCart()
        toast.success("Order placed successfully!")
        router.push(`/order-success?order=${result.orderNumber}`)
    }

    if (items.length === 0) {
        return (
            <div className="rounded-xl border border-neutral-200 bg-white py-16 text-center">
                <ClipboardList className="mx-auto h-12 w-12 text-neutral-300" />
                <h3 className="mt-4 text-lg font-semibold text-neutral-900">Your cart is empty</h3>
                <p className="mt-1 text-sm text-muted-foreground">Add items before checking out.</p>
                <Button asChild className="mt-4 bg-primary-600 hover:bg-primary-700 text-white">
                    <Link href="/products">Browse Products</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Step Indicator */}
            <div className="flex items-center justify-center gap-2">
                {STEPS.map((s, i) => {
                    const Icon = s.icon
                    const isActive = step === s.id
                    const isCompleted = step > s.id
                    return (
                        <React.Fragment key={s.id}>
                            <div className="flex items-center gap-2">
                                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${isCompleted
                                    ? "bg-primary-600 text-white"
                                    : isActive
                                        ? "bg-primary-100 text-primary-700 ring-2 ring-primary-600"
                                        : "bg-neutral-100 text-neutral-400"
                                    }`}>
                                    {isCompleted ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                                </div>
                                <span className={`text-sm font-medium hidden sm:inline ${isActive ? "text-primary-700" : isCompleted ? "text-neutral-900" : "text-neutral-400"
                                    }`}>
                                    {s.label}
                                </span>
                            </div>
                            {i < STEPS.length - 1 && (
                                <div className={`h-px w-8 sm:w-16 ${step > s.id ? "bg-primary-600" : "bg-neutral-200"}`} />
                            )}
                        </React.Fragment>
                    )
                })}
            </div>

            <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
                {/* Main Content */}
                <div className="rounded-xl border border-neutral-200 bg-white p-6">
                    {step === 1 && (
                        <div className="space-y-5">
                            <h2 className="text-lg font-semibold text-neutral-900">Shipping Address</h2>

                            {/* Saved Address Selector */}
                            {savedAddresses.length > 0 && (
                                <div className="space-y-3">
                                    <p className="text-sm font-medium text-muted-foreground">Select a saved address</p>
                                    <div className="grid gap-2">
                                        {savedAddresses.map((a) => (
                                            <button
                                                key={a.id}
                                                type="button"
                                                onClick={() => handleSelectAddress(a.id)}
                                                className={`w-full text-left rounded-lg border p-3 text-sm transition-all ${selectedAddressId === a.id
                                                    ? "border-primary-600 bg-primary-50 ring-1 ring-primary-600"
                                                    : "border-neutral-200 hover:border-neutral-300"
                                                    }`}
                                            >
                                                <p className="font-medium">{a.full_name}</p>
                                                <p className="text-muted-foreground">
                                                    {a.address_line1}{a.address_line2 ? `, ${a.address_line2}` : ""}
                                                </p>
                                                <p className="text-muted-foreground">
                                                    {a.city}, {a.state} — {a.postal_code}
                                                </p>
                                                <p className="text-muted-foreground">{a.phone}</p>
                                            </button>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => handleSelectAddress("new")}
                                            className={`w-full text-left rounded-lg border border-dashed p-3 text-sm transition-all ${selectedAddressId === "new"
                                                ? "border-primary-600 bg-primary-50 ring-1 ring-primary-600"
                                                : "border-neutral-300 hover:border-neutral-400 text-muted-foreground"
                                                }`}
                                        >
                                            + Add New Address
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Manual Address Form — shown when 'new' selected or no saved addresses */}
                            {(selectedAddressId === "new" || savedAddresses.length === 0) && (
                                <>
                                    <div>
                                        <Label htmlFor="fullName">Full Name *</Label>
                                        <Input id="fullName" name="fullName" value={address.fullName} onChange={handleAddressChange} required />
                                    </div>

                                    <div>
                                        <Label htmlFor="addressLine1">Address Line 1 *</Label>
                                        <Input id="addressLine1" name="addressLine1" value={address.addressLine1} onChange={handleAddressChange} placeholder="House number, street" required />
                                    </div>

                                    <div>
                                        <Label htmlFor="addressLine2">Address Line 2</Label>
                                        <Input id="addressLine2" name="addressLine2" value={address.addressLine2} onChange={handleAddressChange} placeholder="Apartment, landmark (optional)" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="city">City *</Label>
                                            <Input id="city" name="city" value={address.city} onChange={handleAddressChange} required />
                                        </div>
                                        <div>
                                            <Label htmlFor="state">State *</Label>
                                            <select
                                                id="state"
                                                name="state"
                                                value={address.state}
                                                onChange={handleAddressChange}
                                                className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                                required
                                            >
                                                <option value="">Select state</option>
                                                {INDIAN_STATES.map((s) => (
                                                    <option key={s} value={s}>{s}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="postalCode">PIN Code *</Label>
                                            <Input
                                                id="postalCode"
                                                name="postalCode"
                                                value={address.postalCode}
                                                onChange={handleAddressChange}
                                                placeholder="6-digit PIN"
                                                maxLength={6}
                                                pattern="\d{6}"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="phone">Phone *</Label>
                                            <Input
                                                id="phone"
                                                name="phone"
                                                value={address.phone}
                                                onChange={handleAddressChange}
                                                placeholder="10-digit mobile"
                                                type="tel"
                                                maxLength={10}
                                                required
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            <Button
                                onClick={() => setStep(2)}
                                disabled={!isAddressValid()}
                                className="w-full gap-2 bg-primary-600 hover:bg-primary-700 text-white"
                            >
                                Continue to Review
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-neutral-900">Review Your Order</h2>
                                <Button variant="ghost" size="sm" onClick={() => setStep(1)} className="gap-1 text-xs">
                                    <ArrowLeft className="h-3 w-3" />
                                    Edit Address
                                </Button>
                            </div>

                            {/* Address Preview */}
                            <div className="rounded-lg bg-neutral-50 p-4">
                                <p className="text-xs text-muted-foreground font-medium mb-1">Shipping to</p>
                                <p className="text-sm font-semibold">{address.fullName}</p>
                                <p className="text-sm text-neutral-600">
                                    {address.addressLine1}{address.addressLine2 && `, ${address.addressLine2}`}
                                </p>
                                <p className="text-sm text-neutral-600">
                                    {address.city}, {address.state} — {address.postalCode}
                                </p>
                                <p className="text-sm text-neutral-600">{address.phone}</p>
                            </div>

                            {/* Items */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold text-neutral-900">Items ({items.length})</h3>
                                {items.map((item) => (
                                    <div key={`${item.productId}-${item.variantId}`} className="flex items-center gap-3">
                                        <div className="relative h-12 w-12 rounded-lg bg-neutral-100 overflow-hidden flex-shrink-0">
                                            {item.image ? (
                                                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="48px" />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-[10px] text-neutral-400">No img</div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{item.name}</p>
                                            <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="text-sm font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>

                            <Button
                                onClick={() => setStep(3)}
                                className="w-full gap-2 bg-primary-600 hover:bg-primary-700 text-white"
                            >
                                Continue to Payment
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-neutral-900">Payment</h2>
                                <Button variant="ghost" size="sm" onClick={() => setStep(2)} className="gap-1 text-xs">
                                    <ArrowLeft className="h-3 w-3" />
                                    Back to Review
                                </Button>
                            </div>

                            {/* COD Notice */}
                            <div className="rounded-lg border-2 border-primary-200 bg-primary-50 p-5">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
                                        <CreditCard className="h-5 w-5 text-primary-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-neutral-900">Cash on Delivery</p>
                                        <p className="text-sm text-muted-foreground">Pay when you receive your order</p>
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">
                                    Online payment options (UPI, Cards, Net Banking) will be available soon.
                                </p>
                            </div>

                            <Button
                                onClick={handlePlaceOrder}
                                disabled={isSubmitting}
                                className="w-full gap-2 bg-primary-600 hover:bg-primary-700 text-white text-base py-6"
                            >
                                {isSubmitting ? "Placing Order..." : `Place Order — ₹${total.toFixed(2)}`}
                            </Button>
                        </div>
                    )}
                </div>

                {/* Order Summary Sidebar */}
                <div className="space-y-4">
                    <div className="rounded-xl border border-neutral-200 bg-white p-5">
                        <h3 className="font-semibold text-neutral-900 mb-4">Order Summary</h3>

                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                                <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Shipping</span>
                                <span className={`font-medium ${shipping === 0 ? "text-green-600" : ""}`}>
                                    {shipping === 0 ? "FREE" : `₹${shipping.toFixed(2)}`}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">GST (18%)</span>
                                <span className="font-medium">₹{tax.toFixed(2)}</span>
                            </div>
                        </div>

                        <Separator className="my-4" />

                        <div className="flex justify-between text-base font-bold">
                            <span>Total</span>
                            <span>₹{total.toFixed(2)}</span>
                        </div>

                        {shipping > 0 && (
                            <p className="text-xs text-muted-foreground mt-2">
                                Add ₹{(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(0)} more for free shipping
                            </p>
                        )}
                    </div>

                    {/* Trust Indicators */}
                    <div className="rounded-xl border border-neutral-200 bg-white p-5 space-y-3">
                        <div className="flex items-center gap-2 text-sm text-neutral-600">
                            <Shield className="h-4 w-4 text-primary-600" />
                            <span>Secure Checkout</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-neutral-600">
                            <Truck className="h-4 w-4 text-primary-600" />
                            <span>Free delivery above ₹499</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-neutral-600">
                            <RotateCcw className="h-4 w-4 text-primary-600" />
                            <span>7-day easy returns</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

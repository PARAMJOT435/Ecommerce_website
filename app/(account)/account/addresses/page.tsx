"use client"

import React, { useState, useEffect } from "react"
import { Plus, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { AddressCard } from "@/components/features/account/address-card"
import { getAddresses, addAddress, deleteAddress, setDefaultAddress } from "@/app/actions/account"
import { toast } from "sonner"

interface Address {
    id: string
    full_name: string
    address_line1: string
    address_line2: string | null
    city: string
    state: string
    postal_code: string
    country: string
    phone: string | null
    address_type: string
    is_default: boolean
}

export default function AddressesPage() {
    const [addresses, setAddresses] = useState<Address[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const fetchAddresses = async () => {
        const { addresses: data } = await getAddresses()
        setAddresses(data as Address[])
        setIsLoading(false)
    }

    useEffect(() => {
        fetchAddresses()
    }, [])

    const handleAddAddress = async (formData: FormData) => {
        setIsSubmitting(true)
        const { error } = await addAddress(formData)
        setIsSubmitting(false)

        if (error) {
            toast.error(error)
            return
        }

        toast.success("Address added successfully")
        setIsDialogOpen(false)
        fetchAddresses()
    }

    const handleDelete = async (id: string) => {
        const { error } = await deleteAddress(id)
        if (error) {
            toast.error(error)
            return
        }
        toast.success("Address deleted")
        fetchAddresses()
    }

    const handleSetDefault = async (id: string) => {
        const { error } = await setDefaultAddress(id)
        if (error) {
            toast.error(error)
            return
        }
        toast.success("Default address updated")
        fetchAddresses()
    }

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="h-8 w-48 animate-pulse rounded bg-neutral-200" />
                <div className="grid gap-4 sm:grid-cols-2">
                    {[1, 2].map((i) => (
                        <div key={i} className="h-48 animate-pulse rounded-xl border bg-neutral-100" />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-heading font-bold text-neutral-900">Addresses</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Manage your shipping and billing addresses
                    </p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2 bg-primary-600 hover:bg-primary-700 text-white">
                            <Plus className="h-4 w-4" />
                            Add Address
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Add New Address</DialogTitle>
                        </DialogHeader>
                        <form action={handleAddAddress} className="space-y-4">
                            <div>
                                <Label htmlFor="fullName">Full Name</Label>
                                <Input id="fullName" name="fullName" required />
                            </div>
                            <div>
                                <Label htmlFor="addressLine1">Address Line 1</Label>
                                <Input id="addressLine1" name="addressLine1" required />
                            </div>
                            <div>
                                <Label htmlFor="addressLine2">Address Line 2</Label>
                                <Input id="addressLine2" name="addressLine2" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <Label htmlFor="city">City</Label>
                                    <Input id="city" name="city" required />
                                </div>
                                <div>
                                    <Label htmlFor="state">State</Label>
                                    <Input id="state" name="state" required />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <Label htmlFor="postalCode">Postal Code</Label>
                                    <Input id="postalCode" name="postalCode" required />
                                </div>
                                <div>
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input id="phone" name="phone" type="tel" />
                                </div>
                            </div>
                            <input type="hidden" name="addressType" value="both" />
                            <div className="flex items-center gap-2">
                                <input type="checkbox" id="isDefault" name="isDefault" value="true" className="rounded" />
                                <Label htmlFor="isDefault" className="text-sm font-normal">Set as default address</Label>
                            </div>
                            <Button
                                type="submit"
                                className="w-full bg-primary-600 hover:bg-primary-700 text-white"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Saving..." : "Save Address"}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {addresses.length === 0 ? (
                <div className="rounded-xl border border-neutral-200 bg-white py-16 text-center">
                    <MapPin className="mx-auto h-12 w-12 text-neutral-300" />
                    <h3 className="mt-4 text-lg font-semibold text-neutral-900">No addresses saved</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Add an address to speed up checkout.
                    </p>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                    {addresses.map((address) => (
                        <AddressCard
                            key={address.id}
                            address={address}
                            onDelete={handleDelete}
                            onSetDefault={handleSetDefault}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

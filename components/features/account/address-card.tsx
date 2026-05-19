"use client"

import React, { useState } from "react"
import { MapPin, Phone, Star, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Sheet,
    SheetContent,
} from "@/components/ui/sheet"

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

interface AddressCardProps {
    address: Address
    onEdit?: (id: string) => void
    onDelete?: (id: string) => void
    onSetDefault?: (id: string) => void
}

export function AddressCard({ address, onEdit, onDelete, onSetDefault }: AddressCardProps) {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [showDefaultConfirm, setShowDefaultConfirm] = useState(false)

    const handleDeleteClick = () => {
        setShowDeleteConfirm(true)
    }

    const handleDeleteConfirm = () => {
        setShowDeleteConfirm(false)
        onDelete?.(address.id)
    }

    const handleSetDefaultClick = () => {
        setShowDefaultConfirm(true)
    }

    const handleSetDefaultConfirm = () => {
        setShowDefaultConfirm(false)
        onSetDefault?.(address.id)
    }
    return (
        <div className={`rounded-xl border p-5 transition-shadow hover:shadow-sm ${address.is_default ? "border-primary-300 bg-primary-50/30" : "border-neutral-200 bg-white"
            }`}>
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-neutral-900">{address.full_name}</h4>
                    {address.is_default && (
                        <Badge variant="outline" className="text-[10px] border-primary-300 bg-primary-50 text-primary-700">
                            <Star className="h-2.5 w-2.5 mr-0.5 fill-current" />
                            Default
                        </Badge>
                    )}
                </div>
                <Badge variant="outline" className="text-[10px] capitalize">
                    {address.address_type}
                </Badge>
            </div>

            <div className="flex items-start gap-2 text-sm text-neutral-600 mb-1">
                <MapPin className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                <span>
                    {address.address_line1}
                    {address.address_line2 && `, ${address.address_line2}`}
                    <br />
                    {address.city}, {address.state} {address.postal_code}
                </span>
            </div>

            {address.phone && (
                <div className="flex items-center gap-2 text-sm text-neutral-600 mb-4">
                    <Phone className="h-3.5 w-3.5 flex-shrink-0" />
                    <span>{address.phone}</span>
                </div>
            )}

            <div className="flex items-center gap-2 pt-3 border-t border-neutral-100">
                {onEdit && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs gap-1.5"
                        onClick={() => onEdit(address.id)}
                    >
                        <Pencil className="h-3 w-3" />
                        Edit
                    </Button>
                )}
                {!address.is_default && onSetDefault && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs gap-1.5"
                        onClick={handleSetDefaultClick}
                    >
                        <Star className="h-3 w-3" />
                        Set Default
                    </Button>
                )}
                {onDelete && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs gap-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 ml-auto"
                        onClick={handleDeleteClick}
                    >
                        <Trash2 className="h-3 w-3" />
                        Delete
                    </Button>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg space-y-4">
                        <h2 className="text-lg font-semibold">Delete Address?</h2>
                        <p className="text-sm text-muted-foreground">Are you sure you want to delete this address?</p>
                        <div className="p-3 bg-neutral-50 rounded text-sm text-neutral-900">
                            <strong>{address.full_name}</strong><br />
                            {address.address_line1}
                            {address.address_line2 && `, ${address.address_line2}`}
                            <br />
                            {address.city}, {address.state} {address.postal_code}
                        </div>
                        <p className="text-xs text-red-600 font-medium">This action cannot be undone.</p>
                        <div className="flex gap-2 justify-end">
                            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
                            <Button
                                onClick={handleDeleteConfirm}
                                className="bg-red-600 hover:bg-red-700 text-white"
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Set Default Confirmation Dialog */}
            {showDefaultConfirm && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg space-y-4">
                        <h2 className="text-lg font-semibold">Set as Default Address?</h2>
                        <p className="text-sm text-muted-foreground">This address will be used as your default shipping address for future orders.</p>
                        <div className="p-3 bg-neutral-50 rounded text-sm text-neutral-900">
                            <strong>{address.full_name}</strong><br />
                            {address.address_line1}
                            {address.address_line2 && `, ${address.address_line2}`}
                            <br />
                            {address.city}, {address.state} {address.postal_code}
                        </div>
                        <div className="flex gap-2 justify-end">
                            <Button variant="outline" onClick={() => setShowDefaultConfirm(false)}>Cancel</Button>
                            <Button
                                onClick={handleSetDefaultConfirm}
                                className="bg-primary-600 hover:bg-primary-700 text-white"
                            >
                                Set Default
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

"use client"

import React from "react"
import { MapPin, Phone, Star, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

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
                        onClick={() => onSetDefault(address.id)}
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
                        onClick={() => onDelete(address.id)}
                    >
                        <Trash2 className="h-3 w-3" />
                        Delete
                    </Button>
                )}
            </div>
        </div>
    )
}

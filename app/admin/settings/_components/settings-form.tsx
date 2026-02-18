"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Store, Truck, Receipt, Shield, Save, Loader2, Pencil, X } from "lucide-react"
import { updateSettings } from "@/app/actions/admin-settings"
import { toast } from "sonner"

interface SettingsFormProps {
    initialSettings: Record<string, string>
}

function Row({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-medium">{value}</span>
        </div>
    )
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
    const [settings, setSettings] = useState(initialSettings)
    const [editing, setEditing] = useState(false)
    const [saving, setSaving] = useState(false)

    function update(key: string, value: string) {
        setSettings(prev => ({ ...prev, [key]: value }))
    }

    function handleCancel() {
        setSettings(initialSettings)
        setEditing(false)
    }

    async function handleSave() {
        setSaving(true)
        const formData = new FormData()
        Object.entries(settings).forEach(([key, value]) => {
            formData.append(key, value)
        })

        const result = await updateSettings(formData)
        setSaving(false)

        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success("Settings saved successfully")
            setEditing(false)
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
                {editing ? (
                    <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={handleCancel} disabled={saving} className="gap-1.5">
                            <X className="h-4 w-4" /> Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={saving} className="bg-primary-600 hover:bg-primary-700 text-white gap-1.5">
                            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            {saving ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                ) : (
                    <Button variant="outline" onClick={() => setEditing(true)} className="gap-1.5">
                        <Pencil className="h-4 w-4" /> Edit
                    </Button>
                )}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Store Info */}
                <Card>
                    <CardHeader className="flex flex-row items-center gap-2 space-y-0">
                        <Store className="h-5 w-5 text-primary-600" />
                        <CardTitle className="text-base">Store Info</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        {editing ? (
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="store_name" className="text-xs">Store Name</Label>
                                    <Input id="store_name" value={settings.store_name} onChange={(e) => update("store_name", e.target.value)} />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="store_tagline" className="text-xs">Tagline</Label>
                                    <Input id="store_tagline" value={settings.store_tagline} onChange={(e) => update("store_tagline", e.target.value)} />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="store_email" className="text-xs">Contact Email</Label>
                                    <Input id="store_email" type="email" value={settings.store_email} onChange={(e) => update("store_email", e.target.value)} />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="store_phone" className="text-xs">Phone</Label>
                                    <Input id="store_phone" value={settings.store_phone} onChange={(e) => update("store_phone", e.target.value)} />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="store_address" className="text-xs">Address</Label>
                                    <Input id="store_address" value={settings.store_address} onChange={(e) => update("store_address", e.target.value)} />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="business_hours" className="text-xs">Business Hours</Label>
                                    <Input id="business_hours" value={settings.business_hours} onChange={(e) => update("business_hours", e.target.value)} />
                                </div>
                            </div>
                        ) : (
                            <>
                                <Row label="Store Name" value={settings.store_name} />
                                <Row label="Tagline" value={settings.store_tagline} />
                                <Row label="Email" value={settings.store_email} />
                                <Row label="Phone" value={settings.store_phone} />
                                <Row label="Address" value={settings.store_address} />
                                <Row label="Hours" value={settings.business_hours} />
                                <Row label="Currency" value={`${settings.currency} (₹)`} />
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Shipping */}
                <Card>
                    <CardHeader className="flex flex-row items-center gap-2 space-y-0">
                        <Truck className="h-5 w-5 text-blue-600" />
                        <CardTitle className="text-base">Shipping</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        {editing ? (
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="free_shipping_threshold" className="text-xs">Free Shipping Threshold (₹)</Label>
                                    <Input id="free_shipping_threshold" type="number" value={settings.free_shipping_threshold} onChange={(e) => update("free_shipping_threshold", e.target.value)} />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="flat_shipping_rate" className="text-xs">Flat Shipping Rate (₹)</Label>
                                    <Input id="flat_shipping_rate" type="number" value={settings.flat_shipping_rate} onChange={(e) => update("flat_shipping_rate", e.target.value)} />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="returns_window_days" className="text-xs">Returns Window (days)</Label>
                                    <Input id="returns_window_days" type="number" value={settings.returns_window_days} onChange={(e) => update("returns_window_days", e.target.value)} />
                                </div>
                            </div>
                        ) : (
                            <>
                                <Row label="Free Shipping Threshold" value={`₹${settings.free_shipping_threshold}`} />
                                <Row label="Flat Rate" value={`₹${settings.flat_shipping_rate}`} />
                                <Row label="Returns Window" value={`${settings.returns_window_days} days`} />
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Tax */}
                <Card>
                    <CardHeader className="flex flex-row items-center gap-2 space-y-0">
                        <Receipt className="h-5 w-5 text-orange-600" />
                        <CardTitle className="text-base">Tax</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        {editing ? (
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="gst_rate" className="text-xs">GST Rate (%)</Label>
                                    <Input id="gst_rate" type="number" value={settings.gst_rate} onChange={(e) => update("gst_rate", e.target.value)} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label htmlFor="tax_included" className="text-xs">Tax Included in Price</Label>
                                        <p className="text-xs text-muted-foreground">If off, tax is added at checkout</p>
                                    </div>
                                    <Switch
                                        id="tax_included"
                                        checked={settings.tax_included === "true"}
                                        onCheckedChange={(checked) => update("tax_included", checked.toString())}
                                    />
                                </div>
                            </div>
                        ) : (
                            <>
                                <Row label="GST Rate" value={`${settings.gst_rate}%`} />
                                <Row label="Tax Included in Price" value={settings.tax_included === "true" ? "Yes" : "No (added at checkout)"} />
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Security */}
                <Card>
                    <CardHeader className="flex flex-row items-center gap-2 space-y-0">
                        <Shield className="h-5 w-5 text-green-600" />
                        <CardTitle className="text-base">Security</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        <Row label="Payment Gateway" value={`${settings.payment_gateway} (pending)`} />
                        <Row label="Auth Provider" value="Supabase Auth" />
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">RLS Policies</span>
                            <span className="font-medium text-green-600">Active</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { getProfile, updateProfile, changePassword } from "@/app/actions/account"
import { toast } from "sonner"
import { User, Lock, Save } from "lucide-react"

export default function SettingsPage() {
    const [profile, setProfile] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSavingProfile, setIsSavingProfile] = useState(false)
    const [isSavingPassword, setIsSavingPassword] = useState(false)

    useEffect(() => {
        const fetchProfile = async () => {
            const { profile: data } = await getProfile()
            setProfile(data)
            setIsLoading(false)
        }
        fetchProfile()
    }, [])

    const handleUpdateProfile = async (formData: FormData) => {
        setIsSavingProfile(true)
        const { error } = await updateProfile(formData)
        setIsSavingProfile(false)

        if (error) {
            toast.error(error)
            return
        }
        toast.success("Profile updated successfully")
    }

    const handleChangePassword = async (formData: FormData) => {
        setIsSavingPassword(true)
        const { error } = await changePassword(formData)
        setIsSavingPassword(false)

        if (error) {
            toast.error(error)
            return
        }
        toast.success("Password changed successfully")
    }

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="h-8 w-48 animate-pulse rounded bg-neutral-200" />
                <div className="h-64 animate-pulse rounded-xl border bg-neutral-100" />
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-heading font-bold text-neutral-900">Settings</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Manage your profile and account preferences
                </p>
            </div>

            {/* Profile Section */}
            <div className="rounded-xl border border-neutral-200 bg-white p-6">
                <div className="flex items-center gap-2 mb-6">
                    <User className="h-5 w-5 text-neutral-600" />
                    <h2 className="text-lg font-semibold text-neutral-900">Profile Information</h2>
                </div>

                <form action={handleUpdateProfile} className="space-y-4 max-w-lg">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                                id="firstName"
                                name="firstName"
                                defaultValue={profile?.first_name || ''}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                                id="lastName"
                                name="lastName"
                                defaultValue={profile?.last_name || ''}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            value={profile?.email || ''}
                            disabled
                            className="bg-neutral-50"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            Email cannot be changed
                        </p>
                    </div>

                    <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            defaultValue={profile?.phone || ''}
                            placeholder="+91 9876543210"
                        />
                    </div>

                    <Button
                        type="submit"
                        className="gap-2 bg-primary-600 hover:bg-primary-700 text-white"
                        disabled={isSavingProfile}
                    >
                        <Save className="h-4 w-4" />
                        {isSavingProfile ? "Saving..." : "Save Changes"}
                    </Button>
                </form>
            </div>

            {/* Password Section */}
            <div className="rounded-xl border border-neutral-200 bg-white p-6">
                <div className="flex items-center gap-2 mb-6">
                    <Lock className="h-5 w-5 text-neutral-600" />
                    <h2 className="text-lg font-semibold text-neutral-900">Change Password</h2>
                </div>

                <form action={handleChangePassword} className="space-y-4 max-w-lg">
                    <div>
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            required
                            minLength={6}
                            placeholder="Minimum 6 characters"
                        />
                    </div>

                    <div>
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            required
                            minLength={6}
                        />
                    </div>

                    <Button
                        type="submit"
                        variant="outline"
                        className="gap-2"
                        disabled={isSavingPassword}
                    >
                        <Lock className="h-4 w-4" />
                        {isSavingPassword ? "Changing..." : "Change Password"}
                    </Button>
                </form>
            </div>
        </div>
    )
}

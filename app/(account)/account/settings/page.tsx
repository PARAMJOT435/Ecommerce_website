"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ImageUpload } from "@/components/ui/image-upload"
import { getProfile, updateProfile, changePassword } from "@/app/actions/account"
import { toast } from "sonner"
import { User, Lock, Save, Edit2, X, Camera } from "lucide-react"
import {
    Sheet,
    SheetContent,
} from "@/components/ui/sheet"
import Image from "next/image"

export default function SettingsPage() {
    const [profile, setProfile] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSavingProfile, setIsSavingProfile] = useState(false)
    const [isEditingProfile, setIsEditingProfile] = useState(false)
    
    // Password states
    const [isChangingPassword, setIsChangingPassword] = useState(false)
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPasswordForm, setShowPasswordForm] = useState(false)
    const [isValidatingPassword, setIsValidatingPassword] = useState(false)
    
    // Confirmation dialogs
    const [showProfileConfirm, setShowProfileConfirm] = useState(false)
    const [profileChanges, setProfileChanges] = useState<any>(null)
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)

    // Form state for profile edit
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        profilePicture: null as string | File | null
    })

    useEffect(() => {
        const fetchProfile = async () => {
            const { profile: data, error } = await getProfile()
            if (error) {
                toast.error("Failed to load profile")
                setIsLoading(false)
                return
            }
            if (data) {
                setProfile(data)
                setFormData({
                    firstName: data.first_name || "",
                    lastName: data.last_name || "",
                    phone: data.phone || "",
                    profilePicture: data.profile_picture_url || null
                })
            }
            setIsLoading(false)
        }
        fetchProfile()
    }, [])

    const handleProfileEditStart = () => {
        setIsEditingProfile(true)
    }

    const handleProfileEditCancel = () => {
        setIsEditingProfile(false)
        setFormData({
            firstName: profile?.first_name || "",
            lastName: profile?.last_name || "",
            phone: profile?.phone || "",
            profilePicture: profile?.profile_picture_url || null
        })
    }

    const handleProfileEditChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleProfileSaveClick = () => {
        // Show confirmation with changes
        const changes: any = {}
        if (formData.firstName !== profile?.first_name) {
            changes.firstName = { old: profile?.first_name, new: formData.firstName }
        }
        if (formData.lastName !== profile?.last_name) {
            changes.lastName = { old: profile?.last_name, new: formData.lastName }
        }
        if (formData.phone !== profile?.phone) {
            changes.phone = { old: profile?.phone, new: formData.phone }
        }
        if (formData.profilePicture) {
            changes.profilePicture = { changed: true }
        }

        if (Object.keys(changes).length === 0) {
            toast.info("No changes made")
            setIsEditingProfile(false)
            return
        }

        setProfileChanges(changes)
        setShowProfileConfirm(true)
    }

    const handleProfileConfirm = async () => {
        setShowProfileConfirm(false)
        setIsSavingProfile(true)

        const formDataObj = new FormData()
        formDataObj.append("firstName", formData.firstName)
        formDataObj.append("lastName", formData.lastName)
        formDataObj.append("phone", formData.phone)
        if (formData.profilePicture instanceof File) {
            formDataObj.append("profilePicture", formData.profilePicture)
        }

        const { error } = await updateProfile(formDataObj)
        setIsSavingProfile(false)

        if (error) {
            toast.error(error)
            return
        }

        // Fetch the updated profile to ensure we have the correct data from server
        const { profile: updatedProfile } = await getProfile()
        if (updatedProfile) {
            setProfile(updatedProfile)
            setFormData({
                firstName: updatedProfile.first_name || "",
                lastName: updatedProfile.last_name || "",
                phone: updatedProfile.phone || "",
                profilePicture: updatedProfile.profile_picture_url || null
            })
        }
        setIsEditingProfile(false)
        toast.success("Profile updated successfully")
    }

    const handlePasswordFormStart = () => {
        setShowPasswordForm(true)
    }

    const handlePasswordFormCancel = () => {
        setShowPasswordForm(false)
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
    }

    const handlePasswordValidateClick = async () => {
        if (!currentPassword.trim()) {
            toast.error("Please enter your current password")
            return
        }

        setIsValidatingPassword(true)
        
        // Call validation action
        try {
            const response = await fetch("/api/auth/validate-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentPassword })
            })
            
            if (!response.ok) {
                toast.error("Current password is incorrect")
                setIsValidatingPassword(false)
                return
            }

            setIsValidatingPassword(false)
            setShowPasswordConfirm(true)
        } catch (err) {
            toast.error("Error validating password")
            setIsValidatingPassword(false)
        }
    }

    const handlePasswordChange = async () => {
        if (newPassword !== confirmPassword) {
            toast.error("New passwords do not match")
            return
        }

        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters")
            return
        }

        setShowPasswordConfirm(false)
        setIsChangingPassword(true)

        const formDataObj = new FormData()
        formDataObj.append("currentPassword", currentPassword)
        formDataObj.append("newPassword", newPassword)
        formDataObj.append("confirmPassword", confirmPassword)

        const { error } = await changePassword(formDataObj)
        setIsChangingPassword(false)

        if (error) {
            toast.error(error)
            return
        }

        toast.success("Password changed successfully")
        setShowPasswordForm(false)
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
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
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-neutral-600" />
                        <h2 className="text-lg font-semibold text-neutral-900">Profile Information</h2>
                    </div>
                    {!isEditingProfile && (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleProfileEditStart}
                            className="gap-2"
                        >
                            <Edit2 className="h-4 w-4" />
                            Edit
                        </Button>
                    )}
                </div>

                {!isEditingProfile ? (
                    // Display Mode
                    <div className="space-y-4 max-w-lg">
                        {/* Profile Picture Display */}
                        <div>
                            <p className="text-xs font-medium text-neutral-600 uppercase tracking-wide mb-2">Profile Picture</p>
                            <div className="h-32 w-32 rounded-lg overflow-hidden bg-neutral-100 flex items-center justify-center">
                                {profile?.profile_picture_url ? (
                                    <Image
                                        src={profile.profile_picture_url}
                                        alt="Profile picture"
                                        width={128}
                                        height={128}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center w-full h-full">
                                        <User className="h-8 w-8 text-neutral-400" />
                                        <p className="text-xs text-neutral-500 mt-1">No picture</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <Separator className="my-4" />

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs font-medium text-neutral-600 uppercase tracking-wide">First Name</p>
                                <p className="text-sm text-neutral-900 mt-1">{profile?.first_name || "Not set"}</p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-neutral-600 uppercase tracking-wide">Last Name</p>
                                <p className="text-sm text-neutral-900 mt-1">{profile?.last_name || "Not set"}</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-neutral-600 uppercase tracking-wide">Email</p>
                            <p className="text-sm text-neutral-900 mt-1">{profile?.email}</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-neutral-600 uppercase tracking-wide">Phone</p>
                            <p className="text-sm text-neutral-900 mt-1">{profile?.phone || "Not set"}</p>
                        </div>
                    </div>
                ) : (
                    // Edit Mode
                    <div className="space-y-4 max-w-lg">
                        {/* Profile Picture Upload */}
                        <div>
                            <Label className="block mb-3">Profile Picture</Label>
                            <p className="text-xs text-muted-foreground mb-3">Upload a profile picture or leave empty to use default</p>
                            <ImageUpload
                                value={formData.profilePicture}
                                onChange={(value) => handleProfileEditChange("profilePicture", value as any)}
                            />
                        </div>

                        <Separator className="my-4" />

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="firstName">First Name</Label>
                                <Input
                                    id="firstName"
                                    value={formData.firstName}
                                    onChange={(e) => handleProfileEditChange("firstName", e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input
                                    id="lastName"
                                    value={formData.lastName}
                                    onChange={(e) => handleProfileEditChange("lastName", e.target.value)}
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
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => handleProfileEditChange("phone", e.target.value)}
                                placeholder="+91 9876543210"
                            />
                        </div>

                        <div className="flex gap-2">
                            <Button
                                type="button"
                                onClick={handleProfileSaveClick}
                                disabled={isSavingProfile}
                                className="gap-2 bg-primary-600 hover:bg-primary-700 text-white"
                            >
                                <Save className="h-4 w-4" />
                                {isSavingProfile ? "Saving..." : "Review Changes"}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleProfileEditCancel}
                                className="gap-2"
                            >
                                <X className="h-4 w-4" />
                                Cancel
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Password Section */}
            <div className="rounded-xl border border-neutral-200 bg-white p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <Lock className="h-5 w-5 text-neutral-600" />
                        <h2 className="text-lg font-semibold text-neutral-900">Security</h2>
                    </div>
                    {!showPasswordForm && (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handlePasswordFormStart}
                            className="gap-2"
                        >
                            <Lock className="h-4 w-4" />
                            Change Password
                        </Button>
                    )}
                </div>

                {!showPasswordForm ? (
                    <p className="text-sm text-muted-foreground">
                        Your password is securely stored. Change it regularly to keep your account safe.
                    </p>
                ) : (
                    <div className="space-y-4 max-w-lg">
                        {/* Step 1: Validate current password */}
                        {!showPasswordConfirm ? (
                            <>
                                <div>
                                    <Label htmlFor="currentPassword">Current Password</Label>
                                    <Input
                                        id="currentPassword"
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        placeholder="Enter your current password"
                                        required
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">
                                        We need this to verify it's really you
                                    </p>
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        onClick={handlePasswordValidateClick}
                                        disabled={isValidatingPassword || !currentPassword.trim()}
                                        className="gap-2 bg-primary-600 hover:bg-primary-700 text-white"
                                    >
                                        <Lock className="h-4 w-4" />
                                        {isValidatingPassword ? "Verifying..." : "Verify Password"}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handlePasswordFormCancel}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </>
                        ) : (
                            /* Step 2: Enter new password */
                            <>
                                <div className="bg-green-50 border border-green-200 rounded p-3 mb-4">
                                    <p className="text-sm text-green-800 font-medium">✓ Password verified</p>
                                </div>

                                <div>
                                    <Label htmlFor="newPassword">New Password</Label>
                                    <Input
                                        id="newPassword"
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Minimum 6 characters"
                                        minLength={6}
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Re-enter new password"
                                        minLength={6}
                                        required
                                    />
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        onClick={handlePasswordChange}
                                        disabled={isChangingPassword || !newPassword || !confirmPassword}
                                        className="gap-2 bg-primary-600 hover:bg-primary-700 text-white"
                                    >
                                        <Lock className="h-4 w-4" />
                                        {isChangingPassword ? "Changing..." : "Change Password"}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setShowPasswordConfirm(false)
                                            setCurrentPassword("")
                                            setNewPassword("")
                                            setConfirmPassword("")
                                        }}
                                    >
                                        Back
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Profile Confirmation Dialog */}
            {showProfileConfirm && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg space-y-4">
                        <h2 className="text-lg font-semibold">Confirm Profile Changes</h2>
                        <p className="text-sm text-muted-foreground">Please review your changes before saving:</p>
                        {profileChanges && (
                            <div className="space-y-2 bg-neutral-50 p-3 rounded">
                                {profileChanges.firstName && (
                                    <div className="text-sm">
                                        <p className="font-medium text-neutral-900">First Name</p>
                                        <p className="text-neutral-600">{profileChanges.firstName.old || "Not set"} → {profileChanges.firstName.new}</p>
                                    </div>
                                )}
                                {profileChanges.lastName && (
                                    <div className="text-sm">
                                        <p className="font-medium text-neutral-900">Last Name</p>
                                        <p className="text-neutral-600">{profileChanges.lastName.old || "Not set"} → {profileChanges.lastName.new}</p>
                                    </div>
                                )}
                                {profileChanges.phone && (
                                    <div className="text-sm">
                                        <p className="font-medium text-neutral-900">Phone</p>
                                        <p className="text-neutral-600">{profileChanges.phone.old || "Not set"} → {profileChanges.phone.new}</p>
                                    </div>
                                )}
                            </div>
                        )}
                        <div className="flex gap-2 justify-end">
                            <Button variant="outline" onClick={() => setShowProfileConfirm(false)}>Go Back</Button>
                            <Button
                                onClick={handleProfileConfirm}
                                className="bg-primary-600 hover:bg-primary-700 text-white"
                            >
                                Confirm Changes
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

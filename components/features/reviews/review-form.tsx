"use client"

import React, { useState } from "react"
import { Star, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { submitReview } from "@/app/actions/reviews"
import { toast } from "sonner"
import Link from "next/link"

interface ReviewFormProps {
    productId: string
    isLoggedIn: boolean
}

export function ReviewForm({ productId, isLoggedIn }: ReviewFormProps) {
    const [rating, setRating] = useState(0)
    const [hoveredRating, setHoveredRating] = useState(0)
    const [title, setTitle] = useState("")
    const [comment, setComment] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [userStatus, setUserStatus] = useState<'not-logged-in' | 'not-purchased' | 'not-delivered' | 'admin' | 'already-reviewed' | 'eligible'>('not-logged-in')
    const [isLoading, setIsLoading] = useState(true)

    // Check user eligibility on component mount
    React.useEffect(() => {
        const checkEligibility = async () => {
            try {
                const response = await fetch('/api/auth/check-admin')
                const adminData = await response.json()

                if (adminData.isAdmin) {
                    setUserStatus('admin')
                    setIsLoading(false)
                    return
                }

                // If not admin, check if they have ordered this product
                const userResponse = await fetch(`/api/reviews/check-eligibility?productId=${productId}`)
                const eligibilityData = await userResponse.json()

                if (!eligibilityData.isLoggedIn) {
                    setUserStatus('not-logged-in')
                } else if (eligibilityData.hasReviewed) {
                    setUserStatus('already-reviewed')
                } else if (!eligibilityData.hasPurchased) {
                    setUserStatus('not-purchased')
                } else if (!eligibilityData.isDelivered) {
                    setUserStatus('not-delivered')
                } else {
                    setUserStatus('eligible')
                }
            } catch (error) {
                setUserStatus('not-logged-in')
            } finally {
                setIsLoading(false)
            }
        }

        checkEligibility()
    }, [productId])

    if (isLoading) {
        return null
    }

    if (!isLoggedIn) {
        if (userStatus === 'not-logged-in') {
            return (
                <div className="rounded-xl border border-neutral-200 bg-white p-6 text-center">
                    <p className="text-sm text-muted-foreground">
                        <Link href="/login" className="font-medium text-primary-600 hover:text-primary-700">
                            Log in
                        </Link>{" "}
                        to write a review
                    </p>
                </div>
            )
        }

        if (userStatus === 'admin') {
            return (
                <div className="rounded-xl border border-orange-200 bg-orange-50 p-6">
                    <p className="text-sm text-orange-900">
                        Admin accounts cannot submit reviews.
                    </p>
                </div>
            )
        }

        if (userStatus === 'already-reviewed') {
            return (
                <div className="rounded-xl border border-green-200 bg-green-50 p-6">
                    <p className="text-sm font-medium text-green-900 mb-2">Already Reviewed</p>
                    <p className="text-sm text-green-800">
                        You have already submitted a review for this product. Thank you for your feedback!
                    </p>
                </div>
            )
        }

        if (userStatus === 'not-purchased') {
            return (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
                    <p className="text-sm font-medium text-amber-900 mb-2">Cannot Review</p>
                    <p className="text-sm text-amber-800">
                        You must purchase this product to write a review. Only verified buyers can share their experience.
                    </p>
                </div>
            )
        }

        if (userStatus === 'not-delivered') {
            return (
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
                    <p className="text-sm font-medium text-blue-900 mb-2">Review Coming Soon</p>
                    <p className="text-sm text-blue-800">
                        You can write a review once your order has been delivered. Come back after receiving your product!
                    </p>
                </div>
            )
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (rating === 0) {
            toast.error("Please select a rating")
            return
        }

        setIsSubmitting(true)
        const { error } = await submitReview(productId, rating, title, comment)
        setIsSubmitting(false)

        if (error) {
            toast.error(error)
            return
        }

        toast.success("Review submitted! Thank you.")
        setRating(0)
        setTitle("")
        setComment("")
    }

    return (
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Write a Review</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Star Rating */}
                <div>
                    <Label className="mb-2 block">Your Rating</Label>
                    <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoveredRating(star)}
                                onMouseLeave={() => setHoveredRating(0)}
                                className="p-0.5 transition-transform hover:scale-110"
                                aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                            >
                                <Star
                                    className={`h-6 w-6 ${star <= (hoveredRating || rating)
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "fill-neutral-200 text-neutral-200"
                                        }`}
                                />
                            </button>
                        ))}
                        {rating > 0 && (
                            <span className="ml-2 text-sm text-muted-foreground">
                                {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
                            </span>
                        )}
                    </div>
                </div>

                {/* Title */}
                <div>
                    <Label htmlFor="review-title">Title (optional)</Label>
                    <Input
                        id="review-title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Summarize your experience"
                        maxLength={100}
                    />
                </div>

                {/* Comment */}
                <div>
                    <Label htmlFor="review-comment">Your Review</Label>
                    <textarea
                        id="review-comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="What did you like or dislike? What did you use this product for?"
                        required
                        rows={4}
                        className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    />
                </div>

                <Button
                    type="submit"
                    className="gap-2 bg-primary-600 hover:bg-primary-700 text-white"
                    disabled={isSubmitting || rating === 0}
                >
                    <Send className="h-4 w-4" />
                    {isSubmitting ? "Submitting..." : "Submit Review"}
                </Button>
            </form>
        </div>
    )
}

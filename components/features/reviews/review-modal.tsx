"use client"

import React, { useState } from "react"
import { Star, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { submitReview } from "@/app/actions/reviews"
import { toast } from "sonner"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog"

interface ReviewModalProps {
    productId: string
    isOpen: boolean
    onClose: () => void
}

export function ReviewModal({ productId, isOpen, onClose }: ReviewModalProps) {
    const [rating, setRating] = useState(0)
    const [hoveredRating, setHoveredRating] = useState(0)
    const [title, setTitle] = useState("")
    const [comment, setComment] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async () => {
        setError(null)

        if (rating === 0) {
            setError("Please select a rating")
            return
        }

        if (!title.trim()) {
            setError("Please enter a review title")
            return
        }

        if (!comment.trim()) {
            setError("Please write a comment")
            return
        }

        setIsSubmitting(true)
        const result = await submitReview(productId, rating, title, comment)
        setIsSubmitting(false)

        if (result.error) {
            setError(result.error)
            toast.error(result.error)
        } else {
            toast.success("Review submitted! It will appear on the product page.")
            onClose()
            // Refresh the page to show updated rating
            window.location.reload()
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Leave a Review</DialogTitle>
                    <DialogDescription>
                        Share your experience with this product
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Rating */}
                    <div className="space-y-2">
                        <Label>Rating</Label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                    className="focus:outline-none"
                                >
                                    <Star
                                        className={`h-6 w-6 transition-colors cursor-pointer ${
                                            star <= (hoveredRating || rating)
                                                ? 'fill-yellow-400 text-yellow-400'
                                                : 'fill-neutral-200 text-neutral-200'
                                        }`}
                                    />
                                </button>
                            ))}
                        </div>
                        {rating > 0 && (
                            <p className="text-xs text-muted-foreground">
                                {['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating - 1]}
                            </p>
                        )}
                    </div>

                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title">Review Title</Label>
                        <Input
                            id="title"
                            placeholder="E.g., Great value for money"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Comment */}
                    <div className="space-y-2">
                        <Label htmlFor="comment">Your Review</Label>
                        <textarea
                            id="comment"
                            placeholder="Share your experience with this product..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            disabled={isSubmitting}
                            rows={4}
                            className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
                        />
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="rounded-md bg-red-50 border border-red-200 p-3 text-xs text-red-700">
                            {error}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                        <DialogClose asChild>
                            <Button variant="outline" className="flex-1">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="flex-1"
                        >
                            {isSubmitting ? "Submitting..." : "Submit Review"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

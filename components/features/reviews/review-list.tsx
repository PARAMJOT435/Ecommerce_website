import React from "react"
import { Star, CheckCircle } from "lucide-react"

interface Review {
    id: string
    rating: number
    title: string | null
    comment: string
    is_verified_purchase: boolean
    created_at: string
    user: { first_name: string | null; last_name: string | null } | null
}

interface ReviewListProps {
    reviews: Review[]
    averageRating: number
    totalReviews: number
}

export function ReviewList({ reviews, averageRating, totalReviews }: ReviewListProps) {
    return (
        <div className="space-y-6">
            {/* Summary */}
            <div className="flex items-center gap-6 rounded-xl border border-neutral-200 bg-white p-6">
                <div className="text-center">
                    <p className="text-4xl font-bold text-neutral-900">{averageRating}</p>
                    <div className="flex items-center gap-0.5 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className={`h-4 w-4 ${star <= Math.round(averageRating)
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "fill-neutral-200 text-neutral-200"
                                    }`}
                            />
                        ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                        {totalReviews} review{totalReviews !== 1 ? "s" : ""}
                    </p>
                </div>

                {/* Rating Breakdown */}
                <div className="flex-1 space-y-1.5">
                    {[5, 4, 3, 2, 1].map((star) => {
                        const count = reviews.filter((r) => r.rating === star).length
                        const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0
                        return (
                            <div key={star} className="flex items-center gap-2 text-sm">
                                <span className="w-3 text-neutral-600">{star}</span>
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <div className="flex-1 h-2 rounded-full bg-neutral-100 overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-yellow-400 transition-all"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                                <span className="w-8 text-right text-xs text-muted-foreground">{count}</span>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Individual Reviews */}
            {reviews.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-8">
                    No reviews yet. Be the first to review this product!
                </p>
            ) : (
                <div className="space-y-4">
                    {reviews.map((review) => {
                        const userName = review.user
                            ? `${review.user.first_name || ""} ${review.user.last_name || ""}`.trim() || "Anonymous"
                            : "Anonymous"

                        return (
                            <div key={review.id} className="rounded-xl border border-neutral-200 bg-white p-5">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-0.5">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        className={`h-3.5 w-3.5 ${star <= review.rating
                                                                ? "fill-yellow-400 text-yellow-400"
                                                                : "fill-neutral-200 text-neutral-200"
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                            {review.is_verified_purchase && (
                                                <span className="flex items-center gap-1 text-[10px] font-medium text-green-700 bg-green-50 px-1.5 py-0.5 rounded-full">
                                                    <CheckCircle className="h-2.5 w-2.5" />
                                                    Verified Purchase
                                                </span>
                                            )}
                                        </div>
                                        {review.title && (
                                            <h4 className="font-semibold text-sm text-neutral-900 mt-1">{review.title}</h4>
                                        )}
                                    </div>
                                </div>
                                <p className="text-sm text-neutral-600 leading-relaxed">{review.comment}</p>
                                <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                                    <span className="font-medium">{userName}</span>
                                    <span>·</span>
                                    <span>
                                        {new Date(review.created_at).toLocaleDateString("en-IN", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

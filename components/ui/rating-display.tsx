import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface RatingDisplayProps {
    rating: number;
    max?: number;
    size?: "sm" | "md" | "lg";
    className?: string;
    showCount?: boolean;
    reviewCount?: number;
}

export function RatingDisplay({
    rating,
    max = 5,
    size = "md",
    className,
    showCount = false,
    reviewCount,
}: RatingDisplayProps) {
    const sizeClasses = {
        sm: "h-3 w-3",
        md: "h-4 w-4",
        lg: "h-5 w-5",
    };

    return (
        <div className={cn("flex items-center gap-1", className)}>
            <div className="flex">
                {[...Array(max)].map((_, i) => (
                    <Star
                        key={i}
                        className={cn(
                            sizeClasses[size],
                            i < Math.floor(rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-neutral-200 text-neutral-200"
                        )}
                    />
                ))}
            </div>
            {showCount && reviewCount !== undefined && (
                <span className="text-xs text-muted-foreground">({reviewCount})</span>
            )}
        </div>
    );
}

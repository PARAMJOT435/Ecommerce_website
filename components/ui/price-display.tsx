import { cn } from "@/lib/utils";

interface PriceDisplayProps {
    amount: number;
    currency?: string;
    className?: string;
    variant?: "default" | "large" | "sale" | "original";
}

export function PriceDisplay({
    amount,
    currency = "INR", // Changed default to INR as per context
    className,
    variant = "default",
}: PriceDisplayProps) {
    const formatter = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });

    const formattedPrice = formatter.format(amount);

    return (
        <span
            className={cn(
                "inline-block font-mono font-medium",
                {
                    "text-lg text-foreground": variant === "default",
                    "text-2xl font-bold text-foreground": variant === "large",
                    "text-lg font-bold text-red-600": variant === "sale",
                    "text-sm text-muted-foreground line-through": variant === "original",
                },
                className
            )}
        >
            {formattedPrice}
        </span>
    );
}

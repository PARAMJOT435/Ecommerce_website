import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PackageOpen } from "lucide-react"

interface EmptyStateProps {
    title?: string
    description?: string
    actionLabel?: string
    actionHref?: string
}

export function EmptyState({
    title = "No items found",
    description = "There are no items to display at this time.",
    actionLabel,
    actionHref,
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in-50">
            <div className="bg-muted/50 rounded-full p-4 mb-4">
                <PackageOpen className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold tracking-tight mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground max-w-sm mb-6">{description}</p>
            {actionLabel && actionHref && (
                <Button asChild>
                    <Link href={actionHref}>{actionLabel}</Link>
                </Button>
            )}
            {actionLabel && !actionHref && (
                <Button disabled variant="secondary">{actionLabel}</Button>
            )}
        </div>
    )
}

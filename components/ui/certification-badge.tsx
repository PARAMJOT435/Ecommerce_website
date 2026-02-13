import { cn } from "@/lib/utils";
import { Check, ShieldCheck, Leaf, Heart, Beaker } from "lucide-react";

export type CertificationType =
    | "paraben-free"
    | "sulfate-free"
    | "cruelty-free"
    | "gmp-certified"
    | "natural";

interface CertificationBadgeProps {
    type: CertificationType;
    className?: string;
}

const config = {
    "paraben-free": {
        label: "Paraben Free",
        icon: Check,
    },
    "sulfate-free": {
        label: "Sulfate Free",
        icon: Beaker,
    },
    "cruelty-free": {
        label: "No Animal Testing",
        icon: Heart,
    },
    "gmp-certified": {
        label: "GMP Certified",
        icon: ShieldCheck,
    },
    natural: {
        label: "Natural Ingredients",
        icon: Leaf,
    },
};

export function CertificationBadge({ type, className }: CertificationBadgeProps) {
    const { label, icon: Icon } = config[type];

    return (
        <div
            className={cn(
                "inline-flex flex-col items-center gap-1 p-2 text-center",
                className
            )}
        >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                <Icon className="h-5 w-5" />
            </div>
            <span className="text-xs font-medium text-muted-foreground max-w-[80px] leading-tight">
                {label}
            </span>
        </div>
    );
}

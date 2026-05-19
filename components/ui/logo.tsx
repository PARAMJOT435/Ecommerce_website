import { Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
    className?: string;
    iconSize?: string;
    textSize?: string;
    animate?: boolean;
    bgClass?: string;
}

export function Logo({ 
    className, 
    iconSize = "h-6 w-6", 
    textSize = "text-xl",
    animate = true,
}: LogoProps) {
    return (
        <div className={cn("flex items-center space-x-2", className)}>
            <Settings 
                className={cn(
                    "text-primary-600",
                    iconSize,
                    animate && "animate-[spin_15s_linear_infinite]"
                )} 
            />
            <span className={cn("font-heading font-bold text-primary-600", textSize)}>
                MMW
            </span>
        </div>
    );
}

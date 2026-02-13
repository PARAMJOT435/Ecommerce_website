import { cn } from "@/lib/utils";
import Image, { ImageProps } from "next/image";

interface ProductImageProps extends Omit<ImageProps, "src"> {
    src?: string;
    aspectRatio?: "square" | "video" | "portrait";
    containerClassName?: string;
}

export function ProductImage({
    src,
    alt,
    aspectRatio = "square",
    className,
    containerClassName,
    ...props
}: ProductImageProps) {
    // Placeholder logic if src is missing
    const imageSrc = src || "/placeholder-product.jpg"; // You might want a real placeholder asset

    const aspectClasses = {
        square: "aspect-square",
        video: "aspect-video",
        portrait: "aspect-[3/4]",
    };

    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-2xl bg-neutral-100",
                aspectClasses[aspectRatio],
                containerClassName
            )}
        >
            <Image
                src={imageSrc}
                alt={alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className={cn(
                    "h-full w-full object-cover transition-transform duration-300 hover:scale-105",
                    className
                )}
                {...props}
            />
        </div>
    );
}

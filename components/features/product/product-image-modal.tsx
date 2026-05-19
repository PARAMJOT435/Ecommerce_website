"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductImageModalProps {
    src: string;
    alt: string;
    isOpen: boolean;
    onClose: () => void;
}

export function ProductImageModal({ src, alt, isOpen, onClose }: ProductImageModalProps) {
    const [zoom, setZoom] = useState(1);

    useEffect(() => {
        if (!isOpen) return;

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.2, 3));
    const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.2, 1));

    const handleBackgroundClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={handleBackgroundClick}>
            <div className="relative w-full max-w-2xl">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute -top-10 right-0 z-10 text-white hover:text-neutral-300 transition-colors cursor-pointer"
                    title="Close (ESC)"
                >
                    <X className="h-8 w-8" />
                </button>

                {/* Image Container */}
                <div className="relative bg-black rounded-lg overflow-hidden flex items-center justify-center" style={{ aspectRatio: "1" }}>
                    <div className="overflow-auto w-full h-full flex items-center justify-center">
                        <Image
                            src={src}
                            alt={alt}
                            width={1200}
                            height={1200}
                            style={{
                                transform: `scale(${zoom})`,
                                transition: "transform 0.2s ease-out",
                                cursor: zoom > 1 ? "grab" : "default",
                            }}
                            className="object-contain"
                            priority
                        />
                    </div>
                </div>

                {/* Zoom Controls */}
                <div className="flex items-center justify-center gap-4 mt-6">
                    <Button
                        onClick={handleZoomOut}
                        variant="outline"
                        size="icon"
                        disabled={zoom <= 1}
                        className="bg-white text-neutral-900 border-neutral-300 hover:bg-neutral-100"
                    >
                        <ZoomOut className="h-5 w-5" />
                    </Button>
                    <span className="text-white text-sm font-medium w-12 text-center">
                        {Math.round(zoom * 100)}%
                    </span>
                    <Button
                        onClick={handleZoomIn}
                        variant="outline"
                        size="icon"
                        disabled={zoom >= 3}
                        className="bg-white text-neutral-900 border-neutral-300 hover:bg-neutral-100"
                    >
                        <ZoomIn className="h-5 w-5" />
                    </Button>
                </div>

                {/* Info Text */}
                <p className="text-white text-xs text-center mt-4">Use zoom buttons or scroll to adjust size • Press ESC or click outside to close</p>
            </div>
        </div>
    );
}

"use client";

import { useEffect, useState } from "react";
import { Settings } from "lucide-react";

export function InitialLoader() {
    const [isLoading, setIsLoading] = useState(true);
    const [isFading, setIsFading] = useState(false);

    useEffect(() => {
        // Only run this once on mount (hard reload or first visit)
        const timer = setTimeout(() => {
            setIsFading(true);
            setTimeout(() => {
                setIsLoading(false);
            }, 500); // 500ms fade out duration
        }, 2000); // 2 second display

        return () => clearTimeout(timer);
    }, []);

    if (!isLoading) return null;

    return (
        <div
            className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background transition-opacity duration-500 ease-in-out ${
                isFading ? "opacity-0" : "opacity-100"
            }`}
        >
            <div className="flex flex-col items-center space-y-4">
                {/* Spinning Gear */}
                <Settings className="h-20 w-20 animate-[spin_3s_linear_infinite] text-primary-600" />
                <p className="font-heading text-2xl font-bold tracking-widest text-primary-800 animate-pulse">
                    MMW
                </p>
                <p className="text-sm text-muted-foreground uppercase tracking-widest">
                    Initializing System...
                </p>
            </div>
        </div>
    );
}

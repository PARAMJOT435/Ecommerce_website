"use client";

import { useEffect } from "react";

export function HeroScrollSnap() {
    useEffect(() => {
        let timeoutId: NodeJS.Timeout;
        
        const handleScroll = () => {
            clearTimeout(timeoutId);
            
            // Wait for user to stop scrolling
            timeoutId = setTimeout(() => {
                const scrollY = window.scrollY;
                const windowHeight = window.innerHeight;
                
                // If we are currently in the middle of the Hero section transition
                // (Between 0 and 100vh)
                if (scrollY > 0 && scrollY < windowHeight) {
                    // If scrolled more than 15% down, auto-scroll to fully cover it
                    if (scrollY > windowHeight * 0.15) {
                        window.scrollTo({
                            top: windowHeight,
                            behavior: "smooth"
                        });
                    } else {
                        // If scrolled less than 15%, snap back to the very top
                        window.scrollTo({
                            top: 0,
                            behavior: "smooth"
                        });
                    }
                }
            }, 150); // Triggers 150ms after the user stops scrolling
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return null;
}

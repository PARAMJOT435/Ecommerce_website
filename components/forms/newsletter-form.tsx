"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface NewsletterFormProps {
    className?: string;
    variant?: "default" | "minimal";
}

export function NewsletterForm({ className, variant = "default" }: NewsletterFormProps) {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        toast.success("Subscribed successfully!");
        setEmail("");
        setIsLoading(false);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className={cn("flex w-full max-w-sm items-center space-x-2", className)}
        >
            <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className={cn(variant === "minimal" && "bg-transparent")}
            />
            <Button type="submit" disabled={isLoading}>
                {isLoading ? "Subscribing..." : "Subscribe"}
            </Button>
        </form>
    );
}

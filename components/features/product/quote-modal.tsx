"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ClipboardList } from "lucide-react";
import { ProductWithImages } from "@/types";
import { submitQuote } from "@/app/actions/quotes";

interface QuoteModalProps {
    product: ProductWithImages;
}

export function QuoteModal({ product }: QuoteModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        const formData = new FormData(e.currentTarget);
        
        try {
            const result = await submitQuote({
                product_id: product.id,
                name: formData.get('name') as string,
                email: formData.get('email') as string,
                company: formData.get('company') as string || undefined,
                phone: formData.get('phone') as string || undefined,
                quantity: parseInt(formData.get('quantity') as string, 10),
                message: formData.get('message') as string || undefined,
            });

            if (!result.success) {
                console.error('Quote submission failed:', result);
                toast.error("Failed to send request", {
                    description: result.error || "Please try again later or contact us directly.",
                });
                return;
            }
            
            toast.success("Quote Request Sent!", {
                description: "Our industrial sales team will contact you within 24 hours.",
            });
            setIsOpen(false);
        } catch (error) {
            console.error('Quote submission error:', error);
            toast.error("Failed to send request", {
                description: "Please try again later or contact us directly.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button size="lg" className="flex-1 gap-2 text-base bg-slate-900 hover:bg-slate-800 text-white">
                    <ClipboardList className="h-5 w-5" />
                    Request a Quote
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Request a Quote</DialogTitle>
                    <DialogDescription>
                        Request pricing and availability for the {product.name}. Our team will get back to you shortly.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name *</Label>
                            <Input id="name" name="name" required placeholder="John Doe" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="company">Company</Label>
                            <Input id="company" name="company" placeholder="Acme Corp" />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Work Email *</Label>
                            <Input id="email" name="email" type="email" required placeholder="john@acme.com" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" name="phone" type="tel" placeholder="(555) 123-4567" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="quantity">Required Quantity *</Label>
                        <Input id="quantity" name="quantity" type="number" min="1" required defaultValue="1" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="message">Additional Requirements</Label>
                        <Textarea 
                            id="message" 
                            name="message" 
                            placeholder="Please specify any custom modifications, voltage requirements, or shipping deadlines..."
                            className="h-24"
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting} className="bg-primary-600 hover:bg-primary-700 text-white">
                            {isSubmitting ? "Sending..." : "Submit Request"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

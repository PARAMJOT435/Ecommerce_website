import { Truck, ShieldCheck, Leaf, Clock } from "lucide-react";
import { Container } from "@/components/ui/container";

const features = [
    {
        icon: Leaf,
        title: "100% Natural",
        description: "Sourced from nature's finest ingredients.",
    },
    {
        icon: ShieldCheck,
        title: "Safe & Secure",
        description: "Dermatologically tested and certified safe.",
    },
    {
        icon: Truck,
        title: "Free Shipping",
        description: "On all orders above ₹999.",
    },
    {
        icon: Clock,
        title: "Fast Delivery",
        description: "Get your products within 3-5 days.",
    },
];

export function TrustBadges() {
    return (
        <section className="bg-primary-50 py-16">
            <Container>
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {features.map((feature) => (
                        <div key={feature.title} className="flex flex-col items-center text-center">
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-primary-600 shadow-sm">
                                <feature.icon className="h-8 w-8" />
                            </div>
                            <h3 className="mb-2 font-heading text-lg font-semibold text-neutral-900">
                                {feature.title}
                            </h3>
                            <p className="text-sm text-neutral-600">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
}

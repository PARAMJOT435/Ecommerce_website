import React from "react"
import Image from "next/image"
import Link from "next/link"
import { Container } from "@/components/ui/container"
import { Button } from "@/components/ui/button"
import { Leaf, Heart, Shield, Sparkles, ArrowRight } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "About Us | fewofmany",
    description: "Learn about fewofmany — our mission to bring natural, gentle, and effective hygiene products to every household.",
}

const VALUES = [
    {
        icon: Leaf,
        title: "Natural Ingredients",
        description: "We source only the finest natural ingredients, ensuring each product is gentle yet effective. No harsh chemicals, no compromises.",
        color: "text-green-600",
        bg: "bg-green-50",
    },
    {
        icon: Heart,
        title: "Cruelty-Free",
        description: "We never test on animals. Every product is developed with compassion and care for all living beings.",
        color: "text-pink-600",
        bg: "bg-pink-50",
    },
    {
        icon: Shield,
        title: "Dermatologist Tested",
        description: "All products undergo rigorous dermatological testing to ensure they're safe and suitable for sensitive skin.",
        color: "text-blue-600",
        bg: "bg-blue-50",
    },
    {
        icon: Sparkles,
        title: "Eco-Friendly",
        description: "From formulation to packaging, we minimize our environmental footprint. Recyclable materials, biodegradable formulas.",
        color: "text-teal-600",
        bg: "bg-teal-50",
    },
]

export default function AboutPage() {
    return (
        <>
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-primary-50 via-white to-teal-50 overflow-hidden">
                <Container>
                    <div className="py-20 md:py-28 text-center max-w-3xl mx-auto">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6">
                            Our Story
                        </span>
                        <h1 className="text-4xl md:text-5xl font-heading font-bold text-neutral-900 leading-tight">
                            Natural Strength of{" "}
                            <span className="text-primary-600">Gentle Ingredients</span>
                        </h1>
                        <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                            At fewofmany, we believe that personal hygiene shouldn&apos;t come at the cost
                            of your health or the environment. We craft premium products using nature&apos;s
                            finest ingredients — gentle enough for daily use, powerful enough to make a
                            real difference.
                        </p>
                    </div>
                </Container>
            </section>

            {/* Mission Section */}
            <section className="py-16 md:py-20">
                <Container>
                    <div className="grid gap-12 md:grid-cols-2 items-center">
                        <div>
                            <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">
                                Our Mission
                            </span>
                            <h2 className="mt-2 text-3xl font-heading font-bold text-neutral-900">
                                Hygiene That Cares
                            </h2>
                            <p className="mt-4 text-muted-foreground leading-relaxed">
                                We started fewofmany with a simple idea: everyone deserves access to
                                hygiene products that are safe, effective, and environmentally responsible.
                            </p>
                            <p className="mt-3 text-muted-foreground leading-relaxed">
                                Every product in our range is thoughtfully formulated with natural
                                ingredients, free from parabens, sulfates, and artificial fragrances.
                                We work with dermatologists and chemists to ensure every formula meets
                                the highest standards of safety and efficacy.
                            </p>
                            <p className="mt-3 text-muted-foreground leading-relaxed">
                                From our vitamin-C enriched face washes to our intimate hygiene range,
                                each product is designed to make you feel clean, fresh, and confident —
                                naturally.
                            </p>
                        </div>

                        <div className="relative aspect-square rounded-2xl bg-gradient-to-br from-primary-100 to-teal-100 flex items-center justify-center">
                            <div className="text-center p-8">
                                <Leaf className="mx-auto h-16 w-16 text-primary-500 mb-4" />
                                <p className="text-2xl font-heading font-bold text-primary-800">
                                    fewofmany
                                </p>
                                <p className="text-sm text-primary-600 mt-1">
                                    Natural Strength · Gentle Care
                                </p>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>

            {/* Values Section */}
            <section className="py-16 md:py-20 bg-neutral-50">
                <Container>
                    <div className="text-center mb-12">
                        <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">
                            What We Stand For
                        </span>
                        <h2 className="mt-2 text-3xl font-heading font-bold text-neutral-900">
                            Our Values
                        </h2>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {VALUES.map((value) => (
                            <div
                                key={value.title}
                                className="rounded-xl border border-neutral-200 bg-white p-6 text-center transition-shadow hover:shadow-md"
                            >
                                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-lg ${value.bg} mb-4`}>
                                    <value.icon className={`h-6 w-6 ${value.color}`} />
                                </div>
                                <h3 className="text-base font-semibold text-neutral-900">
                                    {value.title}
                                </h3>
                                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                                    {value.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </Container>
            </section>

            {/* CTA Section */}
            <section className="py-16 md:py-20">
                <Container>
                    <div className="rounded-2xl bg-gradient-to-r from-primary-600 to-primary-700 p-10 md:p-16 text-center text-white">
                        <h2 className="text-3xl font-heading font-bold">
                            Ready to Experience the Difference?
                        </h2>
                        <p className="mt-3 text-primary-100 max-w-xl mx-auto">
                            Explore our range of natural hygiene products and find the perfect fit for your routine.
                        </p>
                        <Button asChild size="lg" className="mt-6 bg-white text-primary-700 hover:bg-primary-50 gap-2">
                            <Link href="/products">
                                Shop Now
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </Container>
            </section>
        </>
    )
}

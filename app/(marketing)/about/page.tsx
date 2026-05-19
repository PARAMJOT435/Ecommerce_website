import React from "react"
import Image from "next/image"
import Link from "next/link"
import { Container } from "@/components/ui/container"
import { Button } from "@/components/ui/button"
import { Leaf, Heart, Shield, Sparkles, ArrowRight } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "About Us | MMW",
    description: "Learn about MMW — our mission to bring high-quality, durable, and reliable industrial tools to every workshop.",
}

const VALUES = [
    {
        icon: Shield,
        title: "Durable Materials",
        description: "We source only the finest industrial-grade materials, ensuring each tool is durable and reliable.",
        color: "text-blue-600",
        bg: "bg-blue-50",
    },
    {
        icon: Sparkles,
        title: "Precision Engineering",
        description: "Every product is developed with precision and care for the most demanding applications.",
        color: "text-orange-600",
        bg: "bg-orange-50",
    },
    {
        icon: Shield,
        title: "Quality Tested",
        description: "All products undergo rigorous testing to ensure they meet the highest industrial standards.",
        color: "text-slate-600",
        bg: "bg-slate-50",
    },
    {
        icon: Sparkles,
        title: "Reliable Performance",
        description: "From design to manufacturing, we focus on delivering tools that perform day in and day out.",
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
                            Heavy-Duty Tools for{" "}
                            <span className="text-primary-600">Industrial Precision</span>
                        </h1>
                        <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                            At MMW, we believe that industrial work requires the best equipment. We craft premium tools using the finest materials — durable enough for heavy duty use, reliable enough to make a real difference.
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
                                Tools That Perform
                            </h2>
                            <p className="mt-4 text-muted-foreground leading-relaxed">
                                We started MMW with a simple idea: everyone deserves access to
                                industrial equipment that is safe, effective, and reliable.
                            </p>
                            <p className="mt-3 text-muted-foreground leading-relaxed">
                                Every product in our range is thoughtfully engineered with durable
                                materials, free from defects and built to last.
                                We work with engineers and mechanics to ensure every tool meets
                                the highest standards of safety and efficacy.
                            </p>
                            <p className="mt-3 text-muted-foreground leading-relaxed">
                                From our precision machinery to our heavy-duty hand tools,
                                each product is designed to help you build, repair, and create —
                                flawlessly.
                            </p>
                        </div>

                        <div className="relative aspect-square rounded-2xl bg-gradient-to-br from-primary-100 to-teal-100 flex items-center justify-center">
                            <div className="text-center p-8">
                                <Shield className="mx-auto h-16 w-16 text-primary-500 mb-4" />
                                <p className="text-2xl font-heading font-bold text-primary-800">
                                    MMW
                                </p>
                                <p className="text-sm text-primary-600 mt-1">
                                    Heavy-Duty · Precision Engineered
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
                            Explore our range of industrial tools and machinery and find the perfect fit for your factory.
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

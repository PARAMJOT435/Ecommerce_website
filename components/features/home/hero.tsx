import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export function Hero() {
    return (
        <section className="relative overflow-hidden bg-primary-50 py-20 md:py-32">
            <Container className="relative z-10">
                <div className="mx-auto max-w-2xl text-center">
                    <h1 className="font-heading text-4xl font-bold tracking-tight text-neutral-900 sm:text-6xl mb-6">
                        Natural Strength of <br />
                        <span className="text-primary-600">Gentle Ingredients</span>
                    </h1>
                    <p className="mt-4 text-lg text-neutral-600 mb-8 max-w-xl mx-auto">
                        Discover our range of premium hygiene products, crafted with care for your well-being and nature&apos;s finest ingredients.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Button size="lg" className="h-12 px-8 text-base" asChild>
                            <Link href="/products">Shop Now</Link>
                        </Button>
                        <Button variant="outline" size="lg" className="h-12 px-8 text-base" asChild>
                            <Link href="/about">Our Story</Link>
                        </Button>
                    </div>
                </div>
            </Container>

            {/* Decorative background elements could go here */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-200/20 rounded-full blur-3xl -z-10" />
        </section>
    );
}

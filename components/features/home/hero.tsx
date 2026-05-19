import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export function Hero() {
    return (
        <section className="sticky top-0 h-[100svh] overflow-hidden bg-slate-950 flex items-center justify-center z-0">
            {/* Background Video */}
            <video 
                autoPlay 
                loop 
                muted 
                playsInline
                className="absolute inset-0 w-full h-full object-cover -z-10"
                poster="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=2070&auto=format&fit=crop"
            >
                <source src="https://cdn.pixabay.com/video/2020/05/25/40140-424810960_large.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {/* Dark Overlay for Text Readability */}
            <div className="absolute inset-0 bg-slate-950/70 -z-10"></div>

            <Container className="relative z-10">
                <div className="mx-auto max-w-2xl text-center">
                    <h1 className="font-heading text-4xl font-bold tracking-tight text-white sm:text-6xl mb-6 drop-shadow-lg">
                        Heavy-Duty Tools for <br />
                        <span className="text-primary-400">Industrial Precision</span>
                    </h1>
                    <p className="mt-4 text-lg text-neutral-200 mb-8 max-w-xl mx-auto drop-shadow">
                        Discover our range of premium industrial tools, machinery parts, and equipment engineered for durability and reliability.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Button size="lg" className="h-12 px-8 text-base bg-primary-600 hover:bg-primary-700 text-white border-0" asChild>
                            <Link href="/products">Shop Now</Link>
                        </Button>
                        <Button variant="outline" size="lg" className="h-12 px-8 text-base bg-transparent border-white text-white hover:bg-white hover:text-black" asChild>
                            <Link href="/about">Our Story</Link>
                        </Button>
                    </div>
                </div>
            </Container>
        </section>
    );
}

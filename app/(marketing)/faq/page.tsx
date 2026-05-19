import { Container } from "@/components/ui/container"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import Link from "next/link"

export const metadata = {
    title: "FAQs | MMW",
    description: "Frequently asked questions about MMW products, orders, shipping, and returns.",
}

const faqCategories = [
    {
        title: "Orders & Payments",
        items: [
            {
                q: "How do I place an order?",
                a: "Browse our products, add items to your cart, and proceed to checkout. You can pay using UPI, credit/debit cards, net banking, or cash on delivery.",
            },
            {
                q: "Can I cancel or modify my order?",
                a: "Yes, you can cancel or modify your order within 2 hours of placing it, provided it hasn't been shipped yet. Go to Account → Orders to manage your order.",
            },
            {
                q: "What payment methods do you accept?",
                a: "We accept UPI, all major credit/debit cards, net banking, and wallets through Razorpay. Cash on delivery is also available for select pincodes.",
            },
            {
                q: "Is it safe to pay online?",
                a: "Absolutely. All transactions are processed securely through Razorpay with 256-bit SSL encryption. We never store your payment details.",
            },
        ],
    },
    {
        title: "Shipping & Delivery",
        items: [
            {
                q: "How long does delivery take?",
                a: "Standard delivery takes 5–7 business days. Metro cities may receive orders in 3–5 business days. You'll receive a tracking link once your order is shipped.",
            },
            {
                q: "Do you offer free shipping?",
                a: "Yes! Orders above ₹499 qualify for free shipping across India. Orders below ₹499 have a flat shipping fee of ₹49.",
            },
            {
                q: "Do you ship internationally?",
                a: "Currently, we only ship within India. International shipping is coming soon!",
            },
            {
                q: "How can I track my order?",
                a: "Once shipped, you'll receive an email and SMS with the tracking link. You can also track your order from Account → Orders.",
            },
        ],
    },
    {
        title: "Returns & Refunds",
        items: [
            {
                q: "What is your return policy?",
                a: "We accept returns within 7 days of delivery for unopened and unused products in original packaging. See our Shipping & Returns page for full details.",
            },
            {
                q: "How do I initiate a return?",
                a: "Contact us at hello@MMW.com with your order number and reason for return. We'll arrange a pickup and process the refund once we receive the product.",
            },
            {
                q: "When will I receive my refund?",
                a: "Refunds are processed within 5–7 business days after we receive the returned item. The amount will be credited to your original payment method.",
            },
        ],
    },
    {
        title: "Products",
        items: [
            {
                q: "Are your tools suitable for heavy-duty industrial use?",
                a: "Yes, all MMW tools are manufactured with industrial-grade materials built for continuous, heavy-duty applications. Check individual product pages for load ratings and specifications.",
            },
            {
                q: "Do your products come with a warranty?",
                a: "Yes. MMW provides a standard 1-year manufacturing warranty on all power tools and heavy machinery against defects in materials and workmanship.",
            },
            {
                q: "Do you offer bulk discounts or wholesale pricing?",
                a: "Absolutely. We offer tiered pricing for bulk orders. Please contact our sales team for a custom quote on large orders.",
            },
        ],
    },
    {
        title: "Account",
        items: [
            {
                q: "How do I create an account?",
                a: "Click 'Sign Up' in the top navigation, enter your email and password, and you're all set. You can also sign up during checkout.",
            },
            {
                q: "I forgot my password. How do I reset it?",
                a: "Click 'Forgot Password' on the login page and enter your email. You'll receive a password reset link within minutes.",
            },
        ],
    },
]

export default function FAQPage() {
    return (
        <Container className="py-12 md:py-16">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Frequently Asked Questions</h1>
                    <p className="text-muted-foreground">
                        Find quick answers to common questions. Can't find what you're looking for?{" "}
                        <Link href="/contact" className="text-primary-600 hover:underline font-medium">Contact us</Link>.
                    </p>
                </div>

                {/* FAQ Categories */}
                <div className="space-y-10">
                    {faqCategories.map((cat) => (
                        <div key={cat.title}>
                            <h2 className="text-lg font-semibold mb-4 text-primary-700">{cat.title}</h2>
                            <Accordion type="single" collapsible className="w-full">
                                {cat.items.map((faq, i) => (
                                    <AccordionItem key={i} value={`${cat.title}-${i}`}>
                                        <AccordionTrigger className="text-left text-sm font-medium">
                                            {faq.q}
                                        </AccordionTrigger>
                                        <AccordionContent className="text-sm text-muted-foreground">
                                            {faq.a}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="mt-12 text-center rounded-xl bg-neutral-50 border p-8">
                    <h3 className="font-semibold mb-2">Still have questions?</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        Our support team is happy to help.
                    </p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center px-5 py-2.5 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors"
                    >
                        Contact Support
                    </Link>
                </div>
            </div>
        </Container>
    )
}

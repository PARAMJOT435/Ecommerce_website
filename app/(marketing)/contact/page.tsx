import { Container } from "@/components/ui/container"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Mail, Phone, MapPin, Clock } from "lucide-react"

export const metadata = {
    title: "Contact Us | MMW",
    description: "Get in touch with MMW. We're here to help with orders, product questions, and feedback.",
}

export default function ContactPage() {
    return (
        <Container className="py-12 md:py-16">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto mb-12">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Contact Us</h1>
                <p className="text-muted-foreground">
                    Have a question, feedback, or need help with an order? We'd love to hear from you.
                </p>
            </div>

            <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
                {/* Contact Form */}
                <Card>
                    <CardContent className="p-6 md:p-8">
                        <h2 className="text-xl font-semibold mb-6">Send us a message</h2>
                        <form className="space-y-5">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name *</Label>
                                    <Input id="name" name="name" placeholder="Your name" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email *</Label>
                                    <Input id="email" name="email" type="email" placeholder="you@example.com" required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="subject">Subject</Label>
                                <Input id="subject" name="subject" placeholder="What's this about?" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="order_number">Order Number (if applicable)</Label>
                                <Input id="order_number" name="order_number" placeholder="e.g. ORD-123456" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="message">Message *</Label>
                                <Textarea id="message" name="message" rows={5} placeholder="Tell us how we can help..." required />
                            </div>
                            <Button type="submit" className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 text-white">
                                Send Message
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Contact Info */}
                <div className="space-y-6">
                    <Card>
                        <CardContent className="p-6 space-y-5">
                            <h3 className="font-semibold">Get in Touch</h3>
                            <div className="flex items-start gap-3">
                                <Mail className="h-5 w-5 text-primary-600 mt-0.5" />
                                <div>
                                    <p className="font-medium text-sm">Email</p>
                                    <a href="mailto:hello@MMW.com" className="text-sm text-muted-foreground hover:text-primary-600">
                                        hello@MMW.com
                                    </a>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Phone className="h-5 w-5 text-primary-600 mt-0.5" />
                                <div>
                                    <p className="font-medium text-sm">Phone</p>
                                    <a href="tel:+911234567890" className="text-sm text-muted-foreground hover:text-primary-600">
                                        +91 12345 67890
                                    </a>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-primary-600 mt-0.5" />
                                <div>
                                    <p className="font-medium text-sm">Address</p>
                                    <p className="text-sm text-muted-foreground">
                                        MMW HQ<br />
                                        Ludhiana, Punjab, India
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Clock className="h-5 w-5 text-primary-600 mt-0.5" />
                                <div>
                                    <p className="font-medium text-sm">Business Hours</p>
                                    <p className="text-sm text-muted-foreground">
                                        Mon — Sat: 10 AM – 6 PM IST<br />
                                        Sunday: Closed
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-primary-50 border-primary-200">
                        <CardContent className="p-6">
                            <h3 className="font-semibold mb-2">Quick Response</h3>
                            <p className="text-sm text-muted-foreground">
                                We typically respond within 24 hours on business days. For urgent order issues, please include your order number.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Container>
    )
}

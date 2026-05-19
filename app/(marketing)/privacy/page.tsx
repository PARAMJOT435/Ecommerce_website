import { Container } from "@/components/ui/container"

export const metadata = {
    title: "Privacy Policy | MMW",
    description: "Learn how MMW collects, uses, and protects your personal information.",
}

export default function PrivacyPolicyPage() {
    return (
        <Container className="py-12 md:py-16">
            <div className="max-w-3xl mx-auto prose prose-sm prose-neutral">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Privacy Policy</h1>
                <p className="text-muted-foreground text-sm mb-8">Last updated: February 2026</p>

                <p>
                    At <strong>MMW</strong>, we are committed to protecting your privacy. This Privacy Policy explains how we collect,
                    use, disclose, and safeguard your information when you visit our website and purchase our products.
                </p>

                <h2>1. Information We Collect</h2>

                <h3>Personal Information</h3>
                <p>When you create an account, place an order, or contact us, we may collect:</p>
                <ul>
                    <li>Full name, email address, phone number</li>
                    <li>Shipping and billing addresses</li>
                    <li>Payment information (processed securely via Razorpay — we never store card details)</li>
                    <li>Order history and preferences</li>
                </ul>

                <h3>Automatically Collected Information</h3>
                <p>When you browse our site, we may automatically collect:</p>
                <ul>
                    <li>IP address, browser type, operating system</li>
                    <li>Pages viewed, time spent, referral source</li>
                    <li>Device information and cookies</li>
                </ul>

                <h2>2. How We Use Your Information</h2>
                <p>We use the information we collect to:</p>
                <ul>
                    <li>Process and fulfill your orders</li>
                    <li>Communicate about orders, deliveries, and returns</li>
                    <li>Send promotional emails and newsletters (with your consent)</li>
                    <li>Improve our website, products, and services</li>
                    <li>Prevent fraud and ensure security</li>
                    <li>Comply with legal obligations</li>
                </ul>

                <h2>3. Information Sharing</h2>
                <p>We do <strong>not</strong> sell your personal information. We may share it with:</p>
                <ul>
                    <li><strong>Service Providers:</strong> Payment processors (Razorpay), shipping partners, email services — only as needed to fulfill orders</li>
                    <li><strong>Legal Requirements:</strong> When required by law, court order, or government regulation</li>
                    <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets</li>
                </ul>

                <h2>4. Cookies</h2>
                <p>
                    We use cookies to enhance your browsing experience, remember your preferences, and analyze site traffic.
                    You can disable cookies in your browser settings, but some features may not work properly.
                </p>

                <h2>5. Data Security</h2>
                <p>
                    We implement industry-standard security measures including SSL encryption, secure authentication (via Supabase Auth),
                    and row-level security on our database. However, no method of transmission over the Internet is 100% secure.
                </p>

                <h2>6. Your Rights</h2>
                <p>You have the right to:</p>
                <ul>
                    <li><strong>Access</strong> the personal data we hold about you</li>
                    <li><strong>Correct</strong> inaccurate information</li>
                    <li><strong>Delete</strong> your account and associated data</li>
                    <li><strong>Opt out</strong> of marketing communications at any time</li>
                    <li><strong>Withdraw consent</strong> for data processing</li>
                </ul>
                <p>
                    To exercise any of these rights, email us at{" "}
                    <a href="mailto:hello@MMW.com" className="text-primary-600">hello@MMW.com</a>.
                </p>

                <h2>7. Third-Party Links</h2>
                <p>
                    Our website may contain links to third-party websites. We are not responsible for the privacy practices
                    of those sites and encourage you to review their privacy policies.
                </p>

                <h2>8. Children's Privacy</h2>
                <p>
                    Our services are not intended for children under 13. We do not knowingly collect personal information
                    from children.
                </p>

                <h2>9. Changes to This Policy</h2>
                <p>
                    We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated
                    "Last updated" date. Your continued use of the site constitutes acceptance of any changes.
                </p>

                <h2>10. Contact Us</h2>
                <p>
                    If you have any questions about this Privacy Policy, please contact us:
                </p>
                <ul>
                    <li><strong>Email:</strong> <a href="mailto:hello@MMW.com" className="text-primary-600">hello@MMW.com</a></li>
                    <li><strong>Phone:</strong> +91 12345 67890</li>
                    <li><strong>Address:</strong> MMW HQ, Ludhiana, Punjab, India</li>
                </ul>
            </div>
        </Container>
    )
}

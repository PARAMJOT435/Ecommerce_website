import React from "react"
import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { AccountSidebar, AccountMobileTabs } from "@/components/features/account/account-sidebar"
import { Container } from "@/components/ui/container"
import { CartDrawerWrapper } from "@/components/features/cart/cart-drawer-wrapper"

export default async function AccountLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Check if user is admin - admins cannot access customer account pages
    const { data: admin } = await supabase
        .from('admins')
        .select('id')
        .eq('id', user.id)
        .single()

    if (admin) {
        redirect('/admin/dashboard')
    }

    const headerUser = {
        email: user.email ?? '',
        firstName: user.user_metadata?.first_name as string | null,
        lastName: user.user_metadata?.last_name as string | null,
    }

    const isAdmin = !!admin

    return (
        <div className="flex min-h-screen flex-col bg-neutral-50">
            <Header user={headerUser} isAdmin={isAdmin} />
            <AccountMobileTabs />
            <Container className="flex-1 py-8">
                <div className="grid gap-8 md:grid-cols-[240px_1fr]">
                    {/* Desktop Sidebar */}
                    <aside className="hidden md:block">
                        <div className="sticky top-24 rounded-xl border border-neutral-200 bg-white p-4">
                            <h2 className="mb-4 px-3 text-sm font-semibold text-neutral-400 uppercase tracking-wider">
                                My Account
                            </h2>
                            <AccountSidebar />
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="min-w-0">
                        {children}
                    </main>
                </div>
            </Container>
            <Footer />
            <CartDrawerWrapper />
        </div>
    )
}

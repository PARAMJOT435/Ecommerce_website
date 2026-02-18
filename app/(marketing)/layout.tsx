import React from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { createServerClient } from "@/lib/supabase/server";
import { CartDrawerWrapper } from "@/components/features/cart/cart-drawer-wrapper";

export default async function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    const headerUser = user
        ? {
            email: user.email ?? '',
            firstName: user.user_metadata?.first_name as string | null,
            lastName: user.user_metadata?.last_name as string | null,
        }
        : null;

    return (
        <div className="flex min-h-screen flex-col">
            <Header user={headerUser} />
            <main className="flex-1">{children}</main>
            <Footer />
            <CartDrawerWrapper />
        </div>
    );
}

import React from "react"
import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { Container } from "@/components/ui/container"
import { CheckoutForm } from "@/components/features/checkout/checkout-form"
import { getAddresses } from "@/app/actions/account"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Checkout | fewofmany",
    description: "Complete your purchase securely.",
}

export default async function CheckoutPage() {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch saved addresses
    const { addresses } = await getAddresses()

    return (
        <Container>
            <div className="py-10">
                <h1 className="text-2xl font-heading font-bold text-neutral-900 mb-8 text-center">
                    Checkout
                </h1>
                <CheckoutForm savedAddresses={addresses || []} />
            </div>
        </Container>
    )
}

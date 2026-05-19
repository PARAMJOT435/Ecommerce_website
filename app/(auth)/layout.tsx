import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Logo } from '@/components/ui/logo'

export default async function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
        redirect('/')
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 relative px-4 py-8">
            {/* Top Navigation Bar for Auth Pages */}
            <div className="absolute top-0 left-0 w-full p-4 flex items-center justify-between">
                <Link 
                    href="/" 
                    className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Home</span>
                </Link>
                
                {/* Optional: Add Logo to the top right or center if desired, but centered is usually best. */}
                <div className="hidden md:block">
                    <Link href="/">
                        <Logo />
                    </Link>
                </div>
            </div>

            {/* Mobile Logo centered above the card */}
            <div className="md:hidden mb-8">
                <Link href="/">
                    <Logo />
                </Link>
            </div>

            <div className="w-full max-w-md relative z-10">
                {children}
            </div>
        </div>
    )
}

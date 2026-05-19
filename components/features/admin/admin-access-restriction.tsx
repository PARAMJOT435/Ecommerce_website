import { AlertCircle, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface AdminAccessRestrictionProps {
    title?: string
    message?: string
    showAdminDashboard?: boolean
}

export function AdminAccessRestriction({
    title = "Admin Access Detected",
    message = "This feature is designed for customers only. Admin accounts cannot perform this action.",
    showAdminDashboard = true,
}: AdminAccessRestrictionProps) {
    return (
        <div className="flex items-center justify-center min-h-[400px] px-4">
            <div className="max-w-md w-full space-y-6 text-center">
                <div className="flex justify-center">
                    <div className="rounded-full bg-orange-100 p-4">
                        <AlertCircle className="h-8 w-8 text-orange-600" />
                    </div>
                </div>

                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-neutral-900">{title}</h2>
                    <p className="text-neutral-600 text-sm leading-relaxed">
                        {message}
                    </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex gap-3 items-start">
                        <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-blue-900">
                            If you need to test customer workflows, please log in with a regular customer account.
                        </p>
                    </div>
                </div>

                {showAdminDashboard && (
                    <Link href="/admin/dashboard">
                        <Button className="w-full bg-primary-600 hover:bg-primary-700 text-white">
                            Go to Admin Dashboard
                        </Button>
                    </Link>
                )}
            </div>
        </div>
    )
}

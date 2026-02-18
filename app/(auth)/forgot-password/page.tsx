'use client'

import Link from 'next/link'
import { useState } from 'react'
import { resetPassword } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { KeyRound, ArrowLeft, CheckCircle } from 'lucide-react'

export default function ForgotPasswordPage() {
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    async function handleSubmit(formData: FormData) {
        setError(null)
        setSuccess(null)
        setLoading(true)
        const result = await resetPassword(formData)
        setLoading(false)

        if (result?.error) {
            setError(result.error)
        }
        if (result?.success) {
            setSuccess(result.success)
        }
    }

    return (
        <Card className="border-neutral-200 shadow-lg">
            <CardHeader className="text-center space-y-2">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                    <KeyRound className="h-6 w-6 text-primary-600" />
                </div>
                <CardTitle className="text-2xl font-heading">Reset Password</CardTitle>
                <CardDescription>
                    Enter your email and we&apos;ll send you a reset link
                </CardDescription>
            </CardHeader>
            <CardContent>
                {success ? (
                    <div className="rounded-md bg-green-50 border border-green-200 p-4 text-center">
                        <CheckCircle className="mx-auto h-8 w-8 text-green-600 mb-2" />
                        <p className="text-sm text-green-700 font-medium">{success}</p>
                    </div>
                ) : (
                    <form action={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="you@example.com"
                                required
                                autoComplete="email"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-primary-600 hover:bg-primary-700 text-white"
                            disabled={loading}
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </Button>
                    </form>
                )}
            </CardContent>
            <CardFooter className="flex justify-center">
                <Link
                    href="/login"
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-neutral-900"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back to login
                </Link>
            </CardFooter>
        </Card>
    )
}

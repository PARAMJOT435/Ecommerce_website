'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, ArrowRight, ShieldCheck, Mail } from 'lucide-react'

import { login, signup, checkEmailExists } from '@/app/actions/auth'
import { emailSchema, loginSchema, signupSchema, EmailFormValues, LoginFormValues, SignupFormValues } from '@/lib/validations/auth'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

type Step = 'EMAIL' | 'LOGIN' | 'SIGNUP'

export default function AuthWizardPage() {
    const router = useRouter()
    const [step, setStep] = useState<Step>('EMAIL')
    const [savedEmail, setSavedEmail] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    // Form: Step 1 (Email)
    const emailForm = useForm<EmailFormValues>({
        resolver: zodResolver(emailSchema),
        defaultValues: { email: '' },
    })

    // Form: Step 2 (Login - Password only)
    const loginForm = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: { password: '' },
    })

    // Form: Step 3 (Signup - Names & Password)
    const signupForm = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
        defaultValues: { firstName: '', lastName: '', password: '' },
    })

    // Handle Email Check
    async function onEmailSubmit(data: EmailFormValues) {
        setError(null)
        setLoading(true)
        
        try {
            const exists = await checkEmailExists(data.email)
            setSavedEmail(data.email)
            
            if (exists) {
                setStep('LOGIN')
            } else {
                setStep('SIGNUP')
            }
        } catch (err) {
            setError('Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    // Handle Login
    async function onLoginSubmit(data: LoginFormValues) {
        setError(null)
        setLoading(true)
        
        const formData = new FormData()
        formData.append('email', savedEmail)
        formData.append('password', data.password)
        
        const result = await login(formData)
        if (result?.error) {
            setError(result.error)
            setLoading(false)
        }
    }

    // Handle Signup
    async function onSignupSubmit(data: SignupFormValues) {
        setError(null)
        setLoading(true)
        
        const formData = new FormData()
        formData.append('email', savedEmail)
        formData.append('password', data.password)
        formData.append('firstName', data.firstName)
        formData.append('lastName', data.lastName)
        
        const result = await signup(formData)
        if (result?.error) {
            setError(result.error)
            setLoading(false)
        }
    }

    return (
        <Card className="border-neutral-200 shadow-lg overflow-hidden relative min-h-[400px] flex flex-col justify-center">
            <CardHeader className="text-center space-y-2 relative z-10">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                    <ShieldCheck className="h-6 w-6 text-primary-600" />
                </div>
                <CardTitle className="text-2xl font-heading">
                    {step === 'EMAIL' && "Welcome to MMW"}
                    {step === 'LOGIN' && "Welcome back"}
                    {step === 'SIGNUP' && "Create your account"}
                </CardTitle>
                <CardDescription>
                    {step === 'EMAIL' && "Enter your email to sign in or create an account"}
                    {step === 'LOGIN' && <span>Signing in as <strong className="text-foreground">{savedEmail}</strong></span>}
                    {step === 'SIGNUP' && <span>Creating account for <strong className="text-foreground">{savedEmail}</strong></span>}
                </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
                {error && (
                    <div className="mb-4 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700 animate-in fade-in slide-in-from-top-2">
                        {error}
                    </div>
                )}

                {/* STEP 1: EMAIL */}
                {step === 'EMAIL' && (
                    <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    className="pl-9"
                                    {...emailForm.register("email")}
                                />
                            </div>
                            {emailForm.formState.errors.email && (
                                <p className="text-sm text-red-600">{emailForm.formState.errors.email.message}</p>
                            )}
                        </div>
                        <Button type="submit" className="w-full bg-primary-600 hover:bg-primary-700 text-white group" disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Continue"}
                            {!loading && <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />}
                        </Button>
                    </form>
                )}

                {/* STEP 2: LOGIN */}
                {step === 'LOGIN' && (
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4 animate-in fade-in slide-in-from-right-8 duration-500">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <Link href="/forgot-password" className="text-xs text-primary-600 hover:text-primary-700">
                                    Forgot password?
                                </Link>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                {...loginForm.register("password")}
                            />
                            {loginForm.formState.errors.password && (
                                <p className="text-sm text-red-600">{loginForm.formState.errors.password.message}</p>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Button type="button" variant="outline" className="w-1/3" onClick={() => setStep('EMAIL')} disabled={loading}>
                                Back
                            </Button>
                            <Button type="submit" className="flex-1 bg-primary-600 hover:bg-primary-700 text-white" disabled={loading}>
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign In"}
                            </Button>
                        </div>
                    </form>
                )}

                {/* STEP 3: SIGNUP */}
                {step === 'SIGNUP' && (
                    <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4 animate-in fade-in slide-in-from-right-8 duration-500">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input
                                    id="firstName"
                                    placeholder="Harpreet"
                                    {...signupForm.register("firstName")}
                                />
                                {signupForm.formState.errors.firstName && (
                                    <p className="text-xs text-red-600">{signupForm.formState.errors.firstName.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input
                                    id="lastName"
                                    placeholder="Singh"
                                    {...signupForm.register("lastName")}
                                />
                                {signupForm.formState.errors.lastName && (
                                    <p className="text-xs text-red-600">{signupForm.formState.errors.lastName.message}</p>
                                )}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="signup-password">Create Password</Label>
                            <Input
                                id="signup-password"
                                type="password"
                                placeholder="••••••••"
                                {...signupForm.register("password")}
                            />
                            {signupForm.formState.errors.password && (
                                <p className="text-xs text-red-600">{signupForm.formState.errors.password.message}</p>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Button type="button" variant="outline" className="w-1/3" onClick={() => setStep('EMAIL')} disabled={loading}>
                                Back
                            </Button>
                            <Button type="submit" className="flex-1 bg-primary-600 hover:bg-primary-700 text-white" disabled={loading}>
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create Account"}
                            </Button>
                        </div>
                    </form>
                )}
            </CardContent>
        </Card>
    )
}

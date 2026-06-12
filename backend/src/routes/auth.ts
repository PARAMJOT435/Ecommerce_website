import { Router, Request, Response } from 'express'
import { z } from 'zod'
import prisma from '../config/database'
import { hashPassword, comparePasswords } from '../utils/hash'
import { generateToken } from '../utils/jwt'
import { asyncHandler } from '../middleware/errorHandler'
import { authenticateJWT } from '../middleware/auth'

const router = Router()

// Schemas
const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

const passwordChangeSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(6),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// Signup
router.post(
  '/signup',
  asyncHandler(async (req: Request, res: Response) => {
    const data = signupSchema.parse(req.body)

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser) {
      res.status(400).json({ error: 'Email already registered' })
      return
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password)

    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        profile: {
          create: {},
        },
        cart: {
          create: {},
        },
      },
    })

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    })
  })
)

// Login
router.post(
  '/login',
  asyncHandler(async (req: Request, res: Response) => {
    const data = loginSchema.parse(req.body)

    const user = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' })
      return
    }

    const isPasswordValid = await comparePasswords(data.password, user.password)

    if (!isPasswordValid) {
      res.status(401).json({ error: 'Invalid email or password' })
      return
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    })
  })
)

// Verify Token
router.get(
  '/verify-token',
  asyncHandler(async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

    if (!token) {
      res.status(401).json({ error: 'No token provided' })
      return
    }

    // If middleware passes, token is valid
    res.json({ valid: true })
  })
)

// Check email exists
router.get(
  '/check-email/:email',
  asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.params

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    })

    res.json({ exists: !!user })
  })
)

// Logout (frontend responsibility, but endpoint for completeness)
router.post(
  '/logout',
  authenticateJWT,
  asyncHandler(async (req: Request, res: Response) => {
    // Token invalidation would require a token blacklist in production
    res.json({ message: 'Logged out successfully' })
  })
)

export default router

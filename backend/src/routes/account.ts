import { Router, Request, Response } from 'express'
import { z } from 'zod'
import prisma from '../config/database'
import { authenticateJWT } from '../middleware/auth'
import { asyncHandler } from '../middleware/errorHandler'
import { comparePasswords, hashPassword } from '../utils/hash'

const router = Router()

// Get profile
router.get(
  '/profile',
  authenticateJWT,
  asyncHandler(async (req: Request, res: Response) => {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        profile: true,
      },
    })

    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }

    res.json(user)
  })
)

// Update profile
router.put(
  '/profile',
  authenticateJWT,
  asyncHandler(async (req: Request, res: Response) => {
    const schema = z.object({
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      phone: z.string().optional(),
      bio: z.string().optional(),
      company: z.string().optional(),
      location: z.string().optional(),
    })

    const data = schema.parse(req.body)

    const user = await prisma.user.update({
      where: { id: req.user!.userId },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        profile: data.bio || data.company || data.location ? {
          update: {
            bio: data.bio,
            company: data.company,
            location: data.location,
          },
        } : undefined,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
      },
    })

    res.json({ message: 'Profile updated', user })
  })
)

// Change password
router.post(
  '/change-password',
  authenticateJWT,
  asyncHandler(async (req: Request, res: Response) => {
    const schema = z.object({
      currentPassword: z.string(),
      newPassword: z.string().min(6),
      confirmPassword: z.string(),
    }).refine((data) => data.newPassword === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    }).refine((data) => data.currentPassword !== data.newPassword, {
      message: "New password must be different from current password",
      path: ["newPassword"],
    })

    const data = schema.parse(req.body)

    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
    })

    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }

    const isPasswordValid = await comparePasswords(data.currentPassword, user.password)

    if (!isPasswordValid) {
      res.status(401).json({ error: 'Current password is incorrect' })
      return
    }

    const hashedNewPassword = await hashPassword(data.newPassword)

    await prisma.user.update({
      where: { id: req.user!.userId },
      data: { password: hashedNewPassword },
    })

    res.json({ message: 'Password changed successfully' })
  })
)

// Get addresses
router.get(
  '/addresses',
  authenticateJWT,
  asyncHandler(async (req: Request, res: Response) => {
    const addresses = await prisma.address.findMany({
      where: { userId: req.user!.userId },
      orderBy: { isDefault: 'desc' },
    })

    res.json(addresses)
  })
)

// Add address
router.post(
  '/addresses',
  authenticateJWT,
  asyncHandler(async (req: Request, res: Response) => {
    const schema = z.object({
      street: z.string(),
      city: z.string(),
      state: z.string(),
      postalCode: z.string(),
      country: z.string(),
      isDefault: z.boolean().optional(),
    })

    const data = schema.parse(req.body)

    const address = await prisma.address.create({
      data: {
        userId: req.user!.userId,
        ...data,
      },
    })

    res.status(201).json(address)
  })
)

// Update address
router.put(
  '/addresses/:id',
  authenticateJWT,
  asyncHandler(async (req: Request, res: Response) => {
    const schema = z.object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      postalCode: z.string().optional(),
      country: z.string().optional(),
      isDefault: z.boolean().optional(),
    })

    const data = schema.parse(req.body)

    const address = await prisma.address.update({
      where: { id: req.params.id },
      data,
    })

    res.json(address)
  })
)

// Delete address
router.delete(
  '/addresses/:id',
  authenticateJWT,
  asyncHandler(async (req: Request, res: Response) => {
    await prisma.address.delete({
      where: { id: req.params.id },
    })

    res.json({ message: 'Address deleted' })
  })
)

// Set default address
router.put(
  '/addresses/:id/set-default',
  authenticateJWT,
  asyncHandler(async (req: Request, res: Response) => {
    // Remove default from all other addresses
    await prisma.address.updateMany({
      where: { userId: req.user!.userId },
      data: { isDefault: false },
    })

    // Set this one as default
    const address = await prisma.address.update({
      where: { id: req.params.id },
      data: { isDefault: true },
    })

    res.json({ message: 'Default address updated', address })
  })
)

export default router

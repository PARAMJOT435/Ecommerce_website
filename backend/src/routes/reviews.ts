import { Router, Request, Response } from 'express'
import { z } from 'zod'
import prisma from '../config/database'
import { authenticateJWT } from '../middleware/auth'
import { asyncHandler } from '../middleware/errorHandler'

const router = Router()

// Submit review
router.post(
  '/',
  authenticateJWT,
  asyncHandler(async (req: Request, res: Response) => {
    const schema = z.object({
      productId: z.string(),
      rating: z.number().int().min(1).max(5),
      title: z.string(),
      content: z.string().optional(),
    })

    const data = schema.parse(req.body)

    const review = await prisma.review.create({
      data: {
        ...data,
        userId: req.user!.userId,
        status: 'pending',
      },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, avatar: true },
        },
      },
    })

    res.status(201).json(review)
  })
)

// Get product reviews (approved only)
router.get(
  '/product/:productId',
  asyncHandler(async (req: Request, res: Response) => {
    const reviews = await prisma.review.findMany({
      where: {
        productId: req.params.productId,
        status: 'approved',
      },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, avatar: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    res.json(reviews)
  })
)

// Get user reviews
router.get(
  '/user/my-reviews',
  authenticateJWT,
  asyncHandler(async (req: Request, res: Response) => {
    const reviews = await prisma.review.findMany({
      where: { userId: req.user!.userId },
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    })

    res.json(reviews)
  })
)

export default router

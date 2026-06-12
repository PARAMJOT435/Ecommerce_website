import { Router, Request, Response } from 'express'
import { z } from 'zod'
import prisma from '../config/database'
import { authenticateJWT } from '../middleware/auth'
import { asyncHandler } from '../middleware/errorHandler'

const router = Router()

// Get wishlist
router.get(
  '/',
  authenticateJWT,
  asyncHandler(async (req: Request, res: Response) => {
    const wishlist = await prisma.wishlist.findMany({
      where: { userId: req.user!.userId },
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    })

    res.json(wishlist)
  })
)

// Add to wishlist
router.post(
  '/',
  authenticateJWT,
  asyncHandler(async (req: Request, res: Response) => {
    const schema = z.object({
      productId: z.string(),
    })

    const data = schema.parse(req.body)

    // Check if already in wishlist
    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_productId: { userId: req.user!.userId, productId: data.productId },
      },
    })

    if (existing) {
      res.status(400).json({ error: 'Product already in wishlist' })
      return
    }

    const item = await prisma.wishlist.create({
      data: {
        userId: req.user!.userId,
        productId: data.productId,
      },
      include: { product: true },
    })

    res.status(201).json(item)
  })
)

// Remove from wishlist
router.delete(
  '/:id',
  authenticateJWT,
  asyncHandler(async (req: Request, res: Response) => {
    await prisma.wishlist.delete({
      where: { id: req.params.id },
    })

    res.json({ message: 'Item removed from wishlist' })
  })
)

// Check if product in wishlist
router.get(
  '/check/:productId',
  authenticateJWT,
  asyncHandler(async (req: Request, res: Response) => {
    const item = await prisma.wishlist.findUnique({
      where: {
        userId_productId: { userId: req.user!.userId, productId: req.params.productId },
      },
    })

    res.json({ inWishlist: !!item })
  })
)

export default router

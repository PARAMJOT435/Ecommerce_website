import { Router, Request, Response } from 'express'
import { z } from 'zod'
import prisma from '../config/database'
import { authenticateJWT } from '../middleware/auth'
import { asyncHandler } from '../middleware/errorHandler'

const router = Router()

// Get user orders
router.get(
  '/',
  authenticateJWT,
  asyncHandler(async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query

    const pageNum = Math.max(1, parseInt(String(page)) || 1)
    const limitNum = Math.min(100, Math.max(1, parseInt(String(limit)) || 10))
    const skip = (pageNum - 1) * limitNum

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId: req.user!.userId },
        include: { items: { include: { product: true } }, address: true },
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.order.count({ where: { userId: req.user!.userId } }),
    ])

    res.json({
      orders,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    })
  })
)

// Get single order
router.get(
  '/:id',
  authenticateJWT,
  asyncHandler(async (req: Request, res: Response) => {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        items: { include: { product: true } },
        address: true,
      },
    })

    if (!order || order.userId !== req.user!.userId) {
      res.status(404).json({ error: 'Order not found' })
      return
    }

    res.json(order)
  })
)

// Create order
router.post(
  '/',
  authenticateJWT,
  asyncHandler(async (req: Request, res: Response) => {
    const schema = z.object({
      addressId: z.string(),
    })

    const data = schema.parse(req.body)

    // Get user cart
    const cart = await prisma.cart.findUnique({
      where: { userId: req.user!.userId },
      include: { items: { include: { product: true } } },
    })

    if (!cart || cart.items.length === 0) {
      res.status(400).json({ error: 'Cart is empty' })
      return
    }

    // Calculate total
    const total = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: req.user!.userId,
        addressId: data.addressId,
        total,
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
            userId: req.user!.userId,
          })),
        },
      },
      include: { items: { include: { product: true } } },
    })

    // Clear cart
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    })

    res.status(201).json(order)
  })
)

export default router

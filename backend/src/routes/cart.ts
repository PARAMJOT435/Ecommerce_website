import { Router, Request, Response } from 'express'
import { z } from 'zod'
import prisma from '../config/database'
import { authenticateJWT } from '../middleware/auth'
import { asyncHandler } from '../middleware/errorHandler'

const router = Router()

// Get cart
router.get(
  '/',
  authenticateJWT,
  asyncHandler(async (req: Request, res: Response) => {
    const cart = await prisma.cart.findUnique({
      where: { userId: req.user!.userId },
      include: {
        items: {
          include: { product: true },
        },
      },
    })

    if (!cart) {
      res.status(404).json({ error: 'Cart not found' })
      return
    }

    const total = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

    res.json({ ...cart, total })
  })
)

// Add to cart
router.post(
  '/add',
  authenticateJWT,
  asyncHandler(async (req: Request, res: Response) => {
    const schema = z.object({
      productId: z.string(),
      quantity: z.number().int().min(1),
    })

    const data = schema.parse(req.body)

    const cart = await prisma.cart.findUnique({
      where: { userId: req.user!.userId },
    })

    if (!cart) {
      res.status(404).json({ error: 'Cart not found' })
      return
    }

    const product = await prisma.product.findUnique({
      where: { id: data.productId },
    })

    if (!product) {
      res.status(404).json({ error: 'Product not found' })
      return
    }

    // Check if item already in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: { cartId: cart.id, productId: data.productId },
      },
    })

    let item

    if (existingItem) {
      item = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: { increment: data.quantity } },
        include: { product: true },
      })
    } else {
      item = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: data.productId,
          quantity: data.quantity,
        },
        include: { product: true },
      })
    }

    res.json({ message: 'Item added to cart', item })
  })
)

// Update cart item quantity
router.put(
  '/items/:itemId',
  authenticateJWT,
  asyncHandler(async (req: Request, res: Response) => {
    const schema = z.object({
      quantity: z.number().int().min(1),
    })

    const data = schema.parse(req.body)

    const item = await prisma.cartItem.update({
      where: { id: req.params.itemId },
      data: { quantity: data.quantity },
      include: { product: true },
    })

    res.json(item)
  })
)

// Remove from cart
router.delete(
  '/items/:itemId',
  authenticateJWT,
  asyncHandler(async (req: Request, res: Response) => {
    await prisma.cartItem.delete({
      where: { id: req.params.itemId },
    })

    res.json({ message: 'Item removed from cart' })
  })
)

// Clear cart
router.delete(
  '/',
  authenticateJWT,
  asyncHandler(async (req: Request, res: Response) => {
    const cart = await prisma.cart.findUnique({
      where: { userId: req.user!.userId },
    })

    if (cart) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      })
    }

    res.json({ message: 'Cart cleared' })
  })
)

export default router

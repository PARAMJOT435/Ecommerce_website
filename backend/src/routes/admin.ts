import { Router, Request, Response } from 'express'
import { z } from 'zod'
import prisma from '../config/database'
import { authenticateJWT, authenticateAdmin } from '../middleware/auth'
import { asyncHandler } from '../middleware/errorHandler'
import { generateSlug } from '../utils/slug'

const router = Router()

// Apply auth and admin checks to all admin routes
router.use(authenticateJWT)
router.use(authenticateAdmin)

// ========== PRODUCTS ==========

// Get all products (admin)
router.get(
  '/products',
  asyncHandler(async (req: Request, res: Response) => {
    const { page = 1, limit = 20 } = req.query

    const pageNum = Math.max(1, parseInt(String(page)) || 1)
    const limitNum = Math.min(100, Math.max(1, parseInt(String(limit)) || 20))
    const skip = (pageNum - 1) * limitNum

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        include: { category: true },
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count(),
    ])

    res.json({
      products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    })
  })
)

// Create product
router.post(
  '/products',
  asyncHandler(async (req: Request, res: Response) => {
    const schema = z.object({
      name: z.string(),
      description: z.string().optional(),
      price: z.number(),
      stock: z.number(),
      categoryId: z.string(),
      image: z.string().optional(),
    })

    const data = schema.parse(req.body)

    const product = await prisma.product.create({
      data: {
        ...data,
        slug: generateSlug(data.name),
      },
      include: { category: true },
    })

    res.status(201).json(product)
  })
)

// Update product
router.put(
  '/products/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const schema = z.object({
      name: z.string().optional(),
      description: z.string().optional(),
      price: z.number().optional(),
      stock: z.number().optional(),
      categoryId: z.string().optional(),
      image: z.string().optional(),
    })

    const data = schema.parse(req.body)

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data,
      include: { category: true },
    })

    res.json(product)
  })
)

// Delete product
router.delete(
  '/products/:id',
  asyncHandler(async (req: Request, res: Response) => {
    await prisma.product.delete({
      where: { id: req.params.id },
    })

    res.json({ message: 'Product deleted' })
  })
)

// ========== CATEGORIES ==========

// Get all categories (admin)
router.get(
  '/categories',
  asyncHandler(async (req: Request, res: Response) => {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: 'asc' },
    })

    res.json(categories)
  })
)

// Create category
router.post(
  '/categories',
  asyncHandler(async (req: Request, res: Response) => {
    const schema = z.object({
      name: z.string(),
      description: z.string().optional(),
      image: z.string().optional(),
    })

    const data = schema.parse(req.body)

    const category = await prisma.category.create({
      data: {
        ...data,
        slug: generateSlug(data.name),
      },
    })

    res.status(201).json(category)
  })
)

// Update category
router.put(
  '/categories/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const schema = z.object({
      name: z.string().optional(),
      description: z.string().optional(),
      image: z.string().optional(),
    })

    const data = schema.parse(req.body)

    const category = await prisma.category.update({
      where: { id: req.params.id },
      data,
    })

    res.json(category)
  })
)

// Delete category
router.delete(
  '/categories/:id',
  asyncHandler(async (req: Request, res: Response) => {
    await prisma.category.delete({
      where: { id: req.params.id },
    })

    res.json({ message: 'Category deleted' })
  })
)

// ========== BLOG POSTS ==========

// Get all blog posts (admin)
router.get(
  '/blog',
  asyncHandler(async (req: Request, res: Response) => {
    const { status } = req.query

    const where: any = {}
    if (status) where.status = String(status)

    const posts = await prisma.blogPost.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    res.json(posts)
  })
)

// Create blog post
router.post(
  '/blog',
  asyncHandler(async (req: Request, res: Response) => {
    const schema = z.object({
      title: z.string(),
      content: z.string(),
      excerpt: z.string().optional(),
      featured: z.string().optional(),
      status: z.enum(['draft', 'published']).default('draft'),
    })

    const data = schema.parse(req.body)

    const post = await prisma.blogPost.create({
      data: {
        ...data,
        slug: generateSlug(data.title),
      },
    })

    res.status(201).json(post)
  })
)

// Update blog post
router.put(
  '/blog/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const schema = z.object({
      title: z.string().optional(),
      content: z.string().optional(),
      excerpt: z.string().optional(),
      featured: z.string().optional(),
      status: z.enum(['draft', 'published']).optional(),
    })

    const data = schema.parse(req.body)

    const post = await prisma.blogPost.update({
      where: { id: req.params.id },
      data,
    })

    res.json(post)
  })
)

// Delete blog post
router.delete(
  '/blog/:id',
  asyncHandler(async (req: Request, res: Response) => {
    await prisma.blogPost.delete({
      where: { id: req.params.id },
    })

    res.json({ message: 'Blog post deleted' })
  })
)

// ========== ORDERS ==========

// Get all orders (admin)
router.get(
  '/orders',
  asyncHandler(async (req: Request, res: Response) => {
    const { status, page = 1, limit = 20 } = req.query

    const pageNum = Math.max(1, parseInt(String(page)) || 1)
    const limitNum = Math.min(100, Math.max(1, parseInt(String(limit)) || 20))
    const skip = (pageNum - 1) * limitNum

    const where: any = {}
    if (status) where.status = String(status)

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: { items: { include: { product: true } }, user: true, address: true },
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.order.count({ where }),
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

// Get single order (admin)
router.get(
  '/orders/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        items: { include: { product: true } },
        user: true,
        address: true,
      },
    })

    if (!order) {
      res.status(404).json({ error: 'Order not found' })
      return
    }

    res.json(order)
  })
)

// Update order status
router.put(
  '/orders/:id/status',
  asyncHandler(async (req: Request, res: Response) => {
    const schema = z.object({
      status: z.enum(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']),
    })

    const data = schema.parse(req.body)

    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status: data.status },
      include: { items: { include: { product: true } } },
    })

    res.json(order)
  })
)

// Update shipment tracking
router.put(
  '/orders/:id/tracking',
  asyncHandler(async (req: Request, res: Response) => {
    const schema = z.object({
      trackingNumber: z.string(),
    })

    const data = schema.parse(req.body)

    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { trackingNumber: data.trackingNumber },
    })

    res.json(order)
  })
)

// Delete order
router.delete(
  '/orders/:id',
  asyncHandler(async (req: Request, res: Response) => {
    await prisma.order.delete({
      where: { id: req.params.id },
    })

    res.json({ message: 'Order deleted' })
  })
)

// ========== REVIEWS ==========

// Get all reviews (admin)
router.get(
  '/reviews',
  asyncHandler(async (req: Request, res: Response) => {
    const { status } = req.query

    const where: any = {}
    if (status) where.status = String(status)

    const reviews = await prisma.review.findMany({
      where,
      include: { user: true, product: true },
      orderBy: { createdAt: 'desc' },
    })

    res.json(reviews)
  })
)

// Approve review
router.put(
  '/reviews/:id/approve',
  asyncHandler(async (req: Request, res: Response) => {
    const review = await prisma.review.update({
      where: { id: req.params.id },
      data: { status: 'approved' },
    })

    res.json(review)
  })
)

// Reject review
router.put(
  '/reviews/:id/reject',
  asyncHandler(async (req: Request, res: Response) => {
    const review = await prisma.review.update({
      where: { id: req.params.id },
      data: { status: 'rejected' },
    })

    res.json(review)
  })
)

// Delete review
router.delete(
  '/reviews/:id',
  asyncHandler(async (req: Request, res: Response) => {
    await prisma.review.delete({
      where: { id: req.params.id },
    })

    res.json({ message: 'Review deleted' })
  })
)

// ========== SETTINGS ==========

// Get settings
router.get(
  '/settings',
  asyncHandler(async (req: Request, res: Response) => {
    const settings = await prisma.settings.findMany()

    const formatted = settings.reduce(
      (acc, setting) => {
        acc[setting.key] = setting.type === 'number' ? parseFloat(setting.value) : setting.value
        return acc
      },
      {} as Record<string, any>
    )

    res.json(formatted)
  })
)

// Update settings
router.put(
  '/settings',
  asyncHandler(async (req: Request, res: Response) => {
    const updates = Object.entries(req.body)

    for (const [key, value] of updates) {
      await prisma.settings.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value), type: typeof value === 'number' ? 'number' : 'string' },
      })
    }

    res.json({ message: 'Settings updated' })
  })
)

export default router

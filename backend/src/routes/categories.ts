import { Router, Request, Response } from 'express'
import prisma from '../config/database'
import { asyncHandler } from '../middleware/errorHandler'

const router = Router()

// Get all categories
router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const categories = await prisma.category.findMany({
      include: {
        _count: { select: { products: true } },
      },
      orderBy: { name: 'asc' },
    })

    res.json(categories)
  })
)

// Get category by slug with products
router.get(
  '/:slug',
  asyncHandler(async (req: Request, res: Response) => {
    const category = await prisma.category.findUnique({
      where: { slug: req.params.slug },
      include: {
        products: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!category) {
      res.status(404).json({ error: 'Category not found' })
      return
    }

    res.json(category)
  })
)

export default router

import { Router, Request, Response } from 'express'
import prisma from '../config/database'
import { asyncHandler } from '../middleware/errorHandler'

const router = Router()

// Get all published blog posts
router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query

    const pageNum = Math.max(1, parseInt(String(page)) || 1)
    const limitNum = Math.min(100, Math.max(1, parseInt(String(limit)) || 10))
    const skip = (pageNum - 1) * limitNum

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where: { status: 'published' },
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.blogPost.count({ where: { status: 'published' } }),
    ])

    res.json({
      posts,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    })
  })
)

// Get single blog post by slug
router.get(
  '/:slug',
  asyncHandler(async (req: Request, res: Response) => {
    const post = await prisma.blogPost.findUnique({
      where: { slug: req.params.slug },
    })

    if (!post) {
      res.status(404).json({ error: 'Blog post not found' })
      return
    }

    res.json(post)
  })
)

export default router

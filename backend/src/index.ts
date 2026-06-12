import 'dotenv/config'
import express, { Express, Request, Response, NextFunction } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import env from './config/env'
import { errorHandler } from './middleware/errorHandler'

// Import routes
import authRoutes from './routes/auth'
import accountRoutes from './routes/account'
import productsRoutes from './routes/products'
import categoriesRoutes from './routes/categories'
import adminRoutes from './routes/admin'
import cartRoutes from './routes/cart'
import ordersRoutes from './routes/orders'
import blogRoutes from './routes/blog'
import wishlistRoutes from './routes/wishlist'
import reviewsRoutes from './routes/reviews'

const app: Express = express()

// Middleware
app.use(helmet())
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve static files (uploads)
app.use('/uploads', express.static('uploads'))

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/account', accountRoutes)
app.use('/api/products', productsRoutes)
app.use('/api/categories', categoriesRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/orders', ordersRoutes)
app.use('/api/blog', blogRoutes)
app.use('/api/wishlist', wishlistRoutes)
app.use('/api/reviews', reviewsRoutes)

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' })
})

// Error handler (must be last)
app.use(errorHandler)

const PORT = env.PORT
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/health`)
})

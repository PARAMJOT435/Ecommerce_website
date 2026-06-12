# Express Backend Setup Guide

## Project Structure Created

```
HTM-ECOMM/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts (Prisma client)
│   │   │   └── env.ts (Environment validation)
│   │   ├── middleware/
│   │   │   ├── auth.ts (JWT verification)
│   │   │   └── errorHandler.ts (Error handling)
│   │   ├── routes/
│   │   │   ├── auth.ts (Authentication)
│   │   │   ├── account.ts (User profile)
│   │   │   ├── products.ts (Public products)
│   │   │   ├── categories.ts (Categories)
│   │   │   ├── cart.ts (Shopping cart)
│   │   │   ├── orders.ts (Orders)
│   │   │   ├── wishlist.ts (Wishlist)
│   │   │   ├── reviews.ts (Reviews)
│   │   │   ├── blog.ts (Blog posts)
│   │   │   └── admin.ts (Admin management)
│   │   ├── utils/
│   │   │   ├── jwt.ts (JWT utilities)
│   │   │   ├── hash.ts (Password hashing)
│   │   │   └── slug.ts (Slug generation)
│   │   └── index.ts (Express app)
│   ├── prisma/
│   │   ├── schema.prisma (Database schema)
│   │   └── seed.ts (Sample data)
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile
│   └── .env.example
├── docker-compose.yml
└── ...
```

## Prerequisites

- Docker & Docker Compose installed
- Node.js 20+ (for local development without Docker)

## Setup Instructions

### Step 1: Create .env file

```bash
cd backend
cp .env.example .env.local
```

The `.env.local` already has correct values for Docker:

```env
DATABASE_URL=postgresql://ecommerce_user:ecommerce_password@postgres:5432/htm_ecomm
JWT_SECRET=your_super_secret_jwt_key_change_in_production
PORT=3001
NODE_ENV=development
```

### Step 2: Start with Docker Compose

```bash
cd ..  # Back to project root
docker-compose up
```

This will:
- Build the backend Docker image
- Start PostgreSQL container
- Start Express backend server
- Automatically run Prisma migrations
- Seed the database with sample data

**Wait for all services to be ready** (check logs for "✅ Database seeded successfully!")

### Step 3: Verify Backend is Running

Open your browser or use curl:

```bash
curl http://localhost:3001/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## API Documentation

### Base URL
```
http://localhost:3001/api
```

### Authentication
Most endpoints require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

---

## Key Endpoints

### Auth
- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/check-email/:email` - Check if email exists
- `POST /auth/logout` - Logout

### Account
- `GET /account/profile` - Get user profile
- `PUT /account/profile` - Update profile
- `POST /account/change-password` - Change password
- `GET /account/addresses` - List addresses
- `POST /account/addresses` - Add address
- `DELETE /account/addresses/:id` - Delete address
- `PUT /account/addresses/:id/set-default` - Set default address

### Products (Public)
- `GET /products` - List products (with pagination, filtering, search)
- `GET /products/:slug` - Get product details

### Categories (Public)
- `GET /categories` - List all categories
- `GET /categories/:slug` - Get category with products

### Cart
- `GET /cart` - Get user cart
- `POST /cart/add` - Add item to cart
- `PUT /cart/items/:itemId` - Update item quantity
- `DELETE /cart/items/:itemId` - Remove item
- `DELETE /cart` - Clear cart

### Wishlist
- `GET /wishlist` - Get wishlist
- `POST /wishlist` - Add to wishlist
- `DELETE /wishlist/:id` - Remove from wishlist
- `GET /wishlist/check/:productId` - Check if in wishlist

### Orders
- `GET /orders` - Get user orders
- `GET /orders/:id` - Get order details
- `POST /orders` - Create order

### Reviews
- `POST /reviews` - Submit review
- `GET /reviews/product/:productId` - Get product reviews

### Blog (Public)
- `GET /blog` - List blog posts
- `GET /blog/:slug` - Get blog post

### Admin Routes (Requires admin role)
- `GET /admin/products` - List products
- `POST /admin/products` - Create product
- `PUT /admin/products/:id` - Update product
- `DELETE /admin/products/:id` - Delete product
- `GET /admin/categories` - List categories
- `POST /admin/categories` - Create category
- `PUT /admin/categories/:id` - Update category
- `DELETE /admin/categories/:id` - Delete category
- `GET /admin/orders` - List all orders
- `PUT /admin/orders/:id/status` - Update order status
- `PUT /admin/orders/:id/tracking` - Add tracking number
- `GET /admin/reviews` - List all reviews
- `PUT /admin/reviews/:id/approve` - Approve review
- `PUT /admin/reviews/:id/reject` - Reject review
- `GET /admin/blog` - List blog posts (all statuses)
- `POST /admin/blog` - Create blog post
- `PUT /admin/blog/:id` - Update blog post
- `DELETE /admin/blog/:id` - Delete blog post
- `GET /admin/settings` - Get settings
- `PUT /admin/settings` - Update settings

---

## Sample Test Data

### Test Credentials

```
Admin:
  Email: admin@htm-ecomm.com
  Password: password123

User 1:
  Email: john@example.com
  Password: password123

User 2:
  Email: jane@example.com
  Password: password123

User 3:
  Email: mike@example.com
  Password: password123
```

### Sample Data Included

- **4 Users** (1 admin + 3 customers)
- **5 Categories** with diverse products
  - Electronics (5 products)
  - Fashion (5 products)
  - Home & Garden (5 products)
  - Sports & Outdoors (4 products)
  - Books (4 products)
- **23 Products** across categories
- **6 Blog Posts** (all published)
- **3 Orders** with various statuses
- **3 Carts** with items
- **3 Wishlist items**
- **3 Reviews** (pending/approved)

---

## Testing with Postman

1. Import this collection (add to Postman):

### Login First
```
POST http://localhost:3001/api/auth/login
Body (JSON):
{
  "email": "admin@htm-ecomm.com",
  "password": "password123"
}
```

Copy the returned `token` and use it for authenticated requests.

### Test Product Listing
```
GET http://localhost:3001/api/products?page=1&limit=12
```

### Test Admin - Create Product
```
POST http://localhost:3001/api/admin/products
Headers:
  Authorization: Bearer <token>
Body:
{
  "name": "New Product",
  "description": "Product description",
  "price": 99.99,
  "stock": 50,
  "categoryId": "<category-id>"
}
```

---

## Troubleshooting

### Port 5432 already in use
```bash
docker-compose down -v
docker-compose up
```

### Backend won't start
Check logs:
```bash
docker-compose logs backend
```

### Database connection error
Ensure PostgreSQL container is healthy:
```bash
docker-compose ps
```

### Reset database and reseed
```bash
docker-compose exec backend npx prisma db push --force-reset
docker-compose exec backend npx prisma db seed
```

---

## Development Workflow

### Adding a new endpoint

1. Create/update route in `backend/src/routes/`
2. Use the asyncHandler wrapper for error handling
3. Test with Postman or curl
4. Document in this guide

### Running Prisma commands

```bash
# Generate Prisma client
docker-compose exec backend npm run prisma:generate

# View database in Studio
docker-compose exec backend npm run prisma:studio

# Create new migration
docker-compose exec backend npx prisma migrate dev --name migration_name
```

---

## Next Steps

1. ✅ Backend is running
2. Next: Update frontend to use new backend API
3. Create API client utility in frontend
4. Update server actions to call Express backend
5. Test entire flow end-to-end

---

## Environment Variables

For production, update:
- `JWT_SECRET` - Use a strong random string
- `DATABASE_URL` - Point to production database
- `NODE_ENV` - Set to "production"
- Add CORS allowed origins

---

## Security Notes

⚠️ **Remember for production:**
- Change `JWT_SECRET` to a strong random value
- Use environment-specific configuration
- Enable CORS only for your frontend domain
- Add rate limiting
- Add input validation (already partially done with Zod)
- Add request logging
- Use HTTPS only
- Set secure cookies

---

All set! Backend is ready to receive requests from your frontend. 🚀

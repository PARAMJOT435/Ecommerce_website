import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing data
  await prisma.wishlist.deleteMany()
  await prisma.cartItem.deleteMany()
  await prisma.cart.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.review.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.address.deleteMany()
  await prisma.profile.deleteMany()
  await prisma.user.deleteMany()
  await prisma.blogPost.deleteMany()
  await prisma.settings.deleteMany()

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 10)

  const admin = await prisma.user.create({
    data: {
      email: 'admin@htm-ecomm.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      phone: '+1234567890',
    },
  })

  const user1 = await prisma.user.create({
    data: {
      email: 'john@example.com',
      password: hashedPassword,
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567891',
    },
  })

  const user2 = await prisma.user.create({
    data: {
      email: 'jane@example.com',
      password: hashedPassword,
      firstName: 'Jane',
      lastName: 'Smith',
      phone: '+1234567892',
    },
  })

  const user3 = await prisma.user.create({
    data: {
      email: 'mike@example.com',
      password: hashedPassword,
      firstName: 'Mike',
      lastName: 'Johnson',
      phone: '+1234567893',
    },
  })

  // Create profiles
  await prisma.profile.create({
    data: { userId: admin.id, bio: 'Store Administrator', location: 'New York, NY' },
  })

  await prisma.profile.create({
    data: { userId: user1.id, bio: 'Tech enthusiast', location: 'San Francisco, CA' },
  })

  await prisma.profile.create({
    data: { userId: user2.id, bio: 'Fashionista', location: 'Los Angeles, CA' },
  })

  await prisma.profile.create({
    data: { userId: user3.id, bio: 'Gaming nerd', location: 'Seattle, WA' },
  })

  // Create addresses
  const addr1 = await prisma.address.create({
    data: {
      userId: user1.id,
      street: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94102',
      country: 'USA',
      isDefault: true,
    },
  })

  await prisma.address.create({
    data: {
      userId: user1.id,
      street: '456 Oak Ave',
      city: 'San Jose',
      state: 'CA',
      postalCode: '95110',
      country: 'USA',
      isDefault: false,
    },
  })

  const addr2 = await prisma.address.create({
    data: {
      userId: user2.id,
      street: '789 Sunset Blvd',
      city: 'Los Angeles',
      state: 'CA',
      postalCode: '90001',
      country: 'USA',
      isDefault: true,
    },
  })

  const addr3 = await prisma.address.create({
    data: {
      userId: user3.id,
      street: '321 Pine Rd',
      city: 'Seattle',
      state: 'WA',
      postalCode: '98101',
      country: 'USA',
      isDefault: true,
    },
  })

  // Create categories
  const electronics = await prisma.category.create({
    data: {
      name: 'Electronics',
      slug: 'electronics',
      description: 'Latest electronics and gadgets',
      image: '/category-electronics.jpg',
    },
  })

  const fashion = await prisma.category.create({
    data: {
      name: 'Fashion',
      slug: 'fashion',
      description: 'Trendy clothing and accessories',
      image: '/category-fashion.jpg',
    },
  })

  const home = await prisma.category.create({
    data: {
      name: 'Home & Garden',
      slug: 'home-garden',
      description: 'Everything for your home',
      image: '/category-home.jpg',
    },
  })

  const sports = await prisma.category.create({
    data: {
      name: 'Sports & Outdoors',
      slug: 'sports-outdoors',
      description: 'Sports equipment and outdoor gear',
      image: '/category-sports.jpg',
    },
  })

  const books = await prisma.category.create({
    data: {
      name: 'Books',
      slug: 'books',
      description: 'Wide selection of books',
      image: '/category-books.jpg',
    },
  })

  // Create products - Electronics (5)
  const laptop = await prisma.product.create({
    data: {
      name: 'Pro Laptop 15"',
      slug: 'pro-laptop-15',
      description: 'High-performance laptop with Intel i7, 16GB RAM, 512GB SSD',
      price: 1299.99,
      stock: 15,
      categoryId: electronics.id,
      image: '/product-laptop.jpg',
      rating: 4.5,
      reviewCount: 23,
    },
  })

  const wireless_earbuds = await prisma.product.create({
    data: {
      name: 'Wireless Earbuds Pro',
      slug: 'wireless-earbuds-pro',
      description: 'Noise-cancelling wireless earbuds with 30-hour battery',
      price: 199.99,
      stock: 50,
      categoryId: electronics.id,
      image: '/product-earbuds.jpg',
      rating: 4.7,
      reviewCount: 156,
    },
  })

  const smart_watch = await prisma.product.create({
    data: {
      name: 'Smart Watch Ultra',
      slug: 'smart-watch-ultra',
      description: 'Advanced fitness tracking and health monitoring',
      price: 349.99,
      stock: 30,
      categoryId: electronics.id,
      image: '/product-smartwatch.jpg',
      rating: 4.3,
      reviewCount: 89,
    },
  })

  const phone = await prisma.product.create({
    data: {
      name: 'Smartphone X Pro',
      slug: 'smartphone-x-pro',
      description: '5G enabled with 120Hz display and 50MP camera',
      price: 899.99,
      stock: 20,
      categoryId: electronics.id,
      image: '/product-phone.jpg',
      rating: 4.6,
      reviewCount: 234,
    },
  })

  const tablet = await prisma.product.create({
    data: {
      name: 'Tablet 12" 4K',
      slug: 'tablet-12-4k',
      description: 'Lightweight tablet with stunning 4K display',
      price: 599.99,
      stock: 25,
      categoryId: electronics.id,
      image: '/product-tablet.jpg',
      rating: 4.4,
      reviewCount: 78,
    },
  })

  // Create products - Fashion (5)
  const jacket = await prisma.product.create({
    data: {
      name: 'Winter Jacket Premium',
      slug: 'winter-jacket-premium',
      description: 'Water-resistant winter jacket with thermal lining',
      price: 149.99,
      stock: 40,
      categoryId: fashion.id,
      image: '/product-jacket.jpg',
      rating: 4.5,
      reviewCount: 67,
    },
  })

  const jeans = await prisma.product.create({
    data: {
      name: 'Classic Blue Jeans',
      slug: 'classic-blue-jeans',
      description: 'Comfortable denim jeans with stretch fabric',
      price: 79.99,
      stock: 100,
      categoryId: fashion.id,
      image: '/product-jeans.jpg',
      rating: 4.6,
      reviewCount: 145,
    },
  })

  const shoes = await prisma.product.create({
    data: {
      name: 'Running Shoes Pro',
      slug: 'running-shoes-pro',
      description: 'Lightweight running shoes with advanced cushioning',
      price: 129.99,
      stock: 60,
      categoryId: fashion.id,
      image: '/product-shoes.jpg',
      rating: 4.7,
      reviewCount: 203,
    },
  })

  const dress = await prisma.product.create({
    data: {
      name: 'Evening Dress Elegant',
      slug: 'evening-dress-elegant',
      description: 'Stunning evening dress in multiple colors',
      price: 199.99,
      stock: 20,
      categoryId: fashion.id,
      image: '/product-dress.jpg',
      rating: 4.8,
      reviewCount: 91,
    },
  })

  const sunglasses = await prisma.product.create({
    data: {
      name: 'Polarized Sunglasses',
      slug: 'polarized-sunglasses',
      description: 'UV protection with polarized lenses',
      price: 89.99,
      stock: 80,
      categoryId: fashion.id,
      image: '/product-sunglasses.jpg',
      rating: 4.4,
      reviewCount: 112,
    },
  })

  // Create products - Home & Garden (5)
  const coffee_maker = await prisma.product.create({
    data: {
      name: 'Smart Coffee Maker',
      slug: 'smart-coffee-maker',
      description: 'WiFi-enabled coffee maker with scheduled brewing',
      price: 149.99,
      stock: 35,
      categoryId: home.id,
      image: '/product-coffee-maker.jpg',
      rating: 4.5,
      reviewCount: 134,
    },
  })

  const plant_pot = await prisma.product.create({
    data: {
      name: 'Ceramic Plant Pots Set',
      slug: 'ceramic-plant-pots-set',
      description: 'Set of 5 beautiful ceramic plant pots',
      price: 49.99,
      stock: 70,
      categoryId: home.id,
      image: '/product-pots.jpg',
      rating: 4.3,
      reviewCount: 58,
    },
  })

  const pillow = await prisma.product.create({
    data: {
      name: 'Orthopedic Pillow',
      slug: 'orthopedic-pillow',
      description: 'Premium orthopedic pillow for neck support',
      price: 79.99,
      stock: 90,
      categoryId: home.id,
      image: '/product-pillow.jpg',
      rating: 4.6,
      reviewCount: 187,
    },
  })

  const lamp = await prisma.product.create({
    data: {
      name: 'LED Desk Lamp',
      slug: 'led-desk-lamp',
      description: 'Adjustable LED desk lamp with USB charging',
      price: 59.99,
      stock: 55,
      categoryId: home.id,
      image: '/product-lamp.jpg',
      rating: 4.4,
      reviewCount: 103,
    },
  })

  const blanket = await prisma.product.create({
    data: {
      name: 'Fleece Blanket Premium',
      slug: 'fleece-blanket-premium',
      description: 'Soft and warm fleece blanket for all seasons',
      price: 39.99,
      stock: 120,
      categoryId: home.id,
      image: '/product-blanket.jpg',
      rating: 4.7,
      reviewCount: 256,
    },
  })

  // Create products - Sports & Outdoors (4)
  const yoga_mat = await prisma.product.create({
    data: {
      name: 'Premium Yoga Mat',
      slug: 'premium-yoga-mat',
      description: 'Non-slip yoga mat with carrying strap',
      price: 39.99,
      stock: 65,
      categoryId: sports.id,
      image: '/product-yoga-mat.jpg',
      rating: 4.5,
      reviewCount: 176,
    },
  })

  const dumbbells = await prisma.product.create({
    data: {
      name: 'Dumbbell Set 20kg',
      slug: 'dumbbell-set-20kg',
      description: 'Adjustable dumbbell set from 2kg to 20kg',
      price: 149.99,
      stock: 25,
      categoryId: sports.id,
      image: '/product-dumbbells.jpg',
      rating: 4.6,
      reviewCount: 98,
    },
  })

  const tent = await prisma.product.create({
    data: {
      name: 'Camping Tent 4-Person',
      slug: 'camping-tent-4-person',
      description: 'Waterproof tent with ventilation windows',
      price: 199.99,
      stock: 15,
      categoryId: sports.id,
      image: '/product-tent.jpg',
      rating: 4.7,
      reviewCount: 142,
    },
  })

  const backpack = await prisma.product.create({
    data: {
      name: 'Hiking Backpack 50L',
      slug: 'hiking-backpack-50l',
      description: 'Durable hiking backpack with rain cover',
      price: 129.99,
      stock: 40,
      categoryId: sports.id,
      image: '/product-backpack.jpg',
      rating: 4.5,
      reviewCount: 167,
    },
  })

  // Create products - Books (4)
  const book1 = await prisma.product.create({
    data: {
      name: 'The Art of Programming',
      slug: 'the-art-of-programming',
      description: 'Master the fundamentals of computer science',
      price: 49.99,
      stock: 100,
      categoryId: books.id,
      image: '/product-book1.jpg',
      rating: 4.6,
      reviewCount: 234,
    },
  })

  const book2 = await prisma.product.create({
    data: {
      name: 'Web Development Bible',
      slug: 'web-development-bible',
      description: 'Complete guide to modern web development',
      price: 59.99,
      stock: 85,
      categoryId: books.id,
      image: '/product-book2.jpg',
      rating: 4.7,
      reviewCount: 189,
    },
  })

  const book3 = await prisma.product.create({
    data: {
      name: 'Design Patterns Explained',
      slug: 'design-patterns-explained',
      description: 'Learn design patterns used by professionals',
      price: 54.99,
      stock: 70,
      categoryId: books.id,
      image: '/product-book3.jpg',
      rating: 4.5,
      reviewCount: 156,
    },
  })

  const book4 = await prisma.product.create({
    data: {
      name: 'Database Design Guide',
      slug: 'database-design-guide',
      description: 'Build robust and scalable databases',
      price: 64.99,
      stock: 60,
      categoryId: books.id,
      image: '/product-book4.jpg',
      rating: 4.8,
      reviewCount: 201,
    },
  })

  // Create reviews
  await prisma.review.create({
    data: {
      productId: laptop.id,
      userId: user1.id,
      rating: 5,
      title: 'Excellent laptop!',
      content: 'Great performance and build quality',
      status: 'approved',
    },
  })

  await prisma.review.create({
    data: {
      productId: wireless_earbuds.id,
      userId: user2.id,
      rating: 4,
      title: 'Good sound quality',
      content: 'Battery life is impressive',
      status: 'approved',
    },
  })

  await prisma.review.create({
    data: {
      productId: shoes.id,
      userId: user3.id,
      rating: 5,
      title: 'Perfect for running',
      content: 'Very comfortable even after long runs',
      status: 'approved',
    },
  })

  // Create blog posts
  await prisma.blogPost.create({
    data: {
      title: 'Top 10 Tech Gadgets 2024',
      slug: 'top-10-tech-gadgets-2024',
      content: 'Discover the latest and greatest tech gadgets...',
      excerpt: 'A comprehensive guide to the best tech of 2024',
      status: 'published',
    },
  })

  await prisma.blogPost.create({
    data: {
      title: 'Fashion Trends This Season',
      slug: 'fashion-trends-this-season',
      content: 'What to wear this season according to top designers...',
      excerpt: 'Stay fashionable with these trending styles',
      status: 'published',
    },
  })

  await prisma.blogPost.create({
    data: {
      title: 'Home Improvement Ideas',
      slug: 'home-improvement-ideas',
      content: 'Transform your living space with these ideas...',
      excerpt: 'Make your home more comfortable and beautiful',
      status: 'published',
    },
  })

  await prisma.blogPost.create({
    data: {
      title: 'Fitness Tips for Beginners',
      slug: 'fitness-tips-for-beginners',
      content: 'Start your fitness journey the right way...',
      excerpt: 'Beginner-friendly fitness tips and exercises',
      status: 'published',
    },
  })

  await prisma.blogPost.create({
    data: {
      title: 'Book Recommendations',
      slug: 'book-recommendations',
      content: 'Must-read books for developers and designers...',
      excerpt: 'Top books that changed our perspective',
      status: 'published',
    },
  })

  await prisma.blogPost.create({
    data: {
      title: 'Sustainable Shopping Guide',
      slug: 'sustainable-shopping-guide',
      content: 'How to shop sustainably and reduce waste...',
      excerpt: 'Be eco-friendly while shopping online',
      status: 'published',
    },
  })

  // Create carts
  await prisma.cart.create({
    data: {
      userId: user1.id,
      items: {
        create: [
          { productId: laptop.id, quantity: 1 },
          { productId: wireless_earbuds.id, quantity: 2 },
        ],
      },
    },
  })

  await prisma.cart.create({
    data: {
      userId: user2.id,
      items: {
        create: [{ productId: dress.id, quantity: 1 }],
      },
    },
  })

  await prisma.cart.create({
    data: {
      userId: user3.id,
      items: {
        create: [
          { productId: yoga_mat.id, quantity: 1 },
          { productId: dumbbells.id, quantity: 1 },
        ],
      },
    },
  })

  // Create orders
  const order1 = await prisma.order.create({
    data: {
      userId: user1.id,
      addressId: addr1.id,
      status: 'delivered',
      total: 1499.98,
      trackingNumber: 'TRACK123456',
      items: {
        create: [
          { productId: phone.id, quantity: 1, price: 899.99, userId: user1.id },
          { productId: wireless_earbuds.id, quantity: 1, price: 199.99, userId: user1.id },
        ],
      },
    },
  })

  const order2 = await prisma.order.create({
    data: {
      userId: user2.id,
      addressId: addr2.id,
      status: 'shipped',
      total: 729.97,
      trackingNumber: 'TRACK789012',
      items: {
        create: [
          { productId: jacket.id, quantity: 1, price: 149.99, userId: user2.id },
          { productId: shoes.id, quantity: 2, price: 259.98, userId: user2.id },
          { productId: sunglasses.id, quantity: 1, price: 89.99, userId: user2.id },
        ],
      },
    },
  })

  const order3 = await prisma.order.create({
    data: {
      userId: user3.id,
      addressId: addr3.id,
      status: 'pending',
      total: 199.99,
      items: {
        create: [{ productId: tent.id, quantity: 1, price: 199.99, userId: user3.id }],
      },
    },
  })

  // Create wishlist items
  await prisma.wishlist.create({
    data: { userId: user1.id, productId: tablet.id },
  })

  await prisma.wishlist.create({
    data: { userId: user2.id, productId: smart_watch.id },
  })

  await prisma.wishlist.create({
    data: { userId: user3.id, productId: backpack.id },
  })

  // Create settings
  await prisma.settings.create({
    data: { key: 'site_name', value: 'HTM ECOMM', type: 'string' },
  })

  await prisma.settings.create({
    data: { key: 'site_description', value: 'Your favorite online store', type: 'string' },
  })

  await prisma.settings.create({
    data: { key: 'shipping_cost', value: '9.99', type: 'number' },
  })

  await prisma.settings.create({
    data: { key: 'tax_rate', value: '0.08', type: 'number' },
  })

  console.log('✅ Database seeded successfully!')
  console.log(`
  🎉 Sample Data Created:
  - 4 Users (1 admin, 3 customers)
  - 5 Categories (23 products total)
  - 6 Blog Posts
  - 3 Orders with items
  - 3 Wishlist items
  - 3 Shopping carts
  
  Test Credentials:
  - Admin: admin@htm-ecomm.com / password123
  - User 1: john@example.com / password123
  - User 2: jane@example.com / password123
  - User 3: mike@example.com / password123
  `)
}

main()
  .catch((e) => {
    console.error('Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

# Architecture Guidelines

## Next.js App Router Structure

```
app/
├── (marketing)/              # Public-facing pages
│   ├── layout.tsx           # Marketing layout with header/footer
│   ├── page.tsx             # Homepage
│   ├── products/
│   │   ├── page.tsx         # Product listing
│   │   └── [slug]/
│   │       └── page.tsx     # Product detail page
│   ├── about/
│   │   └── page.tsx
│   └── blog/
│       ├── page.tsx
│       └── [slug]/
│           └── page.tsx
├── (shop)/                  # Shopping flow
│   ├── cart/
│   │   └── page.tsx
│   └── checkout/
│       ├── page.tsx
│       └── success/
│           └── page.tsx
├── (account)/               # User dashboard
│   ├── layout.tsx          # Dashboard layout with sidebar
│   ├── dashboard/
│   │   └── page.tsx
│   ├── orders/
│   │   ├── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   ├── subscriptions/
│   │   └── page.tsx
│   └── settings/
│       └── page.tsx
├── api/                     # API routes
│   ├── webhook/
│   │   └── razorpay/
│   │       └── route.ts
│   └── og/                  # Open Graph images
│       └── route.tsx
├── actions/                 # Server Actions
│   ├── auth.ts
│   ├── cart.ts
│   ├── products.ts
│   ├── orders.ts
│   └── subscriptions.ts
├── globals.css
├── layout.tsx              # Root layout
└── not-found.tsx

components/
├── ui/                     # Shadcn components
├── layout/                 # Layout components
├── features/               # Feature-specific components
│   ├── product/
│   ├── cart/
│   ├── checkout/
│   ├── account/
│   └── review/
└── forms/                  # Form components

lib/
├── supabase/
│   ├── client.ts          # Client-side Supabase
│   ├── server.ts          # Server-side Supabase
│   └── middleware.ts      # Auth middleware
├── razorpay/
│   ├── client.ts
│   └── server.ts
├── validations/           # Zod schemas
│   ├── product.ts
│   ├── checkout.ts
│   └── auth.ts
├── utils.ts               # Utility functions
└── constants.ts           # App constants

types/
├── database.types.ts      # Generated from Supabase
├── products.ts
├── cart.ts
└── index.ts

stores/                     # Zustand stores
├── cart-store.ts
└── ui-store.ts
```

---

## Server vs Client Components

### Default: Server Components

**All components are Server Components by default in Next.js 15.**

Benefits:
- Faster initial load
- Better SEO
- Direct database access
- Smaller JavaScript bundle

### When to Use Client Components

Add `"use client"` directive ONLY when you need:

1. **React Hooks**:
   ```typescript
   'use client'
   import { useState, useEffect } from 'react'
   ```

2. **Event Listeners**:
   ```typescript
   'use client'
   export function Button() {
     const handleClick = () => { ... }
     return <button onClick={handleClick}>Click</button>
   }
   ```

3. **Browser APIs**:
   ```typescript
   'use client'
   import { useRouter } from 'next/navigation'
   ```

4. **Third-party libraries that use React Context**:
   ```typescript
   'use client'
   import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
   ```

### Client-Server Boundary Best Practices

**Good Pattern** (Server as much as possible):
```typescript
// app/products/page.tsx (Server Component)
import { createServerClient } from '@/lib/supabase/server'
import { ProductList } from './product-list'

export default async function ProductsPage() {
  const supabase = createServerClient()
  const { data: products } = await supabase.from('products').select('*')
  
  return <ProductList products={products} /> // Client component for interactivity
}

// app/products/product-list.tsx (Client Component)
'use client'
import { useState } from 'react'

export function ProductList({ products }) {
  const [filter, setFilter] = useState('')
  // ... client-side filtering logic
}
```

**Bad Pattern** (Unnecessary client component):
```typescript
// ❌ DON'T DO THIS
'use client'
import { useEffect, useState } from 'react'

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  
  useEffect(() => {
    fetch('/api/products').then(r => r.json()).then(setProducts)
  }, [])
  
  return <ProductList products={products} />
}
```

---

## Data Fetching Patterns

### 1. Server Components (Preferred)

```typescript
// Fetch directly in Server Component
export default async function ProductPage({ params }: { params: { slug: string } }) {
  const supabase = createServerClient()
  
  const { data: product } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      images:product_images(*),
      variants:product_variants(*)
    `)
    .eq('slug', params.slug)
    .single()
  
  return <ProductDetails product={product} />
}
```

### 2. Server Actions (For Mutations)

```typescript
// app/actions/cart.ts
'use server'

import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addToCart(productId: string, quantity: number) {
  const supabase = createServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  
  const { data, error } = await supabase
    .from('cart_items')
    .insert({
      user_id: user.id,
      product_id: productId,
      quantity
    })
    .select()
    .single()
  
  if (error) throw error
  
  revalidatePath('/cart')
  return data
}
```

### 3. React Query (For Client-Side Caching)

```typescript
// app/providers.tsx
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
```

```typescript
// components/features/product/product-reviews.tsx
'use client'

import { useQuery } from '@tanstack/react-query'

export function ProductReviews({ productId }: { productId: string }) {
  const { data: reviews } = useQuery({
    queryKey: ['reviews', productId],
    queryFn: async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId)
        .eq('is_approved', true)
      return data
    }
  })
  
  return <ReviewList reviews={reviews} />
}
```

### 4. Real-time Subscriptions

```typescript
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function LiveOrderStatus({ orderId }: { orderId: string }) {
  const [status, setStatus] = useState<string>()
  
  useEffect(() => {
    const supabase = createClient()
    
    const channel = supabase
      .channel(`order-${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`
        },
        (payload) => {
          setStatus(payload.new.status)
        }
      )
      .subscribe()
    
    return () => {
      channel.unsubscribe()
    }
  }, [orderId])
  
  return <StatusBadge status={status} />
}
```

---

## State Management Strategy

### 1. Server State (React Query)
- Product catalogs
- User orders
- Reviews
- Any data from Supabase

### 2. Client State (Zustand)

#### Cart Store
```typescript
// stores/cart-store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) => set((state) => ({ 
        items: [...state.items, item] 
      })),
      // ... other methods
    }),
    {
      name: 'cart-storage',
    }
  )
)
```

#### UI Store
```typescript
// stores/ui-store.ts
import { create } from 'zustand'

interface UIStore {
  isMobileMenuOpen: boolean
  isCartDrawerOpen: boolean
  toggleMobileMenu: () => void
  toggleCartDrawer: () => void
}

export const useUIStore = create<UIStore>((set) => ({
  isMobileMenuOpen: false,
  isCartDrawerOpen: false,
  toggleMobileMenu: () => set((state) => ({ 
    isMobileMenuOpen: !state.isMobileMenuOpen 
  })),
  toggleCartDrawer: () => set((state) => ({ 
    isCartDrawerOpen: !state.isCartDrawerOpen 
  })),
}))
```

### 3. URL State (Search Params)
- Filters
- Sorting
- Pagination

```typescript
// app/products/page.tsx
export default function ProductsPage({
  searchParams
}: {
  searchParams: { category?: string; sort?: string }
}) {
  // Use searchParams for filtering
}
```

---

## Authentication Flow

### Supabase Auth Integration

```typescript
// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  await supabase.auth.getUser()

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

### Protected Routes

```typescript
// app/(account)/layout.tsx
import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }
  
  return <AppShell>{children}</AppShell>
}
```

---

## Performance Optimization

### 1. Image Optimization
```typescript
import Image from 'next/image'

<Image
  src={product.image_url}
  alt={product.name}
  width={400}
  height={400}
  priority={isFeatured} // Only for above-the-fold images
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

### 2. Route Prefetching
```typescript
import Link from 'next/link'

<Link href="/products" prefetch={true}>
  Products
</Link>
```

### 3. Dynamic Imports
```typescript
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./heavy-component'), {
  loading: () => <LoadingSpinner />,
  ssr: false // Client-side only if needed
})
```

### 4. Streaming with Suspense
```typescript
import { Suspense } from 'react'

export default function ProductPage() {
  return (
    <div>
      <ProductHero /> {/* Loads immediately */}
      <Suspense fallback={<ReviewsSkeleton />}>
        <ProductReviews /> {/* Streams in */}
      </Suspense>
    </div>
  )
}
```

---

## Error Handling

### Error Boundaries
```typescript
// app/error.tsx
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}
```

### Not Found Pages
```typescript
// app/products/[slug]/not-found.tsx
export default function ProductNotFound() {
  return (
    <EmptyState
      icon={Package}
      title="Product not found"
      description="The product you're looking for doesn't exist."
      action={<Link href="/products">Browse Products</Link>}
    />
  )
}
```

---

**Remember**: Server Components first, Client Components only when necessary.
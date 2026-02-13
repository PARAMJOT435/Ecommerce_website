# Development Workflows

## Component Creation Workflow

### Step 1: Check Before Creating
**MANDATORY**: Before writing ANY component code:
1. Check `rules/03-components.md` for existing components
2. If similar component exists → Reuse or extend it
3. If Shadcn component needed → Use CLI (see below)
4. If custom component needed → Follow creation process

### Step 2: Shadcn Component Installation

**For ANY Shadcn primitive** (Button, Input, Card, Dialog, etc.):

```bash
npx shadcn@latest add [component-name]
```

**DO NOT**:
- Write the component code yourself
- Copy from Shadcn docs
- Assume the component exists without checking

**After Installation**:
- Component appears in `components/ui/`
- Add to component inventory in `rules/03-components.md`
- Document any custom variants you add

### Step 3: Custom Component Creation

When creating a custom component:

1. **Determine location**:
   - UI primitives → `components/ui/`
   - Layout components → `components/layout/`
   - Feature components → `components/features/[feature-name]/`
   - Page-specific → `app/[route]/_components/`

2. **Create the component**:
   ```typescript
   // components/features/product/product-card.tsx
   import { Card } from "@/components/ui/card"
   import { Button } from "@/components/ui/button"
   
   interface ProductCardProps {
     // ... props
   }
   
   export function ProductCard({ ... }: ProductCardProps) {
     // ... implementation
   }
   ```

3. **Document it**: Add entry to `rules/03-components.md`

4. **Export from index** (if in a feature folder):
   ```typescript
   // components/features/product/index.ts
   export { ProductCard } from "./product-card"
   ```

## Database Operations Workflow

### Querying Data

**In Server Components**:
```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export default async function ProductsPage() {
  const supabase = createServerClient(...)
  
  const { data: products } = await supabase
    .from('products')
    .select('*, product_images(*)')
    .eq('is_active', true)
  
  return <ProductList products={products} />
}
```

**In Client Components** (use React Query):
```typescript
'use client'
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export function ProductList() {
  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const supabase = createClient()
      const { data } = await supabase.from('products').select('*')
      return data
    }
  })
}
```

### Mutations (Server Actions)

**Create Server Action**:
```typescript
// app/actions/products.ts
'use server'

import { createServerClient } from '@supabase/ssr'
import { revalidatePath } from 'next/cache'

export async function addToCart(productId: string, quantity: number) {
  const supabase = createServerClient(...)
  
  const { data, error } = await supabase
    .from('cart_items')
    .insert({ product_id: productId, quantity })
    .select()
    .single()
  
  if (error) throw error
  
  revalidatePath('/cart')
  return data
}
```

**Use in Client Component**:
```typescript
'use client'
import { addToCart } from '@/app/actions/products'

export function AddToCartButton({ productId }: Props) {
  const handleClick = async () => {
    await addToCart(productId, 1)
  }
  
  return <Button onClick={handleClick}>Add to Cart</Button>
}
```

## Form Handling Workflow

### Step 1: Define Schema
```typescript
// lib/validations/product.ts
import { z } from 'zod'

export const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  price: z.number().min(0, 'Price must be positive'),
  // ...
})

export type ProductFormData = z.infer<typeof productSchema>
```

### Step 2: Create Server Action
```typescript
'use server'
import { productSchema } from '@/lib/validations/product'

export async function createProduct(formData: FormData) {
  const validated = productSchema.parse({
    name: formData.get('name'),
    price: Number(formData.get('price')),
  })
  
  // ... create in database
}
```

### Step 3: Build Form Component
```typescript
'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

export function ProductForm() {
  const form = useForm({
    resolver: zodResolver(productSchema),
  })
  
  return (
    <form action={createProduct}>
      {/* form fields */}
    </form>
  )
}
```

## File Upload Workflow

### Step 1: Create Upload Handler
```typescript
'use server'
import { createServerClient } from '@supabase/ssr'

export async function uploadProductImage(formData: FormData) {
  const file = formData.get('file') as File
  const supabase = createServerClient(...)
  
  const fileName = `${Date.now()}-${file.name}`
  
  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(fileName, file)
  
  if (error) throw error
  
  const { data: { publicUrl } } = supabase.storage
    .from('product-images')
    .getPublicUrl(fileName)
  
  return publicUrl
}
```

### Step 2: Use in Component
```typescript
'use client'
export function ImageUpload() {
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    const formData = new FormData()
    formData.append('file', file)
    
    const url = await uploadProductImage(formData)
    // ... save url to database
  }
  
  return <input type="file" onChange={handleUpload} />
}
```

## Refactoring Protocol

When modifying existing files:

1. **Small Changes**: Edit the specific function/component
2. **Large Changes**: 
   - Create a new version alongside
   - Test thoroughly
   - Remove old version
   - Update imports

**DO NOT**:
- Rewrite entire files for small changes
- Change file structure without updating imports
- Remove code without checking for dependencies

## Testing Workflow

Before committing:
1. **Type check**: `npm run type-check`
2. **Lint**: `npm run lint`
3. **Build**: `npm run build`
4. **Test critical paths**: Cart, checkout, authentication

## Razorpay Payment Workflow

### Step 1: Create Razorpay Order (Server Action)
```typescript
// app/actions/payment.ts
'use server'

import Razorpay from 'razorpay'
import { createServerClient } from '@/lib/supabase/server'

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function createRazorpayOrder(amount: number, orderId: string) {
  const options = {
    amount: amount * 100, // Convert to paise
    currency: 'INR',
    receipt: orderId,
  }
  
  const razorpayOrder = await razorpay.orders.create(options)
  return razorpayOrder
}
```

### Step 2: Initialize Payment (Client Component)
```typescript
'use client'

import { useEffect } from 'react'

export function PaymentForm({ amount, orderId, onSuccess }: Props) {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)
  }, [])
  
  const handlePayment = async () => {
    const razorpayOrder = await createRazorpayOrder(amount, orderId)
    
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      name: 'Your Store Name',
      description: 'Product Purchase',
      order_id: razorpayOrder.id,
      handler: async (response: any) => {
        // Verify payment on server
        await verifyPayment({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        })
        onSuccess(response.razorpay_payment_id, response.razorpay_order_id)
      },
      prefill: {
        name: user.name,
        email: user.email,
        contact: user.phone,
      },
      theme: {
        color: '#3b82f6',
      },
    }
    
    const paymentObject = new (window as any).Razorpay(options)
    paymentObject.open()
  }
  
  return <Button onClick={handlePayment}>Pay Now</Button>
}
```

### Step 3: Verify Payment (Server Action)
```typescript
'use server'

import crypto from 'crypto'
import { createServerClient } from '@/lib/supabase/server'

export async function verifyPayment(data: {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}) {
  const text = `${data.razorpay_order_id}|${data.razorpay_payment_id}`
  
  const generated_signature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(text)
    .digest('hex')
  
  if (generated_signature !== data.razorpay_signature) {
    throw new Error('Payment verification failed')
  }
  
  // Update order status in database
  const supabase = createServerClient()
  await supabase
    .from('payments')
    .update({ status: 'completed' })
    .eq('transaction_id', data.razorpay_payment_id)
  
  return { success: true }
}
```

### Step 4: Webhook Handler (API Route)
```typescript
// app/api/webhook/razorpay/route.ts
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('x-razorpay-signature')
  
  // Verify webhook signature
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(body)
    .digest('hex')
  
  if (signature !== expectedSignature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }
  
  const event = JSON.parse(body)
  
  // Handle different event types
  switch (event.event) {
    case 'payment.captured':
      // Update payment status
      break
    case 'payment.failed':
      // Handle failed payment
      break
    case 'refund.created':
      // Handle refund
      break
  }
  
  return NextResponse.json({ received: true })
}
```

## Git Commit Convention

```
feat: Add product filtering
fix: Resolve cart total calculation
refactor: Simplify checkout flow
docs: Update component inventory
style: Format pricing components
```

---

**Remember**: These workflows prevent duplicate work and maintain code quality.
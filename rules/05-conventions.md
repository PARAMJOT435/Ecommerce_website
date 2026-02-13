# Coding Conventions & Standards

## File Naming

### Components
- **File name**: `kebab-case` (e.g., `product-card.tsx`)
- **Component name**: `PascalCase` (e.g., `ProductCard`)
- **Match them**: File `product-card.tsx` exports `ProductCard`

### Utilities & Functions
- **File name**: `kebab-case` (e.g., `format-price.ts`)
- **Function name**: `camelCase` (e.g., `formatPrice`)

### Types
- **File name**: `kebab-case` (e.g., `product-types.ts`)
- **Type/Interface name**: `PascalCase` (e.g., `Product`, `ProductWithImages`)

### Server Actions
- **File name**: `kebab-case` (e.g., `cart-actions.ts`)
- **Action name**: `camelCase` with verb prefix (e.g., `addToCart`, `removeFromCart`)

---

## Import Conventions

### Use Path Aliases
**ALWAYS use `@/` for imports**, never relative paths beyond one level.

```typescript
// ✅ CORRECT
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"
import { Product } from "@/types/products"

// ❌ WRONG
import { Button } from "../../components/ui/button"
import { formatPrice } from "../../../lib/utils"
```

### Import Order
```typescript
// 1. External dependencies
import { useState } from 'react'
import Image from 'next/image'

// 2. Internal dependencies (absolute paths)
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'

// 3. Types
import type { Product } from '@/types/products'

// 4. Relative imports (only if necessary)
import { LocalComponent } from './local-component'
```

### Named vs Default Exports

**Prefer Named Exports** for components:
```typescript
// ✅ PREFERRED
export function ProductCard({ ... }) {
  // ...
}

// ❌ AVOID (except for pages)
export default function ProductCard({ ... }) {
  // ...
}
```

**Use Default Exports** for:
- Next.js pages (`page.tsx`)
- Next.js layouts (`layout.tsx`)
- API routes (`route.ts`)

---

## TypeScript Standards

### Strict Mode
TypeScript strict mode is **enabled**. All code must:
- Have explicit return types for functions
- Avoid `any` type
- Use proper null checks

### Type Definitions

#### Interface vs Type
```typescript
// ✅ Use Interface for objects
interface Product {
  id: string
  name: string
  price: number
}

// ✅ Use Type for unions, intersections
type ProductStatus = 'active' | 'inactive' | 'archived'
type ProductWithImages = Product & { images: ProductImage[] }
```

#### Props Interfaces
```typescript
// ✅ CORRECT - Props suffix
interface ProductCardProps {
  product: Product
  onAddToCart?: (productId: string) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  // ...
}
```

#### Avoid Inline Types
```typescript
// ❌ AVOID
export function ProductCard({ 
  product 
}: { 
  product: { id: string; name: string; price: number } 
}) {
  // ...
}

// ✅ CORRECT
interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  // ...
}
```

### Type Inference
```typescript
// ✅ Let TypeScript infer when obvious
const products = await supabase.from('products').select('*')

// ✅ Explicit when not obvious
const getProduct = async (id: string): Promise<Product | null> => {
  // ...
}
```

### Enums vs Union Types
```typescript
// ✅ PREFER Union Types
type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered'

// ❌ AVOID Enums (unless needed for reverse mapping)
enum OrderStatus {
  Pending = 'pending',
  Processing = 'processing',
  // ...
}
```

---

## Component Structure

### Component File Template
```typescript
// 1. Imports
import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types/products'

// 2. Types/Interfaces
interface ProductCardProps {
  product: Product
  variant?: 'default' | 'compact'
  onAddToCart?: (productId: string) => void
}

// 3. Component
export function ProductCard({ 
  product, 
  variant = 'default',
  onAddToCart 
}: ProductCardProps) {
  // 3a. Hooks
  const [isLoading, setIsLoading] = useState(false)
  
  // 3b. Handlers
  const handleAddToCart = async () => {
    setIsLoading(true)
    await onAddToCart?.(product.id)
    setIsLoading(false)
  }
  
  // 3c. Render logic
  const displayPrice = formatPrice(product.price)
  
  // 3d. Return
  return (
    <div className="product-card">
      {/* JSX */}
    </div>
  )
}

// 4. Sub-components (if any, for this component only)
function ProductBadge({ label }: { label: string }) {
  return <span>{label}</span>
}
```

### Destructuring Props
```typescript
// ✅ CORRECT - Destructure in parameters
export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return <div>{product.name}</div>
}

// ❌ AVOID - Using props object
export function ProductCard(props: ProductCardProps) {
  return <div>{props.product.name}</div>
}
```

### Optional Chaining
```typescript
// ✅ Use optional chaining for potentially undefined values
const imageUrl = product.images?.[0]?.image_url

// ✅ Nullish coalescing for defaults
const displayName = product.name ?? 'Untitled Product'
```

---

## Styling Conventions

### Tailwind Class Organization
```typescript
// ✅ CORRECT - Organize by category
<div className="
  flex items-center justify-between
  w-full max-w-md
  px-4 py-2
  bg-white rounded-lg shadow
  hover:shadow-lg
  transition-shadow
">
```

### Using cn() Utility
```typescript
import { cn } from '@/lib/utils'

// ✅ CORRECT - Conditional classes
<Button 
  className={cn(
    "base-classes",
    variant === 'primary' && "primary-classes",
    isActive && "active-classes"
  )}
/>
```

### Component Variants with CVA
```typescript
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md",
  {
    variants: {
      variant: {
        default: "bg-primary text-white",
        outline: "border border-input bg-background",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

---

## Function & Variable Naming

### Functions
```typescript
// ✅ Verbs for actions
const handleClick = () => { }
const formatPrice = (price: number) => { }
const getUserById = async (id: string) => { }

// ✅ Boolean functions with is/has/should
const isActive = (product: Product) => product.is_active
const hasDiscount = (product: Product) => product.discount > 0
const shouldShowBadge = () => { }
```

### Variables
```typescript
// ✅ Descriptive names
const filteredProducts = products.filter(...)
const totalPrice = items.reduce(...)

// ❌ Single letter (except in short loops/maps)
const p = products // Bad
const f = filteredProducts // Bad

// ✅ Exception: Short arrow functions
products.map(p => p.name) // OK
```

### Constants
```typescript
// ✅ UPPER_SNAKE_CASE for true constants
const MAX_CART_ITEMS = 50
const DEFAULT_CURRENCY = 'USD'

// ✅ Regular naming for config objects
const stripeConfig = {
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
}
```

---

## Comments & Documentation

### When to Comment
```typescript
// ✅ Complex business logic
// Calculate tax based on user's state and product category
const calculateTax = (product: Product, state: string) => {
  // ...
}

// ✅ Non-obvious workarounds
// HACK: Stripe webhook sometimes sends duplicate events
// Dedupe using the event ID stored in Redis
const handleWebhook = async (event: StripeEvent) => {
  // ...
}

// ❌ Don't state the obvious
// Set loading to true
setIsLoading(true) // Bad comment
```

### JSDoc for Public APIs
```typescript
/**
 * Formats a price value into a currency string
 * @param amount - The numeric price amount
 * @param currency - ISO currency code (default: 'USD')
 * @returns Formatted price string (e.g., "$10.00")
 */
export function formatPrice(
  amount: number, 
  currency: string = 'USD'
): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}
```

### TODO Comments
```typescript
// TODO: Add product comparison feature
// TODO(username): Optimize this query for large datasets
// FIXME: Handle edge case when product has no images
```

---

## Error Handling

### Try-Catch Blocks
```typescript
// ✅ CORRECT - Specific error handling
async function addToCart(productId: string) {
  try {
    const result = await supabase.from('cart_items').insert(...)
    return { success: true, data: result }
  } catch (error) {
    console.error('Failed to add to cart:', error)
    return { success: false, error: 'Failed to add item to cart' }
  }
}

// ❌ AVOID - Silent failures
async function addToCart(productId: string) {
  try {
    await supabase.from('cart_items').insert(...)
  } catch (error) {
    // Silent failure - bad!
  }
}
```

### Form Validation Errors
```typescript
// ✅ User-friendly messages
const errors = {
  email: 'Please enter a valid email address',
  password: 'Password must be at least 8 characters',
}

// ❌ Technical jargon
const errors = {
  email: 'RegEx validation failed',
  password: 'String length < 8',
}
```

---

## Async/Await Conventions

```typescript
// ✅ CORRECT - Async/await for readability
const fetchProducts = async () => {
  const { data } = await supabase.from('products').select('*')
  return data
}

// ❌ AVOID - Promise chains (unless necessary)
const fetchProducts = () => {
  return supabase
    .from('products')
    .select('*')
    .then(({ data }) => data)
}
```

---

## Environment Variables

### Naming Convention
```bash
# Public (client-side accessible)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Private (server-side only)
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
```

### Accessing Variables
```typescript
// ✅ With validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL')
}

// ✅ Or use a config file
// lib/config.ts
export const config = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  },
} as const
```

---

## Testing Conventions

### File Naming
```
component-name.tsx
component-name.test.tsx  // Unit tests
component-name.spec.tsx  // Integration tests
```

### Test Structure
```typescript
describe('ProductCard', () => {
  it('renders product name', () => {
    // Arrange
    const product = { id: '1', name: 'Test Product', price: 10 }
    
    // Act
    render(<ProductCard product={product} />)
    
    // Assert
    expect(screen.getByText('Test Product')).toBeInTheDocument()
  })
})
```

---

## Git Commit Messages

### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring
- `style`: Formatting, missing semicolons, etc.
- `docs`: Documentation
- `test`: Adding tests
- `chore`: Maintenance

### Examples
```
feat(cart): Add quantity picker component

Implemented a reusable quantity picker with increment/decrement buttons.
Includes validation for min/max values.

Closes #123
```

```
fix(checkout): Resolve Stripe payment intent creation error

Fixed an issue where payment intents were created with invalid amount.
Now properly converts to cents before sending to Stripe.
```

---

**Remember**: Consistency is more important than individual preferences. Follow these conventions for maintainable code.

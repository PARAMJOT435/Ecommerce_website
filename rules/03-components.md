# Component Inventory

> **Purpose**: This file maintains a registry of all custom components in the project. Check here BEFORE creating new components.
> **Design System**: All components MUST follow the design system defined in `rules/06-design-system.md` and `rules/07-design-quick-ref.md`
> 
> **FOR AGENTS**: After creating ANY component, you MUST update this file with:
> - ✅ Checkmark next to the component name
> - Component location (file path)
> - Props interface
> - Use case description
> - Example usage code

## Table of Contents
- [Shadcn UI Components](#shadcn-ui-components)
- [Layout Components](#layout-components)
- [Feature Components](#feature-components)
- [Form Components](#form-components)
- [Utility Components](#utility-components)

---

## Shadcn UI Components

### Installed Components
Location: `components/ui/`

These are installed via CLI. **DO NOT recreate manually**.

```bash
# To add a new Shadcn component:
npx shadcn@latest add [component-name]
```

**Currently Installed**:
- [x] `button` - All button variants
- [x] `card` - Card containers
- [x] `input` - Text inputs
- [x] `label` - Form labels
- [x] `select` - Dropdown selects
- [x] `dialog` - Modal dialogs
- [x] `dropdown-menu` - Dropdown menus
- [x] `badge` - Status badges
- [x] `avatar` - User avatars
- [x] `separator` - Divider lines
- [x] `skeleton` - Loading skeletons
- [x] `sonner` - Toast notifications (replaced deprecated `toast`)
- [x] `tabs` - Tab navigation
- [x] `accordion` - Collapsible sections
- [x] `checkbox` - Checkboxes
- [x] `radio-group` - Radio buttons
- [x] `slider` - Range sliders
- [x] `switch` - Toggle switches
- [x] `textarea` - Multi-line inputs
- [x] `form` - Form wrapper with validation

**To check if installed**: Look in `components/ui/` directory

---

## Layout Components

### `<Container />`
- **Location**: `components/ui/container.tsx`
- **Use Case**: Central wrapper for page content to ensure max-width and padding
- **Props**:
  ```typescript
  {
    children: React.ReactNode
    className?: string
  }
  ```
- **Example**:
  ```tsx
  <Container>
    <h1>Page Title</h1>
  </Container>
  ```

### `<AppShell />`
- **Location**: `components/layout/app-shell.tsx`
- **Use Case**: Main wrapper for dashboard/account pages
- **Props**:
  ```typescript
  {
    children: React.ReactNode
    showSidebar?: boolean // default: true
  }
  ```
- **Contains**: Sidebar, Header, Main content area
- **Example**:
  ```tsx
  <AppShell>
    <YourPageContent />
  </AppShell>
  ```

### `<Header />`
- **Location**: `components/layout/header.tsx`
- **Use Case**: Top navigation bar with cart, search, user menu
- **Props**: None (uses global state)
- **Features**: 
  - Logo/brand
  - Search bar
  - Cart icon with count
  - User authentication dropdown
- **Dependencies**: `Container`, `Button`, `Input`, `Sheet` (Shadcn)

### `<Footer />`
- **Location**: `components/layout/footer.tsx`
- **Use Case**: Site footer with links and info
- **Props**: None
- **Contains**: 
  - Company info
  - Social links
  - Newsletter signup
  - Legal links

### `<Sidebar />`
- **Location**: `components/layout/sidebar.tsx`
- **Use Case**: Dashboard/account navigation
- **Props**:
  ```typescript
  {
    activePath?: string
  }
  ```

---

## Feature Components

### Homepage Components

#### `<Hero />`
- **Location**: `components/features/home/hero.tsx`
- **Use Case**: Homepage main banner
- **Dependencies**: `Container`, `Button`

#### `<FeaturedProducts />`
- **Location**: `components/features/home/featured-products.tsx`
- **Use Case**: Display curated product list
- **Props**:
  ```typescript
  {
    products: Product[]
    title?: string
    description?: string
    linkText?: string
    linkHref?: string
  }
  ```

#### `<TrustBadges />`
- **Location**: `components/features/home/trust-badges.tsx`
- **Use Case**: Key selling points section
- **Props**: None

### Product Components

### `<ProductCard />`
- **Location**: `components/features/product/product-card.tsx`
- **Use Case**: Display product in grid/list views
- **Props**:
  ```typescript
  {
    product: Product
    variant?: 'default' | 'compact' | 'featured'
  }
  ```
- **Features**:
  - Product image
  - Title, price
  - Rating display
  - Quick add to cart button
  - Wishlist toggle

### `<ProductGrid />`
- **Location**: `components/features/product/product-grid.tsx`
- **Use Case**: Grid layout for product lists
- **Props**:
  ```typescript
  {
    products: Product[]
    columns?: 2 | 3 | 4 // default: 3
  }
  ```

#### `<ProductDetails />`
- **Location**: `components/features/product/product-details.tsx`
- **Use Case**: Full product page content
- **Props**:
  ```typescript
  {
    product: Product & { images: ProductImage[], variants: ProductVariant[] }
  }
  ```
- **Features**:
  - Image carousel
  - Variant selector
  - Quantity picker
  - Add to cart
  - Ingredient list
  - Certification badges

#### `<ProductFilters />`
- **Location**: `components/features/product/product-filters.tsx`
- **Use Case**: Filter sidebar for product listing
- **Props**:
  ```typescript
  {
    categories: Category[]
    priceRange: [number, number]
    onFilterChange: (filters: FilterState) => void
  }
  ```

### Cart Components

#### `<ProductHero />`
- **Location**: `components/features/product/product-hero.tsx`
- **Use Case**: Top section of product detail page with image gallery and actions
- **Props**:
  ```typescript
  {
    product: Product
  }
  ```

### `<CartDrawer />`
- **Location**: `components/features/cart/cart-drawer.tsx`
- **Use Case**: Slide-out cart preview
- **Props**: None (uses Zustand store)
- **Features**:
  - Mini cart items list
  - Subtotal
  - Checkout button
  - Continue shopping link

#### `<CartItem />`
- **Location**: `components/features/cart/cart-item.tsx`
- **Use Case**: Single item in cart
- **Props**:
  ```typescript
  {
    item: CartItem
    onUpdateQuantity: (quantity: number) => void
    onRemove: () => void
  }
  ```

#### `<CartSummary />`
- **Location**: `components/features/cart/cart-summary.tsx`
- **Use Case**: Order summary on cart/checkout pages
- **Props**:
  ```typescript
  {
    subtotal: number
    shipping: number
    tax: number
    discount?: number
    total: number
  }
  ```

### Checkout Components

#### `<CheckoutForm />`
- **Location**: `components/features/checkout/checkout-form.tsx`
- **Use Case**: Multi-step checkout process
- **Props**:
  ```typescript
  {
    cart: CartItem[]
    onComplete: (orderId: string) => void
  }
  ```
- **Steps**:
  1. Shipping address
  2. Payment method
  3. Order review

#### `<AddressForm />`
- **Location**: `components/features/checkout/address-form.tsx`
- **Use Case**: Address input form
- **Props**:
  ```typescript
  {
    initialData?: Address
    onSubmit: (address: Address) => void
  }
  ```

#### `<PaymentForm />`
- **Location**: `components/features/checkout/payment-form.tsx`
- **Use Case**: Razorpay checkout integration
- **Props**:
  ```typescript
  {
    amount: number
    currency?: string // default: 'INR'
    onSuccess: (paymentId: string, orderId: string) => void
  }
  ```

### Account/Dashboard Components

#### `<OrderHistory />`
- **Location**: `components/features/account/order-history.tsx`
- **Use Case**: List user's past orders
- **Props**:
  ```typescript
  {
    orders: Order[]
  }
  ```

#### `<SubscriptionManager />`
- **Location**: `components/features/account/subscription-manager.tsx`
- **Use Case**: Manage active subscriptions
- **Props**:
  ```typescript
  {
    subscriptions: Subscription[]
  }
  ```

### Review Components

#### `<ReviewList />`
- **Location**: `components/features/review/review-list.tsx`
- **Use Case**: Display product reviews
- **Props**:
  ```typescript
  {
    reviews: Review[]
    productId: string
  }
  ```

#### `<ReviewForm />`
- **Location**: `components/features/review/review-form.tsx`
- **Use Case**: Submit a product review
- **Props**:
  ```typescript
  {
    productId: string
    onSubmit: (review: ReviewData) => void
  }
  ```

---

## Form Components

### `<SearchBar />`
- **Location**: `components/forms/search-bar.tsx`
- **Use Case**: Product search input
- **Props**:
  ```typescript
  {
    placeholder?: string
    onSearch: (query: string) => void
  }
  ```

### `<NewsletterForm />`
- **Location**: `components/forms/newsletter-form.tsx`
- **Use Case**: Email newsletter signup
- **Props**:
  ```typescript
  {
    variant?: 'default' | 'minimal'
  }
  ```

### `<QuantityPicker />`
- **Location**: `components/forms/quantity-picker.tsx`
- **Use Case**: Increment/decrement quantity selector
- **Props**:
  ```typescript
  {
    value: number
    min?: number
    max?: number
    onChange: (value: number) => void
  }
  ```

---

## Utility Components

### `<LoadingSpinner />`
- **Location**: `components/ui/loading-spinner.tsx`
- **Use Case**: Loading indicator
- **Props**:
  ```typescript
  {
    size?: 'sm' | 'md' | 'lg'
  }
  ```

### `<EmptyState />`
- **Location**: `components/ui/empty-state.tsx`
- **Use Case**: Show when no data available
- **Props**:
  ```typescript
  {
    icon: LucideIcon
    title: string
    description?: string
    action?: React.ReactNode
  }
  ```

### `<PriceDisplay />`
- **Location**: `components/ui/price-display.tsx`
- **Use Case**: Formatted price with currency
- **Props**:
  ```typescript
  {
    amount: number
    currency?: string // default: 'INR'
    variant?: 'default' | 'large' | 'sale'
  }
  ```

### `<RatingDisplay />`
- **Location**: `components/ui/rating-display.tsx`
- **Use Case**: Star rating visualization
- **Props**:
  ```typescript
  {
    rating: number // 0-5
    showCount?: boolean
    reviewCount?: number // optional
    size?: 'sm' | 'md' | 'lg'
  }
  ```

### `<Badge />`
- **Location**: `components/ui/badge.tsx` (Shadcn)
- **Use Case**: Status indicators, tags, certifications
- **Variants**: `default`, `secondary`, `success`, `warning`, `error`
- **Custom variants** (add via cva):
  - `vegan` - Badge for vegan products

### `<CertificationBadge />`
- **Location**: `components/ui/certification-badge.tsx`
- **Use Case**: Display trust indicators/certifications
- **Props**:
  ```typescript
  {
    type: 'paraben-free' | 'sulfate-free' | 'cruelty-free' | 'gmp-certified' | 'natural'
  }
  ```

### `<ProductImage />`
- **Location**: `components/ui/product-image.tsx`
- **Use Case**: Standardized product image container
- **Props**:
  ```typescript
  {
    src: string
    aspectRatio?: 'square' | 'video' | 'portrait'
  }
  ```

---

## How to Add New Components

1. **Check this file first** - Component might already exist
2. **For Shadcn components**: Use CLI install
3. **For custom components**:
   - Create in appropriate directory
   - Add entry to this file
   - Export from index if in feature folder
4. **Update this file** when creating new components

## Component Naming Conventions

- **PascalCase** for component names
- **kebab-case** for file names
- **Prefix** feature components with feature name (e.g., `ProductCard`, `CartItem`)

---

**Last Updated**: February 2026 (Update this date when adding components)
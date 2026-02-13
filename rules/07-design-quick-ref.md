# Design System Quick Reference

> **For agents/developers**: Use this as a quick lookup when styling components.
> **Full documentation**: See `06-design-system.md`

## Common Patterns

### Colors

```tsx
// Primary Green (Main brand color - CTAs, links, emphasis)
className="bg-primary-500 text-white"
className="text-primary-600 hover:text-primary-700"

// Backgrounds
className="bg-white"           // Cards, content areas
className="bg-neutral-50"      // Page background
className="bg-neutral-100"     // Subtle sections

// Text
className="text-neutral-900"   // Primary text
className="text-neutral-700"   // Secondary text
className="text-neutral-500"   // Muted text

// Borders
className="border-neutral-200" // Default borders
className="border-primary-300" // Emphasized borders
```

### Typography

```tsx
// Headings
<h1 className="text-4xl font-heading font-semibold">
<h2 className="text-3xl font-heading font-semibold">
<h3 className="text-2xl font-heading font-semibold">
<h4 className="text-xl font-heading font-semibold">

// Body
<p className="text-base text-neutral-700">
<p className="text-sm text-neutral-600">  // Small text
<p className="text-xs text-neutral-500">  // Tiny text (captions)

// Price
<span className="text-2xl font-bold text-neutral-900">₹{price}</span>
```

### Spacing

```tsx
// Container padding
className="px-4 sm:px-6 lg:px-8"

// Section spacing
className="py-12 sm:py-16 lg:py-20"

// Card padding
className="p-4"  // Small card
className="p-6"  // Medium card
className="p-8"  // Large card

// Gaps in flex/grid
className="gap-4"  // Compact
className="gap-6"  // Standard (use this most)
className="gap-8"  // Spacious
```

### Buttons

```tsx
// Primary Button (Add to Cart, Buy Now)
<button className="
  bg-primary-500 hover:bg-primary-600
  text-white font-semibold
  px-6 py-3 rounded
  transition-all duration-200
  hover:-translate-y-0.5 hover:shadow-md
">
  Add to Cart
</button>

// Secondary Button (View Details)
<button className="
  bg-white hover:bg-primary-50
  text-primary-600 font-medium
  px-6 py-3 rounded
  border border-primary-300 hover:border-primary-500
  transition-colors duration-200
">
  View Details
</button>

// Ghost Button (Learn More)
<button className="
  bg-transparent hover:bg-neutral-100
  text-neutral-700 font-medium
  px-6 py-3 rounded
  transition-colors duration-200
">
  Learn More
</button>
```

### Cards (Product Cards, Info Cards)

```tsx
<div className="
  bg-white rounded-lg
  border border-neutral-200
  p-4 shadow-sm
  transition-all duration-300
  hover:-translate-y-1 hover:shadow-lg hover:border-primary-300
">
  {/* Card content */}
</div>
```

### Product Grid

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {products.map(product => (
    <ProductCard key={product.id} product={product} />
  ))}
</div>
```

### Badges

```tsx
// Certification Badge (Paraben Free, Sulfate Free)
<div className="
  inline-flex items-center gap-2
  px-3 py-1 rounded-full
  bg-primary-100 text-primary-700
  text-xs font-medium
">
  <CheckCircle className="w-4 h-4" />
  Paraben Free
</div>

// Category Badge
<span className="badge badge-primary">Hair Care</span>
// Available variants: badge-primary, badge-success, badge-warning

// Stock Status
<span className="text-sm text-success">In Stock</span>
<span className="text-sm text-warning">Low Stock</span>
<span className="text-sm text-error">Out of Stock</span>
```

### Product Images

```tsx
<div className="
  aspect-square rounded-2xl overflow-hidden
  bg-neutral-50
  relative
">
  <Image
    src={product.image_url}
    alt={product.name}
    fill
    className="object-cover hover:scale-105 transition-transform duration-300"
  />
</div>
```

### Certification Icons Display

```tsx
<div className="flex items-center gap-4">
  {/* Paraben Free */}
  <div className="cert-badge">
    <Leaf className="cert-badge-icon" />
    <span className="cert-badge-label">Paraben<br/>Free</span>
  </div>
  
  {/* Sulfate Free */}
  <div className="cert-badge">
    <Droplet className="cert-badge-icon" />
    <span className="cert-badge-label">Sulfate<br/>Free</span>
  </div>
  
  {/* No Animal Testing */}
  <div className="cert-badge">
    <Heart className="cert-badge-icon" />
    <span className="cert-badge-label">No Animal<br/>Testing</span>
  </div>
</div>
```

### Shadows

```tsx
className="shadow-sm"    // Subtle (default for cards)
className="shadow-md"    // Medium (hover states)
className="shadow-lg"    // Large (modals, popovers)
className="shadow-xl"    // Extra large (hero sections)
```

### Border Radius

```tsx
className="rounded"      // 4px - Buttons, inputs
className="rounded-lg"   // 8px - Cards
className="rounded-2xl"  // 16px - Product images
className="rounded-full" // Pills, circular badges
```

### Transitions

```tsx
// Standard transitions
className="transition-colors duration-200"     // For color changes
className="transition-all duration-300"        // For multiple properties
className="transition-transform duration-300"  // For transforms only

// Hover effects
className="hover:-translate-y-1"  // Lift on hover
className="hover:scale-105"       // Scale on hover
```

## Category Colors (Use Sparingly)

```tsx
// Hair Care - Primary Green (default)
className="bg-primary-100 text-primary-700"

// Intimate Hygiene - Teal
className="bg-teal-100 text-teal-700"

// Skin Care - Orange
className="bg-orange-100 text-orange-700"

// Sanitary Products - Lime
className="bg-lime-100 text-lime-700"

// Premium Products (24k Gold) - Gold
className="bg-gold-100 text-gold-700"
```

## Responsive Breakpoints

```tsx
// Mobile first approach
className="text-sm sm:text-base lg:text-lg"
className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
className="px-4 sm:px-6 lg:px-8"
className="py-8 sm:py-12 lg:py-16"

// Breakpoints:
// sm: 640px   (small tablets, large phones landscape)
// md: 768px   (tablets)
// lg: 1024px  (desktop)
// xl: 1280px  (large desktop)
```

## Icons

```tsx
import { ShoppingCart, Heart, User, Search, Star, Check } from 'lucide-react'

// Standard icon sizes
<Icon className="w-4 h-4" />  // Small (in badges, small buttons)
<Icon className="w-5 h-5" />  // Medium (default)
<Icon className="w-6 h-6" />  // Large (emphasis)
<Icon className="w-8 h-8" />  // Extra large (certification badges)

// Icon with text
<button className="inline-flex items-center gap-2">
  <ShoppingCart className="w-5 h-5" />
  <span>Add to Cart</span>
</button>
```

## Focus States (Accessibility)

```tsx
// Already handled globally in globals.css
// But for custom focus:
className="focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
```

## Common Component Classes

```tsx
// Container wrapper
<div className="container-custom">
  {/* Max-width container with responsive padding */}
</div>

// Product grid
<div className="product-grid">
  {/* Auto-responsive grid: 1 col mobile, 2 tablet, 3 desktop */}
</div>

// Card with hover
<div className="card-hover">
  {/* Includes hover lift + shadow */}
</div>

// Gradient text (for special headings)
<h1 className="text-gradient">
  {/* Green gradient text */}
</h1>
```

## Examples

### Product Card
```tsx
<div className="bg-white rounded-lg border border-neutral-200 p-4 shadow-sm hover:-translate-y-1 hover:shadow-lg hover:border-primary-300 transition-all duration-300">
  {/* Product Image */}
  <div className="aspect-square rounded-2xl overflow-hidden bg-neutral-50 mb-4">
    <Image src={image} alt={name} fill className="object-cover" />
  </div>
  
  {/* Product Info */}
  <h3 className="text-lg font-semibold text-neutral-900 mb-2">{name}</h3>
  <p className="text-sm text-neutral-600 mb-3">{description}</p>
  
  {/* Certifications */}
  <div className="flex gap-2 mb-3">
    <span className="badge badge-primary">Paraben Free</span>
    <span className="badge badge-primary">Sulfate Free</span>
  </div>
  
  {/* Price & CTA */}
  <div className="flex items-center justify-between">
    <span className="text-2xl font-bold text-neutral-900">₹{price}</span>
    <button className="bg-primary-500 hover:bg-primary-600 text-white font-semibold px-4 py-2 rounded transition-colors">
      Add to Cart
    </button>
  </div>
</div>
```

---

**Remember**: Consistency is key. Always use the defined colors, spacing, and patterns from this design system.

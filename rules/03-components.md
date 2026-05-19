# Component Inventory

This file tracks all reusable UI components and sections built for the project to prevent duplication.

## UI Components (`/components/ui/`)

| Component | Props Interface | Use Case | Status |
| :--- | :--- | :--- | :--- |
| `Button` | Standard HTML Button + `variant`, `size`, `asChild` | All interactive buttons | ✅ |
| `Input` | Standard HTML Input | All text/email/password inputs | ✅ |
| `Label` | Standard HTML Label | Form labels | ✅ |
| `Container` | `children`, `className` | Constrains width of content blocks | ✅ |
| `Logo` | `className`, `iconSize`, `textSize`, `animate`, `bgClass` | Displays the MMW gear badge | ✅ |

## Form Components (`/components/forms/`)

| Component | Props Interface | Use Case | Status |
| :--- | :--- | :--- | :--- |
| `NewsletterForm` | None | Footer newsletter subscription | ✅ |

## Layout Components (`/components/layout/`)

| Component | Props Interface | Use Case | Status |
| :--- | :--- | :--- | :--- |
| `Header` | `user`, `isAdmin` | Main site navigation bar | ✅ |
| `Footer` | None | Main site footer | ✅ |
| `AppShell` | `children`, `user`, `isAdmin` | Wrapper for Admin/Dashboard pages | ✅ |
| `InitialLoader`| None | 2-second splash screen on hard reload | ✅ |

## Feature Components (`/components/features/`)

### Home (`/home/`)
| Component | Props Interface | Use Case | Status |
| :--- | :--- | :--- | :--- |
| `Hero` | None | Homepage top banner w/ video | ✅ |
| `HeroScrollSnap`| None | Custom auto-scroller for Hero reveal | ✅ |
| `FeaturedProducts`| `products`, `wishlistIds`, `title`, etc | Displays product grid on homepage | ✅ |
| `TrustBadges` | None | Displays security/trust logos | ✅ |

### Product (`/product/`)
| Component | Props Interface | Use Case | Status |
| :--- | :--- | :--- | :--- |
| `ProductGrid` | `products`, `wishlistIds` | Grid layout for products | ✅ |
| `ProductCard` | `product`, `wishlistIds` | Individual product display card | ✅ |
| `ProductFilters`| `categories` | Sidebar filters for products page | ✅ |

### Search (`/search/`)
| Component | Props Interface | Use Case | Status |
| :--- | :--- | :--- | :--- |
| `SearchBar` | `className`, `autoFocus`, `onSearch` | Input field that routes to `/products` | ✅ |
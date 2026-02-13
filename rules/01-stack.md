# Tech Stack & Constraints

## Framework
- **Next.js 15** (App Router)
- **React 19**
- **TypeScript** (strict mode enabled)

## Styling

### Tailwind CSS v4
**CRITICAL RULES**:
- **NO `tailwind.config.js`** - Configuration is in `app/globals.css` using `@theme` blocks
- Use new v4 syntax:
  ```css
  @import "tailwindcss";
  
  @theme {
    --color-brand-50: #f0f9ff;
    --color-brand-500: #3b82f6;
    /* etc */
  }
  ```

### Key Tailwind v4 Changes
- Use `size-*` utilities instead of `w-* h-*` where appropriate
- Use CSS variables for colors: `bg-brand-500` instead of `bg-blue-500`
- Container queries: use `@container` directives
- New arbitrary value syntax improvements

## UI Library

### Shadcn UI
**INSTALLATION RULE**:
```bash
npx shadcn@latest add [component-name]
```

**DO NOT**:
- Write Shadcn primitives manually (Button, Input, Card, etc.)
- Copy-paste Shadcn code from documentation
- Modify core Shadcn logic unless adding variants

**DO**:
- Use the CLI to add components
- Extend with custom variants using `cva`
- Compose Shadcn primitives into custom components

### Icons
- **Lucide React** for all icons
- Import like: `import { ShoppingCart, User } from "lucide-react"`

## Database & Backend

### Supabase
**Client Configuration**:
```typescript
import { createClient } from '@supabase/supabase-js'

// For client components
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// For server components/actions
import { createServerClient } from '@supabase/ssr'
```

**Type Generation**:
```bash
npx supabase gen types typescript --project-id [project-id] > types/database.types.ts
```

**RLS Policy Rules**:
- Never bypass RLS in production
- Use service role key ONLY for admin operations in server actions
- Test all queries with authenticated and unauthenticated states

### Database Schema
- Reference: `supabase-schema.sql` in project root
- All tables use UUID primary keys
- Timestamps are `TIMESTAMPTZ`
- Use `auth.uid()` for RLS policies

## Payment Processing

### Razorpay
- Use Razorpay Node SDK v2+
- Server-side webhook handling with signature verification
- Store minimal payment data (transaction IDs, order IDs, not card details)
- Support for UPI, Cards, Net Banking, Wallets

## Authentication
- **Supabase Auth** (built-in)
- Email/password + magic links
- OAuth providers: Google, GitHub (configurable)

## Form Handling
- **React Hook Form** + **Zod** for validation
- Server Actions for form submissions

## State Management

### Client State
- **Zustand** for global client state (cart, UI preferences)
- Persist to localStorage for cart

### Server State
- **TanStack Query (React Query)** for API data caching
- Use Supabase real-time subscriptions where needed

## File Upload
- **Supabase Storage**
- Buckets: `product-images`, `blog-images`, `user-avatars`
- Use public buckets with RLS for read access

## Environment Variables

Required in `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

NEXT_PUBLIC_RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=

NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Package Versions (Minimum)
```json
{
  "next": "^15.0.0",
  "react": "^19.0.0",
  "tailwindcss": "^4.0.0",
  "@supabase/supabase-js": "^2.45.0",
  "@supabase/ssr": "^0.5.0",
  "razorpay": "^2.9.0",
  "zod": "^3.22.0",
  "react-hook-form": "^7.50.0",
  "zustand": "^4.5.0",
  "@tanstack/react-query": "^5.0.0"
}
```

## Build & Deployment
- **Vercel** (recommended for Next.js)
- Edge runtime for API routes where possible
- Image optimization via Next.js `<Image />`

---

**Last Updated**: February 2026
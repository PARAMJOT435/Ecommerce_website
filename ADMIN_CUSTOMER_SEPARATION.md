# Admin & Customer Feature Separation

## Overview
This implementation ensures that admin users cannot accidentally access or interact with customer-only features, eliminating confusing error messages when testing with admin accounts.

## What Changed

### 1. New API Endpoint
- **File**: `app/api/auth/check-admin/route.ts`
- **Purpose**: Client-side check to determine if the logged-in user is an admin
- **Usage**: Called from customer-facing pages to detect admin status

### 2. New Utility Function
- **File**: `app/actions/utils.ts`
- **Function**: `isUserAdmin()`
- **Purpose**: Server-side admin check that returns boolean instead of throwing errors

### 3. New Component
- **File**: `components/features/admin/admin-access-restriction.tsx`
- **Purpose**: Displays a user-friendly message when admins try to access customer features
- **Features**:
  - Clear explanation of the restriction
  - Icon and styling for visual clarity
  - Button to navigate to admin dashboard
  - Customizable messages

## Protected Customer Features

### Pages with Server-Side Redirects (Immediate)
These pages redirect admins to `/admin/dashboard` before any rendering:

1. **Account Pages** (`/account/*`)
   - File: `app/(account)/layout.tsx`
   - All account pages (orders, wishlist, addresses, settings)
   - Admins are redirected immediately

2. **Checkout** (`/checkout`)
   - File: `app/(marketing)/checkout/page.tsx`
   - Admins cannot proceed to checkout
   - Redirects to admin dashboard

### Pages with Client-Side Warnings (Graceful Degradation)
These pages show warnings and disable interactions for admins:

1. **Cart Page** (`/cart`)
   - File: `app/(marketing)/cart/page.tsx`
   - Shows admin restriction message
   - Allows viewing but blocks cart operations

2. **Product Page** (`/products/[slug]`)
   - File: `components/features/product/product-hero.tsx`
   - Shows warning banner above Add to Cart
   - Disables Add to Cart button for admins
   - Disables quantity selector for admins

## How It Works

### Server-Side Check (Faster, More Secure)
```typescript
// In layout or page files
const { data: admin } = await supabase
    .from('admins')
    .select('id')
    .eq('id', user.id)
    .single()

if (admin) {
    redirect('/admin/dashboard')
}
```

### Client-Side Check (For Dynamic Pages)
```typescript
// In client components
useEffect(() => {
    const checkAdmin = async () => {
        const response = await fetch('/api/auth/check-admin')
        const data = await response.json()
        setIsAdmin(data.isAdmin)
    }
    checkAdmin()
}, [])

if (isAdmin) {
    return <AdminAccessRestriction />
}
```

## User Experience

### Scenario 1: Admin visits `/account/orders`
1. Page server-side checks if user is admin
2. Detects admin status
3. Redirects to `/admin/dashboard` (URL changes)
4. User never sees the account page

### Scenario 2: Admin visits `/products/[slug]`
1. Page loads (product pages are public)
2. ProductHero component loads with admin check
3. Shows warning banner: "Admin Access Detected"
4. Add to Cart button is disabled
5. Quantity selector is disabled

### Scenario 3: Admin clicks "Add to Cart" on product
1. Button is disabled - click does nothing
2. Tooltip shows: "Admin accounts cannot add items to cart"
3. No error message or console error

### Scenario 4: Admin visits `/cart`
1. Page loads
2. Client-side admin check runs
3. Shows: "Shopping Cart - The shopping cart is designed for customers only"
4. Clear call-to-action: "Go to Admin Dashboard"

## Admin Restrictions Summary

| Feature | Admin Access | Behavior |
|---------|-------------|----------|
| Product Browsing | ✅ Allowed | Can view product details |
| Add to Cart | ❌ Blocked | Button disabled with tooltip |
| Shopping Cart | ❌ Blocked | Redirected to admin dashboard |
| Checkout | ❌ Blocked | Redirected to admin dashboard |
| Account Pages | ❌ Blocked | Redirected to admin dashboard |
| Wishlist | ❌ Blocked | Redirected to admin dashboard |
| Order History | ❌ Blocked | Redirected to admin dashboard |
| B2B Quotes | ✅ Allowed | Can submit quotes for testing |

## Testing

### To Test as Admin:
1. Log in with admin account
2. Navigate to `/products` - should work fine
3. Click on a product - should see warning
4. Try to add to cart - button should be disabled
5. Try to access `/cart` - should be redirected
6. Try to access `/account/orders` - should be redirected

### To Test as Customer:
1. Log in with customer account
2. Everything should work normally
3. No warnings or restrictions

### To Test the API Endpoint:
```bash
# Check admin status
curl http://localhost:3000/api/auth/check-admin
# Response: { "isAdmin": true } or { "isAdmin": false }
```

## Benefits

1. **No Confusing Errors** - Admins won't see cryptic error messages
2. **Seamless Workflow** - Clear communication about feature restrictions
3. **Professional** - No ugly database errors in front of clients
4. **Helpful UI** - Guides admins to where they should be
5. **Consistent** - Same behavior across all customer-facing features

## Future Enhancements

1. Add logging when admins try to access customer features
2. Create dedicated test accounts for admins to test customer flows
3. Add feature flag system for enabling/disabling features per user type
4. Create admin documentation about customer feature restrictions

## Files Modified/Created

- ✅ `app/api/auth/check-admin/route.ts` (NEW)
- ✅ `components/features/admin/admin-access-restriction.tsx` (NEW)
- ✅ `app/actions/utils.ts` (UPDATED - added isUserAdmin)
- ✅ `app/(marketing)/cart/page.tsx` (UPDATED)
- ✅ `app/(account)/layout.tsx` (UPDATED)
- ✅ `components/features/product/product-hero.tsx` (UPDATED)

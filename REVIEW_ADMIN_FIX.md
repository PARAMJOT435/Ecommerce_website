# Admin Review Submission Fix

## Problem
When admins tried to submit a review on a product, they got this error:
```
insert or update on table "reviews" violates foreign key constraint "reviews_user_id_fkey"
```

## Root Cause
- Admin accounts exist in `auth.users` and `admins` tables
- Admin accounts do NOT have entries in the `public.users` table
- The `reviews` table has a foreign key constraint that references `users(id)`
- When an admin tries to insert a review with their `user_id`, the foreign key check fails because that `user_id` doesn't exist in `users` table

## Solution Implemented

### 1. Product Page (`app/(marketing)/products/[slug]/page.tsx`)
- Added admin detection on the server side
- Updated `isLoggedIn` to check: `!!user && !isAdmin`
- This prevents ReviewForm from even showing for admins

### 2. Reviews Action (`app/actions/reviews.ts`)
- Added server-side validation in `submitReview()` function
- Checks if user is an admin before allowing review submission
- Returns helpful error: "Admin accounts cannot submit reviews. Reviews are for customers only."
- This provides an extra layer of security

### 3. Review Form Component (`components/features/reviews/review-form.tsx`)
- Component already had logic to hide form for non-logged-in users
- Now also hides when admins are logged in (via `isLoggedIn` prop)

## How It Works

**When Customer Visits Product:**
1. Product page checks: user exists AND user is not admin
2. `isLoggedIn = true`
3. ReviewForm shows and works normally

**When Admin Visits Product:**
1. Product page checks: user exists AND user is not admin
2. `isLoggedIn = false`
3. ReviewForm shows login prompt: "Log in to write a review"
4. If admin somehow bypasses UI and calls API, server returns error

## Multiple Layers of Protection

1. **UI Layer**: ReviewForm not shown to admins
2. **Server Action Layer**: submitReview() explicitly rejects admins
3. **Database Layer**: Foreign key constraint still exists as backup

## Testing

### Test as Admin:
1. Log in with admin account
2. Go to any product page
3. Scroll to reviews section
4. "Log in to write a review" message should show
5. Even if you try to submit manually, you'll get error: "Admin accounts cannot submit reviews"

### Test as Customer:
1. Log in with customer account
2. Go to product page
3. Reviews section should have full form
4. Can submit reviews normally

## Files Updated
- ✅ `app/(marketing)/products/[slug]/page.tsx` - Added admin check on server
- ✅ `app/actions/reviews.ts` - Added admin validation in submitReview
- ✅ `components/features/reviews/review-form.tsx` - No changes needed (works via isLoggedIn prop)

## Notes
- This follows the same pattern as cart, checkout, and account pages
- Admins are prevented from accessing customer-only features
- Clear error messages guide users appropriately
- Database foreign key constraint remains as final safety check

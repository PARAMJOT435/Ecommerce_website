# Verified Purchase Reviews System

## Overview
Implemented a review system that only allows customers to write reviews for products they have purchased AND received (order status = 'delivered'). This ensures authentic, verified purchase reviews.

## Requirements Enforced

A customer can only write a review if ALL conditions are met:
1. ✅ User is logged in
2. ✅ User is NOT an admin
3. ✅ User has an order containing this product
4. ✅ That order belongs to the user
5. ✅ The order status is 'delivered'

If any condition fails, user sees an appropriate message.

## Implementation

### 1. Server-Side Check (Product Page)
**File**: `app/(marketing)/products/[slug]/page.tsx`

- Queries `order_items` + `orders` to check if user has purchased and received the product
- Sets `isLoggedIn = true` only if ALL conditions pass
- Runs on page load before ReviewForm renders

### 2. Review Action Validation (Server Action)
**File**: `app/actions/reviews.ts`

Added comprehensive checks in `submitReview()`:
```typescript
// Check user has ordered AND received this product
const { data: deliveredOrder } = await supabase
    .from('order_items')
    .select(`order:orders(id, user_id, status)`)
    .eq('product_id', productId)
    .single()

// Verify user owns the order
if (deliveredOrder.order.user_id !== user.id) {
    return { error: 'You can only review products you have ordered' }
}

// Verify order is delivered
if (deliveredOrder.order.status !== 'delivered') {
    return { error: `You can only review products after delivery. Current order status: ${status}` }
}
```

This prevents bypassing UI checks.

### 3. Client-Side API Endpoint
**File**: `app/api/reviews/check-eligibility/route.ts`

- Called by ReviewForm component to determine eligibility
- Returns: `{ isLoggedIn, hasPurchased, isDelivered, orderStatus }`
- Used to show appropriate message to user

### 4. Review Form Component
**File**: `components/features/reviews/review-form.tsx`

Updated to show different messages based on user status:

| Status | Message | Action |
|--------|---------|--------|
| Not Logged In | "Log in to write a review" | Link to login |
| Not Purchased | "You must purchase this product to write a review" | Can't review |
| Not Delivered | "You can review once order is delivered" | Can't review yet |
| Admin | "Admin accounts cannot submit reviews" | Can't review |
| Eligible | Review form shown | Can write review |

## User Experience

### Scenario 1: New Visitor
→ See: "Log in to write a review"
→ Action: Click to log in

### Scenario 2: Logged-in but Never Purchased
→ See: "You must purchase this product to write a review. Only verified buyers can share their experience."
→ Action: Can view reviews but not write

### Scenario 3: Purchased but Not Delivered Yet
→ Order status: 'pending', 'processing', or 'shipped'
→ See: "You can write a review once your order has been delivered. Come back after receiving your product!"
→ Action: Wait for delivery

### Scenario 4: Purchased and Delivered ✅
→ See: Full review form with star rating, title, and comment
→ Action: Write and submit review

### Scenario 5: Already Reviewed
→ See: "You have already reviewed this product"
→ Action: Can view their review but not add another

## Database Queries

### Check if user can review (one query):
```sql
SELECT 
    oi.id,
    o.id as order_id,
    o.user_id,
    o.status
FROM order_items oi
JOIN orders o ON o.id = oi.order_id
WHERE oi.product_id = 'PRODUCT_ID'
LIMIT 1
```

Then verify:
- `order.user_id === current_user.id`
- `order.status === 'delivered'`

### Review submission validation query:
```sql
SELECT 
    oi.id,
    o.id, o.user_id, o.status
FROM order_items oi
JOIN orders o ON o.id = oi.order_id
WHERE oi.product_id = 'PRODUCT_ID' 
AND o.user_id = 'USER_ID'
AND o.status = 'delivered'
LIMIT 1
```

## Security & Validation

**Three-layer protection:**

1. **UI Layer**: ReviewForm checks eligibility before showing form
2. **API Layer**: check-eligibility endpoint validates conditions
3. **Server Action Layer**: submitReview() re-validates everything

**Why three layers?**
- Prevents UI bypass (user changing code)
- Prevents direct API calls
- Database constraints as final fallback

## Order Status Values

Valid order statuses from schema:
- `pending` - Order placed, awaiting payment
- `processing` - Order payment received
- `shipped` - Order in transit
- `delivered` - ✅ Order received (eligible for review)
- `cancelled` - Order was cancelled
- `refunded` - Order refunded

Only `delivered` status allows reviews.

## Error Messages

Clear, actionable messages for each scenario:

1. "You must have ordered this product to write a review"
2. "You can only review products you have ordered"
3. "You can only review products after delivery. Current order status: {status}"
4. "You have already reviewed this product"
5. "Admin accounts cannot submit reviews. Reviews are for customers only."

## Testing

### Test Case 1: Non-Purchased User
1. Log in with different customer account
2. Go to product page
3. Verify see: "You must purchase this product"
4. Try calling API → Error

### Test Case 2: Purchased but Pending
1. Create order with status 'pending'
2. Visit product page
3. Verify see: "Wait for delivery"
4. Try calling API → Error

### Test Case 3: Purchased and Delivered ✅
1. Create order with status 'delivered'
2. Visit product page
3. Verify review form appears
4. Fill out form and submit
5. Review appears in reviews section

### Test Case 4: Try to Review Twice
1. After writing first review
2. Visit same product page
3. Try to write another review
4. Verify: "You have already reviewed this product"

## Files Modified/Created

- ✅ `app/(marketing)/products/[slug]/page.tsx` - Added purchase verification
- ✅ `app/actions/reviews.ts` - Added server-side validation
- ✅ `components/features/reviews/review-form.tsx` - Added eligibility states
- ✅ `app/api/reviews/check-eligibility/route.ts` - New endpoint

## Future Enhancements

1. Show review eligibility date based on expected delivery
2. Send email reminder when order delivered: "Ready to review!"
3. Show customer: "You can review once delivered" on product page before purchase
4. Track review rate per product
5. Incentivize reviews (badges, points)
6. Allow editing reviews within X days of delivery

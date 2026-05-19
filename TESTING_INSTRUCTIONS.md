# Testing Instructions - Final Fixes

## Quick Test (5 minutes)

### Test 1: Toast Position
1. Go to `/products`
2. Click "Add to Cart" on any product
3. **Check:** Toast appears at TOP-LEFT
4. **Check:** Toast doesn't cover "Go to Cart" or "Checkout" buttons in sidebar

### Test 2: Review Once Only
1. Go to product detail page `/products/[slug]`
2. Scroll down to review section
3. Submit a review (1-5 stars, title, comment)
4. Page reloads automatically ✓
5. Scroll down again
6. **Check:** See green box "Already Reviewed"
7. **Check:** Review form is hidden

### Test 3: Product Card Shows Rating
1. Go back to products page `/products`
2. Find the product you reviewed
3. **Check:** Product card shows rating (green badge with stars)
4. **Check:** Shows count like "1 Rating & 1 Review"

---

## Complete Testing Flow

### Setup
- You need a **delivered order** with at least one product
- Log in with the account that placed the order

### Test Scenario 1: First Review

**Step 1: Navigate to Products**
- Go to `/products`
- Find a product from a delivered order

**Step 2: Open Product Detail**
- Click the product name or card
- Should see product details

**Step 3: Scroll to Review Section**
- Look for "Write a Review" form
- Should NOT see "Already Reviewed" message yet

**Step 4: Submit Review**
1. Select star rating (1-5)
2. Enter review title (e.g., "Great product!")
3. Enter review comment (required)
4. Click "Submit Review"
5. **Check:** Page reloads automatically
6. **Check:** Toast appears at top-left saying "Review submitted!"

**Step 5: Verify Rating Shows**
1. Page reloaded, scroll to review section again
2. **Check:** See green box "Already Reviewed" message
3. **Check:** Review form is gone
4. Go back to products page
5. **Check:** Product card shows your rating

### Test Scenario 2: Try to Review Again

**Step 1: Go Back to Same Product**
- From products page, click the same product

**Step 2: Check Review Section**
- Scroll to review section
- **Check:** See green "Already Reviewed" message
- **Check:** "You have already submitted a review for this product"
- **Check:** No form shown

**Step 3: Try Different Product from Same Order**
- Go to products page
- Find another product from the same order
- Open it
- **Check:** Can review (no "Already Reviewed" message)
- Submit review

### Test Scenario 3: Toast Position

**Step 1: Open Any Product**
- Go to `/products` or product detail

**Step 2: Add to Cart**
- Click "Add to Cart" button
- **Check:** Sidebar opens on right
- **Check:** Toast appears at TOP-LEFT screen
- **Check:** Toast says "✓ [Product name] added to cart"

**Step 3: Verify Buttons Visible**
- In sidebar, look for "Go to Cart" and "Checkout"
- **Check:** These buttons are NOT covered by toast
- **Check:** Buttons are fully clickable
- **Check:** Can click them easily

---

## Expected Behavior

### For New Users (No Review Yet)
```
Product Detail Page
↓
Scroll to Review Section
↓
See: ✓ "Write a Review" form is visible
     ✓ Star rating selector shows
     ✓ Title and comment fields visible
     ✓ "Submit Review" button enabled
```

### For Users Who Already Reviewed
```
Product Detail Page
↓
Scroll to Review Section
↓
See: ✓ Green box with message
     ✓ "Already Reviewed"
     ✓ "You have already submitted a review..."
     ✓ Form is HIDDEN/GONE
```

### For Toast Notification
```
Click "Add to Cart"
↓
Toast appears TOP-LEFT
↓
See: ✓ Toast at top-left corner
     ✓ Message: "✓ [Product] added to cart"
     ✓ Green checkmark icon
     ✓ Sidebar opened on right
     ✓ "Go to Cart" button visible
     ✓ "Checkout" button visible
     ✓ Toast does NOT overlap buttons
```

### For Product Card Rating
```
After submitting review:
↓
Page reloads automatically
↓
Go back to products page
↓
Find product in grid
↓
See: ✓ Rating badge (green with stars)
     ✓ "⭐ 5.0 • 1 Rating & 1 Review"
     ✓ Rating persists on page refresh
```

---

## Troubleshooting

### Toast Not at Top-Left?
- Check `app/layout.tsx` has `position="top-left"`
- Hard refresh page (Ctrl+Shift+R)
- Check browser console for errors

### Can Review Multiple Times?
- Check user is logged in correctly
- Check order status is "delivered"
- Try hard refresh (Ctrl+Shift+R)
- Check browser console for errors

### Rating Doesn't Show on Card?
- Make sure to submit review completely
- Check page reloaded after submission
- Go back to products page (not cached)
- Hard refresh if needed

### Already Reviewed Message Not Showing?
- Make sure you're looking at the same product
- Try hard refresh
- Check API call in network tab

---

## Network Calls to Verify

### When Submitting Review
Watch browser Network tab:
- [ ] POST to `/api/reviews` or similar
- [ ] Returns 200 OK
- [ ] Response shows success

### When Loading Product Card
- [ ] GET to `/api/products/[id]/reviews`
- [ ] Response has `average` and `count`
- [ ] Count is > 0 if rated

### When Checking Eligibility
- [ ] GET to `/api/reviews/check-eligibility?productId=[id]`
- [ ] Returns `hasReviewed: true` if already reviewed
- [ ] Returns `hasReviewed: false` if not reviewed

---

## Database Verification

### Check Review Saved
Open database and run:
```sql
SELECT * FROM reviews 
WHERE user_id = 'your-user-id' 
AND product_id = 'product-id'
```

Should show:
- Your review
- Correct rating (1-5)
- `is_approved = true`
- Recent timestamp

### Check Duplicate Prevention
Try to insert duplicate:
- Same user_id
- Same product_id
- Should fail with error (constraint violation)

---

## Final Verification Checklist

Before going live, verify:

- [ ] Toast appears at top-left
- [ ] Toast doesn't block buttons
- [ ] Can review product (first time)
- [ ] Can't review again (already reviewed message)
- [ ] Product card shows rating after review
- [ ] Rating persists on page refresh
- [ ] Green "Already Reviewed" message shows
- [ ] Page reloads after review submission
- [ ] No errors in browser console
- [ ] No errors in server logs

---

**All tests passing?** ✅ Ready for production!

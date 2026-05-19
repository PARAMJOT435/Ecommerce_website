# Task 15: Complete Testing Guide

## ISSUE 1: Settings Profile Data Not Persisting ✅ FIXED

### Test Steps:

**Step 1: First-Time Profile Entry**
1. Login to your account
2. Go to `/account/settings`
3. Click "Edit" button in Profile Information section
4. Fill in:
   - First Name: `John`
   - Last Name: `Doe`
   - Phone: `9876543210`
5. (Optional) Upload a profile picture
6. Click "Review Changes"
7. Verify the confirmation dialog shows your changes
8. Click "Confirm Changes"
9. Wait for success toast message

**Step 2: Verify Data Persists**
1. Refresh the page (F5 or Cmd+R)
2. Click "Edit" button again
3. ✅ **VERIFY:** Fields should show:
   - First Name: `John` (NOT "Not set")
   - Last Name: `Doe` (NOT "Not set")
   - Phone: `9876543210` (NOT "Not set")

**Step 3: Update Profile Data**
1. Change values:
   - First Name: `Jane`
   - Phone: `9123456789`
2. Click "Review Changes"
3. Click "Confirm Changes"
4. Refresh page
5. Click "Edit" again
6. ✅ **VERIFY:** New values are saved:
   - First Name: `Jane`
   - Phone: `9123456789`

**What Was Fixed:**
- Before: Profile data fetched from server only on component mount, updates were local only
- After: After each save, profile is re-fetched from server and state is refreshed
- Result: Data now persists across page reloads

---

## ISSUE 2: Checkout Address FK Constraint Error ✅ FIXED

### The Error You Were Getting:
```
Address error: insert or update on table "addresses" violates foreign key constraint "addresses_user_id_fkey"
```

### What This Meant:
The system couldn't link the address to your user account because the user_id wasn't being saved correctly.

### Verification Test:

**Step 1: First Checkout (Fresh)**
1. Go to `/products` and add any product to cart
2. Go to `/cart`
3. Click "Proceed to Checkout"
4. You should see the address form (since no addresses saved yet)
5. Fill in address:
   - Full Name: `John Doe`
   - Address Line 1: `123 Main Street`
   - City: `Mumbai`
   - State: `Maharashtra`
   - PIN Code: `400001`
   - Phone: `9876543210`
6. ✅ **CHECK:** The "Save this address for future use" checkbox should appear
7. Check the checkbox
8. Proceed through review and payment
9. ✅ **VERIFY:** Order completes successfully (NO FK ERROR)

**Step 2: Verify Address Was Saved**
1. Go to `/account/addresses`
2. ✅ **VERIFY:** Your address from checkout now appears in the list
3. You can edit or delete it from here

---

## ISSUE 3: Address Management in Checkout ✅ IMPLEMENTED

### Test Scenario: First Checkout

**Step 1: Add Product to Cart**
1. Go to `/products`
2. Choose any product and add to cart
3. Go to `/cart`
4. Click "Proceed to Checkout"

**Step 2: First Address Entry**
1. You see the address form (no saved addresses yet)
2. Fill address fields:
   - Full Name: `Alice Smith`
   - Address Line 1: `Flat 204, Tower A`
   - Address Line 2: `Colaba`
   - City: `Mumbai`
   - State: `Maharashtra`
   - PIN Code: `400005`
   - Phone: `9988776655`
3. ✅ Check box: "Save this address for future use"
4. Click "Continue to Review"
5. Review order details
6. Click "Continue to Payment"
7. Click "Place Order"
8. ✅ **VERIFY:** Order success message appears

**Step 3: Verify Address Saved in Account**
1. After order, go to `/account/addresses`
2. ✅ **VERIFY:** The address you entered is now listed
3. Click Edit - make a change - Save
4. ✅ **VERIFY:** Changes persist

---

### Test Scenario: Second Checkout (Address Selection)

**After First Checkout:**

**Step 1: Add Different Product**
1. Go to `/products`
2. Choose a different product
3. Add to cart and go to checkout

**Step 2: Address Selection Screen**
1. ✅ **VERIFY:** You now see address selection screen
2. Your previously saved address shows as an option:
   - `Alice Smith`
   - `Flat 204, Tower A, Colaba`
   - `Mumbai, Maharashtra — 400005`
3. It's automatically selected (blue highlight)
4. ✅ Option: "+ Add New Address" button appears at bottom

**Step 3: Option A - Use Saved Address**
1. Keep the saved address selected
2. Click "Continue to Review"
3. ✅ **VERIFY:** Review shows your saved address
4. Complete the order

**Step 4: Option B - Add Different Address**
1. Go back to checkout (add product again, go to cart)
2. On address selection screen, click "+ Add New Address"
3. Form appears for new address:
   - Full Name: `Bob Johnson`
   - Address Line 1: `Offset Bldg, 5th Floor`
   - City: `Bangalore`
   - State: `Karnataka`
   - PIN Code: `560034`
   - Phone: `9111222333`
4. ✅ Check: "Save this address for future use"
5. Click "Continue to Review"
6. Complete order

**Step 5: Verify Both Addresses Saved**
1. Go to `/account/addresses`
2. ✅ **VERIFY:** Both addresses now appear:
   - Alice Smith's Mumbai address
   - Bob Johnson's Bangalore address

**Step 6: Test Edit/Delete**
1. Click "Edit" on one address
2. Change a detail, click Save
3. ✅ **VERIFY:** Change persists
4. On another address, click "Delete"
5. Confirm deletion
6. ✅ **VERIFY:** Address removed from list

---

## Test Summary Checklist

### Settings Page
- [ ] Profile data fills in on edit
- [ ] Profile data persists after refresh
- [ ] Profile picture uploads
- [ ] Password change requires current password
- [ ] All confirmations work properly

### Checkout Address Flow
- [ ] First checkout shows form (no addresses yet)
- [ ] Can save address with checkbox
- [ ] Saved address appears in account/addresses
- [ ] Second checkout shows saved address selection
- [ ] Can select saved address
- [ ] Can add new address
- [ ] New address saves with checkbox
- [ ] Multiple addresses all appear in selection

### Address Management
- [ ] Addresses appear in `/account/addresses`
- [ ] Can edit addresses
- [ ] Can delete addresses
- [ ] Can set default address
- [ ] Edits persist

### FK Constraint
- [ ] ✅ **NO "addresses_user_id_fkey" ERROR** appears
- [ ] All addresses save successfully
- [ ] No database errors in console

---

## Expected Behavior After Fixes

### Settings Page
**Before Fix:** "Not set" shows for all fields even after save
**After Fix:** Fields show previously entered data

### Checkout
**Before Fix:** FK constraint error when saving address
**After Fix:** Address saves successfully, appears in account

### Address Selection
**Before Fix:** Simple form, no save option
**After Fix:** Selection screen with saved addresses, option to save new ones

---

## What to Report If Issues Still Occur

1. **Settings still shows "Not set"**
   - Check browser console for errors
   - Clear browser cache and try again
   - Check if `getProfile()` returns data

2. **Address still gets FK error**
   - Check if you're logged in
   - Check Supabase project > Authentication > Users
   - Verify your user ID exists in the `users` table

3. **Addresses not appearing in list**
   - Check `/account/addresses` page
   - Try a page refresh
   - Check browser network tab for API errors

---

## Database Queries to Verify (Advanced)

If you have Supabase dashboard access:

**Check Your User Record:**
```sql
SELECT * FROM users WHERE email = 'your@email.com';
```

**Check Your Addresses:**
```sql
SELECT * FROM addresses WHERE user_id = 'your-user-id';
```

**Check FK Constraint:**
```sql
SELECT constraint_name 
FROM information_schema.table_constraints 
WHERE table_name = 'addresses' AND constraint_type = 'FOREIGN KEY';
```

All should show successful results with your data.


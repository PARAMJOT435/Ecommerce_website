# Product Cards - Quick Start Guide

## TL;DR

Product cards now show **real specs** and **real ratings** instead of hardcoded data.

## What You See on Each Card

```
┌─────────────────────────┐
│ ☐ Add to Compare    ✕   │  ← Checkbox + Wishlist
│                         │
│    [Product Image]      │  ← Main image
│                         │
│ Product Name            │  ← Title
│ ⭐ 4.2 • 25 Ratings    │  ← Rating (only if reviews exist)
│                         │
│ • Spec 1                │  ← First 4 specs
│ • Spec 2                │  ← (only if specs exist)
│ • Spec 3                │
│ • Spec 4                │
│                         │
│ ₹64,690                 │  ← Price
│ Only 2 left             │  ← Stock warning
│                         │
│ [    Add to Cart    ]   │  ← Full-width button
└─────────────────────────┘
```

## How to Add Product Specs

### Step 1: Go to Admin
Admin → Products → Edit Product

### Step 2: Find "Technical Specifications" Field

Scroll down to find this section.

### Step 3: Enter JSON Format

Copy-paste this format and fill in your details:

```json
{
  "Processor": "Intel Core i5 (12th Gen)",
  "RAM": "16 GB",
  "Storage": "512 GB SSD",
  "Display": "15.6 inch FHD"
}
```

**Key points:**
- Must be valid JSON
- Use double quotes: `"key": "value"`
- Separate entries with commas
- No trailing comma after last entry

### Step 4: Save

Click Save. Done!

## Specs by Product Type

### Laptop
```json
{
  "Processor": "Intel Core i7",
  "RAM": "16 GB DDR5",
  "Storage": "512 GB SSD",
  "Display": "15.6 inch 4K"
}
```

### Power Drill
```json
{
  "Motor": "18V Lithium-ion",
  "Torque": "1500 RPM",
  "Battery": "2.0 Ah",
  "Weight": "1.2 kg"
}
```

### Angle Grinder
```json
{
  "Wheel Size": "125mm",
  "Motor": "850W",
  "Speed": "12000 RPM",
  "Power": "230V AC"
}
```

### Refrigerator
```json
{
  "Capacity": "345 Liters",
  "Type": "Double Door",
  "Energy Rating": "5 Star",
  "Compressor": "Inverter"
}
```

### Microwave Oven
```json
{
  "Capacity": "20L",
  "Wattage": "800W",
  "Type": "Solo Microwave",
  "Warranty": "2 Years"
}
```

## How Ratings Work

### Customers Add Reviews
1. After ordering, customer waits for delivery
2. Once delivered, can leave review
3. Rates 1-5 stars
4. Adds optional comment

### Admin Approves
1. Sees pending reviews
2. Approves or rejects
3. Approved reviews count toward rating

### Card Shows Rating
- Once 1+ reviews approved
- Shows average star rating
- Shows count of reviews
- Example: "⭐ 4.2 • 25 Ratings & 25 Reviews"

**Important:** Rating only shows if reviews exist!

## What Gets Displayed

### Always Shows ✅
- Product name
- Product image
- Price
- Add to Cart button
- Wishlist button
- Compare checkbox

### Shows If Specs Exist ✅
- First 4 specifications
- As bullet points

### Shows If Reviews Exist ✅
- Average rating (⭐ X.X)
- Number of ratings
- Number of reviews

### Shows If Low Stock ✅
- "Only X left" (when 5 or fewer)

### Shows If Out of Stock ✅
- "Out of Stock" badge
- Button disabled

## Common Issues

### Specs Not Showing?
**Problem:** Added specs but they don't show on card

**Solution:**
1. Check JSON format is valid
   - Use this to test: `jsonlint.com`
   - Copy your JSON there
   - If errors, fix them
2. Edit product again
3. Make sure all fields have values
4. Don't leave any empty strings
5. Save and refresh page

### Rating Not Showing?
**Problem:** Product has reviews but rating doesn't show

**Solution:**
1. Check if reviews are approved
   - Pending reviews don't count
2. Make sure reviews have valid ratings (1-5)
3. Refresh the page
4. Check API in browser dev tools:
   - Go to `/api/products/[product-id]/reviews`
   - Should return JSON with `average` and `count`

### JSON Format Errors

**Wrong:**
```json
{
  Processor: "Intel Core i5",  // ❌ Missing quotes
  "RAM": "16 GB",
  "Storage": "512 GB SSD",  // ❌ Trailing comma
}
```

**Right:**
```json
{
  "Processor": "Intel Core i5",
  "RAM": "16 GB",
  "Storage": "512 GB SSD"
}
```

**Tools to help:**
- Use online JSON validator: `jsonlint.com`
- VS Code has built-in JSON validation
- ChatGPT can validate for you

## Files Changed

| File | What Changed |
|------|--------------|
| `components/features/product/product-card.tsx` | Complete redesign |
| `app/api/products/[id]/reviews/route.ts` | NEW - Fetches ratings |
| `app/(marketing)/cart/page.tsx` | Bug fix |
| `app/(marketing)/products/[slug]/page.tsx` | Bug fix |
| `app/actions/reviews.ts` | Bug fix |
| `app/api/reviews/check-eligibility/route.ts` | Bug fix |

## Before vs After

### Before (Old)
```
[Image]
Product Name
4.2 ★ (fake)
• Intel Core i5
• 16 GB DDR4 RAM
• Windows 11
• 512 GB SSD
(hardcoded for all products)
₹64,690 ₹85,000 (30% off - fake)
[Only 1 left - fake]
[Add to Cart]
```

### After (New)
```
[Checkbox] Add to Compare    [♡]
      [Product Image]
Product Name
(rating section - ONLY IF REAL REVIEWS)
• Spec 1 (from your data)
• Spec 2 (from your data)
• Spec 3 (from your data)
• Spec 4 (from your data)
(specs section - ONLY IF DATA EXISTS)
₹64,690
Only 2 left (real stock)
[Add to Cart]
```

## Testing

**Step 1: Add specs to a product**
1. Go to admin
2. Edit a product
3. Add specifications JSON
4. Save

**Step 2: View on products page**
1. Go to /products
2. Find the product
3. Check that specs appear on card

**Step 3: Check rating (optional)**
1. Have customers add reviews
2. Admin approves reviews
3. Check that rating shows on card

## Mobile View

Card is fully responsive:
- Desktop: Normal card layout
- Tablet: Slightly adjusted spacing
- Mobile: Stacks nicely, full-width button

## That's It!

You're all set. Just add specs to your products and let the system handle the rest. 🚀

---

**Still need help?**
- Check `PRODUCT_CARDS_UPDATE.md` for detailed docs
- Check `PRODUCT_CARD_SPECS.md` for advanced setup
- Review the component code: `components/features/product/product-card.tsx`

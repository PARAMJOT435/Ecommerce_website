# Product Card - Smart Display System

## Overview

Product cards now display **real product specifications** and **actual ratings** based on your data, not hardcoded values.

## How It Works

### 1. **Product Specifications**
- Specs are stored as **JSON** in the `specifications` field of each product
- Only first 4 specs are shown on the card (to keep it clean)
- Empty/null specs are automatically filtered out
- Works for ANY product type (laptops, angle grinders, power tools, etc.)

### 2. **Product Ratings**
- Ratings are fetched from the `reviews` table
- Only **approved reviews** are counted
- If no reviews exist, rating section is **hidden** (not shown)
- Displays: average rating, number of ratings, and number of reviews

## Adding Specs to Products

### Via Admin Panel

1. Go to **Admin → Products**
2. Create/Edit a product
3. Scroll to **"Technical Specifications (JSON format)"** field
4. Enter specs as valid JSON:

```json
{
  "Processor": "Intel Core i5 (12th Gen)",
  "RAM": "16 GB DDR4",
  "Storage": "512 GB SSD",
  "Display": "15.6 inch FHD",
  "Battery": "50 Wh Li-ion",
  "Weight": "1.85 kg"
}
```

### Examples by Product Type

**Laptop:**
```json
{
  "Processor": "Intel Core i5 (12th Gen)",
  "RAM": "16 GB DDR4",
  "Storage": "512 GB SSD",
  "Display": "15.6 inch FHD"
}
```

**Power Drill:**
```json
{
  "Motor": "18V Lithium-ion",
  "Torque": "1500 RPM",
  "Battery": "2.0 Ah Li-ion",
  "Chuck": "13mm Keyless",
  "Weight": "1.2 kg"
}
```

**Angle Grinder:**
```json
{
  "Wheel Size": "125mm",
  "Motor": "850W",
  "Speed": "12000 RPM",
  "Power Input": "230V AC",
  "Weight": "2.1 kg"
}
```

**Refrigerator:**
```json
{
  "Capacity": "345 Liters",
  "Type": "Double Door",
  "Energy Rating": "5 Star",
  "Compressor": "Inverter Technology",
  "Dimensions": "65.5 x 68.8 x 172.8 cm"
}
```

## Product Ratings

### How Ratings Are Calculated

1. **Reviews** are fetched from the database
2. Only **approved reviews** are counted
3. **Average rating** = sum of all ratings / number of reviews
4. Shows up to 1 decimal place (e.g., 4.2 stars)

### How Customers Add Reviews

1. Customer purchases product
2. Goes to their **Order History**
3. Clicks **"Leave Review"** on the order
4. Writes rating + comment
5. Review is **pending approval**
6. Admin approves it (or auto-approve based on settings)
7. Rating appears on product card

### Admin Review Management

- Go to **Admin → Reviews** (if implemented)
- Approve/reject customer reviews
- Only approved reviews count toward the card

## What's Displayed on Cards

### Always Shown
✅ Product name  
✅ Product image  
✅ First 4 specifications (if they exist)  
✅ Price  
✅ Stock status (if low: "Only 2 left")  
✅ Add to Cart button  
✅ Add to Compare checkbox  
✅ Wishlist button  

### Only Shown If Data Exists
✅ **Ratings** - Only if 1+ approved reviews exist  
✅ **Specs** - Only if specs are added to the product  

### Never Shown (Removed)
❌ Fake ratings/reviews  
❌ Hardcoded specs  
❌ Fake discount percentages  
❌ Fake bank offers  

## API Endpoint

### GET `/api/products/[id]/reviews`

Returns the average rating for a product:

```json
{
  "average": 4.2,
  "count": 25,
  "reviewCount": 25
}
```

- **average**: Average rating (0 if no reviews)
- **count**: Number of reviews
- **reviewCount**: Same as count (for flexibility)

## Example Product Setup

### Step 1: Create Product
1. Go to Admin → Products → New
2. Fill in:
   - Name: "ASUS VivoBook 15"
   - Price: ₹64,690
   - Stock: 5
   - Specifications:
   ```json
   {
     "Processor": "Intel Core i5 (15th Gen)",
     "RAM": "16 GB DDR4",
     "Storage": "512 GB SSD",
     "Display": "15.6-inch FHD"
   }
   ```

### Step 2: Upload Image
1. Upload product image

### Step 3: Customers Leave Reviews
1. After purchase, customers can leave reviews (1-5 stars)
2. Reviews need admin approval

### Step 4: Rating Shows on Card
1. Once 1+ reviews are approved, rating badge appears
2. Card shows: "4.2 ★ 25 Ratings & 25 Reviews"

## Styling

Product card features:
- Clean, professional layout
- Compare checkbox (for bulk compare feature)
- Green rating badge (★)
- Bullet-point spec display
- Full-width Add to Cart button
- Low stock warning (if 5 or fewer items)

## Code Files

- **Component**: `/components/features/product/product-card.tsx`
- **API**: `/app/api/products/[id]/reviews/route.ts`
- **Product Form**: `/app/admin/products/_components/product-form.tsx` (handles specs input)

## Troubleshooting

### Specs not showing?
1. Check if specs are added in product edit form
2. Verify JSON is valid (use JSON validator)
3. Check that values aren't empty strings

### Rating not showing?
1. Ensure reviews exist in database
2. Check that reviews have `is_approved = true`
3. At least 1 approved review needed to show rating

### Wrong specs showing?
1. Edit product → Specifications field
2. Fix JSON format
3. Save

## Future Enhancements

Possible additions:
- Compare multiple products side-by-side
- Filter by specifications
- Spec-based search
- Customer rating on product detail page
- Review count in product detail

---

**Ready to go!** 🚀  
Add specs to your products and watch the cards display real data instead of hardcoded values.

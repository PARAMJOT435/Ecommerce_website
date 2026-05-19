# B2B Quotes System Implementation

## Overview
The B2B quotes system has been fully implemented to allow customers to request quotes for high-ticket industrial machinery and allow admins to manage those requests.

## Components Implemented

### 1. Quote Actions (`app/actions/quotes.ts`)
Server-side actions for handling quote operations:
- **submitQuote()** - Inserts a new quote request into the database
- **getAdminQuotes()** - Fetches all quotes for the admin panel (with product relations)
- **updateQuoteStatus()** - Updates quote status (pending → responded)
- **deleteQuote()** - Removes a quote request

### 2. Quote Modal Component (`components/features/product/quote-modal.tsx`)
Client-side modal dialog for quote requests:
- Opens when a product is marked as `is_quote_only = true`
- Collects customer information (name, email, company, phone)
- Collects quote details (quantity, additional requirements)
- Submits data via `submitQuote()` server action
- Shows success/error toast notifications

### 3. Admin Quotes Page (`app/admin/quotes/page.tsx`)
Admin dashboard for managing quote requests:
- Displays all quotes in a table format
- Shows customer details, company, product, quantity
- Color-coded status badges (pending/responded)
- Fetches quotes server-side with product relations
- Responsive design for all screen sizes

### 4. Quote Actions Client (`app/admin/quotes/_components/quote-actions-client.tsx`)
Client component for individual quote actions:
- Dropdown menu for each quote row
- Reply to customer (opens email)
- Update status (pending → responded)
- Delete quote with confirmation

## Database Schema

The `quotes` table has the following columns:
```sql
id              UUID PRIMARY KEY
user_id         UUID (nullable, from users table)
product_id      UUID (references products)
name            TEXT NOT NULL (customer name)
company         TEXT
email           TEXT NOT NULL
phone           TEXT
quantity        INTEGER DEFAULT 1
message         TEXT (additional requirements)
status          TEXT CHECK (pending|reviewed|responded|rejected) DEFAULT 'pending'
created_at      TIMESTAMPTZ DEFAULT NOW()
updated_at      TIMESTAMPTZ DEFAULT NOW()
```

## How to Use

### For Customers:
1. Navigate to a product marked with `is_quote_only = true`
2. Instead of "Add to Cart", see "Request a Quote" button
3. Click to open the quote modal
4. Fill in your details and quantity
5. Submit the form
6. You'll receive a success notification that the sales team will contact you within 24 hours

### For Admins:
1. Go to Admin Panel → B2B Quotes
2. View all incoming quote requests in a table
3. For each quote, click the three-dot menu to:
   - Reply to the customer via email
   - Mark as "Responded" once you've sent pricing
   - Delete the quote request
4. Quotes are sorted by newest first

## Integration Points

### Product Page:
- Products with `is_quote_only = true` will show the quote button instead of add-to-cart
- Product details are captured when the quote is submitted

### Product Setup:
To make a product quote-only, set `is_quote_only = true` in the products table:
```sql
UPDATE products SET is_quote_only = true WHERE id = 'product_id';
```

## Status Workflow

```
pending → responded → (archived/deleted)
```

- **pending**: New quote request, not yet reviewed
- **responded**: Sales team has contacted the customer
- **reviewed**: (Optional status for internal use)
- **rejected**: Quote request was rejected

## Testing

1. Go to a quote-only product (like "Hydraulic Press Brake 100-Ton")
2. Click "Request a Quote"
3. Fill in the form and submit
4. Check the admin panel at `/admin/quotes`
5. Verify the quote appears with correct data
6. Test the dropdown actions (reply, status update, delete)

## Email Integration (Future)

Currently, the "Reply to Customer" option opens the user's default email client. To add automatic email notifications:

1. Add nodemailer or SendGrid to the project
2. Create an email notification in `submitQuote()` to notify admins of new quotes
3. Create automated response emails to customers
4. Track email status in the database

## Files Modified/Created

- **Created**: `app/actions/quotes.ts`
- **Created**: `app/admin/quotes/_components/quote-actions-client.tsx`
- **Modified**: `components/features/product/quote-modal.tsx` (added server action integration)
- **Modified**: `app/admin/quotes/page.tsx` (complete rewrite with working implementation)

## Notes

- Quotes are stored with customer contact information for follow-up
- No authentication required to submit a quote (B2B customers might not be logged in)
- Admin panel shows all quotes regardless of customer authentication status
- Quotes are permanently linked to products via foreign key

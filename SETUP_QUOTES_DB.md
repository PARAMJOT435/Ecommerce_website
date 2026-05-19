# Setting Up the Quotes Table in Supabase

## Problem
When trying to submit a quote, you get "Failed to send request" error. This is because the `quotes` table doesn't exist in your Supabase database yet.

## Solution
Follow these steps to create the table:

### Step 1: Open Supabase SQL Editor
1. Go to https://supabase.com/dashboard
2. Select your project (MMW Industrial)
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**

### Step 2: Copy & Paste the Migration
Copy the entire contents of `migrations/001_create_quotes_table.sql` and paste it into the SQL editor.

Or just run this directly:

```sql
-- Create the quotes table
CREATE TABLE IF NOT EXISTS public.quotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    company TEXT,
    email TEXT NOT NULL,
    phone TEXT,
    quantity INTEGER NOT NULL DEFAULT 1,
    message TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'responded', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_quotes_product_id ON public.quotes(product_id);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON public.quotes(status);
CREATE INDEX IF NOT EXISTS idx_quotes_created_at ON public.quotes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quotes_email ON public.quotes(email);

-- Add RLS but allow anonymous users to insert quotes
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

-- Anyone can insert a quote
CREATE POLICY "Anyone can submit a quote" ON public.quotes
    FOR INSERT
    WITH CHECK (true);

-- Anyone can view all quotes
CREATE POLICY "Anyone can view quotes" ON public.quotes
    FOR SELECT
    USING (true);

-- Users can update their own quotes
CREATE POLICY "Users can update own quotes" ON public.quotes
    FOR UPDATE
    USING (auth.uid() = user_id OR user_id IS NULL);

-- Users can delete their own quotes
CREATE POLICY "Users can delete own quotes" ON public.quotes
    FOR DELETE
    USING (auth.uid() = user_id OR user_id IS NULL);
```

### Step 3: Execute the Query
Click the **Run** button (or press Ctrl+Enter)

You should see: `Success. No rows returned.`

### Step 4: Verify the Table Was Created
Run this verification query:

```sql
SELECT * FROM information_schema.tables WHERE table_name = 'quotes';
```

You should see one row returned with `quotes` in the table_name column.

### Step 5: Test It Works
1. Go to your Next.js app
2. Navigate to a quote-only product (e.g., "Hydraulic Press Brake 100-Ton")
3. Click "Request a Quote"
4. Fill in the form and click "Submit Request"
5. You should see a success toast notification
6. Check the Admin Panel at `/admin/quotes` to see your quote

## Troubleshooting

### Still Getting "Failed to Send Request"?

1. **Check the browser console (F12 → Console tab)** - The error message should now be more specific
2. **Verify the product ID** - Make sure you're on a product page that exists
3. **Check for typos** - Ensure no spelling mistakes in table/column names
4. **Verify permissions** - Check that `unauthenticated` role has access to insert into quotes table

### If You See "Relation does not exist"
This means the table creation didn't work. Try again or contact Supabase support.

### If You See "Permission denied"
This means RLS policies need to be checked. Run the RLS setup commands again.

## What Each Column Does

- **id**: Unique identifier for each quote request
- **user_id**: Links to authenticated users (can be NULL for anonymous B2B customers)
- **product_id**: Links to the product being quoted on
- **name**: Customer's full name
- **company**: Customer's company name
- **email**: Customer's email for follow-up
- **phone**: Optional phone number
- **quantity**: How many units they want to quote
- **message**: Additional requirements/notes
- **status**: 'pending' (new), 'reviewed', 'responded' (contacted), 'rejected'
- **created_at**: When the quote was submitted
- **updated_at**: Last updated timestamp

## Need Help?
If you're still having issues, check:
1. Is the `products` table accessible? (quotes references it)
2. Do your products have the `is_quote_only` column set to `true`?
3. Are you in a quote-only product page when clicking the button?

-- ============================================================
-- QUOTES TABLE MIGRATION
-- Run this in your Supabase SQL Editor
-- ============================================================

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

-- Add RLS but allow anonymous (unauthenticated) users to insert and read their own quotes
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

-- Anyone can insert a quote (for B2B customers who might not be logged in)
CREATE POLICY "Anyone can submit a quote" ON public.quotes
    FOR INSERT
    WITH CHECK (true);

-- Anyone can view all quotes (for now - could be restricted later)
CREATE POLICY "Anyone can view quotes" ON public.quotes
    FOR SELECT
    USING (true);

-- Users can update their own quotes (if they have user_id)
CREATE POLICY "Users can update own quotes" ON public.quotes
    FOR UPDATE
    USING (auth.uid() = user_id OR user_id IS NULL);

-- Users can delete their own quotes
CREATE POLICY "Users can delete own quotes" ON public.quotes
    FOR DELETE
    USING (auth.uid() = user_id OR user_id IS NULL);

-- ============================================================
-- VERIFICATION
-- ============================================================
-- Run this query to verify the table was created:
-- SELECT * FROM information_schema.tables WHERE table_name = 'quotes';
-- Should return one row with the quotes table

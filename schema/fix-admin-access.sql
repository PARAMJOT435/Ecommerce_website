-- ============================================================
-- FIX ADMIN ACCESS (Allow Middleware to Check Role)
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Enable RLS on admins table (if not already enabled)
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- 2. Allow users to read their OWN record
-- This is necessary for:
--  a) Middleware to check `if (admin)`
--  b) Client-side checks
DROP POLICY IF EXISTS "Admins can view own record" ON admins;

CREATE POLICY "Admins can view own record" ON admins
FOR SELECT TO authenticated
USING (auth.uid() = id);

-- 3. (Optional) Triple-check that the user is actually in the table
-- You can verify this in the Table Editor, but this policy is the key fix.

-- Run this in your Supabase SQL Editor
-- This securely checks if an email exists without leaking other user data
CREATE OR REPLACE FUNCTION check_email_exists(lookup_email text)
RETURNS boolean AS $$
DECLARE
  email_exists boolean;
BEGIN
  -- We query the auth.users table because admins might not be in public.users
  -- The SECURITY DEFINER flag allows this function to bypass RLS and access auth.users
  SELECT EXISTS (
    SELECT 1 FROM auth.users WHERE email = lookup_email
  ) INTO email_exists;
  
  RETURN email_exists;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

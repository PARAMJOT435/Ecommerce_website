-- ============================================================
-- SECURE DATABASE FUNCTIONS
-- Fixes "Function Search Path Mutable" warnings
-- Sets search_path to 'public' to prevent path hijacking
-- ============================================================

-- 1. handle_new_user (Trigger Function)
ALTER FUNCTION public.handle_new_user() SET search_path = public;

-- 2. is_admin (Security Helper)
ALTER FUNCTION public.is_admin() SET search_path = public;

-- 3. update_updated_at_column (Trigger Function)
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;

-- 4. generate_order_number (Utility)
ALTER FUNCTION public.generate_order_number() SET search_path = public;

-- 5. check_product_stock (Trigger Function)
ALTER FUNCTION public.check_product_stock() SET search_path = public;

-- Note:
-- For "Leaked Password Protection Disabled", you must enable this
-- manually in your Supabase Dashboard:
-- Authentication -> Providers -> Email -> Password Protection

-- Optimizing RLS Policies & Strict Consolidation
-- Run this script in the Supabase SQL Editor
-- This script checks if tables exist before applying policies.
-- Updated to merge Admin and User policies to resolve "multiple permissive policies" warnings.

-- --------------------------------------------------------
-- 1. USERS
-- --------------------------------------------------------

DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'users') THEN
        -- Explicitly drop potential variations
        DROP POLICY IF EXISTS "Users can view own data" ON public.users;
        DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
        DROP POLICY IF EXISTS "Users can update own data" ON public.users;
        DROP POLICY IF EXISTS "Users can insert own data" ON public.users;
        DROP POLICY IF EXISTS "Users and Admins can view data" ON public.users; -- Cleanup precise name if re-running
        
        -- CREATE new optimized UNIFIED policies
        -- View: User owns it OR Admin
        CREATE POLICY "Users and Admins can view data" ON public.users
            FOR SELECT USING (
                ((select auth.uid()) = id) 
                OR 
                (select is_admin())
            );

        -- Update: User owns it (Admins usually don't update user profiles directly via RLS, but if needed we can add OR)
        -- Warning only mentioned SELECT for users: {"Admins can view all users","Users can view own data"}
        CREATE POLICY "Users can update own data" ON public.users
            FOR UPDATE USING ((select auth.uid()) = id);

        CREATE POLICY "Users can insert own data" ON public.users
            FOR INSERT WITH CHECK ((select auth.uid()) = id);
    END IF;
END $$;


-- --------------------------------------------------------
-- 2. ADDRESSES
-- --------------------------------------------------------

DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'addresses') THEN
        DROP POLICY IF EXISTS "Users can view own addresses" ON public.addresses;
        DROP POLICY IF EXISTS "Admins can view all addresses" ON public.addresses;
        
        DROP POLICY IF EXISTS "Users can insert own addresses" ON public.addresses;
        DROP POLICY IF EXISTS "Users can update own addresses" ON public.addresses;
        DROP POLICY IF EXISTS "Users can delete own addresses" ON public.addresses;
        DROP POLICY IF EXISTS "Users and Admins can view addresses" ON public.addresses;

        -- Unified View Policy
        CREATE POLICY "Users and Admins can view addresses" ON public.addresses
            FOR SELECT USING (
                ((select auth.uid()) = user_id) 
                OR 
                (select is_admin())
            );

        CREATE POLICY "Users can insert own addresses" ON public.addresses
            FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

        CREATE POLICY "Users can update own addresses" ON public.addresses
            FOR UPDATE USING ((select auth.uid()) = user_id);

        CREATE POLICY "Users can delete own addresses" ON public.addresses
            FOR DELETE USING ((select auth.uid()) = user_id);
    END IF;
END $$;


-- --------------------------------------------------------
-- 3. CART ITEMS
-- --------------------------------------------------------

DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'cart_items') THEN
        -- DROP ALL known redundant policies
        DROP POLICY IF EXISTS "Users can view own cart" ON public.cart_items;
        DROP POLICY IF EXISTS "Users can insert own cart" ON public.cart_items;
        DROP POLICY IF EXISTS "Users can update own cart" ON public.cart_items;
        DROP POLICY IF EXISTS "Users can delete own cart" ON public.cart_items;
        DROP POLICY IF EXISTS "Users can add to cart" ON public.cart_items;
        DROP POLICY IF EXISTS "Users can remove from cart" ON public.cart_items;
        DROP POLICY IF EXISTS "Users can manage own cart" ON public.cart_items;

        -- CREATE single consolidated manage policy
        CREATE POLICY "Users can manage own cart" ON public.cart_items
            FOR ALL USING ((select auth.uid()) = user_id);
    END IF;
END $$;


-- --------------------------------------------------------
-- 4. WISHLIST ITEMS
-- --------------------------------------------------------

DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'wishlist_items') THEN
        -- DROP ALL known redundant policies
        DROP POLICY IF EXISTS "Users can view own wishlist" ON public.wishlist_items;
        DROP POLICY IF EXISTS "Users can insert own wishlist" ON public.wishlist_items;
        DROP POLICY IF EXISTS "Users can update own wishlist" ON public.wishlist_items;
        DROP POLICY IF EXISTS "Users can delete own wishlist" ON public.wishlist_items;
        DROP POLICY IF EXISTS "Users can add to wishlist" ON public.wishlist_items;
        DROP POLICY IF EXISTS "Users can remove from wishlist" ON public.wishlist_items;
        DROP POLICY IF EXISTS "Users can manage own wishlist" ON public.wishlist_items;

        -- CREATE single consolidated manage policy
        CREATE POLICY "Users can manage own wishlist" ON public.wishlist_items
            FOR ALL USING ((select auth.uid()) = user_id);
    END IF;
END $$;


-- --------------------------------------------------------
-- 5. ORDERS & ORDER ITEMS
-- --------------------------------------------------------

DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'orders') THEN
        -- Drop separated policies
        DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
        DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
        
        DROP POLICY IF EXISTS "Users can insert own orders" ON public.orders;
        DROP POLICY IF EXISTS "Admins can insert orders" ON public.orders;
        
        DROP POLICY IF EXISTS "Users can update own orders" ON public.orders;
        DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;

        DROP POLICY IF EXISTS "Users and Admins can view orders" ON public.orders;
        DROP POLICY IF EXISTS "Users and Admins can insert orders" ON public.orders;
        DROP POLICY IF EXISTS "Users and Admins can update orders" ON public.orders;
        
        -- Unified SELECT
        CREATE POLICY "Users and Admins can view orders" ON public.orders
            FOR SELECT USING (
                ((select auth.uid()) = user_id) 
                OR 
                (select is_admin())
            );

        -- Unified INSERT
        CREATE POLICY "Users and Admins can insert orders" ON public.orders
            FOR INSERT WITH CHECK (
                ((select auth.uid()) = user_id) 
                OR 
                (select is_admin())
            );

        -- Unified UPDATE
        CREATE POLICY "Users and Admins can update orders" ON public.orders
            FOR UPDATE USING (
                ((select auth.uid()) = user_id) 
                OR 
                (select is_admin())
            );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'order_items') THEN
        -- Drop separated policies
        DROP POLICY IF EXISTS "Users can view own order items" ON public.order_items;
        DROP POLICY IF EXISTS "Admins can view all order items" ON public.order_items;
        
        DROP POLICY IF EXISTS "Users can insert own order items" ON public.order_items;
        DROP POLICY IF EXISTS "Admins can insert order items" ON public.order_items;

        DROP POLICY IF EXISTS "Users and Admins can view order items" ON public.order_items;
        DROP POLICY IF EXISTS "Users and Admins can insert order items" ON public.order_items;
        
        -- Unified SELECT
        CREATE POLICY "Users and Admins can view order items" ON public.order_items
            FOR SELECT USING (
                EXISTS (
                    SELECT 1 FROM public.orders 
                    WHERE orders.id = order_items.order_id 
                    AND orders.user_id = (select auth.uid())
                )
                OR 
                (select is_admin())
            );

        -- Unified INSERT
        CREATE POLICY "Users and Admins can insert order items" ON public.order_items
            FOR INSERT WITH CHECK (
                EXISTS (
                    SELECT 1 FROM public.orders 
                    WHERE orders.id = order_items.order_id 
                    AND orders.user_id = (select auth.uid())
                )
                OR 
                (select is_admin())
            );
    END IF;
END $$;


-- --------------------------------------------------------
-- 6. SUBSCRIPTIONS
-- --------------------------------------------------------

DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'subscriptions') THEN
        -- DROP redundant policies
        DROP POLICY IF EXISTS "Users can view own subscriptions" ON public.subscriptions;
        DROP POLICY IF EXISTS "Users can insert own subscriptions" ON public.subscriptions;
        DROP POLICY IF EXISTS "Users can update own subscriptions" ON public.subscriptions;
        DROP POLICY IF EXISTS "Users can delete own subscriptions" ON public.subscriptions;
        DROP POLICY IF EXISTS "Users can manage own subscriptions" ON public.subscriptions;

        -- CREATE single consolidated manage policy
        CREATE POLICY "Users can manage own subscriptions" ON public.subscriptions
            FOR ALL USING ((select auth.uid()) = user_id);
    END IF;
END $$;


-- --------------------------------------------------------
-- 7. REVIEWS
-- --------------------------------------------------------

DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'reviews') THEN
        -- Drop separated policies
        DROP POLICY IF EXISTS "Users can view own reviews" ON public.reviews;
        DROP POLICY IF EXISTS "Admins can view all reviews" ON public.reviews;
        DROP POLICY IF EXISTS "Anyone can view approved reviews" ON public.reviews;
        
        DROP POLICY IF EXISTS "Users can insert own reviews" ON public.reviews;
        
        DROP POLICY IF EXISTS "Users can update own reviews" ON public.reviews;
        DROP POLICY IF EXISTS "Admins can update reviews" ON public.reviews;
        
        DROP POLICY IF EXISTS "Unified view reviews" ON public.reviews;
        DROP POLICY IF EXISTS "Unified update reviews" ON public.reviews;

        -- Unified VIEW: Anyone approved OR User owns OR Admin
        CREATE POLICY "Unified view reviews" ON public.reviews
            FOR SELECT USING (
                (is_approved = true)
                OR
                ((select auth.uid()) = user_id)
                OR
                (select is_admin())
            );

        -- Insert: User owns
        CREATE POLICY "Users can insert own reviews" ON public.reviews
            FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

        -- Unified UPATE: User owns OR Admin
        CREATE POLICY "Unified update reviews" ON public.reviews
            FOR UPDATE USING (
                ((select auth.uid()) = user_id)
                OR
                (select is_admin())
            );
    END IF;
END $$;


-- --------------------------------------------------------
-- 8. ADMINS
-- --------------------------------------------------------

DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'admins') THEN
        DROP POLICY IF EXISTS "Admins can view own record" ON public.admins;
        
        CREATE POLICY "Admins can view own record" ON public.admins
            FOR SELECT USING ((select auth.uid()) = id);
    END IF;
END $$;


-- --------------------------------------------------------
-- 9. PRODUCTS
-- --------------------------------------------------------

DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'products') THEN
        -- Drop separated policies
        DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;
        DROP POLICY IF EXISTS "Admins can view all products" ON public.products;
        DROP POLICY IF EXISTS "Unified view products" ON public.products;
        
        -- Unified VIEW
        CREATE POLICY "Unified view products" ON public.products
            FOR SELECT USING (
                (is_active = true)
                OR
                (select is_admin())
            );
    END IF;
END $$;

-- --------------------------------------------------------
-- 10. BLOG POSTS
-- --------------------------------------------------------

DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'blog_posts') THEN
        -- Drop separated policies
        DROP POLICY IF EXISTS "Anyone can view published blog posts" ON public.blog_posts;
        DROP POLICY IF EXISTS "Admins can view all blog posts" ON public.blog_posts;
        DROP POLICY IF EXISTS "Unified view blog posts" ON public.blog_posts;
        
        -- Unified VIEW
        CREATE POLICY "Unified view blog posts" ON public.blog_posts
            FOR SELECT USING (
                (status = 'published')
                OR
                (select is_admin())
            );
            
        -- Ensure Admin manage policies exist if needed, separate from VIEW to avoid "multiple permissive"
        -- Assuming Admin policies for INSERT/UPDATE/DELETE are separate or handled in admin-rls-policies.sql
        -- But wait, if admin-rls-policies.sql has "Admins can insert blog posts" etc.
        -- those are fine as long as there is only ONE policy per action per role.
        -- The warning was specifically about SELECT having multiple permissive policies.
        -- So consolidating VIEW is sufficient.
    END IF;
END $$;

-- --------------------------------------------------------
-- 11. CATEGORIES
-- --------------------------------------------------------

DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'categories') THEN
        -- 1. DROP REDUNDANT/LEGACY POLICIES
        -- Drop policies that might be causing "multiple permissive" warnings
        DROP POLICY IF EXISTS "Public read categories" ON public.categories;
        DROP POLICY IF EXISTS "Anyone can view active categories" ON public.categories;
        DROP POLICY IF EXISTS "Admins can view all categories" ON public.categories;
        DROP POLICY IF EXISTS "Admins can insert categories" ON public.categories;
        DROP POLICY IF EXISTS "Admins can update categories" ON public.categories;
        DROP POLICY IF EXISTS "Admins can delete categories" ON public.categories;
        
        DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;
        DROP POLICY IF EXISTS "Unified view categories" ON public.categories;

        -- 2. CREATE CONSOLIDATED POLICIES

        -- Unified View Policy
        -- Covers: "Anyone can view active" AND "Admins can view all"
        CREATE POLICY "Unified view categories" ON public.categories
            FOR SELECT USING (
                (is_active = true)
                OR
                (select is_admin())
            );

        -- Admin Manage Policy (Insert, Update, Delete)
        CREATE POLICY "Admins can insert categories" ON public.categories
            FOR INSERT WITH CHECK ((select is_admin()));

        CREATE POLICY "Admins can update categories" ON public.categories
            FOR UPDATE USING ((select is_admin()));

        CREATE POLICY "Admins can delete categories" ON public.categories
            FOR DELETE USING ((select is_admin()));
            
    END IF;
END $$;

-- --------------------------------------------------------
-- 12. PRODUCT IMAGES & VARIANTS
-- --------------------------------------------------------

DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'product_images') THEN
        DROP POLICY IF EXISTS "Anyone can view product images" ON public.product_images;
        DROP POLICY IF EXISTS "Admins can insert product images" ON public.product_images;
        DROP POLICY IF EXISTS "Admins can update product images" ON public.product_images;
        DROP POLICY IF EXISTS "Admins can delete product images" ON public.product_images;
        
        -- Unified VIEW
        CREATE POLICY "Unified view product images" ON public.product_images
            FOR SELECT USING (true); -- Images usually public
            
        -- Admin Manage
        CREATE POLICY "Admins can insert product images" ON public.product_images
            FOR INSERT WITH CHECK ((select is_admin()));

        CREATE POLICY "Admins can update product images" ON public.product_images
            FOR UPDATE USING ((select is_admin()));

        CREATE POLICY "Admins can delete product images" ON public.product_images
            FOR DELETE USING ((select is_admin()));
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'product_variants') THEN
        DROP POLICY IF EXISTS "Anyone can view active variants" ON public.product_variants;
        DROP POLICY IF EXISTS "Admins can insert variants" ON public.product_variants;
        DROP POLICY IF EXISTS "Admins can update variants" ON public.product_variants;
        DROP POLICY IF EXISTS "Admins can delete variants" ON public.product_variants;
        
        -- Unified VIEW
        CREATE POLICY "Unified view product variants" ON public.product_variants
             FOR SELECT USING (
                (is_active = true)
                OR
                (select is_admin())
            );

        -- Admin Manage
        CREATE POLICY "Admins can insert variants" ON public.product_variants
            FOR INSERT WITH CHECK ((select is_admin()));

        CREATE POLICY "Admins can update variants" ON public.product_variants
            FOR UPDATE USING ((select is_admin()));

        CREATE POLICY "Admins can delete variants" ON public.product_variants
            FOR DELETE USING ((select is_admin()));
    END IF;
END $$;


-- --------------------------------------------------------
-- 13. COUPONS & ORDER COUPONS
-- --------------------------------------------------------

DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'coupons') THEN
        DROP POLICY IF EXISTS "Anyone can view active coupons" ON public.coupons;
        DROP POLICY IF EXISTS "Admins can manage coupons" ON public.coupons;
        
        -- Unified VIEW (Public can usually see active coupons, or at least code? Or maybe only Admins?)
        -- Assuming public can see active coupons to apply them.
        CREATE POLICY "Unified view coupons" ON public.coupons
            FOR SELECT USING (
                (is_active = true)
                OR
                (select is_admin())
            );

        -- Admin Manage
        CREATE POLICY "Admins can insert coupons" ON public.coupons
            FOR INSERT WITH CHECK ((select is_admin()));

        CREATE POLICY "Admins can update coupons" ON public.coupons
            FOR UPDATE USING ((select is_admin()));
            
        CREATE POLICY "Admins can delete coupons" ON public.coupons
            FOR DELETE USING ((select is_admin()));
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'order_coupons') THEN
        -- Link table. User should see if they own the order.
        DROP POLICY IF EXISTS "Users can view own order coupons" ON public.order_coupons;
        
        CREATE POLICY "Users and Admins can view order coupons" ON public.order_coupons
            FOR SELECT USING (
                EXISTS (
                    SELECT 1 FROM public.orders 
                    WHERE orders.id = order_coupons.order_id 
                    AND orders.user_id = (select auth.uid())
                )
                OR
                (select is_admin())
            );
    END IF;
END $$;


-- --------------------------------------------------------
-- 14. PAYMENTS & SHIPMENTS
-- --------------------------------------------------------

DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'payments') THEN
        -- Enable RLS just in case
        EXECUTE 'ALTER TABLE payments ENABLE ROW LEVEL SECURITY';
        
        DROP POLICY IF EXISTS "Admins can view all payments" ON public.payments;
        DROP POLICY IF EXISTS "Users can view own payments" ON public.payments;
        DROP POLICY IF EXISTS "Unified view payments" ON public.payments;

        -- Unified VIEW
        CREATE POLICY "Unified view payments" ON public.payments
            FOR SELECT USING (
                EXISTS (
                    SELECT 1 FROM public.orders 
                    WHERE orders.id = payments.order_id 
                    AND orders.user_id = (select auth.uid())
                )
                OR
                (select is_admin())
            );
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'shipments') THEN
        EXECUTE 'ALTER TABLE shipments ENABLE ROW LEVEL SECURITY';

        DROP POLICY IF EXISTS "Admins can view all shipments" ON public.shipments;
        DROP POLICY IF EXISTS "Users can view own shipments" ON public.shipments;
        DROP POLICY IF EXISTS "Unified view shipments" ON public.shipments;

        -- Unified VIEW
        CREATE POLICY "Unified view shipments" ON public.shipments
            FOR SELECT USING (
                EXISTS (
                    SELECT 1 FROM public.orders 
                    WHERE orders.id = shipments.order_id 
                    AND orders.user_id = (select auth.uid())
                )
                OR
                (select is_admin())
            );
    END IF;
END $$;


-- --------------------------------------------------------
-- 15. BLOG COMMENTS
-- --------------------------------------------------------

DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'blog_comments') THEN
        DROP POLICY IF EXISTS "Public view approved comments" ON public.blog_comments;
        DROP POLICY IF EXISTS "Users can insert comments" ON public.blog_comments;
        
        -- Unified VIEW (Approved OR Author OR Admin)
        CREATE POLICY "Unified view blog comments" ON public.blog_comments
            FOR SELECT USING (
                (is_approved = true)
                OR
                ((select auth.uid()) = user_id)
                OR
                (select is_admin())
            );

        -- Insert (Authenticated users)
        CREATE POLICY "Users can insert comments" ON public.blog_comments
            FOR INSERT WITH CHECK ((auth.role() = 'authenticated') AND ((select auth.uid()) = user_id));
            
        -- Update (Author can maybe edit? lets say no for now or Admin only)
        CREATE POLICY "Admins can update comments" ON public.blog_comments
            FOR UPDATE USING ((select is_admin()));
            
        CREATE POLICY "Admins can delete comments" ON public.blog_comments
            FOR DELETE USING ((select is_admin()));
    END IF;
END $$;


-- --------------------------------------------------------
-- 16. SITE SETTINGS
-- --------------------------------------------------------

DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'site_settings') THEN
        EXECUTE 'ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY';
        
        DROP POLICY IF EXISTS "Public view site settings" ON public.site_settings;
        DROP POLICY IF EXISTS "Admins manage site settings" ON public.site_settings;
        
        -- Public View
        CREATE POLICY "Public view site settings" ON public.site_settings
            FOR SELECT USING (true);
            
        -- Admin Manage
        CREATE POLICY "Admins manage site settings" ON public.site_settings
            FOR ALL USING ((select is_admin()));
    END IF;
END $$;

-- --------------------------------------------------------
-- END
-- --------------------------------------------------------

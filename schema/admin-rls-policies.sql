-- ============================================================
-- ADMIN RLS POLICIES (using existing `admins` table)
-- Safe to re-run — drops existing policies first
-- Run this in Supabase SQL Editor
-- ============================================================

-- Step 1: Helper function
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM admins WHERE id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Step 2: Insert admin account
INSERT INTO admins (id, email, password_hash, full_name, role)
SELECT id, email, 'supabase-auth-managed', COALESCE(raw_user_meta_data->>'full_name', 'Admin'), 'admin'
FROM auth.users
WHERE email = 'kamaljit14333@gmail.com'
ON CONFLICT (id) DO NOTHING;


-- PRODUCTS
DROP POLICY IF EXISTS "Admins can view all products" ON products;
DROP POLICY IF EXISTS "Admins can insert products" ON products;
DROP POLICY IF EXISTS "Admins can update products" ON products;
DROP POLICY IF EXISTS "Admins can delete products" ON products;
CREATE POLICY "Admins can view all products" ON products FOR SELECT TO authenticated USING (is_admin());
CREATE POLICY "Admins can insert products" ON products FOR INSERT TO authenticated WITH CHECK (is_admin());
CREATE POLICY "Admins can update products" ON products FOR UPDATE TO authenticated USING (is_admin());
CREATE POLICY "Admins can delete products" ON products FOR DELETE TO authenticated USING (is_admin());

-- PRODUCT IMAGES
DROP POLICY IF EXISTS "Admins can insert product images" ON product_images;
DROP POLICY IF EXISTS "Admins can update product images" ON product_images;
DROP POLICY IF EXISTS "Admins can delete product images" ON product_images;
CREATE POLICY "Admins can insert product images" ON product_images FOR INSERT TO authenticated WITH CHECK (is_admin());
CREATE POLICY "Admins can update product images" ON product_images FOR UPDATE TO authenticated USING (is_admin());
CREATE POLICY "Admins can delete product images" ON product_images FOR DELETE TO authenticated USING (is_admin());

-- PRODUCT VARIANTS
DROP POLICY IF EXISTS "Admins can insert variants" ON product_variants;
DROP POLICY IF EXISTS "Admins can update variants" ON product_variants;
DROP POLICY IF EXISTS "Admins can delete variants" ON product_variants;
CREATE POLICY "Admins can insert variants" ON product_variants FOR INSERT TO authenticated WITH CHECK (is_admin());
CREATE POLICY "Admins can update variants" ON product_variants FOR UPDATE TO authenticated USING (is_admin());
CREATE POLICY "Admins can delete variants" ON product_variants FOR DELETE TO authenticated USING (is_admin());

-- CATEGORIES
DROP POLICY IF EXISTS "Admins can view all categories" ON categories;
DROP POLICY IF EXISTS "Admins can insert categories" ON categories;
DROP POLICY IF EXISTS "Admins can update categories" ON categories;
DROP POLICY IF EXISTS "Admins can delete categories" ON categories;
CREATE POLICY "Admins can view all categories" ON categories FOR SELECT TO authenticated USING (is_admin());
CREATE POLICY "Admins can insert categories" ON categories FOR INSERT TO authenticated WITH CHECK (is_admin());
CREATE POLICY "Admins can update categories" ON categories FOR UPDATE TO authenticated USING (is_admin());
CREATE POLICY "Admins can delete categories" ON categories FOR DELETE TO authenticated USING (is_admin());

-- ORDERS
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
DROP POLICY IF EXISTS "Admins can update orders" ON orders;
CREATE POLICY "Admins can view all orders" ON orders FOR SELECT TO authenticated USING (is_admin());
CREATE POLICY "Admins can update orders" ON orders FOR UPDATE TO authenticated USING (is_admin());

-- ORDER ITEMS
DROP POLICY IF EXISTS "Admins can view all order items" ON order_items;
CREATE POLICY "Admins can view all order items" ON order_items FOR SELECT TO authenticated USING (is_admin());

-- USERS
DROP POLICY IF EXISTS "Admins can view all users" ON users;
CREATE POLICY "Admins can view all users" ON users FOR SELECT TO authenticated USING (is_admin());

-- ADDRESSES
DROP POLICY IF EXISTS "Admins can view all addresses" ON addresses;
CREATE POLICY "Admins can view all addresses" ON addresses FOR SELECT TO authenticated USING (is_admin());

-- REVIEWS
DROP POLICY IF EXISTS "Admins can view all reviews" ON reviews;
DROP POLICY IF EXISTS "Admins can update reviews" ON reviews;
DROP POLICY IF EXISTS "Admins can delete reviews" ON reviews;
CREATE POLICY "Admins can view all reviews" ON reviews FOR SELECT TO authenticated USING (is_admin());
CREATE POLICY "Admins can update reviews" ON reviews FOR UPDATE TO authenticated USING (is_admin());
CREATE POLICY "Admins can delete reviews" ON reviews FOR DELETE TO authenticated USING (is_admin());

-- BLOG POSTS
DROP POLICY IF EXISTS "Admins can view all blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Admins can insert blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Admins can update blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Admins can delete blog posts" ON blog_posts;
CREATE POLICY "Admins can view all blog posts" ON blog_posts FOR SELECT TO authenticated USING (is_admin());
CREATE POLICY "Admins can insert blog posts" ON blog_posts FOR INSERT TO authenticated WITH CHECK (is_admin());
CREATE POLICY "Admins can update blog posts" ON blog_posts FOR UPDATE TO authenticated USING (is_admin());
CREATE POLICY "Admins can delete blog posts" ON blog_posts FOR DELETE TO authenticated USING (is_admin());

-- TAGS
DROP POLICY IF EXISTS "Admins can insert tags" ON tags;
DROP POLICY IF EXISTS "Admins can update tags" ON tags;
DROP POLICY IF EXISTS "Admins can delete tags" ON tags;
CREATE POLICY "Admins can insert tags" ON tags FOR INSERT TO authenticated WITH CHECK (is_admin());
CREATE POLICY "Admins can update tags" ON tags FOR UPDATE TO authenticated USING (is_admin());
CREATE POLICY "Admins can delete tags" ON tags FOR DELETE TO authenticated USING (is_admin());

-- SHIPMENTS
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'shipments') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Admins can view all shipments" ON shipments';
    EXECUTE 'DROP POLICY IF EXISTS "Admins can insert shipments" ON shipments';
    EXECUTE 'DROP POLICY IF EXISTS "Admins can update shipments" ON shipments';
    EXECUTE 'CREATE POLICY "Admins can view all shipments" ON shipments FOR SELECT TO authenticated USING (is_admin())';
    EXECUTE 'CREATE POLICY "Admins can insert shipments" ON shipments FOR INSERT TO authenticated WITH CHECK (is_admin())';
    EXECUTE 'CREATE POLICY "Admins can update shipments" ON shipments FOR UPDATE TO authenticated USING (is_admin())';
  END IF;
END $$;

-- PAYMENTS
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'payments') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Admins can view all payments" ON payments';
    EXECUTE 'CREATE POLICY "Admins can view all payments" ON payments FOR SELECT TO authenticated USING (is_admin())';
  END IF;
END $$;

-- DONE!

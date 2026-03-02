-- ============================================================
-- DATABASE CLEANUP SCRIPT
-- Drops tables that are defined in schema but NOT used in the app
-- ============================================================

-- 1. SUBSCRIPTIONS (Future feature, removing for now)
DROP TABLE IF EXISTS subscription_orders;
DROP TABLE IF EXISTS subscription_items;
DROP TABLE IF EXISTS subscriptions;

-- 2. TAGS (Redundant with Categories)
DROP TABLE IF EXISTS product_tags;
DROP TABLE IF EXISTS tags;

-- 3. BLOG COMMENTS (No UI implementation)
DROP TABLE IF EXISTS blog_comments;

-- NOTE: We are KEEPING:
-- 'payments' -> Needed for Razorpay integration (Next Step)
-- 'coupons'  -> Low overhead, good to keep for future promotions

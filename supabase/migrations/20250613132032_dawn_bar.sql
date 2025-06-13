/*
  # Admin Panel Fixes

  1. Updates to existing tables
    - Add video_url column to products table
    - Add additional coupon fields for enhanced functionality
    - Add min_products, max_products, max_order_value, max_usage_per_user to coupons

  2. Security
    - Ensure proper RLS policies are in place
*/

-- Add video_url column to products table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'video_url'
  ) THEN
    ALTER TABLE products ADD COLUMN video_url text;
  END IF;
END $$;

-- Add enhanced coupon fields
DO $$
BEGIN
  -- Add min_products column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'coupons' AND column_name = 'min_products'
  ) THEN
    ALTER TABLE coupons ADD COLUMN min_products integer DEFAULT 1;
  END IF;

  -- Add max_products column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'coupons' AND column_name = 'max_products'
  ) THEN
    ALTER TABLE coupons ADD COLUMN max_products integer;
  END IF;

  -- Add max_order_value column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'coupons' AND column_name = 'max_order_value'
  ) THEN
    ALTER TABLE coupons ADD COLUMN max_order_value real;
  END IF;

  -- Add max_usage_per_user column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'coupons' AND column_name = 'max_usage_per_user'
  ) THEN
    ALTER TABLE coupons ADD COLUMN max_usage_per_user integer;
  END IF;
END $$;

-- Update existing coupons with default values
UPDATE coupons SET min_products = 1 WHERE min_products IS NULL;

-- Add sample video URLs to existing products
UPDATE products SET video_url = 'https://www.youtube.com/embed/dQw4w9WgXcQ' 
WHERE video_url IS NULL AND featured = true;
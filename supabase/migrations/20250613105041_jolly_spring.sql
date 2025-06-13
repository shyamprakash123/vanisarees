/*
  # Create coupons table

  1. New Tables
    - `coupons`
      - `id` (uuid, primary key)
      - `code` (text, unique, not null)
      - `discount_type` (text, not null) - 'percentage' or 'fixed'
      - `discount_value` (real, not null)
      - `min_order_amount` (real, default 0)
      - `max_discount` (real, nullable) - for percentage discounts
      - `usage_limit` (integer, nullable) - max number of uses
      - `used_count` (integer, default 0)
      - `active` (boolean, default true)
      - `expires_at` (timestamptz, nullable)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `coupons` table
    - Add policy for public read access to active coupons
*/

CREATE TABLE IF NOT EXISTS coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  discount_type text NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value real NOT NULL CHECK (discount_value > 0),
  min_order_amount real DEFAULT 0,
  max_discount real,
  usage_limit integer,
  used_count integer DEFAULT 0,
  active boolean DEFAULT true,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active coupons are viewable by everyone"
  ON coupons
  FOR SELECT
  TO public
  USING (active = true);

-- Insert sample coupons
INSERT INTO coupons (code, discount_type, discount_value, min_order_amount, max_discount, usage_limit, expires_at) VALUES
  ('WELCOME10', 'percentage', 10, 2000, 500, 100, now() + interval '30 days'),
  ('SAVE500', 'fixed', 500, 3000, null, 50, now() + interval '15 days'),
  ('FESTIVE20', 'percentage', 20, 5000, 1000, 200, now() + interval '7 days'),
  ('NEWUSER15', 'percentage', 15, 1500, 750, null, now() + interval '60 days');
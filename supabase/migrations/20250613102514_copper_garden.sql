/*
  # Create orders table

  1. New Tables
    - `orders`
      - `id` (uuid, primary key)
      - `user_id` (uuid, nullable, foreign key to auth.users)
      - `email` (text, not null)
      - `phone` (text, not null)
      - `total_amount` (real, not null)
      - `status` (text, default 'pending')
      - `payment_id` (text, nullable)
      - `tracking_id` (text, nullable)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `orders` table
    - Add policies for authenticated users to manage their own orders
*/

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  email text NOT NULL,
  phone text NOT NULL,
  total_amount real NOT NULL,
  status text DEFAULT 'pending',
  payment_id text,
  tracking_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own orders"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders"
  ON orders
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow anonymous users to create orders (for guest checkout)
CREATE POLICY "Anonymous users can create orders"
  ON orders
  FOR INSERT
  TO anon
  WITH CHECK (user_id IS NULL);
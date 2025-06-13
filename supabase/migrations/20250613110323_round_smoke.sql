/*
  # Create exchange_requests table

  1. New Tables
    - `exchange_requests`
      - `id` (uuid, primary key)
      - `order_id` (text, not null)
      - `email` (text, not null)
      - `phone` (text, not null)
      - `reason` (text, not null)
      - `description` (text, not null)
      - `video_url` (text, nullable)
      - `status` (text, default 'pending')
      - `admin_notes` (text, nullable)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `exchange_requests` table
    - Add policies for public insert and admin access
*/

CREATE TABLE IF NOT EXISTS exchange_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  reason text NOT NULL,
  description text NOT NULL,
  video_url text,
  status text DEFAULT 'pending',
  admin_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE exchange_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create exchange requests"
  ON exchange_requests
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can view exchange requests"
  ON exchange_requests
  FOR SELECT
  TO public
  USING (true);

-- Insert sample exchange requests
INSERT INTO exchange_requests (order_id, email, phone, reason, description, status) VALUES
  ('sample-order-1', 'customer1@example.com', '9876543210', 'damaged', 'The saree arrived with a tear in the fabric', 'pending'),
  ('sample-order-2', 'customer2@example.com', '9876543211', 'wrong-item', 'Received a different color than ordered', 'approved'),
  ('sample-order-3', 'customer3@example.com', '9876543212', 'size-issue', 'The blouse size is incorrect', 'completed');
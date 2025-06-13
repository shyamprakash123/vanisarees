/*
  # Create announcements table

  1. New Tables
    - `announcements`
      - `id` (uuid, primary key)
      - `message` (text, not null)
      - `active` (boolean, default true)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `announcements` table
    - Add policy for public read access
*/

CREATE TABLE IF NOT EXISTS announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message text NOT NULL,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Announcements are viewable by everyone"
  ON announcements
  FOR SELECT
  TO public
  USING (true);

-- Insert sample announcements
INSERT INTO announcements (message, active) VALUES
  ('🎉 Grand Opening Sale! Get 30% off on all silk sarees. Limited time offer!', true),
  ('✨ New Designer Collection Now Available - Explore the latest trends in saree fashion', true),
  ('🚚 Free shipping on orders above ₹5000. Shop now and save more!', true),
  ('💝 Special combo offers available - Buy 2 sarees and save up to ₹3000', true);
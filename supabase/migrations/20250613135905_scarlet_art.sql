/*
  # Create hero_slides table and update announcements policies

  1. New Tables
    - `hero_slides`
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `subtitle` (text, not null)
      - `type` (text, not null) - 'image' or 'video'
      - `url` (text, not null)
      - `button_text` (text, not null)
      - `button_link` (text, not null)
      - `active` (boolean, default true)
      - `order_index` (integer, default 0)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `hero_slides` table
    - Add policy for public read access to active slides
    - Add admin policies for managing slides and announcements
*/

-- Create hero_slides table
CREATE TABLE IF NOT EXISTS hero_slides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text NOT NULL,
  type text NOT NULL CHECK (type IN ('image', 'video')),
  url text NOT NULL,
  button_text text NOT NULL,
  button_link text NOT NULL,
  active boolean DEFAULT true,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active hero slides are viewable by everyone"
  ON hero_slides
  FOR SELECT
  TO public
  USING (active = true);

-- Add admin policies for hero slides
CREATE POLICY "Admin can manage hero slides"
  ON hero_slides
  FOR ALL
  TO authenticated
  USING (((jwt() -> 'app_metadata'::text) ->> 'role'::text) = 'admin'::text);

-- Add admin policies for announcements
CREATE POLICY "Admin can manage announcements"
  ON announcements
  FOR ALL
  TO authenticated
  USING (((jwt() -> 'app_metadata'::text) ->> 'role'::text) = 'admin'::text);

-- Insert sample hero slides
INSERT INTO hero_slides (title, subtitle, type, url, button_text, button_link, active, order_index) VALUES
('Exquisite Silk Sarees', 'Discover our premium collection of traditional silk sarees', 'image', 'https://images.pexels.com/photos/8553882/pexels-photo-8553882.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop', 'Shop Silk Collection', '/category/silk-sarees', true, 1),
('Bridal Elegance', 'Perfect sarees for your special day', 'image', 'https://images.pexels.com/photos/8553879/pexels-photo-8553879.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop', 'Explore Bridal Wear', '/category/wedding-sarees', true, 2),
('See Our Sarees in Motion', 'Watch how beautifully our sarees drape', 'video', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'View Collection', '/products', true, 3);
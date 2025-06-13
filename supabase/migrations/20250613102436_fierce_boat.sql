/*
  # Create products table

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `slug` (text, unique, not null)
      - `description` (text, nullable)
      - `price` (real, not null)
      - `sale_price` (real, nullable)
      - `images` (text[], array of image URLs)
      - `category_id` (uuid, foreign key to categories)
      - `stock_quantity` (integer, default 0)
      - `featured` (boolean, default false)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `products` table
    - Add policy for public read access

  3. Relationships
    - Foreign key constraint to categories table
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  price real NOT NULL,
  sale_price real,
  images text[] DEFAULT '{}',
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  stock_quantity integer DEFAULT 0,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are viewable by everyone"
  ON products
  FOR SELECT
  TO public
  USING (true);

-- Insert sample products
INSERT INTO products (name, slug, description, price, sale_price, images, category_id, stock_quantity, featured) 
SELECT 
  'Elegant Silk Saree - ' || generate_series,
  'elegant-silk-saree-' || generate_series,
  'Beautiful handwoven silk saree with intricate patterns and rich colors. Perfect for special occasions and celebrations.',
  CASE 
    WHEN generate_series % 3 = 0 THEN 15000
    WHEN generate_series % 3 = 1 THEN 12000
    ELSE 18000
  END,
  CASE 
    WHEN generate_series % 4 = 0 THEN 
      CASE 
        WHEN generate_series % 3 = 0 THEN 12000
        WHEN generate_series % 3 = 1 THEN 9500
        ELSE 14500
      END
    ELSE NULL
  END,
  ARRAY['https://images.pexels.com/photos/8553882/pexels-photo-8553882.jpeg?auto=compress&cs=tinysrgb&w=600'],
  (SELECT id FROM categories WHERE slug = 'silk-sarees' LIMIT 1),
  CASE 
    WHEN generate_series % 5 = 0 THEN 0
    ELSE (generate_series % 10) + 5
  END,
  generate_series <= 8
FROM generate_series(1, 20);

-- Insert cotton sarees
INSERT INTO products (name, slug, description, price, sale_price, images, category_id, stock_quantity, featured) 
SELECT 
  'Premium Cotton Saree - ' || generate_series,
  'premium-cotton-saree-' || generate_series,
  'Soft and comfortable cotton saree with beautiful prints. Ideal for daily wear and casual occasions.',
  CASE 
    WHEN generate_series % 3 = 0 THEN 3500
    WHEN generate_series % 3 = 1 THEN 4200
    ELSE 2800
  END,
  CASE 
    WHEN generate_series % 3 = 0 THEN 2800
    ELSE NULL
  END,
  ARRAY['https://images.pexels.com/photos/8553882/pexels-photo-8553882.jpeg?auto=compress&cs=tinysrgb&w=600'],
  (SELECT id FROM categories WHERE slug = 'cotton-sarees' LIMIT 1),
  (generate_series % 15) + 10,
  false
FROM generate_series(1, 15);

-- Insert designer sarees
INSERT INTO products (name, slug, description, price, sale_price, images, category_id, stock_quantity, featured) 
SELECT 
  'Designer Collection Saree - ' || generate_series,
  'designer-collection-saree-' || generate_series,
  'Contemporary designer saree with modern patterns and stylish draping. Perfect blend of tradition and fashion.',
  CASE 
    WHEN generate_series % 3 = 0 THEN 8500
    WHEN generate_series % 3 = 1 THEN 9200
    ELSE 7800
  END,
  CASE 
    WHEN generate_series % 4 = 0 THEN 
      CASE 
        WHEN generate_series % 3 = 0 THEN 6800
        WHEN generate_series % 3 = 1 THEN 7400
        ELSE 6200
      END
    ELSE NULL
  END,
  ARRAY['https://images.pexels.com/photos/8553882/pexels-photo-8553882.jpeg?auto=compress&cs=tinysrgb&w=600'],
  (SELECT id FROM categories WHERE slug = 'designer-sarees' LIMIT 1),
  (generate_series % 8) + 3,
  generate_series <= 4
FROM generate_series(1, 12);
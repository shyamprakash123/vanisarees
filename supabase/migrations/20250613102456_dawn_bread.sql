/*
  # Create combos table

  1. New Tables
    - `combos`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `description` (text, nullable)
      - `product_ids` (uuid[], array of product IDs)
      - `combo_price` (real, not null)
      - `image_url` (text, nullable)
      - `active` (boolean, default true)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `combos` table
    - Add policy for public read access
*/

CREATE TABLE IF NOT EXISTS combos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  product_ids uuid[] DEFAULT '{}',
  combo_price real NOT NULL,
  image_url text,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE combos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Combos are viewable by everyone"
  ON combos
  FOR SELECT
  TO public
  USING (true);

-- Insert sample combos (will be populated after products are created)
DO $$
DECLARE
  silk_products uuid[];
  designer_products uuid[];
  combo_products uuid[];
BEGIN
  -- Get some silk saree IDs
  SELECT ARRAY(SELECT id FROM products WHERE category_id = (SELECT id FROM categories WHERE slug = 'silk-sarees') LIMIT 3) INTO silk_products;
  
  -- Get some designer saree IDs  
  SELECT ARRAY(SELECT id FROM products WHERE category_id = (SELECT id FROM categories WHERE slug = 'designer-sarees') LIMIT 2) INTO designer_products;
  
  -- Create combo with silk sarees
  IF array_length(silk_products, 1) >= 2 THEN
    INSERT INTO combos (name, description, product_ids, combo_price, active) VALUES
    ('Silk Saree Duo', 'Two beautiful silk sarees at an amazing combo price. Perfect for special occasions.', silk_products[1:2], 22000, true);
  END IF;
  
  -- Create combo with designer sarees
  IF array_length(designer_products, 1) >= 2 THEN
    INSERT INTO combos (name, description, product_ids, combo_price, active) VALUES
    ('Designer Special Combo', 'Exclusive designer sarees combo with contemporary patterns.', designer_products[1:2], 14500, true);
  END IF;
  
  -- Create mixed combo
  IF array_length(silk_products, 1) >= 1 AND array_length(designer_products, 1) >= 1 THEN
    combo_products := ARRAY[silk_products[1], designer_products[1]];
    INSERT INTO combos (name, description, product_ids, combo_price, active) VALUES
    ('Silk & Designer Combo', 'Perfect combination of traditional silk and modern designer saree.', combo_products, 18500, true);
  END IF;
END $$;
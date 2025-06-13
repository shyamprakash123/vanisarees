/*
  # Add more comprehensive sample data

  1. More products across categories
  2. More combos with realistic pricing
  3. Sample orders with different statuses
  4. Additional announcements
*/

-- Add more products to existing categories
DO $$
DECLARE
  silk_cat_id uuid;
  cotton_cat_id uuid;
  designer_cat_id uuid;
  wedding_cat_id uuid;
  casual_cat_id uuid;
BEGIN
  -- Get category IDs
  SELECT id INTO silk_cat_id FROM categories WHERE slug = 'silk-sarees';
  SELECT id INTO cotton_cat_id FROM categories WHERE slug = 'cotton-sarees';
  SELECT id INTO designer_cat_id FROM categories WHERE slug = 'designer-sarees';
  SELECT id INTO wedding_cat_id FROM categories WHERE slug = 'wedding-sarees';
  SELECT id INTO casual_cat_id FROM categories WHERE slug = 'casual-sarees';

  -- Add more silk sarees
  INSERT INTO products (name, slug, description, price, sale_price, images, category_id, stock_quantity, featured) VALUES
  ('Royal Banarasi Silk Saree', 'royal-banarasi-silk-saree', 'Exquisite Banarasi silk saree with gold zari work. Perfect for weddings and special occasions.', 25000, 20000, ARRAY['https://images.pexels.com/photos/8553882/pexels-photo-8553882.jpeg?auto=compress&cs=tinysrgb&w=600'], silk_cat_id, 8, true),
  ('Kanjivaram Silk Masterpiece', 'kanjivaram-silk-masterpiece', 'Traditional Kanjivaram silk saree with intricate temple border design.', 22000, NULL, ARRAY['https://images.pexels.com/photos/8553882/pexels-photo-8553882.jpeg?auto=compress&cs=tinysrgb&w=600'], silk_cat_id, 12, true),
  ('Mysore Silk Elegance', 'mysore-silk-elegance', 'Pure Mysore silk saree with beautiful floral motifs and rich texture.', 18000, 15000, ARRAY['https://images.pexels.com/photos/8553882/pexels-photo-8553882.jpeg?auto=compress&cs=tinysrgb&w=600'], silk_cat_id, 15, false);

  -- Add wedding sarees
  INSERT INTO products (name, slug, description, price, sale_price, images, category_id, stock_quantity, featured) VALUES
  ('Bridal Red Silk Saree', 'bridal-red-silk-saree', 'Stunning red silk saree with heavy gold embroidery. Perfect for brides.', 35000, 30000, ARRAY['https://images.pexels.com/photos/8553882/pexels-photo-8553882.jpeg?auto=compress&cs=tinysrgb&w=600'], wedding_cat_id, 5, true),
  ('Golden Wedding Saree', 'golden-wedding-saree', 'Luxurious golden saree with intricate beadwork and sequins.', 28000, NULL, ARRAY['https://images.pexels.com/photos/8553882/pexels-photo-8553882.jpeg?auto=compress&cs=tinysrgb&w=600'], wedding_cat_id, 7, true),
  ('Maroon Bridal Collection', 'maroon-bridal-collection', 'Rich maroon saree with traditional motifs and heavy border.', 32000, 28000, ARRAY['https://images.pexels.com/photos/8553882/pexels-photo-8553882.jpeg?auto=compress&cs=tinysrgb&w=600'], wedding_cat_id, 6, false);

  -- Add casual sarees
  INSERT INTO products (name, slug, description, price, sale_price, images, category_id, stock_quantity, featured) VALUES
  ('Daily Wear Cotton Saree', 'daily-wear-cotton-saree', 'Comfortable cotton saree perfect for daily wear and office.', 1500, 1200, ARRAY['https://images.pexels.com/photos/8553882/pexels-photo-8553882.jpeg?auto=compress&cs=tinysrgb&w=600'], casual_cat_id, 25, false),
  ('Printed Casual Saree', 'printed-casual-saree', 'Trendy printed saree with modern patterns and vibrant colors.', 2000, NULL, ARRAY['https://images.pexels.com/photos/8553882/pexels-photo-8553882.jpeg?auto=compress&cs=tinysrgb&w=600'], casual_cat_id, 30, false),
  ('Georgette Party Wear', 'georgette-party-wear', 'Elegant georgette saree suitable for parties and casual events.', 3500, 2800, ARRAY['https://images.pexels.com/photos/8553882/pexels-photo-8553882.jpeg?auto=compress&cs=tinysrgb&w=600'], casual_cat_id, 20, false);
END $$;

-- Add more combos
DO $$
DECLARE
  silk_products uuid[];
  wedding_products uuid[];
  casual_products uuid[];
BEGIN
  -- Get product IDs for combos
  SELECT ARRAY(SELECT id FROM products WHERE category_id = (SELECT id FROM categories WHERE slug = 'silk-sarees') LIMIT 2) INTO silk_products;
  SELECT ARRAY(SELECT id FROM products WHERE category_id = (SELECT id FROM categories WHERE slug = 'wedding-sarees') LIMIT 2) INTO wedding_products;
  SELECT ARRAY(SELECT id FROM products WHERE category_id = (SELECT id FROM categories WHERE slug = 'casual-sarees') LIMIT 3) INTO casual_products;
  
  -- Create more combos
  IF array_length(wedding_products, 1) >= 2 THEN
    INSERT INTO combos (name, description, product_ids, combo_price, active) VALUES
    ('Bridal Trousseau Combo', 'Complete bridal collection with two stunning wedding sarees at special price.', wedding_products[1:2], 55000, true);
  END IF;
  
  IF array_length(casual_products, 1) >= 3 THEN
    INSERT INTO combos (name, description, product_ids, combo_price, active) VALUES
    ('Casual Wear Bundle', 'Three beautiful casual sarees perfect for everyday elegance.', casual_products[1:3], 6000, true);
  END IF;
END $$;

-- Add sample orders
INSERT INTO orders (email, phone, total_amount, status, created_at) VALUES
('priya.sharma@email.com', '9876543210', 25000, 'delivered', now() - interval '5 days'),
('anita.reddy@email.com', '9876543211', 18500, 'shipped', now() - interval '2 days'),
('meera.patel@email.com', '9876543212', 32000, 'confirmed', now() - interval '1 day'),
('lakshmi.iyer@email.com', '9876543213', 15000, 'pending', now() - interval '6 hours'),
('kavya.nair@email.com', '9876543214', 22000, 'delivered', now() - interval '10 days'),
('sunita.gupta@email.com', '9876543215', 8500, 'cancelled', now() - interval '3 days');

-- Add more announcements
INSERT INTO announcements (message, active) VALUES
('🎊 Festival Special: Extra 25% off on all wedding sarees this week only!', true),
('📦 Same day delivery available in major cities. Order before 2 PM!', true),
('💎 New arrival: Exclusive designer collection now available', false),
('🎁 Refer a friend and get ₹500 off on your next purchase', true);
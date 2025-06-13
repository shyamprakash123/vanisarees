/*
  # Update products with multiple sample images

  1. Updates
    - Add multiple sample images to existing products for better demonstration
    - Ensures each product has at least 3-5 images for the image slider functionality
*/

-- Update products with multiple sample images
UPDATE products SET images = ARRAY[
  'https://images.pexels.com/photos/8553882/pexels-photo-8553882.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/8553879/pexels-photo-8553879.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/8553881/pexels-photo-8553881.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/8553883/pexels-photo-8553883.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/8553884/pexels-photo-8553884.jpeg?auto=compress&cs=tinysrgb&w=800'
] WHERE category_id = (SELECT id FROM categories WHERE slug = 'silk-sarees');

UPDATE products SET images = ARRAY[
  'https://images.pexels.com/photos/8553879/pexels-photo-8553879.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/8553882/pexels-photo-8553882.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/8553881/pexels-photo-8553881.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/8553883/pexels-photo-8553883.jpeg?auto=compress&cs=tinysrgb&w=800'
] WHERE category_id = (SELECT id FROM categories WHERE slug = 'cotton-sarees');

UPDATE products SET images = ARRAY[
  'https://images.pexels.com/photos/8553881/pexels-photo-8553881.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/8553882/pexels-photo-8553882.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/8553879/pexels-photo-8553879.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/8553884/pexels-photo-8553884.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/8553883/pexels-photo-8553883.jpeg?auto=compress&cs=tinysrgb&w=800'
] WHERE category_id = (SELECT id FROM categories WHERE slug = 'designer-sarees');

UPDATE products SET images = ARRAY[
  'https://images.pexels.com/photos/8553883/pexels-photo-8553883.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/8553882/pexels-photo-8553882.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/8553879/pexels-photo-8553879.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/8553881/pexels-photo-8553881.jpeg?auto=compress&cs=tinysrgb&w=800'
] WHERE category_id = (SELECT id FROM categories WHERE slug = 'wedding-sarees');

UPDATE products SET images = ARRAY[
  'https://images.pexels.com/photos/8553884/pexels-photo-8553884.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/8553882/pexels-photo-8553882.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/8553879/pexels-photo-8553879.jpeg?auto=compress&cs=tinysrgb&w=800'
] WHERE category_id = (SELECT id FROM categories WHERE slug = 'casual-sarees');
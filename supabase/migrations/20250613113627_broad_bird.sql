/*
  # Enhanced orders table with detailed pricing

  1. Updates
    - Add payment_method column
    - Add delivery_charges column  
    - Add cod_charges column
    - Add discount_amount column
    - Add coupon_code column
    - Add shipping_address column (JSON)
    - Add items column (JSON array)
    - Add tracking_id column if not exists

  2. Sample data updates
    - Update existing orders with new structure
*/

-- Add new columns to orders table
DO $$
BEGIN
  -- Add payment_method column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'payment_method'
  ) THEN
    ALTER TABLE orders ADD COLUMN payment_method text DEFAULT 'cod';
  END IF;

  -- Add delivery_charges column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'delivery_charges'
  ) THEN
    ALTER TABLE orders ADD COLUMN delivery_charges real DEFAULT 0;
  END IF;

  -- Add cod_charges column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'cod_charges'
  ) THEN
    ALTER TABLE orders ADD COLUMN cod_charges real DEFAULT 0;
  END IF;

  -- Add discount_amount column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'discount_amount'
  ) THEN
    ALTER TABLE orders ADD COLUMN discount_amount real DEFAULT 0;
  END IF;

  -- Add coupon_code column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'coupon_code'
  ) THEN
    ALTER TABLE orders ADD COLUMN coupon_code text;
  END IF;

  -- Add shipping_address column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'shipping_address'
  ) THEN
    ALTER TABLE orders ADD COLUMN shipping_address jsonb;
  END IF;

  -- Add items column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'items'
  ) THEN
    ALTER TABLE orders ADD COLUMN items jsonb;
  END IF;
END $$;

-- Update existing orders with sample data
UPDATE orders SET 
  payment_method = CASE 
    WHEN random() > 0.5 THEN 'cod' 
    ELSE 'prepaid' 
  END,
  delivery_charges = CASE 
    WHEN total_amount < 999 THEN 100 
    ELSE 0 
  END,
  cod_charges = CASE 
    WHEN random() > 0.5 THEN 100 
    ELSE 0 
  END,
  discount_amount = CASE 
    WHEN random() > 0.7 THEN (total_amount * 0.1)::real 
    ELSE 0 
  END,
  shipping_address = jsonb_build_object(
    'firstName', 'Customer',
    'lastName', 'Name',
    'address', '123 Sample Street',
    'city', 'Sample City',
    'state', 'Sample State',
    'pincode', '123456'
  ),
  items = jsonb_build_array(
    jsonb_build_object(
      'id', gen_random_uuid()::text,
      'name', 'Sample Saree',
      'price', (total_amount * 0.8)::real,
      'quantity', 1,
      'image', 'https://images.pexels.com/photos/8553882/pexels-photo-8553882.jpeg?auto=compress&cs=tinysrgb&w=600'
    )
  )
WHERE payment_method IS NULL;
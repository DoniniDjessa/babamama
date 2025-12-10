-- Migration script to add new columns to ali-products table
-- Run this if the table already exists

-- Add new columns if they don't exist
DO $$ 
BEGIN
  -- Add subcategory
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'ali-products' AND column_name = 'subcategory') THEN
    ALTER TABLE public."ali-products" ADD COLUMN subcategory text;
  END IF;

  -- Add subsubcategory
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'ali-products' AND column_name = 'subsubcategory') THEN
    ALTER TABLE public."ali-products" ADD COLUMN subsubcategory text;
  END IF;

  -- Add old_price_xof
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'ali-products' AND column_name = 'old_price_xof') THEN
    ALTER TABLE public."ali-products" ADD COLUMN old_price_xof int;
  END IF;

  -- Add new_price_xof
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'ali-products' AND column_name = 'new_price_xof') THEN
    ALTER TABLE public."ali-products" ADD COLUMN new_price_xof int;
  END IF;

  -- Add reduction_percentage
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'ali-products' AND column_name = 'reduction_percentage') THEN
    ALTER TABLE public."ali-products" ADD COLUMN reduction_percentage int;
  END IF;

  -- Add rating
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'ali-products' AND column_name = 'rating') THEN
    ALTER TABLE public."ali-products" ADD COLUMN rating float default 0;
  END IF;

  -- Add specs
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'ali-products' AND column_name = 'specs') THEN
    ALTER TABLE public."ali-products" ADD COLUMN specs text[] default '{}';
  END IF;

  -- Add stock_quantity
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'ali-products' AND column_name = 'stock_quantity') THEN
    ALTER TABLE public."ali-products" ADD COLUMN stock_quantity int default 100;
  END IF;

  -- Add min_quantity_to_sell
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'ali-products' AND column_name = 'min_quantity_to_sell') THEN
    ALTER TABLE public."ali-products" ADD COLUMN min_quantity_to_sell int default 1;
  END IF;

  -- Make sourcing_price_yuan and weight_kg nullable if they exist and are not nullable
  -- (These are admin-only fields and might not be needed for all products)
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'ali-products' AND column_name = 'sourcing_price_yuan' 
             AND is_nullable = 'NO') THEN
    ALTER TABLE public."ali-products" ALTER COLUMN sourcing_price_yuan DROP NOT NULL;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'ali-products' AND column_name = 'weight_kg' 
             AND is_nullable = 'NO') THEN
    ALTER TABLE public."ali-products" ALTER COLUMN weight_kg DROP NOT NULL;
  END IF;
END $$;

-- Update existing products to have default values
UPDATE public."ali-products"
SET 
  rating = COALESCE(rating, 0),
  stock_quantity = COALESCE(stock_quantity, 100),
  min_quantity_to_sell = COALESCE(min_quantity_to_sell, 1),
  specs = COALESCE(specs, '{}')
WHERE rating IS NULL OR stock_quantity IS NULL OR min_quantity_to_sell IS NULL OR specs IS NULL;


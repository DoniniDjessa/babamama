-- Fix for ali-favorites table
-- If the table doesn't exist or has a different name, run this script

-- Drop table if exists with wrong name
DROP TABLE IF EXISTS public."dm_favorites";

-- Create the table with correct name
CREATE TABLE IF NOT EXISTS public."ali-favorites" (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  auth_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES public."ali-products"(id) ON DELETE CASCADE NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(auth_user_id, product_id) -- Prevent duplicate favorites
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_ali_favorites_auth_user_id ON public."ali-favorites"(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_ali_favorites_product_id ON public."ali-favorites"(product_id);
CREATE INDEX IF NOT EXISTS idx_ali_favorites_created_at ON public."ali-favorites"(created_at DESC);

-- Enable RLS
ALTER TABLE public."ali-favorites" ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can manage own favorites" ON public."ali-favorites";

-- Policy: Users can manage their own favorites
CREATE POLICY "Users can manage own favorites" ON public."ali-favorites"
  FOR ALL USING (auth.uid() = auth_user_id);


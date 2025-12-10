-- Script to check and fix ali-favorites table
-- Run this in Supabase SQL Editor if favorites are not working

-- 1. Check if table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'ali-favorites'
);

-- 2. Create table if it doesn't exist
CREATE TABLE IF NOT EXISTS public."ali-favorites" (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  auth_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(auth_user_id, product_id)
);

-- 3. Create indexes
CREATE INDEX IF NOT EXISTS idx_ali_favorites_auth_user_id ON public."ali-favorites"(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_ali_favorites_product_id ON public."ali-favorites"(product_id);
CREATE INDEX IF NOT EXISTS idx_ali_favorites_created_at ON public."ali-favorites"(created_at DESC);

-- 4. Enable RLS
ALTER TABLE public."ali-favorites" ENABLE ROW LEVEL SECURITY;

-- 5. Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can manage own favorites" ON public."ali-favorites";
DROP POLICY IF EXISTS "Users can read own favorites" ON public."ali-favorites";
DROP POLICY IF EXISTS "Users can insert own favorites" ON public."ali-favorites";
DROP POLICY IF EXISTS "Users can delete own favorites" ON public."ali-favorites";

-- 6. Create RLS policies
-- Users can read their own favorites
CREATE POLICY "Users can read own favorites" ON public."ali-favorites"
  FOR SELECT
  USING (auth.uid() = auth_user_id);

-- Users can insert their own favorites
CREATE POLICY "Users can insert own favorites" ON public."ali-favorites"
  FOR INSERT
  WITH CHECK (auth.uid() = auth_user_id);

-- Users can delete their own favorites
CREATE POLICY "Users can delete own favorites" ON public."ali-favorites"
  FOR DELETE
  USING (auth.uid() = auth_user_id);

-- 7. Verify policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'ali-favorites';


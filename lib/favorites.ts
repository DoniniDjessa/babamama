import { supabase } from './supabase';

export interface Favorite {
  id: string;
  auth_user_id: string;
  product_id: string;
  created_at: string;
}

/**
 * Add a product to favorites
 */
export async function addFavorite(authUserId: string, productId: string) {
  // Check if already favorited
  const { data: existing } = await supabase
    .from('ali-favorites')
    .select('id')
    .eq('auth_user_id', authUserId)
    .eq('product_id', productId)
    .single();

  if (existing) {
    return { data: existing, error: null };
  }

  const { data, error } = await supabase
    .from('ali-favorites')
    .insert({
      auth_user_id: authUserId,
      product_id: productId,
    })
    .select()
    .single();

  return { data: data as Favorite | null, error };
}

/**
 * Remove a product from favorites
 */
export async function removeFavorite(authUserId: string, productId: string) {
  const { error } = await supabase
    .from('ali-favorites')
    .delete()
    .eq('auth_user_id', authUserId)
    .eq('product_id', productId);

  return { error };
}

/**
 * Check if a product is favorited
 */
export async function isFavorited(authUserId: string, productId: string): Promise<boolean> {
  const { data } = await supabase
    .from('ali-favorites')
    .select('id')
    .eq('auth_user_id', authUserId)
    .eq('product_id', productId)
    .single();

  return !!data;
}

/**
 * Get all favorite product IDs for a user
 */
export async function getFavoriteProductIds(authUserId: string): Promise<string[]> {
  const { data } = await supabase
    .from('ali-favorites')
    .select('product_id')
    .eq('auth_user_id', authUserId);

  if (!data) return [];
  return data.map((fav) => fav.product_id);
}

/**
 * Get all favorite products for a user (with product details)
 */
export async function getFavoriteProducts(authUserId: string) {
  const { data: favorites, error: favError } = await supabase
    .from('ali-favorites')
    .select('product_id')
    .eq('auth_user_id', authUserId)
    .order('created_at', { ascending: false });

  if (favError || !favorites || favorites.length === 0) {
    return { data: [], error: favError };
  }

  const productIds = favorites.map((fav) => fav.product_id);

  const { data: products, error: productsError } = await supabase
    .from('ali-products')
    .select('*')
    .in('id', productIds)
    .eq('is_active', true);

  return { data: products || [], error: productsError };
}


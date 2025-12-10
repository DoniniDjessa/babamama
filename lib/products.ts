import { supabase } from './supabase';

export interface Product {
  id: string;
  title: string;
  description: string | null;
  category: string;
  subcategory: string | null;
  subsubcategory: string | null;
  images: string[];
  final_price_xof: number;
  compare_at_price: number | null; // Prix barré (pour promo classique)
  discount_percentage: number; // Pourcentage de réduction (0 si pas de promo)
  flash_sale_end_at: string | null; // Date de fin de la vente flash (ISO timestamp)
  flash_sale_stock: number | null; // Stock réservé pour la vente flash
  rating: number; // Note sur 5 étoiles (0-5)
  specs: string[]; // Tableau de spécifications
  is_active: boolean;
  is_new: boolean;
  stock_quantity: number;
  min_quantity_to_sell: number;
  created_at: string;
  updated_at: string;
  // Legacy fields for backward compatibility
  old_price_xof?: number | null;
  new_price_xof?: number | null;
  reduction_percentage?: number | null;
}

/**
 * Fetch all active products
 */
export async function getProducts(limit?: number) {
  let query = supabase
    .from('ali-products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;
  return { data: data as Product[] | null, error };
}

/**
 * Fetch products by category
 */
export async function getProductsByCategory(category: string) {
  const { data, error } = await supabase
    .from('ali-products')
    .select('*')
    .eq('is_active', true)
    .eq('category', category)
    .order('created_at', { ascending: false });

  return { data: data as Product[] | null, error };
}

/**
 * Fetch a single product by ID
 */
export async function getProductById(id: string) {
  const { data, error } = await supabase
    .from('ali-products')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single();

  return { data: data as Product | null, error };
}

/**
 * Search products by title
 */
export async function searchProducts(query: string) {
  const { data, error } = await supabase
    .from('ali-products')
    .select('*')
    .eq('is_active', true)
    .ilike('title', `%${query}%`)
    .order('created_at', { ascending: false });

  return { data: data as Product[] | null, error };
}

/**
 * Format price to FCFA
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
  }).format(price);
}

/**
 * Calculate discount percentage
 */
export function calculateDiscount(currentPrice: number, originalPrice: number): number {
  if (originalPrice <= currentPrice) return 0;
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
}


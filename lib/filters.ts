import { supabase } from './supabase';
import type { Product } from './products';
import type { FilterState } from '@/lib/useProductFilters';

/**
 * Apply filters and sorting to products
 */
export function applyFilters(
  products: Product[],
  filters: FilterState
): Product[] {
  let filtered = [...products];

  // Filter: In Stock Abidjan (stock_quantity > 0)
  if (filters.inStockAbidjan) {
    filtered = filtered.filter((p) => p.stock_quantity > 0);
  }

  // Filter: Price Range
  filtered = filtered.filter(
    (p) =>
      p.final_price_xof >= filters.priceRange[0] &&
      p.final_price_xof <= filters.priceRange[1]
  );

  // Filter: Subcategories (match by subcategory or subsubcategory)
  if (filters.selectedSubcategories.length > 0) {
    filtered = filtered.filter(
      (p) =>
        (p.subcategory && filters.selectedSubcategories.includes(p.subcategory)) ||
        (p.subsubcategory && filters.selectedSubcategories.includes(p.subsubcategory))
    );
  }

  // Sort
  switch (filters.sortBy) {
    case 'popular':
      // Sort by rating (highest first), then by created_at
      filtered.sort((a, b) => {
        if (b.rating !== a.rating) return b.rating - a.rating;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
      break;
    case 'newest':
      filtered.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      break;
    case 'price-asc':
      filtered.sort((a, b) => a.final_price_xof - b.final_price_xof);
      break;
    case 'price-desc':
      filtered.sort((a, b) => b.final_price_xof - a.final_price_xof);
      break;
  }

  return filtered;
}

/**
 * Get price range from products
 */
export function getPriceRange(products: Product[]): { min: number; max: number } {
  if (products.length === 0) {
    return { min: 1000, max: 100000 };
  }

  const prices = products.map((p) => p.final_price_xof);
  return {
    min: Math.floor(Math.min(...prices) / 1000) * 1000, // Round down to nearest 1000
    max: Math.ceil(Math.max(...prices) / 1000) * 1000, // Round up to nearest 1000
  };
}

/**
 * Get unique subcategories from products (includes both subcategory and subsubcategory)
 */
export function getSubcategories(products: Product[]): string[] {
  const subcats = products
    .map((p) => p.subcategory)
    .filter((s): s is string => s !== null && s !== undefined);
  const subsubcats = products
    .map((p) => p.subsubcategory)
    .filter((s): s is string => s !== null && s !== undefined);
  return [...new Set([...subcats, ...subsubcats])].sort();
}


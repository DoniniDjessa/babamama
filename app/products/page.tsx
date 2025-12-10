'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Filter } from 'lucide-react';
import { getProducts, searchProducts, getProductsByCategory } from '@/lib/products';
import ProductCard from '@/components/ProductCard';
import AnimatedContainer from '@/components/AnimatedContainer';
import FiltersDrawer, { type FilterState, type SortOption } from '@/components/FiltersDrawer';
import { applyFilters, getPriceRange, getSubcategories } from '@/lib/filters';
import type { Product } from '@/lib/products';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const searchQuery = searchParams.get('q');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    inStockAbidjan: false,
    sortBy: 'popular',
    priceRange: [1000, 100000],
    selectedSubcategories: [],
  });

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        let result;
        if (searchQuery) {
          result = await searchProducts(searchQuery);
        } else if (category) {
          result = await getProductsByCategory(category);
        } else {
          result = await getProducts();
        }

        if (result.error) {
          setError('Erreur lors du chargement des produits');
          console.error(result.error);
        } else {
          const products = result.data || [];
          setAllProducts(products);
          
          // Initialize price range from products
          const priceRange = getPriceRange(products);
          setFilters((prev) => ({
            ...prev,
            priceRange: [priceRange.min, priceRange.max],
          }));
          
          // Apply initial filters
          const filtered = applyFilters(products, {
            ...filters,
            priceRange: [priceRange.min, priceRange.max],
          });
          setFilteredProducts(filtered);
        }
      } catch (err) {
        setError('Une erreur est survenue');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, searchQuery]);

  // Apply filters when they change
  useEffect(() => {
    if (allProducts.length > 0) {
      const filtered = applyFilters(allProducts, filters);
      setFilteredProducts(filtered);
    }
  }, [filters, allProducts]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <AnimatedContainer direction="up" delay={0.1}>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h1 className="font-title text-2xl sm:text-3xl font-bold text-slate-900">
                {searchQuery
                  ? `Résultats pour "${searchQuery}"`
                  : category
                  ? `Catégorie: ${category}`
                  : 'Tous les produits'}
              </h1>
              <button
                onClick={() => setShowFilters(true)}
                className="font-body flex items-center gap-2 px-4 py-2 rounded-full border border-slate-300 bg-white hover:bg-slate-50 transition-colors text-sm font-medium"
              >
                <Filter className="h-4 w-4" />
                Filtrer & Trier
              </button>
            </div>
            <p className="font-body text-xs sm:text-sm text-slate-500">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'produit trouvé' : 'produits trouvés'}
            </p>
          </div>
        </AnimatedContainer>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-pulse"
              >
                <div className="aspect-square bg-slate-200" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                  <div className="h-6 bg-slate-200 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="font-body text-sm text-red-600">{error}</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="font-body text-sm text-slate-500">
              Aucun produit trouvé
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product, index) => (
              <AnimatedContainer key={product.id} direction="up" delay={index * 0.05}>
                <ProductCard
                  id={product.id}
                  title={product.title}
                  imageUrl={product.images[0] || ''}
                  price={product.final_price_xof}
                  oldPrice={product.compare_at_price ?? null}
                  newPrice={product.final_price_xof}
                  reductionPercentage={product.discount_percentage ?? 0}
                  badge={product.is_new ? 'nouveau' : undefined}
                  shippingEstimate="10-15j"
                  rating={product.rating ?? 0}
                  isNew={product.is_new ?? false}
                  description={product.description || undefined}
                  stockQuantity={product.stock_quantity ?? undefined}
                  minQuantityToSell={product.min_quantity_to_sell ?? undefined}
                  specs={product.specs ?? []}
                  category={product.category ?? null}
                  subcategory={product.subcategory ?? null}
                  subsubcategory={product.subsubcategory ?? null}
                />
              </AnimatedContainer>
            ))}
          </div>
        )}

        {/* Filters Drawer */}
        <FiltersDrawer
          isOpen={showFilters}
          onClose={() => setShowFilters(false)}
          filters={filters}
          onFiltersChange={setFilters}
          availableSubcategories={getSubcategories(allProducts)}
          priceRange={getPriceRange(allProducts)}
        />
      </div>
    </div>
  );
}


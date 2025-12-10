'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getProducts, searchProducts, getProductsByCategory } from '@/lib/products';
import ProductCard from '@/components/ProductCard';
import AnimatedContainer from '@/components/AnimatedContainer';
import StickyFilterBar from '@/components/StickyFilterBar';
import PowerFiltersDrawer from '@/components/PowerFiltersDrawer';
import FiltersSidebar from '@/components/FiltersSidebar';
import { applyFilters, getPriceRange, getSubcategories } from '@/lib/filters';
import { useProductFilters } from '@/lib/useProductFilters';
import type { Product } from '@/lib/products';

function ProductsContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const searchQuery = searchParams.get('q');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Use Zustand store for filters
  const filters = useProductFilters();

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
          filters.setFilters({
            priceRange: [priceRange.min, priceRange.max],
          });
          
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

  // Apply filters when they change (instant filtering)
  useEffect(() => {
    if (allProducts.length > 0) {
      const filtered = applyFilters(allProducts, {
        inStockAbidjan: filters.inStockAbidjan,
        sortBy: filters.sortBy,
        priceRange: filters.priceRange,
        selectedSubcategories: filters.selectedSubcategories,
      });
      setFilteredProducts(filtered);
    }
  }, [filters.inStockAbidjan, filters.sortBy, filters.priceRange, filters.selectedSubcategories, allProducts]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sticky Filter Bar - Mobile */}
      <div className="lg:hidden">
        <StickyFilterBar 
          onOpenDrawer={() => setShowFilters(true)} 
          productCount={filteredProducts.length}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <AnimatedContainer direction="up" delay={0.1}>
              <div className="mb-6">
                <h1 className="font-title text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                  {searchQuery
                    ? `Résultats pour "${searchQuery}"`
                    : category
                    ? `Catégorie: ${category}`
                    : 'Tous les produits'}
                </h1>
                <p className="font-body text-xs sm:text-sm text-slate-500">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'produit trouvé' : 'produits trouvés'}
                </p>
              </div>
            </AnimatedContainer>

            {/* Products Grid */}
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
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
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
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
          </div>

          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block">
            <FiltersSidebar
              isOpen={true}
              onClose={() => {}}
              availableSubcategories={getSubcategories(allProducts)}
              priceRange={getPriceRange(allProducts)}
              productCount={filteredProducts.length}
            />
          </div>
        </div>

        {/* Power Filters Drawer - Mobile */}
        <PowerFiltersDrawer
          isOpen={showFilters}
          onClose={() => setShowFilters(false)}
          availableSubcategories={getSubcategories(allProducts)}
          priceRange={getPriceRange(allProducts)}
          allProducts={allProducts}
        />
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-body text-slate-600">Chargement...</p>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}


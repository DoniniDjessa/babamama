'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import ProductCard from '@/components/ProductCard';
import AnimatedContainer from '@/components/AnimatedContainer';
import type { Product } from '@/lib/products';

export default function PromosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPromoProducts = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('ali-products')
          .select('*')
          .eq('is_active', true)
          .gt('discount_percentage', 0)
          .order('discount_percentage', { ascending: false });

        if (fetchError) {
          setError('Erreur lors du chargement des promos');
          console.error(fetchError);
        } else {
          setProducts((data as Product[]) || []);
        }
      } catch (err) {
        setError('Une erreur est survenue');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPromoProducts();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <AnimatedContainer direction="up" delay={0.1}>
          <div className="mb-6">
            <h1 className="font-title text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
              💎 Les Bonnes Affaires
            </h1>
            <p className="font-body text-xs sm:text-sm text-slate-500">
              {products.length} {products.length === 1 ? 'produit en promo' : 'produits en promo'}
            </p>
          </div>
        </AnimatedContainer>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
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
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="font-body text-sm text-slate-500">
              Aucune promotion disponible pour le moment
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product, index) => (
              <AnimatedContainer key={product.id} direction="up" delay={index * 0.05}>
                <ProductCard
                  id={product.id}
                  title={product.title}
                  imageUrl={product.images[0] || ''}
                  price={product.final_price_xof}
                  oldPrice={product.compare_at_price ?? null}
                  newPrice={product.final_price_xof}
                  reductionPercentage={product.discount_percentage ?? 0}
                  badge="populaire"
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
    </div>
  );
}


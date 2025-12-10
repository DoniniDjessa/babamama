'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getProducts } from '@/lib/products';
import ProductCard from '@/components/ProductCard';
import AnimatedContainer from '@/components/AnimatedContainer';
import type { Product } from '@/lib/products';

// Collection themes mapping
const COLLECTIONS: Record<string, { title: string; description: string; filter: (p: Product) => boolean }> = {
  'idees-cadeaux-homme': {
    title: 'Idées Cadeaux Homme',
    description: 'Des cadeaux parfaits pour lui',
    filter: (p) => p.category === 'MODE' || p.category === 'AUTO' || p.subcategory?.includes('Homme') || false,
  },
  'idees-cadeaux-femme': {
    title: 'Idées Cadeaux Femme',
    description: 'Des cadeaux parfaits pour elle',
    filter: (p) => p.category === 'BEAUTE' || p.category === 'MODE' || p.subcategory?.includes('Femme') || false,
  },
  'high-tech-essentiel': {
    title: 'High-Tech Essentiel',
    description: 'Les gadgets tech indispensables',
    filter: (p) => p.category === 'HIGH-TECH',
  },
  'maison-smart': {
    title: 'Maison Smart',
    description: 'Transformez votre intérieur',
    filter: (p) => p.category === 'MAISON',
  },
};

export default function CollectionPage() {
  const params = useParams();
  const slug = params.slug as string;
  const collection = COLLECTIONS[slug];

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCollectionProducts = async () => {
      if (!collection) {
        setError('Collection introuvable');
        setLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await getProducts();
        if (fetchError) {
          setError('Erreur lors du chargement');
          console.error(fetchError);
        } else {
          const allProducts = data || [];
          const filtered = allProducts.filter(collection.filter);
          setProducts(filtered);
        }
      } catch (err) {
        setError('Une erreur est survenue');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCollectionProducts();
  }, [slug, collection]);

  if (!collection) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="font-title text-xl font-bold text-slate-900 mb-2">Collection introuvable</h2>
          <p className="font-body text-sm text-slate-600">Cette collection n'existe pas</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <AnimatedContainer direction="up" delay={0.1}>
          <div className="mb-6 text-center">
            <h1 className="font-title text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
              {collection.title}
            </h1>
            <p className="font-body text-sm text-slate-600">{collection.description}</p>
            <p className="font-body text-xs text-slate-500 mt-2">
              {products.length} {products.length === 1 ? 'produit' : 'produits'}
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
            <p className="font-body text-sm text-slate-500">Aucun produit dans cette collection</p>
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
    </div>
  );
}


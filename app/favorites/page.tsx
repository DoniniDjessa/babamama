'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, ArrowRight } from 'lucide-react';
import { getUser } from '@/lib/auth';
import { getFavoriteProducts } from '@/lib/favorites';
import ProductCard from '@/components/ProductCard';
import AnimatedContainer from '@/components/AnimatedContainer';
import type { Product } from '@/lib/products';

export default function FavoritesPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const { data: authUser, error: authError } = await getUser();

        if (authError || !authUser?.user) {
          router.push('/login');
          return;
        }

        const { data: favoriteProducts, error: favError } = await getFavoriteProducts(
          authUser.user.id
        );

        if (favError) {
          setError('Erreur lors du chargement de vos favoris');
          console.error(favError);
        } else {
          setProducts(favoriteProducts || []);
        }
      } catch (err) {
        setError('Une erreur est survenue');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-100px)] bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-body text-slate-600">Chargement de vos favoris...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <AnimatedContainer direction="up" delay={0.1}>
        <div className="min-h-[calc(100vh-100px)] bg-slate-50 flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <p className="font-body text-sm text-red-600 mb-6">{error}</p>
            <Link
              href="/"
              className="font-body inline-block px-6 py-3 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition-colors"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </AnimatedContainer>
    );
  }

  if (products.length === 0) {
    return (
      <AnimatedContainer direction="up" delay={0.1}>
        <div className="min-h-[calc(100vh-100px)] bg-slate-50 flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center">
              <Heart className="w-12 h-12 text-slate-400" />
            </div>
            <h2 className="font-title text-2xl font-bold text-slate-900 mb-2">
              Aucun favori
            </h2>
            <p className="font-body text-sm text-slate-600 mb-6">
              Ajoutez des produits à vos favoris pour les retrouver facilement
            </p>
            <Link
              href="/products"
              className="font-body inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition-colors"
            >
              Découvrir les produits
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </AnimatedContainer>
    );
  }

  return (
    <div className="min-h-[calc(100vh-100px)] bg-slate-50 pb-6">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <AnimatedContainer direction="up" delay={0.1}>
          <h1 className="font-title text-2xl sm:text-3xl font-bold text-slate-900 mb-6">
            Mes Favoris
          </h1>
        </AnimatedContainer>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product, index) => (
            <AnimatedContainer key={product.id} direction="up" delay={index * 0.05}>
              <ProductCard
                id={product.id}
                title={product.title}
                imageUrl={product.images[0] || ''}
                price={product.final_price_xof}
                oldPrice={product.compare_at_price ?? product.old_price_xof ?? null}
                newPrice={product.final_price_xof}
                reductionPercentage={product.discount_percentage ?? product.reduction_percentage ?? 0}
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
      </div>
    </div>
  );
}


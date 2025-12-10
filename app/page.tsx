'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getProducts } from '@/lib/products';
import ProductCard from '@/components/ProductCard';
import HeroSection from '@/components/HeroSection';
import TrustBar from '@/components/TrustBar';
import CategoryScroll from '@/components/CategoryScroll';
import FlashDeal from '@/components/FlashDeal';
import HowItWorks from '@/components/HowItWorks';
import BentoGrid from '@/components/BentoGrid';
import SocialProof from '@/components/SocialProof';
import WhatsAppVIP from '@/components/WhatsAppVIP';
import AnimatedContainer from '@/components/AnimatedContainer';
import type { Product } from '@/lib/products';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const PRODUCTS_PER_PAGE = 10;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error: fetchError } = await getProducts();
        if (fetchError) {
          setError('Erreur lors du chargement des produits');
          console.error(fetchError);
        } else {
          const allProducts = data || [];
          setProducts(allProducts.slice(0, PRODUCTS_PER_PAGE));
          setHasMore(allProducts.length > PRODUCTS_PER_PAGE);
        }
      } catch (err) {
        setError('Une erreur est survenue');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    // Infinite scroll observer
    if (!hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreProducts();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loading]);

  const loadMoreProducts = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const { data } = await getProducts();
      const allProducts = data || [];
      const nextPage = page + 1;
      const startIndex = nextPage * PRODUCTS_PER_PAGE;
      const endIndex = startIndex + PRODUCTS_PER_PAGE;
      const newProducts = allProducts.slice(startIndex, endIndex);

      if (newProducts.length > 0) {
        setProducts((prev) => [...prev, ...newProducts]);
        setPage(nextPage);
        setHasMore(endIndex < allProducts.length);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error loading more products:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* SECTION A: Hero Header */}
      <HeroSection />

      {/* SECTION B: Category Scroll */}
      <CategoryScroll />

      {/* SECTION C: Trust Bar */}
      <TrustBar />

      {/* SECTION D: How It Works */}
      <HowItWorks />

      {/* SECTION E: Flash Deal */}
      <FlashDeal />

      {/* SECTION F: Bento Grid Collections */}
      <BentoGrid />

      {/* SECTION G: Masonry Feed */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <AnimatedContainer direction="up" delay={0.2}>
          <div className="flex items-center justify-between mb-6 px-4">
            <div>
              <h2 className="font-title text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
                Juste pour vous
              </h2>
              <p className="font-body text-sm text-slate-500">
                Produits sélectionnés selon vos préférences
              </p>
            </div>
            <Link
              href="/products"
              className="font-body hidden sm:flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Voir tout
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </AnimatedContainer>

        {loading && products.length === 0 ? (
          <div className="grid grid-cols-2 gap-4 px-4">
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
          <div className="text-center py-12 px-4">
            <p className="font-body text-sm text-red-600">{error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 px-4">
            <p className="font-body text-sm text-slate-500">
              Aucun produit disponible pour le moment
          </p>
        </div>
        ) : (
          <>
            {/* Enhanced Grid - Larger cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 px-4">
              {products.map((product, index) => (
                <AnimatedContainer
                  key={product.id}
                  direction="up"
                  delay={index * 0.03}
                >
                  <div className="h-full">
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
                      compact={false}
                      stockQuantity={product.stock_quantity ?? undefined}
                      minQuantityToSell={product.min_quantity_to_sell ?? undefined}
                      specs={product.specs ?? []}
                      category={product.category ?? null}
                      subcategory={product.subcategory ?? null}
                      subsubcategory={product.subsubcategory ?? null}
                    />
                  </div>
                </AnimatedContainer>
              ))}
            </div>

            {/* Infinite Scroll Trigger */}
            {hasMore && (
              <div ref={loadMoreRef} className="py-8 text-center">
                {loading && (
                  <div className="flex justify-center gap-2">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce delay-75" />
                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce delay-150" />
                  </div>
                )}
              </div>
            )}
          </>
        )}
        </div>

      {/* SECTION H: Social Proof */}
      <SocialProof />

      {/* SECTION I: WhatsApp VIP */}
      <WhatsAppVIP />
    </div>
  );
}

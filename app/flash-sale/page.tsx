'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Clock } from 'lucide-react';
import { getFlashSaleProducts, type Product } from '@/lib/products';
import ProductCard from '@/components/ProductCard';
import AnimatedContainer from '@/components/AnimatedContainer';

export default function FlashSalePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    const fetchFlashProducts = async () => {
      try {
        // Use the getFlashSaleProducts function from lib/products
        const { data, error } = await getFlashSaleProducts();

        if (error) {
          if (process.env.NODE_ENV === 'development') {
            console.error('Error fetching flash products:', error);
          }
        } else {
          setProducts(data || []);
          
          // Calculate time left from first product
          if (data && data.length > 0 && data[0].flash_sale_end_at) {
            const endDate = new Date(data[0].flash_sale_end_at);
            const now = new Date();
            const diff = endDate.getTime() - now.getTime();
            
            if (diff > 0) {
              setTimeLeft({
                hours: Math.floor(diff / (1000 * 60 * 60)),
                minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((diff % (1000 * 60)) / 1000),
              });
            }
          }
        }
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error:', err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFlashProducts();

    // Timer countdown
    const timer = setInterval(() => {
      if (products.length > 0 && products[0].flash_sale_end_at) {
        const endDate = new Date(products[0].flash_sale_end_at);
        const now = new Date();
        const diff = endDate.getTime() - now.getTime();
        
        if (diff > 0) {
          setTimeLeft({
            hours: Math.floor(diff / (1000 * 60 * 60)),
            minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((diff % (1000 * 60)) / 1000),
          });
        } else {
          setTimeLeft(null);
        }
      }
      
      setIsPulsing(true);
      setTimeout(() => setIsPulsing(false), 300);
    }, 1000);

    return () => clearInterval(timer);
  }, [products]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-body text-slate-600">Chargement des ventes flash...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-red-50">
      {/* Sticky Countdown Header */}
      {timeLeft && (
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="sticky top-0 z-40 bg-gradient-to-r from-red-600 via-orange-600 to-red-600 text-white shadow-lg"
        >
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-center gap-4">
              <motion.div
                animate={isPulsing ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <Zap className="h-5 w-5" />
              </motion.div>
              <span className="font-title text-sm sm:text-base font-bold">
                FIN DE LA VENTE DANS :
              </span>
              <div className="flex items-center gap-2 font-mono text-lg sm:text-xl font-bold">
                <span className="bg-white/20 px-2 py-1 rounded">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span>:</span>
                <span className="bg-white/20 px-2 py-1 rounded">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span>:</span>
                <motion.span
                  key={timeLeft.seconds}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  className="bg-white/20 px-2 py-1 rounded"
                >
                  {String(timeLeft.seconds).padStart(2, '0')}
                </motion.span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <AnimatedContainer direction="up" delay={0.1}>
          <div className="text-center mb-8">
            <h1 className="font-title text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
              🔥 VENTE FLASH
            </h1>
            <p className="font-body text-sm text-slate-600">
              Offres limitées dans le temps - Ne manquez pas ces prix exceptionnels !
            </p>
          </div>
        </AnimatedContainer>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/50 flex items-center justify-center">
              <Zap className="w-12 h-12 text-orange-400" />
            </div>
            <h2 className="font-title text-xl font-bold text-slate-900 mb-2">
              Aucune vente flash active
            </h2>
            <p className="font-body text-sm text-slate-600">
              Revenez bientôt pour découvrir nos prochaines offres flash !
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product, index) => (
              <AnimatedContainer key={product.id} direction="up" delay={index * 0.05}>
                <div className="relative">
                  {/* Flash Badge */}
                  <div className="absolute -top-2 -right-2 z-20 bg-gradient-to-r from-red-500 to-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg animate-pulse">
                    FLASH
                  </div>
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
                    stockQuantity={product.flash_sale_stock ?? product.stock_quantity ?? undefined}
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
        )}
      </div>
    </div>
  );
}


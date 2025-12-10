'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Clock, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { getFlashSaleProducts, getTopRatedProducts } from '@/lib/products';
import ProductCard from './ProductCard';
import type { Product } from '@/lib/products';

export default function FlashDeal() {
  const [products, setProducts] = useState<Product[]>([]);
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);
  const [isPulsing, setIsPulsing] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch flash sale products - prioritize admin flash sales, fallback to top rated
    const fetchFlashProducts = async () => {
      // First, try to get admin flash sale products
      const { data: flashProducts, source } = await getFlashSaleProducts();
      
      if (flashProducts && flashProducts.length > 0 && source === 'admin') {
        // Use admin flash sale products (limit to 10 for carousel)
        const limitedProducts = flashProducts.slice(0, 10);
        setProducts(limitedProducts);
        
        // Calculate countdown from first product
        if (limitedProducts[0]?.flash_sale_end_at) {
          const endDate = new Date(limitedProducts[0].flash_sale_end_at);
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
      } else {
        // Fallback: use top rated products (10 best rated)
        const { data: topRated } = await getTopRatedProducts(10);
        if (topRated) {
          setProducts(topRated);
        }
      }
    };

    fetchFlashProducts();

    // Timer countdown (only if we have flash sale products with end date)
    const timer = setInterval(() => {
      if (products.length > 0 && products[0]?.flash_sale_end_at) {
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
    }, 1000);

    // Pulse animation every second
    const pulseTimer = setInterval(() => {
      setIsPulsing(true);
      setTimeout(() => setIsPulsing(false), 300);
    }, 1000);

    return () => {
      clearInterval(timer);
      clearInterval(pulseTimer);
    };
  }, [products]);

  if (products.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative bg-gradient-to-r from-orange-50 via-red-50 to-orange-50 border-y border-orange-200 py-4 sm:py-6 md:py-8 px-2 sm:px-4 overflow-hidden"
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,140,0,0.3),transparent_50%)] animate-pulse" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-4">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg"
            >
              <Zap className="h-6 w-6 text-white" />
            </motion.div>
            <div>
              <h2 className="font-title text-xl sm:text-2xl font-bold text-slate-900">
                🔥 Vente Flash
              </h2>
              <p className="font-body text-xs text-slate-600">Offres limitées dans le temps</p>
            </div>
          </div>
          
          {/* Enhanced Timer - Only show if we have flash sale products with countdown */}
          {timeLeft && (
            <motion.div
              animate={isPulsing ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md border border-orange-200"
            >
              <Clock className="h-4 w-4 text-orange-600" />
              <div className="flex items-center gap-1 font-body text-sm">
                <span className="font-bold text-orange-600">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-slate-500">h</span>
                <span className="font-bold text-orange-600">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-slate-500">m</span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={timeLeft.seconds}
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 10, opacity: 0 }}
                    className="font-bold text-orange-600"
                  >
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </motion.span>
                </AnimatePresence>
                <span className="text-slate-500">s</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Products Grid - Shows 2 on mobile, 5 on desktop, scrollable to see remaining */}
        <div className="relative">
          {/* Navigation Buttons - Desktop only */}
          <button
            onClick={() => {
              if (scrollContainerRef.current) {
                const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
                scrollContainerRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
              }
            }}
            className="hidden lg:flex absolute left-2 top-1/2 -translate-y-1/2 z-30 p-3 bg-white rounded-full shadow-xl border-2 border-slate-200 hover:bg-slate-50 hover:border-indigo-500 transition-all items-center justify-center"
            aria-label="Précédent"
            style={{ zIndex: 30 }}
          >
            <ChevronLeft className="w-6 h-6 text-slate-700" />
          </button>
          <button
            onClick={() => {
              if (scrollContainerRef.current) {
                const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
                scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
              }
            }}
            className="hidden lg:flex absolute right-2 top-1/2 -translate-y-1/2 z-30 p-3 bg-white rounded-full shadow-xl border-2 border-slate-200 hover:bg-slate-50 hover:border-indigo-500 transition-all items-center justify-center"
            aria-label="Suivant"
            style={{ zIndex: 30 }}
          >
            <ChevronRight className="w-6 h-6 text-slate-700" />
          </button>
          
          <div 
            ref={scrollContainerRef}
            className="flex gap-2 sm:gap-3 md:gap-4 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory scroll-smooth lg:px-0"
          >
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100,
                  damping: 15
                }}
                whileHover={{ scale: 1.02 }}
                className="flex-shrink-0 w-[calc(50%-4px)] sm:w-[calc(33.333%-8px)] md:w-[calc(25%-9px)] lg:w-[calc(20%-12px)] min-w-[140px] sm:min-w-[160px] md:min-w-[180px] lg:min-w-[200px] snap-start"
              >
              <div className="relative">
                {/* Flash badge overlay */}
                <div className="absolute -top-2 -right-2 z-20 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg animate-pulse">
                  FLASH
                </div>
                <ProductCard
                  id={product.id}
                  title={product.title}
                  imageUrl={product.images[0] || ''}
                  price={product.final_price_xof}
                  oldPrice={product.compare_at_price ?? product.old_price_xof ?? null}
                  newPrice={product.final_price_xof}
                  reductionPercentage={product.discount_percentage ?? product.reduction_percentage ?? 0}
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
              </div>
            </motion.div>
          ))}
          </div>
        </div>

        {/* View All Link */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-center mt-4 sm:mt-6"
        >
          <Link
            href="/flash-sale"
            className="font-body inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-red-500 rounded-full shadow-md hover:shadow-lg hover:from-orange-600 hover:to-red-600 transition-all"
          >
            Voir toutes les ventes flash
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}


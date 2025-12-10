'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Clock, ArrowRight } from 'lucide-react';
import { getProducts } from '@/lib/products';
import ProductCard from './ProductCard';
import type { Product } from '@/lib/products';

export default function FlashDeal() {
  const [products, setProducts] = useState<Product[]>([]);
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 23, seconds: 0 });
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    // Fetch flash sale products (you can filter by a specific category or tag)
    const fetchFlashProducts = async () => {
      const { data } = await getProducts(5);
      if (data) {
        setProducts(data.slice(0, 4)); // Take first 4 products
      }
    };

    fetchFlashProducts();

    // Timer countdown
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        }
        return { hours, minutes, seconds };
      });
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
  }, []);

  if (products.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative bg-gradient-to-r from-orange-50 via-red-50 to-orange-50 border-y border-orange-200 py-8 px-4 overflow-hidden"
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,140,0,0.3),transparent_50%)] animate-pulse" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
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
          
          {/* Enhanced Timer */}
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
        </div>

        {/* Products Scroll */}
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory">
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
              className="flex-shrink-0 w-[180px] sm:w-[200px] snap-start"
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

        {/* View All Link */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-center mt-6"
        >
          <Link
            href="/flash-sale"
            className="font-body inline-flex items-center gap-1.5 px-4 py-2 text-sm text-slate-600 hover:text-slate-900 font-medium transition-colors"
          >
            Voir
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}


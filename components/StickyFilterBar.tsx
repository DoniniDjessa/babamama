'use client';

import { motion } from 'framer-motion';
import { SlidersHorizontal, Package } from 'lucide-react';
import { useProductFilters } from '@/lib/useProductFilters';

interface StickyFilterBarProps {
  onOpenDrawer: () => void;
  productCount: number;
}

export default function StickyFilterBar({ onOpenDrawer, productCount }: StickyFilterBarProps) {
  const { inStockAbidjan, toggleStock } = useProductFilters();

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="sticky top-[56px] z-40 bg-white border-b border-slate-200 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-[45px]">
          {/* Left: Stock Toggle */}
          <button
            onClick={toggleStock}
            className="flex items-center gap-2 group"
          >
            <div className="relative">
              <div
                className={`w-11 h-6 rounded-full transition-colors ${
                  inStockAbidjan ? 'bg-green-500' : 'bg-slate-300'
                }`}
              >
                <motion.div
                  animate={{
                    x: inStockAbidjan ? 20 : 2,
                  }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
                />
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Package className={`w-4 h-4 ${inStockAbidjan ? 'text-green-600' : 'text-slate-400'}`} />
              <span className={`font-body text-xs font-medium transition-colors ${
                inStockAbidjan ? 'text-green-600' : 'text-slate-600'
              }`}>
                Livré en 24h
              </span>
            </div>
          </button>

          {/* Right: Filter Button */}
          <button
            onClick={onOpenDrawer}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4 text-slate-600" />
            <span className="font-body text-xs font-medium text-slate-700">
              Trier & Filtrer
            </span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}


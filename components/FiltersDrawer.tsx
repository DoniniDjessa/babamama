'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, SlidersHorizontal, Package, TrendingUp, TrendingDown, Sparkles } from 'lucide-react';

export type SortOption = 'popular' | 'newest' | 'price-asc' | 'price-desc';
export type FilterState = {
  inStockAbidjan: boolean;
  sortBy: SortOption;
  priceRange: [number, number];
  selectedSubcategories: string[];
};

interface FiltersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  availableSubcategories: string[];
  priceRange: { min: number; max: number };
}

export default function FiltersDrawer({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  availableSubcategories,
  priceRange,
}: FiltersDrawerProps) {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);

  const handleApply = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters: FilterState = {
      inStockAbidjan: false,
      sortBy: 'popular',
      priceRange: [priceRange.min, priceRange.max],
      selectedSubcategories: [],
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  const sortOptions: { value: SortOption; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { value: 'popular', label: 'Populaire', icon: TrendingUp },
    { value: 'newest', label: 'Nouveautés', icon: Sparkles },
    { value: 'price-asc', label: 'Prix croissant', icon: TrendingUp },
    { value: 'price-desc', label: 'Prix décroissant', icon: TrendingDown },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 max-h-[85vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5 text-indigo-600" />
                <h2 className="font-title text-lg font-bold text-slate-900">Filtrer & Trier</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="h-5 w-5 text-slate-600" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* 1. Switch Disponibilité */}
              <div>
                <label className="font-body text-sm font-medium text-slate-700 mb-3 block">
                  Disponibilité
                </label>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-indigo-600" />
                    <div>
                      <span className="font-body text-sm font-medium text-slate-900 block">
                        📦 En Stock Abidjan (24h)
                      </span>
                      <span className="font-body text-xs text-slate-500">
                        Livraison express
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setLocalFilters({ ...localFilters, inStockAbidjan: !localFilters.inStockAbidjan })
                    }
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      localFilters.inStockAbidjan ? 'bg-indigo-600' : 'bg-slate-300'
                    }`}
                  >
                    <motion.div
                      animate={{
                        x: localFilters.inStockAbidjan ? 24 : 0,
                      }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md"
                    />
                  </button>
                </div>
              </div>

              {/* 2. Tri */}
              <div>
                <label className="font-body text-sm font-medium text-slate-700 mb-3 block">
                  Trier par
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {sortOptions.map((option) => {
                    const Icon = option.icon;
                    const isSelected = localFilters.sortBy === option.value;
                    return (
                      <button
                        key={option.value}
                        onClick={() => setLocalFilters({ ...localFilters, sortBy: option.value })}
                        className={`font-body flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-medium'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="text-sm">{option.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Fourchette de Prix */}
              <div>
                <label className="font-body text-sm font-medium text-slate-700 mb-3 block">
                  Fourchette de prix
                </label>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-body text-slate-600">
                      {formatPrice(localFilters.priceRange[0])}
                    </span>
                    <span className="font-body text-slate-600">
                      {formatPrice(localFilters.priceRange[1])}
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="range"
                      min={priceRange.min}
                      max={priceRange.max}
                      value={localFilters.priceRange[0]}
                      onChange={(e) =>
                        setLocalFilters({
                          ...localFilters,
                          priceRange: [
                            Math.min(Number(e.target.value), localFilters.priceRange[1] - 1000),
                            localFilters.priceRange[1],
                          ],
                        })
                      }
                      className="absolute w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #4f46e5 0%, #4f46e5 ${
                          ((localFilters.priceRange[0] - priceRange.min) /
                            (priceRange.max - priceRange.min)) *
                          100
                        }%, #e2e8f0 ${
                          ((localFilters.priceRange[0] - priceRange.min) /
                            (priceRange.max - priceRange.min)) *
                          100
                        }%, #e2e8f0 100%)`,
                      }}
                    />
                    <input
                      type="range"
                      min={priceRange.min}
                      max={priceRange.max}
                      value={localFilters.priceRange[1]}
                      onChange={(e) =>
                        setLocalFilters({
                          ...localFilters,
                          priceRange: [
                            localFilters.priceRange[0],
                            Math.max(Number(e.target.value), localFilters.priceRange[0] + 1000),
                          ],
                        })
                      }
                      className="absolute w-full h-2 bg-transparent rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Sous-Catégories */}
              {availableSubcategories.length > 0 && (
                <div>
                  <label className="font-body text-sm font-medium text-slate-700 mb-3 block">
                    Sous-catégories
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableSubcategories.map((subcat) => {
                      const isSelected = localFilters.selectedSubcategories.includes(subcat);
                      return (
                        <button
                          key={subcat}
                          onClick={() => {
                            const newSubcats = isSelected
                              ? localFilters.selectedSubcategories.filter((s) => s !== subcat)
                              : [...localFilters.selectedSubcategories, subcat];
                            setLocalFilters({ ...localFilters, selectedSubcategories: newSubcats });
                          }}
                          className={`font-body px-3 py-1.5 rounded-full text-xs transition-all ${
                            isSelected
                              ? 'bg-indigo-600 text-white font-medium'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {subcat}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-slate-200 p-4 flex gap-3">
              <button
                onClick={handleReset}
                className="font-body flex-1 px-4 py-3 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors text-sm font-medium"
              >
                Réinitialiser
              </button>
              <button
                onClick={handleApply}
                className="font-body flex-1 px-4 py-3 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 transition-all text-sm font-bold shadow-lg shadow-indigo-500/30"
              >
                Appliquer
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}


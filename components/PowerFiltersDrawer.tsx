'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, TrendingDown, Sparkles, RotateCcw, Package, SlidersHorizontal } from 'lucide-react';
import { useProductFilters, type SortOption } from '@/lib/useProductFilters';
import type { Product } from '@/lib/products';
import { applyFilters } from '@/lib/filters';

interface PowerFiltersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  availableSubcategories: string[];
  priceRange: { min: number; max: number };
  allProducts: Product[];
}

const sortOptions: { value: SortOption; label: string; icon: React.ComponentType<{ className?: string }>; emoji: string }[] = [
  { value: 'popular', label: 'Populaire', icon: TrendingUp, emoji: '🔥' },
  { value: 'newest', label: 'Nouveautés', icon: Sparkles, emoji: '🆕' },
  { value: 'price-asc', label: 'Prix Croissant', icon: TrendingUp, emoji: '💰' },
  { value: 'price-desc', label: 'Prix Décroissant', icon: TrendingDown, emoji: '📉' },
];

const priceChips = [
  { id: 'under-5k', label: '- de 5.000 F', range: [1000, 5000] },
  { id: '5k-15k', label: '5k - 15k', range: [5000, 15000] },
  { id: '15k-50k', label: '15k - 50k', range: [15000, 50000] },
  { id: 'premium', label: 'Premium', range: [50000, 1000000] },
];

export default function PowerFiltersDrawer({
  isOpen,
  onClose,
  availableSubcategories,
  priceRange,
  allProducts,
}: PowerFiltersDrawerProps) {
  const filters = useProductFilters();
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>(filters.priceRange);
  const [filteredCount, setFilteredCount] = useState(0);

  // Update local state when filters change
  useEffect(() => {
    setLocalPriceRange(filters.priceRange);
  }, [filters.priceRange]);

  // Calculate filtered count
  useEffect(() => {
    const testFilters = {
      ...filters,
      priceRange: localPriceRange,
    };
    const filtered = applyFilters(allProducts, testFilters);
    setFilteredCount(filtered.length);
  }, [filters, localPriceRange, allProducts]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleApply = () => {
    filters.setPriceRange(localPriceRange);
    onClose();
  };

  const handleReset = () => {
    filters.reset();
    setLocalPriceRange([priceRange.min, priceRange.max]);
  };

  const activeFiltersCount = filters.getActiveFiltersCount();

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
            className="fixed bottom-0 left-0 right-0 h-[85vh] bg-white rounded-t-3xl shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5 text-indigo-600" />
                <h2 className="font-title text-lg font-bold text-slate-900">Filtres</h2>
                {activeFiltersCount > 0 && (
                  <span className="font-body text-xs font-medium bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="h-5 w-5 text-slate-600" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {/* 1. Stock Toggle (Duplicate from sticky bar for consistency) */}
              <div>
                <label className="font-body text-sm font-medium text-slate-700 mb-3 block">
                  Disponibilité
                </label>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-indigo-600" />
                    <div>
                      <span className="font-body text-sm font-medium text-slate-900 block">
                        📦 Livré en 24h (Stock Abidjan)
                      </span>
                      <span className="font-body text-xs text-slate-500">
                        Livraison express
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={filters.toggleStock}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      filters.inStockAbidjan ? 'bg-green-500' : 'bg-slate-300'
                    }`}
                  >
                    <motion.div
                      animate={{
                        x: filters.inStockAbidjan ? 24 : 2,
                      }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
                    />
                  </button>
                </div>
              </div>

              {/* 2. Quick Sort Chips */}
              <div>
                <label className="font-body text-sm font-medium text-slate-700 mb-3 block">
                  Trier par
                </label>
                <div className="flex flex-wrap gap-2">
                  {sortOptions.map((option) => {
                    const Icon = option.icon;
                    const isSelected = filters.sortBy === option.value;
                    return (
                      <button
                        key={option.value}
                        onClick={() => filters.setSort(option.value)}
                        className={`font-body flex items-center gap-2 px-4 py-2.5 rounded-full border-2 transition-all ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-medium'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <span className="text-sm">{option.emoji}</span>
                        <span className="text-sm">{option.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Quick Price Chips */}
              <div>
                <label className="font-body text-sm font-medium text-slate-700 mb-3 block">
                  Budget
                </label>
                <div className="flex flex-wrap gap-2">
                  {priceChips.map((chip) => {
                    const isSelected = filters.priceChip === chip.id;
                    return (
                      <button
                        key={chip.id}
                        onClick={() => filters.setPriceChip(isSelected ? undefined : chip.id)}
                        className={`font-body px-4 py-2.5 rounded-full border-2 transition-all ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-medium'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <span className="text-sm">{chip.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Dual Range Slider */}
              <div>
                <label className="font-body text-sm font-medium text-slate-700 mb-3 block">
                  Fourchette de prix précise
                </label>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-body font-medium text-indigo-600">
                      {formatPrice(localPriceRange[0])}
                    </span>
                    <span className="font-body text-xs text-slate-400">à</span>
                    <span className="font-body font-medium text-indigo-600">
                      {formatPrice(localPriceRange[1])}
                    </span>
                  </div>
                  
                  {/* Dual Range Slider Container */}
                  <div className="relative h-6 flex items-center">
                    {/* Track background */}
                    <div className="absolute w-full h-2 bg-slate-200 rounded-full" />
                    
                    {/* Active range track */}
                    <div
                      className="absolute h-2 bg-indigo-600 rounded-full"
                      style={{
                        left: `${((localPriceRange[0] - priceRange.min) / (priceRange.max - priceRange.min)) * 100}%`,
                        width: `${((localPriceRange[1] - localPriceRange[0]) / (priceRange.max - priceRange.min)) * 100}%`,
                      }}
                    />
                    
                    {/* Min slider */}
                    <input
                      type="range"
                      min={priceRange.min}
                      max={priceRange.max}
                      step={1000}
                      value={localPriceRange[0]}
                      onChange={(e) => {
                        const newMin = Number(e.target.value);
                        const constrainedMin = Math.min(newMin, localPriceRange[1] - 1000);
                        setLocalPriceRange([constrainedMin, localPriceRange[1]]);
                        filters.setPriceChip(undefined);
                      }}
                      className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer z-10"
                      style={{
                        WebkitAppearance: 'none',
                        appearance: 'none',
                      }}
                    />
                    
                    {/* Max slider */}
                    <input
                      type="range"
                      min={priceRange.min}
                      max={priceRange.max}
                      step={1000}
                      value={localPriceRange[1]}
                      onChange={(e) => {
                        const newMax = Number(e.target.value);
                        const constrainedMax = Math.max(newMax, localPriceRange[0] + 1000);
                        setLocalPriceRange([localPriceRange[0], constrainedMax]);
                        filters.setPriceChip(undefined);
                      }}
                      className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer z-20"
                      style={{
                        WebkitAppearance: 'none',
                        appearance: 'none',
                      }}
                    />
                    
                    {/* Custom slider thumbs */}
                    <div
                      className="absolute w-4 h-4 bg-indigo-600 rounded-full shadow-lg border-2 border-white cursor-pointer z-30 transform -translate-x-1/2"
                      style={{
                        left: `${((localPriceRange[0] - priceRange.min) / (priceRange.max - priceRange.min)) * 100}%`,
                      }}
                    />
                    <div
                      className="absolute w-4 h-4 bg-indigo-600 rounded-full shadow-lg border-2 border-white cursor-pointer z-30 transform -translate-x-1/2"
                      style={{
                        left: `${((localPriceRange[1] - priceRange.min) / (priceRange.max - priceRange.min)) * 100}%`,
                      }}
                    />
                  </div>
                  
                  {/* Input fields */}
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="font-body text-xs text-slate-500 mb-1 block">Prix minimum (FCFA)</label>
                      <input
                        type="number"
                        min={priceRange.min}
                        max={priceRange.max}
                        step={1000}
                        value={localPriceRange[0]}
                        onChange={(e) => {
                          const inputVal = e.target.value;
                          // Allow empty input during typing
                          if (inputVal === '') {
                            setLocalPriceRange([priceRange.min, localPriceRange[1]]);
                            return;
                          }
                          const val = Number(inputVal);
                          // Allow any number during typing, validate on blur
                          if (!isNaN(val)) {
                            setLocalPriceRange([val, localPriceRange[1]]);
                            filters.setPriceChip(undefined);
                          }
                        }}
                        onBlur={(e) => {
                          const val = Number(e.target.value);
                          if (isNaN(val) || val < priceRange.min) {
                            setLocalPriceRange([priceRange.min, localPriceRange[1]]);
                          } else if (val >= localPriceRange[1]) {
                            setLocalPriceRange([Math.max(priceRange.min, localPriceRange[1] - 1000), localPriceRange[1]]);
                          } else {
                            setLocalPriceRange([val, localPriceRange[1]]);
                          }
                          filters.setPriceChip(undefined);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.currentTarget.blur();
                          }
                        }}
                        className="font-body w-full px-3 py-2.5 text-sm rounded-lg border border-slate-300 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                        placeholder={`Min: ${formatPrice(priceRange.min)}`}
                      />
                    </div>
                    <div className="flex items-end pb-6">
                      <span className="font-body text-slate-400 text-sm">à</span>
                    </div>
                    <div className="flex-1">
                      <label className="font-body text-xs text-slate-500 mb-1 block">Prix maximum (FCFA)</label>
                      <input
                        type="number"
                        min={priceRange.min}
                        max={priceRange.max}
                        step={1000}
                        value={localPriceRange[1]}
                        onChange={(e) => {
                          const inputVal = e.target.value;
                          // Allow empty input during typing
                          if (inputVal === '') {
                            setLocalPriceRange([localPriceRange[0], priceRange.max]);
                            return;
                          }
                          const val = Number(inputVal);
                          // Allow any number during typing, validate on blur
                          if (!isNaN(val)) {
                            setLocalPriceRange([localPriceRange[0], val]);
                            filters.setPriceChip(undefined);
                          }
                        }}
                        onBlur={(e) => {
                          const val = Number(e.target.value);
                          if (isNaN(val) || val > priceRange.max) {
                            setLocalPriceRange([localPriceRange[0], priceRange.max]);
                          } else if (val <= localPriceRange[0]) {
                            setLocalPriceRange([localPriceRange[0], Math.min(priceRange.max, localPriceRange[0] + 1000)]);
                          } else {
                            setLocalPriceRange([localPriceRange[0], val]);
                          }
                          filters.setPriceChip(undefined);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.currentTarget.blur();
                          }
                        }}
                        className="font-body w-full px-3 py-2.5 text-sm rounded-lg border border-slate-300 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                        placeholder={`Max: ${formatPrice(priceRange.max)}`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 5. Subcategories */}
              {availableSubcategories.length > 0 && (
                <div>
                  <label className="font-body text-sm font-medium text-slate-700 mb-3 block">
                    Sous-catégories
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableSubcategories.map((subcat) => {
                      const isSelected = filters.selectedSubcategories.includes(subcat);
                      return (
                        <button
                          key={subcat}
                          onClick={() => filters.toggleSubcategory(subcat)}
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
            <div className="border-t border-slate-200 p-4 sm:p-6 space-y-3 bg-white">
              <button
                onClick={handleReset}
                className="font-body w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors text-sm font-medium flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Réinitialiser
              </button>
              <button
                onClick={handleApply}
                className="font-body w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 transition-all text-sm font-bold shadow-lg shadow-indigo-500/30"
              >
                Voir {filteredCount} {filteredCount === 1 ? 'produit' : 'produits'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}


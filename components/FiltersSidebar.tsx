'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, SlidersHorizontal, Package, TrendingUp, TrendingDown, Sparkles, RotateCcw } from 'lucide-react';
import { useProductFilters, type SortOption } from '@/lib/useProductFilters';

interface FiltersSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  availableSubcategories: string[];
  priceRange: { min: number; max: number };
  productCount: number;
}

export default function FiltersSidebar({
  isOpen,
  onClose,
  availableSubcategories,
  priceRange,
  productCount,
}: FiltersSidebarProps) {
  const filters = useProductFilters();
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>(filters.priceRange);

  useEffect(() => {
    setLocalPriceRange(filters.priceRange);
  }, [filters.priceRange]);

  const handleReset = () => {
    filters.reset();
    setLocalPriceRange([priceRange.min, priceRange.max]);
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

  const activeFiltersCount = filters.getActiveFiltersCount();

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: isOpen ? 0 : '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl z-50 lg:relative lg:z-auto lg:shadow-none lg:max-w-xs lg:h-auto lg:translate-x-0"
      >
        <div className="flex flex-col h-full lg:h-auto">
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
              className="p-2 rounded-full hover:bg-slate-100 transition-colors lg:hidden"
            >
              <X className="h-5 w-5 text-slate-600" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {/* Product Count */}
            <div className="font-body text-sm text-slate-600 pb-4 border-b border-slate-200">
              {productCount} {productCount === 1 ? 'produit trouvé' : 'produits trouvés'}
            </div>

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

            {/* 2. Tri */}
            <div>
              <label className="font-body text-sm font-medium text-slate-700 mb-3 block">
                Trier par
              </label>
              <div className="space-y-2">
                {sortOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = filters.sortBy === option.value;
                  return (
                    <button
                      key={option.value}
                      onClick={() => filters.setSort(option.value)}
                      className={`font-body w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all ${
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
                    <label className="font-body text-xs text-slate-500 mb-1 block">Min</label>
                    <input
                      type="number"
                      min={priceRange.min}
                      max={priceRange.max}
                      step={1000}
                      value={localPriceRange[0]}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (val >= priceRange.min && val <= localPriceRange[1] - 1000) {
                          setLocalPriceRange([val, localPriceRange[1]]);
                          filters.setPriceChip(undefined);
                        }
                      }}
                      onBlur={(e) => {
                        const val = Number(e.target.value);
                        if (val < priceRange.min) {
                          setLocalPriceRange([priceRange.min, localPriceRange[1]]);
                        } else if (val >= localPriceRange[1]) {
                          setLocalPriceRange([Math.max(priceRange.min, localPriceRange[1] - 1000), localPriceRange[1]]);
                        }
                      }}
                      className="font-body w-full px-3 py-2 text-sm rounded-lg border border-slate-300 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Min"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="font-body text-xs text-slate-500 mb-1 block">Max</label>
                    <input
                      type="number"
                      min={priceRange.min}
                      max={priceRange.max}
                      step={1000}
                      value={localPriceRange[1]}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (val <= priceRange.max && val >= localPriceRange[0] + 1000) {
                          setLocalPriceRange([localPriceRange[0], val]);
                          filters.setPriceChip(undefined);
                        }
                      }}
                      onBlur={(e) => {
                        const val = Number(e.target.value);
                        if (val > priceRange.max) {
                          setLocalPriceRange([localPriceRange[0], priceRange.max]);
                        } else if (val <= localPriceRange[0]) {
                          setLocalPriceRange([localPriceRange[0], Math.min(priceRange.max, localPriceRange[0] + 1000)]);
                        }
                      }}
                      className="font-body w-full px-3 py-2 text-sm rounded-lg border border-slate-300 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Max"
                    />
                  </div>
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
          <div className="border-t border-slate-200 p-4 sm:p-6 space-y-3 lg:sticky lg:bottom-0 lg:bg-white">
            <button
              onClick={() => {
                filters.setPriceRange(localPriceRange);
                handleReset();
              }}
              className="font-body w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors text-sm font-medium flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Réinitialiser
            </button>
            <button
              onClick={() => {
                filters.setPriceRange(localPriceRange);
                onClose();
              }}
              className="font-body w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 transition-all text-sm font-bold shadow-lg shadow-indigo-500/30"
            >
              Appliquer les filtres
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}


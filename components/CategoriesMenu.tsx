'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight } from 'lucide-react';
import { CATEGORIES } from '@/lib/menu-data';
import type { CategoryItem } from '@/lib/menu-data';

interface CategoriesMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CategoriesMenu({ isOpen, onClose }: CategoriesMenuProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay - Mobile & Desktop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Mobile Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 w-full max-w-[85vw] sm:max-w-sm bg-white shadow-xl z-50 md:hidden"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-3 sm:p-4 border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-white">
                <h2 className="font-title text-base sm:text-lg font-bold text-slate-900">
                  Catégories
                </h2>
                <button
                  onClick={onClose}
                  className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-white/80 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Categories List */}
              <div className="flex-1 overflow-y-auto overscroll-contain">
                {CATEGORIES.map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-slate-100"
                  >
                    <button
                      onClick={() =>
                        setSelectedCategory(
                          selectedCategory === category.id ? null : category.id
                        )
                      }
                      className="font-body w-full flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition-colors"
                    >
                      <span className="font-medium text-left">{category.label}</span>
                      {category.children && (
                        <motion.div
                          animate={{
                            rotate: selectedCategory === category.id ? 90 : 0,
                          }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronRight className="h-4 w-4 text-slate-400 flex-shrink-0" />
                        </motion.div>
                      )}
                    </button>

                    {/* Subcategories */}
                    <AnimatePresence>
                      {selectedCategory === category.id && category.children && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="bg-slate-50 overflow-hidden"
                        >
                          {category.children.map((subcategory, subIndex) => (
                            <motion.div
                              key={subcategory.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: subIndex * 0.03 }}
                            >
                              <Link
                                href={subcategory.href || '#'}
                                onClick={onClose}
                                className="font-body block px-6 sm:px-8 py-2 sm:py-2.5 text-xs text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200 transition-colors"
                              >
                                {subcategory.label}
                              </Link>

                              {/* Sub-subcategories */}
                              {subcategory.children && (
                                <div className="bg-white">
                                  {subcategory.children.map((item) => (
                                    <Link
                                      key={item.id}
                                      href={item.href || '#'}
                                      onClick={onClose}
                                      className="font-body block px-10 sm:px-12 py-1.5 sm:py-2 text-xs text-slate-500 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200 transition-colors"
                                    >
                                      {item.label}
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Desktop Mega Menu */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="hidden md:block fixed top-28 left-0 right-0 bg-white border-b border-slate-200 shadow-lg z-50"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="grid grid-cols-4 gap-6">
                {CATEGORIES.map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="space-y-3"
                  >
                    <h3 className="font-title text-sm font-bold text-slate-900 mb-3">
                      {category.label}
                    </h3>
                    {category.children?.map((subcategory, subIndex) => (
                      <motion.div
                        key={subcategory.id}
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (index * 0.05) + (subIndex * 0.02) }}
                        className="space-y-1"
                      >
                        <Link
                          href={subcategory.href || '#'}
                          onClick={onClose}
                          className="font-body block text-xs font-medium text-slate-700 hover:text-indigo-600 transition-colors"
                        >
                          {subcategory.label}
                        </Link>
                        {subcategory.children && (
                          <div className="ml-2 space-y-0.5">
                            {subcategory.children.map((item) => (
                              <Link
                                key={item.id}
                                href={item.href || '#'}
                                onClick={onClose}
                                className="font-body block text-xs text-slate-500 hover:text-indigo-600 transition-colors"
                              >
                                {item.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

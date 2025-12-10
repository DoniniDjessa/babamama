'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Star, Plane, Package } from 'lucide-react';
import { formatPrice, calculateDiscount } from '@/lib/products';
import { useCartStore } from '@/lib/store';
import { getUser } from '@/lib/auth';
import { addFavorite, removeFavorite, isFavorited } from '@/lib/favorites';
import type { Product } from '@/lib/products';

export interface ProductCardProps {
  id: string;
  title: string;
  imageUrl: string;
  price: number;
  oldPrice?: number | null; // old_price_xof
  newPrice?: number | null; // new_price_xof
  reductionPercentage?: number | null; // reduction_percentage
  badge?: 'nouveau' | 'populaire' | 'stock_faible';
  shippingEstimate?: string;
  rating?: number;
  reviewCount?: number;
  isNew?: boolean;
  description?: string;
  compact?: boolean; // For smaller cards in "Juste pour vous"
  stockQuantity?: number; // stock_quantity
  minQuantityToSell?: number; // min_quantity_to_sell
  specs?: string[]; // specs array
  category?: string | null;
  subcategory?: string | null;
  subsubcategory?: string | null;
}

export default function ProductCard({
  id,
  title,
  imageUrl,
  price,
  oldPrice,
  newPrice,
  reductionPercentage,
  badge,
  shippingEstimate = '10-15j',
  rating,
  reviewCount,
  isNew = false,
  description,
  compact = false,
  stockQuantity,
  minQuantityToSell,
  specs,
  category,
  subcategory,
  subsubcategory,
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  // Check if product is favorited on mount
  useEffect(() => {
    const checkFavorite = async () => {
      try {
        const { data: authUser } = await getUser();
        if (authUser?.user) {
          const favorited = await isFavorited(authUser.user.id, id);
          setIsWishlisted(favorited);
        }
      } catch (err) {
        // Silent fail - user might not be logged in
      }
    };
    checkFavorite();
  }, [id]);

  // Use reduction_percentage if available, otherwise calculate from old/new prices
  const discountPercent = reductionPercentage || (oldPrice && price ? calculateDiscount(price, oldPrice) : 0);
  const displayBadge = badge || (isNew ? 'nouveau' : undefined);
  // Default stock to a high number if not provided (assume in stock)
  const currentStock = stockQuantity !== undefined ? stockQuantity : 999;
  const isOutOfStock = currentStock <= 0;
  const isLowStock = currentStock > 0 && currentStock < 10;
  
  // Default rating to 0 if not provided
  const displayRating = rating !== undefined ? rating : 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Don't add to cart if out of stock
    if (isOutOfStock) {
      return;
    }

    setIsAdding(true);
    addItem({
      id: `${id}-${Date.now()}`,
      productId: id,
      title,
      imageUrl,
      price: newPrice || price, // Use new price if available
    });

    // Animation feedback
    setTimeout(() => {
      setIsAdding(false);
    }, 300);
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const { data: authUser } = await getUser();
      if (!authUser?.user) {
        // User not logged in - could redirect to login
        return;
      }

      setIsTogglingFavorite(true);

      if (isWishlisted) {
        await removeFavorite(authUser.user.id, id);
        setIsWishlisted(false);
      } else {
        await addFavorite(authUser.user.id, id);
        setIsWishlisted(true);
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    } finally {
      setIsTogglingFavorite(false);
    }
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="group relative bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:border-indigo-200 transition-all duration-300 h-full flex flex-col"
    >
      <Link href={`/product/${id}`} className="block">
        {/* ZONE A : Le Visuel (Haut) - Reduced size for compact mode */}
        <div className={`${compact ? 'aspect-[4/3]' : 'aspect-square'} relative bg-slate-100 overflow-hidden`}>
          {imageUrl ? (
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full"
            >
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 33vw"
                unoptimized={imageUrl.includes('supabase.co')}
              />
            </motion.div>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
              <Package className="h-12 w-12 text-slate-400" />
            </div>
          )}

          {/* Badge Promo (Top Left) */}
          {discountPercent > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="absolute top-2 left-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full z-10 shadow-lg"
            >
              -{discountPercent}%
            </motion.span>
          )}

          {/* Badge Stock (if out of stock or low stock) */}
          {isOutOfStock && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="absolute top-2 left-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white text-[10px] font-bold px-2.5 py-1 rounded-full z-10 shadow-lg"
            >
              Rupture
            </motion.span>
          )}

          {isLowStock && !discountPercent && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="absolute top-2 left-2 bg-gradient-to-r from-orange-600 to-red-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full z-10 shadow-lg"
            >
              Stock faible
            </motion.span>
          )}

          {/* Badge Nouveau/Populaire (Top Left if no discount and no stock issue) */}
          {!discountPercent && !isOutOfStock && !isLowStock && displayBadge && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className={`absolute top-2 left-2 text-white text-[10px] font-bold px-2.5 py-1 rounded-full z-10 shadow-lg ${
                displayBadge === 'nouveau'
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600'
                  : displayBadge === 'populaire'
                  ? 'bg-gradient-to-r from-violet-600 to-purple-600'
                  : 'bg-gradient-to-r from-orange-600 to-red-600'
              }`}
            >
              {displayBadge === 'nouveau'
                ? '🆕 Nouveau'
                : displayBadge === 'populaire'
                ? '🔥 Populaire'
                : '⚠️ Stock faible'}
            </motion.span>
          )}

          {/* Badge Livraison/Stock (Bottom Left) */}
          <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md text-white text-[10px] px-2 py-0.5 rounded z-10">
            {isOutOfStock ? (
              <span className="flex items-center gap-1">
                <Package className="h-2.5 w-2.5" />
                Rupture de stock
              </span>
            ) : isLowStock && stockQuantity !== undefined ? (
              <span className="flex items-center gap-1">
                <Package className="h-2.5 w-2.5" />
                {currentStock} restant{currentStock > 1 ? 's' : ''}
              </span>
            ) : shippingEstimate.includes('Stock') ? (
              <span className="flex items-center gap-1">
                <Package className="h-2.5 w-2.5" />
                {shippingEstimate}
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Plane className="h-2.5 w-2.5" />
                {shippingEstimate}
              </span>
            )}
          </div>

          {/* Wishlist (Top Right) */}
          <motion.button
            onClick={handleToggleFavorite}
            disabled={isTogglingFavorite}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 backdrop-blur-md hover:bg-white transition-all z-10 disabled:opacity-50 shadow-md"
          >
            <motion.div
              animate={isWishlisted ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              <Heart
                className={`h-4 w-4 transition-colors ${
                  isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-slate-600'
                }`}
              />
            </motion.div>
          </motion.button>
        </div>

        {/* ZONE B : L'Information (Milieu) */}
        <div className={`${compact ? 'p-2.5' : 'p-3'} flex-1 flex flex-col`}>
          {/* Titre */}
          <h3 className={`font-body ${compact ? 'text-xs' : 'text-xs sm:text-sm'} font-medium text-slate-800 line-clamp-2 leading-tight ${compact ? 'min-h-[2rem]' : 'min-h-[2.5rem]'} mb-0.5 group-hover:text-indigo-600 transition-colors`}>
            {title}
          </h3>

          {/* Category Tree - Just under title */}
          {(category || subcategory || subsubcategory) && (
            <div className={`font-body ${compact ? 'text-[9px]' : 'text-[10px]'} text-slate-400 mb-1 flex items-center gap-1 flex-wrap`}>
              {category && (
                <span className="truncate max-w-[100px]">{category}</span>
              )}
              {subcategory && (
                <>
                  <span className="text-slate-300">›</span>
                  <span className="truncate max-w-[100px]">{subcategory}</span>
                </>
              )}
              {subsubcategory && (
                <>
                  <span className="text-slate-300">›</span>
                  <span className="truncate max-w-[100px]">{subsubcategory}</span>
                </>
              )}
            </div>
          )}

          {/* Description (2 lines max) */}
          {description && (
            <p className={`font-body ${compact ? 'text-[10px]' : 'text-[11px]'} text-slate-500 line-clamp-2 leading-relaxed ${compact ? 'mb-1.5' : 'mb-2'}`}>
              {description}
            </p>
          )}

          {/* Min Quantity to Sell */}
          {minQuantityToSell && minQuantityToSell > 1 && (
            <div className={`font-body ${compact ? 'text-[9px]' : 'text-[10px]'} text-slate-500 mb-1`}>
              <span className="text-slate-400">Qté min:</span> {minQuantityToSell}
            </div>
          )}

          {/* Rating - Always show if rating > 0, otherwise show placeholder */}
          {displayRating > 0 ? (
            <div className={`flex items-center gap-1 ${compact ? 'text-[10px]' : 'text-xs'} ${compact ? 'mb-1.5' : 'mb-2'}`}>
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`${compact ? 'w-2.5 h-2.5' : 'w-3 h-3'} ${
                      i < Math.floor(displayRating) 
                        ? 'fill-current' 
                        : i < displayRating 
                        ? 'fill-current opacity-50' 
                        : 'text-slate-300'
                    }`}
                  />
                ))}
              </div>
              <span className={`${compact ? 'text-[10px]' : 'text-xs'} text-slate-500 ml-1`}>
                {displayRating.toFixed(1)} {reviewCount ? `(${reviewCount})` : ''}
              </span>
            </div>
          ) : (
            <div className={`${compact ? 'h-3' : 'h-4'} ${compact ? 'mb-1.5' : 'mb-2'}`} />
          )}

          {/* ZONE C : La Conversion (Bas) */}
          <div className="flex items-end justify-between mt-auto">
            <div className="flex flex-col">
              {/* Show old price if available (for promotions) */}
              {oldPrice && oldPrice > price && (
                <span className={`font-body ${compact ? 'text-[9px]' : 'text-[10px]'} text-slate-400 line-through`}>
                  {formatPrice(oldPrice)}
                </span>
              )}
              {/* Show new price if available, otherwise show final price */}
              <span className={`font-body ${compact ? 'text-sm' : 'text-base'} font-bold text-indigo-600 leading-none`}>
                {formatPrice(newPrice || price)}
              </span>
            </div>

            {/* Bouton Action (Bottom Right) */}
            <motion.button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              whileTap={!isOutOfStock ? { scale: 0.85 } : {}}
              whileHover={!isOutOfStock ? { scale: 1.1 } : {}}
              animate={isAdding ? { scale: [1, 1.3, 1], rotate: [0, 15, -15, 0] } : {}}
              transition={{ duration: 0.3 }}
              className={`${compact ? 'w-7 h-7' : 'w-9 h-9'} rounded-full ${
                isOutOfStock
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700'
              } text-white flex items-center justify-center shadow-lg shadow-indigo-500/40 transition-all z-10 group-hover:shadow-xl`}
            >
              <motion.div
                animate={isAdding ? { rotate: 360 } : {}}
                transition={{ duration: 0.5 }}
              >
                <ShoppingCart className={compact ? 'h-3 w-3' : 'h-4 w-4'} />
              </motion.div>
            </motion.button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}


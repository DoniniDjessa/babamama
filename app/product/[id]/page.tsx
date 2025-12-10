'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  ShoppingCart,
  Star,
  Plane,
  Package,
  ArrowLeft,
  Plus,
  Minus,
  CheckCircle,
  Share2,
} from 'lucide-react';
import { getProductById, getProductsByCategory, formatPrice, calculateDiscount } from '@/lib/products';
import { useCartStore } from '@/lib/store';
import { getUser } from '@/lib/auth';
import { addFavorite, removeFavorite, isFavorited } from '@/lib/favorites';
import ProductCard from '@/components/ProductCard';
import AnimatedContainer from '@/components/AnimatedContainer';
import type { Product } from '@/lib/products';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data, error: fetchError } = await getProductById(productId);

        if (fetchError || !data) {
          setError('Produit introuvable');
          setLoading(false);
          return;
        }

        setProduct(data);

        // Check if favorited
        try {
          const { data: authUser } = await getUser();
          if (authUser?.user) {
            const favorited = await isFavorited(authUser.user.id, productId);
            setIsWishlisted(favorited);
          }
        } catch (err) {
          // Silent fail
        }

        // Fetch related products
        const { data: related } = await getProductsByCategory(data.category);
        if (related) {
          setRelatedProducts(related.filter((p) => p.id !== productId).slice(0, 4));
        }
      } catch (err) {
        setError('Une erreur est survenue');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleToggleFavorite = async () => {
    try {
      const { data: authUser } = await getUser();
      if (!authUser?.user) {
        router.push('/login');
        return;
      }

      setIsTogglingFavorite(true);

      if (isWishlisted) {
        await removeFavorite(authUser.user.id, productId);
        setIsWishlisted(false);
      } else {
        await addFavorite(authUser.user.id, productId);
        setIsWishlisted(true);
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    for (let i = 0; i < quantity; i++) {
      addItem({
        id: `${product.id}-${Date.now()}-${i}`,
        productId: product.id,
        title: product.title,
        imageUrl: product.images[0] || '',
        price: product.final_price_xof,
      });
    }

    setIsAdding(true);
    setShowSuccess(true);

    setTimeout(() => {
      setIsAdding(false);
      setShowSuccess(false);
    }, 2000);
  };

  const handleShare = async () => {
    if (navigator.share && product) {
      try {
        await navigator.share({
          title: product.title,
          text: `Découvrez ${product.title} sur Babamama`,
          url: typeof window !== 'undefined' ? window.location.href : '',
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      if (typeof window !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href);
      }
      // Could show a toast here
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-100px)] bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-body text-slate-600">Chargement du produit...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <AnimatedContainer direction="up" delay={0.1}>
        <div className="min-h-[calc(100vh-100px)] bg-slate-50 flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
              <Package className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="font-title text-xl font-bold text-slate-900 mb-2">Produit introuvable</h2>
            <p className="font-body text-sm text-slate-600 mb-6">{error || 'Ce produit n\'existe pas'}</p>
            <Link
              href="/products"
              className="font-body inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour aux produits
            </Link>
          </div>
        </div>
      </AnimatedContainer>
    );
  }

  const images = product.images.length > 0 ? product.images : [];
  const hasDiscount = false; // Could calculate from compareAtPrice if available

  return (
    <div className="min-h-[calc(100vh-100px)] bg-slate-50 pb-6">
      {/* Header with back button */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-full hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-700" />
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="p-2 rounded-full hover:bg-slate-100 transition-colors"
              >
                <Share2 className="w-5 h-5 text-slate-700" />
              </button>
              <button
                onClick={handleToggleFavorite}
                disabled={isTogglingFavorite}
                className="p-2 rounded-full hover:bg-slate-100 transition-colors disabled:opacity-50"
              >
                <Heart
                  className={`w-5 h-5 transition-colors ${
                    isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-slate-700'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 py-8">
          {/* Image Gallery - Walmart style: larger, cleaner */}
          <AnimatedContainer direction="up" delay={0.1}>
            <div className="space-y-4">
              {/* Main Image - Walmart style: full width, larger */}
              <div className="aspect-square relative bg-white rounded-lg overflow-hidden border border-slate-200">
                {images[selectedImageIndex] ? (
                  <Image
                    src={images[selectedImageIndex]}
                    alt={product.title}
                    fill
                    className="object-contain p-4"
                    priority
                    unoptimized={images[selectedImageIndex].includes('supabase.co')}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                    <Package className="w-24 h-24 text-slate-400" />
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery - Walmart style: smaller thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded border-2 transition-all ${
                        selectedImageIndex === index
                          ? 'border-indigo-600 ring-2 ring-indigo-200'
                          : 'border-slate-300 hover:border-slate-400'
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${product.title} - Image ${index + 1}`}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full rounded"
                        unoptimized={img.includes('supabase.co')}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </AnimatedContainer>

          {/* Product Info */}
          <AnimatedContainer direction="up" delay={0.2}>
            <div className="space-y-6">
              {/* Title */}
              <div>
                <h1 className="font-title text-sm font-bold text-slate-900 mb-3 leading-tight">
                  {product.title}
                </h1>
                
                {/* Rating */}
                {product.rating > 0 && (
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < Math.floor(product.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-body text-[11px] text-slate-600">
                      ({product.rating.toFixed(1)})
                    </span>
                  </div>
                )}

                {/* Badge */}
                {product.is_new && (
                  <span className="inline-block mb-3 bg-indigo-600 text-white text-[11px] font-bold px-2 py-1 rounded">
                    Nouveau
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="border-b border-slate-200 pb-4">
                <div className="flex items-baseline gap-3">
                  {product.compare_at_price && product.compare_at_price > product.final_price_xof ? (
                    <>
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="font-body text-[11px] text-slate-600">Maintenant</span>
                          <span className="font-title text-sm font-bold text-indigo-600">
                            {formatPrice(product.final_price_xof)}
                          </span>
                        </div>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="font-body text-[11px] text-slate-500">Était</span>
                          <span className="font-body text-[11px] text-slate-500 line-through">
                            {formatPrice(product.compare_at_price)}
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <span className="font-title text-sm font-bold text-indigo-600">
                      {formatPrice(product.final_price_xof)}
                    </span>
                  )}
                </div>
              </div>

              {/* Quantity Selector */}
              <div>
                <label className="font-body block text-[11px] font-medium text-slate-900 mb-2">
                  Quantité
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded border border-slate-300 flex items-center justify-center hover:bg-slate-50 transition-colors"
                  >
                    <Minus className="w-4 h-4 text-slate-700" />
                  </button>
                  <span className="font-body text-sm font-semibold text-slate-900 w-12 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded border border-slate-300 flex items-center justify-center hover:bg-slate-50 transition-colors"
                  >
                    <Plus className="w-4 h-4 text-slate-700" />
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <div className="space-y-3 pt-4">
                <motion.button
                  onClick={handleAddToCart}
                  whileTap={{ scale: 0.98 }}
                  className="font-body w-full py-3 px-6 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-bold rounded-lg shadow-lg shadow-indigo-500/30 hover:from-violet-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2"
                >
                  {showSuccess ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Ajouté au panier !
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      Ajouter au panier
                    </>
                  )}
                </motion.button>
              </div>

              {/* Shipping Info */}
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Plane className="w-4 h-4 text-indigo-600" />
                    <span className="font-body text-[11px] font-medium text-slate-900">Livraison 10-15 jours</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-indigo-600" />
                    <span className="font-body text-[11px] font-medium text-slate-900">Stock disponible</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              {product.description && (
                <div className="pt-4 border-t border-slate-200">
                  <h2 className="font-title text-sm font-bold text-slate-900 mb-3">
                    Description
                  </h2>
                  <div className="font-body text-[11px] text-slate-700 leading-relaxed whitespace-pre-line">
                    {product.description}
                  </div>
                </div>
              )}
            </div>
          </AnimatedContainer>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <AnimatedContainer direction="up" delay={0.3}>
              <h2 className="font-title text-2xl font-bold text-slate-900 mb-6">
                Produits similaires
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard
                    key={relatedProduct.id}
                    id={relatedProduct.id}
                    title={relatedProduct.title}
                    imageUrl={relatedProduct.images[0] || ''}
                    price={relatedProduct.final_price_xof}
                    oldPrice={relatedProduct.compare_at_price ?? relatedProduct.old_price_xof ?? null}
                    newPrice={relatedProduct.final_price_xof}
                    reductionPercentage={relatedProduct.discount_percentage ?? relatedProduct.reduction_percentage ?? 0}
                    badge={relatedProduct.is_new ? 'nouveau' : undefined}
                    shippingEstimate="10-15j"
                    rating={relatedProduct.rating ?? 0}
                    isNew={relatedProduct.is_new ?? false}
                    description={relatedProduct.description || undefined}
                    stockQuantity={relatedProduct.stock_quantity ?? undefined}
                    minQuantityToSell={relatedProduct.min_quantity_to_sell ?? undefined}
                    specs={relatedProduct.specs ?? []}
                    category={relatedProduct.category ?? null}
                    subcategory={relatedProduct.subcategory ?? null}
                    subsubcategory={relatedProduct.subsubcategory ?? null}
                  />
                ))}
              </div>
            </AnimatedContainer>
          </div>
        )}
      </div>
    </div>
  );
}


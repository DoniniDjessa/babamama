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
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
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

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 py-6">
          {/* Image Gallery */}
          <AnimatedContainer direction="up" delay={0.1}>
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square relative bg-slate-100 rounded-2xl overflow-hidden">
                {images[selectedImageIndex] ? (
                  <Image
                    src={images[selectedImageIndex]}
                    alt={product.title}
                    fill
                    className="object-cover"
                    priority
                    unoptimized={images[selectedImageIndex].includes('supabase.co')}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                    <Package className="w-24 h-24 text-slate-400" />
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImageIndex === index
                          ? 'border-indigo-600 ring-2 ring-indigo-200'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${product.title} - Image ${index + 1}`}
                        width={80}
                        height={80}
                        className="object-cover w-full h-full"
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
              {/* Title & Badges */}
              <div>
                {product.is_new && (
                  <span className="inline-block mb-2 bg-indigo-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                    🆕 Nouveau
                  </span>
                )}
                <h1 className="font-title text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
                  {product.title}
                </h1>
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <Plane className="w-4 h-4" />
                    Livraison 10-15 jours
                  </span>
                  <span className="flex items-center gap-1">
                    <Package className="w-4 h-4" />
                    Stock disponible
                  </span>
                </div>
              </div>

              {/* Price */}
              <div>
                <div className="flex items-baseline gap-3">
                  <span className="font-title text-3xl sm:text-4xl font-bold text-indigo-600">
                    {formatPrice(product.final_price_xof)}
                  </span>
                </div>
              </div>

              {/* Quantity Selector */}
              <div>
                <label className="font-body block text-sm font-medium text-slate-700 mb-2">
                  Quantité
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg border border-slate-300 flex items-center justify-center hover:bg-slate-50 transition-colors"
                  >
                    <Minus className="w-4 h-4 text-slate-600" />
                  </button>
                  <span className="font-body text-lg font-medium text-slate-900 w-12 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-lg border border-slate-300 flex items-center justify-center hover:bg-slate-50 transition-colors"
                  >
                    <Plus className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <div className="space-y-3">
                <motion.button
                  onClick={handleAddToCart}
                  whileTap={{ scale: 0.95 }}
                  className="font-body w-full py-4 px-6 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-full font-bold shadow-lg shadow-indigo-500/30 hover:from-violet-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2"
                >
                  {showSuccess ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Ajouté au panier !
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      Ajouter au panier
                    </>
                  )}
                </motion.button>
              </div>

              {/* Description */}
              {product.description && (
                <div>
                  <h2 className="font-title text-lg font-bold text-slate-900 mb-3">
                    Description
                  </h2>
                  <div className="font-body text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                    {product.description}
                  </div>
                </div>
              )}

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <Package className="w-6 h-6 text-indigo-600 mx-auto mb-1" />
                  <p className="font-body text-xs font-medium text-slate-700">Livraison rapide</p>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-indigo-600 mx-auto mb-1" />
                  <p className="font-body text-xs font-medium text-slate-700">Paiement sécurisé</p>
                </div>
              </div>
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


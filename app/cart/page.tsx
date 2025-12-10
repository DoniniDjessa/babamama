'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore, type CartItem } from '@/lib/store';
import { formatPrice } from '@/lib/products';
import AnimatedContainer from '@/components/AnimatedContainer';

export default function CartPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const getTotal = useCartStore((state) => state.getTotal);
  const clearCart = useCartStore((state) => state.clearCart);

  const total = getTotal();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    if (items.length === 0) return;
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <AnimatedContainer direction="up" delay={0.1}>
        <div className="min-h-[calc(100vh-100px)] bg-slate-50 flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center">
              <ShoppingBag className="w-12 h-12 text-slate-400" />
            </div>
            <h2 className="font-title text-2xl font-bold text-slate-900 mb-2">
              Votre panier est vide
            </h2>
            <p className="font-body text-sm text-slate-600 mb-6">
              Ajoutez des produits à votre panier pour commencer vos achats
            </p>
            <Link
              href="/products"
              className="font-body inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition-colors"
            >
              Découvrir les produits
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </AnimatedContainer>
    );
  }

  return (
    <div className="min-h-[calc(100vh-100px)] bg-slate-50 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatedContainer direction="up" delay={0.1}>
          <h1 className="font-title text-sm font-bold text-slate-900 mb-6">
            Mon Panier
          </h1>
        </AnimatedContainer>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items - Walmart style: larger, cleaner */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item, index) => (
                <CartItemCard
                  key={item.id}
                  item={item}
                  index={index}
                  onQuantityChange={handleQuantityChange}
                  onRemove={removeItem}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Summary Card - Walmart style: larger text, cleaner */}
          <div className="lg:col-span-1">
            <AnimatedContainer direction="up" delay={0.2}>
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 sticky top-24">
                <h2 className="font-title text-sm font-bold text-slate-900 mb-4">
                  Récapitulatif
                </h2>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="font-body text-[11px] text-slate-700">
                      Sous-total ({items.length} {items.length > 1 ? 'articles' : 'article'})
                    </span>
                    <span className="font-body text-[11px] font-semibold text-slate-900">
                      {formatPrice(total)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-body text-[11px] text-slate-700">Livraison</span>
                    <span className="font-body text-[11px] font-semibold text-slate-900">
                      À calculer
                    </span>
                  </div>
                  <div className="border-t border-slate-300 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-title text-sm font-bold text-slate-900">Total</span>
                      <span className="font-title text-sm font-bold text-indigo-600">
                        {formatPrice(total)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="font-body w-full py-3 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-bold rounded-lg shadow-lg shadow-indigo-500/30 hover:from-violet-700 hover:to-indigo-700 transition-all active:scale-98 flex items-center justify-center gap-2 mb-3"
                >
                  Passer la commande
                  <ArrowRight className="w-4 h-4" />
                </button>

                <Link
                  href="/products"
                  className="font-body block text-center text-[11px] text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Continuer mes achats
                </Link>
              </div>
            </AnimatedContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

interface CartItemCardProps {
  item: CartItem;
  index: number;
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

function CartItemCard({ item, index, onQuantityChange, onRemove }: CartItemCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden"
    >
      <div className="flex gap-4 p-4">
        {/* Product Image */}
        <Link href={`/product/${item.productId}`} className="flex-shrink-0">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-white border border-slate-200 relative">
            {item.imageUrl ? (
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-contain p-1"
                sizes="96px"
                unoptimized={item.imageUrl.includes('supabase.co')}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200" />
            )}
          </div>
        </Link>

        {/* Product Info */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <Link href={`/product/${item.productId}`}>
              <h3 className="font-body text-sm font-semibold text-slate-900 mb-1 line-clamp-2 hover:text-indigo-600 transition-colors">
                {item.title}
              </h3>
            </Link>
            <p className="font-body text-sm font-bold text-indigo-600 mb-3">
              {formatPrice(item.price)}
            </p>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => onQuantityChange(item.productId, item.quantity - 1)}
                className="w-8 h-8 rounded border border-slate-300 flex items-center justify-center hover:bg-slate-50 active:scale-95 transition-all"
                aria-label="Diminuer la quantité"
              >
                <Minus className="w-3.5 h-3.5 text-slate-700" />
              </button>
              <span className="font-body text-sm font-semibold text-slate-900 w-8 text-center">
                {item.quantity}
              </span>
              <button
                onClick={() => onQuantityChange(item.productId, item.quantity + 1)}
                className="w-8 h-8 rounded border border-slate-300 flex items-center justify-center hover:bg-slate-50 active:scale-95 transition-all"
                aria-label="Augmenter la quantité"
              >
                <Plus className="w-3.5 h-3.5 text-slate-700" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-body text-sm font-bold text-slate-900">
                {formatPrice(item.price * item.quantity)}
              </span>
              <button
                onClick={() => onRemove(item.productId)}
                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors active:scale-95"
                aria-label="Supprimer du panier"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}


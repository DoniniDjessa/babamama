'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PhoneInput from 'react-phone-number-input';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { formatPrice } from '@/lib/products';
import { createOrder, type CreateOrderData } from '@/lib/orders';
import AnimatedContainer from '@/components/AnimatedContainer';

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const getTotal = useCartStore((state) => state.getTotal);
  const clearCart = useCartStore((state) => state.clearCart);

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    delivery_address: '',
    payment_method: 'pending' as 'wave' | 'om' | 'cash' | 'pending',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  const total = getTotal();

  // Redirect if cart is empty
  if (items.length === 0 && !orderId) {
    router.push('/cart');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validation
    if (!formData.customer_name.trim()) {
      setError('Le nom complet est requis');
      setLoading(false);
      return;
    }

    if (!formData.customer_phone.trim()) {
      setError('Le numéro de téléphone est requis');
      setLoading(false);
      return;
    }

    try {
      // Prepare order data
      const orderData: CreateOrderData = {
        customer_name: formData.customer_name.trim(),
        customer_phone: formData.customer_phone.replace(/\s|-|\(|\)/g, ''),
        delivery_address: formData.delivery_address.trim() || undefined,
        items: items.map((item) => ({
          product_id: item.productId,
          title: item.title,
          price: item.price,
          qty: item.quantity,
        })),
        total_amount_xof: total,
        payment_method: formData.payment_method,
      };

      const { data: order, error: orderError } = await createOrder(orderData);

      if (orderError) {
        setError(orderError.message || 'Erreur lors de la création de la commande');
        setLoading(false);
        return;
      }

      if (order) {
        setOrderId(order.id);
        clearCart();
      }
    } catch (err) {
      setError('Une erreur inattendue est survenue');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Success screen
  if (orderId) {
    return (
      <AnimatedContainer direction="up" delay={0.1}>
        <div className="min-h-[calc(100vh-100px)] bg-slate-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center"
            >
              <CheckCircle className="w-10 h-10 text-green-600" />
            </motion.div>
            <h2 className="font-title text-2xl font-bold text-slate-900 mb-2">
              Commande confirmée !
            </h2>
            <p className="font-body text-sm text-slate-600 mb-4">
              Votre commande a été enregistrée avec succès.
            </p>
            <p className="font-body text-xs text-slate-500 mb-6">
              Numéro de commande : <span className="font-mono">{orderId.slice(0, 8)}</span>
            </p>
            <div className="space-y-3">
              <Link
                href="/products"
                className="font-body block w-full py-3 px-6 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition-colors"
              >
                Continuer mes achats
              </Link>
              <Link
                href="/orders"
                className="font-body block w-full py-3 px-6 border border-slate-300 text-slate-700 rounded-full font-medium hover:bg-slate-50 transition-colors"
              >
                Voir mes commandes
              </Link>
            </div>
          </div>
        </div>
      </AnimatedContainer>
    );
  }

  return (
    <div className="min-h-[calc(100vh-100px)] bg-slate-50 pb-6">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <AnimatedContainer direction="up" delay={0.1}>
          <Link
            href="/cart"
            className="font-body inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au panier
          </Link>

          <h1 className="font-title text-2xl sm:text-3xl font-bold text-slate-900 mb-6">
            Finaliser la commande
          </h1>
        </AnimatedContainer>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2">
            <AnimatedContainer direction="up" delay={0.2}>
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
                {error && (
                  <div className="rounded-lg bg-red-50 p-4">
                    <p className="font-body text-sm text-red-800">{error}</p>
                  </div>
                )}

                {/* Name */}
                <div>
                  <label htmlFor="customer_name" className="font-body block text-sm font-medium text-slate-700 mb-2">
                    Nom complet <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="customer_name"
                    type="text"
                    required
                    value={formData.customer_name}
                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    className="font-body w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Entrez votre nom complet"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="customer_phone" className="font-body block text-sm font-medium text-slate-700 mb-2">
                    Numéro de téléphone <span className="text-red-500">*</span>
                  </label>
                  <PhoneInput
                    international
                    defaultCountry="CI"
                    value={formData.customer_phone}
                    onChange={(value) => setFormData({ ...formData, customer_phone: value || '' })}
                    className="font-body w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 placeholder-slate-400 focus-within:border-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500"
                    placeholder="Entrez votre numéro de téléphone"
                  />
                </div>

                {/* Address */}
                <div>
                  <label htmlFor="delivery_address" className="font-body block text-sm font-medium text-slate-700 mb-2">
                    Ville / Quartier
                  </label>
                  <input
                    id="delivery_address"
                    type="text"
                    value={formData.delivery_address}
                    onChange={(e) => setFormData({ ...formData, delivery_address: e.target.value })}
                    className="font-body w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Ex: Abidjan, Cocody"
                  />
                </div>

                {/* Payment Method */}
                <div>
                  <label className="font-body block text-sm font-medium text-slate-700 mb-3">
                    Méthode de paiement
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-4 rounded-lg border-2 border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
                      <input
                        type="radio"
                        name="payment_method"
                        value="wave"
                        checked={formData.payment_method === 'wave'}
                        onChange={(e) => setFormData({ ...formData, payment_method: e.target.value as 'wave' | 'om' | 'cash' | 'pending' })}
                        className="w-5 h-5 text-indigo-600 focus:ring-indigo-500"
                      />
                      <div className="flex-1">
                        <span className="font-body font-medium text-slate-900">Wave</span>
                        <p className="font-body text-xs text-slate-500">Paiement mobile Money</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-4 rounded-lg border-2 border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
                      <input
                        type="radio"
                        name="payment_method"
                        value="om"
                        checked={formData.payment_method === 'om'}
                        onChange={(e) => setFormData({ ...formData, payment_method: e.target.value as 'wave' | 'om' | 'cash' | 'pending' })}
                        className="w-5 h-5 text-indigo-600 focus:ring-indigo-500"
                      />
                      <div className="flex-1">
                        <span className="font-body font-medium text-slate-900">Orange Money</span>
                        <p className="font-body text-xs text-slate-500">Paiement mobile Money</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-4 rounded-lg border-2 border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
                      <input
                        type="radio"
                        name="payment_method"
                        value="cash"
                        checked={formData.payment_method === 'cash'}
                        onChange={(e) => setFormData({ ...formData, payment_method: e.target.value as 'wave' | 'om' | 'cash' | 'pending' })}
                        className="w-5 h-5 text-indigo-600 focus:ring-indigo-500"
                      />
                      <div className="flex-1">
                        <span className="font-body font-medium text-slate-900">Paiement à la livraison</span>
                        <p className="font-body text-xs text-slate-500">Espèces à la réception</p>
                      </div>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="font-body w-full py-3 px-6 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-full font-bold shadow-lg shadow-indigo-500/30 hover:from-violet-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Traitement...
                    </>
                  ) : (
                    'Confirmer la commande'
                  )}
                </button>
              </form>
            </AnimatedContainer>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <AnimatedContainer direction="up" delay={0.3}>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-24">
                <h2 className="font-title text-lg font-bold text-slate-900 mb-4">
                  Récapitulatif
                </h2>

                <div className="space-y-3 mb-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-start text-sm">
                      <div className="flex-1">
                        <p className="font-body font-medium text-slate-900">{item.title}</p>
                        <p className="font-body text-xs text-slate-500">
                          {formatPrice(item.price)} × {item.quantity}
                        </p>
                      </div>
                      <span className="font-body font-medium text-slate-900 ml-4">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-200 pt-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-body text-sm text-slate-600">Sous-total</span>
                    <span className="font-body text-sm font-medium text-slate-900">
                      {formatPrice(total)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-body text-sm text-slate-600">Livraison</span>
                    <span className="font-body text-sm font-medium text-slate-900">
                      À calculer
                    </span>
                  </div>
                  <div className="border-t border-slate-200 pt-2">
                    <div className="flex justify-between items-center">
                      <span className="font-title font-bold text-slate-900">Total</span>
                      <span className="font-title text-lg font-bold text-indigo-600">
                        {formatPrice(total)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedContainer>
          </div>
        </div>
      </div>
    </div>
  );
}


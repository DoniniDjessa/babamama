'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Package, Search, CheckCircle, Clock, Truck, XCircle } from 'lucide-react';
import { getOrdersByPhone } from '@/lib/orders';
import { formatPrice } from '@/lib/products';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import AnimatedContainer from '@/components/AnimatedContainer';
import type { Order } from '@/lib/orders';

const STATUS_CONFIG: Record<string, { label: string; icon: React.ComponentType<{ className?: string }>; color: string; bgColor: string }> = {
  pending: {
    label: 'En attente',
    icon: Clock,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
  },
  confirmed: {
    label: 'Confirmée',
    icon: CheckCircle,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  shipping: {
    label: 'En livraison',
    icon: Truck,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
  },
  delivered: {
    label: 'Livrée',
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  cancelled: {
    label: 'Annulée',
    icon: XCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
  },
};

export default function TrackingPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      setError('Veuillez entrer un numéro de téléphone');
      return;
    }

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const { data, error: fetchError } = await getOrdersByPhone(phone.trim());
      if (fetchError) {
        setError('Erreur lors de la recherche. Vérifiez votre numéro de téléphone.');
        console.error(fetchError);
        setOrders([]);
      } else {
        setOrders(data || []);
        if (!data || data.length === 0) {
          setError('Aucune commande trouvée pour ce numéro de téléphone');
        }
      }
    } catch (err) {
      setError('Une erreur est survenue');
      console.error(err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-100px)] bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <AnimatedContainer direction="up" delay={0.1}>
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-indigo-100 rounded-full flex items-center justify-center">
              <Package className="w-8 h-8 text-indigo-600" />
            </div>
            <h1 className="font-title text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
              Suivre ma commande
            </h1>
            <p className="font-body text-sm text-slate-600">
              Entrez votre numéro de téléphone pour suivre l'état de vos commandes
            </p>
          </div>
        </AnimatedContainer>

        {/* Search Form */}
        <AnimatedContainer direction="up" delay={0.2}>
          <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+225 07 12 34 56 78"
                  className="font-body w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="font-body px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg font-bold shadow-lg shadow-indigo-500/30 hover:from-violet-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Recherche...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Rechercher
                  </>
                )}
              </button>
            </div>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-body text-sm text-red-600 mt-3"
              >
                {error}
              </motion.p>
            )}
          </form>
        </AnimatedContainer>

        {/* Orders List */}
        {searched && !loading && (
          <AnimatedContainer direction="up" delay={0.3}>
            {orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order, index) => {
                  const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                  const StatusIcon = statusConfig.icon;
                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`p-2 rounded-lg ${statusConfig.bgColor}`}>
                              <StatusIcon className={`w-5 h-5 ${statusConfig.color}`} />
                            </div>
                            <div>
                              <h3 className="font-title text-lg font-bold text-slate-900">
                                Commande #{order.id.slice(0, 8).toUpperCase()}
                              </h3>
                              <p className="font-body text-xs text-slate-500">
                                {format(new Date(order.created_at), 'dd MMMM yyyy à HH:mm', { locale: fr })}
                              </p>
                            </div>
                          </div>
                          <div className={`font-body inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.color}`}>
                            <StatusIcon className="w-3.5 h-3.5" />
                            {statusConfig.label}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-title text-xl font-bold text-indigo-600">
                            {formatPrice(order.total_amount_xof)}
                          </p>
                          <p className="font-body text-xs text-slate-500">
                            {order.items.length} {order.items.length === 1 ? 'article' : 'articles'}
                          </p>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="border-t border-slate-200 pt-4">
                        <h4 className="font-body text-sm font-medium text-slate-700 mb-3">Articles :</h4>
                        <div className="space-y-2">
                          {order.items.map((item: any, itemIndex: number) => (
                            <div key={itemIndex} className="flex items-center justify-between text-sm">
                              <span className="font-body text-slate-600">
                                {item.qty}x {item.title}
                              </span>
                              <span className="font-body font-medium text-slate-900">
                                {formatPrice(item.price * item.qty)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Delivery Info */}
                      {order.delivery_address && (
                        <div className="border-t border-slate-200 pt-4 mt-4">
                          <p className="font-body text-xs text-slate-500">
                            <span className="font-medium">Adresse de livraison :</span> {order.delivery_address}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            ) : null}
          </AnimatedContainer>
        )}
      </div>
    </div>
  );
}


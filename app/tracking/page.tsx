'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Package, CheckCircle, Clock, Truck, XCircle, ArrowRight } from 'lucide-react';
import { getUser } from '@/lib/auth';
import { getCustomerByAuthId } from '@/lib/customers';
import { getOrdersByPhone, type Order } from '@/lib/orders';
import { formatPrice } from '@/lib/products';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import AnimatedContainer from '@/components/AnimatedContainer';
import Link from 'next/link';

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
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data: authUser, error: authError } = await getUser();

        if (authError || !authUser?.user) {
          // If not logged in, show search form (guest tracking)
          setLoading(false);
          return;
        }

        // Get customer info
        const { data: customer, error: customerError } = await getCustomerByAuthId(
          authUser.user.id
        );

        if (customerError) {
          console.error('Customer error:', customerError);
          setError('Impossible de charger vos informations. Veuillez vous reconnecter.');
          setLoading(false);
          return;
        }

        if (!customer) {
          setError('Profil utilisateur non trouvé. Veuillez vous reconnecter.');
          setLoading(false);
          return;
        }

        // Get customer phone - use as is, let getOrdersByPhone handle normalization
        const customerPhone = customer.phone || '';
        
        if (!customerPhone) {
          setError('Numéro de téléphone non trouvé dans votre profil');
          setLoading(false);
          return;
        }

        // Get orders by phone - function will handle normalization
        const { data: ordersData, error: ordersError } = await getOrdersByPhone(customerPhone);

        if (ordersError) {
          setError('Erreur lors du chargement de vos commandes');
          console.error('Orders error:', ordersError);
        } else {
          // Sort by date (newest first)
          const sortedOrders = (ordersData || []).sort((a, b) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
          setOrders(sortedOrders);
        }
      } catch (err) {
        setError('Une erreur est survenue');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-100px)] bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-body text-slate-600">Chargement de vos commandes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <AnimatedContainer direction="up" delay={0.1}>
        <div className="min-h-[calc(100vh-100px)] bg-slate-50 flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="font-title text-xl font-bold text-slate-900 mb-2">Erreur</h2>
            <p className="font-body text-sm text-slate-600 mb-6">{error}</p>
            <Link
              href="/"
              className="font-body inline-block px-6 py-3 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition-colors"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </AnimatedContainer>
    );
  }

  if (orders.length === 0) {
    return (
      <AnimatedContainer direction="up" delay={0.1}>
        <div className="min-h-[calc(100vh-100px)] bg-slate-50 flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center">
              <Package className="w-12 h-12 text-slate-400" />
            </div>
            <h2 className="font-title text-2xl font-bold text-slate-900 mb-2">
              Aucune commande
            </h2>
            <p className="font-body text-sm text-slate-600 mb-6">
              Vous n'avez pas encore passé de commande
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
    <div className="min-h-[calc(100vh-100px)] bg-slate-50 pb-6">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <AnimatedContainer direction="up" delay={0.1}>
          <h1 className="font-title text-2xl sm:text-3xl font-bold text-slate-900 mb-6">
            Suivre ma commande
          </h1>
        </AnimatedContainer>

        <div className="space-y-4">
          {orders.map((order, index) => {
            const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
            const StatusIcon = statusConfig.icon;
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
              >
                {/* Header */}
                <div className="p-4 sm:p-6 border-b border-slate-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-title text-lg font-bold text-slate-900">
                          Commande #{order.id.slice(0, 8).toUpperCase()}
                        </h3>
                        <span
                          className={`font-body text-xs font-medium px-2.5 py-1 rounded-full ${statusConfig.bgColor} ${statusConfig.color} flex items-center gap-1.5`}
                        >
                          <StatusIcon className="w-3.5 h-3.5" />
                          {statusConfig.label}
                        </span>
                      </div>
                      <p className="font-body text-xs text-slate-500">
                        {format(new Date(order.created_at), 'dd MMMM yyyy à HH:mm', { locale: fr })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-title text-xl font-bold text-indigo-600">
                        {formatPrice(order.total_amount_xof)}
                      </p>
                      <p className="font-body text-xs text-slate-500">
                        {order.items.length} {order.items.length > 1 ? 'articles' : 'article'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="p-4 sm:p-6">
                  <div className="space-y-3">
                    {order.items.map((item: { title: string; price: number; qty: number }, itemIndex: number) => (
                      <div
                        key={itemIndex}
                        className="flex items-center gap-3 text-sm"
                      >
                        <div className="flex-1">
                          <p className="font-body font-medium text-slate-900">{item.title}</p>
                          <p className="font-body text-xs text-slate-500">
                            {formatPrice(item.price)} × {item.qty}
                          </p>
                        </div>
                        <span className="font-body font-medium text-slate-900">
                          {formatPrice(item.price * item.qty)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Delivery Info */}
                  {order.delivery_address && (
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <p className="font-body text-xs text-slate-500 mb-1">Adresse de livraison</p>
                      <p className="font-body text-sm text-slate-700">{order.delivery_address}</p>
                    </div>
                  )}

                  {/* Payment Method */}
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="font-body text-xs text-slate-500 mb-1">Méthode de paiement</p>
                    <p className="font-body text-sm text-slate-700 capitalize">
                      {order.payment_method === 'wave' ? 'Wave' : 
                       order.payment_method === 'om' ? 'Orange Money' : 
                       order.payment_method === 'cash' ? 'Paiement à la livraison' : 
                       'Non spécifié'}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


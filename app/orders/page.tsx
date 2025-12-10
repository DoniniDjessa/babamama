'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Package, Clock, Truck, CheckCircle, XCircle, ArrowRight, Archive } from 'lucide-react';
import { getUser } from '@/lib/auth';
import { getCustomerByAuthId } from '@/lib/customers';
import { getOrdersByPhone, type Order } from '@/lib/orders';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/lib/products';
import { format, subDays, isAfter } from 'date-fns';
import { fr } from 'date-fns/locale';
import AnimatedContainer from '@/components/AnimatedContainer';

const STATUS_CONFIG = {
  pending: {
    label: 'En attente',
    icon: Clock,
    color: 'text-yellow-600 bg-yellow-50',
  },
  confirmed: {
    label: 'Confirmée',
    icon: CheckCircle,
    color: 'text-blue-600 bg-blue-50',
  },
  shipping: {
    label: 'En livraison',
    icon: Truck,
    color: 'text-indigo-600 bg-indigo-50',
  },
  delivered: {
    label: 'Livrée',
    icon: CheckCircle,
    color: 'text-green-600 bg-green-50',
  },
  cancelled: {
    label: 'Annulée',
    icon: XCircle,
    color: 'text-red-600 bg-red-50',
  },
};

export default function OrdersPage() {
  const router = useRouter();
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'recent' | 'all'>('recent');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data: authUser, error: authError } = await getUser();

        if (authError || !authUser?.user) {
          router.push('/login');
          return;
        }

        // Get customer info
        let { data: customer, error: customerError } = await getCustomerByAuthId(
          authUser.user.id
        );

        // If customer doesn't exist, try to migrate/create it
        if (customerError || !customer) {
          if (process.env.NODE_ENV === 'development') {
            console.log('Customer not found, attempting migration...', customerError);
          }
          
          // Try to migrate/create customer
          try {
            const { data: sessionData } = await supabase.auth.getSession();
            if (sessionData?.session?.access_token) {
              const migrateResponse = await fetch('/api/migrate-user', {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${sessionData.session.access_token}`,
                  'Content-Type': 'application/json',
                },
              });
              
              if (migrateResponse.ok) {
                // Retry getting customer after migration
                const retryResult = await getCustomerByAuthId(authUser.user.id);
                customer = retryResult.data;
                customerError = retryResult.error;
              }
            }
          } catch (migrateErr) {
            if (process.env.NODE_ENV === 'development') {
              console.error('Migration error:', migrateErr);
            }
          }
        }

        if (customerError || !customer) {
          // If still no customer, try to get phone from user metadata as fallback
          const phoneFromMetadata = authUser.user.user_metadata?.phone || authUser.user.phone;
          
          if (phoneFromMetadata) {
            // Use phone from metadata directly
            const { data: ordersData, error: ordersError } = await getOrdersByPhone(phoneFromMetadata);
            
            if (ordersError) {
              setError('Erreur lors du chargement de vos commandes');
              if (process.env.NODE_ENV === 'development') {
                console.error('Orders error:', ordersError);
              }
            } else {
              const sortedOrders = (ordersData || []).sort((a, b) => 
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
              );
              setAllOrders(sortedOrders);
            }
            setLoading(false);
            return;
          }
          
          setError('Profil utilisateur non trouvé. Veuillez mettre à jour votre profil.');
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
          console.error(ordersError);
        } else {
          // Sort by date (newest first)
          const sortedOrders = (ordersData || []).sort((a, b) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
          setAllOrders(sortedOrders);
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

  // Filter orders based on active tab
  const thirtyDaysAgo = subDays(new Date(), 30);
  const recentOrders = allOrders.filter(order => 
    isAfter(new Date(order.created_at), thirtyDaysAgo)
  );
  const archivedOrders = allOrders.filter(order => 
    !isAfter(new Date(order.created_at), thirtyDaysAgo)
  );

  const displayedOrders = activeTab === 'recent' ? recentOrders : allOrders;

  return (
    <div className="min-h-[calc(100vh-100px)] bg-slate-50 pb-6">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <AnimatedContainer direction="up" delay={0.1}>
          <h1 className="font-title text-2xl sm:text-3xl font-bold text-slate-900 mb-6">
            Mes Commandes
          </h1>
        </AnimatedContainer>

        {/* Tabs */}
        <AnimatedContainer direction="up" delay={0.15}>
          <div className="flex gap-2 mb-6 border-b border-slate-200">
            <button
              onClick={() => setActiveTab('recent')}
              className={`font-body px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'recent'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              Récentes ({recentOrders.length})
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`font-body px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'all'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Archive className="w-4 h-4" />
              Toutes les commandes ({allOrders.length})
            </button>
          </div>
        </AnimatedContainer>

        {/* Orders List */}
        {displayedOrders.length === 0 ? (
          <AnimatedContainer direction="up" delay={0.2}>
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center">
                <Package className="w-12 h-12 text-slate-400" />
              </div>
              <h2 className="font-title text-xl font-bold text-slate-900 mb-2">
                {activeTab === 'recent' ? 'Aucune commande récente' : 'Aucune commande'}
              </h2>
              <p className="font-body text-sm text-slate-600 mb-6">
                {activeTab === 'recent' 
                  ? 'Vous n\'avez pas de commandes récentes'
                  : 'Vous n\'avez pas encore passé de commande'}
              </p>
              {activeTab === 'recent' && allOrders.length > 0 ? (
                <button
                  onClick={() => setActiveTab('all')}
                  className="font-body inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition-colors"
                >
                  Voir toutes les commandes
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <Link
                  href="/products"
                  className="font-body inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition-colors"
                >
                  Découvrir les produits
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </AnimatedContainer>
        ) : (
          <div className="space-y-4">
            {displayedOrders.map((order, index) => (
              <OrderCard key={order.id} order={order} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface OrderCardProps {
  order: Order;
  index: number;
}

function OrderCard({ order, index }: OrderCardProps) {
  const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
  const StatusIcon = statusConfig.icon;
  const orderDate = format(new Date(order.created_at), 'dd MMMM yyyy à HH:mm', { locale: fr });

  return (
    <motion.div
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
                className={`font-body text-xs font-medium px-2.5 py-1 rounded-full ${statusConfig.color} flex items-center gap-1.5`}
              >
                <StatusIcon className="w-3.5 h-3.5" />
                {statusConfig.label}
              </span>
            </div>
            <p className="font-body text-xs text-slate-500">{orderDate}</p>
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
          {order.items.map((item, itemIndex) => (
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
}


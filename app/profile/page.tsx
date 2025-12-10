'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, Edit2, Save, X } from 'lucide-react';
import { getUser } from '@/lib/auth';
import { getCustomerByAuthId, updateCustomer } from '@/lib/customers';
import { supabase } from '@/lib/supabase';
import AnimatedContainer from '@/components/AnimatedContainer';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import type { Customer } from '@/lib/customers';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data: userData } = await getUser();
      if (!userData.user) {
        router.push('/login');
        return;
      }

      setUser(userData.user);

      // Fetch customer data
      const { data: customerData, error: customerError } = await getCustomerByAuthId(
        userData.user.id
      );

      if (customerError) {
        console.error('Error fetching customer:', customerError);
      } else if (customerData) {
        setCustomer(customerData);
        setFormData({
          name: customerData.name || '',
          email: customerData.email || '',
          phone: customerData.phone || '',
        });
      } else {
        // If no customer record, use auth user data
        setFormData({
          name: userData.user.user_metadata?.name || '',
          email: userData.user.email || '',
          phone: userData.user.user_metadata?.phone || userData.user.phone || '',
        });
      }

      setLoading(false);
    };

    fetchData();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        router.push('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleSave = async () => {
    if (!user) return;

    setError(null);
    setSuccess(false);

    try {
      if (customer) {
        // Update existing customer
        const { error: updateError } = await updateCustomer(user.id, {
          name: formData.name,
          phone: formData.phone,
        });

        if (updateError) {
          setError(updateError.message || 'Erreur lors de la mise à jour');
          return;
        }

        // Refresh customer data
        const { data: updatedCustomer } = await getCustomerByAuthId(user.id);
        if (updatedCustomer) {
          setCustomer(updatedCustomer);
        }
      }

      setSuccess(true);
      setEditing(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Une erreur est survenue');
    }
  };

  const handleCancel = () => {
    if (customer) {
      setFormData({
        name: customer.name || '',
        email: customer.email || '',
        phone: customer.phone || '',
      });
    }
    setEditing(false);
    setError(null);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="font-body text-sm text-slate-500">Chargement...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <AnimatedContainer direction="up" delay={0.1}>
          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sm:p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="font-title text-2xl sm:text-3xl font-bold text-slate-900">
                Mon Profil
              </h1>
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="font-body flex items-center gap-2 px-4 py-2 text-xs sm:text-sm text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Modifier</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSave}
                    className="font-body flex items-center gap-2 px-4 py-2 text-xs sm:text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    <span className="hidden sm:inline">Enregistrer</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="font-body flex items-center gap-2 px-4 py-2 text-xs sm:text-sm text-slate-600 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    <X className="h-4 w-4" />
                    <span className="hidden sm:inline">Annuler</span>
                  </button>
                </div>
              )}
            </div>

            {/* Success Message */}
            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="font-body text-xs text-green-800">
                  Profil mis à jour avec succès !
                </p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="font-body text-xs text-red-800">{error}</p>
              </div>
            )}

            {/* Profile Information */}
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="font-body flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-700 mb-2">
                  <User className="h-4 w-4" />
                  Nom complet
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="font-body w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Entrez votre nom complet"
                  />
                ) : (
                  <div className="font-body px-3 py-2 text-xs sm:text-sm text-slate-900 bg-slate-50 rounded-lg">
                    {formData.name || 'Non renseigné'}
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="font-body flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-700 mb-2">
                  <Mail className="h-4 w-4" />
                  Email
                </label>
                <div className="font-body px-3 py-2 text-xs sm:text-sm text-slate-600 bg-slate-50 rounded-lg">
                  {formData.email}
                </div>
                <p className="font-body mt-1 text-xs text-slate-500">
                  L'email ne peut pas être modifié
                </p>
              </div>

              {/* Phone */}
              <div>
                <label className="font-body flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-700 mb-2">
                  <Phone className="h-4 w-4" />
                  Numéro de téléphone
                </label>
                {editing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="font-body w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Entrez votre numéro de téléphone"
                  />
                ) : (
                  <div className="font-body px-3 py-2 text-xs sm:text-sm text-slate-900 bg-slate-50 rounded-lg">
                    {formData.phone || 'Non renseigné'}
                  </div>
                )}
              </div>
            </div>

            {/* Account Info */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <h2 className="font-title text-lg font-bold text-slate-900 mb-4">
                Informations du compte
              </h2>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-body text-xs sm:text-sm text-slate-600">
                    Date d'inscription
                  </span>
                  <span className="font-body text-xs sm:text-sm text-slate-900">
                    {user.created_at
                      ? new Date(user.created_at).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : 'Non disponible'}
                  </span>
                </div>
                {customer?.created_at && (
                  <div className="flex justify-between items-center">
                    <span className="font-body text-xs sm:text-sm text-slate-600">
                      Membre depuis
                    </span>
                    <span className="font-body text-xs sm:text-sm text-slate-900">
                      {new Date(customer.created_at).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </AnimatedContainer>
      </div>
    </div>
  );
}


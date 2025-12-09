'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PhoneInput from 'react-phone-number-input';
import { signIn, isEmail } from '@/lib/auth';
import type { AuthCredentials } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<AuthCredentials>({
    emailOrPhone: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isPhoneInput, setIsPhoneInput] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error: signInError } = await signIn(formData);
      
      if (signInError) {
        setError(signInError.message || 'Une erreur est survenue lors de la connexion');
      } else {
        // Redirect to home page or dashboard after successful login
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      setError('Une erreur inattendue est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div>
          <h2 className="font-title text-center text-3xl font-bold tracking-tight text-slate-900">
            Connectez-vous à votre compte
          </h2>
          <p className="font-body mt-2 text-center text-sm text-slate-500">
            Ou{' '}
            <Link
              href="/register"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              créez un nouveau compte
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="font-body text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label
                htmlFor="emailOrPhone"
                className="font-body block text-sm font-medium text-slate-700"
              >
                Email ou numéro de téléphone
              </label>
              <div className="mt-1 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsPhoneInput(false)}
                  className={`font-body rounded-lg px-3 py-2 text-sm transition-colors ${
                    !isPhoneInput
                      ? 'bg-indigo-100 text-indigo-700 font-medium'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Email
                </button>
                <button
                  type="button"
                  onClick={() => setIsPhoneInput(true)}
                  className={`font-body rounded-lg px-3 py-2 text-sm transition-colors ${
                    isPhoneInput
                      ? 'bg-indigo-100 text-indigo-700 font-medium'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Téléphone
                </button>
              </div>
              {isPhoneInput ? (
                <PhoneInput
                  international
                  defaultCountry="CI"
                  value={formData.emailOrPhone}
                  onChange={(value) =>
                    setFormData({ ...formData, emailOrPhone: value || '' })
                  }
                  className="font-body mt-2 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus-within:border-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 sm:text-sm"
                  placeholder="Entrez votre numéro de téléphone"
                />
              ) : (
                <input
                  id="emailOrPhone"
                  name="emailOrPhone"
                  type="email"
                  required
                  value={formData.emailOrPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, emailOrPhone: e.target.value })
                  }
                  className="font-body mt-2 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Entrez votre adresse email"
                />
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="font-body block text-sm font-medium text-slate-700"
              >
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="font-body mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                placeholder="Entrez votre mot de passe"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="font-body w-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3 text-white font-medium shadow-lg shadow-indigo-500/30 transition-all hover:from-violet-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


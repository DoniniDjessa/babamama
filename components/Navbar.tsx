'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Search, ShoppingBag, User, LogOut, Menu, X, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getUser, signOut } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { MAIN_MENU_ITEMS } from '@/lib/menu-data';
import CategoriesMenu from './CategoriesMenu';
import { useCartStore } from '@/lib/store';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const cartCount = useCartStore((state) => state.getItemCount());
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showCategoriesMenu, setShowCategoriesMenu] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await getUser();
      setUser(data.user);
      setLoading(false);

      // Migrate existing user to ali-customers if needed
      if (data.user) {
        try {
          const { data: sessionData } = await supabase.auth.getSession();
          if (sessionData?.session?.access_token) {
            await fetch('/api/migrate-user', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${sessionData.session.access_token}`,
                'Content-Type': 'application/json',
              },
            });
          }
        } catch (err) {
          console.error('Error migrating user:', err);
        }
      }
    };

    fetchUser();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);

      // Migrate user when they log in
      if (session?.user && session?.access_token) {
        try {
          await fetch('/api/migrate-user', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
              'Content-Type': 'application/json',
            },
          });
        } catch (err) {
          console.error('Error migrating user:', err);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Don't show navbar on login or register pages
  if (pathname === '/login' || pathname === '/register') {
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    setUser(null);
    router.push('/login');
    router.refresh();
  };

  const formatUserName = (name: string | undefined): string => {
    if (!name) return '';
    
    const nameParts = name.trim().split(/\s+/);
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }
    
    const lastName = nameParts[nameParts.length - 1];
    const firstNameInitial = nameParts[0].charAt(0).toUpperCase();
    
    return `${lastName} ${firstNameInitial}`;
  };

  const handleCategoryClick = () => {
    setShowCategoriesMenu(!showCategoriesMenu);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  if (loading) {
    return null;
  }

  if (!user) {
    return null;
  }

  const userName = formatUserName(user.user_metadata?.name);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      {/* Top Bar - Branding & Tools */}
      <div className="border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileSidebar(true)}
              className="md:hidden p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center">
              <h1 className="font-title text-lg font-black text-slate-900">
                Babamama
              </h1>
            </Link>

            {/* Search Bar - Center */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="font-body w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </form>
            </div>

            {/* Mobile Search Bar */}
            <AnimatePresence>
              {showMobileSearch && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 right-0 bg-white border-b border-slate-200 p-3 md:hidden"
                >
                <form onSubmit={handleSearchSubmit} className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Rechercher un produit..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="font-body w-full pl-9 pr-10 py-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowMobileSearch(false)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    ✕
                  </button>
                </form>
              </motion.div>
              )}
            </AnimatePresence>

            {/* Actions - Right */}
            <div className="flex items-center gap-4">
              {/* Mobile Search Icon */}
              <button
                onClick={() => setShowMobileSearch(!showMobileSearch)}
                className="md:hidden p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <Search className="h-4 w-4" />
              </button>

              {/* Favorites */}
              <Link
                href="/favorites"
                className="relative p-1.5 text-slate-600 hover:text-slate-900 transition-colors rounded-lg hover:bg-slate-50"
              >
                <Heart className="h-4 w-4" />
              </Link>

              {/* Profile */}
              <div className="relative flex items-center gap-1">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <User className="h-4 w-4 text-slate-600" />
                  {userName && (
                    <span className="font-body text-xs font-medium text-slate-700 hidden sm:inline">
                      {userName}
                    </span>
                  )}
                </button>

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {showProfileMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowProfileMenu(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50"
                      >
                        <Link
                          href="/profile"
                          onClick={() => setShowProfileMenu(false)}
                          className="font-body block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          Mon profil
                        </Link>
                        <Link
                          href="/orders"
                          onClick={() => setShowProfileMenu(false)}
                          className="font-body block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          Mes commandes
                        </Link>
                        <Link
                          href="/favorites"
                          onClick={() => setShowProfileMenu(false)}
                          className="font-body block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          Favoris
                        </Link>
                        <div className="border-t border-slate-200 my-1" />
                        <button
                          onClick={() => {
                            setShowProfileMenu(false);
                            handleSignOut();
                          }}
                          className="font-body w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                        >
                          <LogOut className="h-3.5 w-3.5" />
                          Déconnexion
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-1.5 text-slate-600 hover:text-slate-900 transition-colors rounded-lg hover:bg-slate-50"
              >
                <ShoppingBag className="h-4 w-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Bar - Navigation (Desktop only) */}
      <div className="hidden md:block bg-gradient-to-r from-slate-50 to-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-10 overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-0.5 min-w-max">
              {MAIN_MENU_ITEMS.map((item) => {
                if (item.type === 'trigger') {
                  return (
                    <button
                      key={item.id}
                      onClick={handleCategoryClick}
                      className={`font-body flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg transition-colors whitespace-nowrap ${
                        item.highlight
                          ? 'font-bold text-indigo-600 hover:bg-indigo-50 bg-indigo-50/50'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {item.icon && <item.icon className="h-3.5 w-3.5" />}
                      <span>{item.label}</span>
                    </button>
                  );
                }

                return (
                  <Link
                    key={item.id}
                    href={item.href || '#'}
                    className={`font-body flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg transition-colors whitespace-nowrap ${
                      item.color || 'text-slate-700 hover:bg-slate-100'
                    } ${item.highlight ? 'font-bold' : 'font-medium'}`}
                  >
                    {item.icon && <item.icon className="h-3.5 w-3.5" />}
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>

    {/* Categories Menu */}
    <CategoriesMenu
      isOpen={showCategoriesMenu}
      onClose={() => setShowCategoriesMenu(false)}
    />
    
    {/* Click outside handler for desktop menu */}
    {showCategoriesMenu && (
      <div
        className="hidden md:block fixed inset-0 z-30"
        onClick={() => setShowCategoriesMenu(false)}
      />
    )}

    {/* Mobile Sidebar */}
    <AnimatePresence>
      {showMobileSidebar && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowMobileSidebar(false)}
            className="fixed inset-0 bg-black/50 z-50 md:hidden"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 w-full max-w-[85vw] sm:max-w-sm bg-white shadow-xl z-50 md:hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h2 className="font-title text-lg font-bold text-slate-900">Menu</h2>
              <button
                onClick={() => setShowMobileSidebar(false)}
                className="p-2 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="h-5 w-5 text-slate-600" />
              </button>
            </div>

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto py-2">
              {MAIN_MENU_ITEMS.map((item, index) => {
                if (item.type === 'trigger') {
                  return (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => {
                        setShowMobileSidebar(false);
                        handleCategoryClick();
                      }}
                      className={`font-body w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                        item.highlight
                          ? 'font-bold text-indigo-600 bg-indigo-50'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {item.icon && <item.icon className="h-5 w-5" />}
                      <span>{item.label}</span>
                    </motion.button>
                  );
                }

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={item.href || '#'}
                      onClick={() => setShowMobileSidebar(false)}
                      className={`font-body w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                        item.color || 'text-slate-700 hover:bg-slate-50'
                      } ${item.highlight ? 'font-bold' : 'font-medium'}`}
                    >
                      {item.icon && <item.icon className="h-5 w-5" />}
                      <span>{item.label}</span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Footer - User Info */}
            <div className="border-t border-slate-200 p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  <User className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <p className="font-body text-sm font-medium text-slate-900">
                    {userName || 'Utilisateur'}
                  </p>
                  <p className="font-body text-xs text-slate-500">
                    {user?.email}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowMobileSidebar(false);
                  handleSignOut();
                }}
                className="font-body w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Déconnexion
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
    </>
  );
}

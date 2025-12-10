'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Package, ArrowLeft, ShoppingBag } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import ProductCard from '@/components/ProductCard';
import AnimatedContainer from '@/components/AnimatedContainer';
import { CATEGORIES } from '@/lib/menu-data';
import type { Product } from '@/lib/products';

// Helper function to find category info by slug
function findCategoryBySlug(slug: string) {
  for (const category of CATEGORIES) {
    if (category.children) {
      for (const subcategory of category.children) {
        if (subcategory.children) {
          for (const subsubcategory of subcategory.children) {
            if (subsubcategory.id === slug || subsubcategory.href?.includes(slug)) {
              return {
                mainCategory: category.label,
                subcategory: subcategory.label,
                subsubcategory: subsubcategory.label,
                fullPath: `${category.label} > ${subcategory.label} > ${subsubcategory.label}`,
              };
            }
          }
        }
        if (subcategory.id === slug || subcategory.href?.includes(slug)) {
          return {
            mainCategory: category.label,
            subcategory: subcategory.label,
            fullPath: `${category.label} > ${subcategory.label}`,
          };
        }
      }
    }
    if (category.id === slug) {
      return {
        mainCategory: category.label,
        fullPath: category.label,
      };
    }
  }
  return null;
}

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const categoryInfo = findCategoryBySlug(slug);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const slugLower = slug.toLowerCase();
        
        // Map slug to potential category/subcategory names based on menu-data
        // This helps match slugs like "earbuds" to actual database values
        const slugMappings: Record<string, string[]> = {
          'earbuds': ['Écouteurs sans fil', 'Écouteurs', 'earbuds'],
          'speakers': ['Mini Enceintes Bluetooth', 'Enceintes', 'speakers'],
          'headphones': ['Casques à réduction de bruit', 'Casques', 'headphones'],
          'smartwatches': ['Smartwatches', 'Montres connectées'],
          'smart-rings': ['Bagues connectées', 'Smart rings'],
          'magsafe': ['Batteries MagSafe', 'MagSafe'],
          'phone-cases': ['Coques premium', 'Coques', 'phone cases'],
          'cables': ['Câbles incassables', 'Chargeurs GaN', 'Câbles'],
          'gimbals': ['Stabilisateurs', 'Gimbals'],
          'microphones': ['Micros cravate', 'Microphones'],
          'ring-lights': ['Ring lights', 'Lumières'],
          'led-strips': ['Rubans LED', 'LED RGB'],
          'sunset-lamps': ['Lampes de coucher de soleil', 'Sunset lamps'],
          'galaxy-lights': ['Veilleuses Galaxie', 'Galaxy lights'],
          'blenders': ['Mini Blenders', 'Blenders'],
          'choppers': ['Hacheurs électriques', 'Choppers'],
          'soap-dispensers': ['Distributeurs de savon', 'Soap dispensers'],
          'vegetable-cutters': ['Gadgets de découpe légumes', 'Vegetable cutters'],
          'blackhead-removers': ['Aspirateurs points noirs', 'Blackhead removers'],
          'sonic-brushes': ['Brosses nettoyantes visage', 'Sonic brushes'],
          'led-masks': ['Masques LED', 'LED masks'],
          'press-on-nails': ['Kits Faux Ongles', 'Press-on nails'],
          'uv-lamps': ['Lampes UV', 'UV lamps'],
          'magnetic-lashes': ['Faux cils magnétiques', 'Magnetic lashes'],
          'straightening-brushes': ['Brosses chauffantes', 'Straightening brushes'],
          'curling-irons': ['Fers à boucler', 'Curling irons'],
          'iced-out': ['Chaînes Iced Out', 'Iced out'],
          'luxury-watches': ['Montres style luxe', 'Luxury watches'],
          'steel-sets': ['Parures acier', 'Steel sets'],
          'crossbody-bags': ['Sacs banane', 'Crossbody bags'],
          'card-holders': ['Porte-cartes', 'Card holders'],
          'sunglasses': ['Lunettes de soleil', 'Sunglasses'],
          'blue-light': ['Lunettes anti-lumière bleue', 'Blue light'],
          'car-vacuums': ['Aspirateurs de voiture', 'Car vacuums'],
          'phone-mounts': ['Supports téléphone', 'Phone mounts'],
          'fm-transmitters': ['Transmetteurs FM', 'FM transmitters'],
          'car-leds': ['LEDs d\'ambiance voiture', 'Car LEDs'],
        };

        const searchTerms = slugMappings[slugLower] || [slug, slugLower];
        
        // Build OR conditions for all search terms
        const subsubConditions = searchTerms.map(term => `subsubcategory.ilike.%${term}%`).join(',');
        const subConditions = searchTerms.map(term => `subcategory.ilike.%${term}%`).join(',');
        const catConditions = searchTerms.map(term => `category.ilike.%${term}%`).join(',');

        // Try matching by subsubcategory first (most specific)
        const { data: subsubData } = await supabase
          .from('ali-products')
          .select('*')
          .eq('is_active', true)
          .or(subsubConditions)
          .limit(50);

        if (subsubData && subsubData.length > 0) {
          setProducts(subsubData as Product[]);
          setLoading(false);
          return;
        }

        // Try matching by subcategory
        const { data: subData } = await supabase
          .from('ali-products')
          .select('*')
          .eq('is_active', true)
          .or(subConditions)
          .limit(50);

        if (subData && subData.length > 0) {
          setProducts(subData as Product[]);
          setLoading(false);
          return;
        }

        // Try matching by category (main category)
        const categoryMap: Record<string, string> = {
          'high-tech': 'HIGH-TECH',
          'maison': 'MAISON',
          'beaute': 'BEAUTE',
          'mode': 'MODE',
          'auto': 'AUTO',
          'mystery': 'MYSTERY',
        };
        
        const categoryName = categoryMap[slugLower] || slug;
        const { data: catData } = await supabase
          .from('ali-products')
          .select('*')
          .eq('is_active', true)
          .or(`category.ilike.%${categoryName}%,category.ilike.%${slug}%`)
          .limit(50);

        if (catData && catData.length > 0) {
          setProducts(catData as Product[]);
        } else {
          setProducts([]);
        }
      } catch (err) {
        setError('Une erreur est survenue');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchCategoryProducts();
    }
  }, [slug]);

  // Empty state with nice design
  if (!loading && products.length === 0) {
    return (
      <div className="min-h-[calc(100vh-100px)] bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <AnimatedContainer direction="up" delay={0.1}>
            <Link
              href="/products"
              className="font-body inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour aux produits
            </Link>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 sm:p-12 text-center">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                <Package className="w-12 h-12 text-indigo-600" />
              </div>
              
              <h1 className="font-title text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
                {categoryInfo?.fullPath || 'Catégorie'}
              </h1>
              
              <p className="font-body text-base text-slate-600 mb-8 max-w-md mx-auto">
                Cette catégorie est actuellement vide. Nous travaillons à ajouter de nouveaux produits bientôt !
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/products"
                  className="font-body inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-full font-bold shadow-lg shadow-indigo-500/30 hover:from-violet-700 hover:to-indigo-700 transition-all"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Voir tous les produits
                </Link>
                <Link
                  href="/"
                  className="font-body inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-300 text-slate-700 rounded-full font-medium hover:bg-slate-50 transition-colors"
                >
                  Retour à l'accueil
                </Link>
              </div>

              {/* Suggested Categories */}
              <div className="mt-12 pt-8 border-t border-slate-200">
                <p className="font-body text-sm font-medium text-slate-700 mb-4">
                  Découvrez nos autres catégories :
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {CATEGORIES.slice(0, 4).map((cat) => (
                    <Link
                      key={cat.id}
                      href="/products"
                      className="font-body px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-xs font-medium hover:bg-slate-200 transition-colors"
                    >
                      {cat.label.replace(/[📱🏠✨👔🚗🎁]/g, '').trim()}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedContainer>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-100px)] bg-slate-50 pb-6">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <AnimatedContainer direction="up" delay={0.1}>
          <Link
            href="/products"
            className="font-body inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Link>
          
          <div className="mb-6">
            <h1 className="font-title text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
              {categoryInfo?.fullPath || slug}
            </h1>
            <p className="font-body text-xs sm:text-sm text-slate-500">
              {products.length} {products.length === 1 ? 'produit trouvé' : 'produits trouvés'}
            </p>
          </div>
        </AnimatedContainer>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-pulse"
              >
                <div className="aspect-square bg-slate-200" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                  <div className="h-6 bg-slate-200 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="font-body text-sm text-red-600">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product, index) => (
              <AnimatedContainer key={product.id} direction="up" delay={index * 0.05}>
                <ProductCard
                  id={product.id}
                  title={product.title}
                  imageUrl={product.images[0] || ''}
                  price={product.final_price_xof}
                  oldPrice={product.compare_at_price ?? null}
                  newPrice={product.final_price_xof}
                  reductionPercentage={product.discount_percentage ?? 0}
                  badge={product.is_new ? 'nouveau' : undefined}
                  shippingEstimate="10-15j"
                  rating={product.rating ?? 0}
                  isNew={product.is_new ?? false}
                  description={product.description || undefined}
                  stockQuantity={product.stock_quantity ?? undefined}
                  minQuantityToSell={product.min_quantity_to_sell ?? undefined}
                  specs={product.specs ?? []}
                  category={product.category ?? null}
                  subcategory={product.subcategory ?? null}
                  subsubcategory={product.subsubcategory ?? null}
                />
              </AnimatedContainer>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


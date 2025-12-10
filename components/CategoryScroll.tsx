'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Smartphone, 
  Home, 
  Sparkles, 
  Shirt, 
  Car, 
  Gift,
  Zap 
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  color: string;
}

const categories: Category[] = [
  { id: 'high-tech', name: 'High-Tech', icon: Smartphone, href: '/products?category=high-tech', color: 'bg-blue-100 text-blue-600' },
  { id: 'maison', name: 'Maison', icon: Home, href: '/products?category=maison', color: 'bg-green-100 text-green-600' },
  { id: 'beaute', name: 'Beauté', icon: Sparkles, href: '/products?category=beaute', color: 'bg-pink-100 text-pink-600' },
  { id: 'mode', name: 'Mode', icon: Shirt, href: '/products?category=mode', color: 'bg-purple-100 text-purple-600' },
  { id: 'auto', name: 'Auto', icon: Car, href: '/products?category=auto', color: 'bg-orange-100 text-orange-600' },
  { id: 'promos', name: 'Promos', icon: Gift, href: '/products?category=promos', color: 'bg-red-100 text-red-600' },
  { id: 'flash', name: 'Flash', icon: Zap, href: '/flash-sale', color: 'bg-yellow-100 text-yellow-600' },
];

export default function CategoryScroll() {
  return (
    <div className="flex gap-3 sm:gap-4 overflow-x-auto px-2 sm:px-4 py-3 sm:py-4 md:py-6 scrollbar-hide">
      {categories.map((category, index) => {
        const Icon = category.icon;
        return (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="flex flex-col items-center gap-2 min-w-[70px]"
          >
            <Link href={category.href}>
              <div className="w-16 h-16 rounded-full bg-white p-0.5 border-2 border-slate-200 hover:border-indigo-500 transition-all shadow-sm hover:shadow-md">
                <div className={`w-full h-full rounded-full ${category.color} flex items-center justify-center`}>
                  <Icon className="w-7 h-7" />
                </div>
              </div>
            </Link>
            <span className="font-body text-xs font-medium text-slate-700 text-center">
              {category.name}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}


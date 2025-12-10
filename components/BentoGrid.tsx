'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import AnimatedContainer from './AnimatedContainer';

const collections = [
  {
    id: 'home-office',
    title: '🏠 Home Office',
    href: '/collections/home-office',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&h=600&fit=crop',
    large: true,
  },
  {
    id: 'kitchen',
    title: '🍳 Cuisine',
    href: '/collections/kitchen',
    image: 'https://images.unsplash.com/photo-1556910096-6f5e72db6803?w=800&h=600&fit=crop',
    large: false,
  },
  {
    id: 'watches',
    title: '⌚ Montres',
    href: '/collections/watches',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop',
    large: false,
  },
];

export default function BentoGrid() {
  return (
    <section className="py-4 sm:py-6 md:py-8 px-2 sm:px-4 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <AnimatedContainer direction="up" delay={0.1}>
          <h2 className="font-title text-xl sm:text-2xl font-bold text-slate-900 mb-6">
            Inspirations du moment
          </h2>
        </AnimatedContainer>

        <div className="grid grid-cols-2 grid-rows-2 gap-3 sm:gap-4 h-[280px] sm:h-[400px]">
          {/* Grande Case (Gauche) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="row-span-2 relative rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100 group cursor-pointer"
          >
            <Link href={collections[0].href} className="absolute inset-0">
              <Image
                src={collections[0].image}
                alt={collections[0].title}
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />
              <div className="absolute bottom-4 left-4 right-4 z-20">
                <span className="font-body inline-block bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold text-slate-900 shadow-lg">
                  {collections[0].title}
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Petite Case (Haut Droite) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-orange-100 to-red-100 group cursor-pointer"
          >
            <Link href={collections[1].href} className="absolute inset-0">
              <Image
                src={collections[1].image}
                alt={collections[1].title}
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />
              <div className="absolute bottom-3 left-3 right-3 z-20">
                <span className="font-body inline-block bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-slate-900 shadow-lg">
                  {collections[1].title}
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Petite Case (Bas Droite) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-amber-100 to-yellow-100 group cursor-pointer"
          >
            <Link href={collections[2].href} className="absolute inset-0">
              <Image
                src={collections[2].image}
                alt={collections[2].title}
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />
              <div className="absolute bottom-3 left-3 right-3 z-20">
                <span className="font-body inline-block bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-slate-900 shadow-lg">
                  {collections[2].title}
                </span>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}


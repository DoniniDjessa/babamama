'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HeroSection() {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="relative w-full h-[280px] sm:h-[320px] md:h-[400px] overflow-hidden rounded-b-3xl shadow-sm z-0">
      {/* Background Image */}
      <div className="absolute inset-0">
        {!imageError ? (
          <Image
            src="/hero-banner.jpg"
            alt="Hero Banner"
            fill
            className="object-cover"
            priority
            onError={() => setImageError(true)}
          />
        ) : null}
        {/* Fallback gradient background if image doesn't load */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700">
          {/* Optional pattern overlay */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
        </div>
      </div>
      
      {/* Overlay gradient for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      
      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-xl"
        >
          <h1 className="font-title text-white text-3xl sm:text-4xl md:text-5xl font-bold mb-2 leading-tight">
            La Chine à votre porte
          </h1>
          <p className="font-body text-gray-200 text-sm sm:text-base mb-6 leading-relaxed">
            Prix usine. Douane incluse. Livraison Abidjan.
          </p>
          <Link
            href="/products?category=promos"
            className="font-body inline-block bg-white text-indigo-600 font-bold py-3 px-6 rounded-full w-fit active:scale-95 transition-transform shadow-lg hover:shadow-xl"
          >
            Voir les Promos
          </Link>
        </motion.div>
      </div>
    </div>
  );
}


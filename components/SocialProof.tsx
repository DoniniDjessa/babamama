'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import AnimatedContainer from './AnimatedContainer';

const testimonials = [
  {
    id: 1,
    name: 'Marc A.',
    location: 'Cocody',
    rating: 5,
    text: 'Bien reçu à Cocody, la montre est top ! Livraison rapide et produit conforme.',
    product: 'Smartwatch Ultra',
  },
  {
    id: 2,
    name: 'Sophie K.',
    location: 'Yopougon',
    rating: 5,
    text: 'Super contente de mon achat. Le produit est arrivé en parfait état. Merci !',
    product: 'Écouteurs Bluetooth',
  },
  {
    id: 3,
    name: 'Jean P.',
    location: 'Marcory',
    rating: 5,
    text: 'Service client au top. J\'ai reçu mon colis en 12 jours. Je recommande !',
    product: 'Gadgets Auto',
  },
  {
    id: 4,
    name: 'Aminata D.',
    location: 'Abobo',
    rating: 5,
    text: 'Prix imbattables et qualité au rendez-vous. Je reviendrai certainement.',
    product: 'Beauté & Bien-être',
  },
];

export default function SocialProof() {
  return (
    <section className="py-8 sm:py-12 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <AnimatedContainer direction="up" delay={0.1}>
          <h2 className="font-title text-xl sm:text-2xl font-bold text-slate-900 mb-2 text-center">
            Ils ont commandé, ils ont adoré
          </h2>
          <p className="font-body text-sm text-slate-600 text-center mb-8">
            Découvrez ce que nos clients disent de nous
          </p>
        </AnimatedContainer>

        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex-shrink-0 w-[280px] sm:w-[320px] bg-slate-50 rounded-2xl p-6 border border-slate-200 snap-start"
            >
              {/* Quote Icon */}
              <div className="mb-4">
                <Quote className="w-8 h-8 text-indigo-300" />
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Text */}
              <p className="font-body text-sm text-slate-700 leading-relaxed mb-4">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="border-t border-slate-200 pt-4">
                <p className="font-body text-sm font-medium text-slate-900">
                  {testimonial.name}
                </p>
                <p className="font-body text-xs text-slate-500">
                  {testimonial.location} • {testimonial.product}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


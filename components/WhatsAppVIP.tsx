'use client';

import { motion } from 'framer-motion';
import { MessageCircle, ArrowRight } from 'lucide-react';
import AnimatedContainer from './AnimatedContainer';

export default function WhatsAppVIP() {
  const whatsappNumber = '+225 07 12 34 56 78';
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/\s/g, '')}?text=${encodeURIComponent('Bonjour, je souhaite rejoindre le canal VIP Babamama pour voir les arrivages en avant-première !')}`;

  return (
    <section className="py-6 sm:py-8 md:py-12 px-2 sm:px-4 bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
      <div className="max-w-4xl mx-auto text-center">
        <AnimatedContainer direction="up" delay={0.1}>
          <motion.div
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="w-20 h-20 mx-auto mb-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30"
          >
            <MessageCircle className="w-10 h-10 text-white" />
          </motion.div>

          <h2 className="font-title text-2xl sm:text-3xl font-bold text-white mb-3">
            Ne ratez plus les arrivages
          </h2>
          <p className="font-body text-base sm:text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
            Rejoignez notre canal WhatsApp VIP pour voir les pépites avant tout le monde et profiter d'offres exclusives
          </p>

          <motion.a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="font-body inline-flex items-center gap-3 px-8 py-4 bg-green-500 hover:bg-green-600 text-white rounded-full font-bold text-base shadow-lg shadow-green-500/30 transition-all"
          >
            <MessageCircle className="w-5 h-5" />
            Rejoindre le Canal VIP
            <ArrowRight className="w-5 h-5" />
          </motion.a>

          <p className="font-body text-xs text-slate-400 mt-4">
            Gratuit • Sans engagement • Offres exclusives
          </p>
        </AnimatedContainer>
      </div>
    </section>
  );
}


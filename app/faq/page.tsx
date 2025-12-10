'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import AnimatedContainer from '@/components/AnimatedContainer';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'Comment fonctionne la livraison ?',
    answer: 'Nous livrons partout en Côte d\'Ivoire. Les produits en stock à Abidjan sont livrés sous 24h. Les produits importés de Chine arrivent sous 10-15 jours ouvrés. Les frais de livraison sont inclus dans le prix affiché.',
  },
  {
    question: 'Quels sont les modes de paiement acceptés ?',
    answer: 'Nous acceptons Wave, Orange Money, et le paiement à la livraison en espèces. Le paiement est sécurisé et vous recevrez une confirmation par SMS.',
  },
  {
    question: 'Puis-je retourner un produit ?',
    answer: 'Oui, vous avez 7 jours pour retourner un produit non utilisé et dans son emballage d\'origine. Contactez-nous via WhatsApp pour initier le retour.',
  },
  {
    question: 'Les prix incluent-ils les frais de douane ?',
    answer: 'Oui, tous les prix affichés incluent les frais de douane, le transport et la marge. Vous ne paierez jamais de frais supplémentaires.',
  },
  {
    question: 'Comment suivre ma commande ?',
    answer: 'Une fois votre commande confirmée, vous recevrez un numéro de suivi par SMS. Vous pouvez également suivre votre commande dans la section "Mes commandes" de votre profil.',
  },
  {
    question: 'Que faire si mon produit est endommagé ?',
    answer: 'Contactez-nous immédiatement via WhatsApp avec une photo du produit endommagé. Nous vous rembourserons ou enverrons un produit de remplacement gratuitement.',
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="min-h-[calc(100vh-100px)] bg-slate-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <AnimatedContainer direction="up" delay={0.1}>
          <div className="text-center mb-8">
            <h1 className="font-title text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
              Questions Fréquentes
            </h1>
            <p className="font-body text-sm text-slate-600">
              Trouvez rapidement les réponses à vos questions
            </p>
          </div>
        </AnimatedContainer>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <AnimatedContainer key={index} direction="up" delay={index * 0.05}>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="font-body text-sm sm:text-base font-medium text-slate-900 pr-4">
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="h-5 w-5 text-slate-400 flex-shrink-0" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4">
                        <p className="font-body text-sm text-slate-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </AnimatedContainer>
          ))}
        </div>
      </div>
    </div>
  );
}


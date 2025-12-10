'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Phone, Mail, Send } from 'lucide-react';
import AnimatedContainer from '@/components/AnimatedContainer';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const whatsappNumber = '+225 07 12 34 56 78'; // Replace with your actual WhatsApp number
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/\s/g, '')}?text=${encodeURIComponent('Bonjour, j\'ai une question concernant Babamama.')}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate form submission
    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
      setFormData({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="min-h-[calc(100vh-100px)] bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <AnimatedContainer direction="up" delay={0.1}>
          <div className="text-center mb-8">
            <h1 className="font-title text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
              Contactez-nous
            </h1>
            <p className="font-body text-sm text-slate-600">
              Nous sommes là pour vous aider
            </p>
          </div>
        </AnimatedContainer>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* WhatsApp Button - Large and Prominent */}
          <AnimatedContainer direction="up" delay={0.2}>
            <motion.a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="block bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl p-8 shadow-lg shadow-green-500/30 hover:shadow-xl transition-all"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="font-title text-xl font-bold mb-2">Chat WhatsApp</h2>
                  <p className="font-body text-sm opacity-90 mb-4">
                    Réponse immédiate - 7j/7
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm font-medium">
                    <Phone className="w-4 h-4" />
                    <span>{whatsappNumber}</span>
                  </div>
                </div>
                <div className="font-body text-sm font-medium bg-white/20 px-4 py-2 rounded-full">
                  Ouvrir WhatsApp →
                </div>
              </div>
            </motion.a>
          </AnimatedContainer>

          {/* Contact Form */}
          <AnimatedContainer direction="up" delay={0.3}>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="font-title text-lg font-bold text-slate-900 mb-4">
                Envoyez-nous un message
              </h2>
              
              {success && (
                <div className="mb-4 rounded-lg bg-green-50 p-4">
                  <p className="font-body text-sm text-green-800">
                    Message envoyé avec succès ! Nous vous répondrons bientôt.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="font-body block text-sm font-medium text-slate-700 mb-1">
                    Nom complet
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="font-body w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Votre nom"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="font-body block text-sm font-medium text-slate-700 mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="font-body w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="votre@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="font-body block text-sm font-medium text-slate-700 mb-1">
                    Téléphone
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="font-body w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="+225 07 12 34 56 78"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="font-body block text-sm font-medium text-slate-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="font-body w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    placeholder="Votre message..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="font-body w-full py-3 px-6 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-full font-bold shadow-lg shadow-indigo-500/30 hover:from-violet-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    'Envoi...'
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Envoyer
                    </>
                  )}
                </button>
              </form>
            </div>
          </AnimatedContainer>
        </div>

        {/* Additional Contact Info */}
        <AnimatedContainer direction="up" delay={0.4}>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4 border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Phone className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="font-body text-xs text-slate-500">Téléphone</p>
                  <p className="font-body text-sm font-medium text-slate-900">{whatsappNumber}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="font-body text-xs text-slate-500">Email</p>
                  <p className="font-body text-sm font-medium text-slate-900">contact@babamama.ci</p>
                </div>
              </div>
            </div>
          </div>
        </AnimatedContainer>
      </div>
    </div>
  );
}


'use client';

import Link from 'next/link';
import { MessageCircle, Mail, Phone, Facebook, Instagram, Twitter } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  
  // Don't show footer on login/register pages
  if (pathname === '/login' || pathname === '/register') {
    return null;
  }

  const whatsappNumber = '+225 07 12 34 56 78';
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/\s/g, '')}?text=${encodeURIComponent('Bonjour, j\'ai une question concernant Babamama.')}`;

  const footerLinks = {
    shop: [
      { label: 'Tous les produits', href: '/products' },
      { label: 'Nouveautés', href: '/new-arrivals' },
      { label: 'Ventes Flash', href: '/flash-sale' },
      { label: 'Promos', href: '/promos' },
    ],
    account: [
      { label: 'Mon profil', href: '/profile' },
      { label: 'Mes commandes', href: '/orders' },
      { label: 'Favoris', href: '/favorites' },
      { label: 'Suivre ma commande', href: '/tracking' },
    ],
    help: [
      { label: 'FAQ', href: '/faq' },
      { label: 'Contact', href: '/contact' },
      { label: 'Conditions Générales', href: '/legal/terms' },
    ],
  };

  return (
    <footer className="bg-slate-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h2 className="font-title text-2xl font-black mb-4">Babamama</h2>
            <p className="font-body text-sm text-slate-400 mb-4">
              La Chine à votre porte. Prix usine. Douane incluse. Livraison Abidjan.
            </p>
            <div className="flex gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-700 transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center hover:bg-slate-600 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center hover:bg-slate-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="font-title text-sm font-bold mb-4">Boutique</h3>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account Links */}
          <div>
            <h3 className="font-title text-sm font-bold mb-4">Mon compte</h3>
            <ul className="space-y-2">
              {footerLinks.account.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help & Contact */}
          <div>
            <h3 className="font-title text-sm font-bold mb-4">Aide & Contact</h3>
            <ul className="space-y-2 mb-4">
              {footerLinks.help.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="space-y-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4" />
                {whatsappNumber}
              </a>
              <a
                href="mailto:contact@babamama.ci"
                className="font-body flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4" />
                contact@babamama.ci
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-body text-xs text-slate-500 text-center sm:text-left">
              © {new Date().getFullYear()} Babamama. Tous droits réservés.
            </p>
            <div className="flex gap-6">
              <Link
                href="/legal/terms"
                className="font-body text-xs text-slate-500 hover:text-white transition-colors"
              >
                CGV
              </Link>
              <Link
                href="/faq"
                className="font-body text-xs text-slate-500 hover:text-white transition-colors"
              >
                FAQ
              </Link>
              <Link
                href="/contact"
                className="font-body text-xs text-slate-500 hover:text-white transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}


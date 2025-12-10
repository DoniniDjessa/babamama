import { Menu, Zap, Package, Tag, Star, Search, ShoppingBag, User, LogOut } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface MenuItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  type?: 'trigger' | 'link';
  href?: string;
  highlight?: boolean;
  color?: string;
  children?: CategoryItem[];
}

export interface CategoryItem {
  id: string;
  label: string;
  href?: string;
  children?: CategoryItem[];
  description?: string;
}

export const MAIN_MENU_ITEMS: MenuItem[] = [
  {
    id: 'all-cats',
    label: 'Toutes les catégories',
    icon: Menu,
    type: 'trigger',
    highlight: true,
  },
  {
    id: 'products',
    label: 'Produits',
    icon: ShoppingBag,
    href: '/products',
  },
  {
    id: 'flash',
    label: 'Ventes Flash',
    icon: Zap,
    href: '/flash-sale',
    color: 'text-orange-600',
  },
  {
    id: 'new',
    label: 'Nouveautés',
    icon: Star,
    href: '/new-arrivals',
  },
  {
    id: 'promos',
    label: 'Promos',
    icon: Tag,
    href: '/promos',
  },
  {
    id: 'tracking',
    label: 'Suivre ma commande',
    icon: Package,
    href: '/tracking',
  },
];

export const CATEGORIES: CategoryItem[] = [
  {
    id: 'high-tech',
    label: '📱 HIGH-TECH & GADGETS',
    children: [
      {
        id: 'audio',
        label: 'Audio & Son',
        children: [
          { id: 'earbuds', label: 'Écouteurs sans fil', href: '/category/earbuds' },
          { id: 'speakers', label: 'Mini Enceintes Bluetooth', href: '/category/speakers' },
          { id: 'headphones', label: 'Casques à réduction de bruit', href: '/category/headphones' },
        ],
      },
      {
        id: 'wearables',
        label: 'Wearables (Objets connectés)',
        children: [
          { id: 'smartwatches', label: 'Smartwatches', href: '/category/smartwatches' },
          { id: 'smart-rings', label: 'Bagues connectées', href: '/category/smart-rings' },
        ],
      },
      {
        id: 'mobile-accessories',
        label: 'Accessoires Mobiles',
        children: [
          { id: 'magsafe', label: 'Batteries MagSafe', href: '/category/magsafe' },
          { id: 'phone-cases', label: 'Coques premium', href: '/category/phone-cases' },
          { id: 'cables', label: 'Câbles incassables & Chargeurs GaN', href: '/category/cables' },
        ],
      },
      {
        id: 'content-creation',
        label: 'Création de Contenu',
        children: [
          { id: 'gimbals', label: 'Stabilisateurs (Gimbals)', href: '/category/gimbals' },
          { id: 'microphones', label: 'Micros cravate sans fil', href: '/category/microphones' },
          { id: 'ring-lights', label: 'Ring lights portables', href: '/category/ring-lights' },
        ],
      },
    ],
  },
  {
    id: 'home',
    label: '🏠 MAISON "SMART" & DÉCO',
    children: [
      {
        id: 'lighting',
        label: 'Éclairage d\'Ambiance',
        children: [
          { id: 'led-strips', label: 'Rubans LED RGB connectés', href: '/category/led-strips' },
          { id: 'sunset-lamps', label: 'Lampes de coucher de soleil', href: '/category/sunset-lamps' },
          { id: 'galaxy-lights', label: 'Veilleuses "Galaxie"', href: '/category/galaxy-lights' },
        ],
      },
      {
        id: 'kitchen',
        label: 'Cuisine Virale (TikTok Kitchen)',
        children: [
          { id: 'blenders', label: 'Mini Blenders portables', href: '/category/blenders' },
          { id: 'choppers', label: 'Hacheurs électriques sans fil', href: '/category/choppers' },
          { id: 'soap-dispensers', label: 'Distributeurs de savon automatiques', href: '/category/soap-dispensers' },
          { id: 'vegetable-cutters', label: 'Gadgets de découpe légumes', href: '/category/vegetable-cutters' },
        ],
      },
      {
        id: 'organization',
        label: 'Organisation & Rangement',
        children: [
          { id: 'makeup-storage', label: 'Boîtes de rangement maquillage', href: '/category/makeup-storage' },
          { id: 'cable-organizers', label: 'Organisateurs de câbles et bureau', href: '/category/cable-organizers' },
        ],
      },
    ],
  },
  {
    id: 'beauty',
    label: '✨ BEAUTÉ & BIEN-ÊTRE',
    children: [
      {
        id: 'beauty-tech',
        label: 'Beauty Tech (Appareils)',
        children: [
          { id: 'blackhead-removers', label: 'Aspirateurs points noirs', href: '/category/blackhead-removers' },
          { id: 'sonic-brushes', label: 'Brosses nettoyantes visage soniques', href: '/category/sonic-brushes' },
          { id: 'led-masks', label: 'Masques LED thérapie', href: '/category/led-masks' },
        ],
      },
      {
        id: 'nails',
        label: 'Onglerie & Cils',
        children: [
          { id: 'press-on-nails', label: 'Kits Faux Ongles (Press-on)', href: '/category/press-on-nails' },
          { id: 'uv-lamps', label: 'Lampes UV portables', href: '/category/uv-lamps' },
          { id: 'magnetic-lashes', label: 'Faux cils magnétiques', href: '/category/magnetic-lashes' },
        ],
      },
      {
        id: 'hair',
        label: 'Coiffure',
        children: [
          { id: 'straightening-brushes', label: 'Brosses chauffantes lissantes', href: '/category/straightening-brushes' },
          { id: 'curling-irons', label: 'Fers à boucler automatiques', href: '/category/curling-irons' },
        ],
      },
    ],
  },
  {
    id: 'fashion',
    label: '👔 MODE & ACCESSOIRES',
    children: [
      {
        id: 'jewelry',
        label: 'Bijouterie (Homme/Femme)',
        children: [
          { id: 'iced-out', label: 'Chaînes et bracelets "Iced Out"', href: '/category/iced-out' },
          { id: 'luxury-watches', label: 'Montres style luxe', href: '/category/luxury-watches' },
          { id: 'steel-sets', label: 'Parures acier inoxydable', href: '/category/steel-sets' },
        ],
      },
      {
        id: 'bags',
        label: 'Maroquinerie "Light"',
        children: [
          { id: 'crossbody-bags', label: 'Sacs banane (Crossbody)', href: '/category/crossbody-bags' },
          { id: 'card-holders', label: 'Porte-cartes minimalistes (Anti-RFID)', href: '/category/card-holders' },
        ],
      },
      {
        id: 'glasses',
        label: 'Lunettes',
        children: [
          { id: 'sunglasses', label: 'Lunettes de soleil "Fashion"', href: '/category/sunglasses' },
          { id: 'blue-light', label: 'Lunettes anti-lumière bleue', href: '/category/blue-light' },
        ],
      },
    ],
  },
  {
    id: 'auto',
    label: '🚗 AUTO & VOYAGE',
    children: [
      {
        id: 'car-gadgets',
        label: 'Gadgets Auto',
        children: [
          { id: 'car-vacuums', label: 'Aspirateurs de voiture sans fil', href: '/category/car-vacuums' },
          { id: 'phone-mounts', label: 'Supports téléphone magnétiques', href: '/category/phone-mounts' },
          { id: 'fm-transmitters', label: 'Transmetteurs FM Bluetooth', href: '/category/fm-transmitters' },
          { id: 'car-leds', label: 'LEDs d\'ambiance intérieur voiture', href: '/category/car-leds' },
        ],
      },
    ],
  },
  {
    id: 'mystery',
    label: '🎁 MYSTERY & PROMO',
    children: [
      {
        id: 'mystery-boxes',
        label: 'Boîtes Mystères',
        children: [
          { id: 'tech-box', label: 'Box Tech', href: '/category/tech-box' },
          { id: 'beauty-box', label: 'Box Beauté', href: '/category/beauty-box' },
        ],
      },
      {
        id: 'flash-sales',
        label: 'Ventes Flash 1000F',
        children: [
          { id: 'small-gadgets', label: 'Petits gadgets (Porte-clés, câbles, stickers)', href: '/category/small-gadgets' },
        ],
      },
    ],
  },
];


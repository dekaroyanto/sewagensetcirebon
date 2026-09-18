import { ProductType } from '../types';

/**
 * Format price in Indonesian Rupiah (DECIMAL to IDR format)
 */
export function formatPrice(price: number): string {
  if (!price || price <= 0) {
    return 'Hubungi WhatsApp';
  }
  return `Rp ${new Intl.NumberFormat('id-ID').format(price)} / Hari`;
}

/**
 * Get human-readable label for product_type ENUM
 */
export function getProductTypeLabel(type: ProductType | string): string {
  switch (type) {
    case 'genset':
      return 'Genset Silent';
    case 'ac':
      return 'AC Standing & Pendingin';
    case 'paket':
      return 'Paket Wedding';
    case 'aksesoris':
      return 'Aksesoris & Distribusi';
    default:
      return 'Unit Sewa';
  }
}

/**
 * Get UI badge styling for product_type ENUM
 */
export function getProductTypeBadge(type: ProductType | string): {
  label: string;
  badgeClass: string;
  dotColor: string;
} {
  switch (type) {
    case 'genset':
      return {
        label: 'Genset Silent',
        badgeClass: 'bg-amber-500 text-slate-950 font-bold',
        dotColor: 'bg-amber-400'
      };
    case 'ac':
      return {
        label: 'AC Standing',
        badgeClass: 'bg-cyan-500 text-slate-950 font-bold',
        dotColor: 'bg-cyan-400'
      };
    case 'paket':
      return {
        label: 'Paket Wedding',
        badgeClass: 'bg-purple-600 text-white font-bold',
        dotColor: 'bg-purple-400'
      };
    case 'aksesoris':
      return {
        label: 'Aksesoris & Panel',
        badgeClass: 'bg-blue-600 text-white font-bold',
        dotColor: 'bg-blue-400'
      };
    default:
      return {
        label: 'Unit Sewa',
        badgeClass: 'bg-slate-700 text-white font-bold',
        dotColor: 'bg-slate-400'
      };
  }
}

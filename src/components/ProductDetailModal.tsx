import React, { useEffect } from 'react';
import { 
  X, 
  Zap, 
  Layers, 
  Check, 
  MessageSquare, 
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { GensetProduct } from '../types';
import { getProductQuickWhatsAppUrl } from '../utils/whatsapp';
import { formatPrice, getProductTypeBadge, getProductTypeLabel } from '../utils/format';
import { useBodyScrollLock } from '../utils/scrollLock';

interface ProductDetailModalProps {
  product: GensetProduct | null;
  onClose: () => void;
  onSelectForBooking: (product: GensetProduct) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onSelectForBooking
}) => {
  useBodyScrollLock(Boolean(product));

  if (!product) return null;

  const quickWaUrl = getProductQuickWhatsAppUrl(product);
  const badge = getProductTypeBadge(product.product_type);
  const formattedPrice = formatPrice(product.price);

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative bg-white dark:bg-slate-900 rounded-3xl max-w-2xl sm:max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[92vh] flex flex-col my-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur-xs shrink-0">
          <div className="flex-1 pr-3">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${badge.badgeClass}`}>
                {getProductTypeLabel(product.product_type)}
              </span>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                Spesifikasi Lengkap Unit
              </span>
            </div>
            <h2 className="text-base sm:text-xl font-display font-bold text-slate-900 dark:text-white leading-snug">
              {product.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup Rincian"
            className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs sm:text-sm flex-1 min-h-0 overscroll-contain">
          
          {/* Product Snapshot Card */}
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-3 sm:p-4 border border-slate-200/80 dark:border-slate-700/80 flex flex-row items-center gap-3.5 sm:gap-5">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-200 dark:border-slate-700 shadow-xs">
              <img
                src={product.image_url || product.image}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-sm sm:text-base font-display font-bold text-slate-900 dark:text-white truncate">
                {product.name}
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-900">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  Unit Siap Pakai 24 Jam
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-semibold border border-amber-200 dark:border-amber-900">
                  <UserCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  Free Operator Standby
                </span>
              </div>

              <div className="mt-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                Estimasi Tarif: <span className="font-extrabold text-amber-600 dark:text-amber-400">{formattedPrice}</span>
              </div>
            </div>
          </div>

          {/* Full Specifications & Details (from description textarea) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
            <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-500" />
              <span>Rincian Spesifikasi Teknis &amp; Kelengkapan Unit</span>
            </h4>
            <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 whitespace-pre-line leading-relaxed font-sans">
              {product.description}
            </div>
          </div>

          {/* Guaranteed Benefits */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm mb-2.5 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-500" />
              <span>Keuntungan Sewa di Sewa Genset Cirebon (SGC):</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-start gap-2 p-2.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 text-slate-700 dark:text-slate-300">
                <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <span className="leading-snug">Operator &amp; Teknisi Berpengalaman Standby Acara</span>
              </div>
              <div className="flex items-start gap-2 p-2.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 text-slate-700 dark:text-slate-300">
                <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <span className="leading-snug">Kabel Power Standar Tembaga Berkualitas SNI</span>
              </div>
              <div className="flex items-start gap-2 p-2.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 text-slate-700 dark:text-slate-300">
                <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <span className="leading-snug">Mobilisasi Pengiriman Cepat ke Seluruh Ciayumajakuning</span>
              </div>
              <div className="flex items-start gap-2 p-2.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 text-slate-700 dark:text-slate-300">
                <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <span className="leading-snug">Gratis Instalasi &amp; Uji Beban Listrik di Lokasi</span>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-center sm:text-left">
            <span className="text-[10px] text-slate-400 block uppercase font-semibold">Estimasi Tarif Sewa:</span>
            <span className="font-extrabold text-sm sm:text-base text-amber-600 dark:text-amber-400">
              {formattedPrice}
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href={quickWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Chat WA Unit</span>
            </a>

            <button
              onClick={() => {
                onSelectForBooking(product);
                onClose();
              }}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-extrabold text-xs shadow-sm flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <Zap className="w-3.5 h-3.5 fill-slate-950" />
              <span>Pilih &amp; Sewa</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};


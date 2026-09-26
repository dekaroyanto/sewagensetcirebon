import React, { useState, useMemo, useEffect } from 'react';
import { 
  Zap, 
  Search, 
  SlidersHorizontal, 
  VolumeX, 
  Fuel, 
  Check, 
  Sparkles, 
  MessageSquare, 
  ArrowLeft,
  X,
  Gauge,
  Layers,
  Clock,
  ShieldCheck,
  Truck,
  UserCheck,
  CheckCircle2
} from 'lucide-react';
import { GensetProduct } from '../types';
import { getProductWhatsAppUrl, getGeneralWhatsAppUrl } from '../utils/whatsapp';
import { formatPrice, getProductTypeBadge, getProductTypeLabel } from '../utils/format';
import { BookingModal } from './BookingModal';
import { useBodyScrollLock, resetBodyScroll } from '../utils/scrollLock';
import { getProducts } from '../utils/api';

interface CatalogPageProps {
  onBackToHome: () => void;
  onSelectGensetForBooking?: (genset: GensetProduct) => void;
  onToast: (msg: string) => void;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({ 
  onBackToHome,
  onSelectGensetForBooking,
  onToast
}) => {
  const [products, setProducts] = useState<GensetProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalGenset, setActiveModalGenset] = useState<GensetProduct | null>(null);
  const [bookingModalProduct, setBookingModalProduct] = useState<GensetProduct | null>(null);

  // Load dynamic products from MySQL API
  const loadDynamicProducts = () => {
    getProducts().then((data) => {
      setProducts(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadDynamicProducts();
    const handleSync = () => loadDynamicProducts();
    window.addEventListener('sgc_data_changed', handleSync);
    return () => window.removeEventListener('sgc_data_changed', handleSync);
  }, []);

  // Prevent background scroll safely when any modal is active
  useBodyScrollLock(Boolean(activeModalGenset || bookingModalProduct));

  // Reset scroll safeguard on page unmount
  useEffect(() => {
    return () => {
      resetBodyScroll();
    };
  }, []);

  const categories = [
    { id: 'all', label: 'Semua Produk' },
    { id: 'genset', label: '⚡ Genset Silent' },
    { id: 'ac', label: '❄️ AC Standing & Pendingin' },
    { id: 'paket', label: '🎉 Paket Wedding' },
    { id: 'aksesoris', label: '🔌 Aksesoris & Distribusi' },
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchCategory = 
        selectedCategory === 'all' || 
        product.product_type === selectedCategory;

      const query = searchQuery.toLowerCase().trim();
      const matchSearch = !query ||
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.product_type.toLowerCase().includes(query);

      return matchCategory && matchSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen py-8 sm:py-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Breadcrumbs & Back Button */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors shadow-2xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </button>

          <div className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
            <span>Beranda</span> <span className="mx-1">/</span> <strong className="text-slate-800 dark:text-slate-200">Katalog Genset Silent & AC Cirebon</strong>
          </div>
        </div>

        {/* Page Banner Header */}
        <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xs mb-10 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800 text-xs font-bold uppercase tracking-wider mb-3">
              <Zap className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Daftar Unit &amp; Paket Spesifikasi Lengkap</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
              Katalog Sewa Genset Silent &amp; AC Standing Cirebon
            </h1>
            <p className="mt-3 text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Jelajahi seluruh armada genset kedap suara (10 - 500+ kVA), AC standing (3 &amp; 5 PK), blower misty fan kabut, hingga paket bundling wedding hemat. Semua unit dalam kondisi prima, super bersih, include instalasi dan teknisi standby.
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-4 text-xs text-slate-700 dark:text-slate-300">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Tingkat Kebisingan &lt;65 dB (Super Silent)
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <UserCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              Include Teknisi &amp; Operator Standby
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Truck className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              Siap Kirim &amp; Pasang 24 Jam
            </span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs mb-8 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari genset kVA, AC 5 PK, wedding, merk..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
          {filteredProducts.map((product) => {
            const badge = getProductTypeBadge(product.product_type);
            const formattedPrice = formatPrice(product.price);

            return (
              <div
                key={product.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col justify-between group"
              >
                {/* Product Card Image */}
                <div className="relative aspect-16/10 overflow-hidden bg-slate-900">
                  <img
                    src={product.image_url || product.image}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95"
                  />
                  
                  {/* Floating Product Type Badge */}
                  <div className="absolute top-3 left-3">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider shadow-sm ${badge.badgeClass}`}>
                      {badge.label}
                    </span>
                  </div>

                  {/* Price Banner Overlay */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-transparent p-4 flex items-end justify-between text-white">
                    <div>
                      <span className="text-[10px] text-slate-300 block font-medium">Estimasi Tarif:</span>
                      <span className="text-base sm:text-lg font-display font-extrabold text-amber-400 leading-none">
                        {formattedPrice}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white leading-snug">
                      {product.name}
                    </h3>

                    {/* Specification / Description Preview (from description textarea) */}
                    <div className="mt-3.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
                        <Layers className="w-3 h-3 text-amber-500" />
                        <span>Ringkasan Spesifikasi:</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 whitespace-pre-line leading-relaxed font-sans">
                        {product.description}
                      </p>
                    </div>
                  </div>

                  {/* Card Price & Action Buttons */}
                  <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-semibold">Status Unit:</span>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          Siap Kirim 24 Jam
                        </span>
                      </div>
                      <button
                        onClick={() => setActiveModalGenset(product)}
                        className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 cursor-pointer underline underline-offset-2"
                      >
                        Rincian Lengkap
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => setBookingModalProduct(product)}
                        className="w-full py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-extrabold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Zap className="w-3.5 h-3.5 fill-slate-950" />
                        <span>Pilih &amp; Sewa</span>
                      </button>

                      <a
                        href={getProductWhatsAppUrl(product)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors text-center"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Chat WA</span>
                      </a>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Fast Booking Box */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white">
              Butuh Paket Gabungan Genset Silent + AC Standing untuk Acara Anda?
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Konsultasikan ukuran tenda, kapasitas tamu, dan rincian alat pesta langsung dengan tim teknisi kami untuk rekomendasi kapasitas daya dan PK AC yang pas.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setBookingModalProduct(products.find(p => p.product_type === 'paket') || products[0] || null)}
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-sm shrink-0 transition-colors cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-slate-950" />
            <span>Formulir Booking Cepat</span>
          </button>
        </div>

      </div>

      {/* Modal Detail Spec Sheet */}
      {activeModalGenset && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in"
          onClick={() => setActiveModalGenset(null)}
        >
          <div 
            className="relative bg-white dark:bg-slate-900 rounded-3xl max-w-2xl sm:max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[92vh] flex flex-col my-auto animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header (Compact & Clean) */}
            <div className="flex items-start justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur-xs shrink-0">
              <div className="flex-1 pr-3">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${getProductTypeBadge(activeModalGenset.product_type).badgeClass}`}>
                    {getProductTypeLabel(activeModalGenset.product_type)}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    Spesifikasi Lengkap Unit
                  </span>
                </div>
                <h2 className="text-base sm:text-xl font-display font-bold text-slate-900 dark:text-white leading-snug">
                  {activeModalGenset.name}
                </h2>
              </div>
              <button
                onClick={() => setActiveModalGenset(null)}
                aria-label="Tutup Rincian"
                className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body (Scrollable with full specifications from description textarea) */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs sm:text-sm flex-1 overscroll-contain">
              
              {/* Compact Product Snapshot Card (Image is compact thumbnail) */}
              <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-3 sm:p-4 border border-slate-200/80 dark:border-slate-700/80 flex flex-row items-center gap-3.5 sm:gap-5">
                {/* Restrained Thumbnail Image */}
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-200 dark:border-slate-700 shadow-xs">
                  <img
                    src={activeModalGenset.image_url || activeModalGenset.image}
                    alt={activeModalGenset.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Quick Highlights Next to Thumbnail */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm sm:text-base font-display font-bold text-slate-900 dark:text-white truncate">
                    {activeModalGenset.name}
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
                    Estimasi Tarif: <span className="font-extrabold text-amber-600 dark:text-amber-400">{formatPrice(activeModalGenset.price)}</span>
                  </div>
                </div>
              </div>

              {/* Full Description & Specifications Container (Rendered directly from textarea) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-500" />
                  <span>Rincian Spesifikasi Teknis &amp; Kelengkapan Unit</span>
                </h4>
                <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 whitespace-pre-line leading-relaxed font-sans">
                  {activeModalGenset.description}
                </div>
              </div>

              {/* Included Free Services Highlights */}
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

            {/* Modal Footer (Clean & Ergonomic Action Bar) */}
            <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <div className="text-center sm:text-left">
                <span className="text-[10px] text-slate-400 block uppercase font-semibold">Estimasi Tarif Sewa:</span>
                <span className="font-extrabold text-sm sm:text-base text-amber-600 dark:text-amber-400">
                  {formatPrice(activeModalGenset.price)}
                </span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <a
                  href={getProductWhatsAppUrl(activeModalGenset)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Chat WA Unit</span>
                </a>

                <button
                  onClick={() => {
                    const g = activeModalGenset;
                    setActiveModalGenset(null);
                    setBookingModalProduct(g);
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
      )}

      {/* Booking Form Popup Modal */}
      {bookingModalProduct && (
        <BookingModal
          product={bookingModalProduct}
          onClose={() => setBookingModalProduct(null)}
          onToast={onToast}
        />
      )}

    </div>
  );
};

import React, { useState, useMemo } from 'react';
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
  UserCheck
} from 'lucide-react';
import { GENSET_PRODUCTS } from '../data/gensets';
import { GensetProduct } from '../types';
import { getProductWhatsAppUrl, getGeneralWhatsAppUrl } from '../utils/whatsapp';
import { BookingModal } from './BookingModal';

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
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalGenset, setActiveModalGenset] = useState<GensetProduct | null>(null);
  const [bookingModalProduct, setBookingModalProduct] = useState<GensetProduct | null>(null);

  const categories = [
    { id: 'all', label: 'Semua Unit & Paket' },
    { id: 'genset', label: '⚡ Genset Silent (10 - 500 kVA)' },
    { id: 'ac', label: '❄️ AC Standing & Kipas Kabut' },
    { id: 'paket', label: '🎉 Paket Hemat Wedding' },
    { id: 'small', label: 'Genset Kecil (10 - 30 kVA)' },
    { id: 'medium', label: 'Genset Menengah (45 - 100 kVA)' },
    { id: 'large', label: 'Genset Besar (150 - 250 kVA)' },
    { id: 'heavy', label: 'Mega Power (500+ kVA)' },
  ];

  const filteredProducts = useMemo(() => {
    return GENSET_PRODUCTS.filter((product) => {
      let matchCategory = false;
      if (selectedCategory === 'all') {
        matchCategory = true;
      } else if (selectedCategory === 'genset') {
        matchCategory = product.productType === 'genset' || !product.productType || ['small', 'medium', 'large', 'heavy'].includes(product.category);
      } else if (selectedCategory === 'ac') {
        matchCategory = product.productType === 'ac' || product.category === 'ac';
      } else if (selectedCategory === 'paket') {
        matchCategory = product.productType === 'paket' || product.category === 'paket';
      } else {
        matchCategory = product.category === selectedCategory;
      }

      const matchSearch = 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.engineBrand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.tag && product.tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (product.kva && product.kva.toString().includes(searchQuery)) ||
        (product.pk && product.pk.toString().includes(searchQuery)) ||
        product.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

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
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col justify-between group"
            >
              {/* Product Card Image */}
              <div className="relative aspect-16/10 overflow-hidden bg-slate-900">
                <img
                  src={product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95"
                />
                
                {/* Floating Tag */}
                <div className="absolute top-3 left-3">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider shadow-sm ${
                    product.category === 'ac'
                      ? 'bg-cyan-500 text-slate-950'
                      : product.category === 'paket'
                      ? 'bg-purple-600 text-white'
                      : 'bg-amber-500 text-slate-950'
                  }`}>
                    {product.tag || product.categoryLabel}
                  </span>
                </div>

                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-1 rounded-md bg-slate-900/90 text-white text-[10px] font-bold border border-slate-700">
                    {product.phase}
                  </span>
                </div>

                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/90 to-transparent p-4 flex items-end justify-between text-white">
                  <div>
                    {product.category === 'ac' ? (
                      <div>
                        <span className="text-xl font-display font-extrabold text-cyan-400 leading-none">
                          {product.pk ? `${product.pk} PK` : 'Kipas Blower'}
                        </span>
                        {product.btu && <span className="text-xs text-slate-300 ml-1.5 font-medium">({product.btu})</span>}
                      </div>
                    ) : product.category === 'paket' ? (
                      <div>
                        <span className="text-xl font-display font-extrabold text-amber-400 leading-none">
                          Paket Wedding
                        </span>
                        <span className="text-xs text-slate-300 ml-1.5 font-medium">Genset + AC</span>
                      </div>
                    ) : (
                      <div>
                        <span className="text-xl font-display font-extrabold text-amber-400 leading-none">
                          {product.kva} kVA
                        </span>
                        <span className="text-xs text-slate-300 ml-1.5 font-medium">({product.kw} kW)</span>
                      </div>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-300 font-semibold truncate max-w-[140px] text-right">
                    {product.engineBrand.split('/')[0]}
                  </span>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white leading-snug">
                    {product.name}
                  </h3>

                  {/* Quick Specs Grid */}
                  <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <VolumeX className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span className="truncate">{product.noiseLevel.split('(')[0]}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Fuel className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                      <span className="truncate">{product.fuelType || (product.fuelConsumption ? product.fuelConsumption.split('(')[0] : 'Listrik / Diesel')}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Gauge className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                      <span className="truncate">{product.tankCapacity ? `Tangki: ${product.tankCapacity}` : `Dimensi: ${product.dimensions.split('x')[0]}cm`}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                      <span className="truncate">Berat: {product.weight}</span>
                    </div>
                  </div>

                  {/* Ideal For Bullet Points */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1.5">
                      Sangat Cocok Untuk:
                    </span>
                    <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                      {product.idealFor.slice(0, 3).map((item, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>

                {/* Card Price & Action Buttons */}
                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Estimasi Tarif Sewa:</span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{product.startingPriceEstimate}</span>
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
                      <span>Pilih & Sewa</span>
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
          ))}
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
            onClick={() => setBookingModalProduct(GENSET_PRODUCTS.find(p => p.id === 'paket-wedding-genset-ac') || GENSET_PRODUCTS[0])}
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
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in"
          onClick={() => setActiveModalGenset(null)}
        >
          <div 
            className="relative bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="relative aspect-16/9 bg-slate-900">
              <img
                src={activeModalGenset.image}
                alt={activeModalGenset.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex items-end justify-between p-6 text-white">
                <div>
                  <span className="px-2.5 py-0.5 rounded bg-amber-500 text-slate-950 text-[10px] font-extrabold uppercase tracking-wider inline-block mb-1.5">
                    {activeModalGenset.tag || activeModalGenset.categoryLabel}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-display font-extrabold leading-tight">
                    {activeModalGenset.name}
                  </h2>
                </div>
                <button
                  onClick={() => setActiveModalGenset(null)}
                  className="p-2 rounded-full bg-slate-900/80 text-white hover:bg-slate-900 cursor-pointer absolute top-4 right-4"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm">
              
              {/* Specs Table */}
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-3">Spesifikasi & Rincian Teknis:</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  {activeModalGenset.kva && (
                    <div>
                      <span className="text-slate-400 dark:text-slate-500 block text-[11px]">Kapasitas Genset:</span>
                      <strong className="text-slate-900 dark:text-white">{activeModalGenset.kva} kVA ({activeModalGenset.kw} kW)</strong>
                    </div>
                  )}
                  {activeModalGenset.pk && (
                    <div>
                      <span className="text-slate-400 dark:text-slate-500 block text-[11px]">Kapasitas Pendingin:</span>
                      <strong className="text-slate-900 dark:text-white">{activeModalGenset.pk} PK ({activeModalGenset.btu || '-'})</strong>
                    </div>
                  )}
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 block text-[11px]">Tipe Phase:</span>
                    <strong className="text-slate-900 dark:text-white">{activeModalGenset.phase}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 block text-[11px]">Merk / Tipe:</span>
                    <strong className="text-slate-900 dark:text-white">{activeModalGenset.engineBrand}</strong>
                  </div>
                  {activeModalGenset.alternatorBrand && (
                    <div>
                      <span className="text-slate-400 dark:text-slate-500 block text-[11px]">Alternator:</span>
                      <strong className="text-slate-900 dark:text-white">{activeModalGenset.alternatorBrand}</strong>
                    </div>
                  )}
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 block text-[11px]">Tingkat Kebisingan:</span>
                    <strong className="text-slate-900 dark:text-white">{activeModalGenset.noiseLevel}</strong>
                  </div>
                  {activeModalGenset.fuelConsumption && (
                    <div>
                      <span className="text-slate-400 dark:text-slate-500 block text-[11px]">Konsumsi BBM:</span>
                      <strong className="text-slate-900 dark:text-white">{activeModalGenset.fuelConsumption}</strong>
                    </div>
                  )}
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 block text-[11px]">Dimensi Unit:</span>
                    <strong className="text-slate-900 dark:text-white">{activeModalGenset.dimensions}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 block text-[11px]">Berat Unit:</span>
                    <strong className="text-slate-900 dark:text-white">{activeModalGenset.weight}</strong>
                  </div>
                  {activeModalGenset.tankCapacity && (
                    <div>
                      <span className="text-slate-400 dark:text-slate-500 block text-[11px]">Kapasitas Tangki:</span>
                      <strong className="text-slate-900 dark:text-white">{activeModalGenset.tankCapacity}</strong>
                    </div>
                  )}
                </div>
              </div>

              {/* Included Items */}
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-2">Kelengkapan Paket yang Didapat:</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700 dark:text-slate-300">
                  {activeModalGenset.includedItems.map((inc, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between gap-3">
              <div>
                <span className="text-[11px] text-slate-400 block">Tarif Sewa Harian:</span>
                <span className="font-extrabold text-sm text-slate-900 dark:text-white">{activeModalGenset.startingPriceEstimate}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const g = activeModalGenset;
                    setActiveModalGenset(null);
                    setBookingModalProduct(g);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>Sewa Sekarang</span>
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

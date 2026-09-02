import React, { useState, useMemo } from 'react';
import {
  Zap,
  Search,
  Filter,
  VolumeX,
  Check,
  ArrowRight,
  MessageSquare,
  Info,
  CheckCircle2,
  SlidersHorizontal,
  Flame,
  Layers
} from 'lucide-react';
import { GENSET_PRODUCTS } from '../data/gensets';
import { GensetProduct } from '../types';
import { ProductDetailModal } from './ProductDetailModal';
import { BookingModal } from './BookingModal';
import { getProductQuickWhatsAppUrl } from '../utils/whatsapp';

interface ProductCatalogProps {
  onSelectGensetForBooking?: (genset: GensetProduct) => void;
  onToast?: (msg: string) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({ onSelectGensetForBooking, onToast }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [modalProduct, setModalProduct] = useState<GensetProduct | null>(null);
  const [bookingModalProduct, setBookingModalProduct] = useState<GensetProduct | null>(null);

  const categories = [
    { id: 'all', label: 'Semua Kapasitas' },
    { id: 'small', label: 'Daya Kecil (10 - 30 kVA)' },
    { id: 'medium', label: 'Daya Menengah (45 - 100 kVA)' },
    { id: 'large', label: 'Daya Besar (150 - 250 kVA)' },
    { id: 'heavy', label: 'Mega Power (500+ kVA)' },
  ];

  const filteredProducts = useMemo(() => {
    return GENSET_PRODUCTS.filter((product) => {
      const matchCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.engineBrand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.idealFor.some(item => item.toLowerCase().includes(searchQuery.toLowerCase())) ||
        product.kva.toString().includes(searchQuery);
      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <section id="katalog" className="py-16 sm:py-20 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-3">
            <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
            <span>Katalog Lengkap Sewa Genset</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold text-slate-900 tracking-tight">
            Pilihan Unit Genset Silent Siap Pakai di Cirebon
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            Unit terawat berkala dengan standar emisi dan peredaman suara terbaik. Seluruh paket sudah termasuk kabel standar, operator teknisi standby, dan layanan antar cepat.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200 mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari kVA, mesin (Perkins/Cummins), hajatan..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-slate-50/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-semibold"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Category Filter Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${isActive
                        ? 'bg-amber-500 text-slate-950 shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm max-w-md mx-auto">
            <Info className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">Unit Tidak Ditemukan</h3>
            <p className="text-xs text-slate-500 mt-1">
              Coba cari dengan kata kunci lain atau pilih kategori "Semua Kapasitas".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              const quickWaUrl = getProductQuickWhatsAppUrl(product);

              return (
                <div
                  key={product.id}
                  id={`product-card-${product.id}`}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:border-amber-300 transition-all flex flex-col group"
                >
                  {/* Card Header with Badges & kVA */}
                  <div className="p-5 pb-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex items-start justify-between gap-2">
                    <div>
                      {product.tag && (
                        <span className="inline-block px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[11px] font-extrabold mb-1.5">
                          {product.tag}
                        </span>
                      )}
                      <h3 className="font-display font-bold text-lg text-slate-900 leading-snug group-hover:text-amber-600 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">{product.engineBrand}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="w-14 h-14 rounded-xl bg-amber-500 text-slate-950 flex flex-col items-center justify-center font-display font-black shadow-xs">
                        <span className="text-base leading-none">{product.kva}</span>
                        <span className="text-[10px] uppercase font-bold">kVA</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Key Specifications */}
                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                          <span className="text-slate-400 block text-[10px]">Daya Output</span>
                          <span className="font-bold text-slate-800">{product.kw} kW ({product.phase.split(' ')[0]})</span>
                        </div>
                        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                          <span className="text-slate-400 block text-[10px]">Peredam Suara</span>
                          <span className="font-bold text-emerald-700 flex items-center gap-1">
                            <VolumeX className="w-3 h-3" />
                            {product.noiseLevel.split(' ')[0]} {product.noiseLevel.split(' ')[1]}
                          </span>
                        </div>
                      </div>

                      <div className="text-xs text-slate-600 pt-1">
                        <span className="font-semibold text-slate-800 block mb-1">Rekomendasi Pemakaian:</span>
                        <ul className="space-y-1 text-slate-600">
                          {product.idealFor.slice(0, 2).map((item, idx) => (
                            <li key={idx} className="flex items-center gap-1.5 text-xs line-clamp-1">
                              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              <span className="truncate">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Price & Inclusions */}
                    <div className="pt-3 border-t border-slate-100 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Harga Rental</span>
                          <span className="text-sm font-extrabold text-amber-600">
                            {product.startingPriceEstimate}
                          </span>
                        </div>
                        <button
                          onClick={() => setModalProduct(product)}
                          className="text-xs font-semibold text-slate-500 hover:text-slate-900 underline underline-offset-2 flex items-center gap-1 cursor-pointer"
                        >
                          <Info className="w-3.5 h-3.5" />
                          <span>Lihat Spek</span>
                        </button>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <a
                          href={quickWaUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-2.5 px-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Tanya WA</span>
                        </a>

                        <button
                          onClick={() => onSelectGensetForBooking(product)}
                          className="py-2.5 px-2 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 text-xs font-extrabold shadow-sm flex items-center justify-center gap-1 transition-all cursor-pointer"
                        >
                          <Zap className="w-3.5 h-3.5 fill-slate-950" />
                          <span>Pilih & Sewa</span>
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Banner for Custom Consultation */}
        <div className="mt-12 bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-700">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-lg sm:text-xl font-display font-bold">
              Bingung Menghitung Kebutuhan Total Daya Acara / Proyek Anda?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Konsultasikan daftar alat listrik (sound system, AC, lighting, mesin) ke teknisi kami. Kami bantu rekomendasikan kapasitas genset yang paling pas, aman, dan hemat biaya.
            </p>
          </div>

          <a
            href="https://wa.me/6285287157487?text=Halo%20Admin%20Sewa%20Genset%Cirebon,%20saya%20ingin%20konsultasi%20kebutuhan%20kapasitas%20daya%20listrik%20untuk%20acara%20saya%20di%20Cirebon."
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-950/40 flex items-center gap-2 transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Konsultasi Gratis via WhatsApp</span>
          </a>
        </div>

      </div>

      {/* Product Detail Modal */}
      {modalProduct && (
        <ProductDetailModal
          product={modalProduct}
          onClose={() => setModalProduct(null)}
          onSelectForBooking={onSelectGensetForBooking}
        />
      )}
    </section>
  );
};

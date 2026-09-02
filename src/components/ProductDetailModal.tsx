import React from 'react';
import { 
  X, 
  Zap, 
  VolumeX, 
  Fuel, 
  Layers, 
  CheckCircle2, 
  MessageSquare, 
  ArrowRight,
  ShieldCheck,
  Scale,
  Maximize2
} from 'lucide-react';
import { GensetProduct } from '../types';
import { getProductQuickWhatsAppUrl } from '../utils/whatsapp';

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
  if (!product) return null;

  const quickWaUrl = getProductQuickWhatsAppUrl(product);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-bold flex items-center justify-center">
              <Zap className="w-4 h-4 fill-slate-950" />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Spesifikasi Lengkap</span>
              <h3 className="text-lg font-bold text-slate-900 leading-tight">{product.name}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup Modal"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Top Summary Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-amber-50/70 border border-amber-200/70 rounded-xl p-4 text-center">
            <div>
              <div className="text-xs text-amber-800 font-medium">Kapasitas kVA</div>
              <div className="text-xl font-display font-extrabold text-amber-900">{product.kva} kVA</div>
            </div>
            <div>
              <div className="text-xs text-amber-800 font-medium">Kapasitas kW</div>
              <div className="text-xl font-display font-extrabold text-amber-900">{product.kw} kW</div>
            </div>
            <div>
              <div className="text-xs text-amber-800 font-medium">Tingkat Kebisingan</div>
              <div className="text-sm font-bold text-amber-950 mt-1">{product.noiseLevel}</div>
            </div>
            <div>
              <div className="text-xs text-amber-800 font-medium">Tipe Listrik</div>
              <div className="text-sm font-bold text-amber-950 mt-1">{product.phase}</div>
            </div>
          </div>

          {/* Technical Specs Grid */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-500" />
              <span>Detail Teknis & Mesin</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm">
              <div className="flex justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-500">Merek Engine / Mesin:</span>
                <span className="font-semibold text-slate-900">{product.engineBrand}</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-500">Merek Alternator:</span>
                <span className="font-semibold text-slate-900">{product.alternatorBrand}</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-500">Jenis Bahan Bakar:</span>
                <span className="font-semibold text-slate-900">{product.fuelType}</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-500">Konsumsi BBM:</span>
                <span className="font-semibold text-slate-900">{product.fuelConsumption}</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-500">Kapasitas Tangki:</span>
                <span className="font-semibold text-slate-900">{product.tankCapacity}</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-500">Dimensi Box Silent:</span>
                <span className="font-semibold text-slate-900">{product.dimensions}</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-500">Berat Unit:</span>
                <span className="font-semibold text-slate-900">{product.weight}</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-500">Estimasi Biaya Sewa:</span>
                <span className="font-bold text-amber-600">{product.startingPriceEstimate}</span>
              </div>
            </div>
          </div>

          {/* Ideal Applications & Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-2.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Sangat Cocok Untuk:</span>
              </h4>
              <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700">
                {product.idealFor.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-2.5 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-500" />
                <span>Paket Sewa Sudah Termasuk:</span>
              </h4>
              <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700">
                {product.includedItems.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 text-center sm:text-left">
            Siap kirim ke seluruh Kota Cirebon, Indramayu, Majalengka, Kuningan.
          </div>
          
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <a
              href={quickWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat WA Unit Ini</span>
            </a>

            <button
              onClick={() => {
                onSelectForBooking(product);
                onClose();
              }}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>Pilih & Isi Form Booking</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

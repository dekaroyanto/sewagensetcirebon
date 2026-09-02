import React from 'react';
import { 
  Zap, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Layers,
  VolumeX,
  Clock,
  ChevronRight
} from 'lucide-react';
import { GENSET_PRODUCTS } from '../data/gensets';

interface CatalogGuideSectionProps {
  onOpenFullCatalog: () => void;
  onGoToBooking: () => void;
}

export const CatalogGuideSection: React.FC<CatalogGuideSectionProps> = ({ 
  onOpenFullCatalog,
  onGoToBooking
}) => {
  const guideCategories = [
    {
      title: 'Daya Kecil (10 - 30 kVA)',
      range: '8 kW - 24 kW',
      engine: 'Yanmar / Isuzu Diesel',
      noise: '<63 dB (Sangat Hening)',
      suitableFor: 'Resepsi Pernikahan Rumah, Stand Pameran, Ruko, Cafe & Sound System 5.000W',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      popularUnit: 'Silent 20 kVA',
      tag: 'Paling Laris Wedding Rumahan',
      bgGradient: 'from-amber-500/10 via-slate-900 to-slate-900'
    },
    {
      title: 'Daya Menengah (45 - 100 kVA)',
      range: '36 kW - 80 kW',
      engine: 'Cummins / Perkins Turbo',
      noise: '<67 dB (Kedap Suara)',
      suitableFor: 'Konser Musik, Wedding Ballroom Hotel, AC Standing 5-10 PK, Videotron & Proyek',
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
      popularUnit: 'Silent 60 kVA & 100 kVA',
      tag: 'Favorit Konser & Gedung',
      bgGradient: 'from-blue-500/10 via-slate-900 to-slate-900'
    },
    {
      title: 'Daya Besar (150 - 250 kVA)',
      range: '120 kW - 200 kW',
      engine: 'Cummins Heavy Duty / Perkins',
      noise: '<70 dB (Canopy Rockwool)',
      suitableFor: 'Backup Kawasan Industri, Cold Storage Pelabuhan Cirebon, Mall & Proyek Infrastruktur',
      image: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&w=800&q=80',
      popularUnit: 'Silent 150 kVA & 250 kVA',
      tag: 'Kapasitas Industri & Pabrik',
      bgGradient: 'from-emerald-500/10 via-slate-900 to-slate-900'
    },
    {
      title: 'Mega Power (350 - 500+ kVA)',
      range: '300 kW - 400+ kW',
      engine: 'Cummins 15L / Mitsubishi / Paralleling',
      noise: '<72 dB (Kontainer Silent)',
      suitableFor: 'Mega Proyek Bandara Kertajati, Festival Akbar Multi-Stage & Pabrik Manufaktur Besar',
      image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
      popularUnit: 'Silent 500 kVA Paralleling',
      tag: 'Mega Power Proyek Besar',
      bgGradient: 'from-purple-500/10 via-slate-900 to-slate-900'
    }
  ];

  return (
    <section className="py-14 sm:py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-3">
            <Layers className="w-3.5 h-3.5 text-amber-600" />
            <span>Panduan Pilihan Kapasitas Genset</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold text-slate-900 tracking-tight">
            Pilih Kapasitas Daya Sesuai Kebutuhan Acara Anda
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            Kami menyediakan genset silent tipe tertutup (*soundproof canopy*) mulai 10 kVA hingga 500+ kVA. Semua unit terawat prima, irit solar, dan didampingi operator standby di Cirebon.
          </p>
        </div>

        {/* 4 Category Guide Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-10">
          {guideCategories.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-900 text-white rounded-2xl overflow-hidden border border-slate-800 shadow-lg hover:shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between group"
            >
              <div className="relative aspect-16/9 overflow-hidden bg-slate-950">
                <img
                  src={item.image}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                
                {/* Badge Tag */}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
                    {item.tag}
                  </span>
                </div>

                <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                  <div>
                    <span className="text-xs font-bold text-amber-400 block">{item.range}</span>
                    <h3 className="text-lg sm:text-xl font-display font-bold text-white leading-tight">
                      {item.title}
                    </h3>
                  </div>
                  <span className="text-[11px] bg-slate-800/90 text-slate-300 px-2.5 py-1 rounded-md border border-slate-700">
                    {item.popularUnit}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <VolumeX className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Tingkat Kebisingan: <strong className="text-white">{item.noise}</strong></span>
                  </div>
                  
                  <div className="flex items-start gap-2 text-slate-300">
                    <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>Mesin & Alternator: <strong className="text-white">{item.engine}</strong></span>
                  </div>

                  <div className="pt-2 border-t border-slate-800 text-slate-300">
                    <span className="text-slate-400 font-semibold block mb-1">Kebutuhan Acara / Lokasi:</span>
                    <p className="leading-relaxed text-slate-300">{item.suitableFor}</p>
                  </div>
                </div>

                {/* Card Button */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <button
                    onClick={onOpenFullCatalog}
                    className="text-xs font-bold text-amber-400 group-hover:text-amber-300 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Lihat Spesifikasi & Pilihan Unit</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button
                    onClick={onGoToBooking}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer transition-colors"
                  >
                    Booking
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Big Banner CTA to Dedicated Catalog Page */}
        <div className="rounded-2xl bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600 p-6 sm:p-10 text-slate-950 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/10 text-slate-950 text-xs font-extrabold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Halaman Khusus Katalog Genset</span>
            </div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-display font-extrabold tracking-tight">
              Ingin Mengetahui Rincian Unit 10 kVA s/d 500+ kVA?
            </h3>
            <p className="text-xs sm:text-sm text-slate-900 font-medium">
              Kunjungi halaman katalog terpisah kami untuk melihat foto unit asli, dimensi ukuran, konsumsi solar per jam, dan fasilitas pendukung seperti kabel & operator.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
            <button
              onClick={onOpenFullCatalog}
              id="open-catalog-cta-btn"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-extrabold text-sm shadow-md flex items-center justify-center gap-2 transition-transform hover:scale-102 active:scale-98 cursor-pointer"
            >
              <span>Buka Halaman Katalog Lengkap</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

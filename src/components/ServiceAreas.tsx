import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  MapPin,
  Truck,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Navigation,
  ChevronLeft,
  ChevronRight,
  MoveHorizontal
} from 'lucide-react';
import { motion } from 'motion/react';
import { COMPANY_INFO } from '../data/company';
import { getGeneralWhatsAppUrl } from '../utils/whatsapp';

export const ServiceAreas: React.FC = () => {
  const areas = [
    {
      title: 'Kota Cirebon',
      type: 'Wilayah Utama (Prioritas 1)',
      districts: ['Kejaksan', 'Kesambi', 'Lemahwungkuk', 'Harjamukti', 'Pekalipan'],
      deliveryTime: '30 - 60 Menit Siap Tiba',
      popularUsage: 'Pernikahan Gedung/Tenda, Hotel, Kantor, Cafe, Hajatan Warga',
      featured: true
    },
    {
      title: 'Kabupaten Cirebon',
      type: 'Cakupan Lengkap',
      districts: ['Sumber', 'Kedawung', 'Weru', 'Plered', 'Palimanan', 'Arjawinangun', 'Klangenan', 'Losari', 'Ciledug', 'Mundu', 'Beber'],
      deliveryTime: '45 - 90 Menit Siap Tiba',
      popularUsage: 'Pabrik Rotan, Proyek Jalan, Pabrik Manufaktur, Pesta Perumahan',
      featured: true
    },
    {
      title: 'Kabupaten Kuningan',
      type: 'Wilayah Penyangga',
      districts: ['Kuningan Kota', 'Cilimus', 'Cigugur', 'Jalaksana', 'Kramatmulya', 'Mandirancan', 'Luragung'],
      deliveryTime: '60 - 120 Menit Siap Tiba',
      popularUsage: 'Villa Wisata, Resepsi Outdoor Pegunungan, Resort, Proyek Wisata',
      featured: false
    },
    {
      title: 'Kabupaten Majalengka',
      type: 'Kawasan Industri & Bandara',
      districts: ['Kertajati (BIJB)', 'Jatiwangi', 'Kadipaten', 'Majalengka Kota', 'Dawuan', 'Sumberjaya'],
      deliveryTime: '60 - 120 Menit Siap Tiba',
      popularUsage: 'Kawasan Industri Pabrik Garmen, Proyek Bandara, Konser Panggung',
      featured: false
    },
    {
      title: 'Kabupaten Indramayu',
      type: 'Kawasan Pesisir & Migas',
      districts: ['Jatibarang', 'Karangampel', 'Indramayu Kota', 'Balongan', 'Krangkeng', 'Lohbener'],
      deliveryTime: '60 - 120 Menit Siap Tiba',
      popularUsage: 'Proyek Infrastruktur Pesisir, Hajatan Besar, Cold Storage, Pabrik',
      featured: false
    }
  ];

  // Scroll Container Ref & State for Horizontal Navigation
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  const checkScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const cardWidth = container.clientWidth > 768 ? 370 : 300;
    const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  // Mouse Drag to Scroll Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeftState(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollContainerRef.current.scrollLeft = scrollLeftState - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <section id="cakupan" className="py-16 sm:py-20 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 relative overflow-hidden border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header with Motion */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8"
        >
          <div className="max-w-2xl text-left">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
              Melayani Kota Cirebon &amp; Se-Wilayah Ciayumajakuning
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Didukung armada towing dan truk pengangkut pribadi siap memobilisasi genset tepat waktu langsung ke titik lokasi acara Anda.
            </p>
          </div>

          {/* Left / Right Scroll Buttons */}
          <div className="flex items-center gap-2 shrink-0 self-start md:self-auto">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              aria-label="Scroll Area ke Kiri"
              className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${canScrollLeft
                ? 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:bg-amber-500 hover:text-slate-950 hover:border-amber-500 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-300 dark:text-slate-700 cursor-not-allowed'
                }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              aria-label="Scroll Area ke Kanan"
              className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${canScrollRight
                ? 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:bg-amber-500 hover:text-slate-950 hover:border-amber-500 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-300 dark:text-slate-700 cursor-not-allowed'
                }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Scroll Control Bar & Navigation Hint */}
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <MoveHorizontal className="w-4 h-4 text-amber-500 animate-pulse" />
            <span className="font-medium">Geser kartu ke kanan dan kiri untuk melihat 5 wilayah cakupan</span>
          </div>
        </div>

        {/* Scrollable Areas Cards (Supports Left & Right Drag, Swipe, Wheel & Buttons) */}
        <div
          ref={scrollContainerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className={`flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-4 sm:gap-6 pb-6 pt-1 px-[calc((100vw-84vw)/2)] sm:px-1 -mx-4 sm:mx-0 select-none scroll-smooth ${isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
          style={{
            scrollBehavior: isDragging ? 'auto' : 'smooth',
            WebkitOverflowScrolling: 'touch',
            scrollPaddingLeft: 'calc((100vw - 84vw) / 2)',
            scrollPaddingRight: 'calc((100vw - 84vw) / 2)'
          }}
        >
          {areas.map((area, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.45, delay: idx * 0.08 }}
              className={`w-[84vw] sm:w-[350px] md:w-[360px] shrink-0 snap-center sm:snap-start rounded-2xl p-5 sm:p-6 border transition-all flex flex-col justify-between ${area.featured
                ? 'bg-white dark:bg-slate-900 border-amber-400 dark:border-amber-600/60 shadow-lg shadow-amber-500/5'
                : 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700'
                }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${area.featured
                    ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}>
                    {area.type}
                  </span>

                  <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    <Clock className="w-3.5 h-3.5" />
                    {area.deliveryTime.split(' ')[0]} {area.deliveryTime.split(' ')[1]}
                  </span>
                </div>

                <h3 className="text-lg font-display font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-amber-500 shrink-0" />
                  <span>{area.title}</span>
                </h3>

                <div className="mt-3">
                  <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
                    Kecamatan Populer:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {area.districts.map((d, i) => (
                      <span
                        key={i}
                        className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700"
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                    Sering Digunakan Untuk:
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {area.popularUsage}
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-amber-500" />
                  <span>{area.deliveryTime}</span>
                </span>

                <a
                  href={getGeneralWhatsAppUrl(`Halo Admin SGC, saya mau tanya sewa genset untuk lokasi di wilayah ${area.title}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                >
                  <span>Cek Ongkir &amp; Jadwal</span>
                </a>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

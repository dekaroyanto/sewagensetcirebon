import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  MapPin,
  Truck,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Navigation,
  ChevronLeft,
  ChevronRight,
  MoveHorizontal,
} from "lucide-react";
import { motion } from "motion/react";
import { COMPANY_INFO } from "../data/company";
import { getGeneralWhatsAppUrl } from "../utils/whatsapp";

export const ServiceAreas: React.FC = () => {
  const areas = [
    {
      title: "Kota Cirebon",
      type: "Wilayah Utama (Prioritas 1)",
      districts: [
        "Kejaksan",
        "Kesambi",
        "Lemahwungkuk",
        "Harjamukti",
        "Pekalipan",
      ],
      deliveryTime: "30 - 60 Menit Siap Tiba",
      popularUsage:
        "Pernikahan Gedung/Tenda, Hotel, Kantor, Cafe, Hajatan Warga",
      featured: true,
    },
    {
      title: "Kabupaten Cirebon",
      type: "Cakupan Lengkap",
      districts: [
        "Sumber",
        "Kedawung",
        "Weru",
        "Plered",
        "Palimanan",
        "Arjawinangun",
        "Klangenan",
        "Losari",
        "Ciledug",
        "Mundu",
        "Beber",
      ],
      deliveryTime: "45 - 90 Menit Siap Tiba",
      popularUsage:
        "Pabrik Rotan, Proyek Jalan, Pabrik Manufaktur, Pesta Perumahan",
      featured: true,
    },
    {
      title: "Kabupaten Kuningan",
      type: "Wilayah Penyangga",
      districts: [
        "Kuningan Kota",
        "Cilimus",
        "Cigugur",
        "Jalaksana",
        "Kramatmulya",
        "Mandirancan",
        "Luragung",
      ],
      deliveryTime: "60 - 120 Menit Siap Tiba",
      popularUsage:
        "Villa Wisata, Resepsi Outdoor Pegunungan, Resort, Proyek Wisata",
      featured: false,
    },
    {
      title: "Kabupaten Majalengka",
      type: "Kawasan Industri & Bandara",
      districts: [
        "Kertajati (BIJB)",
        "Jatiwangi",
        "Kadipaten",
        "Majalengka Kota",
        "Dawuan",
        "Sumberjaya",
      ],
      deliveryTime: "60 - 120 Menit Siap Tiba",
      popularUsage:
        "Kawasan Industri Pabrik Garmen, Proyek Bandara, Konser Panggung",
      featured: false,
    },
    {
      title: "Kabupaten Indramayu",
      type: "Kawasan Pesisir & Migas",
      districts: [
        "Jatibarang",
        "Karangampel",
        "Indramayu Kota",
        "Balongan",
        "Krangkeng",
        "Lohbener",
      ],
      deliveryTime: "60 - 120 Menit Siap Tiba",
      popularUsage:
        "Proyek Infrastruktur Pesisir, Hajatan Besar, Cold Storage, Pabrik",
      featured: false,
    },
    {
      title: "Kabupaten Brebes",
      type: "Wilayah Penyangga Pantura",
      districts: [
        "Brebes",
        "Tanjung",
        "Bulakamba",
        "Wanasari",
        "Ketanggungan",
        "Jatibarang",
        "Losari",
        "Bumiayu",
      ],
      deliveryTime: "90 - 150 Menit Siap Tiba",
      popularUsage:
        "Hajatan & Pernikahan, Gudang & Industri, Proyek Infrastruktur, Acara Outdoor",
      featured: false,
    },
    {
      title: "Kota & Kabupaten Tegal",
      type: "Wilayah Pantura & Industri",
      districts: [
        "Tegal Barat",
        "Tegal Timur",
        "Adiwerna",
        "Dukuhturi",
        "Talang",
        "Slawi",
        "Kramat",
        "Lebaksiu",
      ],
      deliveryTime: "90 - 150 Menit Siap Tiba",
      popularUsage:
        "Pabrik & Gudang, Pernikahan, Hajatan Besar, Proyek Konstruksi, Event Outdoor",
      featured: false,
    },
  ];

  // Scroll Container Ref & State for Horizontal Navigation
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const checkScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const { scrollLeft, scrollWidth, clientWidth } = container;
    setCanScrollLeft(scrollLeft > 15);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 15);

    // Deteksi card yang paling dekat ke tengah layar
    const containerCenter = scrollLeft + clientWidth / 2;
    const cards = container.querySelectorAll<HTMLElement>(".service-area-card");
    let closestIndex = 0;
    let minDiff = Infinity;
    cards.forEach((card, idx) => {
      const cardCenter = card.offsetLeft + card.clientWidth / 2;
      const diff = Math.abs(containerCenter - cardCenter);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = idx;
      }
    });
    setActiveIndex(closestIndex);
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  // Scroll presisi ke card tertentu agar selalu pas di tengah
  const scrollToIndex = useCallback((index: number) => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const cards = container.querySelectorAll<HTMLElement>(".service-area-card");
    if (cards[index]) {
      const card = cards[index];
      const containerWidth = container.clientWidth;
      const cardWidth = card.clientWidth;
      const cardLeft = card.offsetLeft;
      const targetScrollLeft = cardLeft - (containerWidth - cardWidth) / 2;
      container.scrollTo({
        left: targetScrollLeft,
        behavior: "smooth",
      });
      setActiveIndex(index);
    }
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const cards = container.querySelectorAll<HTMLElement>(".service-area-card");
    if (!cards.length) return;

    const containerCenter = container.scrollLeft + container.clientWidth / 2;
    let closestIndex = 0;
    let minDiff = Infinity;
    cards.forEach((card, idx) => {
      const cardCenter = card.offsetLeft + card.clientWidth / 2;
      const diff = Math.abs(containerCenter - cardCenter);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = idx;
      }
    });

    const targetIndex =
      direction === "left"
        ? Math.max(0, closestIndex - 1)
        : Math.min(cards.length - 1, closestIndex + 1);

    scrollToIndex(targetIndex);
  };

  // Mouse Drag to Scroll Handlers (Desktop)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setHasMoved(false);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeftState(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    if (Math.abs(walk) > 5) {
      setHasMoved(true);
    }
    scrollContainerRef.current.scrollLeft = scrollLeftState - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleCardClick = (index: number) => {
    if (hasMoved) return;
    scrollToIndex(index);
  };

  return (
    <section
      id="cakupan"
      className="py-16 sm:py-20 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 relative overflow-hidden border-b border-slate-200 dark:border-slate-800 transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Motion */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6"
        >
          <div className="max-w-2xl text-left">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
              Melayani Kota Cirebon &amp; Se-Wilayah Ciayumajakuning
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Didukung armada towing dan truk pengangkut pribadi siap
              memobilisasi genset tepat waktu langsung ke titik lokasi acara
              Anda.
            </p>
          </div>

          {/* Left / Right Scroll Buttons & Counter */}
          <div className="flex items-center gap-2.5 shrink-0 self-start md:self-auto">
            <div className="px-2.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
              0{activeIndex + 1}{" "}
              <span className="text-slate-400 dark:text-slate-500">
                / 0{areas.length}
              </span>
            </div>

            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              aria-label="Scroll Area ke Kiri"
              className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                canScrollLeft
                  ? "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:bg-amber-500 hover:text-slate-950 hover:border-amber-500 shadow-xs"
                  : "bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-300 dark:text-slate-700 opacity-50 cursor-not-allowed"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              aria-label="Scroll Area ke Kanan"
              className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                canScrollRight
                  ? "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:bg-amber-500 hover:text-slate-950 hover:border-amber-500 shadow-xs"
                  : "bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-300 dark:text-slate-700 opacity-50 cursor-not-allowed"
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
            <span className="font-medium">
              Geser atau scroll kartu ke kanan dan kiri untuk melihat wilayah
            </span>
          </div>
        </div>

        {/* Scrollable Areas Cards (Fluid swipe, touch gesture, no stopper) */}
        <div
          ref={scrollContainerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className={`relative flex overflow-x-auto touch-pan-x touch-pan-y scrollbar-none gap-4 sm:gap-6 pb-5 pt-1 select-none -mx-4 px-[9vw] sm:mx-0 sm:px-2 ${
            isDragging ? "cursor-grabbing" : "snap-x snap-proximity cursor-grab"
          }`}
          style={{
            scrollBehavior: isDragging ? "auto" : "smooth",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {areas.map((area, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              onClick={() => handleCardClick(idx)}
              className={`service-area-card w-[82vw] sm:w-[350px] md:w-[360px] h-auto shrink-0 snap-center rounded-2xl p-6 sm:p-8 border transition-all duration-300 flex flex-col justify-center text-center cursor-pointer ${
                activeIndex === idx
                  ? "bg-white dark:bg-slate-900 border-amber-500 dark:border-amber-500 shadow-xl shadow-amber-500/10 scale-[1.01]"
                  : area.featured
                    ? "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 shadow-sm"
                    : "bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              <h3 className="text-xl font-display font-extrabold text-slate-900 dark:text-white flex items-center justify-center gap-2">
                <MapPin
                  className={`w-6 h-6 shrink-0 transition-colors ${
                    activeIndex === idx ? "text-amber-500" : "text-amber-500/80"
                  }`}
                />
                <span>{area.title}</span>
              </h3>

              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                  Sering Digunakan Untuk:
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {area.popularUsage}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pagination Dots Indicator */}
        <div className="flex items-center justify-center gap-2 mt-4">
          {areas.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollToIndex(idx)}
              aria-label={`Lihat wilayah ${areas[idx].title}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                activeIndex === idx
                  ? "w-8 bg-amber-500 shadow-sm shadow-amber-500/50"
                  : "w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-500"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

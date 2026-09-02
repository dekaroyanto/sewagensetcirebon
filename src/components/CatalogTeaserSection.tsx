import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Zap,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Volume2,
  ShieldCheck,
  SlidersHorizontal,
  Cpu,
  MoveHorizontal
} from 'lucide-react';
import { motion } from 'motion/react';
import { GENSET_PRODUCTS } from '../data/gensets';
import { GensetProduct } from '../types';

interface CatalogTeaserSectionProps {
  onOpenCatalog: () => void;
  onGoToBooking: (genset?: GensetProduct) => void;
}

export const CatalogTeaserSection: React.FC<CatalogTeaserSectionProps> = ({
  onOpenCatalog,
  onGoToBooking
}) => {
  // Curated spotlight units
  const carouselItems = [
    GENSET_PRODUCTS[1], // 20 kVA
    GENSET_PRODUCTS[4], // 60 kVA
    GENSET_PRODUCTS[6], // 100 kVA
    GENSET_PRODUCTS.find(p => p.id === 'ac-standing-5pk') || GENSET_PRODUCTS[2],
    GENSET_PRODUCTS.find(p => p.id === 'paket-wedding-genset-ac') || GENSET_PRODUCTS[5],
    GENSET_PRODUCTS[8] || GENSET_PRODUCTS[0], // 250 kVA
  ];

  const [activeIndex, setActiveIndex] = useState(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Wheel & Gesture states
  const lastWheelTime = useRef<number>(0);
  const dragStartX = useRef<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Auto slide rotation
  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % carouselItems.length);
      }, 5500);
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isAutoPlaying, carouselItems.length]);

  const handlePrev = useCallback(() => {
    setIsAutoPlaying(false);
    setActiveIndex((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
  }, [carouselItems.length]);

  const handleNext = useCallback(() => {
    setIsAutoPlaying(false);
    setActiveIndex((prev) => (prev + 1) % carouselItems.length);
  }, [carouselItems.length]);

  const handleSelectCard = (index: number) => {
    setIsAutoPlaying(false);
    setActiveIndex(index);
  };

  // Wheel / Trackpad horizontal & vertical scroll handling with smooth damping throttle
  const handleWheel = (e: React.WheelEvent) => {
    const now = Date.now();
    // Throttle wheel events to prevent rapid multiple index jumps
    if (now - lastWheelTime.current < 550) return;

    // Detect significant horizontal or vertical delta
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;

    if (Math.abs(delta) > 20) {
      lastWheelTime.current = now;
      if (delta > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  // Touch Swipe handlers for mobile & desktop
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsAutoPlaying(false);
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const diffX = touchStartX.current - e.touches[0].clientX;
    const diffY = touchStartY.current - e.touches[0].clientY;
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
      // Horizontal swipe intent
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const endX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - endX;

    // Refined threshold 30px
    if (Math.abs(diff) > 30) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  // Mouse Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsAutoPlaying(false);
    setIsDragging(true);
    dragStartX.current = e.clientX;
  };

  const handleMouseMove = () => {
    // handled on mouse up
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging || dragStartX.current === null) {
      setIsDragging(false);
      return;
    }
    const diff = dragStartX.current - e.clientX;
    if (Math.abs(diff) > 30) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    setIsDragging(false);
    dragStartX.current = null;
  };

  const currentUnit = carouselItems[activeIndex];

  return (
    <section
      id="pilihan-genset"
      className="py-16 sm:py-20 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white relative overflow-hidden transition-colors duration-300"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => {
        if (!isDragging) setIsAutoPlaying(true);
      }}
    >
      {/* Background Ambient Glow (Light & Dark mode adapted) */}
      <div className="absolute inset-0 bg-radial from-amber-500/5 dark:from-amber-500/10 via-slate-100/50 dark:via-slate-900/60 to-slate-50 dark:to-slate-950 pointer-events-none" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-amber-500/10 dark:bg-amber-500/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-20 right-10 w-96 h-96 bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Grid Pattern overlay for high-tech industrial feel */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(currentColor 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header Block */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl text-left">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              Pilihan Unit Genset Silent &amp; AC Standing
            </h2>
            <p className="mt-2.5 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Jelajahi unit prima kami dalam tampilan 3D Carousel. <strong>Scroll atau geser kartu</strong> langsung untuk melihat spesifikasi detail dan kapasitas ideal acara Anda.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Navigation Carousel Controls */}
            <div className="flex items-center gap-2 bg-white dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm dark:shadow-none backdrop-blur-md">
              <button
                onClick={handlePrev}
                id="carousel-prev-btn"
                aria-label="Previous Unit"
                className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-amber-500 hover:text-slate-950 dark:bg-slate-700/60 dark:hover:bg-amber-500 dark:hover:text-slate-950 text-slate-700 dark:text-white flex items-center justify-center transition-colors cursor-pointer group shadow-2xs"
              >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
              </button>
              <div className="px-3 text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                0{activeIndex + 1} <span className="text-slate-400 dark:text-slate-500">/ 0{carouselItems.length}</span>
              </div>
              <button
                onClick={handleNext}
                id="carousel-next-btn"
                aria-label="Next Unit"
                className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-amber-500 hover:text-slate-950 dark:bg-slate-700/60 dark:hover:bg-amber-500 dark:hover:text-slate-950 text-slate-700 dark:text-white flex items-center justify-center transition-colors cursor-pointer group shadow-2xs"
              >
                <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            <button
              onClick={onOpenCatalog}
              id="teaser-explore-catalog-btn"
              className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-md hover:shadow-amber-500/25 transition-all flex items-center gap-2 cursor-pointer group"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>Semua Unit</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Swipe / Scroll Hint */}
        <div className="flex items-center justify-center gap-2 mb-2 text-xs font-medium text-slate-500 dark:text-slate-400 select-none">
          <MoveHorizontal className="w-4 h-4 text-amber-500 animate-pulse" />
          <span>Scroll trackpad / geser kartu untuk mengganti unit</span>
        </div>

        {/* 3D Carousel Interactive Stage (Supports Wheel, Touch Swipe & Mouse Drag) */}
        <div
          className="relative py-2 my-2 select-none touch-pan-y"
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >

          {/* Main 3D Stage Container */}
          <div className={`relative h-[430px] sm:h-[470px] md:h-[500px] flex items-center justify-center perspective-[1400px] ${isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}>
            {carouselItems.map((item, idx) => {
              // Calculate relative offset from active item
              let offset = idx - activeIndex;
              if (offset < -Math.floor(carouselItems.length / 2)) {
                offset += carouselItems.length;
              } else if (offset > Math.floor(carouselItems.length / 2)) {
                offset -= carouselItems.length;
              }

              const isActive = offset === 0;
              const isPrev = offset === -1;
              const isNext = offset === 1;
              const isVisible = Math.abs(offset) <= 2;

              if (!isVisible) return null;

              // 3D positioning styles
              let translateX = '0%';
              let translateZ = 0;
              let rotateY = 0;
              let scale = 1;
              let opacity = 1;
              let zIndex = 10;

              if (isActive) {
                translateX = '0%';
                translateZ = 70;
                rotateY = 0;
                scale = 1;
                opacity = 1;
                zIndex = 30;
              } else if (isPrev) {
                translateX = '-66%';
                translateZ = -80;
                rotateY = 22;
                scale = 0.86;
                opacity = 0.82;
                zIndex = 20;
              } else if (isNext) {
                translateX = '66%';
                translateZ = -80;
                rotateY = -22;
                scale = 0.86;
                opacity = 0.82;
                zIndex = 20;
              } else if (offset === -2) {
                translateX = '-116%';
                translateZ = -180;
                rotateY = 32;
                scale = 0.72;
                opacity = 0.38;
                zIndex = 10;
              } else if (offset === 2) {
                translateX = '116%';
                translateZ = -180;
                rotateY = -32;
                scale = 0.72;
                opacity = 0.38;
                zIndex = 10;
              }

              return (
                <motion.div
                  key={item.id}
                  onClick={() => handleSelectCard(idx)}
                  drag={isActive ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -40 || info.velocity.x < -300) {
                      handleNext();
                    } else if (info.offset.x > 40 || info.velocity.x > 300) {
                      handlePrev();
                    }
                  }}
                  animate={{
                    x: translateX,
                    z: translateZ,
                    rotateY: rotateY,
                    scale: scale,
                    opacity: opacity,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 280,
                    damping: 26,
                    mass: 0.8
                  }}
                  style={{
                    zIndex,
                    transformStyle: 'preserve-3d',
                    willChange: 'transform, opacity',
                  }}
                  className={`absolute w-[290px] sm:w-[350px] md:w-[410px] h-[400px] sm:h-[440px] md:h-[470px] rounded-3xl cursor-pointer select-none ${isActive
                    ? 'shadow-2xl shadow-amber-500/20 ring-2 ring-amber-500 dark:ring-amber-400 bg-white dark:bg-slate-800'
                    : 'shadow-lg shadow-slate-300/50 dark:shadow-black/50 bg-slate-100 dark:bg-slate-850'
                    }`}
                >
                  <div className="relative w-full h-full rounded-3xl overflow-hidden bg-gradient-to-b from-white via-slate-50 to-slate-100 dark:from-slate-800/95 dark:via-slate-850 dark:to-slate-900 border border-slate-200 dark:border-slate-700/80 flex flex-col justify-between p-5 sm:p-6 backdrop-blur-xl">

                    {/* Card Top: Tags & Category Badge */}
                    <div className="flex items-center justify-between gap-2 z-10">
                      <span className={`px-3 py-1 rounded-xl font-black text-xs tracking-wider uppercase shadow-xs flex items-center gap-1.5 ${item.category === 'ac'
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : item.category === 'paket'
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                          : 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950'
                        }`}>
                        <Zap className="w-3 h-3 fill-current" />
                        {item.category === 'ac'
                          ? `${item.pk ? `${item.pk} PK` : 'AC Standing'}`
                          : item.category === 'paket'
                            ? 'Paket Wedding'
                            : `${item.kva} kVA`}
                      </span>

                      <span className="px-2.5 py-1 rounded-lg bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1 backdrop-blur-md shadow-2xs">
                        <Volume2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        {item.noiseLevel.split('@')[0] || item.noiseLevel.split('(')[0]}
                      </span>
                    </div>

                    {/* Card Middle: 3D Product Visual */}
                    <div className="relative my-auto w-full aspect-16/10 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-700/50 group shadow-inner">
                      <img
                        src={item.image}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />

                      {/* Gradient sheen overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-60 dark:opacity-80" />

                      {/* Spec Overlay Pill */}
                      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] font-medium text-slate-800 dark:text-slate-300 px-2.5 py-1 rounded-lg bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/80 shadow-xs backdrop-blur-md">
                        <span className="flex items-center gap-1 truncate font-semibold">
                          <Cpu className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                          <span className="truncate">{item.engineBrand}</span>
                        </span>
                        <span className="font-mono text-amber-700 dark:text-amber-400 font-bold shrink-0 ml-2">
                          {item.kw ? `${item.kw} kW` : item.phase}
                        </span>
                      </div>
                    </div>

                    {/* Card Bottom: Info & Action */}
                    <div className="space-y-3 z-10 pt-1 text-left">
                      <div>
                        <div className="text-[10px] font-mono font-bold tracking-widest text-amber-700 dark:text-amber-400 uppercase">
                          {item.tag || item.categoryLabel}
                        </div>
                        <h3 className="font-display font-extrabold text-base sm:text-lg text-slate-900 dark:text-white leading-tight mt-0.5 line-clamp-1">
                          {item.name}
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 mt-1">
                          {item.idealFor[0] || 'Cocok untuk event & industri'}
                        </p>
                      </div>
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {carouselItems.map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectCard(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-500 ease-out cursor-pointer ${activeIndex === idx
                  ? 'w-8 bg-amber-500 dark:bg-amber-400 shadow-sm shadow-amber-500/50'
                  : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-500'
                  }`}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

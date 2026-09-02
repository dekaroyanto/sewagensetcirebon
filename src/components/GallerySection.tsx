import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Camera,
  MapPin,
  Zap,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  MessageSquare,
  Sparkles,
  MoveHorizontal,
  Volume2,
  Calendar,
  Layers,
  SlidersHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GALLERY_ITEMS } from '../data/gallery';
import { GalleryItem } from '../types';
import { getGeneralWhatsAppUrl } from '../utils/whatsapp';

export const GallerySection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const [selectedZoomPhoto, setSelectedZoomPhoto] = useState<GalleryItem | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartX = useRef<number | null>(null);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const totalItems = GALLERY_ITEMS.length;

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % totalItems);
  }, [totalItems]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + totalItems) % totalItems);
  }, [totalItems]);

  const handleSelectCard = (index: number) => {
    setIsAutoPlaying(false);
    setActiveIndex(index);
  };

  // Auto-play timer (every 5.5 seconds)
  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayTimerRef.current = setInterval(() => {
        handleNext();
      }, 5500);
    }
    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isAutoPlaying, handleNext]);

  // Touch / Pointer Swipe Handlers for mobile & desktop
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
    // If horizontal swipe is dominant, prevent accidental scroll lock
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
      // Horizontal intent
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diffX) > 30) {
      if (diffX > 0) handleNext();
      else handlePrev();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  // Mouse Drag
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsAutoPlaying(false);
    setIsDragging(true);
    dragStartX.current = e.clientX;
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging || dragStartX.current === null) {
      setIsDragging(false);
      return;
    }
    const diff = dragStartX.current - e.clientX;
    if (Math.abs(diff) > 30) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
    setIsDragging(false);
    dragStartX.current = null;
  };

  // Wheel horizontal scroll with refined damping throttle
  const lastWheelTime = useRef<number>(0);
  const handleWheel = (e: React.WheelEvent) => {
    const now = Date.now();
    if (now - lastWheelTime.current < 550) return;
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(delta) > 20) {
      lastWheelTime.current = now;
      if (delta > 0) handleNext();
      else handlePrev();
    }
  };

  const activeItem = GALLERY_ITEMS[activeIndex];

  return (
    <section
      id="portofolio"
      className="py-16 sm:py-24 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 relative overflow-hidden transition-colors duration-300"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => {
        if (!isDragging) setIsAutoPlaying(true);
      }}
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-radial from-amber-500/10 dark:from-amber-500/15 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-amber-500/10 dark:bg-amber-500/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(currentColor 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 text-left">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/20 dark:border-amber-500/30 text-xs font-black tracking-widest uppercase mb-3">
              <Camera className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Cool Slide Image Showcase</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              Galeri Portofolio &amp; Dokumentasi Acara
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Jelajahi dokumentasi nyata pengerjaan genset &amp; AC standing di Cirebon. <strong>Scroll trackpad, geser mouse, atau klik kartu</strong> untuk berpindah foto.
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm dark:shadow-none backdrop-blur-md">
              <button
                onClick={handlePrev}
                id="gallery-prev-btn"
                aria-label="Foto Sebelumnya"
                className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-amber-500 hover:text-slate-950 dark:bg-slate-700/70 dark:hover:bg-amber-500 dark:hover:text-slate-950 text-slate-700 dark:text-white flex items-center justify-center transition-colors cursor-pointer group shadow-2xs"
              >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
              </button>

              <div className="px-3 text-xs font-mono font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                <span>0{activeIndex + 1}</span>
                <span className="text-slate-400 dark:text-slate-500">/ 0{totalItems}</span>
              </div>

              <button
                onClick={handleNext}
                id="gallery-next-btn"
                aria-label="Foto Berikutnya"
                className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-amber-500 hover:text-slate-950 dark:bg-slate-700/70 dark:hover:bg-amber-500 dark:hover:text-slate-950 text-slate-700 dark:text-white flex items-center justify-center transition-colors cursor-pointer group shadow-2xs"
              >
                <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Interaction Hint */}
        <div className="flex items-center justify-center gap-2 mb-4 text-xs font-medium text-slate-500 dark:text-slate-400 select-none">
          <MoveHorizontal className="w-4 h-4 text-amber-500 animate-pulse" />
          <span>Geser gambar ke samping atau klik kartu untuk melihat detail</span>
        </div>

        {/* COOL SLIDE IMAGE STAGE (Ultra-Smooth 3D Perspective Coverflow) */}
        <div
          className="relative py-4 my-2 select-none touch-pan-y"
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        >
          <div className={`relative h-[400px] sm:h-[460px] md:h-[500px] flex items-center justify-center perspective-[1400px] ${isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}>
            {GALLERY_ITEMS.map((item, idx) => {
              // Calculate offset relative to active item
              let offset = idx - activeIndex;
              if (offset < -Math.floor(totalItems / 2)) {
                offset += totalItems;
              } else if (offset > Math.floor(totalItems / 2)) {
                offset -= totalItems;
              }

              const isActive = offset === 0;
              const isPrev = offset === -1;
              const isNext = offset === 1;
              const isFarPrev = offset === -2;
              const isFarNext = offset === 2;
              const isVisible = Math.abs(offset) <= 2;

              if (!isVisible) return null;

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
                rotateY = 20;
                scale = 0.86;
                opacity = 0.82;
                zIndex = 20;
              } else if (isNext) {
                translateX = '66%';
                translateZ = -80;
                rotateY = -20;
                scale = 0.86;
                opacity = 0.82;
                zIndex = 20;
              } else if (isFarPrev) {
                translateX = '-116%';
                translateZ = -180;
                rotateY = 32;
                scale = 0.72;
                opacity = 0.38;
                zIndex = 10;
              } else if (isFarNext) {
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
                  className={`absolute w-[290px] sm:w-[400px] md:w-[480px] h-[380px] sm:h-[440px] md:h-[480px] rounded-3xl overflow-hidden cursor-pointer select-none ${isActive
                    ? 'shadow-2xl shadow-amber-500/25 ring-2 ring-amber-500 dark:ring-amber-400'
                    : 'shadow-xl shadow-slate-900/30'
                    }`}
                >
                  <div className="relative w-full h-full bg-slate-950 flex flex-col justify-between overflow-hidden group">

                    {/* Background Full Photo */}
                    <img
                      src={item.image}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />

                    {/* Subtle Gradient Overlays (Keeps photo completely visible) */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/15 to-black/30 pointer-events-none" />

                    {/* Top Bar on Image: Category Badge & Zoom Button */}
                    <div className="relative z-10 p-3.5 sm:p-5 flex items-center justify-between">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedZoomPhoto(item);
                        }}
                        className="p-2 rounded-xl bg-slate-950/60 hover:bg-amber-500 hover:text-slate-950 text-white backdrop-blur-md transition-all shadow-md cursor-pointer group/zoom"
                        title="Perbesar Foto & Detail"
                      >
                        <Maximize2 className="w-4 h-4 group-hover/zoom:scale-110 transition-transform" />
                      </button>
                    </div>

                    {/* Bottom Content on Image: ONLY TITLE (No description covering image) */}
                    <div className="relative z-10 p-4 sm:p-6 text-left text-white">
                      <h3 className="text-base sm:text-xl font-display font-bold text-white drop-shadow-md leading-snug line-clamp-2">
                        {item.title}
                      </h3>
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {GALLERY_ITEMS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectCard(idx)}
                aria-label={`Lihat foto ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-500 ease-out cursor-pointer ${activeIndex === idx
                  ? 'w-8 bg-amber-500 dark:bg-amber-400 shadow-sm shadow-amber-500/50'
                  : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-500'
                  }`}
              />
            ))}
          </div>

        </div>

      </div>

      {/* Lightbox Zoom Modal */}
      {selectedZoomPhoto && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setSelectedZoomPhoto(null)}
        >
          <div
            className="relative bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-16/10 bg-slate-950">
              <img
                src={selectedZoomPhoto.image}
                alt={selectedZoomPhoto.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedZoomPhoto(null)}
                className="absolute top-3 right-3 p-2 rounded-full bg-slate-900/80 text-white hover:bg-amber-500 hover:text-slate-950 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 text-left bg-white dark:bg-slate-900">
              <span className="px-2.5 py-1 rounded-md bg-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider">
                {selectedZoomPhoto.category}
              </span>
              <h3 className="text-xl font-display font-extrabold text-slate-900 dark:text-white mt-2">
                {selectedZoomPhoto.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2">
                {selectedZoomPhoto.description}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  {selectedZoomPhoto.location}
                </span>
                <span>•</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Unit: {selectedZoomPhoto.gensetUsed}
                </span>
                {selectedZoomPhoto.peakLoad && (
                  <>
                    <span>•</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                      {selectedZoomPhoto.peakLoad}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};

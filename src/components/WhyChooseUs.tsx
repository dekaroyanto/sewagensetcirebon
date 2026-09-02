import React, { useState, useEffect, useRef } from 'react';
import {
  VolumeX,
  UserCheck,
  Truck,
  Zap,
  Wrench,
  ShieldCheck,
  Clock,
  Award,
  CheckCircle2,
  Layers,
  Sparkles,
  MoveHorizontal,
  ChevronLeft,
  ChevronRight,
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { COMPANY_INFO } from '../data/company';

export const WhyChooseUs: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right'>('right');
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const totalCards = COMPANY_INFO.advantages.length;

  const iconMap: Record<string, { icon: React.ReactNode; bg: string; border: string; text: string; tag: string }> = {
    VolumeX: {
      icon: <VolumeX className="w-6 h-6" />,
      bg: 'bg-amber-100 dark:bg-amber-950/60',
      border: 'border-amber-300 dark:border-amber-800',
      text: 'text-amber-700 dark:text-amber-400',
      tag: '< 65 dB Super Silent'
    },
    UserCheck: {
      icon: <UserCheck className="w-6 h-6" />,
      bg: 'bg-emerald-100 dark:bg-emerald-950/60',
      border: 'border-emerald-300 dark:border-emerald-800',
      text: 'text-emerald-700 dark:text-emerald-400',
      tag: 'Teknisi Sertifikasi'
    },
    Truck: {
      icon: <Truck className="w-6 h-6" />,
      bg: 'bg-blue-100 dark:bg-blue-950/60',
      border: 'border-blue-300 dark:border-blue-800',
      text: 'text-blue-700 dark:text-blue-400',
      tag: 'Pengiriman Cepat'
    },
    Zap: {
      icon: <Zap className="w-6 h-6" />,
      bg: 'bg-yellow-100 dark:bg-yellow-950/60',
      border: 'border-yellow-300 dark:border-yellow-800',
      text: 'text-yellow-700 dark:text-yellow-400',
      tag: 'Kabel 50m & ATS'
    },
    Wrench: {
      icon: <Wrench className="w-6 h-6" />,
      bg: 'bg-purple-100 dark:bg-purple-950/60',
      border: 'border-purple-300 dark:border-purple-800',
      text: 'text-purple-700 dark:text-purple-400',
      tag: 'Load Bank Test 100%'
    },
    ShieldCheck: {
      icon: <ShieldCheck className="w-6 h-6" />,
      bg: 'bg-rose-100 dark:bg-rose-950/60',
      border: 'border-rose-300 dark:border-rose-800',
      text: 'text-rose-700 dark:text-rose-400',
      tag: 'Garansi Unit Backup'
    },
  };

  const handleNextCard = () => {
    setSwipeDirection('right');
    setActiveIdx((prev) => (prev + 1) % totalCards);
  };

  const handlePrevCard = () => {
    setSwipeDirection('left');
    setActiveIdx((prev) => (prev - 1 + totalCards) % totalCards);
  };

  const handleSelectCard = (index: number) => {
    setSwipeDirection(index > activeIdx ? 'right' : 'left');
    setActiveIdx(index);
  };

  // Wheel horizontal / vertical scroll
  const lastWheelTime = useRef<number>(0);
  const handleWheel = (e: React.WheelEvent) => {
    const now = Date.now();
    if (now - lastWheelTime.current < 500) return;
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(delta) > 20) {
      lastWheelTime.current = now;
      if (delta > 0) handleNextCard();
      else handlePrevCard();
    }
  };

  // Touch swipe support for mobile
  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsAutoPlay(false);
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 30) {
      if (diff > 0) handleNextCard();
      else handlePrevCard();
    }
    touchStartX.current = null;
  };

  // Auto cycle cards every 4.5s if not hovered
  useEffect(() => {
    if (!isAutoPlay) return;
    const timer = setInterval(() => {
      handleNextCard();
    }, 4500);
    return () => clearInterval(timer);
  }, [isAutoPlay, activeIdx]);

  return (
    <section
      id="keunggulan"
      className="py-16 sm:py-24 bg-white dark:bg-[#070a0f] text-slate-900 dark:text-slate-100 relative overflow-hidden select-none border-b border-slate-200 dark:border-slate-800 transition-colors duration-200"
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-amber-100/60 dark:bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-blue-100/60 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
            Mengapa Memilih Sewa Genset Cirebon (SGC)?
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Buka &amp; geser kartu di bawah untuk melihat standar mutu genset, respon teknisi, dan garansi operasional tanpa padam.
          </p>
        </motion.div>

        {/* Stacked Cards Interactive Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center max-w-6xl mx-auto">

          {/* Left Column: 3D Stacked Deck Canvas with Explicit Movement */}
          <div
            className="lg:col-span-7 flex flex-col items-center"
            onWheel={handleWheel}
          >

            {/* Gesture Hint & Controls Header */}
            <div className="w-full max-w-md flex items-center justify-between mb-4 px-1 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5 font-medium text-amber-700 dark:text-amber-400">
                <MoveHorizontal className="w-4 h-4 text-amber-600 dark:text-amber-400 animate-pulse" />
                <span>Geser/swipe kartu ke kanan &amp; kiri</span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevCard}
                  aria-label="Kartu Sebelumnya"
                  className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-amber-500 hover:text-slate-950 dark:bg-slate-800 dark:hover:bg-amber-500 dark:hover:text-slate-950 text-slate-700 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <span className="font-mono font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-[11px]">
                  0{activeIdx + 1} / 0{totalCards}
                </span>

                <button
                  onClick={handleNextCard}
                  aria-label="Kartu Berikutnya"
                  className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-amber-500 hover:text-slate-950 dark:bg-slate-800 dark:hover:bg-amber-500 dark:hover:text-slate-950 text-slate-700 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 3D Stack Stage Container with Depth & Visible Layering */}
            <div
              className="relative w-full max-w-md h-[380px] sm:h-[400px] flex items-center justify-center perspective-[1200px] touch-pan-y"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >

              {/* Stack Underlay Shadows to emphasize card thickness */}
              <div className="absolute w-[86%] h-[320px] rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 translate-y-10 scale-90 blur-[1px] pointer-events-none" />

              {COMPANY_INFO.advantages.map((adv, index) => {
                const position = (index - activeIdx + totalCards) % totalCards;
                const isTop = position === 0;
                const isVisible = position < 4;

                if (!isVisible) return null;

                const yOffset = position * 18;
                const scale = 1 - position * 0.06;
                const xOffset = position === 0 ? 0 : position === 1 ? 8 : position === 2 ? -8 : 4;
                const rotation = position === 0 ? 0 : position === 1 ? 4.5 : position === 2 ? -4.5 : 2;
                const zIndex = totalCards - position;
                const opacity = position === 0 ? 1 : position === 1 ? 0.9 : position === 2 ? 0.7 : 0.45;

                const styleConfig = iconMap[adv.icon] || {
                  icon: <Zap className="w-6 h-6" />,
                  bg: 'bg-amber-100 dark:bg-amber-950/60',
                  border: 'border-amber-300 dark:border-amber-800',
                  text: 'text-amber-700 dark:text-amber-400',
                  tag: 'Standar Terbaik'
                };

                return (
                  <motion.div
                    key={adv.title}
                    id={`stacked-card-${index}`}
                    style={{
                      zIndex,
                      transformOrigin: 'bottom center',
                      willChange: 'transform, opacity'
                    }}
                    initial={{
                      scale: 0.8,
                      y: 60,
                      opacity: 0,
                    }}
                    animate={{
                      x: xOffset,
                      y: yOffset,
                      scale,
                      rotate: rotation,
                      opacity,
                    }}
                    exit={{
                      x: swipeDirection === 'right' ? 380 : -380,
                      rotate: swipeDirection === 'right' ? 25 : -25,
                      opacity: 0,
                      transition: { duration: 0.35, ease: 'easeInOut' }
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 260,
                      damping: 24,
                      mass: 0.8,
                    }}
                    drag={isTop ? 'x' : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.8}
                    whileDrag={{
                      scale: 1.02,
                      cursor: 'grabbing',
                    }}
                    onDragEnd={(_, info) => {
                      if (info.offset.x > 35 || info.velocity.x > 180) {
                        handlePrevCard();
                      } else if (info.offset.x < -35 || info.velocity.x < -180) {
                        handleNextCard();
                      }
                    }}
                    onClick={() => {
                      if (!isTop) handleSelectCard(index);
                    }}
                    className={`absolute inset-x-0 mx-auto w-full h-[330px] sm:h-[350px] rounded-3xl p-6 sm:p-7 flex flex-col justify-between border transition-shadow duration-300 select-none ${isTop
                      ? 'bg-white dark:bg-slate-900 border-amber-500 shadow-xl cursor-grab active:cursor-grabbing ring-1 ring-amber-400/40'
                      : 'bg-slate-50 dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 shadow-md cursor-pointer hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                  >
                    <div>
                      {/* Top Header of Card */}
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-2xs ${styleConfig.bg} ${styleConfig.border} ${styleConfig.text}`}>
                          {styleConfig.icon}
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-1 rounded-full border text-[11px] font-bold ${isTop
                            ? 'bg-amber-100 dark:bg-amber-950/80 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300'
                            : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                            }`}>
                            {styleConfig.tag}
                          </span>
                          <span className="text-sm font-mono font-extrabold text-slate-400 dark:text-slate-500">
                            0{index + 1}
                          </span>
                        </div>
                      </div>

                      {/* Card Title & Main Content */}
                      <h3 className="text-xl sm:text-2xl font-display font-black text-slate-900 dark:text-white mb-2.5 tracking-tight">
                        {adv.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-4">
                        {adv.description}
                      </p>
                    </div>

                    {/* Card Bottom Meta Bar */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                        <span>SGC Certified Quality</span>
                      </div>
                      <span className={`text-[11px] font-bold transition-colors ${isTop ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400 dark:text-slate-500'
                        }`}>
                        {isTop ? 'Kartu Aktif' : 'Klik Bawa ke Depan'}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

          </div>

          {/* Right Column: Interactive Benefit List Selector */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Pilih Kartu Keunggulan</span>
              </div>
              <button
                onClick={() => handleSelectCard((activeIdx + 1) % totalCards)}
                className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Kocok / Ganti</span>
              </button>
            </div>

            {COMPANY_INFO.advantages.map((item, idx) => {
              const isActive = idx === activeIdx;
              const styleConfig = iconMap[item.icon] || {
                icon: <Zap className="w-4 h-4" />,
                bg: 'bg-amber-100 dark:bg-amber-950/60',
                border: 'border-amber-300 dark:border-amber-800',
                text: 'text-amber-700 dark:text-amber-400',
                tag: ''
              };

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectCard(idx)}
                  id={`stacked-selector-${idx}`}
                  className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center justify-between group ${isActive
                    ? 'bg-amber-50/70 dark:bg-amber-950/40 border-amber-500 shadow-sm translate-x-2'
                    : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center border text-xs shrink-0 transition-transform group-hover:scale-105 ${isActive
                      ? `${styleConfig.bg} ${styleConfig.border} ${styleConfig.text} shadow-2xs`
                      : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                      }`}>
                      {styleConfig.icon}
                    </div>
                    <div>
                      <div className={`text-sm font-bold transition-colors ${isActive ? 'text-amber-700 dark:text-amber-400' : 'text-slate-900 dark:text-slate-200 group-hover:text-amber-600 dark:group-hover:text-amber-400'
                        }`}>
                        {item.title}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                        {item.description}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    {isActive && (
                      <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
                    )}
                    <span className={`text-xs font-mono font-bold ${isActive ? 'text-amber-600 dark:text-amber-400 font-extrabold' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                      }`}>
                      0{idx + 1}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
};

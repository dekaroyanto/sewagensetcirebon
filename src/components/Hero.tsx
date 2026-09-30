import React, { useState } from "react";
import {
  Zap,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Clock,
  Truck,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

// Swiper styles
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Images
import slideWarehouseImg from "../assets/images/HERO1fix.jpg";
import slideFleetImg from "../assets/images/hero_slide_fleet.jpg";
import slideTeamImg from "../assets/images/hero_slide_team.jpg";

interface HeroProps {
  onExploreCatalog: () => void;
  onViewPricelist: () => void;
}

interface HeroSlide {
  id: string;
  badgeIcon: React.ReactNode;
  badgeText: string;
  titlePrefix: string;
  titleHighlight: string;
  titleSuffix?: string;
  subtitle: string;
  image: string;
  imageAlt: string;
  imagePositionClass: string;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreCatalog,
  onViewPricelist,
}) => {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);

  const slides: HeroSlide[] = [
    {
      id: "slide-warehouse",
      badgeIcon: <Truck className="w-3.5 h-3.5 text-amber-400" />,
      badgeText: "Workshop & Pool Mandiri",
      titlePrefix: "Katalog Unit Terlengkap ",
      titleHighlight: "Ready 24 Jam",
      titleSuffix: " di Cirebon",
      subtitle:
        "Penyedia pasokan listrik prima 10 – 500+ kVA dan pendingin AC Standing 5 PK",
      image: slideWarehouseImg,
      imageAlt: "Hangar Workshop Pool Genset SGC Cirebon",
      imagePositionClass: "object-center sm:object-[center_65%]",
    },
    {
      id: "slide-fleet",
      badgeIcon: <Clock className="w-3.5 h-3.5 text-amber-400" />,
      badgeText: "Mobile Trailer Unit",
      titlePrefix: "Pengiriman ",
      titleHighlight: "Cepat dan Aman ",
      titleSuffix: "Sampai di Lokasi",
      subtitle:
        "Siap melayani pengiriman genset ke berbagai lokasi dengan cepat dan aman.",
      image: slideFleetImg,
      imageAlt: "Armada Mobile Genset Trailer SGC Cirebon",
      imagePositionClass: "object-center",
    },
    {
      id: "slide-team",
      badgeIcon: <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />,
      badgeText: "Teknisi & Operator Berpengalaman",
      titlePrefix: "Didukung Teknisi Ahli & ",
      titleHighlight: "Pelayanan Terpercaya",
      titleSuffix: "",
      subtitle:
        "Tenaga ahli dan operator berpengalaman siap memberikan pelayanan profesional dari pemasangan hingga operasional.",
      image: slideTeamImg,
      imageAlt: "Tim Teknisi Ahli SGC Cirebon",
      imagePositionClass: "object-center sm:object-[center_28%]",
    },
  ];

  return (
    <section
      className="relative overflow-hidden bg-slate-950 text-white select-none group/hero w-full"
      id="hero-banner-section"
      aria-label="Hero Banner Slider Sewa Genset Cirebon"
    >
      {/* Main Swiper Banner Slider - Full Viewport Height without white gap below */}
      <div className="relative w-full h-[calc(100vh-68px)] sm:h-[calc(100vh-72px)] min-h-[560px] max-h-[920px]">
        <Swiper
          modules={[Autoplay, EffectFade, Navigation, Pagination]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          speed={900}
          loop={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          onSwiper={(swiper) => {
            setSwiperInstance(swiper);
          }}
          onSlideChange={(swiper) => {
            setActiveIndex(swiper.realIndex);
          }}
          onAutoplayTimeLeft={(_, __, percentage) => {
            setProgressPercent(1 - percentage);
          }}
          className="w-full h-full"
        >
          {slides.map((slide, index) => {
            const isCurrent = activeIndex === index;
            return (
              <SwiperSlide
                key={slide.id}
                className="relative w-full h-full overflow-hidden bg-slate-950"
              >
                {/* Background Image: Bright, Crisp & Natural with subtle zoom */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={slide.image}
                    alt={slide.imageAlt}
                    className={`w-full h-full object-cover ${slide.imagePositionClass} transition-transform duration-[7000ms] ease-out will-change-transform ${
                      isCurrent ? "scale-105" : "scale-100"
                    }`}
                    referrerPolicy="no-referrer"
                    loading={index === 0 ? "eager" : "lazy"}
                  />

                  {/* Ultra-soft bottom vignette: Very light so image colors and details show through */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                  {/* Subtle top shade for header contrast */}
                  <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />
                </div>

                {/* Pure Typography & Action Buttons (No card container to avoid blocking the banner image) */}
                <div className="relative z-10 w-full h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-24 sm:pb-28 lg:pb-28 pointer-events-none">
                  <div
                    className={`pointer-events-auto max-w-lg lg:max-w-xl text-left transition-all duration-700 ${
                      isCurrent
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-4"
                    }`}
                  >
                    {/* Badge Pill */}
                    {/* <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 border border-amber-400/40 text-amber-300 text-xs font-semibold tracking-wide mb-2 sm:mb-2.5 backdrop-blur-sm shadow-md">
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                      </span>
                      {slide.badgeIcon}
                      <span>{slide.badgeText}</span>
                    </div> */}

                    {/* Bold Headline with strong drop-shadow directly on image */}
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black tracking-tight text-white leading-tight mb-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                      {slide.titlePrefix}
                      <span className="text-amber-400 underline decoration-amber-500/40 decoration-2 underline-offset-4">
                        {slide.titleHighlight}
                      </span>
                      {slide.titleSuffix}
                    </h2>

                    {/* Clean 1-Sentence Subtitle with drop-shadow directly on image */}
                    <p className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed mb-3.5 sm:mb-4 line-clamp-2 drop-shadow-[0_1px_5px_rgba(0,0,0,0.9)] max-w-lg">
                      {slide.subtitle}
                    </p>

                    {/* Exactly 2 Buttons: "Lihat Pricelist" & "Lihat Katalog" */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                      <button
                        type="button"
                        onClick={onViewPricelist}
                        id={`hero-slide-${index}-pricelist-btn`}
                        className="px-5 sm:px-6 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-extrabold text-xs sm:text-sm shadow-lg shadow-amber-500/30 flex items-center justify-center gap-1.5 transition-all transform hover:-translate-y-0.5 cursor-pointer"
                      >
                        {/* <Zap className="w-3.5 h-3.5 fill-slate-950" /> */}
                        <span>Lihat Pricelist</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={onExploreCatalog}
                        id={`hero-slide-${index}-catalog-btn`}
                        className="px-5 sm:px-6 py-2.5 rounded-full bg-black/40 hover:bg-black/60 active:bg-black/70 text-white font-semibold text-xs sm:text-sm border border-white/30 hover:border-white/50 backdrop-blur-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:-translate-y-0.5 shadow-md"
                      >
                        <span>Lihat Katalog</span>
                      </button>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        {/* Minimalist Navigation & Indicators Dock - Positioned at LEFT to never block Floater Button */}
        <div className="absolute bottom-5 sm:bottom-7 left-0 right-0 z-20 pointer-events-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-start">
            {/* Left Controls Dock: Prev, Pagination, Next, Counter */}
            <div className="pointer-events-auto flex items-center gap-2 sm:gap-3 bg-black/40 hover:bg-black/55 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/20 shadow-xl transition-all">
              {/* Previous Button (Left) */}
              <button
                type="button"
                onClick={() => swiperInstance?.slidePrev()}
                id="hero-swiper-prev"
                aria-label="Slide Sebelumnya"
                className="p-1 sm:p-1.5 rounded-full text-slate-200 hover:text-amber-400 hover:bg-white/10 active:scale-90 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Pagination Dots / Pills */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => swiperInstance?.slideToLoop(idx)}
                    id={`hero-pagination-dot-${idx}`}
                    aria-label={`Pindah ke slide ${idx + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      activeIndex === idx
                        ? "w-6 sm:w-8 bg-amber-400 shadow-sm shadow-amber-400/50"
                        : "w-2 bg-white/40 hover:bg-white/70"
                    }`}
                  />
                ))}
              </div>

              {/* Next Button (Right) */}
              <button
                type="button"
                onClick={() => swiperInstance?.slideNext()}
                id="hero-swiper-next"
                aria-label="Slide Selanjutnya"
                className="p-1 sm:p-1.5 rounded-full text-slate-200 hover:text-amber-400 hover:bg-white/10 active:scale-90 transition-all cursor-pointer"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Slide Counter (e.g. 01 / 04) */}
              <div className="pl-2 border-l border-white/20 text-xs font-mono font-medium text-slate-200 flex items-center gap-1">
                <span className="text-amber-400 font-bold">
                  {String(activeIndex + 1).padStart(2, "0")}
                </span>
                <span className="text-slate-400">/</span>
                <span>{String(slides.length).padStart(2, "0")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Autoplay Linear Progress Bar at Very Bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/60 z-30 pointer-events-none">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 transition-all duration-100 ease-linear"
            style={{
              width: `${Math.min(100, Math.max(0, progressPercent * 100))}%`,
            }}
          />
        </div>
      </div>
    </section>
  );
};

import React from 'react';
import {
  Zap,
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';
import genset3DImg from '../assets/images/genset_3d_light_render_1788333128663.jpg';
import heroBgImg from '../assets/images/hero_light_industrial_bg_1788333143328.jpg';

interface HeroProps {
  onExploreCatalog: () => void;
  onGoToBooking: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreCatalog, onGoToBooking }) => {
  return (
    <section className="relative overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pt-12 pb-14 lg:pt-20 lg:pb-20 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">

      {/* Industrial Background Image with Bright Clean & Dark Overlays */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBgImg}
          alt="SGC Industrial Warehouse Background"
          className="w-full h-full object-cover object-center opacity-20 dark:opacity-10 select-none pointer-events-none scale-105"
          referrerPolicy="no-referrer"
        />
        {/* Soft theme overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-slate-50/90 to-slate-50/95 dark:from-slate-950 dark:via-slate-950/90 dark:to-slate-950/95" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-white/70 dark:from-slate-950 dark:via-transparent dark:to-slate-900/60" />
      </div>

      {/* Subtle Ambient Radial Warmth */}
      <div className="absolute top-1/3 left-1/4 -translate-x-1/2 w-[600px] h-[350px] bg-amber-200/40 dark:bg-amber-500/10 blur-[130px] rounded-full pointer-events-none z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main 2-Column Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* Left Column: Clean Value Proposition */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-6 space-y-6 text-left"
          >

            {/* Headline */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-display font-black tracking-tight text-slate-900 dark:text-white leading-[1.12]">
                Rental Genset Silent &amp; <br />
                <span className="text-amber-600 dark:text-amber-400">AC Standing</span> Cirebon
              </h1>
              <p className="text-base text-slate-600 dark:text-slate-300 max-w-lg font-normal leading-relaxed">
                Penyedia pasokan listrik prima <strong className="text-slate-900 dark:text-white font-bold">10 – 500+ kVA</strong> dan pendingin <strong className="text-slate-900 dark:text-white font-bold">AC Standing 3 &amp; 5 PK</strong>. Unit 3D industrial silent canopy, teknisi standby, dan instalasi lengkap.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onGoToBooking}
                id="hero-booking-btn"
                className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-extrabold text-sm shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>Konsultasi &amp; Sewa Unit</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onExploreCatalog}
                id="hero-catalog-btn"
                className="px-6 py-3.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-sm border border-slate-300 dark:border-slate-700 hover:border-slate-400 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
              >
                <span>Lihat Katalog Lengkap</span>
              </button>
            </div>

          </motion.div>

          {/* Right Column: Clean 3D Genset Render Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-6 flex justify-center"
          >
            <div className="relative w-full max-w-lg rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-2 sm:p-3">

              {/* 3D Genset Render Image */}
              <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-950 flex items-center justify-center">
                <img
                  src={genset3DImg}
                  alt="3D Render Genset Silent Canopy SGC Cirebon"
                  className="w-full h-full object-cover object-center transform hover:scale-103 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>

            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};



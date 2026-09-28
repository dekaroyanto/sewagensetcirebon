import React from "react";
import { ArrowLeft } from "lucide-react";
import { PricelistSection } from "./PricelistSection";

interface PricelistPageProps {
  onBackToHome: () => void;
}

export const PricelistPage: React.FC<PricelistPageProps> = ({
  onBackToHome,
}) => {
  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen py-8 sm:py-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Breadcrumbs & Back Button */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors shadow-2xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </button>

          <div className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
            <span>Beranda</span> <span className="mx-1">/</span>{" "}
            <strong className="text-slate-800 dark:text-slate-200">
              Daftar Harga Sewa Genset
            </strong>
          </div>
        </div>

        {/* Page Banner Header */}
        <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xs mb-10 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
              Daftar Harga Sewa Genset Cirebon
            </h1>
            <p className="mt-3 text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Daftar harga sewa harian (termasuk BBM) dan sewa bulanan (tanpa BBM) untuk kebutuhan daya listrik acara atau proyek Anda. Transparan dan kompetitif.
            </p>
          </div>
        </div>
      </div>

      <PricelistSection />
    </div>
  );
};

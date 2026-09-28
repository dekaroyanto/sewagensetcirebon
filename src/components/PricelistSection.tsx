import React, { useState } from "react";
import {
  dailyPrices,
  monthlyPrices,
  dailyTerms,
  monthlyTerms,
  acPrices,
  acTerms,
} from "../data/pricelist";
import { CheckCircle2, Info } from "lucide-react";

export const PricelistSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"harian" | "bulanan" | "ac">(
    "harian",
  );

  return (
    <section
      id="harga"
      className="py-20 bg-white dark:bg-slate-900 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-bold text-amber-600 dark:text-amber-500 tracking-wider uppercase mb-3">
            Daftar Harga Sewa
          </h2>
          <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-6">
            Pricelist Sewa Genset & AC
          </h3>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Transparan, kompetitif, dan sesuai dengan kebutuhan daya Anda.
          </p>
        </div>

        <div className="flex justify-center mb-10">
          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl inline-flex">
            <button
              onClick={() => setActiveTab("harian")}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                activeTab === "harian"
                  ? "bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Harian (Termasuk BBM)
            </button>
            <button
              onClick={() => setActiveTab("bulanan")}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                activeTab === "bulanan"
                  ? "bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Bulanan (Non BBM)
            </button>
            <button
              onClick={() => setActiveTab("ac")}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                activeTab === "ac"
                  ? "bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              AC Standing 5 PK
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Price Table */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-700">
            <div className="bg-amber-500 text-white p-4 text-center font-bold text-lg">
              {activeTab === "harian"
                ? "Sewa Genset Harian"
                : activeTab === "bulanan"
                  ? "Sewa Genset Bulanan"
                  : "Sewa AC Standing 5 PK"}
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {activeTab === "ac"
                ? acPrices.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors gap-2 sm:gap-0"
                    >
                      <span className="font-bold text-slate-900 dark:text-white">
                        {item.time}
                      </span>
                      <div className="flex flex-col items-start sm:items-end">
                        <div className="text-amber-600 dark:text-amber-400 font-bold">
                          {item.price}{" "}
                          <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                            {item.unit}
                          </span>
                        </div>
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                          {item.note}
                        </span>
                      </div>
                    </div>
                  ))
                : (activeTab === "harian" ? dailyPrices : monthlyPrices).map(
                    (item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                      >
                        <span className="font-bold text-slate-900 dark:text-white">
                          {item.capacity}
                        </span>
                        <span className="text-amber-600 dark:text-amber-400 font-bold">
                          {item.price}
                        </span>
                      </div>
                    ),
                  )}
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-8 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Info className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                Syarat & Ketentuan
              </h4>
            </div>
            <ul className="space-y-4">
              {(activeTab === "harian"
                ? dailyTerms
                : activeTab === "bulanan"
                  ? monthlyTerms
                  : acTerms
              ).map((term, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                    {term}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

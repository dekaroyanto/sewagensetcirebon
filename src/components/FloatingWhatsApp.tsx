import React, { useState } from 'react';
import { MessageSquare, X, Send, Sparkles, Phone, ShieldCheck, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { COMPANY_INFO } from '../data/company';
import { SGCLogo } from './SGCLogo';

export const FloatingWhatsApp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const quickTopics = [
    'Halo, saya mau sewa genset untuk acara pernikahan',
    'Halo, apakah genset 20 kVA ready untuk minggu ini?',
    'Halo, saya mau konsultasi daya sound system panggung',
    'Darurat mati listrik di Cirebon, butuh genset segera!'
  ];

  const handleSendCustom = (textToSend?: string) => {
    const text = textToSend || customMsg || 'Halo Admin Sewa Genset Cirebon (SGC), saya ingin konsultasi sewa genset silent di Cirebon.';
    const url = `https://wa.me/${COMPANY_INFO.whatsappRaw}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop to prevent clipping and guarantee clean close */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-[65] sm:hidden animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-[70] flex flex-col items-end">
        
        {/* Pop-up Chat Assistant Box */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="mb-3 w-[calc(100vw-2rem)] sm:w-92 max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[calc(100vh-120px)]"
            >
              
              {/* Pinned Header - Guaranteed Above Navbar and Content */}
              <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-3.5 sm:p-4 flex items-center justify-between shrink-0 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 p-1 flex items-center justify-center shadow-md">
                      <SGCLogo variant="emblem" size="custom" className="w-8 h-8" />
                    </div>
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-emerald-700"></span>
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm leading-tight text-white flex items-center gap-1.5">
                      <span>Customer Care SGC</span>
                      <span className="text-[9px] bg-emerald-800/80 text-emerald-200 px-1.5 py-0.2 rounded font-mono">24H</span>
                    </h4>
                    <p className="text-[11px] text-emerald-100 flex items-center gap-1 mt-0.5">
                      <span>Standby • Kota Cirebon & Sekitarnya</span>
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-emerald-800/80 text-white/80 hover:text-white transition-colors cursor-pointer"
                  aria-label="Tutup Chat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Body */}
              <div className="p-3.5 sm:p-4 space-y-3 bg-slate-50 dark:bg-slate-900 text-xs overflow-y-auto flex-1 overscroll-contain">
                <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 shadow-2xs leading-relaxed">
                  👋 Halo! Butuh info sewa genset silent untuk acara nikahan, konser, backup kantor, atau industri di Cirebon?
                  <br /><br />
                  Pilih pertanyaan cepat di bawah atau ketik pesan Anda:
                </div>

                {/* Quick Suggestion Chips */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                    Pertanyaan Cepat:
                  </span>
                  {quickTopics.map((topic, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendCustom(topic)}
                      className="w-full text-left p-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 text-slate-700 dark:text-slate-200 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors text-[11px] font-medium flex items-center justify-between group cursor-pointer shadow-2xs"
                    >
                      <span className="line-clamp-1">{topic}</span>
                      <Send className="w-3 h-3 text-slate-400 dark:text-slate-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 shrink-0 ml-1.5" />
                    </button>
                  ))}
                </div>

                {/* Custom Input */}
                <div className="pt-1">
                  <div className="relative">
                    <input
                      type="text"
                      value={customMsg}
                      onChange={(e) => setCustomMsg(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendCustom()}
                      placeholder="Tulis pesan Anda ke admin..."
                      className="w-full pl-3 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button
                      onClick={() => handleSendCustom()}
                      aria-label="Kirim Pesan"
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer shadow-xs"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>

              {/* Pinned Footer */}
              <div className="px-3.5 py-2 bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400 text-center flex items-center justify-center gap-1 shrink-0">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp Resmi: {COMPANY_INFO.phone}</span>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Floating Trigger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          id="floating-whatsapp-btn"
          aria-label="Buka Chat WhatsApp SGC 24 Jam"
          className="group relative flex items-center gap-2.5 px-4 py-3 sm:py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-xl shadow-emerald-800/30 transition-all cursor-pointer border border-emerald-400/30"
        >
          {/* Radar wave ping */}
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-400"></span>
          </span>

          <MessageSquare className="w-5 h-5 fill-white text-emerald-600" />
          <span className="hidden sm:inline">Tanya WA Admin (24 Jam)</span>
          <span className="sm:hidden font-extrabold">Chat WA 24 Jam</span>
        </button>

      </div>
    </>
  );
};


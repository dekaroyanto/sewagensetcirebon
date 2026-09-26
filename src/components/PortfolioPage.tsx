import React, { useState, useEffect } from 'react';
import {
  MapPin,
  ArrowLeft,
  X,
  MessageSquare,
  Calendar,
  Sparkles,
  Zap
} from 'lucide-react';
import { GALLERY_ITEMS } from '../data/gallery';
import { GalleryItem } from '../types';
import { getGeneralWhatsAppUrl, getPortfolioWhatsAppUrl } from '../utils/whatsapp';
import { BookingModal } from './BookingModal';
import { useBodyScrollLock, resetBodyScroll } from '../utils/scrollLock';
import { getGallery } from '../utils/api';

interface PortfolioPageProps {
  onBackToHome: () => void;
  onGoToBooking?: () => void;
  onOpenCatalog?: () => void;
  onToast: (msg: string) => void;
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({
  onBackToHome,
  onToast
}) => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(GALLERY_ITEMS);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);

  const loadGalleryData = () => {
    getGallery().then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setGalleryItems(data);
      }
    });
  };

  useEffect(() => {
    loadGalleryData();
    const handleSync = () => loadGalleryData();
    window.addEventListener('sgc_data_changed', handleSync);
    return () => window.removeEventListener('sgc_data_changed', handleSync);
  }, []);

  // Lock background body scroll safely when any modal is open
  useBodyScrollLock(Boolean(selectedItem || isBookingModalOpen));

  // Reset scroll safeguard on unmount
  useEffect(() => {
    return () => {
      resetBodyScroll();
    };
  }, []);

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen py-6 sm:py-10 animate-in fade-in duration-300 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top Breadcrumbs & Back Button */}
        <div className="flex items-center justify-between gap-4 mb-5 sm:mb-8">
          <button
            onClick={onBackToHome}
            id="portfolio-back-to-home-btn"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500 text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white text-xs sm:text-sm font-bold shadow-2xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </button>

          <div className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
            <span>Beranda</span> <span className="mx-1">/</span> <strong className="text-slate-900 dark:text-white">Portofolio Acara &amp; Proyek</strong>
          </div>
        </div>

        {/* Clean Header Banner */}
        <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 mb-8 border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800 text-[11px] font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Dokumentasi Lapangan SGC</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              Portofolio Sewa Genset &amp; AC Cirebon
            </h1>

            <p className="mt-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Dokumentasi nyata instalasi genset silent &amp; AC standing di berbagai acara resepsi pernikahan, konser musik, proyek konstruksi, dan fasilitas industri se-Ciayumajakuning.
            </p>
          </div>
        </div>

        {/* Clean Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-7">
          {galleryItems.map((item) => (
            <article
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-amber-400/50 dark:hover:border-amber-500/40 transition-all duration-300 overflow-hidden flex flex-col group cursor-pointer"
            >
              {/* Image */}
              <div className="relative aspect-16/10 overflow-hidden bg-slate-950">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Card Body: Lokasi, Judul, Deskripsi Singkat */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <div>
                  {/* Lokasi */}
                  <div className="flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1.5">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{item.location}</span>
                  </div>

                  {/* Judul */}
                  <h3 className="text-base sm:text-lg font-display font-bold text-slate-900 dark:text-white leading-snug group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {item.title}
                  </h3>

                  {/* Deskripsi Singkat */}
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                </div>

                {/* Subtle Action Hint */}
                <div className="mt-3 pt-2 text-[11px] font-semibold text-amber-600 dark:text-amber-400 group-hover:underline">
                  Klik untuk detail lengkap &rarr;
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Clean Bottom CTA Banner with Modal Trigger */}
        <div className="mt-12 sm:mt-16 bg-amber-500 text-slate-950 rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
          <div className="relative z-10 max-w-xl">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-display font-black tracking-tight leading-snug">
              Punya Rencana Acara di Cirebon &amp; Sekitarnya?
            </h2>

            <p className="mt-2 text-xs sm:text-sm text-slate-950/90 font-medium leading-relaxed">
              Konsultasikan kebutuhan kapasitas genset silent dan pendingin ruangan Anda bersama tim teknisi SGC, atau langsung isi formulir pemesanan online.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>Isi Formulir Booking Online</span>
              </button>

              <a
                href={getGeneralWhatsAppUrl('Konsultasi Kebutuhan Acara dari Halaman Portofolio')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white/90 hover:bg-white text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>Chat WhatsApp Langsung</span>
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* Simple Portfolio Detail Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto overscroll-contain animate-in fade-in duration-200"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="relative bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl max-w-xl w-full my-6 overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image */}
            <div className="relative aspect-16/10 bg-slate-950 overflow-hidden">
              <img
                src={selectedItem.image}
                alt={selectedItem.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedItem(null)}
                aria-label="Tutup"
                className="absolute top-3 right-3 p-2 rounded-full bg-slate-950/70 hover:bg-amber-500 hover:text-slate-950 text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 sm:p-6 space-y-4">
              {/* Location */}
              <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span>{selectedItem.location}</span>
              </div>

              {/* Title */}
              <h3 className="text-lg sm:text-xl font-display font-extrabold text-slate-900 dark:text-white leading-snug">
                {selectedItem.title}
              </h3>

              {/* Genset/AC unit used */}
              {selectedItem.gensetUsed && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs font-bold text-amber-800 dark:text-amber-300">
                  <Zap className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>{selectedItem.gensetUsed}</span>
                </div>
              )}

              {/* Full Description (No Line Clamp) */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                  Rincian Dokumentasi
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {selectedItem.description}
                </p>
              </div>

              {/* Client & Duration Meta Row (if present) */}
              {(selectedItem.client || selectedItem.duration) && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500 dark:text-slate-400">
                  {selectedItem.client && (
                    <span>
                      Klien: <strong className="text-slate-700 dark:text-slate-200">{selectedItem.client}</strong>
                    </span>
                  )}
                  {selectedItem.duration && (
                    <span>
                      Durasi: <strong className="text-slate-700 dark:text-slate-200">{selectedItem.duration}</strong>
                    </span>
                  )}
                </div>
              )}

              {/* Modal Bottom Actions */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                >
                  Tutup
                </button>

                <a
                  href={getPortfolioWhatsAppUrl(selectedItem)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Tanya Serupa via WA</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Booking Form Modal (Opens in-place without page reload/navigation) */}
      {isBookingModalOpen && (
        <BookingModal
          product={null}
          onClose={() => setIsBookingModalOpen(false)}
          onToast={onToast}
        />
      )}

    </div>
  );
};


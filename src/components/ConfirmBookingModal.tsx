import React, { useState } from 'react';
import {
  X,
  Send,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Building2,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Edit3,
  Zap,
  Layers,
  Sparkles,
  Loader2,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BookingFormData } from '../types';
import { COMPANY_INFO } from '../data/company';

interface ConfirmBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: BookingFormData;
  onConfirm: () => Promise<void> | void;
}

export const ConfirmBookingModal: React.FC<ConfirmBookingModalProps> = ({
  isOpen,
  onClose,
  formData,
  onConfirm
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleConfirmClick = async () => {
    try {
      setIsSubmitting(true);
      await onConfirm();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 dark:bg-amber-400/15 flex items-center justify-center text-amber-500 shrink-0">
                <CheckCircle2 className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-display font-black text-slate-900 dark:text-white">
                  Konfirmasi Booking Sewa
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Periksa rincian pesanan Anda sebelum dialihkan ke WhatsApp resmi
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Tutup konfirmasi"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content - Scrollable */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            
            {/* Unit Info Highlight Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-amber-100/60 dark:from-amber-950/30 dark:to-slate-800/50 border border-amber-200/80 dark:border-amber-800/50 flex items-start gap-3">
              <Zap className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  Unit & Paket Dipilih
                </div>
                <div className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                  {formData.selectedGensetName}
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold text-xs">
                    {formData.unitQuantity} Unit
                  </span>
                  {formData.acQuantity && formData.acQuantity > 0 ? (
                    <span className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 font-bold text-xs">
                      + {formData.acQuantity} Unit AC
                    </span>
                  ) : null}
                  <span className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs">
                    {formData.rentalType}
                  </span>
                </div>
              </div>
            </div>

            {/* Structured Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Data Penyewa */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-1">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-500" />
                  <span>Nama Lengkap (PIC)</span>
                </div>
                <div className="font-bold text-slate-900 dark:text-white">
                  {formData.fullName}
                </div>
                {formData.companyOrEvent && (
                  <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Building2 className="w-3 h-3" />
                    <span>{formData.companyOrEvent}</span>
                  </div>
                )}
              </div>

              {/* No WhatsApp */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-1">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-500" />
                  <span>No. WhatsApp</span>
                </div>
                <div className="font-bold text-slate-900 dark:text-white font-mono">
                  {formData.phone}
                </div>
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400">
                  Aktif untuk konfirmasi cepat
                </div>
              </div>

              {/* Jadwal Pelaksanaan */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-1">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-500" />
                  <span>Tanggal & Waktu Acara</span>
                </div>
                <div className="font-bold text-slate-900 dark:text-white">
                  {formData.startDate || 'Tanggal belum ditentukan'}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>Pukul {formData.startTime || '08:00'} WIB ({formData.duration})</span>
                </div>
              </div>

              {/* Wilayah Layanan */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-1">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span>Wilayah Cirebon</span>
                </div>
                <div className="font-bold text-slate-900 dark:text-white">
                  {formData.districtCirebon}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {formData.eventLocation}
                </div>
              </div>

            </div>

            {/* Paket & Tambahan */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Pilihan Paket:
                </span>
                <span className="font-bold text-amber-600 dark:text-amber-400">
                  {formData.packageType}
                </span>
              </div>

              {formData.additionalNeeds && formData.additionalNeeds.length > 0 && (
                <div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
                    Kebutuhan Tambahan:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {formData.additionalNeeds.map((need, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-[11px]"
                      >
                        ✓ {need}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {formData.notes && (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-0.5">
                    Catatan Khusus:
                  </span>
                  <p className="text-xs italic text-slate-600 dark:text-slate-300">
                    "{formData.notes}"
                  </p>
                </div>
              )}
            </div>

            {/* Information Notice */}
            <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 text-[11px] text-emerald-900 dark:text-emerald-300 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span>
                Data pesanan Anda otomatis disimpan ke database kami. Selanjutnya Anda akan dialihkan ke WhatsApp resmi <strong>{COMPANY_INFO.whatsappFormatted}</strong> dengan format pesan yang sudah otomatis terisi.
              </span>
            </div>

          </div>

          {/* Footer Actions */}
          <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
              <span>Periksa Kembali</span>
            </button>

            <button
              type="button"
              onClick={handleConfirmClick}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menyimpan & Mengalihkan...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Lanjut Kirim ke WhatsApp</span>
                </>
              )}
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

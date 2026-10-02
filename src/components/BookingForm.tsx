import React, { useState, useEffect } from 'react';
import {
  Zap,
  Send,
  Copy,
  Check,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Building2,
  FileText,
  ShieldCheck,
  Sparkles,
  Layers,
  MessageSquare,
  Fuel,
  Info,
  Wind,
  ChevronDown
} from 'lucide-react';
import { motion } from 'motion/react';
import { BookingFormData, GensetProduct } from '../types';
import { COMPANY_INFO } from '../data/company';
import {
  GENSET_MANUAL_OPTIONS,
  AC_MANUAL_OPTIONS,
  RENTAL_DURATIONS,
  matchGensetOption,
  matchAcOption
} from '../data/rentalOptions';
import {
  generateBookingWhatsAppMessage,
  getWhatsAppBookingUrl,
  copyToClipboard
} from '../utils/whatsapp';
import { submitBooking } from '../utils/api';
import { ConfirmBookingModal } from './ConfirmBookingModal';

interface BookingFormProps {
  preselectedProduct?: GensetProduct | null;
  onToast: (msg: string) => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({ preselectedProduct, onToast }) => {
  const isInitialAc = preselectedProduct?.product_type === 'ac';
  const initialGensetName = preselectedProduct && !isInitialAc ? matchGensetOption(preselectedProduct.kva || preselectedProduct.name) : 'Tanpa Genset';
  const initialAcName = isInitialAc ? 'AC Standing 5 PK' : 'Tanpa AC / Pendingin';

  const [formData, setFormData] = useState<BookingFormData>({
    fullName: '',
    companyOrEvent: '',
    phone: '',
    selectedGensetId: initialGensetName !== 'Tanpa Genset' ? `genset-${initialGensetName.toLowerCase().replace(/\s+/g, '')}` : '',
    selectedGensetName: initialGensetName,
    gensetQuantity: initialGensetName !== 'Tanpa Genset' ? 1 : 0,
    gensetDuration: '1 Hari (12 Jam Operasional)',
    selectedAcId: initialAcName !== 'Tanpa AC / Pendingin' ? 'ac-standing-5pk' : '',
    selectedAcName: initialAcName,
    acQuantity: initialAcName !== 'Tanpa AC / Pendingin' ? 1 : 0,
    acDuration: '1 Hari (12 Jam Operasional)',
    startDate: '',
    startTime: '08:00',
    eventLocation: '',
    notes: ''
  });

  const [copied, setCopied] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // Synchronize when a product is preselected from catalog or teaser
  useEffect(() => {
    if (preselectedProduct) {
      if (preselectedProduct.product_type === 'ac') {
        setFormData(prev => ({
          ...prev,
          selectedAcId: 'ac-standing-5pk',
          selectedAcName: 'AC Standing 5 PK',
          acQuantity: Math.max(1, prev.acQuantity || 1),
          selectedGensetId: '',
          selectedGensetName: 'Tanpa Genset',
          gensetQuantity: 0
        }));
      } else if (preselectedProduct.product_type === 'paket') {
        setFormData(prev => ({
          ...prev,
          selectedGensetId: 'genset-60kva',
          selectedGensetName: '60 KVA',
          gensetQuantity: 1,
          selectedAcId: 'ac-standing-5pk',
          selectedAcName: 'AC Standing 5 PK',
          acQuantity: 4
        }));
      } else {
        const matched = matchGensetOption(preselectedProduct.kva || preselectedProduct.name);
        setFormData(prev => ({
          ...prev,
          selectedGensetId: matched !== 'Tanpa Genset' ? `genset-${matched.toLowerCase().replace(/\s+/g, '')}` : '',
          selectedGensetName: matched,
          gensetQuantity: matched !== 'Tanpa Genset' ? Math.max(1, prev.gensetQuantity || 1) : 0,
          selectedAcId: '',
          selectedAcName: 'Tanpa AC / Pendingin',
          acQuantity: 0
        }));
      }
    }
  }, [preselectedProduct]);

  // Open confirmation modal with validation
  const handleOpenBookingConfirm = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formData.fullName.trim()) {
      onToast('Mohon isi nama lengkap / nama penanggung jawab pemesanan.');
      return;
    }
    if (!formData.phone.trim()) {
      onToast('Mohon isi nomor telepon / WhatsApp yang bisa dihubungi.');
      return;
    }

    const hasGenset = formData.gensetQuantity > 0 && formData.selectedGensetName && !formData.selectedGensetName.toLowerCase().includes('tanpa');
    const hasAc = formData.acQuantity > 0 && formData.selectedAcName && !formData.selectedAcName.toLowerCase().includes('tanpa');

    if (!hasGenset && !hasAc) {
      onToast('Mohon pilih minimal 1 unit Genset atau AC untuk disewa.');
      return;
    }

    if (!formData.eventLocation.trim()) {
      onToast('Mohon isi alamat / lokasi pelaksanaan acara di Cirebon.');
      return;
    }
    setIsConfirmModalOpen(true);
  };

  // Confirm booking: save to MySQL and open WhatsApp
  const handleConfirmBookingAndRedirect = async () => {
    try {
      await submitBooking(formData);
      onToast('Pesanan berhasil dicatat ke database! Mengalihkan ke WhatsApp...');
    } catch (err) {
      console.error('Error submitting booking:', err);
    } finally {
      const url = getWhatsAppBookingUrl(formData);
      window.open(url, '_blank');
      setIsConfirmModalOpen(false);
    }
  };

  // Copy message
  const handleCopyMessage = async () => {
    const text = generateBookingWhatsAppMessage(formData);
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      onToast('Format pesan berhasil disalin ke clipboard!');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const durations = RENTAL_DURATIONS;

  return (
    <section id="booking" className="py-16 sm:py-20 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 relative overflow-hidden transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header with Motion */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
            Formulir Pemesanan Sewa Genset &amp; AC Cirebon
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Isi formulir di bawah ini. Sistem kami akan otomatis membuat draf pesan rapi dan meneruskannya ke WhatsApp admin <strong className="text-slate-900 dark:text-white">{COMPANY_INFO.whatsappFormatted}</strong>.
          </p>
        </motion.div>

        {/* Form & Live Preview Grid with Motion */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
        >

          {/* Left Column: The Form */}
          <div className="lg:col-span-7 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs">
            <form onSubmit={handleOpenBookingConfirm} className="space-y-6">

              {/* Step 1: Contact Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
                  <User className="w-4 h-4 text-amber-500" />
                  <span>1. Data Penyewa / Penanggung Jawab (PIC)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Nama Lengkap <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Contoh: Bpk. Dimas Pratama"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      No. WhatsApp / HP <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Contoh: 081234567890"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Nama Acara / Perusahaan / Instansi (Opsional)
                    </label>
                    <input
                      type="text"
                      value={formData.companyOrEvent}
                      onChange={(e) => setFormData({ ...formData, companyOrEvent: e.target.value })}
                      placeholder="Contoh: Pernikahan Dimas & Siti / PT Citra Cirebon"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Pilihan Unit Genset */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>2. Pilihan Unit Genset</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Pilih Kapasitas Genset
                    </label>
                    <div className="relative">
                      <select
                        value={formData.selectedGensetName}
                        onChange={(e) => {
                          const val = e.target.value;
                          const isNone = val === 'Tanpa Genset';
                          setFormData(prev => ({
                            ...prev,
                            selectedGensetName: val,
                            selectedGensetId: isNone ? '' : `genset-${val.toLowerCase().replace(/\s+/g, '')}`,
                            gensetQuantity: isNone ? 0 : (prev.gensetQuantity > 0 ? prev.gensetQuantity : 1)
                          }));
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none cursor-pointer appearance-none pr-10"
                      >
                        {GENSET_MANUAL_OPTIONS.map((opt) => (
                          <option key={opt} value={opt} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white py-1">
                            {opt}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Jumlah Unit Genset
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          const next = Math.max(0, formData.gensetQuantity - 1);
                          setFormData({
                            ...formData,
                            gensetQuantity: next,
                            selectedGensetId: next === 0 ? '' : formData.selectedGensetId,
                            selectedGensetName: next === 0 ? 'Tanpa Genset' : formData.selectedGensetName
                          });
                        }}
                        className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center cursor-pointer"
                      >
                        -
                      </button>
                      <span className="font-bold text-slate-900 dark:text-white text-sm">
                        {formData.gensetQuantity} Unit
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const next = formData.gensetQuantity + 1;
                          const nextName = (!formData.selectedGensetName || formData.selectedGensetName === 'Tanpa Genset') ? '10 KVA' : formData.selectedGensetName;
                          setFormData({
                            ...formData,
                            gensetQuantity: next,
                            selectedGensetName: nextName,
                            selectedGensetId: `genset-${nextName.toLowerCase().replace(/\s+/g, '')}`
                          });
                        }}
                        className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Durasi Pemakaian Genset
                    </label>
                    <select
                      value={formData.gensetDuration}
                      onChange={(e) => setFormData({ ...formData, gensetDuration: e.target.value })}
                      disabled={formData.gensetQuantity === 0 || formData.selectedGensetName === 'Tanpa Genset'}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {durations.map((dur, i) => (
                        <option key={i} value={dur}>{dur}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Step 3: Pilihan Unit AC */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
                  <Wind className="w-4 h-4 text-cyan-500" />
                  <span>3. Pilihan Unit AC &amp; Pendingin</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Pilih Unit AC / Pendingin
                    </label>
                    <div className="relative">
                      <select
                        value={formData.selectedAcName}
                        onChange={(e) => {
                          const val = e.target.value;
                          const isNone = val === 'Tanpa AC / Pendingin';
                          setFormData(prev => ({
                            ...prev,
                            selectedAcName: val,
                            selectedAcId: isNone ? '' : 'ac-standing-5pk',
                            acQuantity: isNone ? 0 : (prev.acQuantity > 0 ? prev.acQuantity : 1)
                          }));
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none cursor-pointer appearance-none pr-10"
                      >
                        {AC_MANUAL_OPTIONS.map((opt) => (
                          <option key={opt} value={opt} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white py-1">
                            {opt}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Jumlah Unit AC
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          const next = Math.max(0, formData.acQuantity - 1);
                          setFormData({
                            ...formData,
                            acQuantity: next,
                            selectedAcId: next === 0 ? '' : formData.selectedAcId,
                            selectedAcName: next === 0 ? 'Tanpa AC / Pendingin' : formData.selectedAcName
                          });
                        }}
                        className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center cursor-pointer"
                      >
                        -
                      </button>
                      <span className="font-bold text-slate-900 dark:text-white text-sm">
                        {formData.acQuantity} Unit
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const next = formData.acQuantity + 1;
                          setFormData({
                            ...formData,
                            acQuantity: next,
                            selectedAcName: 'AC Standing 5 PK',
                            selectedAcId: 'ac-standing-5pk'
                          });
                        }}
                        className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Durasi Pemakaian AC
                    </label>
                    <select
                      value={formData.acDuration}
                      onChange={(e) => setFormData({ ...formData, acDuration: e.target.value })}
                      disabled={formData.acQuantity === 0 || formData.selectedAcName === 'Tanpa AC / Pendingin'}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {durations.map((dur, i) => (
                        <option key={i} value={dur}>{dur}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Step 4: Jadwal & Lokasi Acara (Tanpa Kecamatan) */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
                  <MapPin className="w-4 h-4 text-amber-500" />
                  <span>4. Jadwal &amp; Lokasi Acara</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Tanggal Mulai Sewa
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Jam Mulai / Standby (WIB)
                    </label>
                    <input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Alamat / Tempat Acara <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.eventLocation}
                      onChange={(e) => setFormData({ ...formData, eventLocation: e.target.value })}
                      placeholder="Nama gedung, jalan, atau patokan lokasi acara di Cirebon"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Direct Catatan Tambahan (Tanpa Checklist No. 4) */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
                  <FileText className="w-4 h-4 text-amber-500" />
                  <span>Catatan Tambahan (Opsional)</span>
                </div>

                <div>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Contoh: Lokasi genset di area luar gedung, butuh teknisi standby jam 7 pagi..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                {/* Form Action Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 active:from-amber-600 active:to-amber-600 text-slate-950 font-display font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all cursor-pointer"
                  >
                    <Send className="w-5 h-5 text-slate-950" />
                    <span>Booking Sekarang</span>
                  </button>
                  <p className="text-[11px] text-center text-slate-400 dark:text-slate-500 mt-2">
                    ✓ Periksa rincian data sebelum dialihkan ke WhatsApp resmi SGC
                  </p>
                </div>
              </div>

            </form>
          </div>

          {/* Right Column: Live WhatsApp Message Simulator Box */}
          <div className="lg:col-span-5 sticky top-24 space-y-4">

            {/* Simulator Container */}
            <div className="bg-[#0b141a] rounded-2xl overflow-hidden shadow-xl border border-slate-800 text-slate-100 flex flex-col">

              {/* Mock WhatsApp Chat Header */}
              <div className="bg-[#202c33] px-4 py-3 flex items-center justify-between border-b border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white text-xs">
                      SG
                    </div>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#202c33]"></span>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-100 flex items-center gap-1">
                      <span>Admin Sewa Genset & AC Cirebon</span>
                    </h3>
                    <p className="text-[10px] text-emerald-400 font-medium">Online • Respon Cepat Cirebon</p>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                  Live Preview
                </span>
              </div>

              {/* Chat Canvas with Wallpaper */}
              <div className="p-4 sm:p-5 bg-[#0b141a] bg-opacity-95 min-h-[360px] flex flex-col justify-between space-y-4">

                {/* Simulated Outgoing WhatsApp Message Bubble */}
                <div className="self-end max-w-[95%] bg-[#005c4b] text-slate-100 text-xs rounded-xl p-3.5 rounded-tr-none shadow-md space-y-2 border border-emerald-900/40 font-mono">
                  <div className="whitespace-pre-wrap leading-relaxed text-[11px] sm:text-xs">
                    {generateBookingWhatsAppMessage(formData)}
                  </div>
                  <div className="text-right text-[10px] text-emerald-300/70 font-sans flex items-center justify-end gap-1 pt-1">
                    <span>Baru Saja</span>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                  </div>
                </div>

                {/* Info Note inside Chat */}
                <div className="bg-[#182229] border border-slate-800 rounded-lg p-2.5 text-[11px] text-slate-400 flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Pesan di atas akan otomatis terisi saat Anda membuka WhatsApp. Anda masih dapat mengedit atau menambahkan catatan sebelum mengirim.</span>
                </div>

              </div>

              {/* Simulator Action Toolbar */}
              <div className="bg-[#202c33] p-3.5 border-t border-slate-800 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyMessage}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Tersalin!' : 'Salin Pesan'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenBookingConfirm}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Booking Sekarang</span>
                </button>
              </div>

            </div>

            {/* Direct Contact Card */}
            <div className="bg-slate-100 dark:bg-slate-950 rounded-xl p-4 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
              <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Hotline Telepon & WhatsApp Resmi:</span>
              </div>
              <div className="text-sm font-extrabold text-slate-900 dark:text-white font-mono">
                {COMPANY_INFO.phone} ({COMPANY_INFO.whatsappFormatted})
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Alamat Kantor: {COMPANY_INFO.address}
              </p>
            </div>

          </div>

        </motion.div>

      </div>

      {/* Confirmation Popup Modal */}
      <ConfirmBookingModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        formData={formData}
        onConfirm={handleConfirmBookingAndRedirect}
      />
    </section>
  );
};

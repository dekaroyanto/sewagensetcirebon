import React, { useState, useEffect } from 'react';
import { 
  X, 
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
  Wind
} from 'lucide-react';
import { BookingFormData, GensetProduct } from '../types';
import { COMPANY_INFO } from '../data/company';
import { SearchableProductSelect } from './SearchableProductSelect';
import { 
  generateBookingWhatsAppMessage, 
  getWhatsAppBookingUrl, 
  copyToClipboard 
} from '../utils/whatsapp';
import { useBodyScrollLock } from '../utils/scrollLock';
import { submitBooking, getProducts } from '../utils/api';
import { ConfirmBookingModal } from './ConfirmBookingModal';

interface BookingModalProps {
  product: GensetProduct | null;
  onClose: () => void;
  onToast: (msg: string) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  product,
  onClose,
  onToast
}) => {
  const isInitialAc = product?.product_type === 'ac';

  const [formData, setFormData] = useState<BookingFormData>({
    fullName: '',
    companyOrEvent: '',
    phone: '',
    selectedGensetId: product && !isInitialAc ? product.id : (isInitialAc ? '' : 'sgc-20kva'),
    selectedGensetName: product && !isInitialAc ? product.name : (isInitialAc ? 'Tanpa Genset' : 'Genset Silent 20 kVA (16 kW)'),
    gensetQuantity: isInitialAc ? 0 : 1,
    gensetDuration: '1 Hari (12 Jam Operasional)',
    selectedAcId: isInitialAc && product ? product.id : '',
    selectedAcName: isInitialAc && product ? product.name : 'Tanpa AC',
    acQuantity: isInitialAc ? 1 : 0,
    acDuration: '1 Hari (12 Jam Operasional)',
    startDate: '',
    startTime: '08:00',
    eventLocation: '',
    notes: ''
  });

  const [dynamicProducts, setDynamicProducts] = useState<GensetProduct[]>(product ? [product] : []);

  useEffect(() => {
    getProducts().then((data) => {
      if (Array.isArray(data)) {
        setDynamicProducts(data);
      }
    });
  }, []);

  const [copied, setCopied] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // Sync if initial product changes
  useEffect(() => {
    if (product) {
      if (product.product_type === 'ac') {
        setFormData(prev => ({
          ...prev,
          selectedAcId: product.id,
          selectedAcName: product.name,
          acQuantity: Math.max(1, prev.acQuantity || 1),
          selectedGensetId: '',
          selectedGensetName: 'Tanpa Genset',
          gensetQuantity: 0
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          selectedGensetId: product.id,
          selectedGensetName: product.name,
          gensetQuantity: Math.max(1, prev.gensetQuantity || 1),
          selectedAcId: '',
          selectedAcName: 'Tanpa AC',
          acQuantity: 0
        }));
      }
    }
  }, [product]);

  // Handle ESC to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Prevent background body scroll while modal is open (reference-counted)
  useBodyScrollLock(true);

  // Handle Genset select
  const handleSelectGenset = (selected: GensetProduct) => {
    if (!selected.id || selected.name.toLowerCase().includes('tanpa genset')) {
      setFormData(prev => ({
        ...prev,
        selectedGensetId: '',
        selectedGensetName: 'Tanpa Genset',
        gensetQuantity: 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        selectedGensetId: selected.id,
        selectedGensetName: selected.name,
        gensetQuantity: prev.gensetQuantity > 0 ? prev.gensetQuantity : 1
      }));
    }
  };

  // Handle AC select
  const handleSelectAc = (selected: GensetProduct) => {
    if (!selected.id || selected.name.toLowerCase().includes('tanpa ac')) {
      setFormData(prev => ({
        ...prev,
        selectedAcId: '',
        selectedAcName: 'Tanpa AC',
        acQuantity: 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        selectedAcId: selected.id,
        selectedAcName: selected.name,
        acQuantity: prev.acQuantity > 0 ? prev.acQuantity : 1
      }));
    }
  };

  // Open confirmation modal with validation
  const handleOpenBookingConfirm = () => {
    if (!formData.fullName.trim()) {
      onToast('Mohon isi nama lengkap / nama PIC pemesanan.');
      return;
    }
    if (!formData.phone.trim()) {
      onToast('Mohon isi nomor telepon / WhatsApp yang bisa dihubungi.');
      return;
    }
    const hasGenset = formData.gensetQuantity > 0 && formData.selectedGensetName && !formData.selectedGensetName.toLowerCase().includes('tanpa genset');
    const hasAc = formData.acQuantity > 0 && formData.selectedAcName && !formData.selectedAcName.toLowerCase().includes('tanpa ac');

    if (!hasGenset && !hasAc) {
      onToast('Mohon pilih minimal 1 unit Genset atau AC untuk disewa.');
      return;
    }

    if (!formData.eventLocation.trim()) {
      onToast('Mohon isi alamat / lokasi pelaksanaan acara.');
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
      onClose();
    }
  };

  const handleSubmitToWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    handleOpenBookingConfirm();
  };

  const handleCopyMessage = async () => {
    const text = generateBookingWhatsAppMessage(formData);
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      onToast('Format pesan berhasil disalin ke clipboard!');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (!product) return null;

  const durations = [
    '1 Hari (8 Jam Operasional)',
    '1 Hari (12 Jam Operasional)',
    '1 Hari (24 Jam Standby Penuh)',
    '2 Hari Acara',
    '3 Hari Acara',
    '1 Minggu (7 Hari)',
    '2 Minggu',
    '1 Bulan (Kontrak Bulanan)',
    'Kontrak Proyek Jangka Panjang'
  ];

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in"
      onClick={onClose}
    >
      <div 
        className="relative bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Banner */}
        <div className="bg-slate-950 px-5 sm:px-8 py-4 sm:py-5 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Formulir Booking Cepat
                </span>
                <span className="px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                  Respon Cepat WA
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-display font-extrabold text-white leading-tight">
                Pemesanan Sewa Genset & AC Cirebon
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Tutup Formulir"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Scrollable Area */}
        <div className="p-5 sm:p-8 overflow-y-auto flex-1 min-h-0 space-y-6 overscroll-contain">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Form: Fields (7 cols) */}
            <form onSubmit={handleSubmitToWhatsApp} className="lg:col-span-7 space-y-4">
              
              {/* Step 1: PIC & Contact */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 border-b border-slate-200 pb-1.5">
                  <User className="w-3.5 h-3.5 text-amber-500" />
                  <span>1. Data Pemesan / Penanggung Jawab (PIC)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Nama Lengkap <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Contoh: Bpk. Hendra Pratama"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      No. WhatsApp / HP <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Contoh: 081234567890"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Nama Acara / Perusahaan (Opsional)
                    </label>
                    <input
                      type="text"
                      value={formData.companyOrEvent}
                      onChange={(e) => setFormData({ ...formData, companyOrEvent: e.target.value })}
                      placeholder="Contoh: Wedding di Gedung Negara Cirebon / PT Maju"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Pilihan Unit Genset */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 border-b border-slate-200 pb-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>2. Pilihan Unit Genset</span>
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Pilih Tipe / Kapasitas Genset
                    </label>
                    <SearchableProductSelect
                      products={dynamicProducts}
                      targetType="genset"
                      noneOptionLabel="Tanpa Genset (Tidak Butuh Genset)"
                      placeholder="Cari atau pilih tipe genset..."
                      selectedId={formData.selectedGensetId}
                      onSelect={handleSelectGenset}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Jumlah Unit Genset
                      </label>
                      <div className="flex items-center gap-2">
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
                          className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-bold hover:bg-slate-200 flex items-center justify-center cursor-pointer"
                        >
                          -
                        </button>
                        <span className="font-bold text-slate-900 text-xs sm:text-sm px-2">
                          {formData.gensetQuantity} Unit
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const next = formData.gensetQuantity + 1;
                            setFormData({
                              ...formData,
                              gensetQuantity: next,
                              selectedGensetId: formData.selectedGensetId || 'sgc-20kva',
                              selectedGensetName: (!formData.selectedGensetName || formData.selectedGensetName === 'Tanpa Genset') ? 'Genset Silent 20 kVA (16 kW)' : formData.selectedGensetName
                            });
                          }}
                          className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-bold hover:bg-slate-200 flex items-center justify-center cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Durasi Pemakaian Genset
                      </label>
                      <select
                        value={formData.gensetDuration}
                        onChange={(e) => setFormData({ ...formData, gensetDuration: e.target.value })}
                        disabled={formData.gensetQuantity === 0}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {durations.map((dur, i) => (
                          <option key={i} value={dur}>{dur}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: Pilihan Unit AC */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 border-b border-slate-200 pb-1.5">
                  <Wind className="w-3.5 h-3.5 text-cyan-500" />
                  <span>3. Pilihan Unit AC &amp; Pendingin</span>
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Pilih Tipe AC / Pendingin
                    </label>
                    <SearchableProductSelect
                      products={dynamicProducts}
                      targetType="ac"
                      noneOptionLabel="Tanpa AC (Tidak Butuh AC)"
                      placeholder="Cari atau pilih tipe AC standing / Misty Fan..."
                      selectedId={formData.selectedAcId}
                      onSelect={handleSelectAc}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Jumlah Unit AC
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const next = Math.max(0, formData.acQuantity - 1);
                            setFormData({
                              ...formData,
                              acQuantity: next,
                              selectedAcId: next === 0 ? '' : formData.selectedAcId,
                              selectedAcName: next === 0 ? 'Tanpa AC' : formData.selectedAcName
                            });
                          }}
                          className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-bold hover:bg-slate-200 flex items-center justify-center cursor-pointer"
                        >
                          -
                        </button>
                        <span className="font-bold text-slate-900 text-xs sm:text-sm px-2">
                          {formData.acQuantity} Unit
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const next = formData.acQuantity + 1;
                            setFormData({
                              ...formData,
                              acQuantity: next,
                              selectedAcId: formData.selectedAcId || 'sgc-ac-5pk',
                              selectedAcName: (!formData.selectedAcName || formData.selectedAcName === 'Tanpa AC') ? 'AC Standing Floor 5 PK (45.000 BTU)' : formData.selectedAcName
                            });
                          }}
                          className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-bold hover:bg-slate-200 flex items-center justify-center cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Durasi Pemakaian AC
                      </label>
                      <select
                        value={formData.acDuration}
                        onChange={(e) => setFormData({ ...formData, acDuration: e.target.value })}
                        disabled={formData.acQuantity === 0}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {durations.map((dur, i) => (
                          <option key={i} value={dur}>{dur}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4: Jadwal & Lokasi Acara (Tanpa Kecamatan) */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 border-b border-slate-200 pb-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  <span>4. Jadwal &amp; Lokasi Acara</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Tanggal Mulai Pemakaian
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Jam Mulai / Standby (WIB)
                    </label>
                    <input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Alamat Lengkap / Patokan Lokasi <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.eventLocation}
                      onChange={(e) => setFormData({ ...formData, eventLocation: e.target.value })}
                      placeholder="Contoh: Jl. Tuparev No. 12, Samping Hotel Patra Cirebon"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Direct Catatan Tambahan (Tanpa Checklist No. 4) */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 border-b border-slate-200 pb-1.5">
                  <FileText className="w-3.5 h-3.5 text-amber-500" />
                  <span>Catatan Tambahan (Opsional)</span>
                </div>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Contoh: Mohon teknisi standby dari jam 7 pagi, butuh kabel masuk ke dalam aula..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

            </form>

            {/* Right Form: Simulated Message & Instant Actions (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* WhatsApp Live Bubble Box */}
              <div className="bg-[#0b141a] rounded-2xl overflow-hidden shadow-lg border border-slate-800 text-slate-100 flex flex-col">
                
                {/* Header */}
                <div className="bg-[#202c33] px-3.5 py-2.5 flex items-center justify-between border-b border-slate-700">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white text-xs">
                      SG
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-100">Admin SGC Cirebon</h4>
                      <p className="text-[9px] text-emerald-400 font-medium">Online • Respon Cepat</p>
                    </div>
                  </div>
                  <span className="text-[9px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                    Format Pesan WA
                  </span>
                </div>

                {/* Message preview body */}
                <div className="p-3.5 bg-[#0b141a] max-h-[280px] overflow-y-auto space-y-3">
                  <div className="bg-[#005c4b] text-slate-100 text-[11px] rounded-xl p-3 rounded-tr-none shadow-sm space-y-1.5 border border-emerald-900/40 font-mono">
                    <div className="whitespace-pre-wrap leading-relaxed">
                      {generateBookingWhatsAppMessage(formData)}
                    </div>
                    <div className="text-right text-[9px] text-emerald-300/70 font-sans flex items-center justify-end gap-1 pt-1">
                      <span>Siap Kirim</span>
                      <Check className="w-3 h-3 text-emerald-300" />
                    </div>
                  </div>
                </div>

                {/* Actions Toolbar */}
                <div className="p-3 bg-[#202c33] border-t border-slate-800 space-y-2">
                  <button
                    type="button"
                    onClick={handleOpenBookingConfirm}
                    className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all text-center cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Booking Sekarang</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyMessage}
                    className="w-full py-2 px-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Format Pesan Tersalin!' : 'Salin Teks Pesan'}</span>
                  </button>
                </div>

              </div>

              {/* Guarantees */}
              <div className="bg-amber-50/60 rounded-xl p-3.5 border border-amber-200/80 text-[11px] text-amber-950 space-y-1.5">
                <div className="font-bold flex items-center gap-1.5 text-amber-900">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>Jaminan Layanan Sewa Genset & AC:</span>
                </div>
                <ul className="space-y-1 text-slate-700 pl-5 list-disc">
                  <li>Unit diuji beban (load test) & dibersihkan sebelum kirim.</li>
                  <li>Termasuk operator / teknisi standby selama acara.</li>
                  <li>Pengiriman on-time ke seluruh Cirebon & Ciayumajakuning.</li>
                </ul>
              </div>

            </div>

          </div>

        </div>

        {/* Modal Bottom Close Action */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500">
            Butuh konsultasi cepat? Hubungi <strong>{COMPANY_INFO.whatsappFormatted}</strong>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>

      </div>

      {/* Confirmation Popup Modal */}
      <ConfirmBookingModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        formData={formData}
        onConfirm={handleConfirmBookingAndRedirect}
      />
    </div>
  );
};

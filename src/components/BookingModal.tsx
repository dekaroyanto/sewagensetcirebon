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
import { GENSET_PRODUCTS } from '../data/gensets';
import { COMPANY_INFO } from '../data/company';
import { SearchableProductSelect } from './SearchableProductSelect';
import { 
  generateBookingWhatsAppMessage, 
  getWhatsAppBookingUrl, 
  copyToClipboard 
} from '../utils/whatsapp';

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
  const [formData, setFormData] = useState<BookingFormData>({
    fullName: '',
    companyOrEvent: '',
    phone: '',
    selectedGensetId: product ? product.id : 'genset-20kva',
    selectedGensetName: product ? product.name : 'Genset Silent 20 kVA (16 kW)',
    unitQuantity: 1,
    rentalType: 'Harian / Acara',
    startDate: '',
    startTime: '08:00',
    duration: '1 Hari (12 Jam)',
    eventLocation: '',
    districtCirebon: 'Kejaksan - Kota Cirebon',
    packageType: product?.category === 'ac' ? 'Paket Sewa AC + Instalasi Dingin' : 'Include BBM Solar & Operator',
    additionalNeeds: [],
    notes: ''
  });

  const [copied, setCopied] = useState(false);

  // Sync if initial product changes
  useEffect(() => {
    if (product) {
      setFormData(prev => ({
        ...prev,
        selectedGensetId: product.id,
        selectedGensetName: product.name,
        packageType: product.category === 'ac' ? 'Paket Sewa AC + Instalasi Dingin' : prev.packageType
      }));
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

  // Handle product select from searchable dropdown
  const handleSelectProduct = (selected: GensetProduct) => {
    setFormData(prev => ({
      ...prev,
      selectedGensetId: selected.id,
      selectedGensetName: selected.name,
      packageType: selected.category === 'ac' ? 'Paket Sewa AC + Instalasi Dingin' : prev.packageType
    }));
  };

  const handleNeedToggle = (need: string) => {
    setFormData(prev => {
      const exists = prev.additionalNeeds.includes(need);
      const updated = exists 
        ? prev.additionalNeeds.filter(item => item !== need)
        : [...prev.additionalNeeds, need];
      return { ...prev, additionalNeeds: updated };
    });
  };

  const handleSubmitToWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      onToast('Mohon isi nama lengkap / nama penanggung jawab pemesanan.');
      return;
    }
    if (!formData.phone.trim()) {
      onToast('Mohon isi nomor telepon / WhatsApp yang bisa dihubungi.');
      return;
    }

    const url = getWhatsAppBookingUrl(formData);
    window.open(url, '_blank');
    onToast('Membuka WhatsApp untuk mengirim rincian pemesanan ke admin!');
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

  const cirebonDistricts = [
    'Kejaksan - Kota Cirebon',
    'Kesambi - Kota Cirebon',
    'Lemahwungkuk - Kota Cirebon',
    'Harjamukti - Kota Cirebon',
    'Pekalipan - Kota Cirebon',
    'Sumber - Kab. Cirebon',
    'Kedawung - Kab. Cirebon',
    'Weru / Plered - Kab. Cirebon',
    'Palimanan - Kab. Cirebon',
    'Arjawinangun - Kab. Cirebon',
    'Losari / Ciledug - Kab. Cirebon',
    'Kabupaten Kuningan',
    'Kabupaten Majalengka (termasuk Kertajati)',
    'Kabupaten Indramayu',
    'Lainnya / Luar Kota'
  ];

  const durations = [
    '1 Hari (8 Jam Operasional)',
    '1 Hari (12 Jam Operasional)',
    '1 Hari (24 Jam Standby Penuh)',
    '2 Hari Acara',
    '3 Hari Acara',
    '1 Minggu (7 Hari)',
    '1 Bulan (Proyek / Industri)',
    'Custom / Lebih dari 1 Bulan'
  ];

  const availableNeeds = [
    'Kabel Power Tambahan (+50 Meter)',
    'Pipa Freon & Kabel Ekstra AC Standing',
    'Panel Otomatis ATS (Auto Switch PLN)',
    'Box Distribusi / Sub-Panel Listrik',
    'Grounding Rod Proteksi Petir/Listrik',
    'Cadangan Solar Tambahan 1 Drum',
    'Kipas Misty Fan Blower Tambahan'
  ];

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in"
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
        <div className="p-5 sm:p-8 overflow-y-auto flex-1 space-y-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Form: Fields (7 cols) */}
            <form onSubmit={handleSubmitToWhatsApp} className="lg:col-span-7 space-y-5">
              
              {/* Step 1: Searchable Product Dropdown */}
              <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>Unit / Paket yang Dipilih</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[11px] text-slate-500 font-medium">Ketik untuk mencari unit</span>
                </div>

                {/* Searchable Combobox Component */}
                <SearchableProductSelect
                  products={GENSET_PRODUCTS}
                  selectedId={formData.selectedGensetId}
                  onSelect={handleSelectProduct}
                />
              </div>

              {/* Step 2: PIC & Contact */}
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

              {/* Step 3: Duration, Qty, and Package */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 border-b border-slate-200 pb-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-500" />
                  <span>2. Durasi & Opsi Paket Sewa</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Jumlah Unit
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, unitQuantity: Math.max(1, formData.unitQuantity - 1) })}
                        className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-bold hover:bg-slate-200 flex items-center justify-center cursor-pointer"
                      >
                        -
                      </button>
                      <span className="font-bold text-slate-900 text-xs sm:text-sm px-2">{formData.unitQuantity} Unit</span>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, unitQuantity: formData.unitQuantity + 1 })}
                        className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-bold hover:bg-slate-200 flex items-center justify-center cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Durasi Pemakaian
                    </label>
                    <select
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none cursor-pointer"
                    >
                      {durations.map((dur, i) => (
                        <option key={i} value={dur}>{dur}</option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Paket Layanan
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                      <label className={`p-2.5 rounded-xl border cursor-pointer flex items-start gap-2 transition-all ${
                        formData.packageType === 'Include BBM Solar & Operator' 
                          ? 'border-amber-500 bg-amber-50/50 text-slate-900 font-semibold' 
                          : 'border-slate-200 bg-white text-slate-600'
                      }`}>
                        <input
                          type="radio"
                          name="modalPackageType"
                          checked={formData.packageType === 'Include BBM Solar & Operator'}
                          onChange={() => setFormData({ ...formData, packageType: 'Include BBM Solar & Operator' })}
                          className="mt-0.5 text-amber-500"
                        />
                        <div>
                          <span className="block font-bold text-[11px]">Include BBM & Operator</span>
                          <span className="text-[10px] text-slate-500">All-in siap pakai.</span>
                        </div>
                      </label>

                      <label className={`p-2.5 rounded-xl border cursor-pointer flex items-start gap-2 transition-all ${
                        formData.packageType === 'Paket Sewa AC + Instalasi Dingin' 
                          ? 'border-cyan-500 bg-cyan-50/50 text-slate-900 font-semibold' 
                          : 'border-slate-200 bg-white text-slate-600'
                      }`}>
                        <input
                          type="radio"
                          name="modalPackageType"
                          checked={formData.packageType === 'Paket Sewa AC + Instalasi Dingin'}
                          onChange={() => setFormData({ ...formData, packageType: 'Paket Sewa AC + Instalasi Dingin' })}
                          className="mt-0.5 text-cyan-500"
                        />
                        <div>
                          <span className="block font-bold text-[11px]">Paket AC Standing</span>
                          <span className="text-[10px] text-slate-500">Instalasi rapi & teknisi.</span>
                        </div>
                      </label>

                      <label className={`p-2.5 rounded-xl border cursor-pointer flex items-start gap-2 transition-all ${
                        formData.packageType === 'Operator Saja (Exclude BBM)' 
                          ? 'border-amber-500 bg-amber-50/50 text-slate-900 font-semibold' 
                          : 'border-slate-200 bg-white text-slate-600'
                      }`}>
                        <input
                          type="radio"
                          name="modalPackageType"
                          checked={formData.packageType === 'Operator Saja (Exclude BBM)'}
                          onChange={() => setFormData({ ...formData, packageType: 'Operator Saja (Exclude BBM)' })}
                          className="mt-0.5 text-amber-500"
                        />
                        <div>
                          <span className="block font-bold text-[11px]">Operator Saja</span>
                          <span className="text-[10px] text-slate-500">BBM disediakan sendiri.</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4: Location & Date */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 border-b border-slate-200 pb-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  <span>3. Tanggal Acara & Wilayah Pengiriman</span>
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
                      Wilayah / Kecamatan di Cirebon
                    </label>
                    <select
                      value={formData.districtCirebon}
                      onChange={(e) => setFormData({ ...formData, districtCirebon: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none cursor-pointer"
                    >
                      {cirebonDistricts.map((dist, i) => (
                        <option key={i} value={dist}>{dist}</option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Alamat Lengkap / Patokan Lokasi
                    </label>
                    <input
                      type="text"
                      value={formData.eventLocation}
                      onChange={(e) => setFormData({ ...formData, eventLocation: e.target.value })}
                      placeholder="Contoh: Jl. Tuparev No. 12, Samping Hotel Patra Cirebon"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Step 5: Additional Needs */}
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Kebutuhan Tambahan (Opsional)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
                  {availableNeeds.map((need, idx) => {
                    const isChecked = formData.additionalNeeds.includes(need);
                    return (
                      <label 
                        key={idx} 
                        className={`p-2 rounded-lg border flex items-center gap-2 cursor-pointer transition-colors ${
                          isChecked ? 'bg-amber-50 border-amber-300 text-slate-900 font-semibold' : 'bg-white border-slate-200 text-slate-600'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleNeedToggle(need)}
                          className="rounded text-amber-500 focus:ring-amber-400 w-3.5 h-3.5"
                        />
                        <span className="truncate">{need}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Step 6: Notes */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Catatan Tambahan (Opsional)
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Contoh: Mohon teknisi standby dari jam 7 pagi, butuh kabel masuk ke dalam tenda..."
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
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
                  <a
                    href={getWhatsAppBookingUrl(formData)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      onToast('Membuka WhatsApp untuk mengirim rincian pesanan!');
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all text-center"
                  >
                    <Send className="w-4 h-4" />
                    <span>Kirim Pesanan via WhatsApp</span>
                  </a>

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
    </div>
  );
};

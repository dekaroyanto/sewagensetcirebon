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
  Wind
} from 'lucide-react';
import { motion } from 'motion/react';
import { BookingFormData, GensetProduct } from '../types';
import { GENSET_PRODUCTS } from '../data/gensets';
import { COMPANY_INFO } from '../data/company';
import { SearchableProductSelect } from './SearchableProductSelect';
import {
  generateBookingWhatsAppMessage,
  getWhatsAppBookingUrl,
  copyToClipboard
} from '../utils/whatsapp';

interface BookingFormProps {
  preselectedProduct?: GensetProduct | null;
  onToast: (msg: string) => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({ preselectedProduct, onToast }) => {
  const [formData, setFormData] = useState<BookingFormData>({
    fullName: '',
    companyOrEvent: '',
    phone: '',
    selectedGensetId: 'genset-20kva',
    selectedGensetName: 'Genset Silent 20 kVA (16 kW)',
    unitQuantity: 1,
    rentalType: 'Harian / Acara',
    startDate: '',
    startTime: '08:00',
    duration: '1 Hari (12 Jam)',
    eventLocation: '',
    districtCirebon: 'Kejaksan - Kota Cirebon',
    packageType: 'Include BBM Solar & Operator',
    additionalNeeds: [],
    notes: ''
  });

  const [copied, setCopied] = useState(false);

  // Synchronize when a product is preselected from catalog
  useEffect(() => {
    if (preselectedProduct) {
      setFormData(prev => ({
        ...prev,
        selectedGensetId: preselectedProduct.id,
        selectedGensetName: preselectedProduct.name,
        packageType: preselectedProduct.category === 'ac' ? 'Paket Sewa AC + Instalasi Dingin' : prev.packageType
      }));
    }
  }, [preselectedProduct]);

  // Handle product select from searchable dropdown
  const handleSelectProduct = (selected: GensetProduct) => {
    setFormData(prev => ({
      ...prev,
      selectedGensetId: selected.id,
      selectedGensetName: selected.name,
      packageType: selected.category === 'ac' ? 'Paket Sewa AC + Instalasi Dingin' : prev.packageType
    }));
  };

  // Handle additional needs checkbox
  const handleNeedToggle = (need: string) => {
    setFormData(prev => {
      const exists = prev.additionalNeeds.includes(need);
      const updated = exists
        ? prev.additionalNeeds.filter(item => item !== need)
        : [...prev.additionalNeeds, need];
      return { ...prev, additionalNeeds: updated };
    });
  };

  // Submit to WhatsApp
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
    '2 Minggu',
    '1 Bulan (Kontrak Bulanan)',
    'Kontrak Proyek Jangka Panjang'
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

  // Grouped products
  const gensetItems = GENSET_PRODUCTS.filter(p => p.category !== 'ac' && p.category !== 'paket');
  const acItems = GENSET_PRODUCTS.filter(p => p.category === 'ac');
  const paketItems = GENSET_PRODUCTS.filter(p => p.category === 'paket');

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
            Formulir Pemesanan Sewa Genset & AC Cirebon
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
            <form onSubmit={handleSubmitToWhatsApp} className="space-y-6">

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

              {/* Step 2: Product & Duration */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>2. Pilihan Unit Genset / AC & Durasi Sewa</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2 space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Pilihan Unit / Paket Sewa <span className="text-rose-500">*</span>
                      </label>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500">Pencarian interaktif</span>
                    </div>
                    <SearchableProductSelect
                      products={GENSET_PRODUCTS}
                      selectedId={formData.selectedGensetId}
                      onSelect={handleSelectProduct}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Jumlah Unit
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, unitQuantity: Math.max(1, formData.unitQuantity - 1) })}
                        className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center cursor-pointer"
                      >
                        -
                      </button>
                      <span className="font-bold text-slate-900 dark:text-white text-sm">{formData.unitQuantity} Unit</span>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, unitQuantity: formData.unitQuantity + 1 })}
                        className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Durasi Pemakaian
                    </label>
                    <select
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none cursor-pointer"
                    >
                      {durations.map((dur, i) => (
                        <option key={i} value={dur}>{dur}</option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Paket Layanan
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                      <label className={`p-3 rounded-xl border cursor-pointer flex items-start gap-2.5 transition-all ${formData.packageType === 'Include BBM Solar & Operator'
                        ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/40 text-slate-900 dark:text-white font-semibold'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300'
                        }`}>
                        <input
                          type="radio"
                          name="packageType"
                          checked={formData.packageType === 'Include BBM Solar & Operator'}
                          onChange={() => setFormData({ ...formData, packageType: 'Include BBM Solar & Operator' })}
                          className="mt-0.5 text-amber-500"
                        />
                        <div>
                          <span className="block font-bold">Include BBM & Operator</span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">All-In siap pakai tanpa repot.</span>
                        </div>
                      </label>

                      <label className={`p-3 rounded-xl border cursor-pointer flex items-start gap-2.5 transition-all ${formData.packageType === 'Paket Sewa AC + Instalasi Dingin'
                        ? 'border-cyan-500 bg-cyan-50/50 dark:bg-cyan-950/40 text-slate-900 dark:text-white font-semibold'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300'
                        }`}>
                        <input
                          type="radio"
                          name="packageType"
                          checked={formData.packageType === 'Paket Sewa AC + Instalasi Dingin'}
                          onChange={() => setFormData({ ...formData, packageType: 'Paket Sewa AC + Instalasi Dingin' })}
                          className="mt-0.5 text-cyan-500"
                        />
                        <div>
                          <span className="block font-bold">Paket AC & Teknisi</span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">Instalasi rapi & standby suhu.</span>
                        </div>
                      </label>

                      <label className={`p-3 rounded-xl border cursor-pointer flex items-start gap-2.5 transition-all ${formData.packageType === 'Include Operator Saja (BBM dari Penyewa)'
                        ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/40 text-slate-900 dark:text-white font-semibold'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300'
                        }`}>
                        <input
                          type="radio"
                          name="packageType"
                          checked={formData.packageType === 'Include Operator Saja (BBM dari Penyewa)'}
                          onChange={() => setFormData({ ...formData, packageType: 'Include Operator Saja (BBM dari Penyewa)' })}
                          className="mt-0.5 text-amber-500"
                        />
                        <div>
                          <span className="block font-bold">Operator Standby</span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">BBM disediakan penyewa.</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: Location & Time */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
                  <MapPin className="w-4 h-4 text-amber-500" />
                  <span>3. Jadwal & Lokasi Acara di Cirebon</span>
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

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Kecamatan / Wilayah
                    </label>
                    <select
                      value={formData.districtCirebon}
                      onChange={(e) => setFormData({ ...formData, districtCirebon: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none cursor-pointer"
                    >
                      {cirebonDistricts.map((d, i) => (
                        <option key={i} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Alamat / Tempat Acara
                    </label>
                    <input
                      type="text"
                      value={formData.eventLocation}
                      onChange={(e) => setFormData({ ...formData, eventLocation: e.target.value })}
                      placeholder="Nama gedung, jalan, atau patokan lokasi"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Step 4: Additional Needs & Notes */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
                  <Layers className="w-4 h-4 text-amber-500" />
                  <span>4. Perlengkapan Tambahan & Catatan</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Kebutuhan Tambahan (Opsional)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {availableNeeds.map((need, idx) => {
                      const isChecked = formData.additionalNeeds.includes(need);
                      return (
                        <label
                          key={idx}
                          className={`p-2.5 rounded-lg border flex items-center gap-2 cursor-pointer transition-colors ${isChecked
                            ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-slate-900 dark:text-white font-semibold'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                            }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleNeedToggle(need)}
                            className="rounded text-amber-500 focus:ring-amber-400"
                          />
                          <span>{need}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Catatan Tambahan / Spesifikasi Khusus (Opsional)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Contoh: Lokasi genset di luar tenda, butuh 2 unit AC standing di area pelaminan..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
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

                <a
                  href={getWhatsAppBookingUrl(formData)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                >
                  <Send className="w-4 h-4" />
                  <span>Buka di WA</span>
                </a>
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
    </section>
  );
};

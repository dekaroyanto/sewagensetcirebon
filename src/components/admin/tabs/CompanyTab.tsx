import React, { useState, useEffect } from 'react';
import { 
  Building, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Check, 
  ShieldCheck, 
  RotateCcw,
  Sparkles,
  Share2
} from 'lucide-react';
import { getCompanyInfo, updateCompanySettings } from '../../../utils/api';
import { CompanySettings } from '../../../types';

interface CompanyTabProps {
  onToast: (msg: string) => void;
}

export const CompanyTab: React.FC<CompanyTabProps> = ({ onToast }) => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Sewa Genset Cirebon (SGC)',
    shortName: 'SGC',
    tagline: 'Rental Genset Silent & AC Standing No. 1 di Kota Cirebon & Sekitarnya',
    description: '',
    phone: '08170696959',
    whatsappNumber: '08170696959',
    email: 'gensetcirebon.rental@gmail.com',
    address: 'Kota Cirebon, Jawa Barat, Indonesia',
    city: 'Kota Cirebon',
    operatingHours: '24 Jam Nonstop Setiap Hari',
    emergencyAvailable: true,
    instagram: '@sewagensetcirebon',
    facebook: 'Sewa Genset Cirebon',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getCompanyInfo();
      setFormData(prev => ({
        ...prev,
        ...data,
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await updateCompanySettings(formData);
      if (res.success) {
        onToast('Pengaturan perusahaan berhasil disimpan ke database MySQL!');
        loadData();
      } else {
        onToast('Gagal update: ' + res.message);
      }
    } catch (err: any) {
      onToast('Error: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Building className="w-5 h-5 text-amber-500" />
            <span>Pengaturan Kontak & Profil Perusahaan</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Perubahan nomor WhatsApp, telepon, dan alamat akan langsung sinkron ke seluruh halaman website
          </p>
        </div>

        <button
          onClick={loadData}
          className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer self-start sm:self-auto"
          title="Muat Ulang"
        >
          <RotateCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-slate-400 flex flex-col items-center gap-3 bg-slate-900/60 border border-slate-800 rounded-2xl">
          <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs">Memuat pengaturan dari database...</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card 1: Primary Contact */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>Kontak Utama & Layanan Pelanggan</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Nomor WhatsApp Utama (Target Pesanan / Booking) *
                </label>
                <input
                  type="text"
                  value={formData.whatsappNumber}
                  onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                  placeholder="08170696959"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-amber-500"
                  required
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  *Nomor ini menerima seluruh rincian pemesanan dari form website.
                </span>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Nomor Telepon Kantor / Hotline
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="08170696959"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Email Perusahaan / Penawaran
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="gensetcirebon.rental@gmail.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Jam Operasional & Standby
                </label>
                <input
                  type="text"
                  value={formData.operatingHours}
                  onChange={(e) => setFormData({ ...formData, operatingHours: e.target.value })}
                  placeholder="24 Jam Nonstop Setiap Hari"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Company Identity & Location */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <MapPin className="w-4 h-4 text-amber-500" />
              <span>Identitas & Lokasi Kantor Workshop</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nama Perusahaan / Brand</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Singkatan Brand</label>
                <input
                  type="text"
                  value={formData.shortName}
                  onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
                  placeholder="SGC"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-300 font-semibold mb-1">Tagline Utama Website</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-300 font-semibold mb-1">Alamat Kantor / Garasi Armada</label>
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Kota Cirebon, Jawa Barat, Indonesia"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Social Media */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Share2 className="w-4 h-4 text-cyan-400" />
              <span>Media Sosial</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Akun Instagram</label>
                <input
                  type="text"
                  value={formData.instagram || ''}
                  onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                  placeholder="@sewagensetcirebon"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Halaman Facebook</label>
                <input
                  type="text"
                  value={formData.facebook || ''}
                  onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                  placeholder="Sewa Genset Cirebon"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20 disabled:opacity-50 transition-all transform active:scale-95"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Menyimpan ke Database Hostinger...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Simpan Perubahan ke MySQL Hostinger</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

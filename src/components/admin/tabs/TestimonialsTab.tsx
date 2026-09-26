import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Star, 
  CheckCircle, 
  MessageSquareQuote, 
  RotateCcw, 
  Check, 
  X,
  User
} from 'lucide-react';
import { Testimonial } from '../../../types';
import { getTestimonials, createTestimonialAdmin, updateTestimonial, deleteTestimonial } from '../../../utils/api';

interface TestimonialsTabProps {
  onToast: (msg: string) => void;
}

export const TestimonialsTab: React.FC<TestimonialsTabProps> = ({ onToast }) => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form
  const [formData, setFormData] = useState({
    name: '',
    role: 'Wedding Organizer',
    companyOrEvent: 'Cirebon Royal Wedding',
    location: 'Kota Cirebon',
    rating: 5,
    gensetUsed: 'Genset Silent 60 kVA',
    comment: '',
    verified: true,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getTestimonials();
      setTestimonials(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const handleSync = () => loadData();
    window.addEventListener('sgc_data_changed', handleSync);
    return () => window.removeEventListener('sgc_data_changed', handleSync);
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      role: 'Ketua Panitia',
      companyOrEvent: 'Acara Resepsi Pernikahan',
      location: 'Kota Cirebon',
      rating: 5,
      gensetUsed: 'Genset Silent 60 kVA Cummins',
      comment: 'Sangat puas dengan pelayanan Sewa Genset Cirebon! Mesin super senyap dan operator sangat sigap membantu instalasi.',
      verified: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (t: Testimonial) => {
    setEditingItem(t);
    setFormData({
      name: t.name,
      role: t.role,
      companyOrEvent: t.companyOrEvent,
      location: t.location,
      rating: t.rating,
      gensetUsed: t.gensetUsed,
      comment: t.comment,
      verified: t.verified,
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.comment) {
      onToast('Nama dan isi ulasan wajib diisi.');
      return;
    }

    setSubmitting(true);
    try {
      if (editingItem) {
        // Optimistic update
        setTestimonials(prev => prev.map(t => t.id === editingItem.id ? { ...t, ...formData } : t));
        setIsModalOpen(false);

        const res = await updateTestimonial(editingItem.id, formData);
        if (res.success) {
          onToast('Testimoni berhasil diperbarui!');
        } else {
          onToast('Gagal update: ' + res.message);
        }
        await loadData();
      } else {
        const tempId = 'testi-' + Date.now();
        const optimisticTesti: Testimonial = {
          id: tempId,
          ...formData,
          date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
        };
        setTestimonials(prev => [optimisticTesti, ...prev]);
        setIsModalOpen(false);

        const res = await createTestimonialAdmin({
          ...formData,
          date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
        });
        if (res.success) {
          onToast('Testimoni baru berhasil ditambahkan!');
        } else {
          onToast('Gagal tambah: ' + res.message);
        }
        await loadData();
      }
    } catch (err: any) {
      onToast('Error: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    // Optimistic delete
    setTestimonials(prev => prev.filter(t => t.id !== id));
    setDeleteConfirmId(null);

    const res = await deleteTestimonial(id);
    if (res.success) {
      onToast('Testimoni berhasil dihapus.');
    } else {
      onToast('Gagal menghapus: ' + res.message);
    }
    await loadData();
  };

  const filtered = testimonials.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.companyOrEvent.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.comment.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <MessageSquareQuote className="w-5 h-5 text-emerald-400" />
            <span>Manajemen Testimoni & Ulasan Klien</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Kelola ulasan kepuasan pelanggan yang tampil di halaman beranda website SGC
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
            title="Muat Ulang"
          >
            <RotateCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={openAddModal}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Testimoni</span>
          </button>
        </div>
      </div>

      {/* Grid of Testimonials */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs">Memuat ulasan dari database...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-slate-500 text-xs">
          Belum ada data ulasan di database.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(t => (
            <div key={t.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition-all">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < t.rating ? 'fill-amber-400' : 'text-slate-700'}`} />
                    ))}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(t)}
                      className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(t.id)}
                      className="p-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-300 italic leading-relaxed line-clamp-4">
                  "{t.comment}"
                </p>

                <div className="text-[11px] text-amber-400/90 font-semibold">
                  Unit: {t.gensetUsed}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80 mt-4 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-xs flex items-center gap-1">
                    <span>{t.name}</span>
                    {t.verified && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  <div className="text-[10px] text-slate-500">{t.role} • {t.companyOrEvent}</div>
                </div>
                <span className="text-[10px] text-slate-500">{t.date}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 text-left shadow-2xl relative">
            <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <MessageSquareQuote className="w-4 h-4 text-emerald-400" />
                <span>{editingItem ? 'Edit Testimoni' : 'Tambah Testimoni Baru'}</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Nama Klien / Pemesan *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Peran / Jabatan</label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Perusahaan / Acara</label>
                  <input
                    type="text"
                    value={formData.companyOrEvent}
                    onChange={(e) => setFormData({ ...formData, companyOrEvent: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Lokasi di Cirebon</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Genset yang Digunakan</label>
                  <input
                    type="text"
                    value={formData.gensetUsed}
                    onChange={(e) => setFormData({ ...formData, gensetUsed: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Rating Bintang (1 - 5)</label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 Bintang)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 Bintang)</option>
                    <option value={3}>⭐⭐⭐ (3 Bintang)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Isi Ulasan Testimoni *</label>
                <textarea
                  rows={4}
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="verif"
                  checked={formData.verified}
                  onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
                  className="w-4 h-4 text-amber-500 rounded bg-slate-950 border-slate-800 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="verif" className="text-slate-300 font-medium cursor-pointer">
                  Tandai sebagai Ulasan Terverifikasi (Centang Hijau)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold cursor-pointer disabled:opacity-50"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full text-center">
            <h3 className="text-base font-bold text-white mb-2">Hapus Testimoni?</h3>
            <p className="text-xs text-slate-400 mb-6">
              Ulasan klien ini akan dihapus dari database.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold cursor-pointer"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

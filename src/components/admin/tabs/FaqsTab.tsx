import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  HelpCircle, 
  RotateCcw, 
  Check, 
  X,
  ChevronDown
} from 'lucide-react';
import { FAQItem } from '../../../types';
import { getFaqs, createFaq, updateFaq, deleteFaq } from '../../../utils/api';

interface FaqsTabProps {
  onToast: (msg: string) => void;
}

export const FaqsTab: React.FC<FaqsTabProps> = ({ onToast }) => {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FAQItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form
  const [formData, setFormData] = useState({
    category: 'Pemesanan & Syarat' as any,
    question: '',
    answer: '',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getFaqs();
      setFaqs(data);
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
      category: 'Pemesanan & Syarat',
      question: '',
      answer: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (f: FAQItem) => {
    setEditingItem(f);
    setFormData({
      category: f.category,
      question: f.question,
      answer: f.answer,
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.question || !formData.answer) {
      onToast('Pertanyaan dan jawaban wajib diisi.');
      return;
    }

    setSubmitting(true);
    try {
      if (editingItem) {
        // Optimistic update
        setFaqs(prev => prev.map(f => f.id === editingItem.id ? { ...f, ...formData } : f));
        setIsModalOpen(false);

        const res = await updateFaq(editingItem.id, formData);
        if (res.success) {
          onToast('FAQ berhasil diperbarui!');
        } else {
          onToast('Gagal update: ' + res.message);
        }
        await loadData();
      } else {
        const tempId = 'faq-' + Date.now();
        const optimisticFaq: FAQItem = { id: tempId, ...formData };
        setFaqs(prev => [optimisticFaq, ...prev]);
        setIsModalOpen(false);

        const res = await createFaq(formData);
        if (res.success) {
          onToast('FAQ baru berhasil ditambahkan!');
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
    setFaqs(prev => prev.filter(f => f.id !== id));
    setDeleteConfirmId(null);

    const res = await deleteFaq(id);
    if (res.success) {
      onToast('FAQ berhasil dihapus.');
    } else {
      onToast('Gagal menghapus: ' + res.message);
    }
    await loadData();
  };

  const filtered = faqs.filter(f =>
    f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-500" />
            <span>Manajemen FAQ (Tanya Jawab Seputar Sewa Genset)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Daftar pertanyaan umum yang sering ditanyakan oleh calon penyewa di Cirebon
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
            <span>Tambah Pertanyaan FAQ</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex justify-end">
        <div className="relative min-w-[280px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari pertanyaan atau jawaban..."
            className="w-full bg-slate-900/60 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* FAQ Accordion / List */}
      <div className="space-y-3">
        {loading ? (
          <div className="py-16 text-center text-slate-400 flex flex-col items-center gap-3">
            <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs">Memuat FAQ dari database...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-xs">
            Belum ada data FAQ yang cocok.
          </div>
        ) : (
          filtered.map(f => (
            <div key={f.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4.5 hover:border-slate-700 transition-all">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      {f.category}
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-sm">
                    {f.question}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed pt-1">
                    {f.answer}
                  </p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => openEditModal(f)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer border border-slate-700"
                    title="Edit"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(f.id)}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 cursor-pointer border border-rose-500/20"
                    title="Hapus"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col text-left shadow-2xl relative my-auto overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800 shrink-0 bg-slate-900">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-500" />
                <span>{editingItem ? 'Edit FAQ' : 'Tambah Pertanyaan FAQ'}</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs overscroll-contain">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Kategori Topik *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Pemesanan & Syarat">Pemesanan & Syarat</option>
                    <option value="Pengiriman & Lokasi">Pengiriman & Lokasi</option>
                    <option value="Teknis & Operator">Teknis & Operator</option>
                    <option value="BBM & Biaya">BBM & Biaya</option>
                    <option value="Darurat 24 Jam">Darurat 24 Jam</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Pertanyaan *</label>
                  <input
                    type="text"
                    value={formData.question}
                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                    placeholder="Contoh: Apakah sewa genset sudah termasuk operator?"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Jawaban Lengkap *</label>
                  <textarea
                    rows={4}
                    value={formData.answer}
                    onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                    placeholder="Tulis jawaban informatif dan jelas bagi pelanggan..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 leading-relaxed"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 px-6 py-3.5 border-t border-slate-800 bg-slate-900/90 backdrop-blur-sm shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold cursor-pointer hover:bg-slate-700"
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
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full text-center my-auto shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2">Hapus FAQ?</h3>
            <p className="text-xs text-slate-400 mb-6">
              Pertanyaan ini akan dihapus dari database.
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

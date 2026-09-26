import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Image as ImageIcon, 
  MapPin, 
  Zap, 
  Check, 
  X, 
  RotateCcw 
} from 'lucide-react';
import { GalleryItem } from '../../../types';
import { getGallery, createGalleryItem, updateGalleryItem, deleteGalleryItem } from '../../../utils/api';
import { ImageUploadField } from '../ImageUploadField';

interface GalleryTabProps {
  onToast: (msg: string) => void;
}

export const GalleryTab: React.FC<GalleryTabProps> = ({ onToast }) => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form
  const [formData, setFormData] = useState({
    title: '',
    category: 'Wedding & Resepsi' as any,
    location: 'Kota Cirebon',
    gensetUsed: 'Genset Silent 60 kVA SGC',
    image: 'https://images.unsplash.com/photo-1563841930606-67e2bce48b78?w=800',
    client: '',
    duration: '1 Hari',
    peakLoad: '40 kW',
    description: '',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getGallery();
      setItems(data);
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
      title: '',
      category: 'Wedding & Resepsi',
      location: 'Kota Cirebon',
      gensetUsed: 'Genset Silent 60 kVA',
      image: 'https://images.unsplash.com/photo-1563841930606-67e2bce48b78?w=800',
      client: '',
      duration: '1 Hari',
      peakLoad: '40 kW',
      description: 'Penyediaan daya listrik stabil untuk acara.',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: GalleryItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      category: item.category,
      location: item.location,
      gensetUsed: item.gensetUsed,
      image: item.image,
      client: item.client || '',
      duration: item.duration || '',
      peakLoad: item.peakLoad || '',
      description: item.description || '',
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.image) {
      onToast('Judul dan URL gambar wajib diisi.');
      return;
    }

    setSubmitting(true);
    try {
      if (editingItem) {
        // Optimistic update
        setItems(prev => prev.map(it => it.id === editingItem.id ? { ...it, ...formData } : it));
        setIsModalOpen(false);

        const res = await updateGalleryItem(editingItem.id, formData);
        if (res.success) {
          onToast('Portofolio berhasil diperbarui!');
        } else {
          onToast('Gagal update: ' + res.message);
        }
        await loadData();
      } else {
        const tempId = 'gal-' + Date.now();
        const optimisticItem: GalleryItem = { id: tempId, ...formData };
        setItems(prev => [optimisticItem, ...prev]);
        setIsModalOpen(false);

        const res = await createGalleryItem(formData);
        if (res.success) {
          onToast('Portofolio baru berhasil ditambahkan!');
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
    setItems(prev => prev.filter(it => it.id !== id));
    setDeleteConfirmId(null);

    const res = await deleteGalleryItem(id);
    if (res.success) {
      onToast('Portofolio berhasil dihapus.');
    } else {
      onToast('Gagal menghapus: ' + res.message);
    }
    await loadData();
  };

  const filtered = items.filter(item => {
    const matchCat = selectedCategory === 'Semua' || item.category === selectedCategory;
    const matchSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-amber-500" />
            <span>Galeri & Dokumentasi Portofolio</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Dokumentasi proyek sukses pernikahan, konser musik, dan operasional industri di Cirebon
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
            <span>Tambah Portofolio</span>
          </button>
        </div>
      </div>

      {/* Grid of Portfolio Cards */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs">Memuat galeri dari database...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-slate-500 text-xs">
          Belum ada dokumentasi portofolio di database.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(item => (
            <div key={item.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden group hover:border-slate-700 transition-all">
              <div className="h-44 relative overflow-hidden bg-slate-800">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-950/80 backdrop-blur-md text-amber-400 border border-slate-800">
                  {item.category}
                </span>
                <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-90">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-900 text-slate-200 cursor-pointer shadow"
                    title="Edit"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(item.id)}
                    className="p-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-300 cursor-pointer shadow"
                    title="Hapus"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-2">
                <h3 className="font-bold text-white text-sm line-clamp-1">{item.title}</h3>
                <div className="flex items-center gap-1 text-slate-400 text-xs">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="truncate">{item.location}</span>
                </div>
                <div className="flex items-center gap-1 text-amber-400 text-xs font-semibold">
                  <Zap className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{item.gensetUsed}</span>
                </div>
                {item.description && (
                  <p className="text-[11px] text-slate-500 line-clamp-2 pt-1 border-t border-slate-800/80">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col text-left shadow-2xl relative my-auto overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800 shrink-0 bg-slate-900">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-amber-500" />
                <span>{editingItem ? 'Edit Dokumentasi' : 'Tambah Foto Portofolio'}</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs overscroll-contain">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Judul Acara / Proyek *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Contoh: Resepsi Pernikahan di Hotel Grage Cirebon"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Kategori</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="Wedding & Resepsi">Wedding & Resepsi</option>
                      <option value="Konser & Musik">Konser & Musik</option>
                      <option value="Proyek & Pembangunan">Proyek & Pembangunan</option>
                      <option value="Pabrik & Industri">Pabrik & Industri</option>
                      <option value="Instansi & Pemerintahan">Instansi & Pemerintahan</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Lokasi Acara</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Grage Hotel, Kota Cirebon"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Genset / Unit yang Digunakan</label>
                  <input
                    type="text"
                    value={formData.gensetUsed}
                    onChange={(e) => setFormData({ ...formData, gensetUsed: e.target.value })}
                    placeholder="Genset Silent 60 kVA + 4 AC 5 PK"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <ImageUploadField
                    label="Foto Dokumentasi Lapangan"
                    value={formData.image}
                    onChange={(url) => setFormData({ ...formData, image: url })}
                    required
                    helpText="Format JPG, PNG, WEBP (Foto dokumentasi event / instalasi genset di Cirebon)"
                    onNotify={onToast}
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Deskripsi Ringkas</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Penjelasan beban listrik, kestabilan voltase, atau testimoni singkat klien..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500"
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
            <h3 className="text-base font-bold text-white mb-2">Hapus Portofolio?</h3>
            <p className="text-xs text-slate-400 mb-6">
              Item dokumentasi ini akan dihapus dari database.
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

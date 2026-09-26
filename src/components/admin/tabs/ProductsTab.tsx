import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Zap, 
  Snowflake, 
  Package, 
  Sliders, 
  Check, 
  X, 
  Image as ImageIcon,
  DollarSign,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { Product, ProductType } from '../../../types';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../../utils/api';
import { formatCurrency } from '../../../utils/format';

interface ProductsTabProps {
  onToast: (msg: string) => void;
}

export const ProductsTab: React.FC<ProductsTabProps> = ({ onToast }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form fields
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    product_type: 'genset' as ProductType,
    price: 0,
    image_url: '',
    description: '',
    kva: '' as any,
    kw: '' as any,
    is_available: true,
    sort_order: 0,
  });

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
    const handleSync = () => loadProducts();
    window.addEventListener('sgc_data_changed', handleSync);
    return () => window.removeEventListener('sgc_data_changed', handleSync);
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      id: 'sgc-' + Date.now().toString().slice(-6),
      name: '',
      product_type: 'genset',
      price: 500000,
      image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800',
      description: 'Kapasitas Daya:\nMesin:\nTipe Listrik: 3 Phase (380V/220V)\nTingkat Suara: Super Silent\n\nPaket Sewa Sudah Termasuk:\n• 1 Unit Genset Silent\n• Kabel Power Standar\n• Operator Teknisi Standby',
      kva: 20,
      kw: 16,
      is_available: true,
      sort_order: products.length + 1,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      id: p.id,
      name: p.name,
      product_type: p.product_type || 'genset',
      price: p.price || 0,
      image_url: p.image_url || p.image || '',
      description: p.description || '',
      kva: p.kva ?? '',
      kw: p.kw ?? '',
      is_available: p.is_available ?? true,
      sort_order: (p as any).sort_order ?? 0,
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      onToast('Nama produk wajib diisi.');
      return;
    }

    setSubmitting(true);
    try {
      const payload: Partial<Product> = {
        name: formData.name,
        product_type: formData.product_type,
        price: Number(formData.price),
        image_url: formData.image_url,
        description: formData.description,
        kva: formData.kva ? Number(formData.kva) : undefined,
        kw: formData.kw ? Number(formData.kw) : undefined,
        is_available: formData.is_available,
        sort_order: Number(formData.sort_order),
      };

      if (editingProduct) {
        // 1. UPDATE INSTAN DI STATE LOKAL (OPTIMISTIC UPDATE)
        setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...payload } as Product : p));
        setIsModalOpen(false);

        const res = await updateProduct(editingProduct.id, payload);
        if (res.success) {
          onToast(`Produk "${formData.name}" berhasil diperbarui!`);
        } else {
          onToast('Peringatan: ' + res.message);
        }
        await loadProducts();
      } else {
        const newId = formData.id || 'sgc-' + Date.now();
        payload.id = newId;

        // 1. TAMBAH INSTAN DI STATE LOKAL (OPTIMISTIC UPDATE)
        setProducts(prev => [payload as Product, ...prev]);
        setIsModalOpen(false);

        const res = await createProduct(payload);
        if (res.success) {
          onToast(`Produk "${formData.name}" berhasil ditambahkan ke database!`);
        } else {
          onToast('Peringatan: ' + res.message);
        }
        await loadProducts();
      }
    } catch (err: any) {
      onToast('Error: ' + err.message);
      await loadProducts();
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // 1. HAPUS INSTAN DARI STATE LOKAL (OPTIMISTIC DELETE)
      setProducts(prev => prev.filter(p => p.id !== id));
      setDeleteConfirmId(null);

      const res = await deleteProduct(id);
      if (res.success) {
        onToast('Produk berhasil dihapus dari database.');
      } else {
        onToast('Gagal menghapus: ' + res.message);
      }
      await loadProducts();
    } catch (err: any) {
      onToast('Error: ' + err.message);
      await loadProducts();
    }
  };

  const filtered = products.filter(p => {
    const matchCat = selectedCategory === 'all' || p.product_type === selectedCategory;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            <span>Katalog Genset & Unit Pendingin</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Kelola data produk, harga sewa, spesifikasi mesin, dan ketersediaan unit di Hostinger MySQL
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadProducts}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
            title="Muat Ulang Data"
          >
            <RotateCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={openAddModal}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Produk Baru</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'Semua Kategori', icon: Sliders },
            { id: 'genset', label: 'Genset Silent', icon: Zap },
            { id: 'ac', label: 'AC & Misty Fan', icon: Snowflake },
            { id: 'paket', label: 'Paket Hemat', icon: Package },
            { id: 'aksesoris', label: 'Aksesoris ATS', icon: Sliders },
          ].map(cat => {
            const Icon = cat.icon;
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                  active
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari unit atau kapasitas..."
            className="w-full bg-slate-900/60 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Product List Table / Cards */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-slate-400 flex flex-col items-center gap-3">
            <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs">Memuat katalog dari database MySQL Hostinger...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-xs">
            Tidak ada produk yang cocok dengan pencarian atau filter saat ini.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4 font-semibold">Produk / Unit</th>
                  <th className="py-3 px-4 font-semibold">Kategori</th>
                  <th className="py-3 px-4 font-semibold">Kapasitas</th>
                  <th className="py-3 px-4 font-semibold">Tarif Sewa</th>
                  <th className="py-3 px-4 font-semibold">Status Unit</th>
                  <th className="py-3 px-4 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-800 overflow-hidden shrink-0 border border-slate-700/60">
                          <img
                            src={p.image_url || p.image}
                            alt={p.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as any).src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800';
                            }}
                          />
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm">{p.name}</div>
                          <div className="text-[11px] text-slate-500 font-mono truncate max-w-[220px]">
                            ID: {p.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                        p.product_type === 'genset' 
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : p.product_type === 'ac'
                          ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                          : p.product_type === 'paket'
                          ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        {p.product_type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {p.kva ? (
                        <div className="font-semibold text-slate-200">{p.kva} kVA <span className="text-slate-500 font-normal">({p.kw || Math.round(p.kva * 0.8)} kW)</span></div>
                      ) : p.pk ? (
                        <div className="font-semibold text-cyan-300">{p.pk} PK</div>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {p.price > 0 ? (
                        <div className="font-bold text-amber-400 text-sm">
                          {formatCurrency(p.price)}
                          <span className="text-[10px] text-slate-500 font-normal ml-1">/acara</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Call WhatsApp</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                        p.is_available !== false 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${p.is_available !== false ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                        {p.is_available !== false ? 'Tersedia' : 'Sedang Disewa'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer border border-slate-700"
                          title="Edit Produk"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(p.id)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer border border-rose-500/20"
                          title="Hapus Produk"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">Hapus Produk Ini?</h3>
            <p className="text-xs text-slate-400 mb-6">
              Produk dengan ID <strong>{deleteConfirmId}</strong> akan dihapus permanen dari database Hostinger Anda.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold cursor-pointer"
              >
                Hapus Sekarang
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 my-8 text-left shadow-2xl relative">
            <div className="flex justify-between items-center pb-4 mb-5 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>{editingProduct ? 'Edit Data Produk' : 'Tambah Produk / Genset Baru'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Nama Produk / Unit *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: Genset Silent 45 kVA (36 kW)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Kategori Produk *</label>
                  <select
                    value={formData.product_type}
                    onChange={(e) => setFormData({ ...formData, product_type: e.target.value as ProductType })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="genset">Genset Silent</option>
                    <option value="ac">AC Standing Floor & Misty Fan</option>
                    <option value="paket">Paket Bundling Wedding/Hajatan</option>
                    <option value="aksesoris">Aksesoris (Panel ATS / Kabel)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Tarif Sewa (Rp per Hari/Acara)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    placeholder="0 jika hubungi WhatsApp"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    {formData.price > 0 ? formatCurrency(formData.price) : '0 = Hubungi WhatsApp untuk penawaran khusus'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Kapasitas (kVA)</label>
                    <input
                      type="number"
                      value={formData.kva}
                      onChange={(e) => setFormData({ ...formData, kva: e.target.value })}
                      placeholder="Contoh: 60"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Daya (kW / PK)</label>
                    <input
                      type="number"
                      value={formData.kw}
                      onChange={(e) => setFormData({ ...formData, kw: e.target.value })}
                      placeholder="Contoh: 48"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-400 font-semibold mb-1">URL Gambar Unit *</label>
                  <input
                    type="text"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                    required
                  />
                  {formData.image_url && (
                    <div className="mt-2 flex items-center gap-3">
                      <div className="w-14 h-14 rounded-lg bg-slate-800 overflow-hidden border border-slate-700 shrink-0">
                        <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[11px] text-slate-500">Preview Gambar Unit</span>
                    </div>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-400 font-semibold mb-1">Deskripsi Spesifikasi & Paket</label>
                  <textarea
                    rows={5}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Rincian mesin, kapasitas tangki, konsumsi BBM, peruntukan acara, kelengkapan kabel & operator..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 leading-relaxed font-mono"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_avail"
                    checked={formData.is_available}
                    onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                    className="w-4 h-4 text-amber-500 rounded bg-slate-950 border-slate-800 focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="is_avail" className="text-slate-300 font-medium cursor-pointer">
                    Unit Siap & Tersedia untuk Disewa
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Menyimpan ke MySQL...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{editingProduct ? 'Simpan Perubahan' : 'Tambahkan ke Katalog'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

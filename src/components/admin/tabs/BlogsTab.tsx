import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  FileText, 
  Calendar, 
  User, 
  Clock, 
  Check, 
  X, 
  RotateCcw,
  ExternalLink
} from 'lucide-react';
import { BlogPost } from '../../../types';
import { getBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost } from '../../../utils/api';

interface BlogsTabProps {
  onToast: (msg: string) => void;
}

export const BlogsTab: React.FC<BlogsTabProps> = ({ onToast }) => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Tips & Panduan' as any,
    summary: '',
    contentRaw: '',
    tagsRaw: '',
    author: 'Tim Teknis SGC',
    readTime: '4 Menit Baca',
    image: 'https://images.unsplash.com/photo-1636867759143-c28c1e909bd3?w=800',
  });

  const loadBlogs = async () => {
    setLoading(true);
    try {
      const data = await getBlogPosts();
      setBlogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
    const handleSync = () => loadBlogs();
    window.addEventListener('sgc_data_changed', handleSync);
    return () => window.removeEventListener('sgc_data_changed', handleSync);
  }, []);

  const openAddModal = () => {
    setEditingBlog(null);
    setFormData({
      title: '',
      slug: '',
      category: 'Tips & Panduan',
      summary: '',
      contentRaw: '',
      tagsRaw: 'Wedding Cirebon, Tips Genset, SGC Power',
      author: 'Tim Teknis SGC',
      readTime: '4 Menit Baca',
      image: 'https://images.unsplash.com/photo-1636867759143-c28c1e909bd3?w=800',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (b: BlogPost) => {
    setEditingBlog(b);
    setFormData({
      title: b.title,
      slug: b.slug,
      category: b.category,
      summary: b.summary,
      contentRaw: Array.isArray(b.content) ? b.content.join('\n\n') : (b.content || ''),
      tagsRaw: Array.isArray(b.tags) ? b.tags.join(', ') : '',
      author: b.author,
      readTime: b.readTime,
      image: b.image,
    });
    setIsModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    const slug = val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setFormData(prev => ({
      ...prev,
      title: val,
      slug: !editingBlog ? slug : prev.slug
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.summary) {
      onToast('Judul dan ringkasan wajib diisi.');
      return;
    }

    setSubmitting(true);
    const content = formData.contentRaw
      .split('\n\n')
      .map(p => p.trim())
      .filter(p => p.length > 0);
    const tags = formData.tagsRaw
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const payload: Partial<BlogPost> = {
      title: formData.title,
      slug: formData.slug,
      category: formData.category,
      summary: formData.summary,
      author: formData.author,
      readTime: formData.readTime,
      image: formData.image,
      tags: tags,
      content: content,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    };

    try {
      if (editingBlog) {
        // Optimistic update
        setBlogs(prev => prev.map(b => b.id === editingBlog.id ? { ...b, ...payload } as BlogPost : b));
        setIsModalOpen(false);

        const res = await updateBlogPost(editingBlog.id, payload);
        if (res.success) {
          onToast('Artikel berhasil diperbarui!');
        } else {
          onToast('Gagal update: ' + res.message);
        }
        await loadBlogs();
      } else {
        const tempId = 'blog-' + Date.now();
        const optimisticBlog = { id: tempId, ...payload } as BlogPost;
        setBlogs(prev => [optimisticBlog, ...prev]);
        setIsModalOpen(false);

        const res = await createBlogPost(payload);
        if (res.success) {
          onToast('Artikel baru berhasil diterbitkan!');
        } else {
          onToast('Gagal terbit: ' + res.message);
        }
        await loadBlogs();
      }
    } catch (err: any) {
      onToast('Error: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    // Optimistic delete
    setBlogs(prev => prev.filter(b => b.id !== id));
    setDeleteConfirmId(null);

    const res = await deleteBlogPost(id);
    if (res.success) {
      onToast('Artikel berhasil dihapus.');
    } else {
      onToast('Gagal menghapus: ' + res.message);
    }
    await loadBlogs();
  };

  const filtered = blogs.filter(b => 
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            <span>Manajemen Artikel & Berita</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Publikasikan tips, panduan genset, dan berita sewa untuk SEO Google Kota Cirebon
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadBlogs}
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
            <span>Tulis Artikel Baru</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="flex justify-end">
        <div className="relative min-w-[280px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari judul artikel..."
            className="w-full bg-slate-900/60 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Blogs Table */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-slate-400 flex flex-col items-center gap-3">
            <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs">Memuat artikel...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-xs">
            Tidak ada artikel yang ditemukan.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4 font-semibold">Artikel</th>
                  <th className="py-3 px-4 font-semibold">Kategori</th>
                  <th className="py-3 px-4 font-semibold">Penulis & Tanggal</th>
                  <th className="py-3 px-4 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filtered.map(b => (
                  <tr key={b.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-12 rounded-lg bg-slate-800 overflow-hidden shrink-0 border border-slate-700">
                          <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm line-clamp-1">{b.title}</div>
                          <div className="text-[11px] text-slate-500 font-mono mt-0.5">/{b.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                        {b.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-200 font-medium">{b.author}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{b.date} • {b.readTime}</div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => openEditModal(b)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(b.id)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors cursor-pointer"
                          title="Hapus"
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

      {/* Modal Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col text-left shadow-2xl relative my-auto overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800 shrink-0 bg-slate-900">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                <span>{editingBlog ? 'Edit Artikel' : 'Tulis Artikel Baru'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs overscroll-contain">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Judul Artikel *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Contoh: Tips Memilih Kapasitas Genset Silent untuk Pesta Pernikahan"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Slug URL *</label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Kategori</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="Tips & Panduan">Tips & Panduan</option>
                      <option value="Seputar Genset">Seputar Genset</option>
                      <option value="Event & Proyek">Event & Proyek</option>
                      <option value="Berita Cirebon">Berita Cirebon</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">URL Gambar Cover *</label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                    required
                  />
                  {formData.image && (
                    <div className="mt-2 flex items-center gap-3">
                      <div className="w-16 h-12 rounded-lg bg-slate-800 overflow-hidden border border-slate-700 shrink-0">
                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[11px] text-slate-500">Preview Cover Artikel</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Ringkasan / Excerpt *</label>
                  <textarea
                    rows={2}
                    value={formData.summary}
                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                    placeholder="Ringkasan singkat yang tampil di beranda Google dan preview artikel..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    Isi Paragraf Konten (Pisahkan paragraf dengan 2x Enter / Baris Kosong) *
                  </label>
                  <textarea
                    rows={6}
                    value={formData.contentRaw}
                    onChange={(e) => setFormData({ ...formData, contentRaw: e.target.value })}
                    placeholder="Tulis paragraf artikel di sini..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 leading-relaxed font-mono"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Penulis</label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Waktu Baca</label>
                    <input
                      type="text"
                      value={formData.readTime}
                      onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Tags (Koma)</label>
                    <input
                      type="text"
                      value={formData.tagsRaw}
                      onChange={(e) => setFormData({ ...formData, tagsRaw: e.target.value })}
                      placeholder="Genset, Cirebon, Wedding"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 px-6 py-3.5 border-t border-slate-800 bg-slate-900/90 backdrop-blur-sm shrink-0">
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
                  <Check className="w-4 h-4" />
                  <span>{editingBlog ? 'Simpan Perubahan' : 'Terbitkan Artikel'}</span>
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
            <h3 className="text-base font-bold text-white mb-2">Hapus Artikel Ini?</h3>
            <p className="text-xs text-slate-400 mb-6">
              Artikel akan dihapus secara permanen dari database.
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

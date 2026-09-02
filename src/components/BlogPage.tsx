import React, { useState } from 'react';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  ArrowLeft, 
  ArrowRight, 
  Search, 
  Tag, 
  Share2, 
  X, 
  Zap, 
  Flame, 
  MessageSquare,
  Sparkles,
  PhoneCall,
  CheckCircle2
} from 'lucide-react';
import { BLOG_POSTS } from '../data/blogPosts';
import { COMPANY_INFO } from '../data/company';
import { BlogPost } from '../types';

interface BlogPageProps {
  onBackToHome: () => void;
  onGoToBooking: () => void;
  onToast: (msg: string) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ 
  onBackToHome, 
  onGoToBooking,
  onToast 
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeArticle, setActiveArticle] = useState<BlogPost | null>(null);

  const categories = [
    { id: 'all', label: 'Semua Berita' },
    { id: 'Tips & Panduan', label: 'Tips & Panduan' },
    { id: 'Seputar Genset', label: 'Teknis & Spesifikasi' },
    { id: 'Event & Proyek', label: 'Event & Industri' },
  ];

  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchSearch = searchQuery.trim() === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCategory && matchSearch;
  });

  const featuredPost = BLOG_POSTS[0];

  const handleShareArticle = (post: BlogPost) => {
    const shareText = `Baca artikel bermanfaat ini: ${post.title} oleh Sewa Genset Cirebon (SGC)`;
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.summary,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${shareText}\n${window.location.href}`);
      onToast('Tautan artikel berhasil disalin!');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 sm:py-12 animate-in fade-in duration-300 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb & Back */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <button
            onClick={onBackToHome}
            id="blog-back-to-home-btn"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500 text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </button>

          <div className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
            <span>Beranda</span> <span className="mx-1">/</span> <strong className="text-slate-900 dark:text-white">Portal Berita & Edukasi SGC</strong>
          </div>
        </div>

        {/* Portal Header Banner */}
        <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl p-6 sm:p-10 lg:p-12 mb-10 shadow-xs border border-slate-200 dark:border-slate-800 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800 text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>SGC News &amp; Knowledge Center</span>
            </div>

            <h1 className="text-2xl sm:4xl lg:text-5xl font-display font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              Portal Berita &amp; Panduan Kelistrikan Cirebon
            </h1>

            <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              Sumber informasi terpercaya seputar rental genset silent, kalkulasi beban daya acara, panduan teknis panel ATS, dan kabar seputar kelistrikan di wilayah Kota Cirebon, Kuningan, Majalengka, dan Indramayu.
            </p>

            {/* Quick Search inside portal */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3 max-w-xl">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari topik (misal: pernikahan, solar, ATS, pabrik)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Featured Headline Article (shown if no search query) */}
        {!searchQuery && selectedCategory === 'all' && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Artikel Utama / Headline Terkini
              </h2>
            </div>

            <div 
              onClick={() => setActiveArticle(featuredPost)}
              className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-md hover:shadow-2xl transition-all cursor-pointer grid grid-cols-1 lg:grid-cols-12"
            >
              <div className="lg:col-span-7 relative aspect-16/10 lg:aspect-auto overflow-hidden bg-slate-900">
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-95"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-md">
                    {featuredPost.category}
                  </span>
                </div>
              </div>

              <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                      {featuredPost.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                      {featuredPost.readTime}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 dark:text-white leading-snug group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {featuredPost.title}
                  </h3>

                  <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-4">
                    {featuredPost.summary}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {featuredPost.tags.slice(0, 3).map((tag, i) => (
                      <span key={i} className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded font-medium border border-slate-200 dark:border-slate-700">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Oleh <strong className="text-slate-700 dark:text-slate-300">{featuredPost.author}</strong>
                  </span>
                  <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    <span>Baca Lengkap</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Categories Bar */}
        <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950 shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Menampilkan <strong>{filteredPosts.length}</strong> artikel
          </div>
        </div>

        {/* Main News Grid & Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Articles Listing */}
          <div className="lg:col-span-8 space-y-6">
            {filteredPosts.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-10 text-center border border-slate-200 dark:border-slate-800">
                <BookOpen className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-base">Tidak ada artikel yang cocok</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Coba gunakan kata kunci lain atau pilih kategori Semua Berita.</p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                  }}
                  className="mt-4 px-4 py-2 rounded-xl bg-slate-900 dark:bg-amber-500 hover:bg-slate-800 dark:hover:bg-amber-600 text-white dark:text-slate-950 text-xs font-bold cursor-pointer"
                >
                  Reset Filter
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filteredPosts.map((post) => (
                  <article
                    key={post.id}
                    onClick={() => setActiveArticle(post)}
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-xl hover:border-amber-400 dark:hover:border-amber-400 transition-all flex flex-col justify-between group cursor-pointer"
                  >
                    <div>
                      <div className="relative aspect-16/9 overflow-hidden bg-slate-900">
                        <img
                          src={post.image}
                          alt={post.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="px-2.5 py-1 rounded-md bg-amber-500 text-slate-950 text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
                            {post.category}
                          </span>
                        </div>
                      </div>

                      <div className="p-5">
                        <div className="flex items-center gap-3 text-[11px] text-slate-400 dark:text-slate-500 mb-2">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {post.date}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {post.readTime}
                          </span>
                        </div>

                        <h3 className="font-display font-bold text-base text-slate-900 dark:text-white leading-snug group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-2">
                          {post.title}
                        </h3>

                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                          {post.summary}
                        </p>
                      </div>
                    </div>

                    <div className="px-5 pb-5 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                        <span>Baca Selengkapnya</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Oleh {post.author.split('(')[0]}</span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Consultation Card */}
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-6 text-slate-950 shadow-md">
              <div className="w-10 h-10 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center mb-4">
                <Zap className="w-5 h-5 fill-amber-400" />
              </div>
              <h3 className="font-display font-extrabold text-lg leading-snug">
                Butuh Bantuan Hitung Beban Listrik Acara Anda?
              </h3>
              <p className="text-xs text-slate-900/90 mt-2 leading-relaxed">
                Konsultasikan daftar alat (sound, AC, lighting) gratis bersama insinyur listrik Sewa Genset Cirebon (SGC).
              </p>
              <button
                onClick={onGoToBooking}
                className="mt-4 w-full py-3 rounded-xl bg-slate-950 hover:bg-slate-900 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-colors"
              >
                <span>Konsultasi & Booking Sekarang</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Popular Topics */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
              <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <Tag className="w-4 h-4 text-amber-500" />
                <span>Topik Populer Cirebon</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Wedding Cirebon',
                  'Rental Genset Silent',
                  'Panel ATS',
                  'Kapasitas Daya',
                  'Hemat Solar',
                  'Kawasan Industri Kertajati',
                  'Konser Musik',
                  'Plumbon',
                  'SGC Standby 24 Jam'
                ].map((tag, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSearchQuery(tag)}
                    className="text-xs bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-amber-950/60 hover:text-amber-900 dark:hover:text-amber-300 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg transition-colors cursor-pointer font-medium border border-slate-200/50 dark:border-slate-700"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            {/* SGC Hotline Standby */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Hotline Emergency 24 Jam</span>
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Panggilan darurat genset padam di Cirebon dan sekitarnya langsung ke teknisi jaga.
              </p>
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 font-mono font-bold text-sm text-center">
                {COMPANY_INFO.phone}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Full Article Reader Modal */}
      {activeArticle && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setActiveArticle(null)}
        >
          <div 
            className="relative bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                {activeArticle.category} • {activeArticle.readTime}
              </span>
              <button
                onClick={() => setActiveArticle(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-5">
              <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 dark:text-white leading-tight">
                {activeArticle.title}
              </h2>

              <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pb-3 border-b border-slate-100 dark:border-slate-800 flex-wrap">
                <span>Penulis: <strong className="text-slate-700 dark:text-slate-300">{activeArticle.author}</strong></span>
                <span>•</span>
                <span>Dipublikasikan: {activeArticle.date}</span>
              </div>

              {/* Cover Image */}
              <div className="rounded-xl overflow-hidden aspect-16/9 bg-slate-900">
                <img
                  src={activeArticle.image}
                  alt={activeArticle.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Body paragraphs */}
              <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {activeArticle.content.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              {/* Tags */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 flex-wrap">
                <Tag className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                {activeArticle.tags.map((tag, i) => (
                  <span key={i} className="text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-md font-medium border border-slate-200 dark:border-slate-700">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={() => handleShareArticle(activeArticle)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Bagikan Artikel</span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => {
                    setActiveArticle(null);
                    onGoToBooking();
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs sm:text-sm font-extrabold shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>Sewa Genset di SGC</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

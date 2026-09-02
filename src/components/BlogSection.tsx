import React, { useState } from 'react';
import {
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
  X,
  Share2,
  MessageSquare,
  Zap,
  CheckCircle2,
  Tag
} from 'lucide-react';
import { BLOG_POSTS } from '../data/blogPosts';
import { BlogPost } from '../types';
import { getGeneralWhatsAppUrl } from '../utils/whatsapp';

interface BlogSectionProps {
  onGoToBooking: () => void;
  onToast: (msg: string) => void;
}

export const BlogSection: React.FC<BlogSectionProps> = ({ onGoToBooking, onToast }) => {
  const [activeArticle, setActiveArticle] = useState<BlogPost | null>(null);

  const handleShareArticle = (post: BlogPost) => {
    const shareText = `Baca artikel bermanfaat ini: ${post.title} oleh Sewa Genset Cirebon`;
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.summary,
        url: window.location.href,
      }).catch(() => { });
    } else {
      navigator.clipboard.writeText(`${shareText}\n${window.location.href}`);
      onToast('Tautan artikel berhasil disalin!');
    }
  };

  return (
    <section id="blog" className="py-16 sm:py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-bold uppercase tracking-wider mb-3">
            <BookOpen className="w-3.5 h-3.5 text-blue-700" />
            <span>Berita & Edukasi Kelistrikan</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold text-slate-900 tracking-tight">
            Artikel Terkini & Tips Seputar Rental Genset
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            Informasi bermanfaat seputar perhitungan beban listrik, panduan pemilihan kapasitas genset pernikahan, tips proyek, dan berita terkini di Cirebon.
          </p>
        </div>

        {/* Articles Grid (Clean Layout Without Category Filter) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {BLOG_POSTS.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md hover:border-amber-300 transition-all flex flex-col justify-between group cursor-pointer"
              onClick={() => setActiveArticle(post)}
            >
              <div>
                {/* Category Badge & Meta */}
                <div className="p-5 pb-3">
                  <span className="inline-block px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 text-[10px] font-extrabold uppercase tracking-wider mb-2.5">
                    {post.category}
                  </span>

                  <h3 className="font-display font-bold text-base text-slate-900 leading-snug group-hover:text-amber-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                    {post.summary}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{post.readTime}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-600 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    <span>Baca Selengkapnya</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>

      {/* Article Reader Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div
            className="relative bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                {activeArticle.category} • {activeArticle.readTime}
              </span>
              <button
                onClick={() => setActiveArticle(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-5">
              <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 leading-tight">
                {activeArticle.title}
              </h2>

              <div className="flex items-center gap-4 text-xs text-slate-500 pb-3 border-b border-slate-100 flex-wrap">
                <span>Penulis: <strong>{activeArticle.author}</strong></span>
                <span>•</span>
                <span>Dipublikasikan: {activeArticle.date}</span>
              </div>

              {/* Body paragraphs */}
              <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
                {activeArticle.content.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              {/* Tags */}
              <div className="pt-4 border-t border-slate-100 flex items-center gap-2 flex-wrap">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                {activeArticle.tags.map((tag, i) => (
                  <span key={i} className="text-[11px] bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-6 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={() => handleShareArticle(activeArticle)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold flex items-center gap-1.5 hover:bg-slate-100 cursor-pointer"
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
                  <span>Sewa Genset Sekarang</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};

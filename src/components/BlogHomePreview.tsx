import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Share2,
  X,
  Tag,
  Zap,
  Flame,
  MoveHorizontal
} from 'lucide-react';
import { motion } from 'motion/react';
import { BLOG_POSTS } from '../data/blogPosts';
import { BlogPost } from '../types';

interface BlogHomePreviewProps {
  onOpenAllArticles: () => void;
  onGoToBooking: () => void;
  onToast: (msg: string) => void;
}

export const BlogHomePreview: React.FC<BlogHomePreviewProps> = ({
  onOpenAllArticles,
  onGoToBooking,
  onToast
}) => {
  const [activeArticle, setActiveArticle] = useState<BlogPost | null>(null);

  // Articles to show in preview
  const previewPosts = BLOG_POSTS.slice(0, 6);

  // Scroll Container Ref & State for Horizontal Navigation
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  const checkScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const firstArticle = container.querySelector('article');
    const cardWidth = firstArticle
      ? firstArticle.getBoundingClientRect().width + 24
      : (container.clientWidth > 768 ? 394 : 330);
    const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  // Mouse Drag to Scroll Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeftState(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = x - startX;
    scrollContainerRef.current.scrollLeft = scrollLeftState - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleShareArticle = (post: BlogPost) => {
    const shareText = `Baca artikel bermanfaat ini: ${post.title} oleh Sewa Genset Cirebon (SGC)`;
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
    <section id="artikel" className="py-16 sm:py-20 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 relative border-t border-slate-200/80 dark:border-slate-800 overflow-hidden transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6"
        >
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800 text-xs font-bold uppercase tracking-wider mb-3">
              <BookOpen className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Portal Berita &amp; Edukasi SGC</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
              Artikel &amp; Berita Terbaru Seputar Genset Cirebon
            </h2>
          </div>

          <button
            onClick={onOpenAllArticles}
            id="home-view-all-articles-btn"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500 dark:hover:border-amber-500 text-slate-800 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-400 font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer shrink-0 self-start md:self-auto"
          >
            <span>Buka Semua Artikel ({BLOG_POSTS.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>

        {/* Scroll Control Bar & Navigation Hint */}
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <MoveHorizontal className="w-4 h-4 text-amber-500 animate-pulse" />
            <span className="font-medium">Geser kartu artikel ke kanan dan kiri</span>
          </div>

          {/* Left / Right Scroll Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              aria-label="Scroll Artikel ke Kiri"
              className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${canScrollLeft
                ? 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:bg-amber-500 hover:text-slate-950 hover:border-amber-500 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-300 dark:text-slate-700 cursor-not-allowed'
                }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              aria-label="Scroll Artikel ke Kanan"
              className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${canScrollRight
                ? 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:bg-amber-500 hover:text-slate-950 hover:border-amber-500 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-300 dark:text-slate-700 cursor-not-allowed'
                }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Articles Cards (Supports Left & Right Drag, Swipe, Wheel & Buttons) */}
        <div
          ref={scrollContainerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className={`flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-4 sm:gap-6 pb-6 pt-1 px-[calc((100vw-84vw)/2)] sm:px-1 -mx-4 sm:mx-0 select-none mb-8 scroll-smooth ${isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
          style={{
            scrollBehavior: isDragging ? 'auto' : 'smooth',
            WebkitOverflowScrolling: 'touch',
            scrollPaddingLeft: 'calc((100vw - 84vw) / 2)',
            scrollPaddingRight: 'calc((100vw - 84vw) / 2)'
          }}
        >
          {previewPosts.map((post, idx) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.45, delay: idx * 0.08 }}
              className="w-[84vw] sm:w-[350px] md:w-[370px] shrink-0 snap-center sm:snap-start bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-xl hover:border-amber-400 dark:hover:border-amber-400 transition-all flex flex-col justify-between group cursor-pointer"
              onClick={() => {
                if (!isDragging) setActiveArticle(post);
              }}
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
                    {/* <span className="px-2.5 py-1 rounded-md bg-amber-500 text-slate-950 text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
                      {post.category}
                    </span> */}
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 dark:text-slate-500 mb-2.5">
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

                  <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white leading-snug group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2.5 line-clamp-3 leading-relaxed">
                    {post.summary}
                  </p>
                </div>
              </div>

              <div className="px-5 sm:px-6 pb-5 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1.5">
                  <span>Baca Artikel</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
                {/* <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Oleh {post.author.split('(')[0]}</span> */}
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      {/* Article Reader Modal */}
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
                <span>Penulis: <strong className="text-slate-700 dark:text-slate-200">{activeArticle.author}</strong></span>
                <span>•</span>
                <span>Dipublikasikan: {activeArticle.date}</span>
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
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
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
    </section>
  );
};

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Star,
  Quote,
  CheckCircle2,
  Plus,
  X,
  Send,
  MapPin,
  MessageSquare,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  MoveHorizontal,
  User
} from 'lucide-react';
import { motion } from 'motion/react';
import { TESTIMONIALS } from '../data/testimonials';
import { Testimonial } from '../types';

interface TestimonialsSectionProps {
  onToast: (msg: string) => void;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ onToast }) => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(TESTIMONIALS);
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [isAddReviewOpen, setIsAddReviewOpen] = useState(false);

  // Scroll Container Ref & State for Horizontal Navigation
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  // New review form state
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newLocation, setNewLocation] = useState('Kota Cirebon');
  const [newRating, setNewRating] = useState(5);
  const [newGenset, setNewGenset] = useState('Genset Silent 30 kVA');
  const [newComment, setNewComment] = useState('');

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
  }, [checkScroll, testimonials]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const firstCard = container.querySelector('div[class*="shrink-0"]');
    const cardWidth = firstCard
      ? firstCard.getBoundingClientRect().width + 24
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
    const walk = x - startX; // 1:1 direct scroll
    scrollContainerRef.current.scrollLeft = scrollLeftState - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newComment.trim()) {
      onToast('Mohon lengkapi nama dan ulasan Anda.');
      return;
    }

    const newTesti: Testimonial = {
      id: `testi-${Date.now()}`,
      name: newName,
      role: newRole || 'Pelanggan Terverifikasi',
      companyOrEvent: newCompany || 'Acara / Proyek Cirebon',
      location: newLocation,
      rating: newRating,
      date: 'Baru saja',
      comment: newComment,
      gensetUsed: newGenset,
      avatarBg: 'bg-amber-600',
      verified: true
    };

    setTestimonials([newTesti, ...testimonials]);
    setIsAddReviewOpen(false);
    onToast('Terima kasih! Ulasan & testimoni Anda berhasil ditambahkan.');

    // Reset
    setNewName('');
    setNewRole('');
    setNewCompany('');
    setNewComment('');

    // Scroll to start to view new review
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  };

  const filteredTestimonials = filterRating === 'all'
    ? testimonials
    : testimonials.filter(t => t.rating === filterRating);

  return (
    <section id="testimoni" className="py-16 sm:py-20 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 relative overflow-hidden transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header with Rating Summary & Motion */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8"
        >
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
              Kepercayaan Klien di Cirebon &amp; Sekitarnya
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Ratusan pernikahan, konser musik, dan operasional industri sukses berkat pasokan listrik genset kami.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs shrink-0">
            <div className="text-center border-r border-slate-200 dark:border-slate-800 pr-4">
              <div className="text-3xl font-display font-black text-slate-900 dark:text-white">4.9<span className="text-sm text-slate-400 dark:text-slate-500 font-normal">/5.0</span></div>
              <div className="flex items-center justify-center gap-0.5 text-amber-400 mt-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">1.250+ Proyek Selesai</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">99.4% Kepuasan Klien</div>
              <button
                onClick={() => setIsAddReviewOpen(true)}
                className="mt-1 text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Tulis Ulasan Anda</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Scroll Control Bar & Navigation Hint */}
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <MoveHorizontal className="w-4 h-4 text-amber-500 animate-pulse" />
            <span className="font-medium">Geser kartu ke kanan dan kiri untuk melihat semua ulasan ({filteredTestimonials.length})</span>
          </div>

          {/* Left / Right Scroll Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              aria-label="Scroll ke Kiri"
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
              aria-label="Scroll ke Kanan"
              className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${canScrollRight
                ? 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:bg-amber-500 hover:text-slate-950 hover:border-amber-500 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-300 dark:text-slate-700 cursor-not-allowed'
                }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Testimonials Cards (Supports Left & Right Drag, Swipe, Wheel & Buttons) */}
        <div
          ref={scrollContainerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className={`flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-4 sm:gap-6 pb-6 pt-1 px-[calc((100vw-84vw)/2)] sm:px-1 -mx-4 sm:mx-0 select-none scroll-smooth ${isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
          style={{
            scrollBehavior: isDragging ? 'auto' : 'smooth',
            WebkitOverflowScrolling: 'touch',
            scrollPaddingLeft: 'calc((100vw - 84vw) / 2)',
            scrollPaddingRight: 'calc((100vw - 84vw) / 2)'
          }}
        >
          {filteredTestimonials.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.45, delay: idx * 0.05 }}
              className="w-[84vw] sm:w-[350px] md:w-[370px] shrink-0 snap-center sm:snap-start bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs hover:shadow-xl hover:border-amber-400/80 dark:hover:border-amber-500/80 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Rating & Date */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">{item.date}</span>
                </div>

                {/* Comment */}
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic mb-5 relative">
                  <Quote className="w-6 h-6 text-slate-200 dark:text-slate-800 absolute -top-3 -left-2 -z-0 opacity-60" />
                  <span className="relative z-10">"{item.comment}"</span>
                </p>
              </div>

              {/* Client Info & Genset Badge */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full ${item.avatarBg} text-white font-bold text-xs flex items-center justify-center shrink-0`}>
                    {item.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-xs text-slate-900 dark:text-white truncate flex items-center gap-1">
                      <span>{item.name}</span>
                      {item.verified && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{item.role} • {item.companyOrEvent}</div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400 dark:text-slate-500 shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 inline-block px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  Unit: {item.gensetUsed}
                </div>
              </div>

            </motion.div>
          ))}
        </div>

      </div>

      {/* Write Review Modal */}
      {isAddReviewOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Tulis Ulasan / Pengalaman Anda</h3>
              <button onClick={() => setIsAddReviewOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddReview} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Anda *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Contoh: Bpk. Kurniawan"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Peran / Posisi</label>
                  <input
                    type="text"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    placeholder="Contoh: Wedding Organizer / Panitia"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Lokasi di Cirebon</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="Contoh: Kesambi, Kota Cirebon"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Genset yang Disewa</label>
                <select
                  value={newGenset}
                  onChange={(e) => setNewGenset(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                >
                  <option value="Genset Silent 10 kVA">Genset Silent 10 kVA</option>
                  <option value="Genset Silent 20 kVA">Genset Silent 20 kVA</option>
                  <option value="Genset Silent 30 kVA">Genset Silent 30 kVA</option>
                  <option value="Genset Silent 45 kVA">Genset Silent 45 kVA</option>
                  <option value="Genset Silent 60 kVA">Genset Silent 60 kVA</option>
                  <option value="Genset Silent 100 kVA">Genset Silent 100 kVA</option>
                  <option value="Genset Silent 150 kVA">Genset Silent 150 kVA</option>
                  <option value="Genset Silent 250 kVA">Genset Silent 250 kVA</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Rating Penilaian</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setNewRating(num)}
                      className={`p-2 rounded-lg border flex items-center gap-1 ${newRating >= num ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-400 text-amber-600 dark:text-amber-400 font-bold' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
                        }`}
                    >
                      <Star className={`w-4 h-4 ${newRating >= num ? 'fill-amber-400 text-amber-400' : ''}`} />
                      <span className="text-xs">{num}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Ulasan / Pengalaman Anda *</label>
                <textarea
                  rows={3}
                  required
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Ceritakan pengalaman Anda menyewa genset di Sewa Genset Cirebon..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddReviewOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-extrabold shadow-sm hover:bg-amber-600"
                >
                  Kirim Ulasan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

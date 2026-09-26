import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Zap, 
  CalendarCheck, 
  FileText, 
  Image as ImageIcon, 
  MessageSquareQuote, 
  HelpCircle, 
  Building, 
  Database, 
  LogOut, 
  ArrowLeft, 
  ShieldCheck, 
  Menu, 
  X,
  ExternalLink,
  ChevronRight,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Info
} from 'lucide-react';
import { AdminLogin } from './AdminLogin';
import { OverviewTab } from './tabs/OverviewTab';
import { ProductsTab } from './tabs/ProductsTab';
import { BookingsTab } from './tabs/BookingsTab';
import { BlogsTab } from './tabs/BlogsTab';
import { GalleryTab } from './tabs/GalleryTab';
import { TestimonialsTab } from './tabs/TestimonialsTab';
import { FaqsTab } from './tabs/FaqsTab';
import { CompanyTab } from './tabs/CompanyTab';
import { DatabaseTab } from './tabs/DatabaseTab';
import { checkAdminAuth, logoutAdmin } from '../../utils/api';
import { AdminUser } from '../../types';

interface AdminDashboardProps {
  onBackToHome: () => void;
}

interface ToastItem {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToHome }) => {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState<ToastItem | null>(null);

  const showToast = (msg: string, explicitType?: 'success' | 'error' | 'info') => {
    let type: 'success' | 'error' | 'info' = explicitType || 'info';
    if (!explicitType) {
      if (/(berhasil|sukses|terbit|tersimpan|dihapus|selamat)/i.test(msg)) {
        type = 'success';
      } else if (/(gagal|error|salah|peringatan|tidak dapat)/i.test(msg)) {
        type = 'error';
      }
    }
    const newToast: ToastItem = {
      id: Date.now(),
      message: msg,
      type
    };
    setToast(newToast);
    setTimeout(() => {
      setToast(prev => (prev?.id === newToast.id ? null : prev));
    }, 4500);
  };

  useEffect(() => {
    const verify = async () => {
      setAuthChecking(true);
      const user = await checkAdminAuth();
      setCurrentUser(user);
      setAuthChecking(false);
    };
    verify();
  }, []);

  const handleLogout = () => {
    logoutAdmin();
    setCurrentUser(null);
    showToast('Anda telah logout dari sesi admin.', 'info');
  };

  if (authChecking) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-slate-400 tracking-wider">Memeriksa autentikasi admin...</span>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <AdminLogin
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          showToast(`Selamat datang, ${user.full_name || user.username}!`, 'success');
        }}
        onBackToHome={onBackToHome}
      />
    );
  }

  const navItems = [
    { id: 'overview', label: 'Ringkasan', icon: LayoutDashboard },
    { id: 'products', label: 'Genset & Produk', icon: Zap },
    { id: 'bookings', label: 'Pesanan Masuk', icon: CalendarCheck },
    { id: 'blogs', label: 'Artikel & Berita', icon: FileText },
    { id: 'gallery', label: 'Galeri Portofolio', icon: ImageIcon },
    { id: 'testimonials', label: 'Ulasan Klien', icon: MessageSquareQuote },
    { id: 'faqs', label: 'Tanya Jawab (FAQ)', icon: HelpCircle },
    { id: 'company', label: 'Kontak Perusahaan', icon: Building },
    { id: 'database', label: 'Database Hostinger', icon: Database, isHighlight: true },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-white relative">
      {/* Toast Alert Notifikasi Sukses / Error CRUD */}
      {toast && (
        <div className="fixed top-5 right-5 z-[100] max-w-sm sm:max-w-md w-[calc(100%-2.5rem)] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className={`p-4 rounded-2xl border shadow-2xl backdrop-blur-2xl flex items-start gap-3.5 relative overflow-hidden ${
            toast.type === 'success'
              ? 'bg-slate-900/95 border-emerald-500/50 shadow-emerald-950/60 text-white'
              : toast.type === 'error'
              ? 'bg-slate-900/95 border-rose-500/50 shadow-rose-950/60 text-white'
              : 'bg-slate-900/95 border-amber-500/50 shadow-amber-950/60 text-white'
          }`}>
            {/* Icon status */}
            <div className={`p-2 rounded-xl shrink-0 ${
              toast.type === 'success'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : toast.type === 'error'
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
            }`}>
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 animate-pulse" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5" />}
              {toast.type === 'info' && <Info className="w-5 h-5" />}
            </div>

            {/* Content text */}
            <div className="flex-1 min-w-0 pr-2">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  toast.type === 'success'
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : toast.type === 'error'
                    ? 'bg-rose-500/20 text-rose-300'
                    : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {toast.type === 'success' ? 'Sukses / Berhasil' : toast.type === 'error' ? 'Peringatan' : 'Informasi'}
                </span>
              </div>
              <p className="text-xs text-slate-100 font-medium mt-1 leading-relaxed">
                {toast.message}
              </p>
            </div>

            {/* Close button */}
            <button
              onClick={() => setToast(null)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
              title="Tutup Notifikasi"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Progress line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800">
              <div className={`h-full ${
                toast.type === 'success'
                  ? 'bg-emerald-500'
                  : toast.type === 'error'
                  ? 'bg-rose-500'
                  : 'bg-amber-500'
              }`} />
            </div>
          </div>
        </div>
      )}

      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-white cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center font-bold text-slate-950 text-xs shadow-md shadow-amber-500/20">
              SGC
            </div>
            <div>
              <div className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
                <span>Admin Dashboard</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 font-semibold border border-amber-500/30">
                  Hostinger MySQL
                </span>
              </div>
              <div className="text-[10px] text-slate-400 hidden sm:block">
                sewagensetcirebon.com • Kendali Penuh
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onBackToHome}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium flex items-center gap-1.5 border border-slate-800 transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            <span className="hidden sm:inline">Lihat Website Utama</span>
          </button>

          <div className="h-4 w-px bg-slate-800 hidden sm:block" />

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-bold text-white leading-tight">
                {currentUser.full_name || currentUser.username}
              </span>
              <span className="text-[10px] text-slate-400 capitalize">{currentUser.role}</span>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 rounded-lg bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors cursor-pointer"
              title="Logout Sesi Admin"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout Body */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* Sidebar Navigation */}
        <aside className={`fixed md:sticky top-[61px] inset-y-0 left-0 z-30 w-64 bg-slate-950/95 md:bg-transparent backdrop-blur-xl md:backdrop-blur-none border-r border-slate-800/80 p-4 shrink-0 transition-transform duration-200 md:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } h-[calc(100vh-61px)] flex flex-col justify-between overflow-y-auto`}>
          <div className="space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-2">
              Menu Manajemen
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    active
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                      : item.isHighlight
                      ? 'bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${active ? 'text-slate-950' : item.isHighlight ? 'text-amber-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {active && <ChevronRight className="w-3.5 h-3.5" />}
                </button>
              );
            })}
          </div>

          {/* Quick System Indicator */}
          <div className="pt-4 border-t border-slate-800/80 space-y-2">
            <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Backend API Siap</span>
              </div>
              <div className="text-[10px] text-slate-400">
                Mode: Hostinger MySQL Production
              </div>
            </div>
          </div>
        </aside>

        {/* Tab Content Renderer */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {activeTab === 'overview' && (
            <OverviewTab onNavigateTab={(tab) => setActiveTab(tab)} onToast={showToast} />
          )}
          {activeTab === 'products' && (
            <ProductsTab onToast={showToast} />
          )}
          {activeTab === 'bookings' && (
            <BookingsTab onToast={showToast} />
          )}
          {activeTab === 'blogs' && (
            <BlogsTab onToast={showToast} />
          )}
          {activeTab === 'gallery' && (
            <GalleryTab onToast={showToast} />
          )}
          {activeTab === 'testimonials' && (
            <TestimonialsTab onToast={showToast} />
          )}
          {activeTab === 'faqs' && (
            <FaqsTab onToast={showToast} />
          )}
          {activeTab === 'company' && (
            <CompanyTab onToast={showToast} />
          )}
          {activeTab === 'database' && (
            <DatabaseTab onToast={showToast} />
          )}
        </main>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  CalendarCheck, 
  FileText, 
  MessageSquareQuote, 
  Database, 
  PlusCircle, 
  RefreshCw, 
  Clock, 
  Phone, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  Snowflake,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { DashboardStats, BookingRecord } from '../../../types';
import { getDashboardStats, getBookings, testDatabaseConnection, updateBookingStatus } from '../../../utils/api';
import { formatCurrency } from '../../../utils/format';

interface OverviewTabProps {
  onNavigateTab: (tabId: string) => void;
  onToast: (msg: string) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ onNavigateTab, onToast }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<BookingRecord[]>([]);
  const [dbStatus, setDbStatus] = useState<{ loading: boolean; connected: boolean; message: string; database?: string; tables?: number }>({
    loading: true,
    connected: false,
    message: 'Memeriksa koneksi database...',
  });
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [sData, bData] = await Promise.all([
        getDashboardStats(),
        getBookings()
      ]);
      setStats(sData);
      setRecentBookings(bData.slice(0, 5));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const checkDb = async () => {
    setDbStatus(prev => ({ ...prev, loading: true }));
    const res = await testDatabaseConnection();
    setDbStatus({
      loading: false,
      connected: res.connected,
      message: res.message,
      database: res.database,
      tables: res.tables_count
    });
  };

  useEffect(() => {
    loadData();
    checkDb();
    const handleSync = () => loadData();
    window.addEventListener('sgc_data_changed', handleSync);
    return () => window.removeEventListener('sgc_data_changed', handleSync);
  }, []);

  const handleStatusChange = async (id: number, newStatus: string) => {
    // Optimistic status update in recent bookings list
    setRecentBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus as any } : b));

    const res = await updateBookingStatus(id, newStatus);
    if (res.success) {
      onToast(`Status pesanan #${id} diubah ke ${newStatus}`);
      await loadData();
    } else {
      onToast('Gagal mengubah status: ' + res.message);
      await loadData();
    }
  };

  const openWhatsAppCustomer = (booking: BookingRecord) => {
    let cleanPhone = booking.phone.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.slice(1);
    }
    const message = encodeURIComponent(
      `Halo Bapak/Ibu ${booking.full_name}, kami dari Sewa Genset Cirebon (SGC) terkait booking dengan kode *${booking.booking_code}* untuk unit *${booking.selected_genset_name || 'Genset'}* pada tanggal *${booking.start_date}* di *${booking.event_location}*. Apakah ada rincian tambahan yang ingin didiskusikan? Terima kasih.`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner: Hostinger MySQL Connection Health */}
      <div className={`p-5 rounded-2xl border transition-all ${
        dbStatus.connected 
          ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
          : 'bg-amber-950/20 border-amber-500/30 text-amber-200'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className={`p-2.5 rounded-xl ${dbStatus.connected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-wide">
                  {dbStatus.connected ? 'Koneksi Database MySQL Hostinger Aktif' : 'Status Koneksi Database Hostinger'}
                </span>
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                  dbStatus.connected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {dbStatus.connected ? 'Connected' : 'Offline / Standby'}
                </span>
              </div>
              <p className="text-xs text-slate-300 dark:text-slate-400 mt-1">
                {dbStatus.message} {dbStatus.database && `(Database: ${dbStatus.database}, ${dbStatus.tables || 0} tabel aktif)`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={checkDb}
              disabled={dbStatus.loading}
              className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-xs font-medium text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${dbStatus.loading ? 'animate-spin' : ''}`} />
              <span>Cek Koneksi</span>
            </button>
            <button
              onClick={() => onNavigateTab('database')}
              className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-amber-500/30"
            >
              <span>Setup Database</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Genset */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4.5 hover:border-slate-700 transition-colors">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-medium text-slate-400">Total Genset</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {stats?.total_genset ?? 0}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">10 kVA - 500 kVA</div>
        </div>

        {/* Total AC */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4.5 hover:border-slate-700 transition-colors">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-medium text-slate-400">AC & Pendingin</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Snowflake className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {stats?.total_ac ?? 0}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Standing 3-5 PK & Misty</div>
        </div>

        {/* Total Booking */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4.5 hover:border-slate-700 transition-colors">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-medium text-slate-400">Total Pesanan</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {stats?.total_bookings ?? 0}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Permintaan sewa masuk</div>
        </div>

        {/* Pending Booking */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4.5 hover:border-amber-500/40 transition-colors relative overflow-hidden">
          <div className="absolute top-0 right-0 w-2 h-2 rounded-bl-lg bg-amber-500" />
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-medium text-amber-400">Perlu Tindakan</span>
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-400 tracking-tight">
            {stats?.pending_bookings ?? 0}
          </div>
          <div className="text-[11px] text-amber-400/80 mt-1">Menunggu konfirmasi</div>
        </div>

        {/* Total Artikel */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4.5 hover:border-slate-700 transition-colors">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-medium text-slate-400">Artikel Blog</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {stats?.total_blogs ?? 0}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">SEO & Edukasi Cirebon</div>
        </div>

        {/* Testimoni */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4.5 hover:border-slate-700 transition-colors">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-medium text-slate-400">Testimoni</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <MessageSquareQuote className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {stats?.total_testimonials ?? 0}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Ulasan klien SGC</div>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1">
          Aksi Cepat:
        </span>
        <button
          onClick={() => onNavigateTab('products')}
          className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-amber-500/10"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Tambah Produk / Genset Baru</span>
        </button>
        <button
          onClick={() => onNavigateTab('bookings')}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-2 transition-all cursor-pointer border border-slate-700"
        >
          <CalendarCheck className="w-4 h-4 text-amber-400" />
          <span>Buka Semua Booking Masuk</span>
        </button>
        <button
          onClick={() => onNavigateTab('blogs')}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-2 transition-all cursor-pointer border border-slate-700"
        >
          <FileText className="w-4 h-4 text-indigo-400" />
          <span>Tulis Artikel Baru</span>
        </button>
        <button
          onClick={() => onNavigateTab('company')}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-2 transition-all cursor-pointer border border-slate-700"
        >
          <Phone className="w-4 h-4 text-emerald-400" />
          <span>Ganti Nomor WhatsApp / Kontak</span>
        </button>
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-amber-500" />
              <span>Pesanan Terbaru yang Masuk</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Data pemesanan real-time dari website yang tersimpan di database MySQL
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('bookings')}
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
          >
            <span>Lihat Semua Pesanan</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentBookings.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-sm">
            Belum ada data pesanan baru di database.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4 font-semibold">Kode / Tgl</th>
                  <th className="py-3 px-4 font-semibold">Nama Pemesan</th>
                  <th className="py-3 px-4 font-semibold">Unit & Durasi</th>
                  <th className="py-3 px-4 font-semibold">Lokasi Acara</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {recentBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-amber-400">{b.booking_code}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{b.start_date}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{b.full_name}</div>
                      <div className="text-[11px] text-slate-400">{b.phone}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-200">{b.selected_genset_name || 'Unit Genset'}</div>
                      <div className="text-[11px] text-slate-400">{b.duration} • {b.rental_type}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 text-slate-300 truncate max-w-[200px]" title={b.event_location}>
                        <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>{b.district_cirebon}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[200px]">{b.event_location}</div>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={b.status}
                        onChange={(e) => handleStatusChange(b.id, e.target.value)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                          b.status === 'Menunggu Konfirmasi'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : b.status === 'Dikonfirmasi'
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                            : b.status === 'Sedang Berjalan'
                            ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                            : b.status === 'Selesai'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        }`}
                      >
                        <option value="Menunggu Konfirmasi" className="bg-slate-900 text-amber-400">Menunggu</option>
                        <option value="Dikonfirmasi" className="bg-slate-900 text-blue-400">Dikonfirmasi</option>
                        <option value="Sedang Berjalan" className="bg-slate-900 text-purple-400">Berjalan</option>
                        <option value="Selesai" className="bg-slate-900 text-emerald-400">Selesai</option>
                        <option value="Dibatalkan" className="bg-slate-900 text-rose-400">Dibatalkan</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => openWhatsAppCustomer(b)}
                        className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors cursor-pointer inline-flex items-center gap-1 text-xs"
                        title="Chat Pelanggan di WhatsApp"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">WhatsApp</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

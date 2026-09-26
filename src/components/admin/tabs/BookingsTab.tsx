import React, { useState, useEffect } from 'react';
import { 
  CalendarCheck, 
  Search, 
  Filter, 
  Phone, 
  MapPin, 
  Calendar, 
  Clock, 
  Zap, 
  User, 
  Building, 
  FileText, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  RotateCcw,
  ExternalLink,
  MessageCircle,
  Eye,
  X
} from 'lucide-react';
import { BookingRecord, BookingStatus } from '../../../types';
import { getBookings, updateBookingStatus, deleteBooking } from '../../../utils/api';

interface BookingsTabProps {
  onToast: (msg: string) => void;
}

export const BookingsTab: React.FC<BookingsTabProps> = ({ onToast }) => {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getBookings();
      setBookings(data);
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

  const handleStatusChange = async (id: number, newStatus: string) => {
    // 1. UPDATE INSTAN DI STATE LOKAL
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus as BookingStatus } : b));
    if (selectedBooking && selectedBooking.id === id) {
      setSelectedBooking(prev => prev ? { ...prev, status: newStatus as BookingStatus } : null);
    }

    const res = await updateBookingStatus(id, newStatus);
    if (res.success) {
      onToast(`Status booking #${id} diubah ke "${newStatus}"`);
    } else {
      onToast('Gagal update status: ' + res.message);
    }
    await loadData();
  };

  const handleDelete = async (id: number) => {
    // 1. HAPUS INSTAN DI STATE LOKAL
    setBookings(prev => prev.filter(b => b.id !== id));
    setDeleteConfirmId(null);
    if (selectedBooking?.id === id) setSelectedBooking(null);

    const res = await deleteBooking(id);
    if (res.success) {
      onToast('Data booking berhasil dihapus.');
    } else {
      onToast('Gagal menghapus: ' + res.message);
    }
    await loadData();
  };

  const openWhatsApp = (b: BookingRecord) => {
    let clean = b.phone.replace(/[^0-9]/g, '');
    if (clean.startsWith('0')) clean = '62' + clean.slice(1);
    
    const text = encodeURIComponent(
      `Halo Bapak/Ibu *${b.full_name}*,\n\nKami dari *Sewa Genset Cirebon (SGC)* menindaklanjuti permintaan sewa genset Anda dengan kode booking: *${b.booking_code}*.\n\n*Rincian Pesanan:*\n• Unit: ${b.selected_genset_name || 'Unit Genset'}\n• Tanggal: ${b.start_date} (${b.start_time})\n• Durasi: ${b.duration} (${b.rental_type})\n• Lokasi: ${b.event_location} (${b.district_cirebon})\n• Paket: ${b.package_type}\n\nUnit kami saat ini SIAP dan TERSEDIA. Apakah jadwal dan lokasi tersebut sudah sesuai untuk penerbitan invoice resmi? Terima kasih.`
    );
    window.open(`https://wa.me/${clean}?text=${text}`, '_blank');
  };

  const filtered = bookings.filter(b => {
    const matchStatus = selectedStatus === 'all' || b.status === selectedStatus;
    const q = searchQuery.toLowerCase();
    const matchSearch = b.full_name.toLowerCase().includes(q) ||
                        b.booking_code.toLowerCase().includes(q) ||
                        b.phone.includes(q) ||
                        (b.company_or_event && b.company_or_event.toLowerCase().includes(q)) ||
                        b.district_cirebon.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const pendingCount = bookings.filter(b => b.status === 'Menunggu Konfirmasi').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-amber-500" />
            <span>Manajemen Pesanan & Inquiry Masuk</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Daftar formulir sewa yang dikirimkan oleh calon pelanggan dari website
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
        </div>
      </div>

      {/* Filter Status Tabs & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'Semua Status', count: bookings.length },
            { id: 'Menunggu Konfirmasi', label: 'Menunggu', count: pendingCount, isAlert: true },
            { id: 'Dikonfirmasi', label: 'Dikonfirmasi' },
            { id: 'Sedang Berjalan', label: 'Berjalan' },
            { id: 'Selesai', label: 'Selesai' },
            { id: 'Dibatalkan', label: 'Batal' },
          ].map(tab => {
            const active = selectedStatus === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedStatus(tab.id)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                  active
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    active ? 'bg-slate-950 text-amber-400' : (tab.isAlert && tab.count > 0 ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-400')
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama, kode, nomor HP..."
            className="w-full bg-slate-900/60 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-slate-400 flex flex-col items-center gap-3">
            <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs">Memuat data pemesanan dari database...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-xs">
            Tidak ada data pesanan yang sesuai dengan filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4 font-semibold">Kode Booking</th>
                  <th className="py-3 px-4 font-semibold">Nama & Kontak</th>
                  <th className="py-3 px-4 font-semibold">Unit & Durasi</th>
                  <th className="py-3 px-4 font-semibold">Jadwal & Lokasi</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filtered.map(b => (
                  <tr key={b.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-amber-400">{b.booking_code}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">#{b.id}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white text-sm">{b.full_name}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-slate-500" />
                        <span>{b.phone}</span>
                      </div>
                      {b.company_or_event && (
                        <div className="text-[10px] text-slate-500 truncate max-w-[180px] mt-0.5">
                          {b.company_or_event}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-200">{b.selected_genset_name || 'Unit Genset'}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Qty: {b.unit_quantity} unit {b.ac_quantity ? `+ ${b.ac_quantity} AC` : ''}
                      </div>
                      <div className="text-[10px] text-slate-500">{b.duration} ({b.rental_type})</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 font-medium text-slate-200">
                        <Calendar className="w-3 h-3 text-amber-500" />
                        <span>{b.start_date}</span>
                        <span className="text-slate-500">({b.start_time})</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1 truncate max-w-[200px]" title={b.event_location}>
                        <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                        <span>{b.district_cirebon}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
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
                        <option value="Sedang Berjalan" className="bg-slate-900 text-purple-400">Sedang Berjalan</option>
                        <option value="Selesai" className="bg-slate-900 text-emerald-400">Selesai</option>
                        <option value="Dibatalkan" className="bg-slate-900 text-rose-400">Dibatalkan</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => openWhatsApp(b)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors cursor-pointer inline-flex items-center gap-1"
                          title="Chat Pelanggan di WhatsApp"
                        >
                          <Phone className="w-3 h-3" />
                          <span>WhatsApp</span>
                        </button>
                        <button
                          onClick={() => setSelectedBooking(b)}
                          className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
                          title="Lihat Detail Lengkap"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(b.id)}
                          className="p-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors cursor-pointer"
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

      {/* Booking Details Drawer / Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col text-left shadow-2xl relative my-auto overflow-hidden">
            <div className="flex justify-between items-start px-6 py-4 border-b border-slate-800 shrink-0 bg-slate-900">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {selectedBooking.booking_code}
                </span>
                <h3 className="text-base font-bold text-white mt-1.5">{selectedBooking.full_name}</h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-3.5 text-xs overscroll-contain">
              <div className="grid grid-cols-2 gap-3 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Nomor WhatsApp</span>
                  <span className="text-white font-medium">{selectedBooking.phone}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Perusahaan / Acara</span>
                  <span className="text-white font-medium">{selectedBooking.company_or_event || '-'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Unit Genset</span>
                  <span className="text-amber-400 font-bold">{selectedBooking.selected_genset_name}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Jumlah Unit</span>
                  <span className="text-white font-medium">
                    {selectedBooking.unit_quantity} unit {selectedBooking.ac_quantity ? `+ ${selectedBooking.ac_quantity} AC` : ''}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Jadwal & Durasi</span>
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                  <div className="text-slate-200">Tanggal: <strong>{selectedBooking.start_date}</strong> (Pukul {selectedBooking.start_time})</div>
                  <div className="text-slate-400 mt-0.5">Durasi: {selectedBooking.duration} ({selectedBooking.rental_type})</div>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Alamat Acara & Kecamatan</span>
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                  <div className="text-slate-200 font-medium">{selectedBooking.event_location}</div>
                  <div className="text-amber-400 mt-0.5">Kecamatan: {selectedBooking.district_cirebon}</div>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Paket & Kebutuhan Tambahan</span>
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                  <div className="text-slate-200 font-semibold">{selectedBooking.package_type}</div>
                  {selectedBooking.additional_needs && selectedBooking.additional_needs.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {selectedBooking.additional_needs.map((item, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">
                          • {item}
                        </span>
                      ))}
                    </div>
                  )}
                  {selectedBooking.notes && (
                    <div className="mt-2 text-slate-400 italic border-t border-slate-800 pt-1.5">
                      Catatan: "{selectedBooking.notes}"
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-800 bg-slate-900/90 backdrop-blur-sm shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-xs">Ubah Status:</span>
                <select
                  value={selectedBooking.status}
                  onChange={(e) => handleStatusChange(selectedBooking.id, e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-xs text-white rounded-lg px-2.5 py-1.5 focus:outline-none"
                >
                  <option value="Menunggu Konfirmasi">Menunggu Konfirmasi</option>
                  <option value="Dikonfirmasi">Dikonfirmasi</option>
                  <option value="Sedang Berjalan">Sedang Berjalan</option>
                  <option value="Selesai">Selesai</option>
                  <option value="Dibatalkan">Dibatalkan</option>
                </select>
              </div>

              <button
                onClick={() => openWhatsApp(selectedBooking)}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Chat WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full text-center my-auto shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2">Hapus Data Booking?</h3>
            <p className="text-xs text-slate-400 mb-6">
              Data pemesanan ini akan dihapus dari database. Tindakan ini tidak dapat dibatalkan.
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

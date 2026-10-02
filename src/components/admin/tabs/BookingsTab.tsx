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
  X,
  Edit,
  Plus,
  Save,
  Wind,
  ChevronDown
} from 'lucide-react';
import { BookingRecord, BookingStatus } from '../../../types';
import { 
  getBookings, 
  updateBookingStatus, 
  updateBooking, 
  deleteBooking, 
  submitBooking 
} from '../../../utils/api';
import { 
  GENSET_MANUAL_OPTIONS, 
  AC_MANUAL_OPTIONS, 
  RENTAL_DURATIONS, 
  matchGensetOption, 
  matchAcOption 
} from '../../../data/rentalOptions';
import { formatDateIndonesian } from '../../../utils/format';

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

  // Edit / Add modal state
  const [editingBooking, setEditingBooking] = useState<Partial<BookingRecord> | null>(null);
  const [isNewBooking, setIsNewBooking] = useState(false);
  const [savingBooking, setSavingBooking] = useState(false);

  useEffect(() => {
    if (selectedBooking || deleteConfirmId || editingBooking) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedBooking, deleteConfirmId, editingBooking]);

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
    // Update instan di state lokal
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

  const handleOpenEditModal = (b: BookingRecord) => {
    const gensetOpt = matchGensetOption(b.selected_genset_name);
    const acOpt = matchAcOption(b.selected_ac_name);
    const hasGenset = gensetOpt !== 'Tanpa Genset';
    const hasAc = acOpt !== 'Tanpa AC / Pendingin';

    setEditingBooking({
      ...b,
      selected_genset_name: gensetOpt,
      genset_quantity: b.genset_quantity !== undefined ? b.genset_quantity : (hasGenset ? 1 : 0),
      genset_duration: b.genset_duration || '1 Hari (12 Jam Operasional)',
      selected_ac_name: acOpt,
      ac_quantity: b.ac_quantity !== undefined ? b.ac_quantity : (hasAc ? 1 : 0),
      ac_duration: b.ac_duration || '1 Hari (12 Jam Operasional)',
    });
    setIsNewBooking(false);
  };

  const handleOpenAddModal = () => {
    setEditingBooking({
      full_name: '',
      phone: '',
      company_or_event: '',
      selected_genset_name: 'Tanpa Genset',
      selected_genset_id: '',
      genset_quantity: 0,
      genset_duration: '1 Hari (12 Jam Operasional)',
      selected_ac_name: 'Tanpa AC / Pendingin',
      selected_ac_id: '',
      ac_quantity: 0,
      ac_duration: '1 Hari (12 Jam Operasional)',
      start_date: new Date().toISOString().split('T')[0],
      start_time: '08:00',
      event_location: '',
      notes: '',
      status: 'Menunggu Konfirmasi'
    });
    setIsNewBooking(true);
  };

  const handleSaveBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBooking) return;

    if (!editingBooking.full_name?.trim()) {
      onToast('Nama pemesan / PIC wajib diisi.');
      return;
    }
    if (!editingBooking.phone?.trim()) {
      onToast('Nomor WhatsApp wajib diisi.');
      return;
    }

    const hasGenset = (editingBooking.genset_quantity || 0) > 0 && 
                      editingBooking.selected_genset_name && 
                      !editingBooking.selected_genset_name.toLowerCase().includes('tanpa');

    const hasAc = (editingBooking.ac_quantity || 0) > 0 && 
                  editingBooking.selected_ac_name && 
                  !editingBooking.selected_ac_name.toLowerCase().includes('tanpa');

    if (!hasGenset && !hasAc) {
      onToast('Pilih minimal 1 unit Genset atau AC untuk disewa.');
      return;
    }

    if (!editingBooking.event_location?.trim()) {
      onToast('Alamat / lokasi acara wajib diisi.');
      return;
    }

    setSavingBooking(true);
    try {
      const gName = editingBooking.selected_genset_name || 'Tanpa Genset';
      const aName = editingBooking.selected_ac_name || 'Tanpa AC / Pendingin';
      const gId = gName === 'Tanpa Genset' ? '' : `genset-${gName.toLowerCase().replace(/\s+/g, '')}`;
      const aId = aName === 'Tanpa AC / Pendingin' ? '' : 'ac-standing-5pk';

      if (isNewBooking) {
        const payload: any = {
          fullName: editingBooking.full_name,
          phone: editingBooking.phone,
          companyOrEvent: editingBooking.company_or_event || '',
          selectedGensetName: gName,
          selectedGensetId: gId,
          gensetQuantity: hasGenset ? (editingBooking.genset_quantity || 1) : 0,
          gensetDuration: editingBooking.genset_duration || '1 Hari (12 Jam Operasional)',
          selectedAcName: aName,
          selectedAcId: aId,
          acQuantity: hasAc ? (editingBooking.ac_quantity || 1) : 0,
          acDuration: editingBooking.ac_duration || '1 Hari (12 Jam Operasional)',
          startDate: editingBooking.start_date || new Date().toISOString().split('T')[0],
          startTime: editingBooking.start_time || '08:00',
          eventLocation: editingBooking.event_location,
          notes: editingBooking.notes || '',
          status: editingBooking.status || 'Menunggu Konfirmasi'
        };

        const res = await submitBooking(payload);
        if (res.success !== false) {
          onToast('Pesanan baru berhasil dicatat ke database!');
          setEditingBooking(null);
          await loadData();
        } else {
          onToast('Gagal menambah pesanan: ' + res.message);
        }
      } else if (editingBooking.id) {
        const payload: any = {
          full_name: editingBooking.full_name,
          phone: editingBooking.phone,
          company_or_event: editingBooking.company_or_event || '',
          selected_genset_name: gName,
          selected_genset_id: gId,
          genset_quantity: hasGenset ? (editingBooking.genset_quantity || 1) : 0,
          genset_duration: editingBooking.genset_duration || '1 Hari (12 Jam Operasional)',
          selected_ac_name: aName,
          selected_ac_id: aId,
          ac_quantity: hasAc ? (editingBooking.ac_quantity || 1) : 0,
          ac_duration: editingBooking.ac_duration || '1 Hari (12 Jam Operasional)',
          start_date: editingBooking.start_date,
          start_time: editingBooking.start_time,
          event_location: editingBooking.event_location,
          notes: editingBooking.notes || '',
          status: editingBooking.status
        };

        const res = await updateBooking(editingBooking.id, payload);
        if (res.success !== false) {
          onToast('Perubahan data pesanan berhasil disimpan!');
          setEditingBooking(null);
          if (selectedBooking?.id === editingBooking.id) {
            setSelectedBooking({ ...selectedBooking, ...payload });
          }
          await loadData();
        } else {
          onToast('Gagal menyimpan perubahan: ' + res.message);
        }
      }
    } catch (err: any) {
      onToast('Terjadi kesalahan: ' + err.message);
    } finally {
      setSavingBooking(false);
    }
  };

  const openWhatsApp = (b: BookingRecord) => {
    let clean = b.phone.replace(/[^0-9]/g, '');
    if (clean.startsWith('0')) clean = '62' + clean.slice(1);

    const hasGenset = (b.genset_quantity && b.genset_quantity > 0) || (b.selected_genset_name && !b.selected_genset_name.toLowerCase().includes('tanpa'));
    const hasAc = (b.ac_quantity && b.ac_quantity > 0) || (b.selected_ac_name && !b.selected_ac_name.toLowerCase().includes('tanpa'));

    const unitLines: string[] = [];
    if (hasGenset) {
      unitLines.push(`• Genset: ${b.selected_genset_name || 'Unit Genset'} (${b.genset_quantity || b.unit_quantity} Unit - ${b.genset_duration || b.duration || '1 Hari'})`);
    }
    if (hasAc) {
      unitLines.push(`• AC: ${b.selected_ac_name || 'Unit AC'} (${b.ac_quantity} Unit - ${b.ac_duration || b.duration || '1 Hari'})`);
    }
    if (unitLines.length === 0) {
      unitLines.push(`• Unit: ${b.selected_genset_name || 'Unit Sewa'} (${b.unit_quantity} Unit - ${b.duration || '1 Hari'})`);
    }
    
    const text = encodeURIComponent(
      `Halo Bapak/Ibu *${b.full_name}*,\n\nKami dari *Sewa Genset Cirebon (SGC)* menindaklanjuti permintaan sewa Anda dengan kode booking: *${b.booking_code}*.\n\n*Rincian Pesanan:*\n${unitLines.join('\n')}\n• Jadwal: ${formatDateIndonesian(b.start_date)} (${b.start_time})\n• Lokasi: ${b.event_location}\n${b.notes ? `• Catatan: "${b.notes}"\n` : ''}\nUnit kami saat ini SIAP dan TERSEDIA. Apakah jadwal dan lokasi tersebut sudah sesuai untuk penerbitan invoice resmi? Terima kasih.`
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
                        (b.selected_genset_name && b.selected_genset_name.toLowerCase().includes(q)) ||
                        (b.selected_ac_name && b.selected_ac_name.toLowerCase().includes(q)) ||
                        (b.event_location && b.event_location.toLowerCase().includes(q));
    return matchStatus && matchSearch;
  });

  const pendingCount = bookings.filter(b => b.status === 'Menunggu Konfirmasi').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 p-5 rounded-2xl">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-amber-500" />
            <span>Manajemen Pesanan &amp; Inquiry Masuk</span>
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Daftar formulir sewa masuk dengan pilihan unit genset &amp; AC mandiri
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenAddModal}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Pesanan</span>
          </button>

          <button
            onClick={loadData}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer"
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
                    : 'bg-white/60 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    active ? 'bg-slate-50 dark:bg-slate-950 text-amber-600 dark:text-amber-400' : (tab.isAlert && tab.count > 0 ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400')
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
            placeholder="Cari nama, kode, unit, lokasi..."
            className="w-full bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-slate-500 dark:text-slate-400 flex flex-col items-center gap-3">
            <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs">Memuat data pemesanan dari database...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-xs">
            Tidak ada data pesanan yang sesuai dengan filter.
          </div>
        ) : (
          <div className="overflow-x-auto pb-4">
            <table className="w-full text-left text-xs min-w-[900px] whitespace-nowrap">
              <thead className="bg-white dark:bg-slate-950/80 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4 font-semibold">Kode Booking</th>
                  <th className="py-3 px-4 font-semibold">Nama &amp; Kontak</th>
                  <th className="py-3 px-4 font-semibold">Pilihan Unit &amp; Durasi</th>
                  <th className="py-3 px-4 font-semibold">Jadwal &amp; Lokasi</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-slate-600 dark:text-slate-300">
                {filtered.map(b => {
                  const hasGenset = (b.genset_quantity && b.genset_quantity > 0) || (b.selected_genset_name && !b.selected_genset_name.toLowerCase().includes('tanpa'));
                  const hasAc = (b.ac_quantity && b.ac_quantity > 0) || (b.selected_ac_name && !b.selected_ac_name.toLowerCase().includes('tanpa'));

                  return (
                    <tr key={b.id} className="hover:bg-slate-100/80 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-amber-600 dark:text-amber-400">{b.booking_code}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">#{b.id}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 dark:text-white text-sm">{b.full_name}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{b.phone}</span>
                        </div>
                        {b.company_or_event && (
                          <div className="text-[10px] text-slate-500 truncate max-w-[180px] mt-0.5">
                            {b.company_or_event}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          {hasGenset && (
                            <div className="flex items-center gap-1.5">
                              <span className="text-amber-500 font-bold text-xs">⚡</span>
                              <span className="font-semibold text-slate-800 dark:text-slate-200">{b.selected_genset_name}</span>
                              <span className="text-[11px] text-slate-400">
                                ({b.genset_quantity || b.unit_quantity} unit{b.genset_duration ? ` • ${b.genset_duration}` : ''})
                              </span>
                            </div>
                          )}
                          {hasAc && (
                            <div className="flex items-center gap-1.5">
                              <span className="text-cyan-500 font-bold text-xs">❄️</span>
                              <span className="font-semibold text-slate-800 dark:text-slate-200">{b.selected_ac_name}</span>
                              <span className="text-[11px] text-slate-400">
                                ({b.ac_quantity} unit{b.ac_duration ? ` • ${b.ac_duration}` : ''})
                              </span>
                            </div>
                          )}
                          {!hasGenset && !hasAc && (
                            <div className="text-slate-500 italic">
                              Tidak ada unit sewa
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-200">
                          <Calendar className="w-3 h-3 text-amber-500" />
                          <span>{formatDateIndonesian(b.start_date)}</span>
                          <span className="text-slate-500">({b.start_time})</span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate max-w-[220px]" title={b.event_location}>
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{b.event_location}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          value={b.status}
                          onChange={(e) => handleStatusChange(b.id, e.target.value)}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                            b.status === 'Menunggu Konfirmasi'
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                              : b.status === 'Dikonfirmasi'
                              ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                              : b.status === 'Sedang Berjalan'
                              ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                              : b.status === 'Selesai'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
                          }`}
                        >
                          <option value="Menunggu Konfirmasi" className="bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400">Menunggu</option>
                          <option value="Dikonfirmasi" className="bg-white dark:bg-slate-900 text-blue-400">Dikonfirmasi</option>
                          <option value="Sedang Berjalan" className="bg-white dark:bg-slate-900 text-purple-400">Sedang Berjalan</option>
                          <option value="Selesai" className="bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400">Selesai</option>
                          <option value="Dibatalkan" className="bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400">Dibatalkan</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => openWhatsApp(b)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 transition-colors cursor-pointer inline-flex items-center gap-1"
                            title="Chat Pelanggan di WhatsApp"
                          >
                            <Phone className="w-3 h-3" />
                            <span>WhatsApp</span>
                          </button>
                          <button
                            onClick={() => setSelectedBooking(b)}
                            className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer"
                            title="Lihat Detail Lengkap"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(b)}
                            className="p-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 transition-colors cursor-pointer"
                            title="Edit Data Pesanan"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(b.id)}
                            className="p-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 transition-colors cursor-pointer"
                            title="Hapus"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Booking Details Drawer / Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-white/20 dark:bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col text-left shadow-2xl relative my-auto overflow-hidden">
            <div className="flex justify-between items-start px-6 py-4 border-b border-slate-200 dark:border-slate-800 shrink-0 bg-white dark:bg-slate-900">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  {selectedBooking.booking_code}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1.5">{selectedBooking.full_name}</h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-3.5 text-xs overscroll-contain">
              {/* Kontak & PIC */}
              <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-950/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Nomor WhatsApp</span>
                  <span className="text-slate-900 dark:text-white font-medium">{selectedBooking.phone}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Perusahaan / Acara</span>
                  <span className="text-slate-900 dark:text-white font-medium">{selectedBooking.company_or_event || '-'}</span>
                </div>
              </div>

              {/* Unit Genset */}
              <div className="p-3 bg-amber-50/50 dark:bg-amber-950/20 rounded-xl border border-amber-200/60 dark:border-amber-900/40 space-y-1">
                <span className="text-amber-700 dark:text-amber-400 block text-[10px] uppercase font-bold flex items-center gap-1">
                  ⚡ Pilihan Unit Genset
                </span>
                <div className="font-bold text-slate-900 dark:text-white text-sm">
                  {selectedBooking.selected_genset_name || 'Tanpa Genset'}
                </div>
                <div className="text-slate-600 dark:text-slate-400 text-xs">
                  Jumlah: <strong>{selectedBooking.genset_quantity !== undefined ? selectedBooking.genset_quantity : selectedBooking.unit_quantity} Unit</strong> • Durasi: <strong>{selectedBooking.genset_duration || selectedBooking.duration || '-'}</strong>
                </div>
              </div>

              {/* Unit AC */}
              <div className="p-3 bg-cyan-50/50 dark:bg-cyan-950/20 rounded-xl border border-cyan-200/60 dark:border-cyan-900/40 space-y-1">
                <span className="text-cyan-700 dark:text-cyan-400 block text-[10px] uppercase font-bold flex items-center gap-1">
                  ❄️ Pilihan Unit AC &amp; Pendingin
                </span>
                <div className="font-bold text-slate-900 dark:text-white text-sm">
                  {selectedBooking.selected_ac_name || 'Tanpa AC / Pendingin'}
                </div>
                <div className="text-slate-600 dark:text-slate-400 text-xs">
                  Jumlah: <strong>{selectedBooking.ac_quantity || 0} Unit</strong> • Durasi: <strong>{selectedBooking.ac_duration || '-'}</strong>
                </div>
              </div>

              {/* Jadwal & Lokasi */}
              <div className="space-y-1.5">
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Jadwal &amp; Lokasi Acara</span>
                <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="text-slate-700 dark:text-slate-200">
                    Tanggal: <strong>{formatDateIndonesian(selectedBooking.start_date)}</strong> (Pukul {selectedBooking.start_time} WIB)
                  </div>
                  <div className="text-slate-700 dark:text-slate-200 pt-1 border-t border-slate-200 dark:border-slate-800">
                    Alamat Lokasi: <strong>{selectedBooking.event_location}</strong>
                  </div>
                </div>
              </div>

              {/* Catatan Tambahan */}
              {selectedBooking.notes && (
                <div className="space-y-1.5">
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Catatan Tambahan</span>
                  <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 italic text-slate-700 dark:text-slate-300">
                    "{selectedBooking.notes}"
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 backdrop-blur-sm shrink-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const b = selectedBooking;
                    setSelectedBooking(null);
                    handleOpenEditModal(b);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit Data</span>
                </button>

                <select
                  value={selectedBooking.status}
                  onChange={(e) => handleStatusChange(selectedBooking.id, e.target.value)}
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white rounded-lg px-2.5 py-1.5 focus:outline-none"
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

      {/* Edit / Add Booking Modal */}
      {editingBooking && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col text-left shadow-2xl relative my-auto overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200 dark:border-slate-800 shrink-0 bg-white dark:bg-slate-900">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-500 flex items-center justify-center">
                  <CalendarCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {isNewBooking ? 'Tambah Pesanan Booking Manual' : `Edit Pesanan #${editingBooking.id}`}
                  </h3>
                  {editingBooking.booking_code && (
                    <span className="text-[11px] font-mono text-amber-600 dark:text-amber-400">
                      {editingBooking.booking_code}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setEditingBooking(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveBooking} className="p-6 overflow-y-auto flex-1 space-y-4 text-xs overscroll-contain">
              
              {/* Data PIC */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-500" />
                  <span>Data Pemesan (PIC)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Nama Lengkap <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={editingBooking.full_name || ''}
                      onChange={(e) => setEditingBooking({ ...editingBooking, full_name: e.target.value })}
                      placeholder="Contoh: Bpk. Bambang"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      No. WhatsApp / HP <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={editingBooking.phone || ''}
                      onChange={(e) => setEditingBooking({ ...editingBooking, phone: e.target.value })}
                      placeholder="Contoh: 081234567890"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Nama Perusahaan / Acara (Opsional)
                    </label>
                    <input
                      type="text"
                      value={editingBooking.company_or_event || ''}
                      onChange={(e) => setEditingBooking({ ...editingBooking, company_or_event: e.target.value })}
                      placeholder="Contoh: Wedding di Gedung Negara / PT Maju"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Unit Genset Section */}
              <div className="p-3.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 space-y-3">
                <div className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Pilihan Unit Genset (Manual)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-1">
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Kapasitas Genset
                    </label>
                    <div className="relative">
                      <select
                        value={editingBooking.selected_genset_name || 'Tanpa Genset'}
                        onChange={(e) => {
                          const val = e.target.value;
                          const isNone = val === 'Tanpa Genset';
                          setEditingBooking({
                            ...editingBooking,
                            selected_genset_name: val,
                            genset_quantity: isNone ? 0 : ((editingBooking.genset_quantity || 0) > 0 ? editingBooking.genset_quantity : 1)
                          });
                        }}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none appearance-none pr-8 cursor-pointer"
                      >
                        {GENSET_MANUAL_OPTIONS.map((opt) => (
                          <option key={opt} value={opt} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                            {opt}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none text-slate-400">
                        <ChevronDown className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Jumlah Unit
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={editingBooking.genset_quantity !== undefined ? editingBooking.genset_quantity : 0}
                      onChange={(e) => setEditingBooking({ ...editingBooking, genset_quantity: parseInt(e.target.value, 10) || 0 })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Durasi Pemakaian
                    </label>
                    <select
                      value={editingBooking.genset_duration || '1 Hari (12 Jam Operasional)'}
                      onChange={(e) => setEditingBooking({ ...editingBooking, genset_duration: e.target.value })}
                      disabled={editingBooking.selected_genset_name === 'Tanpa Genset' || editingBooking.genset_quantity === 0}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none disabled:opacity-50 cursor-pointer"
                    >
                      {RENTAL_DURATIONS.map((dur, i) => (
                        <option key={i} value={dur}>{dur}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Unit AC Section */}
              <div className="p-3.5 rounded-xl bg-cyan-50/50 dark:bg-cyan-950/20 border border-cyan-200/60 dark:border-cyan-900/40 space-y-3">
                <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-400 flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5" />
                  <span>Pilihan Unit AC &amp; Pendingin (Manual)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-1">
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Tipe Unit AC
                    </label>
                    <div className="relative">
                      <select
                        value={editingBooking.selected_ac_name || 'Tanpa AC / Pendingin'}
                        onChange={(e) => {
                          const val = e.target.value;
                          const isNone = val === 'Tanpa AC / Pendingin';
                          setEditingBooking({
                            ...editingBooking,
                            selected_ac_name: val,
                            ac_quantity: isNone ? 0 : ((editingBooking.ac_quantity || 0) > 0 ? editingBooking.ac_quantity : 1)
                          });
                        }}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none appearance-none pr-8 cursor-pointer"
                      >
                        {AC_MANUAL_OPTIONS.map((opt) => (
                          <option key={opt} value={opt} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                            {opt}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none text-slate-400">
                        <ChevronDown className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Jumlah Unit
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={editingBooking.ac_quantity !== undefined ? editingBooking.ac_quantity : 0}
                      onChange={(e) => setEditingBooking({ ...editingBooking, ac_quantity: parseInt(e.target.value, 10) || 0 })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Durasi Pemakaian
                    </label>
                    <select
                      value={editingBooking.ac_duration || '1 Hari (12 Jam Operasional)'}
                      onChange={(e) => setEditingBooking({ ...editingBooking, ac_duration: e.target.value })}
                      disabled={editingBooking.selected_ac_name === 'Tanpa AC / Pendingin' || editingBooking.ac_quantity === 0}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none disabled:opacity-50 cursor-pointer"
                    >
                      {RENTAL_DURATIONS.map((dur, i) => (
                        <option key={i} value={dur}>{dur}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Jadwal & Lokasi */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  <span>Jadwal &amp; Lokasi Acara</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Tanggal Mulai
                    </label>
                    <input
                      type="date"
                      value={editingBooking.start_date || ''}
                      onChange={(e) => setEditingBooking({ ...editingBooking, start_date: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Jam Mulai (WIB)
                    </label>
                    <input
                      type="text"
                      value={editingBooking.start_time || ''}
                      onChange={(e) => setEditingBooking({ ...editingBooking, start_time: e.target.value })}
                      placeholder="08:00 WIB"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Alamat / Patokan Lokasi Acara <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={editingBooking.event_location || ''}
                      onChange={(e) => setEditingBooking({ ...editingBooking, event_location: e.target.value })}
                      placeholder="Contoh: Jl. Tuparev No. 12, Cirebon"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Status & Catatan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Status Pemesanan
                  </label>
                  <select
                    value={editingBooking.status || 'Menunggu Konfirmasi'}
                    onChange={(e) => setEditingBooking({ ...editingBooking, status: e.target.value as BookingStatus })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none cursor-pointer"
                  >
                    <option value="Menunggu Konfirmasi">Menunggu Konfirmasi</option>
                    <option value="Dikonfirmasi">Dikonfirmasi</option>
                    <option value="Sedang Berjalan">Sedang Berjalan</option>
                    <option value="Selesai">Selesai</option>
                    <option value="Dibatalkan">Dibatalkan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Catatan Tambahan (Opsional)
                  </label>
                  <input
                    type="text"
                    value={editingBooking.notes || ''}
                    onChange={(e) => setEditingBooking({ ...editingBooking, notes: e.target.value })}
                    placeholder="Contoh: Butuh teknisi standby malam..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingBooking(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={savingBooking}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savingBooking ? 'Menyimpan...' : 'Simpan Data'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-sm w-full text-center my-auto shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Hapus Data Booking?</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-6">
              Data pemesanan ini akan dihapus dari database. Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-semibold cursor-pointer"
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

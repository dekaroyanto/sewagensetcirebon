import React, { useState, useEffect, useMemo } from "react";
import {
  HardDrive,
  Trash2,
  RefreshCw,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Search,
  ExternalLink,
  Lock,
  Sparkles,
  FileImage,
  FolderArchive,
  Info,
  CheckSquare,
  Square,
  Eye,
  X,
  Loader2,
} from "lucide-react";
import { MediaFileItem, MediaStorageStats } from "../../../types";
import {
  scanMediaFiles,
  cleanupMediaFiles,
  getImageUrl,
  handleImageError,
} from "../../../utils/api";

interface MediaTabProps {
  onToast: (msg: string, type?: "success" | "error" | "info") => void;
}

export const MediaTab: React.FC<MediaTabProps> = ({ onToast }) => {
  const [loading, setLoading] = useState(true);
  const [cleaning, setCleaning] = useState(false);
  const [stats, setStats] = useState<MediaStorageStats>({
    total_files: 0,
    total_bytes: 0,
    total_formatted: "0 B",
    used_files: 0,
    used_bytes: 0,
    used_formatted: "0 B",
    unused_files: 0,
    unused_bytes: 0,
    unused_formatted: "0 B",
  });
  const [files, setFiles] = useState<MediaFileItem[]>([]);
  const [filterTab, setFilterTab] = useState<"unused" | "all" | "used">(
    "unused",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilenames, setSelectedFilenames] = useState<string[]>([]);

  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    isAllUnused: boolean;
    targets: string[];
    reclaimEstimate: string;
  }>({
    isOpen: false,
    isAllUnused: false,
    targets: [],
    reclaimEstimate: "0 B",
  });

  // Preview full image modal
  const [previewImage, setPreviewImage] = useState<MediaFileItem | null>(null);

  const fetchMediaData = async () => {
    setLoading(true);
    try {
      const res = await scanMediaFiles();
      if (res.status === "success") {
        setStats(res.stats);
        setFiles(res.files);
        // Clear selection on refresh
        setSelectedFilenames([]);
      } else {
        onToast(res.message || "Gagal memindai media server.", "error");
      }
    } catch (err: any) {
      onToast("Gagal memuat status media: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMediaData();
    const handleSync = () => fetchMediaData();
    window.addEventListener("sgc_data_changed", handleSync);
    return () => window.removeEventListener("sgc_data_changed", handleSync);
  }, []);

  // Filtered files based on active tab and search query
  const filteredFiles = useMemo(() => {
    return files.filter((item) => {
      // Tab filter
      if (filterTab === "unused" && item.is_used) return false;
      if (filterTab === "used" && !item.is_used) return false;

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesUsedIn = item.used_in.some((u) =>
          u.toLowerCase().includes(q),
        );
        return matchesName || matchesUsedIn;
      }
      return true;
    });
  }, [files, filterTab, searchQuery]);

  // All currently displayed unused files
  const unusedInFiltered = useMemo(() => {
    return filteredFiles.filter((f) => !f.is_used);
  }, [filteredFiles]);

  const handleSelectToggle = (filename: string) => {
    setSelectedFilenames((prev) =>
      prev.includes(filename)
        ? prev.filter((f) => f !== filename)
        : [...prev, filename],
    );
  };

  const handleSelectAllToggle = () => {
    const selectableFilenames = unusedInFiltered.map((f) => f.name);
    const allSelected = selectableFilenames.every((fn) =>
      selectedFilenames.includes(fn),
    );

    if (allSelected) {
      // Unselect all in current view
      setSelectedFilenames((prev) =>
        prev.filter((fn) => !selectableFilenames.includes(fn)),
      );
    } else {
      // Add all in current view
      const newSelection = Array.from(
        new Set([...selectedFilenames, ...selectableFilenames]),
      );
      setSelectedFilenames(newSelection);
    }
  };

  const openDeleteSingleModal = (file: MediaFileItem) => {
    setConfirmModal({
      isOpen: true,
      isAllUnused: false,
      targets: [file.name],
      reclaimEstimate: file.size_formatted,
    });
  };

  const openDeleteSelectedModal = () => {
    if (selectedFilenames.length === 0) return;
    const totalBytes = files
      .filter((f) => selectedFilenames.includes(f.name))
      .reduce((acc, curr) => acc + curr.size, 0);

    const formatted =
      totalBytes > 1024 * 1024
        ? `${(totalBytes / (1024 * 1024)).toFixed(2)} MB`
        : `${(totalBytes / 1024).toFixed(1)} KB`;

    setConfirmModal({
      isOpen: true,
      isAllUnused: false,
      targets: selectedFilenames,
      reclaimEstimate: formatted,
    });
  };

  const openDeleteAllUnusedModal = () => {
    if (stats.unused_files === 0) {
      onToast("Tidak ada gambar tak terpakai untuk dibersihkan.", "info");
      return;
    }
    const allUnusedNames = files.filter((f) => !f.is_used).map((f) => f.name);
    setConfirmModal({
      isOpen: true,
      isAllUnused: true,
      targets: allUnusedNames,
      reclaimEstimate: stats.unused_formatted,
    });
  };

  const handleExecuteCleanup = async () => {
    setCleaning(true);
    try {
      const res = await cleanupMediaFiles({
        allUnused: confirmModal.isAllUnused,
        filenames: confirmModal.isAllUnused ? undefined : confirmModal.targets,
      });

      if (res.status === "success") {
        onToast(res.message, "success");
        setConfirmModal({
          isOpen: false,
          isAllUnused: false,
          targets: [],
          reclaimEstimate: "0 B",
        });
        setSelectedFilenames([]);
        await fetchMediaData();
      } else {
        onToast(res.message || "Gagal membersihkan file.", "error");
      }
    } catch (err: any) {
      onToast("Terjadi kesalahan: " + err.message, "error");
    } finally {
      setCleaning(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 p-6 rounded-3xl backdrop-blur-md shadow-xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <HardDrive className="w-6 h-6 text-amber-500" />
            <span>Pembersih Gambar & Penyimpanan Server</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Pindai seluruh folder, deteksi gambar sampah yang tidak lagi dipakai
            di database produk, artikel, atau galeri, lalu bersihkan secara aman
            dalam 1 klik.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={fetchMediaData}
            disabled={loading || cleaning}
            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white text-xs font-bold flex items-center gap-2 border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer disabled:opacity-50"
            title="Scan ulang seluruh file di server"
          >
            <RefreshCw
              className={`w-4 h-4 ${
                loading ? "animate-spin text-amber-600 dark:text-amber-400" : ""
              }`}
            />
            <span>Scan Server Sekarang</span>
          </button>

          <button
            onClick={openDeleteAllUnusedModal}
            disabled={loading || cleaning || stats.unused_files === 0}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4" />
            <span>Bersihkan Semua Gambar Sampah ({stats.unused_files})</span>
          </button>
        </div>
      </div>

      {/* Storage Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Total File */}
        <div className="bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 relative overflow-hidden backdrop-blur-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total File Uploads
            </span>
            <div className="w-9 h-9 rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <FolderArchive className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {stats.total_files}
            </span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              file ({stats.total_formatted})
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Total semua media gambar di folder{" "}
            <code className="text-cyan-600 dark:text-cyan-400">/uploads/</code>
          </p>
        </div>

        {/* Card 2: Used Files (Protected) */}
        <div className="bg-emerald-950/10 border border-emerald-500/30 rounded-2xl p-5 relative overflow-hidden backdrop-blur-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
              Aktif Digunakan (Aman)
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-700 dark:text-emerald-300">
              {stats.used_files}
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              file ({stats.used_formatted})
            </span>
          </div>
          <p className="text-[11px] text-emerald-700/80 dark:text-emerald-400/80 mt-1">
            Tertaut di produk, artikel, atau galeri aktif (terkunci dari hapus)
          </p>
        </div>

        {/* Card 3: Unused Files (Reclaimable) */}
        <div
          className={`border rounded-2xl p-5 relative overflow-hidden backdrop-blur-xs transition-all ${
            stats.unused_files > 0
              ? "bg-amber-950/15 border-amber-500/40 text-amber-950 dark:text-amber-100"
              : "bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
              Gambar Tak Terpakai
            </span>
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                stats.unused_files > 0
                  ? "bg-amber-500/20 text-amber-600 dark:text-amber-400 animate-pulse"
                  : "bg-slate-200 dark:bg-slate-800 text-slate-500"
              }`}
            >
              <Trash2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-700 dark:text-amber-300">
              {stats.unused_files}
            </span>
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
              file ({stats.unused_formatted})
            </span>
          </div>
          <p className="text-[11px] text-amber-700/80 dark:text-amber-400/80 mt-1">
            {stats.unused_files > 0
              ? `Dapat menghemat hingga ${stats.unused_formatted} ruang penyimpanan server`
              : "Server bersih! Tidak ada file sampah yang terbuang"}
          </p>
        </div>
      </div>

      {/* Safety Info Alert */}
      <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-900 dark:text-sky-200 flex items-start gap-3 text-xs leading-relaxed">
        <Info className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold block text-sm text-sky-950 dark:text-sky-100">
            Sistem Proteksi Otomatis Anti-Salah Hapus
          </span>
          <p className="text-sky-800 dark:text-sky-300">
            Sistem secara ketat mengecek database MySQL sebelum menghapus file.
            Gambar yang sedang dipakai oleh <strong>Produk Genset & AC</strong>,{" "}
            <strong>Artikel Blog</strong>, atau{" "}
            <strong>Galeri Portofolio</strong> terkunci secara permanen dan
            tidak akan pernah terhapus.
          </p>
        </div>
      </div>

      {/* Filter and Bulk Action Bar */}
      <div className="bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 backdrop-blur-xs">
        {/* Tab Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 overflow-x-auto">
          <button
            onClick={() => setFilterTab("unused")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
              filterTab === "unused"
                ? "bg-amber-500 text-slate-950 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <span>Tak Terpakai (Sampah)</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                filterTab === "unused"
                  ? "bg-black/20 text-slate-950"
                  : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
              }`}
            >
              {stats.unused_files}
            </span>
          </button>

          <button
            onClick={() => setFilterTab("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
              filterTab === "all"
                ? "bg-amber-500 text-slate-950 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <span>Semua File</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                filterTab === "all"
                  ? "bg-black/20 text-slate-950"
                  : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
              }`}
            >
              {stats.total_files}
            </span>
          </button>

          <button
            onClick={() => setFilterTab("used")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
              filterTab === "used"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <span>Aktif Digunakan</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                filterTab === "used"
                  ? "bg-white/20 text-white"
                  : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
              }`}
            >
              {stats.used_files}
            </span>
          </button>
        </div>

        {/* Search & Bulk Selection Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama file..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-amber-500 transition-colors"
            />
          </div>

          {filterTab !== "used" && unusedInFiltered.length > 0 && (
            <button
              onClick={handleSelectAllToggle}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-semibold flex items-center gap-1.5 border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer"
            >
              {unusedInFiltered.every((f) =>
                selectedFilenames.includes(f.name),
              ) ? (
                <>
                  <CheckSquare className="w-3.5 h-3.5 text-amber-500" />
                  <span>Batal Pilih Semua</span>
                </>
              ) : (
                <>
                  <Square className="w-3.5 h-3.5" />
                  <span>Pilih Semua Sampah</span>
                </>
              )}
            </button>
          )}

          {selectedFilenames.length > 0 && (
            <button
              onClick={openDeleteSelectedModal}
              disabled={cleaning}
              className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-rose-600/20 transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus ({selectedFilenames.length}) Terpilih</span>
            </button>
          )}
        </div>
      </div>

      {/* Files Grid */}
      {loading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Sedang memindai direktori /uploads/ dan mencocokkan dengan
            database...
          </span>
        </div>
      ) : filteredFiles.length === 0 ? (
        <div className="py-16 text-center bg-white/40 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-8 flex flex-col items-center justify-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="font-black text-base text-slate-900 dark:text-white">
            {filterTab === "unused"
              ? "Tidak Ada Gambar Sampah yang Ditemukan!"
              : "Tidak ada file yang sesuai kriteria pencarian"}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md">
            {filterTab === "unused"
              ? "Seluruh gambar di folder uploads server Anda saat ini digunakan aktif oleh produk, artikel, atau galeri."
              : "Coba ubah kata kunci pencarian atau ganti filter tab di atas."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredFiles.map((file) => {
            const isSelected = selectedFilenames.includes(file.name);
            return (
              <div
                key={file.name}
                className={`group rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between ${
                  file.is_used
                    ? "bg-white/60 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700"
                    : isSelected
                      ? "bg-amber-500/10 border-amber-500 shadow-md shadow-amber-500/10"
                      : "bg-white/80 dark:bg-slate-900/80 border-amber-500/30 hover:border-amber-500/60"
                }`}
              >
                {/* Thumbnail Preview Area */}
                <div className="relative aspect-video bg-slate-100 dark:bg-slate-950 overflow-hidden border-b border-slate-200/80 dark:border-slate-800/80">
                  <img
                    src={getImageUrl(file.url)}
                    alt={file.name}
                    loading="lazy"
                    onError={(e) => handleImageError(e, "default")}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Top Overlay Badges */}
                  <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
                    {/* Status Badge */}
                    {file.is_used ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/90 text-slate-950 shadow-xs backdrop-blur-xs">
                        <Lock className="w-2.5 h-2.5" />
                        <span>Terkunci</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500 text-slate-950 shadow-xs">
                        <Trash2 className="w-2.5 h-2.5" />
                        <span>Sampah (Tak Dipakai)</span>
                      </span>
                    )}

                    {/* Checkbox for unused files */}
                    {!file.is_used && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectToggle(file.name);
                        }}
                        className="pointer-events-auto p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white cursor-pointer transition-colors backdrop-blur-xs"
                        title={
                          isSelected
                            ? "Batalkan pilihan"
                            : "Pilih file untuk dihapus"
                        }
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-amber-400" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-300" />
                        )}
                      </button>
                    )}
                  </div>

                  {/* Quick Action Overlay (View Full) */}
                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => setPreviewImage(file)}
                      className="p-1.5 rounded-lg bg-black/70 hover:bg-black text-white text-[11px] font-semibold flex items-center gap-1 backdrop-blur-xs cursor-pointer"
                      title="Lihat Pratinjau Penuh"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Card Details Body */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <span
                        className="text-xs font-bold text-slate-900 dark:text-white truncate block max-w-full font-mono"
                        title={file.name}
                      >
                        {file.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {file.size_formatted}
                      </span>
                      <span>•</span>
                      <span>
                        {file.modified ? file.modified.split(" ")[0] : "-"}
                      </span>
                    </div>

                    {/* Usage location list */}
                    {file.is_used && file.used_in.length > 0 ? (
                      <div className="pt-1.5 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block">
                          Digunakan di:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {file.used_in.map((loc, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 truncate max-w-full"
                              title={loc}
                            >
                              {loc}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-[11px] text-amber-700/80 dark:text-amber-400/80 pt-1 leading-snug">
                        Tidak terhubung ke data produk atau artikel mana pun.
                        Aman dihapus untuk membebaskan ruang disk server.
                      </p>
                    )}
                  </div>

                  {/* Bottom Action Button */}
                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between gap-2">
                    <a
                      href={getImageUrl(file.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 flex items-center gap-1 font-medium"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Buka URL</span>
                    </a>

                    {file.is_used ? (
                      <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium cursor-not-allowed">
                        <Lock className="w-3 h-3 text-emerald-500" />
                        <span>Dilindungi</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => openDeleteSingleModal(file)}
                        className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-600 dark:text-rose-400 hover:text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                        title="Hapus file ini sekarang"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Hapus File</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  {confirmModal.isAllUnused
                    ? "Bersihkan Semua Gambar Sampah?"
                    : `Hapus ${confirmModal.targets.length} File Gambar?`}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Tindakan ini akan menghapus file yang dipilih secara permanen
                  dari server Hostinger. File tidak dapat dikembalikan.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 text-xs space-y-1.5">
              <div className="flex justify-between items-center font-bold">
                <span>Total File Dihapus:</span>
                <span className="text-amber-700 dark:text-amber-400">
                  {confirmModal.targets.length} File
                </span>
              </div>
              <div className="flex justify-between items-center font-bold">
                <span>Kapasitas Server Dibebaskan:</span>
                <span className="text-emerald-600 dark:text-emerald-400">
                  +{confirmModal.reclaimEstimate}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-amber-500/20">
                ✓ Sistem memastikan seluruh file yang sedang aktif di produk /
                artikel tetap aman.
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                disabled={cleaning}
                onClick={() =>
                  setConfirmModal({
                    isOpen: false,
                    isAllUnused: false,
                    targets: [],
                    reclaimEstimate: "0 B",
                  })
                }
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Batal
              </button>

              <button
                type="button"
                disabled={cleaning}
                onClick={handleExecuteCleanup}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-rose-600/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {cleaning ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menghapus...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Ya, Hapus Permanen</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-white block truncate max-w-md">
                  {previewImage.name}
                </span>
                <span className="text-[11px] text-slate-400">
                  {previewImage.size_formatted} • {previewImage.modified}
                </span>
              </div>
              <button
                onClick={() => setPreviewImage(null)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-[70vh] flex items-center justify-center bg-black/50 p-4">
              <img
                src={getImageUrl(previewImage.url)}
                alt={previewImage.name}
                className="max-h-[65vh] max-w-full object-contain rounded-xl shadow-lg"
              />
            </div>

            <div className="p-4 bg-slate-950 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                {previewImage.is_used ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" />
                    <span>
                      Aktif Digunakan ({previewImage.used_in.join(", ")})
                    </span>
                  </span>
                ) : (
                  <span className="text-amber-400 font-semibold flex items-center gap-1">
                    <Trash2 className="w-4 h-4" />
                    <span>File Gambar Tak Terpakai (Aman Dihapus)</span>
                  </span>
                )}
              </div>

              <a
                href={getImageUrl(previewImage.url)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold flex items-center gap-1.5 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Buka di Tab Baru</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

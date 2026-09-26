import React, { useState, useEffect } from 'react';
import { 
  Database, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Server, 
  FileCode, 
  Copy, 
  Check, 
  Download, 
  ShieldAlert, 
  PlayCircle,
  ExternalLink,
  Key,
  FolderOpen
} from 'lucide-react';
import { testDatabaseConnection, runDatabaseSetup } from '../../../utils/api';

interface DatabaseTabProps {
  onToast: (msg: string) => void;
}

export const DatabaseTab: React.FC<DatabaseTabProps> = ({ onToast }) => {
  const [dbStatus, setDbStatus] = useState<{
    loading: boolean;
    connected: boolean;
    message: string;
    database?: string;
    tables_count?: number;
    config?: any;
  }>({
    loading: true,
    connected: false,
    message: 'Memeriksa koneksi ke server MySQL Hostinger...',
  });

  const [setupLoading, setSetupLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const checkConnection = async () => {
    setDbStatus(prev => ({ ...prev, loading: true }));
    const res = await testDatabaseConnection();
    setDbStatus({
      loading: false,
      connected: res.connected,
      message: res.message,
      database: res.database,
      tables_count: res.tables_count,
      config: res.config,
    });
  };

  useEffect(() => {
    checkConnection();
  }, []);

  const handleRunSetup = async () => {
    if (!confirm('Apakah Anda yakin ingin menjalankan inisialisasi tabel otomatis? Ini akan membuat seluruh tabel yang belum ada di database MySQL Hostinger.')) {
      return;
    }
    setSetupLoading(true);
    const res = await runDatabaseSetup();
    setSetupLoading(false);
    if (res.success) {
      onToast('Inisialisasi database Hostinger berhasil! ' + res.message);
      checkConnection();
    } else {
      onToast('Gagal inisialisasi: ' + res.message);
    }
  };

  const handleCopyConfigSnippet = () => {
    const snippet = `// File: public/api/config.php (atau public_html/api/config.php di Hostinger)
define('DB_HOST', 'localhost'); // Di Hostinger biasanya localhost
define('DB_NAME', 'u123456789_sgc_db'); // Ganti dengan Nama Database di Hostinger Anda
define('DB_USER', 'u123456789_sgc_user'); // Ganti dengan Username MySQL di Hostinger Anda
define('DB_PASS', 'PasswordDatabaseAnda123!'); // Ganti dengan Password MySQL di Hostinger Anda`;
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    onToast('Contoh konfigurasi disalin ke clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSql = () => {
    window.open('/api/database.sql', '_blank');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-amber-500" />
            <span>Pusat Integrasi Database MySQL Hostinger</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Kelola konfigurasi kredensial phpMyAdmin, verifikasi koneksi live, dan inisialisasi tabel otomatis
          </p>
        </div>

        <button
          onClick={checkConnection}
          disabled={dbStatus.loading}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 border border-slate-700 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${dbStatus.loading ? 'animate-spin text-amber-400' : ''}`} />
          <span>Tes Koneksi Sekarang</span>
        </button>
      </div>

      {/* Connection Status Card */}
      <div className={`p-6 rounded-2xl border transition-all ${
        dbStatus.connected
          ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
          : 'bg-amber-950/20 border-amber-500/40 text-amber-200'
      }`}>
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl shrink-0 ${
            dbStatus.connected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
          }`}>
            {dbStatus.connected ? <CheckCircle2 className="w-7 h-7" /> : <AlertCircle className="w-7 h-7" />}
          </div>

          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-white">
                {dbStatus.connected ? 'Terhubung ke Database MySQL Hostinger' : 'Koneksi Database Belum Terhubung'}
              </h3>
              <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                dbStatus.connected ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
              }`}>
                {dbStatus.connected ? 'Live Connected' : 'Configuration Needed'}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {dbStatus.message}
            </p>

            {dbStatus.connected && (
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-emerald-300">
                <span className="flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5" />
                  Database: <strong>{dbStatus.database}</strong>
                </span>
                <span className="flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5" />
                  Tabel Aktif: <strong>{dbStatus.tables_count || 0} Tabel</strong>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Step-by-Step Guide for Hostinger phpMyAdmin */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 space-y-6">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Key className="w-4 h-4 text-amber-400" />
            <span>Panduan Menghubungkan ke Database Hostinger (3 Langkah Mudah)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Ikuti petunjuk di bawah ini untuk menghubungkan aplikasi dengan database MySQL Hostinger Anda:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Step 1 */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs">
              1
            </div>
            <h4 className="font-bold text-white text-sm">Buat Database di Hostinger</h4>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Buka <strong>hPanel Hostinger</strong> &gt; menu <strong>Databases</strong> &gt; <strong>MySQL Databases</strong>. Buat database baru beserta nama pengguna (user) dan kata sandi (password).
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs">
              2
            </div>
            <h4 className="font-bold text-white text-sm">Isi File config.php</h4>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Buka File Manager di Hostinger, masuk ke folder <code className="text-amber-400">public_html/api/config.php</code>, dan masukkan nama database, user, dan password yang tadi dibuat.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs">
              3
            </div>
            <h4 className="font-bold text-white text-sm">Inisialisasi Tabel & Data</h4>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Klik tombol <strong>"Inisialisasi Database Otomatis"</strong> di bawah, atau buka phpMyAdmin di Hostinger dan import file <code className="text-amber-400">database.sql</code>.
            </p>
          </div>
        </div>

        {/* Code Snippet */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-300">
            <span className="font-semibold flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-cyan-400" />
              <span>Format Isi File: <code className="text-amber-400">public/api/config.php</code></span>
            </span>
            <button
              onClick={handleCopyConfigSnippet}
              className="text-amber-400 hover:text-amber-300 font-semibold cursor-pointer flex items-center gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin' : 'Salin Snippet'}</span>
            </button>
          </div>

          <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
{`<?php
// Ganti dengan kredensial database di hPanel Hostinger Anda:
define('DB_HOST', 'localhost');            // Hostinger MySQL Host
define('DB_NAME', 'u123456789_sgc_db');    // Nama Database Anda di Hostinger
define('DB_USER', 'u123456789_sgc_user');  // Username MySQL Anda di Hostinger
define('DB_PASS', 'PasswordAnda123!');     // Password MySQL Anda di Hostinger
define('DB_PORT', '3306');`}
          </pre>
        </div>
      </div>

      {/* Migration & Setup Actions */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <PlayCircle className="w-4 h-4 text-emerald-400" />
          <span>Aksi Pembuatan Tabel & Impor Data (1-Click)</span>
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Tersedia dua opsi praktis untuk mengisi tabel produk, pemesanan, artikel, testimoni, dan admin di MySQL Hostinger Anda:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Option A: Run automated setup */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
            <span className="font-bold text-white text-xs block">Opsi A: Jalankan Inisialisasi Otomatis</span>
            <p className="text-[11px] text-slate-400">
              Sistem akan menjalankan script PHP di server Hostinger untuk membuat 8 tabel secara langsung dan mengisi data awal.
            </p>
            <button
              onClick={handleRunSetup}
              disabled={setupLoading}
              className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-50"
            >
              {setupLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Mengeksekusi Tabel...</span>
                </>
              ) : (
                <>
                  <PlayCircle className="w-4 h-4" />
                  <span>Inisialisasi Database Otomatis</span>
                </>
              )}
            </button>
          </div>

          {/* Option B: Download database.sql */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
            <span className="font-bold text-white text-xs block">Opsi B: Import Manual via phpMyAdmin</span>
            <p className="text-[11px] text-slate-400">
              Unduh file script SQL lengkap, lalu buka phpMyAdmin di Hostinger Anda dan klik tab "Import" &gt; "Choose File" &gt; "Go".
            </p>
            <button
              onClick={handleDownloadSql}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors border border-slate-700"
            >
              <Download className="w-4 h-4" />
              <span>Unduh File database.sql</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

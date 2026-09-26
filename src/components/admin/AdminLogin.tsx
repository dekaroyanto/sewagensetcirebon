import React, { useState } from 'react';
import { Lock, User, ArrowLeft, ShieldCheck, AlertCircle, Eye, EyeOff, Sparkles } from 'lucide-react';
import { loginAdmin } from '../../utils/api';
import { AdminUser } from '../../types';

interface AdminLoginProps {
  onLoginSuccess: (user: AdminUser) => void;
  onBackToHome: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToHome }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Harap masukkan username dan password.');
      return;
    }

    setLoading(true);
    setError(null);

    const res = await loginAdmin(username, password);
    setLoading(false);

    if (res.success && res.user) {
      onLoginSuccess(res.user);
    } else {
      setError(res.message || 'Login gagal. Periksa username dan password Anda.');
    }
  };

  const handleFillDemo = () => {
    setUsername('admin');
    setPassword('admin123');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-amber-600/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Top Back Navigation */}
      <div className="w-full max-w-md mb-6 flex justify-between items-center z-10">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-amber-400 transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Kembali ke Website Utama</span>
        </button>

        <span className="text-xs px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-amber-400 font-medium">
          SGC Control Center
        </span>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 z-10 relative">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/20 mb-4">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Portal Admin SGC
          </h1>
          <p className="text-sm text-slate-400 mt-1.5">
            Sewa Genset Cirebon • Manajemen Database Hostinger
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-start gap-3 animate-in fade-in duration-200">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="leading-snug">{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Username / Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs text-slate-400 hover:text-amber-400 flex items-center gap-1 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                {showPassword ? 'Sembunyikan' : 'Tampilkan'}
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Memverifikasi Akun...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Masuk ke Dashboard Admin</span>
              </>
            )}
          </button>
        </form>

        {/* Demo Credentials Helper Box */}
        <div className="mt-8 pt-6 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1.5 font-medium text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Akun Default Sistem:
            </span>
            <button
              onClick={handleFillDemo}
              className="text-amber-400 hover:text-amber-300 font-semibold cursor-pointer underline text-[11px]"
            >
              Isi Otomatis
            </button>
          </div>
          <div className="bg-slate-950/60 rounded-lg p-2.5 text-xs font-mono text-slate-400 border border-slate-800 flex justify-between items-center">
            <div>
              <span>User: <strong className="text-white">admin</strong></span>
              <span className="mx-2 text-slate-600">•</span>
              <span>Pass: <strong className="text-white">admin123</strong></span>
            </div>
            <span className="text-[10px] text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">Ready</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 text-center">
            *Dapat diubah di tabel <code className="text-slate-400">admin_users</code> pada phpMyAdmin Hostinger
          </p>
        </div>
      </div>
    </div>
  );
};

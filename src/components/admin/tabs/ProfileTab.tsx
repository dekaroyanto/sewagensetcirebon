import React, { useState } from "react";
import { User, Lock, Save, AlertCircle } from "lucide-react";
import { updateAdminProfile } from "../../../utils/api";
import { AdminUser } from "../../../types";

interface ProfileTabProps {
  user: AdminUser;
  onUpdateUser: (user: AdminUser) => void;
  onToast: (msg: string, type?: "success" | "error" | "info") => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  user,
  onUpdateUser,
  onToast,
}) => {
  const [formData, setFormData] = useState({
    username: user.username || "",
    full_name: user.full_name || "",
    email: user.email || "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      onToast("Konfirmasi password tidak cocok.", "error");
      return;
    }

    setLoading(true);
    try {
      const payload: any = {
        username: formData.username,
        full_name: formData.full_name,
        email: formData.email,
      };
      if (formData.password) {
        payload.password = formData.password;
      }

      const res = await updateAdminProfile(payload);
      if (res.success && res.user) {
        onToast("Profil admin berhasil diperbarui!", "success");
        onUpdateUser(res.user);
        setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
      } else {
        onToast(res.message || "Gagal memperbarui profil", "error");
      }
    } catch (err: any) {
      onToast("Error: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 p-6 md:p-8 animate-in fade-in duration-300">
      <div className="max-w-3xl">
        <div className="mb-8">
          <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <User className="w-6 h-6 text-amber-500" />
            <span>Pengaturan Profil Admin</span>
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-500 dark:text-slate-400 mt-1">
            Ubah informasi akun dan kata sandi Anda.
          </p>
        </div>

        <form
          onSubmit={handleSave}
          className="space-y-6 bg-white/60 dark:bg-slate-900/60 p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-800"
        >
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-2">
              Informasi Dasar
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-600 dark:text-slate-500 dark:text-slate-400 text-xs font-semibold mb-1">
                  Username *
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-amber-500 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-500 dark:text-slate-400 text-xs font-semibold mb-1">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) =>
                    setFormData({ ...formData, full_name: e.target.value })
                  }
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-amber-500 text-sm"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-600 dark:text-slate-500 dark:text-slate-400 text-xs font-semibold mb-1">
                  Alamat Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-amber-500 text-sm"
                />
              </div>
            </div>
          </div>

          <hr className="border-slate-200 dark:border-slate-800" />

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Ganti Kata Sandi
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-500 mb-2">
              Biarkan kosong jika tidak ingin mengubah kata sandi Anda saat ini.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-600 dark:text-slate-500 dark:text-slate-400 text-xs font-semibold mb-1">
                  Kata Sandi Baru
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-amber-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-500 dark:text-slate-400 text-xs font-semibold mb-1">
                  Konfirmasi Kata Sandi Baru
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-amber-500 text-sm"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-500 dark:bg-amber-400 text-slate-950 font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-amber-500/20 ${loading ? "opacity-70 pointer-events-none" : ""}`}
            >
              <Save className="w-4 h-4" />
              <span>{loading ? "Menyimpan..." : "Simpan Perubahan"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

"use client";

import { useState, useEffect } from "react";
import { User, Lock, Save, AlertCircle, CheckCircle2, ShieldAlert } from "lucide-react";
import { getAdminSession, changePassword } from "@/lib/actions/auth";

export default function AdminProfilePage() {
  const [session, setSession] = useState<{ email: string; name: string; role: string } | null>(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    getAdminSession().then((s) => {
      if (s) setSession({ email: s.email, name: s.name, role: s.role });
    });
  }, []);

  // Staff cannot access profile
  if (session && session.role === "staff") {
    return (
      <div className="max-w-md mx-auto py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-[#554536]">Akses Dibatasi</h2>
        <p className="text-xs text-[#7A6A5A] mt-2">
          Akun dengan role Staff tidak memiliki izin untuk membuka halaman profil atau mengubah kata sandi. Silakan hubungi Administrator.
        </p>
      </div>
    );
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword.length < 6) {
      setMessage({ type: "error", text: "Password baru minimal 6 karakter." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Konfirmasi password tidak cocok." });
      return;
    }

    setLoading(true);
    const result = await changePassword(oldPassword, newPassword);
    setLoading(false);

    if (result.error) {
      setMessage({ type: "error", text: result.error });
    } else {
      setMessage({ type: "success", text: "Password berhasil diperbarui." });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-[#554536]">Profil Administrator</h1>
        <p className="text-xs text-[#7A6A5A] mt-0.5">
          Informasi akun administrator dan formulir ubah password.
        </p>
      </div>

      {/* Profile Info Card */}
      <div className="bg-white rounded-2xl border border-[#DCCBB1] shadow-xs p-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#B89A68] to-[#8C6F3F] flex items-center justify-center text-white font-bold text-xl shadow-sm">
            {session?.name ? session.name.charAt(0).toUpperCase() : "A"}
          </div>
          <div>
            <h2 className="font-bold text-base text-[#554536]">{session?.name || "Administrator"}</h2>
            <p className="text-xs text-[#867362]">{session?.email || "admin@alharamain.id"}</p>
            <span className="text-[10px] bg-[#B89A68]/15 text-[#8C6F3F] font-bold px-2 py-0.5 rounded-full inline-block mt-1 uppercase border border-[#B89A68]/30">
              Role: {session?.role || "admin"}
            </span>
          </div>
        </div>
      </div>

      {/* Change Password Card */}
      <div className="bg-white rounded-2xl border border-[#DCCBB1] shadow-xs p-6">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#F6F0E6]">
          <Lock className="w-4 h-4 text-[#B89A68]" />
          <h2 className="font-bold text-sm text-[#554536]">Ubah Password</h2>
        </div>

        {message && (
          <div
            className={`mb-4 p-3 rounded-xl text-xs flex items-start gap-2 ${
              message.type === "success"
                ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                : "bg-red-50 border border-red-200 text-red-700"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-[#554536] mb-1">Password Lama</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
              placeholder="Masukkan password saat ini"
              className="w-full bg-[#F6F0E6]/50 border border-[#DCCBB1] rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#B89A68]"
            />
          </div>
          <div>
            <label className="block font-bold text-[#554536] mb-1">Password Baru</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              placeholder="Minimal 6 karakter"
              className="w-full bg-[#F6F0E6]/50 border border-[#DCCBB1] rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#B89A68]"
            />
          </div>
          <div>
            <label className="block font-bold text-[#554536] mb-1">Konfirmasi Password Baru</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Ketik ulang password baru"
              className="w-full bg-[#F6F0E6]/50 border border-[#DCCBB1] rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#B89A68]"
            />
          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#B89A68] hover:bg-[#9E8253] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm transition disabled:opacity-50 flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              {loading ? "Menyimpan..." : "Simpan Password Baru"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

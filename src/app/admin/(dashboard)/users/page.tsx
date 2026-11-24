"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Shield, ShieldCheck, ShieldAlert, KeyRound, CheckCircle2, AlertCircle } from "lucide-react";
import { getUsers, createUser, deleteUser, getAdminSession, adminResetUserPassword } from "@/lib/actions/auth";
import { UserAccount } from "@/types";

export default function AdminUsersPage() {
  const [session, setSession] = useState<{ email: string; name: string; role: string } | null>(null);
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // State untuk modal ubah password pengguna oleh Admin
  const [passwordModalUser, setPasswordModalUser] = useState<UserAccount | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordFeedback, setPasswordFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const loadData = async () => {
    const [sess, list] = await Promise.all([getAdminSession(), getUsers()]);
    if (sess) setSession({ email: sess.email, name: sess.name, role: sess.role });
    setUsers(list);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Staff cannot access user management
  if (session && session.role === "staff") {
    return (
      <div className="max-w-md mx-auto py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-[#554536]">Akses Dibatasi</h2>
        <p className="text-xs text-[#7A6A5A] mt-2">
          Akun dengan role Staff tidak memiliki wewenang untuk menambahkan atau mengelola pengguna toko.
        </p>
      </div>
    );
  }

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus akun ini?")) {
      await deleteUser(id);
      loadData();
    }
  };

  const handleOpenPasswordModal = (user: UserAccount) => {
    setPasswordModalUser(user);
    setNewPassword("");
    setConfirmPassword("");
    setPasswordFeedback(null);
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordModalUser) return;

    if (newPassword.length < 6) {
      setPasswordFeedback({ type: "error", text: "Password baru minimal 6 karakter." });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordFeedback({ type: "error", text: "Konfirmasi password baru tidak cocok." });
      return;
    }

    setPasswordLoading(true);
    setPasswordFeedback(null);

    const res = await adminResetUserPassword(passwordModalUser.id, newPassword);
    setPasswordLoading(false);

    if (res?.error) {
      setPasswordFeedback({ type: "error", text: res.error });
    } else {
      setPasswordFeedback({ type: "success", text: res.message || "Password berhasil diubah!" });
      setTimeout(() => {
        setPasswordModalUser(null);
      }, 1500);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const name = formData.get("name") as string;
    const role = formData.get("role") as "admin" | "staff";
    const initialPassword = (formData.get("password") as string) || "password123";

    const res = await createUser(email, name, role, initialPassword);
    setLoading(false);

    if (res && "error" in res && res.error) {
      alert(res.error);
    } else {
      setShowModal(false);
      loadData();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#554536]">Kelola Pengguna & Role</h1>
          <p className="text-xs text-[#7A6A5A] mt-0.5">
            Daftar akun pengelola toko. Admin dapat menambah user serta mengubah password untuk diri sendiri maupun staf.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-[#B89A68] hover:bg-[#9E8253] text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Tambah Pengguna Baru
        </button>
      </div>

      {/* Users Table with Change Password Feature */}
      <div className="bg-white rounded-2xl border border-[#DCCBB1] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F6F0E6] text-[#554536] font-bold border-b border-[#DCCBB1]">
              <tr>
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4">Nama</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4 text-right">Aksi Password & Akun</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F6F0E6]">
              {users.map((u, idx) => (
                <tr key={u.id} className="hover:bg-[#F6F0E6]/30 transition">
                  <td className="py-3 px-4 text-center font-bold text-[#867362]">
                    {idx + 1}
                  </td>
                  <td className="py-3 px-4 font-bold text-[#554536]">{u.name}</td>
                  <td className="py-3 px-4 text-[#7A6A5A]">{u.email}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        u.role === "admin"
                          ? "bg-[#B89A68]/15 text-[#8C6F3F] border border-[#B89A68]/30"
                          : "bg-stone-100 text-stone-600 border border-stone-200"
                      }`}
                    >
                      {u.role === "admin" ? (
                        <ShieldCheck className="w-3 h-3" />
                      ) : (
                        <Shield className="w-3 h-3" />
                      )}
                      {u.role === "admin" ? "Admin" : "Staff"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-1.5">
                    {/* Tombol Ubah Password (Khusus Admin) */}
                    <button
                      onClick={() => handleOpenPasswordModal(u)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-[#8C6F3F] bg-[#B89A68]/15 hover:bg-[#B89A68]/25 rounded-lg border border-[#B89A68]/30 transition"
                      title="Ubah Password Akun Ini"
                    >
                      <KeyRound className="w-3 h-3" />
                      <span>Ubah Password</span>
                    </button>

                    <button
                      onClick={() => handleDelete(u.id)}
                      disabled={u.role === "admin" && users.filter((x) => x.role === "admin").length <= 1}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed"
                      title={u.role === "admin" && users.filter((x) => x.role === "admin").length <= 1 ? "Admin utama tidak dapat dihapus" : "Hapus User"}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Ubah Password Pengguna oleh Admin */}
      {passwordModalUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#DCCBB1] shadow-2xl relative animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-[#B89A68]/20 text-[#8C6F3F] flex items-center justify-center">
                <KeyRound className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-[#554536]">
                Ubah Password Pengguna
              </h2>
            </div>
            <p className="text-xs text-[#7A6A5A] mb-4">
              Atur password baru untuk akun <strong>{passwordModalUser.name}</strong> ({passwordModalUser.email}).
            </p>

            {passwordFeedback && (
              <div
                className={`mb-4 p-3 rounded-xl text-xs flex items-start gap-2 ${
                  passwordFeedback.type === "success"
                    ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                    : "bg-red-50 border border-red-200 text-red-700"
                }`}
              >
                {passwordFeedback.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                )}
                <span>{passwordFeedback.text}</span>
              </div>
            )}

            <form onSubmit={handleSavePassword} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#554536] mb-1">Password Baru</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="Masukkan password baru (min. 6 karakter)"
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

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F6F0E6]">
                <button
                  type="button"
                  onClick={() => setPasswordModalUser(null)}
                  className="px-4 py-2 rounded-xl text-[#7A6A5A] hover:bg-stone-100 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="bg-[#B89A68] hover:bg-[#9E8253] text-white px-5 py-2 rounded-xl font-bold shadow-sm transition disabled:opacity-50"
                >
                  {passwordLoading ? "Menyimpan..." : "Simpan Password Baru"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#DCCBB1] shadow-2xl relative animate-in fade-in zoom-in-95">
            <h2 className="text-lg font-bold text-[#554536] mb-4">
              Tambah Pengguna Baru
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#554536] mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Contoh: Muhammad Rizki"
                  className="w-full bg-[#F6F0E6]/50 border border-[#DCCBB1] rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#B89A68]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#554536] mb-1">Email Pengguna</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Contoh: staff@alharamain.id"
                  className="w-full bg-[#F6F0E6]/50 border border-[#DCCBB1] rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#B89A68]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#554536] mb-1">Password Awal</label>
                <input
                  type="password"
                  name="password"
                  required
                  minLength={6}
                  defaultValue="password123"
                  className="w-full bg-[#F6F0E6]/50 border border-[#DCCBB1] rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#B89A68]"
                />
                <span className="text-[10px] text-[#867362] mt-1 block">Default: password123</span>
              </div>

              <div>
                <label className="block font-bold text-[#554536] mb-1">Role Akun</label>
                <select
                  name="role"
                  defaultValue="staff"
                  className="w-full bg-[#F6F0E6]/50 border border-[#DCCBB1] rounded-xl px-3.5 py-2 text-xs font-semibold focus:outline-none focus:border-[#B89A68]"
                >
                  <option value="staff">Staff (Terbatas - Tidak bisa kelola user & profil)</option>
                  <option value="admin">Admin (Akses Penuh Seluruh Sistem)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F6F0E6]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-[#7A6A5A] hover:bg-stone-100 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#B89A68] hover:bg-[#9E8253] text-white px-5 py-2 rounded-xl font-bold shadow-sm transition disabled:opacity-50"
                >
                  {loading ? "Menyimpan..." : "Simpan Pengguna"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

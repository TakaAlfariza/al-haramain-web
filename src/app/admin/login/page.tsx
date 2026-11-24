"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Eye, EyeOff, Sparkles } from "lucide-react";
import { loginAdmin } from "@/lib/actions/auth";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const targetUrl = new URLSearchParams(window.location.search).get("redirect") || "/admin";

    try {
      // 1. Kirim via API Route Handler (aman dari batasan Origin / Tunnel Proxy)
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        window.location.href = targetUrl;
        return;
      }

      if (data?.error) {
        setError(data.error);
        setLoading(false);
        return;
      }
    } catch {
      // Jika fetch ke API route terkendala, coba via Server Action
    }

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);

      const result = await loginAdmin(formData);

      if (result?.error) {
        setError(result.error);
        setLoading(false);
      } else {
        window.location.href = targetUrl;
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal terhubung ke server.";
      setError(msg);
      setLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail("admin@alharamain.id");
    setPassword("admin123");
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#241E19] text-white flex flex-col justify-between p-4 md:p-8 relative overflow-hidden selection:bg-[#B89A68] selection:text-white">
      {/* Background Decorative Islamic Arch Glow */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#B89A68]/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#DCCBB1]/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Header */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between z-10">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#B89A68] to-[#8C6F3F] flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:scale-105 transition-transform">
            ح
          </div>
          <div>
            <span className="font-bold text-base tracking-wider text-amber-100 block">
              AL HARAMAIN
            </span>
            <span className="text-[10px] text-amber-200/60 uppercase tracking-widest block font-medium">
              Retail Oleh-Oleh Haji
            </span>
          </div>
        </Link>

        <Link
          href="/"
          className="text-xs text-amber-200/80 hover:text-white flex items-center gap-1.5 transition"
        >
          <span>← Kembali ke Website</span>
        </Link>
      </header>

      {/* Main Login Card */}
      <main className="max-w-md w-full mx-auto my-8 z-10">
        <div className="bg-white/95 backdrop-blur-xl text-[#554536] rounded-3xl p-8 md:p-9 shadow-2xl border border-[#DCCBB1]/60 relative">
          {/* Header Title inside Card */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 bg-[#B89A68]/15 border border-[#B89A68]/40 px-3 py-1 rounded-full text-xs font-semibold text-[#8C6F3F] mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-[#B89A68]" />
              Portal Khusus Administrator
            </div>
            <h1 className="text-2xl font-bold text-[#554536]">
              Masuk ke CMS Toko
            </h1>
            <p className="text-xs text-[#7A6A5A] mt-1.5 leading-relaxed">
              Silakan masukkan kredensial administrator untuk mengelola produk, parsel, dan konten website.
            </p>
          </div>

          {/* Error Message Box */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#554536] mb-1.5">
                Email Administrator
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#867362] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@alharamain.id"
                  className="w-full bg-[#F6F0E6]/60 border border-[#DCCBB1] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#554536] placeholder-[#867362]/60 focus:outline-none focus:border-[#B89A68] focus:bg-white transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#554536] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#867362] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-[#F6F0E6]/60 border border-[#DCCBB1] rounded-xl pl-10 pr-10 py-2.5 text-xs text-[#554536] placeholder-[#867362]/60 focus:outline-none focus:border-[#B89A68] focus:bg-white transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#867362] hover:text-[#554536] p-0.5"
                  title={showPassword ? "Sembunyikan password" : "Lihat password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#B89A68] to-[#9E8253] hover:from-[#A88A58] hover:to-[#8E7243] text-white py-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#B89A68]/25 transition-all transform active:scale-95 disabled:opacity-60"
              >
                {loading ? (
                  <span>Memverifikasi Akses...</span>
                ) : (
                  <>
                    <span>Buka Dashboard Admin</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Demo Credentials Assistant */}
          <div className="mt-6 pt-5 border-t border-[#F6F0E6] text-center">
            <span className="text-[11px] text-[#867362] block mb-2">
              Akun Default:
            </span>
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="inline-flex items-center gap-1.5 text-xs bg-[#F6F0E6] hover:bg-[#EFE8DC] text-[#554536] border border-[#DCCBB1] px-3 py-1.5 rounded-lg font-semibold transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#B89A68]" />
              admin@alharamain.id / admin123
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-stone-400 z-10">
        <p>© 2026 Al Haramain Retail. Sistem Admin Terproteksi Enkripsi SSL.</p>
      </footer>
    </div>
  );
}

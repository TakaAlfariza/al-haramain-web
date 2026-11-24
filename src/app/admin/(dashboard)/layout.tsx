import Link from "next/link";
import {
  LayoutDashboard,
  Tags,
  Package,
  Gift,
  Image as ImageIcon,
  MessageSquare,
  PhoneCall,
  ExternalLink,
  LogOut,
  User,
  Users,
} from "lucide-react";
import { getAdminSession, logoutAdmin } from "@/lib/actions/auth";

export const instant = false;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  const isAdmin = session?.role === "admin";

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Kategori Produk", href: "/admin/kategori", icon: Tags },
    { label: "Katalog Produk", href: "/admin/produk", icon: Package },
    { label: "Paket Parsel", href: "/admin/parsel", icon: Gift },
    { label: "Galeri Foto", href: "/admin/galeri", icon: ImageIcon },
    { label: "Testimoni", href: "/admin/testimoni", icon: MessageSquare },
    { label: "Kontak & Lokasi", href: "/admin/kontak", icon: PhoneCall },
  ];

  // Admin-only nav items (staff cannot open profile or manage users)
  const adminOnlyItems = isAdmin
    ? [
        { label: "Kelola Pengguna", href: "/admin/users", icon: Users },
        { label: "Profil Saya", href: "/admin/profil", icon: User },
      ]
    : [];

  return (
    <div className="min-h-screen bg-[#F6F0E6] text-[#554536] flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-[#DCCBB1] hidden md:flex flex-col justify-between p-5 fixed top-0 bottom-0 left-0 z-30">
        <div>
          {/* Brand */}
          <div className="flex items-center gap-2.5 pb-6 border-b border-[#F6F0E6]">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#B89A68] to-[#8C6F3F] flex items-center justify-center text-white font-bold text-lg shadow-sm">
              ح
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-[#554536] block">
                AL HARAMAIN
              </span>
              <span className="text-[10px] text-[#867362] font-semibold uppercase tracking-wider block">
                CMS Administrator
              </span>
            </div>
          </div>

          {/* Nav List */}
          <nav className="mt-6 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#554536] hover:bg-[#F6F0E6] hover:text-[#B89A68] transition"
                >
                  <Icon className="w-4 h-4 text-[#867362]" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* Admin Only Items */}
            {adminOnlyItems.length > 0 && (
              <>
                <div className="pt-3 mt-3 border-t border-[#F6F0E6]">
                  <span className="px-3.5 text-[10px] font-bold text-[#867362] uppercase tracking-wider block mb-1">
                    Pengaturan Akun
                  </span>
                </div>
                {adminOnlyItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#554536] hover:bg-[#F6F0E6] hover:text-[#B89A68] transition"
                    >
                      <Icon className="w-4 h-4 text-[#867362]" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </>
            )}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-4 border-t border-[#F6F0E6] space-y-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between text-xs text-[#867362] hover:text-[#B89A68] px-3.5 py-2 rounded-xl bg-[#F6F0E6]/50 transition"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              Lihat Web Publik
            </span>
            <span className="text-[10px] text-[#B89A68] font-bold">Live ↗</span>
          </Link>

          <div className="px-3.5 py-2 text-xs bg-[#F6F0E6]/40 rounded-xl border border-[#DCCBB1]/40">
            <span className="text-[10px] text-[#867362] block">Masuk sebagai:</span>
            <span className="font-bold text-[#554536] truncate block">
              {session?.name || session?.email || "admin@alharamain.id"}
            </span>
            <span className="text-[10px] bg-[#B89A68]/15 text-[#8C6F3F] font-bold px-1.5 py-0.5 rounded uppercase mt-0.5 inline-block">
              Role: {session?.role || "admin"}
            </span>
          </div>

          <form action={logoutAdmin}>
            <button
              type="submit"
              className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              Keluar (Logout)
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <header className="bg-white/80 backdrop-blur border-b border-[#DCCBB1] px-6 py-3.5 sticky top-0 z-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#554536] uppercase tracking-wider">
              Admin Panel Al Haramain
            </span>
            {session?.isDemo && (
              <span className="text-[10px] bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full border border-amber-300">
                Mode Demo
              </span>
            )}
            <span className="text-[10px] bg-[#F6F0E6] text-[#8C6F3F] font-bold px-2 py-0.5 rounded-full border border-[#DCCBB1]">
              Role: {session?.role || "admin"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="text-xs text-[#B89A68] font-semibold hover:underline flex items-center gap-1"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Pratinjau Web
            </Link>
          </div>
        </header>

        {/* Content Viewport */}
        <main className="p-6 md:p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}

import Link from "next/link";
import {
  Package,
  Gift,
  ImageIcon,
  MessageSquare,
  ArrowUpRight,
  Plus,
  Tags,
} from "lucide-react";
import { getProducts, getCategories } from "@/lib/actions/products";
import { getParcels } from "@/lib/actions/parcels";
import { getGalleries } from "@/lib/actions/gallery";
import { getTestimonials } from "@/lib/actions/testimonials";
import { formatRupiah } from "@/lib/formatters";

export const instant = false;

export default async function AdminDashboardPage() {
  const [products, categories, parcels, galleries, testimonials] = await Promise.all([
    getProducts(),
    getCategories(),
    getParcels(),
    getGalleries(),
    getTestimonials(),
  ]);

  const cleanCategories = categories.filter((c) => c.slug !== "all");

  const stats = [
    {
      label: "Kategori Produk",
      value: cleanCategories.length,
      icon: Tags,
      href: "/admin/kategori",
      color: "bg-orange-50 text-orange-600",
    },
    {
      label: "Total Produk Aktif",
      value: products.length,
      icon: Package,
      href: "/admin/produk",
      color: "bg-amber-50 text-[#B89A68]",
    },
    {
      label: "Total Paket Parsel",
      value: parcels.length,
      icon: Gift,
      href: "/admin/parsel",
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Foto Galeri Toko",
      value: galleries.length,
      icon: ImageIcon,
      href: "/admin/galeri",
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Ulasan Pelanggan",
      value: testimonials.length,
      icon: MessageSquare,
      href: "/admin/testimoni",
      color: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Title & Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#554536]">
            Dashboard Ringkasan
          </h1>
          <p className="text-xs text-[#7A6A5A] mt-0.5">
            Kelola seluruh katalog oleh-oleh, paket parsel, dan informasi Al Haramain secara langsung.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <Link
            href="/admin/produk"
            className="bg-[#B89A68] hover:bg-[#9E8253] text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            Tambah Produk
          </Link>
          <Link
            href="/admin/parsel"
            className="bg-white border border-[#DCCBB1] hover:bg-stone-50 text-[#554536] px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            Tambah Parsel
          </Link>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <Link
              key={idx}
              href={s.href}
              className="bg-white p-5 rounded-2xl border border-[#DCCBB1] shadow-xs hover:shadow-md transition flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#867362] group-hover:text-[#B89A68] transition-colors" />
              </div>
              <div>
                <span className="text-2xl font-bold text-[#554536] block">
                  {s.value}
                </span>
                <span className="text-xs text-[#7A6A5A] font-medium">
                  {s.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Grid: Recent Products & Recent Parcels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Products */}
        <div className="bg-white rounded-2xl border border-[#DCCBB1] p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3.5 border-b border-[#F6F0E6] mb-4">
            <h2 className="text-sm font-bold text-[#554536] flex items-center gap-2">
              <Package className="w-4 h-4 text-[#B89A68]" />
              Daftar Produk Terbaru
            </h2>
            <Link
              href="/admin/produk"
              className="text-xs text-[#B89A68] hover:underline font-semibold"
            >
              Lihat Semua →
            </Link>
          </div>

          <div className="space-y-3">
            {products.slice(0, 4).map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F6F0E6]/50 transition border border-transparent hover:border-[#DCCBB1]/40"
              >
                <div>
                  <h3 className="font-bold text-xs text-[#554536]">{p.name}</h3>
                  <span className="text-[10px] text-[#867362]">
                    {p.categoryName} • {formatRupiah(p.price)}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    p.isActive
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-stone-100 text-stone-600"
                  }`}
                >
                  {p.isActive ? "Aktif" : "Nonaktif"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Parcels */}
        <div className="bg-white rounded-2xl border border-[#DCCBB1] p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3.5 border-b border-[#F6F0E6] mb-4">
            <h2 className="text-sm font-bold text-[#554536] flex items-center gap-2">
              <Gift className="w-4 h-4 text-emerald-600" />
              Paket Parsel Haji
            </h2>
            <Link
              href="/admin/parsel"
              className="text-xs text-[#B89A68] hover:underline font-semibold"
            >
              Lihat Semua →
            </Link>
          </div>

          <div className="space-y-3">
            {parcels.slice(0, 4).map((par) => (
              <div
                key={par.id}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F6F0E6]/50 transition border border-transparent hover:border-[#DCCBB1]/40"
              >
                <div>
                  <h3 className="font-bold text-xs text-[#554536]">{par.name}</h3>
                  <span className="text-[10px] text-[#867362]">
                    {formatRupiah(par.price)} • {par.contents.length} item isi
                  </span>
                </div>
                {par.label && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#B89A68]/15 text-[#8C6F3F]">
                    {par.label}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

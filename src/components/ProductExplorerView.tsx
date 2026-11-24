"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ChevronRight, Home as HomeIcon, MessageCircle, Filter, ArrowLeft, ChevronLeft } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";
import { formatRupiah } from "@/lib/formatters";
import { createWhatsAppUrl, getProductWhatsAppMessage } from "@/lib/whatsapp";
import { Product, Category } from "@/types";

interface ProductExplorerViewProps {
  initialProducts: Product[];
  categories: Category[];
}

export default function ProductExplorerView({
  initialProducts,
  categories,
}: ProductExplorerViewProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12; // Requirement: Batasi 12 produk saja yang muncul, jika lebih pindah ke page 2

  const cleanCategories = categories.filter((c) => c.slug !== "all");
  const activeProducts = initialProducts.filter((p) => p.isActive);

  // Filter products by search and category
  const filteredProducts = activeProducts.filter((p) => {
    const matchesCategory =
      selectedCategory === "all" ||
      p.categoryId === selectedCategory ||
      p.categoryCode === selectedCategory;

    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.categoryName.toLowerCase().includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Pagination calculation (Limit 12 items per page)
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const validPage = Math.min(currentPage, totalPages);
  const paginatedProducts = filteredProducts.slice(
    (validPage - 1) * pageSize,
    validPage * pageSize
  );

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    setCurrentPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const activeCategoryObj = cleanCategories.find(
    (c) => c.id === selectedCategory || c.slug === selectedCategory
  );
  const currentCategoryTitle =
    selectedCategory === "all" ? "Semua Produk" : activeCategoryObj?.name || "Kategori Pilihan";

  return (
    <div className="min-h-screen bg-[#F6F0E6] text-[#554536] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 pt-28 pb-20">
        {/* 1. TOP NAVIGATOR (BREADCRUMB & HEADER) DENGAN LINK KEMBALI KE HOME */}
        <div className="mb-6">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#867362] mb-3">
            <Link
              href="/"
              className="hover:text-[#B89A68] flex items-center gap-1 transition font-semibold"
            >
              <HomeIcon className="w-3.5 h-3.5" />
              <span>Beranda Toko</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#DCCBB1]" />
            <span className="font-semibold text-[#554536]">Katalog Produk Lengkap</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#DCCBB1]/60">
            <div>
              <h1 className="text-2xl md:text-4xl font-bold text-[#554536]">
                Katalog Produk Al Haramain
              </h1>
              <p className="text-xs md:text-sm text-[#7A6A5A] mt-1">
                Eksplorasi seluruh aneka oleh-oleh haji, kurma pilihan, air zamzam, dan camilan tanah suci.
              </p>
            </div>

            {/* FITUR SEARCH DI ATAS */}
            <div className="w-full md:w-80 relative">
              <Search className="w-4 h-4 text-[#867362] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Cari nama produk..."
                className="w-full bg-white border border-[#DCCBB1] rounded-2xl pl-10 pr-4 py-2.5 text-xs text-[#554536] placeholder-[#867362]/70 shadow-xs focus:outline-none focus:border-[#B89A68]"
              />
            </div>
          </div>
        </div>

        {/* 2. DUA KOLOM: KIRI KATEGORI, KANAN SEMUA PRODUK */}
        {/* PERBAIKAN MOBILE: Menggunakan relative di mobile dan HANYA lg:sticky lg:top-24 di desktop agar tidak menutupi tampilan saat di handphone */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* KOLOM KIRI: KATEGORI PRODUK */}
          <aside className="lg:col-span-3 bg-white p-5 rounded-3xl border border-[#DCCBB1] shadow-xs relative lg:sticky lg:top-24">
            <div className="flex items-center gap-2 pb-3.5 border-b border-[#F6F0E6] mb-3.5">
              <Filter className="w-4 h-4 text-[#B89A68]" />
              <h2 className="font-bold text-sm text-[#554536]">Kategori Produk</h2>
            </div>

            {/* Category Button List (Responsive: flex-wrap on mobile, vertical stack on desktop) */}
            <div className="flex flex-wrap lg:flex-col gap-1.5 text-xs">
              <button
                onClick={() => handleCategoryChange("all")}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold transition text-left ${
                  selectedCategory === "all"
                    ? "bg-[#B89A68] text-white shadow-xs"
                    : "text-[#554536] hover:bg-[#F6F0E6] hover:text-[#B89A68] bg-[#F6F0E6]/30 lg:bg-transparent"
                }`}
              >
                <span>Semua Produk</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full ml-2 ${
                    selectedCategory === "all"
                      ? "bg-white/20 text-white"
                      : "bg-[#F6F0E6] text-[#867362]"
                  }`}
                >
                  {activeProducts.length}
                </span>
              </button>

              {cleanCategories.map((cat) => {
                const count = activeProducts.filter(
                  (p) => p.categoryId === cat.id || p.categoryCode === cat.code
                ).length;
                const isSelected = selectedCategory === cat.id;

                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold transition text-left ${
                      isSelected
                        ? "bg-[#B89A68] text-white shadow-xs"
                        : "text-[#554536] hover:bg-[#F6F0E6] hover:text-[#B89A68] bg-[#F6F0E6]/30 lg:bg-transparent"
                    }`}
                  >
                    <span className="truncate pr-2">{cat.name}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full ml-1 ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-[#F6F0E6] text-[#867362]"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Back link to Home */}
            <div className="pt-4 mt-4 border-t border-[#F6F0E6]">
              <Link
                href="/"
                className="text-xs text-[#8C6F3F] hover:underline flex items-center gap-1.5 font-semibold"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Beranda</span>
              </Link>
            </div>
          </aside>

          {/* KOLOM KANAN: HEADER "SEMUA PRODUK" & GRID PRODUK */}
          <section className="lg:col-span-9 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white p-4 px-6 rounded-2xl border border-[#DCCBB1] shadow-xs">
              <div>
                <h2 className="text-lg md:text-xl font-bold text-[#554536]">
                  {currentCategoryTitle}
                </h2>
                <span className="text-xs text-[#7A6A5A]">
                  Menampilkan <strong>{paginatedProducts.length}</strong> dari <strong>{filteredProducts.length}</strong> produk (Halaman {validPage} dari {totalPages})
                </span>
              </div>

              {search && (
                <button
                  onClick={() => handleSearchChange("")}
                  className="text-xs text-red-600 hover:underline text-left sm:text-right"
                >
                  Reset kata kunci &ldquo;{search}&rdquo;
                </button>
              )}
            </div>

            {/* Product Cards Grid (Limit 12 produk per page) */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-16 text-center border border-[#DCCBB1] shadow-xs">
                <div className="w-12 h-12 rounded-full bg-[#F6F0E6] flex items-center justify-center mx-auto mb-3 text-[#B89A68]">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-[#554536]">Produk Tidak Ditemukan</h3>
                <p className="text-xs text-[#7A6A5A] mt-1 max-w-sm mx-auto">
                  Tidak ada produk yang cocok dengan kategori atau kata kunci yang Anda masukkan. Silakan coba kata kunci lain.
                </p>
                <button
                  onClick={() => {
                    handleSearchChange("");
                    handleCategoryChange("all");
                  }}
                  className="mt-4 bg-[#B89A68] text-white px-5 py-2 rounded-xl text-xs font-bold shadow-xs"
                >
                  Tampilkan Semua Produk
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedProducts.map((product) => {
                  const waUrl = createWhatsAppUrl(
                    undefined,
                    getProductWhatsAppMessage(product.name)
                  );

                  return (
                    <div
                      key={product.id}
                      className="bg-white rounded-2xl p-4 border border-[#DCCBB1]/70 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                    >
                      <div>
                        {/* Image */}
                        <div className="w-full h-48 rounded-xl bg-[#F6F0E6] overflow-hidden relative mb-3.5">
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 300px"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {product.isFeatured && (
                            <span className="absolute top-2.5 right-2.5 bg-[#B89A68] text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                              Favorit
                            </span>
                          )}
                        </div>

                        <span className="text-[11px] font-medium text-[#867362] uppercase tracking-wider block">
                          {product.categoryName}
                        </span>
                        <h3 className="font-bold text-[#554536] text-sm group-hover:text-[#B89A68] transition-colors mt-0.5">
                          {product.name}
                        </h3>
                        <p className="text-xs text-[#7A6A5A] mt-1 line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>
                      </div>

                      {/* Card Bottom: Price and WhatsApp Order */}
                      <div className="pt-4 border-t border-[#F6F0E6] mt-4 flex items-center justify-between">
                        <div>
                          {product.unit && (
                            <span className="text-[10px] text-[#867362] block">
                              Harga {product.unit}
                            </span>
                          )}
                          <span className="font-bold text-[#554536] text-sm">
                            {formatRupiah(product.price)}
                          </span>
                        </div>

                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs px-3.5 py-1.5 rounded-full font-semibold flex items-center gap-1.5 transition shadow-sm active:scale-95"
                        >
                          <MessageCircle className="w-3.5 h-3.5 fill-current" />
                          Pesan WA
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination: Limit 12 produk per page */}
            {totalPages > 1 && (
              <div className="p-4 bg-white rounded-2xl border border-[#DCCBB1] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs mt-8">
                <span className="text-[#867362]">
                  Menampilkan {(validPage - 1) * pageSize + 1} -{" "}
                  {Math.min(validPage * pageSize, filteredProducts.length)} dari {filteredProducts.length} produk
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={validPage === 1}
                    className="p-2 rounded-xl border border-[#DCCBB1] bg-[#F6F0E6]/50 text-[#554536] hover:bg-[#F6F0E6] disabled:opacity-40 disabled:cursor-not-allowed transition"
                    title="Halaman Sebelumnya"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    const isCurrent = pageNum === validPage;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 rounded-xl font-bold text-xs transition ${
                          isCurrent
                            ? "bg-[#B89A68] text-white shadow-xs"
                            : "bg-[#F6F0E6]/40 border border-[#DCCBB1] text-[#554536] hover:bg-[#F6F0E6]"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={validPage === totalPages}
                    className="p-2 rounded-xl border border-[#DCCBB1] bg-[#F6F0E6]/50 text-[#554536] hover:bg-[#F6F0E6] disabled:opacity-40 disabled:cursor-not-allowed transition"
                    title="Halaman Berikutnya"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}

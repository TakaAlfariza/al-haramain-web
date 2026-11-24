"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ChevronRight, Home as HomeIcon, ArrowLeft, ChevronLeft } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";
import ParcelDetailModal from "@/components/modals/ParcelDetailModal";
import { Parcel } from "@/types";

interface ParcelExplorerViewProps {
  initialParcels: Parcel[];
}

export default function ParcelExplorerView({
  initialParcels,
}: ParcelExplorerViewProps) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9; // Requirement: Batasi hingga 9 parsel saja yang muncul per halaman
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);

  const activeParcels = initialParcels.filter((p) => p.isActive);

  const filteredParcels = activeParcels.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination calculation (Limit 9 items per page)
  const totalPages = Math.max(1, Math.ceil(filteredParcels.length / pageSize));
  const validPage = Math.min(currentPage, totalPages);
  const paginatedParcels = filteredParcels.slice(
    (validPage - 1) * pageSize,
    validPage * pageSize
  );

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-[#F6F0E6] text-[#554536] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 pt-28 pb-20">
        {/* TOP NAVIGATOR (BREADCRUMB & HEADER) DENGAN LINK KE BERANDA */}
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
            <span className="font-semibold text-[#554536]">Katalog Parsel Lengkap</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#DCCBB1]/60">
            <div>
              <h1 className="text-2xl md:text-4xl font-bold text-[#554536]">
                Koleksi Paket Parsel Haji
              </h1>
              <p className="text-xs md:text-sm text-[#7A6A5A] mt-1">
                Pilihan paket oleh-oleh haji praktis dan elegan siap kirim ke seluruh Indonesia.
              </p>
            </div>
          </div>
        </div>

        {/* TWO COLUMNS: LEFT SEARCH, RIGHT PARCEL GRID */}
        {/* PERBAIKAN MOBILE: Menggunakan relative di mobile dan HANYA lg:sticky lg:top-24 di desktop agar tidak menutupi tampilan saat di handphone */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: FITUR SEARCH & BACK NAVIGATION */}
          <aside className="lg:col-span-3 bg-white p-5 rounded-3xl border border-[#DCCBB1] shadow-xs relative lg:sticky lg:top-24">
            <div className="flex items-center gap-2 pb-3.5 border-b border-[#F6F0E6] mb-3.5">
              <Search className="w-4 h-4 text-[#B89A68]" />
              <h2 className="font-bold text-sm text-[#554536]">Pencarian Parsel</h2>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-[#867362] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Cari nama parsel..."
                className="w-full bg-[#F6F0E6]/60 border border-[#DCCBB1] rounded-xl pl-9 pr-4 py-2.5 text-xs text-[#554536] placeholder-[#867362]/60 focus:outline-none focus:border-[#B89A68]"
              />
            </div>

            {search && (
              <button
                onClick={() => handleSearchChange("")}
                className="mt-2 text-[11px] text-red-600 hover:underline block"
              >
                Reset pencarian
              </button>
            )}

            <div className="pt-5 mt-5 border-t border-[#F6F0E6]">
              <Link
                href="/"
                className="text-xs text-[#8C6F3F] hover:underline flex items-center gap-1.5 font-semibold"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Beranda</span>
              </Link>
            </div>
          </aside>

          {/* RIGHT COLUMN: PARCEL GRID (Batasi 9 parsel per page) */}
          <section className="lg:col-span-9 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white p-4 px-6 rounded-2xl border border-[#DCCBB1] shadow-xs">
              <div>
                <h2 className="text-lg md:text-xl font-bold text-[#554536]">
                  Semua Paket Parsel
                </h2>
                <span className="text-xs text-[#7A6A5A]">
                  Menampilkan <strong>{paginatedParcels.length}</strong> dari <strong>{filteredParcels.length}</strong> parsel (Halaman {validPage} dari {totalPages})
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

            {filteredParcels.length === 0 ? (
              <div className="bg-white rounded-3xl p-16 text-center border border-[#DCCBB1] shadow-xs">
                <div className="w-12 h-12 rounded-full bg-[#F6F0E6] flex items-center justify-center mx-auto mb-3 text-[#B89A68]">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-[#554536]">Parsel Tidak Ditemukan</h3>
                <p className="text-xs text-[#7A6A5A] mt-1 max-w-sm mx-auto">
                  Tidak ada paket parsel yang cocok dengan kata kunci yang Anda masukkan.
                </p>
                <button
                  onClick={() => handleSearchChange("")}
                  className="mt-4 bg-[#B89A68] text-white px-5 py-2 rounded-xl text-xs font-bold shadow-xs"
                >
                  Tampilkan Semua Parsel
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedParcels.map((parcel) => (
                  <div
                    key={parcel.id}
                    className="bg-white rounded-2xl p-4 border border-[#DCCBB1]/70 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="w-full h-48 rounded-xl bg-[#F6F0E6] overflow-hidden relative mb-3.5">
                        <Image
                          src={parcel.imageUrl}
                          alt={parcel.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 300px"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {parcel.label && (
                          <span className="absolute top-2.5 right-2.5 bg-[#B89A68] text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                            {parcel.label}
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-[#554536] text-sm group-hover:text-[#B89A68] transition-colors mt-0.5">
                        {parcel.name}
                      </h3>
                      <p className="text-xs text-[#7A6A5A] mt-1 line-clamp-2 leading-relaxed">
                        {parcel.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#F6F0E6] mt-4">
                      <button
                        onClick={() => setSelectedParcel(parcel)}
                        className="w-full bg-[#B89A68] hover:bg-[#9E8253] text-white py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition active:scale-95"
                      >
                        Lihat Detail Paket
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination: Limit 9 parsel per page */}
            {totalPages > 1 && (
              <div className="p-4 bg-white rounded-2xl border border-[#DCCBB1] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs mt-8">
                <span className="text-[#867362]">
                  Menampilkan {(validPage - 1) * pageSize + 1} -{" "}
                  {Math.min(validPage * pageSize, filteredParcels.length)} dari {filteredParcels.length} parsel
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

      {/* Parcel Detail Modal */}
      <ParcelDetailModal
        parcel={selectedParcel}
        onClose={() => setSelectedParcel(null)}
      />
    </div>
  );
}

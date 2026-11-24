"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Trash2, Edit2, Gift, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { getParcels, saveParcel, deleteParcel } from "@/lib/actions/parcels";
import { formatRupiah } from "@/lib/formatters";
import { Parcel } from "@/types";

export default function AdminParcelsPage() {
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingParcel, setEditingParcel] = useState<Parcel | null>(null);
  const [loading, setLoading] = useState(false);

  // Pagination State: Limit 9 paket parsel per halaman
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  const loadData = async () => {
    const list = await getParcels();
    setParcels(list);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingParcel(null);
    setShowModal(true);
  };

  const handleOpenEdit = (p: Parcel) => {
    setEditingParcel(p);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus paket parsel ini?")) {
      await deleteParcel(id);
      loadData();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    if (editingParcel) {
      formData.append("id", editingParcel.id);
    }

    const res = await saveParcel(formData);
    setLoading(false);

    if (res?.error) {
      alert(res.error);
    } else {
      setShowModal(false);
      loadData();
    }
  };

  // Search Filter
  const filtered = parcels.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase()) ||
    (p.label && p.label.toLowerCase().includes(search.toLowerCase()))
  );

  // Pagination calculation: 9 items per page
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const validPage = Math.min(currentPage, totalPages);
  const paginatedParcels = filtered.slice(
    (validPage - 1) * pageSize,
    validPage * pageSize
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#554536]">Pengelolaan Paket Parsel</h1>
          <p className="text-xs text-[#7A6A5A] mt-0.5">
            Atur nama paket, foto, rincian isi, dan harga resmi. Menampilkan 9 parsel per halaman dengan fitur pencarian.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-[#B89A68] hover:bg-[#9E8253] text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Tambah Paket Parsel Baru
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#DCCBB1] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-[#867362] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Cari nama paket atau label parsel..."
            className="w-full bg-[#F6F0E6]/50 border border-[#DCCBB1] rounded-xl pl-9 pr-4 py-2 text-xs text-[#554536] placeholder-[#867362]/60 focus:outline-none focus:border-[#B89A68]"
          />
        </div>
        <div className="text-xs text-[#867362] flex items-center gap-3">
          <span>
            Total: <strong>{filtered.length}</strong> parsel
          </span>
          <span>•</span>
          <span>
            Halaman <strong>{validPage}</strong> dari <strong>{totalPages}</strong>
          </span>
        </div>
      </div>

      {/* Parcels Grid: 9 per page */}
      {paginatedParcels.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-[#DCCBB1] text-xs text-[#7A6A5A]">
          Tidak ada paket parsel yang cocok dengan pencarian Anda.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedParcels.map((parcel, idx) => {
            const itemNumber = (validPage - 1) * pageSize + idx + 1;
            return (
              <div
                key={parcel.id}
                className="bg-white rounded-2xl p-5 border border-[#DCCBB1] shadow-xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="w-full h-44 rounded-xl bg-[#F6F0E6] overflow-hidden mb-3 relative">
                    <Image
                      src={parcel.imageUrl}
                      alt={parcel.name}
                      fill
                      className="object-cover"
                    />
                    <span className="absolute top-2.5 left-2.5 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      #{itemNumber}
                    </span>
                    {parcel.label && (
                      <span className="absolute top-2.5 right-2.5 bg-[#B89A68] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                        {parcel.label}
                      </span>
                    )}
                  </div>

                  <div className="flex items-baseline justify-between mb-1">
                    <h3 className="font-bold text-base text-[#554536]">{parcel.name}</h3>
                    <span className="font-bold text-sm text-[#554536]">
                      {formatRupiah(parcel.price)}
                    </span>
                  </div>
                  <p className="text-xs text-[#7A6A5A] mb-3 leading-relaxed">{parcel.description}</p>

                  {/* Contents Preview */}
                  <div className="bg-[#F6F0E6]/50 p-3 rounded-xl border border-[#DCCBB1]/40 mb-3">
                    <span className="text-[10px] font-bold text-[#867362] uppercase tracking-wider block mb-1">
                      Isi Paket ({parcel.contents.length} item):
                    </span>
                    <ul className="text-[11px] text-[#554536] space-y-1">
                      {parcel.contents.slice(0, 3).map((item, i) => (
                        <li key={i} className="flex items-center gap-1.5 truncate">
                          <span className="text-[#B89A68] font-bold">✓</span>
                          <span className="truncate">{item}</span>
                        </li>
                      ))}
                      {parcel.contents.length > 3 && (
                        <li className="text-[10px] text-[#867362] italic">
                          + {parcel.contents.length - 3} item lainnya...
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#F6F0E6] flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      parcel.isActive
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-stone-100 text-stone-600"
                    }`}
                  >
                    {parcel.isActive ? "Aktif" : "Nonaktif"}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(parcel)}
                      className="p-1.5 text-[#B89A68] hover:bg-[#F6F0E6] rounded-lg transition"
                      title="Edit Parsel"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(parcel.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Hapus Parsel"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Bar for Parcels */}
      {totalPages > 1 && (
        <div className="p-4 bg-white rounded-2xl border border-[#DCCBB1] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span className="text-[#867362]">
            Menampilkan {((validPage - 1) * pageSize) + 1} - {Math.min(validPage * pageSize, filtered.length)} dari {filtered.length} paket parsel
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={validPage === 1}
              className="p-1.5 rounded-lg border border-[#DCCBB1] bg-white text-[#554536] hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
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
                  className={`w-8 h-8 rounded-lg font-bold text-xs transition ${
                    isCurrent
                      ? "bg-[#B89A68] text-white shadow-xs"
                      : "bg-white border border-[#DCCBB1] text-[#554536] hover:bg-stone-50"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={validPage === totalPages}
              className="p-1.5 rounded-lg border border-[#DCCBB1] bg-white text-[#554536] hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              title="Halaman Berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Add / Edit Parcel Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-[#DCCBB1] shadow-2xl relative animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-[#554536] mb-4">
              {editingParcel ? "Edit Paket Parsel" : "Tambah Paket Parsel Baru"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#554536] mb-1">Nama Paket Parsel</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingParcel?.name || ""}
                  required
                  placeholder="Contoh: Paket Barakah"
                  className="w-full bg-[#F6F0E6]/50 border border-[#DCCBB1] rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#B89A68]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#554536] mb-1">Harga Resmi (IDR)</label>
                  <input
                    type="number"
                    name="price"
                    defaultValue={editingParcel?.price || ""}
                    required
                    placeholder="150000"
                    className="w-full bg-[#F6F0E6]/50 border border-[#DCCBB1] rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#B89A68]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#554536] mb-1">Label / Badge</label>
                  <input
                    type="text"
                    name="label"
                    defaultValue={editingParcel?.label || ""}
                    placeholder="Best Seller / Favorit"
                    className="w-full bg-[#F6F0E6]/50 border border-[#DCCBB1] rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#B89A68]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#554536] mb-1">URL Foto Parsel</label>
                <input
                  type="url"
                  name="imageUrl"
                  defaultValue={editingParcel?.imageUrl || ""}
                  required
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#F6F0E6]/50 border border-[#DCCBB1] rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#B89A68]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#554536] mb-1">Deskripsi Singkat</label>
                <textarea
                  name="description"
                  defaultValue={editingParcel?.description || ""}
                  rows={2}
                  placeholder="Keterangan singkat paket..."
                  className="w-full bg-[#F6F0E6]/50 border border-[#DCCBB1] rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#B89A68]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#554536] mb-1">
                  Rincian Isi Paket (Pisahkan tiap item dengan baris baru):
                </label>
                <textarea
                  name="contents"
                  defaultValue={editingParcel ? editingParcel.contents.join("\n") : ""}
                  rows={5}
                  required
                  placeholder={`Kurma Khalas Madinah (250 gr)\nAir Zamzam Botol Segel (60 ml)\nKacang Arab / Fustuk (100 gr)\nTasbih Kayu Estetik`}
                  className="w-full bg-[#F6F0E6]/50 border border-[#DCCBB1] rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#B89A68] font-mono leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    value="true"
                    defaultChecked={editingParcel?.isFeatured || false}
                    className="accent-[#B89A68]"
                  />
                  Tampilkan di Unggulan
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    name="isActive"
                    value="true"
                    defaultChecked={editingParcel ? editingParcel.isActive : true}
                    className="accent-[#B89A68]"
                  />
                  Status Aktif
                </label>
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
                  {loading ? "Menyimpan..." : "Simpan Paket Parsel"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

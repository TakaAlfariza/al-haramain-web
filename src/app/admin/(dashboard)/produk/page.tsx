"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Trash2, Edit2, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { getProducts, getCategories, saveProduct, deleteProduct } from "@/lib/actions/products";
import { formatRupiah } from "@/lib/formatters";
import { Product, Category } from "@/types";
import ImageUploadField from "@/components/admin/ImageUploadField";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);

  // Pagination State: Limit 10 produk per halaman
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Selected category in Add Modal
  const [modalCategoryId, setModalCategoryId] = useState("");

  const loadData = async () => {
    const [pList, cList] = await Promise.all([getProducts(), getCategories()]);
    setProducts(pList);
    const cleanCats = cList.filter((c) => c.slug !== "all");
    setCategories(cleanCats);
    if (cleanCats.length > 0 && !modalCategoryId) {
      setModalCategoryId(cleanCats[0].id);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    if (categories.length > 0) {
      setModalCategoryId(categories[0].id);
    }
    setShowModal(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setModalCategoryId(p.categoryId);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      await deleteProduct(id);
      loadData();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    if (editingProduct) {
      formData.append("id", editingProduct.id);
    }

    const res = await saveProduct(formData);
    setLoading(false);

    if (res?.error) {
      alert(res.error);
    } else {
      setShowModal(false);
      loadData();
    }
  };

  // Filtered list by search
  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.categoryName.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const validPage = Math.min(currentPage, totalPages);
  const paginatedProducts = filtered.slice(
    (validPage - 1) * pageSize,
    validPage * pageSize
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#554536]">Pengelolaan Katalog Produk</h1>
          <p className="text-xs text-[#7A6A5A] mt-0.5">
            Daftar seluruh produk dengan nomor urut dan limit 10 produk per halaman.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-[#B89A68] hover:bg-[#9E8253] text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Tambah Produk Baru
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
            placeholder="Cari berdasarkan nama atau kategori..."
            className="w-full bg-[#F6F0E6]/50 border border-[#DCCBB1] rounded-xl pl-9 pr-4 py-2 text-xs text-[#554536] placeholder-[#867362]/60 focus:outline-none focus:border-[#B89A68]"
          />
        </div>
        <div className="text-xs text-[#867362] flex items-center gap-3">
          <span>
            Total: <strong>{filtered.length}</strong> produk
          </span>
          <span>•</span>
          <span>
            Halaman <strong>{validPage}</strong> dari <strong>{totalPages}</strong>
          </span>
        </div>
      </div>

      {/* Products Table (Requested: Kode Produk TIDAK ditampilkan di halaman) */}
      <div className="bg-white rounded-2xl border border-[#DCCBB1] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F6F0E6] text-[#554536] font-bold border-b border-[#DCCBB1]">
              <tr>
                <th className="py-3.5 px-4 w-14 text-center">No</th>
                <th className="py-3.5 px-4">Foto</th>
                <th className="py-3.5 px-4">Nama Produk</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4">Harga Resmi</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F6F0E6]">
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs text-[#7A6A5A]">
                    Tidak ada produk yang ditemukan.
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((p, index) => {
                  const rowNumber = (validPage - 1) * pageSize + index + 1;
                  return (
                    <tr key={p.id} className="hover:bg-[#F6F0E6]/30 transition">
                      <td className="py-3.5 px-4 text-center font-bold text-[#867362]">
                        {rowNumber}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="w-12 h-12 rounded-lg bg-[#F6F0E6] overflow-hidden relative border border-[#DCCBB1]/50">
                          <Image
                            src={p.imageUrl}
                            alt={p.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-[#554536] block">{p.name}</span>
                        {p.isFeatured && (
                          <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded inline-block mt-0.5">
                            Unggulan
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-[#7A6A5A]">
                        {p.categoryName}
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-[#554536]">
                        {formatRupiah(p.price)}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            p.isActive
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-stone-100 text-stone-600"
                          }`}
                        >
                          {p.isActive ? "Aktif" : "Nonaktif"}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 text-[#B89A68] hover:bg-[#F6F0E6] rounded-lg transition"
                          title="Edit Produk"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Hapus Produk"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Navigation Bar */}
        {totalPages > 1 && (
          <div className="p-4 bg-[#F6F0E6]/50 border-t border-[#DCCBB1] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-[#867362]">
              Menampilkan {(validPage - 1) * pageSize + 1} -{" "}
              {Math.min(validPage * pageSize, filtered.length)} dari {filtered.length} produk
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
      </div>

      {/* Add / Edit Product Modal with Image Upload */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-[#DCCBB1] shadow-2xl relative animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-[#554536] mb-4">
              {editingProduct ? "Edit Data Produk" : "Tambah Produk Baru"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="bg-[#F6F0E6]/70 p-3.5 rounded-2xl border border-[#DCCBB1]">
                <label className="block font-bold text-[#554536] mb-1.5">
                  Pilih Kategori Produk
                </label>
                <select
                  name="categoryId"
                  value={modalCategoryId}
                  onChange={(e) => setModalCategoryId(e.target.value)}
                  className="w-full bg-white border border-[#DCCBB1] rounded-xl px-3.5 py-2 text-xs font-semibold focus:outline-none focus:border-[#B89A68]"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      [{cat.code}] {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#554536] mb-1">Nama Produk</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingProduct?.name || ""}
                  required
                  placeholder="Contoh: Kurma Ajwa Madinah Aliyah"
                  className="w-full bg-[#F6F0E6]/50 border border-[#DCCBB1] rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#B89A68]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#554536] mb-1">Harga Resmi (IDR)</label>
                <input
                  type="number"
                  name="price"
                  defaultValue={editingProduct?.price || ""}
                  required
                  placeholder="Contoh: 220000"
                  className="w-full bg-[#F6F0E6]/50 border border-[#DCCBB1] rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#B89A68]"
                />
              </div>

              {/* Image Upload (<10MB with compression) */}
              <ImageUploadField
                name="imageUrl"
                label="Foto Produk (Upload <10MB & Kompresi Otomatis)"
                currentUrl={editingProduct?.imageUrl}
                required={!editingProduct}
              />

              <div>
                <label className="block font-bold text-[#554536] mb-1">Deskripsi Produk</label>
                <textarea
                  name="description"
                  defaultValue={editingProduct?.description || ""}
                  rows={3}
                  placeholder="Keterangan singkat produk..."
                  className="w-full bg-[#F6F0E6]/50 border border-[#DCCBB1] rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#B89A68]"
                />
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    value="true"
                    defaultChecked={editingProduct?.isFeatured || false}
                    className="accent-[#B89A68]"
                  />
                  Produk Unggulan (Featured)
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    name="isActive"
                    value="true"
                    defaultChecked={editingProduct ? editingProduct.isActive : true}
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
                  {loading ? "Menyimpan..." : "Simpan Produk"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

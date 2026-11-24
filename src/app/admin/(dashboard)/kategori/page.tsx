"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Star } from "lucide-react";
import { getCategories, saveCategory, deleteCategory } from "@/lib/actions/products";
import { Category } from "@/types";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [defaultNextCode, setDefaultNextCode] = useState("001");
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    const list = await getCategories();
    const cleanList = list.filter((c) => c.slug !== "all");
    setCategories(cleanList);

    const nextNum = cleanList.length + 1;
    setDefaultNextCode(String(nextNum).padStart(3, "0"));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setShowModal(true);
  };

  const handleOpenEdit = (c: Category) => {
    setEditingCategory(c);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus kategori ini?")) {
      await deleteCategory(id);
      loadData();
    }
  };

  const popularCount = categories.filter((c) => c.isPopular).length;

  const handleTogglePopular = async (c: Category) => {
    if (!c.isPopular && popularCount >= 4) {
      alert("Maksimal 4 kategori yang dapat dijadikan populer untuk halaman utama.");
      return;
    }

    const formData = new FormData();
    formData.append("id", c.id);
    formData.append("code", c.code);
    formData.append("name", c.name);
    formData.append("slug", c.slug);
    formData.append("description", c.description || "");
    formData.append("isPopular", c.isPopular ? "false" : "true");

    await saveCategory(formData);
    loadData();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    if (editingCategory) {
      formData.append("id", editingCategory.id);
      formData.append("code", editingCategory.code);
      formData.append("isPopular", editingCategory.isPopular ? "true" : "false");
    } else {
      formData.append("code", defaultNextCode);
      const popCheck = (e.currentTarget.elements.namedItem("isPopular") as HTMLInputElement)?.checked;
      formData.append("isPopular", popCheck ? "true" : "false");
    }

    const res = await saveCategory(formData);
    setLoading(false);

    if (res?.error) {
      alert(res.error);
    } else {
      setShowModal(false);
      loadData();
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#554536]">
            Pengelolaan Kategori Produk
          </h1>
          <p className="text-xs text-[#7A6A5A] mt-0.5">
            Tandai hingga 4 kategori sebagai <strong>Populer</strong> (ikon bintang) untuk ditampilkan di beranda.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-[#B89A68] hover:bg-[#9E8253] text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Tambah Kategori Baru
        </button>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-2xl border border-[#DCCBB1] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F6F0E6] text-[#554536] font-bold border-b border-[#DCCBB1]">
              <tr>
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4">Kode Kategori</th>
                <th className="py-3 px-4">Nama Kategori</th>
                <th className="py-3 px-4">Slug</th>
                <th className="py-3 px-4">Deskripsi</th>
                <th className="py-3 px-4 text-center">Populer ({popularCount}/4)</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F6F0E6]">
              {categories.map((c, idx) => {
                const isLocked = !c.isPopular && popularCount >= 4;
                return (
                  <tr key={c.id} className="hover:bg-[#F6F0E6]/30 transition">
                    <td className="py-3 px-4 text-center font-bold text-[#867362]">
                      {idx + 1}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono bg-[#B89A68]/15 text-[#8C6F3F] font-bold px-2.5 py-1 rounded-lg border border-[#B89A68]/30">
                        {c.code || String(idx + 1).padStart(3, "0")}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-[#554536]">{c.name}</td>
                    <td className="py-3 px-4 font-mono text-[#867362]">{c.slug}</td>
                    <td className="py-3 px-4 text-[#7A6A5A] max-w-xs truncate">
                      {c.description || "-"}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleTogglePopular(c)}
                        disabled={isLocked}
                        className={`p-1.5 rounded-lg transition inline-flex items-center gap-1 text-xs font-semibold ${
                          c.isPopular
                            ? "bg-amber-100 text-amber-800 border border-amber-300"
                            : isLocked
                            ? "opacity-30 cursor-not-allowed text-stone-400"
                            : "bg-[#F6F0E6] text-[#7A6A5A] hover:bg-amber-50 hover:text-amber-700"
                        }`}
                        title={
                          c.isPopular
                            ? "Kategori Populer (Tampil di Beranda). Klik untuk membatalkan."
                            : isLocked
                            ? "Batas maksimal 4 kategori populer telah tercapai."
                            : "Jadikan Kategori Populer"
                        }
                      >
                        <Star
                          className={`w-3.5 h-3.5 ${
                            c.isPopular ? "text-amber-600 fill-amber-500" : "text-stone-400"
                          }`}
                        />
                        <span>{c.isPopular ? "Aktif" : "Bukan"}</span>
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(c)}
                        className="p-1.5 text-[#B89A68] hover:bg-[#F6F0E6] rounded-lg transition"
                        title="Edit Kategori"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Hapus Kategori"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Category Modal (Tanpa upload foto) */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#DCCBB1] shadow-2xl relative animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-[#554536] mb-4">
              {editingCategory ? "Edit Kategori" : "Tambah Kategori Baru"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Category Code Locked */}
              <div>
                <label className="block font-bold text-[#554536] mb-1">
                  Kode Kategori (Terkunci)
                </label>
                <input
                  type="text"
                  value={editingCategory?.code || defaultNextCode}
                  readOnly
                  disabled
                  className="w-full bg-stone-100 border border-[#DCCBB1] rounded-xl px-3.5 py-2 font-mono font-bold text-[#8C6F3F] cursor-not-allowed opacity-75"
                />
              </div>

              <div>
                <label className="block font-bold text-[#554536] mb-1">Nama Kategori</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingCategory?.name || ""}
                  required
                  placeholder="Contoh: Kurma Premium"
                  className="w-full bg-[#F6F0E6]/50 border border-[#DCCBB1] rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#B89A68]"
                />
              </div>

              {/* Editable Slug */}
              <div>
                <label className="block font-bold text-[#554536] mb-1">Slug URL</label>
                <input
                  type="text"
                  name="slug"
                  defaultValue={editingCategory?.slug || ""}
                  placeholder="Contoh: kurma-premium (bisa diubah)"
                  className="w-full bg-[#F6F0E6]/50 border border-[#DCCBB1] rounded-xl px-3.5 py-2 text-xs font-mono focus:outline-none focus:border-[#B89A68]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#554536] mb-1">Deskripsi Kategori</label>
                <textarea
                  name="description"
                  defaultValue={editingCategory?.description || ""}
                  rows={3}
                  placeholder="Keterangan singkat kategori..."
                  className="w-full bg-[#F6F0E6]/50 border border-[#DCCBB1] rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#B89A68]"
                />
              </div>

              {!editingCategory && (
                <div className="pt-1">
                  <label className="flex items-center gap-2 cursor-pointer font-medium">
                    <input
                      type="checkbox"
                      name="isPopular"
                      disabled={popularCount >= 4}
                      className="accent-[#B89A68]"
                    />
                    <span>
                      Jadikan Kategori Populer di Beranda {popularCount >= 4 && "(Sudah maksimal 4)"}
                    </span>
                  </label>
                </div>
              )}

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
                  {loading ? "Menyimpan..." : "Simpan Kategori"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

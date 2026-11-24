"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Trash2 } from "lucide-react";
import { getGalleries, saveGalleryItem, deleteGalleryItem } from "@/lib/actions/gallery";
import { GalleryItem } from "@/types";
import ImageUploadField from "@/components/admin/ImageUploadField";

export default function AdminGalleryPage() {
  const [galleries, setGalleries] = useState<GalleryItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    const list = await getGalleries();
    setGalleries(list);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Hapus foto ini dari galeri toko?")) {
      await deleteGalleryItem(id);
      loadData();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await saveGalleryItem(formData);
    setLoading(false);

    if (res?.error) {
      alert(res.error);
    } else {
      setShowModal(false);
      loadData();
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#554536]">Pengelolaan Galeri Toko</h1>
          <p className="text-xs text-[#7A6A5A] mt-0.5">
            Dokumentasi foto toko yang ditampilkan pada slider infinite marquee halaman utama.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-[#B89A68] hover:bg-[#9E8253] text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Tambah Foto Baru
        </button>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {galleries.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl p-3 border border-[#DCCBB1] shadow-xs flex flex-col justify-between group"
          >
            <div className="w-full h-44 rounded-xl overflow-hidden relative bg-[#F6F0E6] mb-2.5">
              <Image
                src={item.imageUrl}
                alt={item.caption}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#554536] line-clamp-2">
                {item.caption || "Tanpa keterangan"}
              </p>
            </div>
            <div className="pt-2 mt-2 border-t border-[#F6F0E6] flex items-center justify-between">
              <span className="text-[10px] text-[#867362]">Urutan: {item.displayOrder}</span>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition"
                title="Hapus Foto"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add Photo with Image Upload (<10MB with compression) */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#DCCBB1] shadow-2xl relative animate-in fade-in zoom-in-95">
            <h2 className="text-lg font-bold text-[#554536] mb-4">
              Tambah Foto ke Galeri
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <ImageUploadField
                name="imageUrl"
                label="Foto Galeri (Upload <10MB & Kompresi Otomatis)"
                required
              />

              <div>
                <label className="block font-bold text-[#554536] mb-1">Keterangan / Caption</label>
                <input
                  type="text"
                  name="caption"
                  required
                  placeholder="Contoh: Display Aneka Kurma Segar"
                  className="w-full bg-[#F6F0E6]/50 border border-[#DCCBB1] rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#B89A68]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#554536] mb-1">Nomor Urutan Tampil</label>
                <input
                  type="number"
                  name="displayOrder"
                  defaultValue={galleries.length + 1}
                  className="w-full bg-[#F6F0E6]/50 border border-[#DCCBB1] rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#B89A68]"
                />
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
                  {loading ? "Menyimpan..." : "Simpan Foto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

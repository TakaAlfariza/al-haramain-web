"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Star } from "lucide-react";
import { getTestimonials, saveTestimonial, deleteTestimonial } from "@/lib/actions/testimonials";
import { Testimonial } from "@/types";

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    const list = await getTestimonials();
    setTestimonials(list);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Hapus ulasan pelanggan ini?")) {
      await deleteTestimonial(id);
      loadData();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await saveTestimonial(formData);
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
          <h1 className="text-2xl font-bold text-[#554536]">Pengelolaan Testimoni</h1>
          <p className="text-xs text-[#7A6A5A] mt-0.5">
            Kelola ulasan nyata dari jamaah dan pelanggan yang tampil di website.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-[#B89A68] hover:bg-[#9E8253] text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Tambah Ulasan Baru
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="bg-white p-5 rounded-2xl border border-[#DCCBB1] shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex text-amber-500">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-[#554536] italic leading-relaxed mb-4">
                &ldquo;{t.message}&rdquo;
              </p>
            </div>

            <div className="pt-3 border-t border-[#F6F0E6]">
              <h4 className="text-xs font-bold text-[#554536]">{t.customerName}</h4>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#DCCBB1] shadow-2xl relative animate-in fade-in zoom-in-95">
            <h2 className="text-lg font-bold text-[#554536] mb-4">
              Tambah Ulasan Pelanggan
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#554536] mb-1">Nama Pelanggan</label>
                <input
                  type="text"
                  name="customerName"
                  required
                  placeholder="Contoh: Hj. Fatimah Zahra"
                  className="w-full bg-[#F6F0E6]/50 border border-[#DCCBB1] rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#B89A68]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#554536] mb-1">Rating Bintang (1 - 5)</label>
                <select
                  name="rating"
                  defaultValue="5"
                  className="w-full bg-[#F6F0E6]/50 border border-[#DCCBB1] rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#B89A68]"
                >
                  <option value="5">★★★★★ (5 Bintang)</option>
                  <option value="4">★★★★☆ (4 Bintang)</option>
                  <option value="3">★★★☆☆ (3 Bintang)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#554536] mb-1">Isi Ulasan</label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  placeholder="Kesan dan pesan pelanggan..."
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
                  {loading ? "Menyimpan..." : "Simpan Ulasan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

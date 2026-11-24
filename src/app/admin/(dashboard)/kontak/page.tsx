"use client";

import { useState, useEffect } from "react";
import { Save, CheckCircle2 } from "lucide-react";
import { getContactSettings, saveContactSettings } from "@/lib/actions/settings";
import { StoreContact } from "@/types";

export default function AdminContactPage() {
  const [contact, setContact] = useState<StoreContact | null>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getContactSettings().then((data) => setContact(data as StoreContact));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);

    const formData = new FormData(e.currentTarget);
    const res = await saveContactSettings(formData);
    setLoading(false);

    if (res?.error) {
      alert(res.error);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 4000);
    }
  };

  if (!contact) {
    return <div className="text-xs text-[#7A6A5A]">Memuat informasi kontak...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-[#554536]">Pengaturan Kontak & Lokasi</h1>
        <p className="text-xs text-[#7A6A5A] mt-0.5">
          Perbarui nomor WhatsApp pemesanan, alamat fisik toko, jam buka, dan link peta.
        </p>
      </div>

      {saved && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Informasi kontak berhasil disimpan dan diperbarui di website!</span>
        </div>
      )}

      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#DCCBB1] shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          <div>
            <label className="block font-bold text-[#554536] mb-1.5">
              Nomor WhatsApp Pemesanan (Gunakan format 62...)
            </label>
            <input
              type="text"
              name="whatsappNumber"
              defaultValue={contact.whatsappNumber}
              required
              placeholder="6281234567890"
              className="w-full bg-[#F6F0E6]/50 border border-[#DCCBB1] rounded-xl px-4 py-2.5 text-xs font-mono focus:outline-none focus:border-[#B89A68]"
            />
            <span className="text-[10px] text-[#867362] mt-1 block">
              Nomor ini digunakan untuk seluruh tombol pemesanan produk dan parsel di website.
            </span>
          </div>

          <div>
            <label className="block font-bold text-[#554536] mb-1.5">Alamat Fisik Toko</label>
            <textarea
              name="address"
              defaultValue={contact.address}
              required
              rows={3}
              placeholder="Alamat lengkap toko..."
              className="w-full bg-[#F6F0E6]/50 border border-[#DCCBB1] rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#B89A68]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#554536] mb-1.5">Jam Operasional</label>
              <input
                type="text"
                name="operatingHours"
                defaultValue={contact.operatingHours}
                placeholder="Senin - Minggu: 08.00 - 21.00 WIB"
                className="w-full bg-[#F6F0E6]/50 border border-[#DCCBB1] rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#B89A68]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#554536] mb-1.5">URL Google Maps</label>
              <input
                type="url"
                name="googleMapsUrl"
                defaultValue={contact.googleMapsUrl}
                placeholder="https://maps.google.com/..."
                className="w-full bg-[#F6F0E6]/50 border border-[#DCCBB1] rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#B89A68]"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#554536] mb-1.5">URL Instagram Toko</label>
            <input
              type="url"
              name="instagramUrl"
              defaultValue={contact.instagramUrl}
              placeholder="https://instagram.com/alharamain"
              className="w-full bg-[#F6F0E6]/50 border border-[#DCCBB1] rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#B89A68]"
            />
          </div>

          <div className="pt-4 border-t border-[#F6F0E6] flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#B89A68] hover:bg-[#9E8253] text-white px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition active:scale-95 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {loading ? "Menyimpan..." : "Simpan Perubahan Kontak"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

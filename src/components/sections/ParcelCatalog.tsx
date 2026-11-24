"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Sparkles, ArrowRight } from "lucide-react";
import { parcelsData } from "@/data/dummyData";
import { Parcel } from "@/types";

interface ParcelCatalogProps {
  parcels?: Parcel[];
  onSelectParcel: (parcel: Parcel) => void;
}

export default function ParcelCatalog({
  parcels = parcelsData,
  onSelectParcel,
}: ParcelCatalogProps) {
  // Requirement: Batasi hanya 4 yang muncul di halaman beranda
  const activeParcels = parcels.filter((p) => p.isActive).slice(0, 4);

  return (
    <section id="parsel" className="py-20 px-4 md:px-8 bg-[#F6F0E6]">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 bg-[#B89A68]/15 border border-[#B89A68]/40 px-3 py-1 rounded-full text-xs font-semibold text-[#8C6F3F] mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-[#B89A68]" />
            Katalog Parsel Haji Eksklusif
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#554536]">
            Pilihan Paket Parsel Haji
          </h2>
          <p className="text-xs md:text-sm text-[#7A6A5A] mt-2 leading-relaxed">
            Praktis, rapi, dan siap dibagikan. Klik <strong>&quot;Lihat Detail&quot;</strong> untuk melihat rincian isi paket dan harga resmi.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {activeParcels.map((parcel) => (
            <div
              key={parcel.id}
              className="bg-white rounded-2xl p-5 border border-[#DCCBB1] shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Photo */}
                <div className="w-full h-52 rounded-xl bg-[#F6F0E6] overflow-hidden mb-4 relative">
                  <Image
                    src={parcel.imageUrl}
                    alt={parcel.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {parcel.label && (
                    <span className="absolute top-2.5 right-2.5 bg-[#B89A68] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                      {parcel.label}
                    </span>
                  )}
                </div>

                {/* Name & Short Description */}
                <h3 className="font-bold text-lg text-[#554536] mb-1 group-hover:text-[#B89A68] transition">
                  {parcel.name}
                </h3>
                <p className="text-xs text-[#7A6A5A] leading-relaxed">
                  {parcel.description}
                </p>
              </div>

              {/* Action Button: Opens Detail Popup Modal */}
              <div className="pt-5 mt-4 border-t border-[#F6F0E6]">
                <button
                  onClick={() => onSelectParcel(parcel)}
                  className="w-full bg-[#B89A68] hover:bg-[#9E8253] text-white py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition active:scale-95"
                >
                  Lihat Detail Paket
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Requirement: Tombol Tampilkan Semua Parsel menuju /parsel */}
        <div className="mt-12 text-center">
          <Link
            href="/parsel"
            className="inline-flex items-center gap-2.5 bg-[#B89A68] hover:bg-[#9E8253] text-white px-8 py-3.5 rounded-full font-bold text-xs shadow-md shadow-[#B89A68]/20 transition-all hover:translate-y-[-1px] active:scale-95"
          >
            <span>Tampilkan Semua Parsel</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <span className="block text-[11px] text-[#867362] mt-2">
            Lihat seluruh pilihan varian paket parsel haji dan umroh Al Haramain
          </span>
        </div>
      </div>
    </section>
  );
}

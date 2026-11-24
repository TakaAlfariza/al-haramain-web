"use client";

import Image from "next/image";
import { galleryData } from "@/data/dummyData";
import { GalleryItem } from "@/types";

interface StoreGalleryProps {
  items?: GalleryItem[];
  onSelectPhoto: (item: GalleryItem) => void;
}

export default function StoreGallery({
  items = galleryData,
  onSelectPhoto,
}: StoreGalleryProps) {
  const activeItems = items.filter((g) => g.isActive);
  // Duplicate array for seamless infinite marquee loop
  const marqueeItems = [...activeItems, ...activeItems];

  return (
    <section id="galeri" className="pt-10 pb-16 md:pt-12 md:pb-20 bg-white/70 border-t border-b border-[#DCCBB1]/30 overflow-hidden">
      {/* Header dibuat lebih ke atas dengan padding yang lebih ramping */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 mb-6 text-center">
        <span className="text-xs font-bold uppercase tracking-wider text-[#B89A68] block mb-1">
          Dokumentasi Toko
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-[#554536]">
          Galeri & Suasana Toko Al Haramain
        </h2>
      </div>

      {/* Infinite Marquee Track dengan ukuran foto yang diperbesar */}
      <div className="marquee-container w-full overflow-hidden cursor-pointer py-2">
        <div className="animate-marquee flex gap-5">
          {marqueeItems.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              onClick={() => onSelectPhoto(item)}
              className="w-72 md:w-96 h-56 md:h-72 rounded-2xl overflow-hidden shadow-sm hover:shadow-md relative group flex-shrink-0 border border-[#DCCBB1]/60 transition-all duration-300"
            >
              <Image
                src={item.imageUrl}
                alt={item.caption}
                fill
                sizes="(max-width: 768px) 288px, 384px"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
                <span className="text-white text-xs md:text-sm font-semibold tracking-wide drop-shadow-sm line-clamp-2">
                  {item.caption}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

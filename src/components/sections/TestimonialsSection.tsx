"use client";

import { Star, Quote } from "lucide-react";
import { testimonialsData } from "@/data/dummyData";
import { Testimonial } from "@/types";

interface TestimonialsSectionProps {
  testimonials?: Testimonial[];
}

export default function TestimonialsSection({
  testimonials = testimonialsData,
}: TestimonialsSectionProps) {
  // 1. Ambil maksimal 10 testimoni aktif terbaru
  const activeList = (testimonials && testimonials.length > 0 ? testimonials : testimonialsData).filter(
    (t) => t.isActive
  );
  const latestTen = activeList.slice(0, 10);

  // 2. Buat set data untuk infinite marquee yang seamless (bergeser ke kiri seperti dokumentasi toko)
  let baseList = [...latestTen];
  if (baseList.length > 0) {
    while (baseList.length < 8) {
      baseList = [...baseList, ...latestTen];
    }
  }
  const marqueeItems = [...baseList, ...baseList];

  return (
    <section className="py-16 md:py-20 bg-white/70 border-t border-b border-[#DCCBB1]/30 overflow-hidden relative">
      {/* Section Header */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 mb-8 md:mb-10 text-center">
        <span className="text-xs font-bold uppercase tracking-wider text-[#B89A68] block mb-1">
          Ulasan Pelanggan
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-[#554536]">
          Kata Jamaah & Pelanggan Al Haramain
        </h2>
        <p className="text-xs md:text-sm text-[#7A6A5A] mt-1.5 max-w-xl mx-auto">
          Kepuasan dan keberkahan oleh-oleh tanah suci untuk menyambut sanak keluarga tercinta.
        </p>
      </div>

      {/* Marquee Wrapper with subtle gradient fade edges */}
      <div className="relative w-full">
        {/* Left Gradient Fade */}
        <div className="hidden sm:block absolute left-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-r from-white/90 via-white/40 to-transparent z-10 pointer-events-none" />

        {/* Right Gradient Fade */}
        <div className="hidden sm:block absolute right-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-l from-white/90 via-white/40 to-transparent z-10 pointer-events-none" />

        {/* Infinite Marquee Track (bergeser ke kiri, pause on hover) */}
        <div className="marquee-container w-full overflow-hidden cursor-default py-3">
          <div className="animate-marquee-slow flex gap-5">
            {marqueeItems.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className="w-80 md:w-96 p-5 md:p-6 rounded-2xl bg-white border border-[#DCCBB1] shadow-xs hover:shadow-md hover:border-[#B89A68] transition-all duration-300 flex flex-col justify-between flex-shrink-0 relative group"
              >
                {/* Decorative Top Quote Icon */}
                <Quote className="w-8 h-8 text-[#B89A68]/15 absolute top-4 right-4 group-hover:text-[#B89A68]/25 transition-colors" />

                <div>
                  {/* Gold Stars */}
                  <div className="flex items-center gap-1 text-amber-500 mb-3">
                    {[...Array(Math.max(1, Math.min(5, item.rating || 5)))].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current text-amber-500" />
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-xs md:text-sm text-[#554536] italic leading-relaxed mb-5 min-h-[60px] line-clamp-4">
                    &ldquo;{item.message}&rdquo;
                  </p>
                </div>

                {/* Customer Info */}
                <div className="flex items-center gap-3 pt-3.5 border-t border-[#F6F0E6]">
                  <div className="w-9 h-9 rounded-full bg-[#B89A68] text-white flex items-center justify-center font-bold text-xs shadow-xs flex-shrink-0">
                    {item.customerName.trim().substring(0, 2).toUpperCase()}
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="text-xs font-bold text-[#554536] truncate">
                      {item.customerName}
                    </h4>
                    <span className="text-[10px] text-[#867362] block truncate">
                      {item.location || "Jamaah Umrah / Haji"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

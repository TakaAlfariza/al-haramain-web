"use client";

import { useEffect } from "react";
import Image from "next/image";
import { X, CheckCircle2, MessageCircle } from "lucide-react";
import { Parcel } from "@/types";
import { formatRupiah } from "@/lib/formatters";
import { createWhatsAppUrl, getParcelWhatsAppMessage } from "@/lib/whatsapp";

interface ParcelDetailModalProps {
  parcel: Parcel | null;
  onClose: () => void;
}

export default function ParcelDetailModal({
  parcel,
  onClose,
}: ParcelDetailModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (parcel) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [parcel, onClose]);

  if (!parcel) return null;

  const waMessage = getParcelWhatsAppMessage(parcel.name);
  const waUrl = createWhatsAppUrl(undefined, waMessage);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="parcel-modal-title"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 transition-all"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full border border-[#DCCBB1] shadow-2xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button [ X ] */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-stone-100 text-[#554536] flex items-center justify-center shadow-md font-bold transition"
          aria-label="Tutup Detail Paket"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 2-Column Responsive Layout (Desktop: side-by-side, Mobile: stacked) */}
        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
          {/* Left Column: Package Image */}
          <div className="md:col-span-5 bg-[#F6F0E6] p-5 flex items-center justify-center">
            <div className="w-full h-56 md:h-full min-h-[240px] rounded-2xl overflow-hidden relative shadow-inner">
              <Image
                src={parcel.imageUrl}
                alt={parcel.name}
                fill
                sizes="(max-width: 768px) 100vw, 300px"
                className="object-cover"
              />
            </div>
          </div>

          {/* Right Column: Package Details */}
          <div className="md:col-span-7 p-6 md:p-8 flex flex-col justify-between">
            <div>
              {parcel.label && (
                <span className="bg-[#B89A68]/15 text-[#8C6F3F] text-[11px] font-bold px-3 py-0.5 rounded-full inline-block mb-2 border border-[#B89A68]/30">
                  {parcel.label}
                </span>
              )}
              <h3
                id="parcel-modal-title"
                className="text-xl md:text-2xl font-bold text-[#554536]"
              >
                {parcel.name}
              </h3>
              <p className="text-xs text-[#7A6A5A] mt-1.5 leading-relaxed">
                {parcel.description}
              </p>

              {/* Contents Bullet List with Gold Checkmarks */}
              <div className="mt-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#B89A68] mb-2.5">
                  Rincian Isi Paket:
                </h4>
                <ul className="space-y-2 text-xs text-[#554536]">
                  {parcel.contents.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#B89A68] flex-shrink-0 mt-0.5" />
                      <span className="leading-tight">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Price & Action Section */}
            <div className="pt-6 mt-6 border-t border-[#F6F0E6]">
              <div className="flex items-baseline justify-between mb-4">
                <span className="text-xs text-[#7A6A5A] font-medium">Harga Resmi:</span>
                <span className="text-2xl font-bold text-[#554536]">
                  {formatRupiah(parcel.price)}
                </span>
              </div>

              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                Pesan Paket via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

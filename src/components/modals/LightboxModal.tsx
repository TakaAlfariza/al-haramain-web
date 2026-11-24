"use client";

import { useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { GalleryItem } from "@/types";

interface LightboxModalProps {
  item: GalleryItem | null;
  onClose: () => void;
}

export default function LightboxModal({ item, onClose }: LightboxModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (item) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [item, onClose]);

  if (!item) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.caption}
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-3xl w-full text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-11 right-0 text-white hover:text-stone-300 font-semibold text-sm flex items-center gap-1 p-2"
        >
          <X className="w-5 h-5" />
          Tutup
        </button>

        <div className="relative w-full h-[65vh] rounded-2xl overflow-hidden shadow-2xl border border-white/20">
          <Image
            src={item.imageUrl}
            alt={item.caption}
            fill
            sizes="100vw"
            className="object-contain"
          />
        </div>

        <p className="text-[#EFE8DC] font-medium text-sm mt-3.5 tracking-wide">
          {item.caption}
        </p>
      </div>
    </div>
  );
}

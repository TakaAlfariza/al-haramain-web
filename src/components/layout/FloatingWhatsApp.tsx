"use client";

import { MessageCircle } from "lucide-react";
import { createWhatsAppUrl, getGeneralWhatsAppMessage } from "@/lib/whatsapp";

export default function FloatingWhatsApp() {
  const waUrl = createWhatsAppUrl(undefined, getGeneralWhatsAppMessage());

  return (
    <aside
      aria-label="Kontak WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 group"
    >
      {/* Tooltip Notification */}
      <div className="hidden sm:block bg-white text-[#554536] text-xs font-medium py-1.5 px-3.5 rounded-xl shadow-lg border border-[#DCCBB1] group-hover:scale-105 transition-transform pointer-events-none">
        Butuh bantuan belanja atau ingin pesan? 👋
      </div>

      {/* Floating Action Button */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat WhatsApp Admin"
        className="animate-wa-pulse w-14 h-14 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full flex items-center justify-center shadow-xl transition-transform active:scale-90"
        title="Chat WhatsApp Al Haramain"
      >
        <MessageCircle className="w-7 h-7 fill-current" />
      </a>
    </aside>
  );
}

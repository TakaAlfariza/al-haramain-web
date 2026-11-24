import { MapPin, Clock, MessageCircle, ExternalLink } from "lucide-react";
import { storeContactData } from "@/data/dummyData";
import { createWhatsAppUrl, getGeneralWhatsAppMessage } from "@/lib/whatsapp";
import { StoreContact } from "@/types";

interface ContactSectionProps {
  contact?: StoreContact;
}

export default function ContactSection({
  contact = storeContactData,
}: ContactSectionProps) {
  const waUrl = createWhatsAppUrl(contact.whatsappNumber, getGeneralWhatsAppMessage());

  return (
    <section id="kontak" className="py-20 px-4 md:px-8 bg-[#F6F0E6]">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Contact Details */}
          <div className="md:col-span-5 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#B89A68] block mb-1">
                Lokasi & Pemesanan
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-[#554536]">
                Kunjungi Toko Kami atau Pesan Online
              </h2>
            </div>

            <div className="space-y-4 pt-1 text-xs text-[#554536]">
              {/* Address */}
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#DCCBB1]/50 flex items-center justify-center text-[#B89A68] flex-shrink-0 mt-0.5 border border-[#DCCBB1]">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#554536]">Alamat Toko</h4>
                  <p className="text-[#7A6A5A] mt-0.5 leading-relaxed">
                    {contact.address}
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#DCCBB1]/50 flex items-center justify-center text-[#B89A68] flex-shrink-0 mt-0.5 border border-[#DCCBB1]">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#554536]">Jam Operasional</h4>
                  <p className="text-[#7A6A5A] mt-0.5">
                    {contact.operatingHours}
                  </p>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#DCCBB1]/50 flex items-center justify-center text-[#25D366] flex-shrink-0 mt-0.5 border border-[#DCCBB1]">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#554536]">WhatsApp Pemesanan</h4>
                  <p className="text-[#7A6A5A] mt-0.5 font-mono">
                    {contact.displayPhone} (Konsultasi & Order Cepat)
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white px-6 py-3 rounded-xl font-bold text-xs shadow-sm transition active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                Kirim Pesan WhatsApp Sekarang
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Map Frame */}
          <div className="md:col-span-7 bg-white p-3.5 rounded-3xl border border-[#DCCBB1] shadow-sm">
            <div className="w-full h-80 rounded-2xl bg-[#EFE8DC] relative overflow-hidden flex items-center justify-center border border-[#DCCBB1]/60">
              {/* Map grid simulation pattern */}
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#B89A68_1.5px,transparent_1.5px)] [background-size:18px_18px]"></div>

              <div className="relative text-center p-6 bg-white/95 backdrop-blur-sm rounded-2xl border border-[#B89A68]/40 shadow-lg max-w-sm mx-4">
                <div className="w-11 h-11 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-2.5 font-bold shadow-xs">
                  <MapPin className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-[#554536]">
                  Toko Resmi Al Haramain
                </h4>
                <p className="text-xs text-[#7A6A5A] mt-1 leading-relaxed">
                  {contact.address}
                </p>
                <a
                  href={contact.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs text-[#B89A68] hover:text-[#9E8253] font-semibold border border-[#B89A68]/30 px-3 py-1.5 rounded-lg hover:bg-[#F6F0E6] transition"
                >
                  Buka Petunjuk Arah di Google Maps
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

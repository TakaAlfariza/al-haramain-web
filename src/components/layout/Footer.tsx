import { MessageCircle, MapPin, Clock } from "lucide-react";
import { storeContactData } from "@/data/dummyData";

export default function Footer() {
  return (
    <footer className="bg-[#3F3327] text-[#DCCBB1] pt-14 pb-8 px-4 md:px-8 border-t border-[#DCCBB1]/30">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#554536]">
        {/* Brand Column */}
        <div className="space-y-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#B89A68] flex items-center justify-center text-white font-bold text-lg">
              ح
            </div>
            <span className="font-bold text-lg text-white tracking-wider">
              AL HARAMAIN
            </span>
          </div>
          <p className="text-xs text-[#C5B39B] leading-relaxed">
            Pusat penyedia oleh-oleh haji, kurma pilihan, air zamzam original bergaransi, dan paket parsel siap bagikan dengan pelayanan ramah dan amanah.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3.5">
            Navigasi Cepat
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <a href="#hero" className="hover:text-[#B89A68] transition">
                Home / Beranda
              </a>
            </li>
            <li>
              <a href="#produk" className="hover:text-[#B89A68] transition">
                Katalog Produk
              </a>
            </li>
            <li>
              <a href="#parsel" className="hover:text-[#B89A68] transition">
                Paket Parsel Haji
              </a>
            </li>
            <li>
              <a href="#galeri" className="hover:text-[#B89A68] transition">
                Dokumentasi Galeri
              </a>
            </li>
            <li>
              <a href="#tentang" className="hover:text-[#B89A68] transition">
                Tentang Al Haramain
              </a>
            </li>
          </ul>
        </div>

        {/* Layanan & Keunggulan */}
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3.5">
            Layanan Kami
          </h4>
          <ul className="space-y-2 text-xs text-[#C5B39B]">
            <li>Paket Parsel Custom Sesuai Budget</li>
            <li>Pengiriman Seluruh Indonesia</li>
            <li>Kerjasama Biro Travel Haji & Umrah</li>
            <li>Garansi Keaslian Air Zamzam</li>
            <li>Kemasan Rapi & Higienis</li>
          </ul>
        </div>

        {/* Kontak & Jam Buka */}
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3.5">
            Hubungi Toko
          </h4>
          <div className="space-y-2.5 text-xs text-[#C5B39B]">
            <p className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#B89A68] flex-shrink-0 mt-0.5" />
              <span>{storeContactData.address}</span>
            </p>
            <p className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#B89A68] flex-shrink-0" />
              <span>{storeContactData.operatingHours}</span>
            </p>
            <p className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-[#25D366] flex-shrink-0" />
              <span>{storeContactData.displayPhone}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-6xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#9E8B75]">
        <p>© 2026 Al Haramain. Seluruh Hak Cipta Dilindungi.</p>
        <p>Konsep Desain: Minimalist Modern Islamic Retail</p>
      </div>
    </footer>
  );
}

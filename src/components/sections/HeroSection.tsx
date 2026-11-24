import Image from "next/image";
import { ArrowRight, MessageCircle, ShieldCheck, Sparkles, Check } from "lucide-react";
import { createWhatsAppUrl, getGeneralWhatsAppMessage } from "@/lib/whatsapp";

export default function HeroSection() {
  const waUrl = createWhatsAppUrl(undefined, getGeneralWhatsAppMessage());

  return (
    <section id="hero" className="relative pt-28 pb-16 md:pt-36 md:pb-24 px-4 md:px-8 overflow-hidden">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        
        {/* Left Text Column */}
        <div className="md:col-span-7 space-y-6 text-center md:text-left">
          
          <div className="inline-flex items-center gap-2 bg-[#DCCBB1]/35 border border-[#B89A68]/40 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#554536]">
            <span className="w-2 h-2 rounded-full bg-[#B89A68] animate-ping"></span>
            Oleh-Oleh Haji & Khas Timur Tengah Terpercaya
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight md:leading-[1.18] text-[#554536]">
            Temukan Beragam{" "}
            <span className="text-[#B89A68] relative inline-block">
              Oleh-Oleh Haji
              <svg
                className="absolute -bottom-1 left-0 w-full h-2 text-[#B89A68]/40"
                viewBox="0 0 100 12"
                preserveAspectRatio="none"
              >
                <path d="M0,0 Q50,12 100,0" stroke="currentColor" strokeWidth="4" fill="none" />
              </svg>
            </span>{" "}
            Pilihan untuk Setiap Momen Istimewa.
          </h1>

          <p className="text-base text-[#7A6A5A] max-w-xl mx-auto md:mx-0 leading-relaxed">
            Menyediakan aneka kurma premium pilihan, air zamzam terjamin keasliannya, camilan khas Arab, hingga paket parsel eksklusif siap bagikan untuk menyambut keluarga dan kerabat.
          </p>

          {/* Dual Call To Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3.5 pt-2">
            <a
              href="#produk"
              className="w-full sm:w-auto bg-[#B89A68] hover:bg-[#9E8253] text-white px-7 py-3.5 rounded-full text-sm font-semibold flex items-center justify-center gap-2.5 shadow-md shadow-[#B89A68]/20 transition-all hover:translate-y-[-1px] active:scale-95"
            >
              Lihat Katalog Produk
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-white hover:bg-stone-50 border border-[#DCCBB1] text-[#554536] px-6 py-3.5 rounded-full text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition active:scale-95"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366] fill-current" />
              Hubungi via WhatsApp
            </a>
          </div>

          {/* Trust Value Badges */}
          <div className="pt-4 flex flex-wrap items-center justify-center md:justify-start gap-6 text-xs text-[#7A6A5A]">
            <div className="flex items-center gap-1.5 font-medium">
              <Check className="w-4 h-4 text-[#B89A68]" />
              100% Produk Berkualitas
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <Check className="w-4 h-4 text-[#B89A68]" />
              Air Zamzam Asli & Resmi
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <Check className="w-4 h-4 text-[#B89A68]" />
              Siap Kirim Seluruh Indonesia
            </div>
          </div>
        </div>

        {/* Right Image Column: Modern Islamic Arch */}
        <div className="md:col-span-5 flex justify-center">
          <div className="relative w-full max-w-sm">
            {/* Ambient Background Glow */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-[#B89A68]/30 to-[#DCCBB1]/30 rounded-full blur-2xl -z-10"></div>

            {/* Arch Container */}
            <div className="relative bg-white p-3.5 rounded-t-[140px] rounded-b-3xl shadow-xl border border-[#DCCBB1]">
              <div className="w-full h-[400px] rounded-t-[130px] rounded-b-2xl overflow-hidden relative bg-[#EFE8DC]">
                <Image
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"
                  alt="Kurma Ajwa Madinah dan Parsel Al Haramain"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#554536]/85 via-transparent to-transparent flex flex-col justify-end p-6">
                  <span className="bg-[#B89A68] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full w-fit mb-1.5">
                    Pilihan Utama
                  </span>
                  <h3 className="text-white font-bold text-lg">
                    Kurma Ajwa & Parsel Madinah
                  </h3>
                  <p className="text-stone-200 text-xs mt-0.5">
                    Kualitas nomor satu langsung dari tanah suci
                  </p>
                </div>
              </div>

              {/* Floating Decorative Card */}
              <div className="absolute -bottom-4 -left-4 bg-white border border-[#DCCBB1] rounded-2xl p-3 shadow-lg flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F6F0E6] flex items-center justify-center text-[#B89A68]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#554536] block">
                    Kemasan Higienis
                  </span>
                  <span className="text-[10px] text-[#7A6A5A]">
                    Siap sambut kepulangan haji
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

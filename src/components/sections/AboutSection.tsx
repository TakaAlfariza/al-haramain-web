import Image from "next/image";
import { Package, ShieldCheck, Gift, HeartHandshake, MessageCircle } from "lucide-react";

export default function AboutSection() {
  const advantages = [
    {
      icon: Package,
      title: "Pilihan Beragam",
      desc: "Kurma ajwa & sukari, zamzam murni, camilan khas, parfum, hingga sajadah lengkap.",
    },
    {
      icon: ShieldCheck,
      title: "Kualitas Terjamin",
      desc: "Hanya produk pilihan dengan garansi keaslian dan masa simpan yang terjaga higienis.",
    },
    {
      icon: Gift,
      title: "Paket Parsel Siap Bagikan",
      desc: "Tersedia kemasan hantaran eksklusif dan rapi tanpa perlu repot membungkus sendiri.",
    },
    {
      icon: HeartHandshake,
      title: "Pelayanan Ramah",
      desc: "Tim kami siap melayani dan memberikan rekomendasi terbaik sesuai anggaran Anda.",
    },
    {
      icon: MessageCircle,
      title: "Pemesanan Mudah via WA",
      desc: "Pesan langsung dengan admin melalui WhatsApp tanpa ribet proses registrasi akun.",
    },
  ];

  return (
    <section id="tentang" className="py-20 px-4 md:px-8 bg-[#F6F0E6]">
      <div className="max-w-6xl mx-auto">
        
        {/* Story & Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center mb-16">
          <div className="md:col-span-6 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#B89A68]">
              Mengenal Al Haramain
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-[#554536] leading-tight">
              Menghadirkan Keberkahan Tanah Suci ke Rumah Anda
            </h2>
            <p className="text-xs md:text-sm text-[#7A6A5A] leading-relaxed">
              Al Haramain didirikan dengan dedikasi untuk memudahkan para jamaah haji, umrah, serta masyarakat luas dalam mendapatkan oleh-oleh khas Timur Tengah berkualitas premium tanpa kekhawatiran kelebihan bagasi pesawat atau keaslian produk.
            </p>
            <p className="text-xs md:text-sm text-[#7A6A5A] leading-relaxed">
              Setiap kurma, kacang, hingga air zamzam kami kurasi dengan standar higienis tertinggi, menjamin kesegaran rasa dan keaslian yang berkah untuk dibagikan kepada keluarga dan tetangga tercinta.
            </p>
          </div>

          <div className="md:col-span-6 grid grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-[#DCCBB1] shadow-xs text-center">
              <span className="text-3xl font-bold text-[#B89A68] block mb-1">10+</span>
              <span className="text-xs text-[#554536] font-semibold">Tahun Pengalaman</span>
              <p className="text-[10px] text-[#7A6A5A] mt-0.5">Melayani jamaah Indonesia</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-[#DCCBB1] shadow-xs text-center">
              <span className="text-3xl font-bold text-[#B89A68] block mb-1">5.000+</span>
              <span className="text-xs text-[#554536] font-semibold">Parsel Terkirim</span>
              <p className="text-[10px] text-[#7A6A5A] mt-0.5">Siap bagikan tanpa repot</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-[#DCCBB1] shadow-xs text-center">
              <span className="text-3xl font-bold text-[#B89A68] block mb-1">100%</span>
              <span className="text-xs text-[#554536] font-semibold">Garansi Zamzam Asli</span>
              <p className="text-[10px] text-[#7A6A5A] mt-0.5">Segel resmi bandara</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-[#DCCBB1] shadow-xs text-center">
              <span className="text-3xl font-bold text-[#B89A68] block mb-1">Fast</span>
              <span className="text-xs text-[#554536] font-semibold">Respon WhatsApp</span>
              <p className="text-[10px] text-[#7A6A5A] mt-0.5">Konsultasi ramah setiap hari</p>
            </div>
          </div>
        </div>

        {/* 5 Keunggulan Al Haramain */}
        <div className="border-t border-[#DCCBB1]/60 pt-14">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#B89A68] block mb-1">
              Keunggulan Kami
            </span>
            <h3 className="font-bold text-xl md:text-2xl text-[#554536]">
              5 Alasan Utama Memilih Al Haramain
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {advantages.map((adv, index) => {
              const Icon = adv.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-5 rounded-2xl border border-[#DCCBB1]/60 shadow-xs hover:shadow-md transition text-center flex flex-col items-center"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#F6F0E6] flex items-center justify-center text-[#B89A68] mb-3.5 border border-[#DCCBB1]/50">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-xs text-[#554536] mb-1.5">
                    {adv.title}
                  </h4>
                  <p className="text-[11px] text-[#7A6A5A] leading-relaxed">
                    {adv.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}

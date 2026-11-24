"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MessageCircle, Menu, X } from "lucide-react";
import { createWhatsAppUrl, getGeneralWhatsAppMessage } from "@/lib/whatsapp";

interface NavbarProps {
  onContactClick?: () => void;
}

export default function Navbar({ onContactClick }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const generalWaUrl = createWhatsAppUrl(undefined, getGeneralWhatsAppMessage());

  // Link menggunakan rute absolute /#anchor agar saat berada di halaman /produk atau /parsel,
  // klik navigasi tetap kembali mengarah ke beranda (home)
  const navLinks = [
    { label: "Home", href: "/#hero" },
    { label: "Katalog Produk", href: "/#produk" },
    { label: "Paket Parsel", href: "/#parsel", isBadge: true },
    { label: "Galeri Toko", href: "/#galeri" },
    { label: "Tentang Kami", href: "/#tentang" },
    { label: "Kontak", href: "/#kontak" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-[#F6F0E6]/95 backdrop-blur-md shadow-sm border-b border-[#DCCBB1]/50 py-3"
          : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* Brand Logo - Mengarah ke Home ( / ) dari halaman mana pun */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#B89A68] to-[#8C6F3F] flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">
            ح
          </div>
          <div className="leading-tight">
            <span className="font-bold text-lg tracking-tight text-[#554536] group-hover:text-[#B89A68] transition">
              AL HARAMAIN
            </span>
            <span className="block text-[10px] text-[#7A6A5A] tracking-wider uppercase font-medium">
              Oleh-Oleh Haji & Umrah
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-7 text-sm font-medium text-[#554536]">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-[#B89A68] transition-colors py-1 relative flex items-center gap-1.5"
            >
              <span>{link.label}</span>
              {link.isBadge && (
                <span className="bg-[#B89A68] text-white text-[9px] px-1.5 py-0.2 rounded-full font-bold">
                  Populer
                </span>
              )}
            </Link>
          ))}
        </div>

        {/* Desktop Action CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href={generalWaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#B89A68] hover:bg-[#9E8253] text-white px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 shadow-sm transition active:scale-95"
          >
            <MessageCircle className="w-4 h-4" />
            Hubungi Kami
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#554536] hover:text-[#B89A68] focus:outline-none"
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#F6F0E6] border-b border-[#DCCBB1] px-4 pt-3 pb-5 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm text-[#554536] hover:bg-white/80 transition"
              >
                <span>{link.label}</span>
                {link.isBadge && (
                  <span className="bg-[#B89A68] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                    Populer
                  </span>
                )}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-[#DCCBB1]/40 mt-2">
            <a
              href={generalWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full bg-[#B89A68] text-white py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 text-sm shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              Chat WhatsApp Admin
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

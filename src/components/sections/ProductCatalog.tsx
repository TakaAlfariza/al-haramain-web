"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, ArrowRight } from "lucide-react";
import { categoriesData, productsData } from "@/data/dummyData";
import { formatRupiah } from "@/lib/formatters";
import { createWhatsAppUrl, getProductWhatsAppMessage } from "@/lib/whatsapp";
import { Product, Category } from "@/types";

interface ProductCatalogProps {
  products?: Product[];
  categories?: Category[];
}

export default function ProductCatalog({
  products = productsData,
  categories = categoriesData,
}: ProductCatalogProps) {
  const [activeCategory, setActiveCategory] = useState("all");

  const activeProducts = products.filter((p) => p.isActive);

  // Filter products by selected category (handles both category id and slug matching)
  const filteredProducts =
    activeCategory === "all"
      ? activeProducts
      : activeProducts.filter((p) => {
          if (p.categoryId === activeCategory) return true;
          const matchingCat = categories.find(
            (c) => c.id === p.categoryId || c.code === p.categoryCode
          );
          return (
            matchingCat?.id === activeCategory ||
            matchingCat?.slug === activeCategory ||
            p.slug === activeCategory
          );
        });

  // Requirement: Batasi hanya 6 saja yang muncul di halaman beranda
  const displayProducts = filteredProducts.slice(0, 6);

  // Requirement: Batasi hanya maksimal 4 kategori populer yang muncul (+ tab Semua Produk)
  const popularCategories = categories
    .filter((c) => c.slug !== "all" && c.isPopular)
    .slice(0, 4);

  // If no category marked popular, fallback to the first 4 real categories
  const resolvedPopularCats =
    popularCategories.length > 0
      ? popularCategories
      : categories.filter((c) => c.slug !== "all").slice(0, 4);

  const displayCategoryTabs = [
    { id: "all", code: "000", name: "Semua Produk", slug: "all" } as Category,
    ...resolvedPopularCats,
  ];

  return (
    <section id="produk" className="py-20 px-4 md:px-8 bg-white/70 border-t border-b border-[#DCCBB1]/30">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#B89A68] block mb-1">
            Katalog Pilihan
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-[#554536]">
            Produk Oleh-Oleh Favorit
          </h2>
          <p className="text-xs md:text-sm text-[#7A6A5A] mt-2">
            Pilihan lengkap kurma berkualitas, air zamzam original, camilan khas, dan perlengkapan ibadah untuk keluarga di rumah.
          </p>
        </div>

        {/* Category Pills Filter Bar (Maksimal 4 kategori populer pilihan admin + Semua Produk) */}
        <div className="flex items-center justify-start md:justify-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar text-xs">
          {displayCategoryTabs.map((cat) => {
            const isTabActive =
              activeCategory === cat.id ||
              (cat.slug === "all" && activeCategory === "all");

            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full font-semibold transition whitespace-nowrap ${
                  isTabActive
                    ? "bg-[#B89A68] text-white shadow-sm"
                    : "bg-white text-[#554536] hover:bg-[#F6F0E6] border border-[#DCCBB1]"
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Product Cards Grid (Maksimal 6 produk di halaman utama) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayProducts.map((product) => {
            const waUrl = createWhatsAppUrl(
              undefined,
              getProductWhatsAppMessage(product.name)
            );

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl p-4 border border-[#DCCBB1]/60 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Photo Container */}
                  <div className="w-full h-48 rounded-xl bg-[#F6F0E6] overflow-hidden relative mb-3.5">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.isFeatured && (
                      <span className="absolute top-2.5 left-2.5 bg-[#B89A68] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                        Favorit
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] font-medium text-[#867362] uppercase tracking-wider">
                    {product.categoryName}
                  </span>
                  <h3 className="font-bold text-[#554536] text-base group-hover:text-[#B89A68] transition-colors mt-0.5">
                    {product.name}
                  </h3>
                  <p className="text-xs text-[#7A6A5A] mt-1 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Card Bottom: Price and WA Order Button */}
                <div className="pt-4 border-t border-[#F6F0E6] mt-4 flex items-center justify-between">
                  <div>
                    {product.unit && (
                      <span className="text-[10px] text-[#867362] block">
                        Harga {product.unit}
                      </span>
                    )}
                    <span className="font-bold text-[#554536] text-sm">
                      {formatRupiah(product.price)}
                    </span>
                  </div>

                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs px-3.5 py-1.5 rounded-full font-semibold flex items-center gap-1.5 transition shadow-sm active:scale-95"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-current" />
                    Pesan WA
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Products CTA Button with clear breadcrumb navigation */}
        <div className="mt-12 text-center">
          <Link
            href="/produk"
            className="inline-flex items-center gap-2.5 bg-[#B89A68] hover:bg-[#9E8253] text-white px-8 py-3.5 rounded-full font-bold text-xs shadow-md shadow-[#B89A68]/20 transition-all hover:translate-y-[-1px] active:scale-95"
          >
            <span>Tampilkan Semua Produk</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <span className="block text-[11px] text-[#867362] mt-2">
            Lihat seluruh pilihan oleh-oleh haji lengkap dengan filter kategori & pencarian
          </span>
        </div>
      </div>
    </section>
  );
}

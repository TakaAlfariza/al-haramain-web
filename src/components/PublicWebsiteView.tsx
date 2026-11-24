"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";
import HeroSection from "@/components/sections/HeroSection";
import ProductCatalog from "@/components/sections/ProductCatalog";
import ParcelCatalog from "@/components/sections/ParcelCatalog";
import StoreGallery from "@/components/sections/StoreGallery";
import AboutSection from "@/components/sections/AboutSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import ContactSection from "@/components/sections/ContactSection";
import ParcelDetailModal from "@/components/modals/ParcelDetailModal";
import LightboxModal from "@/components/modals/LightboxModal";
import { Product, Category, Parcel, GalleryItem, Testimonial, StoreContact } from "@/types";

interface PublicWebsiteViewProps {
  products: Product[];
  categories: Category[];
  parcels: Parcel[];
  galleries: GalleryItem[];
  testimonials: Testimonial[];
  contact: StoreContact;
}

export default function PublicWebsiteView({
  products,
  categories,
  parcels,
  galleries,
  testimonials,
  contact,
}: PublicWebsiteViewProps) {
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);
  const [selectedGalleryItem, setSelectedGalleryItem] = useState<GalleryItem | null>(null);

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* 1. Header Navigation */}
      <Navbar />

      {/* 2. Main Landing Page Sections */}
      <main className="flex-grow">
        {/* Section 1: Hero */}
        <HeroSection />

        {/* Section 2: Product Catalog & Filter */}
        <ProductCatalog products={products} categories={categories} />

        {/* Section 3: Parcel Packages (Strict PRD Compliance) */}
        <ParcelCatalog parcels={parcels} onSelectParcel={(parcel) => setSelectedParcel(parcel)} />

        {/* Section 4: Store Gallery (Infinite Marquee) */}
        <StoreGallery items={galleries} onSelectPhoto={(item) => setSelectedGalleryItem(item)} />

        {/* Section 5: About Us & 5 Advantages */}
        <AboutSection />

        {/* Section 6: Testimonials */}
        <TestimonialsSection testimonials={testimonials} />

        {/* Section 7: Store Location & Contact */}
        <ContactSection contact={contact} />
      </main>

      {/* 3. Footer */}
      <Footer />

      {/* 4. Floating WhatsApp CTA */}
      <FloatingWhatsApp />

      {/* 5. Parcel Detail Modal Popup */}
      <ParcelDetailModal
        parcel={selectedParcel}
        onClose={() => setSelectedParcel(null)}
      />

      {/* 6. Gallery Lightbox Modal */}
      <LightboxModal
        item={selectedGalleryItem}
        onClose={() => setSelectedGalleryItem(null)}
      />
    </div>
  );
}

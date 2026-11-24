export interface Category {
  id: string; // 5 digit contoh "00001"
  code: string; // 3 digit contoh "001", "002"
  name: string;
  slug: string;
  description?: string;
  isActive?: boolean;
  isPopular?: boolean;
}

export interface Product {
  id: string; // 5 digit contoh "00001"
  productCode: string; // [kode kategori + kode produk] contoh "00100001"
  categoryId: string; // ID kategori contoh "00001"
  categoryCode?: string; // Kode kategori contoh "001"
  categoryName: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  imageUrl: string;
  isFeatured?: boolean;
  isActive: boolean;
  unit?: string;
}

export interface Parcel {
  id: string; // 5 digit contoh "00001"
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  contents: string[];
  price: number;
  label?: string;
  isFeatured?: boolean;
  isActive: boolean;
  displayOrder?: number;
}

export interface GalleryItem {
  id: string; // 5 digit contoh "00001"
  imageUrl: string;
  caption: string;
  displayOrder: number;
  isActive: boolean;
}

export interface Testimonial {
  id: string; // 5 digit contoh "00001"
  customerName: string;
  location?: string;
  message: string;
  rating: number;
  isActive: boolean;
}

export interface StoreContact {
  id?: string;
  whatsappNumber: string;
  displayPhone: string;
  address: string;
  operatingHours: string;
  instagramUrl: string;
  googleMapsUrl: string;
}

export type UserRole = "admin" | "staff";

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  passwordHash?: string;
  createdAt?: string;
}

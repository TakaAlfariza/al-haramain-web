export const DEFAULT_WHATSAPP = "6281234567890";

export function createWhatsAppUrl(
  phone: string = DEFAULT_WHATSAPP,
  message: string
): string {
  const sanitizedPhone = phone.replace(/[^0-9]/g, "");
  return `https://wa.me/${sanitizedPhone}?text=${encodeURIComponent(message)}`;
}

export function getProductWhatsAppMessage(productName: string): string {
  return `Halo Al Haramain, saya tertarik dengan produk ${productName}. Apakah produk ini tersedia?`;
}

export function getParcelWhatsAppMessage(parcelName: string): string {
  return `Halo Al Haramain, saya tertarik dengan ${parcelName}. Boleh minta informasi lebih lanjut mengenai paket tersebut?`;
}

export function getGeneralWhatsAppMessage(): string {
  return `Halo Al Haramain, saya ingin konsultasi seputar oleh-oleh haji dan paket parsel yang tersedia.`;
}

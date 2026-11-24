import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Al Haramain | Toko Oleh-Oleh Haji & Paket Parsel",
  description:
    "Temukan berbagai pilihan oleh-oleh haji, kurma premium, air zamzam original, makanan khas Arab, dan paket parsel pilihan di Al Haramain.",
  keywords: [
    "oleh-oleh haji",
    "parsel haji",
    "kurma ajwa",
    "air zamzam",
    "sajadah turki",
    "al haramain",
    "retail oleh-oleh",
  ],
  openGraph: {
    title: "Al Haramain | Toko Oleh-Oleh Haji & Paket Parsel",
    description:
      "Temukan berbagai pilihan oleh-oleh haji, kurma premium, air zamzam original, dan paket parsel pilihan di Al Haramain.",
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={plusJakartaSans.variable} suppressHydrationWarning>
      <body
        className="bg-[var(--color-cream)] text-[var(--color-brown)] antialiased min-h-screen selection:bg-[var(--color-gold)] selection:text-white"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}

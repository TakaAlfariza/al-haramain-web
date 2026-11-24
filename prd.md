PRD.md — Al Haramain
Product Requirements Document

Nama Produk: Al Haramain – Website Retail Oleh-Oleh Haji
Versi Dokumen: 1.0
Status: Initial Draft
Platform: Responsive Web Application
Bahasa: Indonesia
Target Pengguna: Pelanggan retail dan administrator toko

1. Project Overview
1.1 Deskripsi Proyek

Al Haramain merupakan website retail untuk bisnis yang bergerak di bidang penjualan oleh-oleh haji dan produk khas Timur Tengah.

Website dirancang sebagai platform digital untuk memperkenalkan bisnis, menampilkan katalog produk, menyediakan informasi paket parsel, memperlihatkan galeri toko, serta memudahkan pelanggan melakukan pemesanan melalui WhatsApp.

Website dilengkapi dengan Admin Content Management System (CMS) sehingga pemilik bisnis dapat mengelola seluruh konten tanpa perlu mengubah kode program.

1.2 Tujuan Proyek
Membangun identitas digital profesional untuk Al Haramain.
Mempermudah pelanggan menemukan produk oleh-oleh haji.
Menampilkan katalog paket parsel secara menarik dan informatif.
Mempermudah pemesanan melalui WhatsApp.
Memberikan kemudahan pengelolaan konten melalui Admin CMS.
Meningkatkan kepercayaan pelanggan melalui foto, informasi toko, dan testimoni.
1.3 Konsep Desain

Website menggunakan konsep:

Minimalist Modern Islamic Retail

Karakteristik desain:

Clean dan minimalis.
Elegan dan profesional.
Memiliki sentuhan visual Islami.
Mengutamakan foto produk.
Navigasi sederhana.
Responsive pada desktop, tablet, dan smartphone.
Color Palette
Warna	Hex	Penggunaan
Cream	#F6F0E6	Background utama
White	#FFFFFF	Card dan section
Beige	#DCCBB1	Elemen dekoratif
Soft Gold	#B89A68	Accent dan highlight
Dark Brown	#554536	Teks utama
Light Gray	#F4F4F2	Background alternatif
Typography

Rekomendasi:

Primary Font: Plus Jakarta Sans.
Alternative Font: Inter.
Heading: SemiBold atau Bold.
Body: Regular.
Button: Medium atau SemiBold.
2. Target Pengguna
2.1 Customer

Pelanggan yang ingin:

Mengetahui informasi toko Al Haramain.
Melihat katalog produk.
Mengetahui pilihan paket parsel.
Melihat isi dan harga paket parsel.
Melihat foto toko dan produk.
Menghubungi admin melalui WhatsApp.
2.2 Administrator

Pemilik toko atau staf yang memiliki akses untuk:

Mengelola produk.
Mengelola paket parsel.
Mengelola galeri foto.
Mengubah informasi bisnis.
Mengelola testimoni.
Mengatur informasi WhatsApp.
Melihat statistik website.
3. Scope of Project
3.1 In Scope

Fitur yang termasuk dalam pengembangan:

Public Website
Landing Page.
Navigation Bar.
Hero Section.
Product Catalog.
Product Categories.
Featured Products.
Parcel Packages.
Parcel Detail Popup.
Store Gallery.
About Us.
Business Advantages.
Customer Testimonials.
Contact Section.
WhatsApp Integration.
Footer.
Admin CMS
Admin Authentication.
Dashboard.
Product Management.
Product Category Management.
Parcel Package Management.
Gallery Management.
About Us Management.
Testimonial Management.
Contact Management.
Website Settings.
Basic Analytics.
3.2 Out of Scope

Fitur yang belum termasuk dalam versi pertama:

Online payment gateway.
Shopping cart.
Customer account registration.
Automatic order processing.
Inventory synchronization.
Delivery tracking.
Multi-branch management.

Pemesanan pada versi pertama dilakukan melalui WhatsApp.

4. Website Information Architecture
4.1 Public Website Structure
text
/
├── Home
├── Produk
│   ├── Kategori Produk
│   └── Detail Produk
├── Paket Parsel
│   └── Popup Detail Paket
├── Galeri
├── About Us
├── Testimoni
├── Contact
└── Footer

4.2 Admin CMS Structure
text
/admin
├── Login
├── Dashboard
├── Produk
│   ├── Daftar Produk
│   ├── Tambah Produk
│   ├── Edit Produk
│   └── Kategori Produk
├── Paket Parsel
│   ├── Daftar Paket
│   ├── Tambah Paket
│   └── Edit Paket
├── Galeri
│   ├── Daftar Foto
│   └── Upload Foto
├── About Us
├── Testimoni
├── Kontak
├── Pengaturan Website
└── Profil Admin

5. Functional Requirements — Public Website
5.1 Navigation Bar

Navbar menjadi navigasi utama website.

Menu:

Home
Produk
Paket Parsel
Galeri
About Us
Contact

Requirements:

Logo Al Haramain menggunakan logo dummy.
Navbar responsive.
Sticky navbar ketika halaman di-scroll.
Mobile menggunakan hamburger menu.
Menu mengarah ke section yang sesuai.
Terdapat tombol Hubungi Kami.
5.2 Hero Section

Menjadi section pertama yang dilihat pengunjung.

Content:

Logo atau brand name Al Haramain.
Headline.
Deskripsi bisnis.
Hero image.
CTA Lihat Produk.
CTA Hubungi Kami.

Contoh headline:

"Temukan Beragam Oleh-Oleh Haji Pilihan untuk Setiap Momen Istimewa."

Requirements:

Gambar dapat dikelola melalui CMS.
CTA Lihat Produk menuju katalog.
CTA Hubungi Kami membuka WhatsApp.
Animasi masuk yang ringan.
Layout responsive.
5.3 Product Catalog

Menampilkan produk yang dijual Al Haramain.

Contoh kategori:

Kurma.
Air Zamzam.
Kacang dan Camilan Arab.
Makanan Khas Timur Tengah.
Perlengkapan Ibadah.
Produk Oleh-Oleh Haji Lainnya.

Product Card berisi:

Foto produk.
Nama produk.
Kategori.
Harga dalam format Rupiah.
Tombol Detail.
Tombol Pesan via WhatsApp.

Product Detail:

Foto produk.
Nama produk.
Deskripsi.
Harga.
Informasi tambahan.
Tombol WhatsApp.

Requirements:

Produk ditampilkan secara dinamis dari database.
Produk dapat difilter berdasarkan kategori.
Produk nonaktif tidak ditampilkan.
Harga menggunakan format IDR.
Foto menggunakan rasio yang konsisten.
5.4 Parcel Package Catalog

Merupakan salah satu fitur utama website Al Haramain.

Paket parsel ditampilkan dalam bentuk card terpisah.

Contoh nama paket:

Paket Barakah.
Paket Madinah.
Paket Makkah.
Paket Exclusive.
Paket Custom.
Parcel Card

Informasi yang terlihat pada card:

Foto paket.
Nama paket.
Deskripsi singkat.
Tombol Lihat Detail.

PENTING: Harga dan isi paket tidak boleh ditampilkan langsung pada Parcel Card.

Informasi harga dan isi hanya ditampilkan ketika pengguna membuka popup detail.

Parcel Detail Popup

Ketika tombol Lihat Detail ditekan, website menampilkan modal popup di tengah layar.

Layout Desktop:

text
+------------------------------------------------------+
|                                              [ X ]   |
|                                                      |
|   +----------------+   Nama Paket                    |
|   |                |                                 |
|   |                |   Deskripsi Paket               |
|   |   FOTO PAKET   |                                 |
|   |                |   Isi Paket:                    |
|   |                |   - Produk A                    |
|   |                |   - Produk B                    |
|   |                |   - Produk C                    |
|   |                |                                 |
|   +----------------+   Harga: Rp350.000             |
|                                                      |
|                       [ Pesan via WhatsApp ]         |
+------------------------------------------------------+

Popup Requirements
Foto paket berada di sebelah kiri.
Informasi paket berada di sebelah kanan.
Nama paket ditampilkan dengan jelas.
Deskripsi paket ditampilkan.
Isi paket menggunakan daftar bullet.
Harga ditampilkan setelah daftar isi.
Harga menggunakan format Rupiah (Rp).
Tombol WhatsApp berada di bagian bawah informasi.
Tombol close berada di kanan atas.
Klik area luar modal dapat menutup popup.
Tombol Escape dapat menutup popup.
Modal harus responsive.
Mobile Layout

Pada smartphone:

Foto berada di bagian atas.
Nama dan deskripsi berada di bawah foto.
Daftar isi paket ditampilkan secara vertikal.
Harga ditampilkan dengan jelas.
Tombol WhatsApp menggunakan full width.
Format Harga

Contoh:

Rp150.000
Rp250.000
Rp350.000
Rp1.000.000

Gunakan locale Indonesia dengan format:

Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })

Parcel WhatsApp Message

Contoh pesan otomatis:

"Halo Al Haramain, saya tertarik dengan Paket Barakah. Boleh minta informasi lebih lanjut mengenai paket tersebut?"

Pesan harus otomatis menyesuaikan nama paket yang dipilih.

5.5 Store Gallery

Menampilkan dokumentasi toko Al Haramain.

Jenis foto:

Tampak depan toko.
Interior toko.
Rak produk.
Display oleh-oleh.
Produk unggulan.
Aktivitas toko.
Gallery Animation

Menggunakan Infinite Horizontal Image Slider.

Requirements:

Foto bergerak dari kanan ke kiri.
Animasi berjalan secara smooth.
Animasi dapat berhenti sementara ketika di-hover.
Pengguna dapat mengklik gambar untuk melihat ukuran lebih besar.
Mendukung touch swipe pada perangkat mobile.
Admin dapat mengatur urutan gambar.
Admin dapat mengaktifkan atau menonaktifkan foto.
Menghormati preferensi reduced motion pengguna.
5.6 About Us

Menampilkan profil Al Haramain.

Content:

Judul About Us.
Deskripsi bisnis.
Sejarah singkat.
Visi.
Misi.
Foto toko.

Seluruh informasi dapat diubah melalui Admin CMS.

5.7 Business Advantages

Menampilkan keunggulan Al Haramain.

Contoh:

Pilihan oleh-oleh haji yang beragam.
Produk pilihan berkualitas.
Pilihan paket parsel.
Pelayanan ramah.
Pemesanan mudah melalui WhatsApp.

Informasi dapat dikelola melalui CMS.

5.8 Customer Testimonials

Menampilkan ulasan pelanggan.

Content:

Nama pelanggan.
Foto profil opsional.
Isi testimoni.
Rating.
Status publikasi.

Testimoni dapat ditambahkan dan dikelola oleh admin.

5.9 Contact Section

Menampilkan informasi bisnis:

Nomor WhatsApp.
Alamat toko.
Google Maps.
Instagram.
Informasi operasional.

Semua informasi dapat diperbarui melalui CMS.

5.10 WhatsApp Integration

Website menggunakan WhatsApp sebagai saluran pemesanan.

Nomor sementara:

6281234567890

Catatan: Nomor tersebut merupakan placeholder dan harus diganti dengan nomor WhatsApp bisnis yang sebenarnya.

Floating WhatsApp Button

Requirements:

Selalu tersedia pada halaman publik.
Berada di bagian kanan bawah.
Menggunakan ikon WhatsApp.
Membuka WhatsApp dengan pesan default.
Dynamic WhatsApp Message

Pesan untuk produk:

"Halo Al Haramain, saya tertarik dengan produk [Nama Produk]. Apakah produk ini tersedia?"

Pesan untuk paket:

"Halo Al Haramain, saya tertarik dengan [Nama Paket]. Boleh minta informasi lebih lanjut?"

Format URL:

javascript
const phone = "6281234567890";
const message = "Halo Al Haramain, saya tertarik dengan Paket Barakah.";

const whatsappUrl =
  `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;


WhatsApp dibuka melalui browser atau aplikasi WhatsApp sesuai perangkat pelanggan.

Website tidak mengirim pesan secara otomatis tanpa tindakan pelanggan. Pelanggan tetap menekan tombol Send di WhatsApp.

5.11 Footer

Berisi:

Logo Al Haramain.
Deskripsi singkat.
Navigasi website.
Kontak.
Social Media.
Copyright.
6. Functional Requirements — Admin CMS
6.1 Admin Authentication

Admin harus login sebelum dapat mengakses dashboard.

Requirements:

Login email dan password.
Logout.
Session management.
Protected admin routes.
Password tidak disimpan dalam bentuk plaintext.
Admin tidak dapat mengakses halaman pengelolaan tanpa autentikasi.

Versi pertama menggunakan satu akun admin utama.

6.2 Dashboard

Dashboard menampilkan ringkasan website.

Statistik:

Total produk.
Total paket parsel.
Total kategori produk.
Total foto galeri.
Total testimoni.
Jumlah pengunjung jika analytics tersedia.

Dashboard juga menyediakan:

Quick Actions.
Produk terbaru.
Paket terbaru.
Shortcut menuju pengelolaan konten.
6.3 Product Management

Admin dapat:

Melihat daftar produk.
Menambahkan produk.
Mengedit produk.
Menghapus produk.
Mengunggah foto.
Memilih kategori.
Mengatur harga.
Mengatur deskripsi.
Mengatur status aktif/nonaktif.
Mengatur featured product.

Product Fields:

Field	Type	Required
Name	Text	Yes
Slug	Text	Yes
Category	Relation	Yes
Description	Text	No
Price	Numeric	Yes
Image	File	Yes
Is Featured	Boolean	No
Is Active	Boolean	Yes
Created At	Timestamp	Automatic
6.4 Category Management

Admin dapat:

Menambah kategori.
Mengubah nama kategori.
Mengubah slug.
Menghapus kategori jika tidak digunakan.
Mengatur status kategori.
6.5 Parcel Management

Admin dapat:

Menambahkan paket.
Mengedit paket.
Menghapus paket.
Upload foto.
Mengubah nama paket.
Mengubah deskripsi.
Mengubah isi paket.
Mengubah harga.
Mengatur label paket.
Mengaktifkan atau menonaktifkan paket.
Mengatur urutan tampil.

Parcel Fields:

Field	Type	Required
Name	Text	Yes
Slug	Text	Yes
Description	Text	No
Image	File	Yes
Contents	Array of Text	Yes
Price	Numeric	Yes
Label	Text	No
Is Featured	Boolean	No
Is Active	Boolean	Yes
Display Order	Integer	No
Created At	Timestamp	Automatic

Catatan: Harga dan Contents tetap disimpan di database, tetapi hanya ditampilkan pada Parcel Detail Popup di halaman publik.

6.6 Gallery Management

Admin dapat:

Upload beberapa foto.
Menghapus foto.
Mengedit keterangan.
Mengatur urutan.
Mengatur status tampil.
Mengatur foto unggulan.

Gallery Fields:

Image URL.
Caption.
Display Order.
Is Active.
Created At.
6.7 About Us Management

Admin dapat mengedit:

Judul.
Deskripsi.
Sejarah.
Visi.
Misi.
Foto pendukung.
6.8 Testimonial Management

Admin dapat:

Menambah testimoni.
Mengedit testimoni.
Menghapus testimoni.
Mengatur nama pelanggan.
Mengatur rating.
Upload foto opsional.
Mengatur status publikasi.
6.9 Contact Management

Admin dapat mengubah:

Nomor WhatsApp.
Alamat toko.
Link Google Maps.
Instagram.
Email.
Jam operasional.
6.10 Website Settings

Admin dapat mengatur:

Logo.
Favicon.
Nama bisnis.
Hero image.
Hero headline.
Hero description.
SEO title.
SEO description.
Social media links.

Logo sementara menggunakan logo dummy dengan tulisan Al Haramain.

7. Database Design

Database menggunakan PostgreSQL melalui Supabase.

7.1 Tables
admins
Column	Type
id	UUID
email	VARCHAR
created_at	TIMESTAMP

Password dikelola oleh Supabase Auth, bukan disimpan langsung pada tabel admins.

categories
Column	Type
id	UUID
name	VARCHAR
slug	VARCHAR
description	TEXT
is_active	BOOLEAN
created_at	TIMESTAMP
products
Column	Type
id	UUID
category_id	UUID
name	VARCHAR
slug	VARCHAR
description	TEXT
price	BIGINT
image_url	TEXT
is_featured	BOOLEAN
is_active	BOOLEAN
created_at	TIMESTAMP
updated_at	TIMESTAMP
parcels
Column	Type
id	UUID
name	VARCHAR
slug	VARCHAR
description	TEXT
image_url	TEXT
contents	JSONB
price	BIGINT
label	VARCHAR
is_featured	BOOLEAN
is_active	BOOLEAN
display_order	INTEGER
created_at	TIMESTAMP
updated_at	TIMESTAMP
galleries
Column	Type
id	UUID
image_url	TEXT
caption	TEXT
display_order	INTEGER
is_active	BOOLEAN
created_at	TIMESTAMP
testimonials
Column	Type
id	UUID
customer_name	VARCHAR
photo_url	TEXT
message	TEXT
rating	INTEGER
is_active	BOOLEAN
created_at	TIMESTAMP
about
Column	Type
id	UUID
title	VARCHAR
description	TEXT
history	TEXT
vision	TEXT
mission	TEXT
image_url	TEXT
updated_at	TIMESTAMP
contact_settings
Column	Type
id	UUID
whatsapp_number	VARCHAR
address	TEXT
google_maps_url	TEXT
instagram_url	TEXT
email	VARCHAR
operating_hours	TEXT
updated_at	TIMESTAMP
website_settings
Column	Type
id	UUID
business_name	VARCHAR
logo_url	TEXT
favicon_url	TEXT
hero_title	TEXT
hero_description	TEXT
hero_image_url	TEXT
seo_title	TEXT
seo_description	TEXT
updated_at	TIMESTAMP
8. Technology Stack
8.1 Frontend
Next.js.
React.
TypeScript.
Tailwind CSS.
Lucide Icons.
8.2 Backend
Next.js Server Components.
Next.js Server Actions atau API Routes.
Supabase.
8.3 Database
PostgreSQL.
Supabase Database.
8.4 Authentication
Supabase Auth.
8.5 Image Storage
Supabase Storage.

Storage buckets:

products
parcels
gallery
testimonials
branding
8.6 Deployment
Vercel.
Supabase Cloud.
9. UI/UX Requirements
9.1 Responsive Design

Website harus mendukung:

Desktop.
Laptop.
Tablet.
Smartphone.
9.2 Animation

Animasi yang diperbolehkan:

Smooth scrolling.
Fade-in.
Slide-up.
Hover transition.
Gallery infinite slider.
Modal transition.

Animasi tidak boleh mengganggu performa dan kenyamanan pengguna.

9.3 Loading States

Setiap proses asynchronous harus memiliki feedback:

Loading indicator.
Empty state.
Error state.
Success notification.
9.4 Image Optimization
Gunakan format WebP atau AVIF jika memungkinkan.
Gunakan lazy loading untuk gambar di luar viewport awal.
Gunakan ukuran gambar yang sesuai.
Hindari gambar dengan resolusi terlalu besar.
9.5 Accessibility
Kontras teks harus memadai.
Setiap gambar memiliki alt text.
Tombol memiliki label yang jelas.
Modal mendukung navigasi keyboard.
Form memiliki label.
Animasi menghormati prefers-reduced-motion.
10. Security Requirements
Semua halaman admin harus dilindungi autentikasi.
Hak akses pengelolaan konten hanya diberikan kepada admin.
Gunakan Supabase Row Level Security (RLS).
Validasi data dilakukan di server.
Validasi file upload berdasarkan tipe dan ukuran.
Jangan mengekspos Supabase Service Role Key di frontend.
Gunakan environment variables.
Batasi akses upload dan delete storage untuk admin.
Sanitasi input untuk mencegah konten berbahaya.
Gunakan HTTPS pada production.
Pastikan data publik hanya dapat dibaca sesuai kebutuhan website.
11. SEO Requirements

Website harus mendukung:

Dynamic page metadata.
SEO title.
Meta description.
Open Graph metadata.
Sitemap.xml.
Robots.txt.
Semantic HTML.
Image alt text.
Structured data LocalBusiness jika informasi bisnis tersedia.

Contoh SEO Title:

"Al Haramain | Toko Oleh-Oleh Haji dan Parsel"

Contoh SEO Description:

"Temukan berbagai pilihan oleh-oleh haji, kurma, produk khas Arab, dan paket parsel pilihan di Al Haramain."

12. User Flow
12.1 Customer Flow
text
Customer Opens Website
        |
        v
    Landing Page
        |
        v
  Browse Products
        |
        +-------------------+
        |                   |
        v                   v
   Product Detail      Parcel Catalog
        |                   |
        v                   v
  WhatsApp Button      Lihat Detail
        |                   |
        |                   v
        |              Detail Popup
        |                   |
        +---------+---------+
                  |
                  v
           WhatsApp Opens
                  |
                  v
          Customer Sends Message

12.2 Admin Flow
text
Admin Opens Dashboard
          |
          v
        Login
          |
          v
      Dashboard
          |
          v
    Select Management
          |
          +--------------------+
          |         |          |
          v         v          v
       Produk    Parsel      Galeri
          |         |          |
          v         v          v
        CRUD      CRUD        CRUD
          |         |          |
          +---------+----------+
                    |
                    v
              Database
                    |
                    v
           Public Website Updated

13. Acceptance Criteria

Website dianggap memenuhi kebutuhan apabila:

Public Website
Landing page dapat diakses tanpa login.
Navbar dapat digunakan pada desktop dan mobile.
Logo dummy tampil dengan baik.
Hero section menampilkan informasi bisnis.
Katalog produk mengambil data dari database.
Kategori produk dapat digunakan untuk filter.
Paket parsel ditampilkan dalam bentuk card.
Harga dan isi parsel tidak muncul pada card.
Tombol Lihat Detail membuka popup.
Popup menampilkan gambar di kiri dan informasi di kanan pada desktop.
Popup menampilkan isi dan harga paket.
Harga menggunakan format Rupiah.
Popup responsive pada mobile.
Tombol WhatsApp menghasilkan pesan sesuai produk atau paket.
Galeri bergerak secara horizontal ke kiri.
Galeri dapat dikelola melalui CMS.
About Us mengambil data dari database.
Testimoni dapat ditampilkan.
Informasi kontak dapat diakses.
Floating WhatsApp berfungsi.
Admin CMS
Admin dapat login.
Halaman admin terlindungi.
Dashboard menampilkan statistik.
Admin dapat CRUD produk.
Admin dapat CRUD kategori.
Admin dapat CRUD paket parsel.
Admin dapat mengatur harga dan isi parsel.
Admin dapat upload foto.
Admin dapat mengelola galeri.
Admin dapat mengedit About Us.
Admin dapat mengelola testimoni.
Admin dapat mengubah nomor WhatsApp.
Admin dapat mengubah logo.
Admin dapat mengubah pengaturan website.
Perubahan konten tersimpan di database.
Perubahan konten tampil pada website publik.
14. Development Priority
Phase 1 — Foundation
Project initialization.
Setup Next.js.
Setup Tailwind CSS.
Setup Supabase.
Setup database.
Setup authentication.
Setup design system.
Phase 2 — Public Website
Navbar.
Hero.
Product catalog.
Parcel catalog.
Parcel detail popup.
Gallery.
About Us.
Contact.
WhatsApp integration.
Footer.
Phase 3 — Admin CMS
Admin login.
Dashboard.
Product management.
Category management.
Parcel management.
Gallery management.
About management.
Testimonial management.
Contact management.
Website settings.
Phase 4 — Integration
Connect frontend to database.
Connect CMS to public website.
Integrate Supabase Storage.
Implement dynamic WhatsApp links.
Implement image optimization.
Phase 5 — Testing & Deployment
Functional testing.
Responsive testing.
Authentication testing.
Database security testing.
Performance optimization.
SEO verification.
Production deployment.
15. Placeholder Configuration

Semua informasi yang belum tersedia menggunakan data dummy.

Item	Placeholder
Business Name	Al Haramain
Logo	Dummy Al Haramain Logo
WhatsApp	6281234567890
Address	Belum ditentukan
Instagram	Belum ditentukan
Email	Belum ditentukan
Product Data	Sample Products
Parcel Data	Sample Packages
Gallery	Sample Store Photos

Placeholder harus mudah diganti melalui Admin CMS.

16. Future Improvements

Fitur yang dapat dipertimbangkan pada pengembangan berikutnya:

Advanced Analytics — Statistik pengunjung dan produk paling banyak dilihat.
Product Search — Pencarian produk berdasarkan nama.
Custom Parcel Builder — Pelanggan memilih isi parsel sesuai budget.
WhatsApp Order Tracking — Pencatatan referensi pesanan untuk membantu admin.
Multiple Admin Roles — Pembagian hak akses admin.
Promotional Banner — Banner promo yang dapat dikelola melalui CMS.
SEO Analytics — Pemantauan performa pencarian.
Product Availability — Informasi ketersediaan produk.

17. Final Project Definition

Al Haramain akan dikembangkan sebagai website retail oleh-oleh haji dengan desain minimalist modern bernuansa cream, putih, beige, dan soft gold.

Website memiliki dua bagian utama:

1. Public Website

Menampilkan identitas bisnis.
Menampilkan katalog produk.
Menampilkan paket parsel.
Menampilkan popup detail paket.
Menampilkan galeri toko.
Menampilkan informasi bisnis.
Memfasilitasi pemesanan melalui WhatsApp.

2. Admin CMS

Mengelola seluruh produk.
Mengelola kategori.
Mengelola paket parsel.
Mengelola galeri.
Mengelola About Us.
Mengelola testimoni.
Mengelola kontak.
Mengelola pengaturan website.

Prinsip utama pengembangan:

Clean UI.
Responsive Design.
Dynamic Content Management.
Secure Admin Dashboard.
Optimized Performance.
Easy Content Updates.
WhatsApp-Based Ordering.

Dokumen PRD ini menjadi acuan utama dalam proses desain, pengembangan, integrasi, testing, dan deployment website Al Haramain.
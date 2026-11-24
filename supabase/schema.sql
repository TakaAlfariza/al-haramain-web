-- ==============================================================================
-- DATABASE SCHEMA: AL HARAMAIN (RETAIL OLEH-OLEH HAJI)
-- PostgreSQL & Supabase Engine
-- Versi: 2.0 (Format ID 5-Digit '00001' & Kode Kategori/Produk '00100001')
-- ==============================================================================

-- 1. Enable UUID & PGCrypto Extensions (untuk auth & password hashing)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. CREATE TABLES DENGAN ID 5-DIGIT
-- ==============================================================================

-- 2.1 Admins Table
CREATE TABLE IF NOT EXISTS public.admins (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2.2 Product Categories (ID 5 Digit '00001', Kode Kategori '001')
CREATE TABLE IF NOT EXISTS public.categories (
    id VARCHAR(10) PRIMARY KEY, -- Format 5 digit: '00001'
    code VARCHAR(10) NOT NULL UNIQUE, -- Format 3 digit: '001', '002', dst.
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    is_popular BOOLEAN DEFAULT false NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2.2.1 Users & Roles (Admin vs Staff dengan BCrypt Password Hash)
CREATE TABLE IF NOT EXISTS public.users (
    id VARCHAR(10) PRIMARY KEY, -- Format 5 digit: '00001'
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'staff' CHECK (role IN ('admin', 'staff')),
    password_hash TEXT NOT NULL, -- Enkripsi Password dengan BCrypt / pgcrypto
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2.3 Products (ID 5 Digit '00001', Kode Gabungan '00100001')
CREATE TABLE IF NOT EXISTS public.products (
    id VARCHAR(10) PRIMARY KEY, -- Format 5 digit produk: '00001'
    product_code VARCHAR(25) NOT NULL UNIQUE, -- Format gabungan: [kode kategori + kode produk] contoh '00100001'
    category_id VARCHAR(10) NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    price BIGINT NOT NULL,
    image_url TEXT NOT NULL,
    is_featured BOOLEAN DEFAULT false NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2.4 Parcel Packages (ID 5 Digit '00001')
CREATE TABLE IF NOT EXISTS public.parcels (
    id VARCHAR(10) PRIMARY KEY, -- Format 5 digit: '00001'
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT NOT NULL,
    contents JSONB NOT NULL DEFAULT '[]'::jsonb,
    price BIGINT NOT NULL,
    label VARCHAR(100),
    is_featured BOOLEAN DEFAULT false NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    display_order INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2.5 Galleries (ID 5 Digit '00001')
CREATE TABLE IF NOT EXISTS public.galleries (
    id VARCHAR(10) PRIMARY KEY, -- Format 5 digit: '00001'
    image_url TEXT NOT NULL,
    caption TEXT,
    display_order INTEGER DEFAULT 0 NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2.6 Customer Testimonials (ID 5 Digit '00001')
CREATE TABLE IF NOT EXISTS public.testimonials (
    id VARCHAR(10) PRIMARY KEY, -- Format 5 digit: '00001'
    customer_name VARCHAR(255) NOT NULL,
    photo_url TEXT,
    message TEXT NOT NULL,
    rating INTEGER DEFAULT 5 NOT NULL CHECK (rating >= 1 AND rating <= 5),
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2.7 About Us Profile (ID 5 Digit '00001')
CREATE TABLE IF NOT EXISTS public.about (
    id VARCHAR(10) PRIMARY KEY DEFAULT '00001',
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    history TEXT,
    vision TEXT,
    mission TEXT,
    image_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2.8 Contact & Social Settings (ID 5 Digit '00001')
CREATE TABLE IF NOT EXISTS public.contact_settings (
    id VARCHAR(10) PRIMARY KEY DEFAULT '00001',
    whatsapp_number VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    google_maps_url TEXT,
    instagram_url TEXT,
    email VARCHAR(255),
    operating_hours TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2.9 Website & SEO Settings (ID 5 Digit '00001')
CREATE TABLE IF NOT EXISTS public.website_settings (
    id VARCHAR(10) PRIMARY KEY DEFAULT '00001',
    business_name VARCHAR(255) NOT NULL,
    logo_url TEXT,
    favicon_url TEXT,
    hero_title TEXT,
    hero_description TEXT,
    hero_image_url TEXT,
    seo_title TEXT,
    seo_description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 3. INDEXES
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_code ON public.products(product_code);
CREATE INDEX IF NOT EXISTS idx_categories_code ON public.categories(code);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_parcels_active_order ON public.parcels(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_galleries_active_order ON public.galleries(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_testimonials_active ON public.testimonials(is_active);

-- ==============================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parcels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (auth.role() = 'authenticated');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Categories
DROP POLICY IF EXISTS "Public read active categories" ON public.categories;
CREATE POLICY "Public read active categories" ON public.categories
    FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Admin full manage categories" ON public.categories;
DROP POLICY IF EXISTS "Public manage categories" ON public.categories;
CREATE POLICY "Public manage categories" ON public.categories
    FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- RLS Products
DROP POLICY IF EXISTS "Public read active products" ON public.products;
CREATE POLICY "Public read active products" ON public.products
    FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Admin full manage products" ON public.products;
DROP POLICY IF EXISTS "Public manage products" ON public.products;
CREATE POLICY "Public manage products" ON public.products
    FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- RLS Parcels
DROP POLICY IF EXISTS "Public read active parcels" ON public.parcels;
CREATE POLICY "Public read active parcels" ON public.parcels
    FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Admin full manage parcels" ON public.parcels;
DROP POLICY IF EXISTS "Public manage parcels" ON public.parcels;
CREATE POLICY "Public manage parcels" ON public.parcels
    FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- RLS Galleries
DROP POLICY IF EXISTS "Public read active galleries" ON public.galleries;
CREATE POLICY "Public read active galleries" ON public.galleries
    FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Admin full manage galleries" ON public.galleries;
DROP POLICY IF EXISTS "Public manage galleries" ON public.galleries;
CREATE POLICY "Public manage galleries" ON public.galleries
    FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- RLS Testimonials
DROP POLICY IF EXISTS "Public read active testimonials" ON public.testimonials;
CREATE POLICY "Public read active testimonials" ON public.testimonials
    FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Admin full manage testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Public manage testimonials" ON public.testimonials;
CREATE POLICY "Public manage testimonials" ON public.testimonials
    FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- RLS About
DROP POLICY IF EXISTS "Public read about" ON public.about;
CREATE POLICY "Public read about" ON public.about
    FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Admin full manage about" ON public.about;
DROP POLICY IF EXISTS "Public manage about" ON public.about;
CREATE POLICY "Public manage about" ON public.about
    FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- RLS Contact
DROP POLICY IF EXISTS "Public read contact_settings" ON public.contact_settings;
CREATE POLICY "Public read contact_settings" ON public.contact_settings
    FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Admin full manage contact_settings" ON public.contact_settings;
DROP POLICY IF EXISTS "Public manage contact_settings" ON public.contact_settings;
CREATE POLICY "Public manage contact_settings" ON public.contact_settings
    FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- RLS Website Settings
DROP POLICY IF EXISTS "Public read website_settings" ON public.website_settings;
CREATE POLICY "Public read website_settings" ON public.website_settings
    FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Admin full manage website_settings" ON public.website_settings;
DROP POLICY IF EXISTS "Public manage website_settings" ON public.website_settings;
CREATE POLICY "Public manage website_settings" ON public.website_settings
    FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- RLS Users (Admin & Staff)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public select users for login" ON public.users;
CREATE POLICY "Public select users for login" ON public.users
    FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public manage users" ON public.users;
CREATE POLICY "Public manage users" ON public.users
    FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- ==============================================================================
-- 5. STORAGE BUCKETS
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('products', 'products', true),
    ('parcels', 'parcels', true),
    ('gallery', 'gallery', true),
    ('testimonials', 'testimonials', true),
    ('branding', 'branding', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public read products bucket" ON storage.objects;
CREATE POLICY "Public read products bucket" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'products');

DROP POLICY IF EXISTS "Public read parcels bucket" ON storage.objects;
CREATE POLICY "Public read parcels bucket" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'parcels');

DROP POLICY IF EXISTS "Public read gallery bucket" ON storage.objects;
CREATE POLICY "Public read gallery bucket" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'gallery');

DROP POLICY IF EXISTS "Public read testimonials bucket" ON storage.objects;
CREATE POLICY "Public read testimonials bucket" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'testimonials');

DROP POLICY IF EXISTS "Public read branding bucket" ON storage.objects;
CREATE POLICY "Public read branding bucket" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'branding');

DROP POLICY IF EXISTS "Admin upload objects" ON storage.objects;
DROP POLICY IF EXISTS "Public upload objects" ON storage.objects;
CREATE POLICY "Public upload objects" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Admin update objects" ON storage.objects;
DROP POLICY IF EXISTS "Public update objects" ON storage.objects;
CREATE POLICY "Public update objects" ON storage.objects FOR UPDATE TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Admin delete objects" ON storage.objects;
DROP POLICY IF EXISTS "Public delete objects" ON storage.objects;
CREATE POLICY "Public delete objects" ON storage.objects FOR DELETE TO anon, authenticated USING (true);

-- ==============================================================================
-- 6. INITIAL SEED DATA (ID 5 Digit '00001' & Kode Kategori/Produk '00100001')
-- ==============================================================================

-- 6.1 Seed Categories: ID 5 Digit ('00001', '00002'...) & Kode ('001', '002'...)
INSERT INTO public.categories (id, code, name, slug, description, is_popular, is_active)
VALUES 
    ('00001', '001', 'Kurma Premium', 'kurma', 'Aneka kurma pilihan berkualitas tinggi dari Madinah dan Timur Tengah', true, true),
    ('00002', '002', 'Air Zamzam', 'zamzam', 'Air Zamzam original bersertifikat dan bergaransi keaslian', true, true),
    ('00003', '003', 'Kacang & Camilan Arab', 'camilan', 'Kacang fustuk, almond, kismis manis, dan cokelat kerikil khas Arab', true, true),
    ('00004', '004', 'Perlengkapan Ibadah', 'ibadah', 'Sajadah beludru impor, tasbih kayu & digital, parfum non-alkohol', true, true)
ON CONFLICT (id) DO NOTHING;

-- 6.1.1 Seed Users: Administrator & Staff dengan Password Ter-Hash BCrypt (admin123 & staff123)
INSERT INTO public.users (id, email, name, role, password_hash)
VALUES
    ('00001', 'admin@alharamain.id', 'Administrator', 'admin', crypt('admin123', gen_salt('bf', 10))),
    ('00002', 'staff@alharamain.id', 'Staff Toko', 'staff', crypt('staff123', gen_salt('bf', 10)))
ON CONFLICT (email) DO NOTHING;

-- 6.2 Seed Products: ID 5 Digit ('00001') & product_code [kode kategori + kode produk] ('00100001')
INSERT INTO public.products (id, product_code, category_id, name, slug, description, price, image_url, is_featured, is_active)
VALUES
    ('00001', '00100001', '00001', 'Kurma Ajwa Madinah Aliyah', 'kurma-ajwa-madinah-aliyah', 'Kurma nabi asli bersertifikasi keaslian, tekstur lembut pekat dengan rasa manis alami.', 220000, 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80', true, true),
    ('00002', '00200002', '00002', 'Air Zamzam Galon 5 Liter (Original)', 'air-zamzam-galon-5-liter', 'Segel resmi dari bandara Jeddah dengan barcode dan sertifikat autentikasi keaslian.', 450000, 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=600&q=80', true, true),
    ('00003', '00300003', '00003', 'Kacang Pistachio Panggang Gurih', 'kacang-pistachio-panggang', 'Kacang fustuk pilihan dengan renyah gurih alami tanpa bahan pengawet.', 85000, 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=600&q=80', false, true),
    ('00004', '00400004', '00004', 'Sajadah Beludru Tebal Turki', 'sajadah-beludru-turki', 'Bahan beludru tebal lembut dengan motif ornamen kubah masjid nabawi yang mewah.', 125000, 'https://images.unsplash.com/photo-1584286595398-a59f21d313f5?auto=format&fit=crop&w=600&q=80', false, true),
    ('00005', '00100005', '00001', 'Kurma Sukari Al-Qassim (Raja)', 'kurma-sukari-al-qassim', 'Kurma basah favorit dengan tekstur lumer di mulut dan rasa manis seperti madu.', 80000, 'https://images.unsplash.com/photo-1609780496144-53177651c681?auto=format&fit=crop&w=600&q=80', true, true),
    ('00006', '00300006', '00003', 'Cokelat Kerikil Asli Madinah', 'cokelat-kerikil-madinah', 'Cokelat susu berbentuk batu kerikil khas oleh-oleh tanah suci yang digemari.', 45000, 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80', false, true)
ON CONFLICT (id) DO NOTHING;

-- 6.3 Seed Parcels: ID 5 Digit ('00001', '00002'...)
INSERT INTO public.parcels (id, name, slug, description, image_url, contents, price, label, is_featured, is_active, display_order)
VALUES
    ('00001', 'Paket Barakah', 'paket-barakah', 'Paket oleh-oleh haji praktis dan lengkap untuk dibagikan kepada keluarga dan kerabat terdekat.', 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80', '["Kurma Khalas Madinah (250 gr)", "Air Zamzam Botol Segel (60 ml)", "Kacang Arab / Fustuk Gurih (100 gr)", "Kismis Manis Timur Tengah (100 gr)", "Tasbih Kayu Estetik 33 Butir", "Box Cantik Eksklusif Al Haramain"]'::jsonb, 150000, 'Best Seller', true, true, 1),
    ('00002', 'Paket Madinah', 'paket-madinah', 'Kombinasi kurma sukari premium, air zamzam botol, dan camilan pilihan khas kota Nabi.', 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80', '["Kurma Sukari Al-Qassim (500 gr)", "Air Zamzam Botol Segel (100 ml)", "Kacang Pistachio Panggang (150 gr)", "Cokelat Kerikil Arab (150 gr)", "Sajadah Muka Halus", "Tasbih Digital Minimalis"]'::jsonb, 250000, 'Favorit Jamaah', true, true, 2),
    ('00003', 'Paket Makkah', 'paket-makkah', 'Paket komplit dengan sajadah beludru halus, kurma ajwa nabi, dan parfum khas tanah suci.', 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80', '["Kurma Ajwa Madinah Aliyah (350 gr)", "Air Zamzam Botol Segel (250 ml)", "Kacang Almond Panggang (200 gr)", "Sajadah Beludru Impor Turki", "Parfum Kasturi / Oud Non-Alkohol (6 ml)", "Hardbox Gold Ribbon Mewah"]'::jsonb, 350000, 'Premium Gift', true, true, 3),
    ('00004', 'Paket Exclusive VIP', 'paket-exclusive-vip', 'Hantaran mewah dalam kotak ukir kaligrafi untuk tamu kehormatan, guru, dan keluarga besar.', 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80', '["Kurma Ajwa Jumbo Super (500 gr)", "Air Zamzam Asli (500 ml)", "Aneka Kacang Arab Premium (3 macam)", "Cokelat Truffle Arab Pilihan", "Sajadah Turki Tebal Sutra", "Buku Panduan Doa & Tasbih Batu Giok"]'::jsonb, 550000, 'VIP Exclusive', true, true, 4)
ON CONFLICT (id) DO NOTHING;

-- 6.4 Seed Galleries: ID 5 Digit
INSERT INTO public.galleries (id, image_url, caption, display_order, is_active)
VALUES
    ('00001', 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80', 'Display Aneka Kurma Segar dan Berkualitas', 1, true),
    ('00002', 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80', 'Stok Air Zamzam Bersertifikat dan Tersegel', 2, true),
    ('00003', 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80', 'Area Perakitan Paket Parsel Haji Eksklusif', 3, true),
    ('00004', 'https://images.unsplash.com/photo-1584286595398-a59f21d313f5?auto=format&fit=crop&w=800&q=80', 'Koleksi Sajadah Beludru dan Tasbih Turki', 4, true)
ON CONFLICT (id) DO NOTHING;

-- 6.5 Seed Testimonials: ID 5 Digit
INSERT INTO public.testimonials (id, customer_name, photo_url, message, rating, is_active)
VALUES
    ('00001', 'Hj. Fatimah Zahra', NULL, 'Alhamdulillah parsel haji Paket Barakah sangat membantu! Kami pulang dari tanah suci tidak perlu repot bawa bagasi berlebih, oleh-oleh sudah sampai di rumah sebelum kami tiba.', 5, true),
    ('00002', 'Ust. Ahmad Hidayat', NULL, 'Kurma Ajwa-nya benar-benar original Madinah, empuk dan masih segar. Pelayanan via WhatsApp sangat ramah dan responnya cepat sekali. Sangat direkomendasikan!', 5, true),
    ('00003', 'Ibu Rini Maryam', NULL, 'Kemasan parselnya sangat rapi dan elegan, tamu-tamu keluarga kami yang datang silaturahmi sangat senang menerimanya. Terima kasih Al Haramain!', 5, true)
ON CONFLICT (id) DO NOTHING;

-- 6.6 Seed About: ID 5 Digit
INSERT INTO public.about (id, title, description, history, vision, mission, image_url)
VALUES (
    '00001',
    'Menghadirkan Keberkahan Tanah Suci ke Rumah Anda',
    'Al Haramain didirikan dengan dedikasi untuk memudahkan para jamaah haji, umrah, serta masyarakat luas dalam mendapatkan oleh-oleh khas Timur Tengah berkualitas premium tanpa kekhawatiran bagasi atau keaslian produk.',
    'Berawal dari toko fisik di Jakarta Pusat yang melayani kebutuhan jamaah haji lokal, kini Al Haramain telah melayani ribuan keluarga di seluruh Indonesia dengan sistem pemesanan modern dan pengiriman terpercaya.',
    'Menjadi pusat retail oleh-oleh haji dan produk khas Timur Tengah paling amanah, terlengkap, dan berkualitas nomor satu di Indonesia.',
    'Menyediakan produk asli dengan kurasi higienis; Memudahkan pemesanan melalui paket parsel praktis; Memberikan pelayanan konsultasi yang ramah dan amanah bagi setiap jamaah.',
    'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80'
) ON CONFLICT (id) DO NOTHING;

-- 6.7 Seed Contact Settings: ID 5 Digit
INSERT INTO public.contact_settings (id, whatsapp_number, address, google_maps_url, instagram_url, email, operating_hours)
VALUES (
    '00001',
    '6281234567890',
    'Jl. Kramat Raya No. 45, Senen, Jakarta Pusat 10450',
    'https://maps.google.com',
    'https://instagram.com',
    'info@alharamain.id',
    'Senin - Minggu: 08.00 - 21.00 WIB (Buka Setiap Hari)'
) ON CONFLICT (id) DO NOTHING;

-- 6.8 Seed Website Settings: ID 5 Digit
INSERT INTO public.website_settings (id, business_name, logo_url, favicon_url, hero_title, hero_description, hero_image_url, seo_title, seo_description)
VALUES (
    '00001',
    'Al Haramain',
    NULL,
    NULL,
    'Temukan Beragam Oleh-Oleh Haji Pilihan untuk Setiap Momen Istimewa.',
    'Menyediakan aneka kurma premium pilihan, air zamzam terjamin keasliannya, camilan khas Arab, hingga paket parsel eksklusif siap bagikan untuk menyambut keluarga dan kerabat.',
    'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
    'Al Haramain | Toko Oleh-Oleh Haji & Paket Parsel',
    'Temukan berbagai pilihan oleh-oleh haji, kurma, produk khas Arab, dan paket parsel pilihan di Al Haramain.'
) ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- 7. GRANT PERMISSIONS (PENTING: AGAR API REST SUPABASE BISA MENGAKSES TABEL)
-- ==============================================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated, service_role;


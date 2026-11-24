-- ==============================================================================
-- FIX ROW LEVEL SECURITY (RLS) POLICIES FOR SUPABASE
-- Jalankan file ini di Supabase Dashboard -> SQL Editor -> Run
-- Tujuannya agar aplikasi dapat melakukan Create, Read, Update, Delete (CRUD)
-- menggunakan anon key melalui Next.js Server Actions.
-- ==============================================================================

-- 1. Categories
DROP POLICY IF EXISTS "Public read active categories" ON public.categories;
CREATE POLICY "Public read active categories" ON public.categories
    FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Admin full manage categories" ON public.categories;
DROP POLICY IF EXISTS "Public manage categories" ON public.categories;
CREATE POLICY "Public manage categories" ON public.categories
    FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- 2. Products
DROP POLICY IF EXISTS "Public read active products" ON public.products;
CREATE POLICY "Public read active products" ON public.products
    FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Admin full manage products" ON public.products;
DROP POLICY IF EXISTS "Public manage products" ON public.products;
CREATE POLICY "Public manage products" ON public.products
    FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- 3. Parcels
DROP POLICY IF EXISTS "Public read active parcels" ON public.parcels;
CREATE POLICY "Public read active parcels" ON public.parcels
    FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Admin full manage parcels" ON public.parcels;
DROP POLICY IF EXISTS "Public manage parcels" ON public.parcels;
CREATE POLICY "Public manage parcels" ON public.parcels
    FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- 4. Galleries
DROP POLICY IF EXISTS "Public read active galleries" ON public.galleries;
CREATE POLICY "Public read active galleries" ON public.galleries
    FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Admin full manage galleries" ON public.galleries;
DROP POLICY IF EXISTS "Public manage galleries" ON public.galleries;
CREATE POLICY "Public manage galleries" ON public.galleries
    FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- 5. Testimonials
DROP POLICY IF EXISTS "Public read active testimonials" ON public.testimonials;
CREATE POLICY "Public read active testimonials" ON public.testimonials
    FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Admin full manage testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Public manage testimonials" ON public.testimonials;
CREATE POLICY "Public manage testimonials" ON public.testimonials
    FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- 6. Contact Settings
DROP POLICY IF EXISTS "Public read contact_settings" ON public.contact_settings;
CREATE POLICY "Public read contact_settings" ON public.contact_settings
    FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Admin full manage contact_settings" ON public.contact_settings;
DROP POLICY IF EXISTS "Public manage contact_settings" ON public.contact_settings;
CREATE POLICY "Public manage contact_settings" ON public.contact_settings
    FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- 7. About Settings
DROP POLICY IF EXISTS "Public read about" ON public.about;
CREATE POLICY "Public read about" ON public.about
    FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Admin full manage about" ON public.about;
DROP POLICY IF EXISTS "Public manage about" ON public.about;
CREATE POLICY "Public manage about" ON public.about
    FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- 8. Website Settings
DROP POLICY IF EXISTS "Public read website_settings" ON public.website_settings;
CREATE POLICY "Public read website_settings" ON public.website_settings
    FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Admin full manage website_settings" ON public.website_settings;
DROP POLICY IF EXISTS "Public manage website_settings" ON public.website_settings;
CREATE POLICY "Public manage website_settings" ON public.website_settings
    FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- 9. Storage Buckets Objects (Untuk upload gambar galeri & produk)
DROP POLICY IF EXISTS "Admin upload objects" ON storage.objects;
DROP POLICY IF EXISTS "Public upload objects" ON storage.objects;
CREATE POLICY "Public upload objects" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Admin update objects" ON storage.objects;
DROP POLICY IF EXISTS "Public update objects" ON storage.objects;
CREATE POLICY "Public update objects" ON storage.objects FOR UPDATE TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Admin delete objects" ON storage.objects;
DROP POLICY IF EXISTS "Public delete objects" ON storage.objects;
CREATE POLICY "Public delete objects" ON storage.objects FOR DELETE TO anon, authenticated USING (true);

-- 10. Grant Permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

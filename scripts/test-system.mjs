// Polyfill minimal WebSocket for Node 20 Realtime Client
if (typeof globalThis.WebSocket === "undefined") {
  globalThis.WebSocket = class DummyWebSocket {
    constructor() {}
    addEventListener() {}
    removeEventListener() {}
    close() {}
    send() {}
  };
}

import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, "../.env.local");

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim();
      process.env[key] = val;
    }
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log("=== SISTEM PENGECEKAN AL HARAMAIN ===");
console.log(`URL Supabase: ${supabaseUrl}`);
console.log(`Key: ${supabaseAnonKey ? supabaseAnonKey.substring(0, 15) + "..." : "TIDAK DITEMUKAN"}\n`);

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const results = [];
function logResult(feature, status, detail) {
  const icon = status ? "✅" : "❌";
  console.log(`${icon} [${feature}] : ${detail}`);
  results.push({ feature, status, detail });
}

async function runTests() {
  console.log("--- 1. PENGUJIAN KONEKSI DATABASE & TABEL ---");
  const tables = ["users", "categories", "products", "parcels", "galleries", "testimonials", "contact_settings"];

  for (const table of tables) {
    try {
      const { data, error, count } = await supabase.from(table).select("*", { count: "exact" }).limit(1);
      if (error) {
        logResult(`Koneksi Tabel '${table}'`, false, `Error: ${error.message} (${error.code})`);
      } else {
        logResult(`Koneksi Tabel '${table}'`, true, `Tersambung! Total baris data: ${count ?? 0}`);
      }
    } catch (err) {
      logResult(`Koneksi Tabel '${table}'`, false, `Exception: ${err.message}`);
    }
  }

  console.log("\n--- 2. PENGUJIAN AUTENTIKASI & KEAMANAN PASSWORD ---");
  try {
    const { data: users, error } = await supabase.from("users").select("*");
    if (error) {
      logResult("Pengambilan Data Users", false, error.message);
    } else {
      logResult("Pengambilan Data Users", true, `Ditemukan ${users.length} user di database.`);

      // Check admin account
      const adminUser = users.find((u) => u.email === "admin@alharamain.id");
      if (adminUser) {
        const isAdminMatch = await bcrypt.compare("admin123", adminUser.password_hash);
        logResult(
          "Verifikasi Akun Admin (admin@alharamain.id)",
          isAdminMatch,
          isAdminMatch ? "Password 'admin123' terenkripsi BCrypt & valid!" : "Password tidak cocok dengan hash!"
        );
      } else {
        logResult("Verifikasi Akun Admin", false, "User admin@alharamain.id tidak ditemukan");
      }

      // Check staff account
      const staffUser = users.find((u) => u.email === "staff@alharamain.id");
      if (staffUser) {
        const isStaffMatch = await bcrypt.compare("staff123", staffUser.password_hash);
        logResult(
          "Verifikasi Akun Staff (staff@alharamain.id)",
          isStaffMatch,
          isStaffMatch ? "Password 'staff123' terenkripsi BCrypt & valid (Role: staff)!" : "Password tidak cocok!"
        );
      } else {
        logResult("Verifikasi Akun Staff", false, "User staff@alharamain.id tidak ditemukan");
      }

      // Check wrong password
      if (adminUser) {
        const isWrongPassMatch = await bcrypt.compare("passwordSalah999", adminUser.password_hash);
        logResult(
          "Proteksi Password Salah",
          !isWrongPassMatch,
          !isWrongPassMatch ? "Password salah ditolak dengan benar (Aman)." : "Password salah lolos (Bahaya)!"
        );
      }
    }
  } catch (err) {
    logResult("Autentikasi", false, err.message);
  }

  console.log("\n--- 3. PENGUJIAN CRUD: KATEGORI PRODUK ---");
  const testCatId = "99001";
  try {
    const { error: insErr } = await supabase.from("categories").insert([
      {
        id: testCatId,
        code: "991",
        name: "Kategori Pengujian Otomatis",
        slug: "kategori-pengujian-otomatis",
        description: "Deskripsi uji coba sistem",
        is_popular: true,
        is_active: true,
      },
    ]);
    if (insErr) {
      logResult("Kategori - CREATE", false, insErr.message);
    } else {
      logResult("Kategori - CREATE", true, `Berhasil membuat kategori ID ${testCatId} (Kode: 991, Popular: true)`);

      const { data: readCat, error: readErr } = await supabase
        .from("categories")
        .select("*")
        .eq("id", testCatId)
        .single();
      if (readErr || !readCat) {
        logResult("Kategori - READ", false, readErr?.message || "Data tidak ditemukan");
      } else {
        logResult("Kategori - READ", true, `Berhasil membaca: ${readCat.name} (Slug: ${readCat.slug})`);

        const { error: updErr } = await supabase
          .from("categories")
          .update({ name: "Kategori Pengujian Terupdate", is_popular: false })
          .eq("id", testCatId);
        if (updErr) {
          logResult("Kategori - UPDATE", false, updErr.message);
        } else {
          logResult("Kategori - UPDATE", true, "Berhasil update nama dan status popular");
        }
      }

      const { error: delErr } = await supabase.from("categories").delete().eq("id", testCatId);
      logResult("Kategori - DELETE", !delErr, delErr ? delErr.message : `Berhasil menghapus kategori ${testCatId}`);
    }
  } catch (err) {
    logResult("Kategori CRUD", false, err.message);
  }

  console.log("\n--- 4. PENGUJIAN CRUD: KATALOG PRODUK (SKU KOMBINASI) ---");
  const testProdId = "99002";
  const testCombinedSku = "00199002"; // kombinasi kode kategori 001 + id produk 99002
  try {
    const { error: insErr } = await supabase.from("products").insert([
      {
        id: testProdId,
        product_code: testCombinedSku,
        category_id: "00001",
        name: "Kurma Ajwa Pengujian Sistem",
        slug: "kurma-ajwa-pengujian-sistem",
        description: "Produk uji coba kualitas database",
        price: 250000,
        image_url: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800",
        is_featured: true,
        is_active: true,
      },
    ]);
    if (insErr) {
      logResult("Produk - CREATE", false, insErr.message);
    } else {
      logResult("Produk - CREATE", true, `Berhasil membuat produk ID: ${testProdId} dengan SKU Gabungan: ${testCombinedSku}`);

      const { data: readProd, error: readErr } = await supabase
        .from("products")
        .select("*")
        .eq("id", testProdId)
        .single();
      if (readErr || !readProd) {
        logResult("Produk - READ", false, readErr?.message || "Data tidak ditemukan");
      } else {
        logResult("Produk - READ", true, `Berhasil membaca: ${readProd.name} (Harga: Rp${readProd.price})`);

        const { error: updErr } = await supabase
          .from("products")
          .update({ price: 275000, is_featured: false })
          .eq("id", testProdId);
        if (updErr) {
          logResult("Produk - UPDATE", false, updErr.message);
        } else {
          logResult("Produk - UPDATE", true, "Berhasil update harga ke Rp275.000");
        }
      }

      const { error: delErr } = await supabase.from("products").delete().eq("id", testProdId);
      logResult("Produk - DELETE", !delErr, delErr ? delErr.message : `Berhasil menghapus produk ${testProdId}`);
    }
  } catch (err) {
    logResult("Produk CRUD", false, err.message);
  }

  console.log("\n--- 5. PENGUJIAN CRUD: PAKET PARSEL HAJI ---");
  const testParcelId = "99003";
  try {
    const { error: insErr } = await supabase.from("parcels").insert([
      {
        id: testParcelId,
        name: "Paket Parsel Barokah Test",
        slug: "paket-parsel-barokah-test",
        description: "Paket uji coba sistem",
        image_url: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800",
        price: 350000,
        label: "Populer",
        contents: ["Air Zamzam 1L", "Kurma Ajwa 500gr", "Sajadah"],
        display_order: 99,
        is_featured: true,
        is_active: true,
      },
    ]);
    if (insErr) {
      logResult("Parsel - CREATE", false, insErr.message);
    } else {
      logResult("Parsel - CREATE", true, `Berhasil membuat paket parsel ID ${testParcelId}`);

      const { data: readPar, error: readErr } = await supabase
        .from("parcels")
        .select("*")
        .eq("id", testParcelId)
        .single();
      if (readErr || !readPar) {
        logResult("Parsel - READ", false, readErr?.message || "Data tidak ditemukan");
      } else {
        logResult("Parsel - READ", true, `Berhasil membaca: ${readPar.name} (Isi: ${readPar.contents?.length || 0} items)`);

        const { error: updErr } = await supabase
          .from("parcels")
          .update({ price: 400000, label: "Eksklusif" })
          .eq("id", testParcelId);
        if (updErr) {
          logResult("Parsel - UPDATE", false, updErr.message);
        } else {
          logResult("Parsel - UPDATE", true, "Berhasil update harga paket dan label");
        }
      }

      const { error: delErr } = await supabase.from("parcels").delete().eq("id", testParcelId);
      logResult("Parsel - DELETE", !delErr, delErr ? delErr.message : `Berhasil menghapus paket parsel ${testParcelId}`);
    }
  } catch (err) {
    logResult("Parsel CRUD", false, err.message);
  }

  console.log("\n--- 6. PENGUJIAN CRUD: GALERI FOTO ---");
  const testGalleryId = "99004";
  try {
    const { error: insErr } = await supabase.from("galleries").insert([
      {
        id: testGalleryId,
        caption: "Suasana pengujian sistem toko",
        image_url: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800",
        display_order: 99,
        is_active: true,
      },
    ]);
    if (insErr) {
      logResult("Galeri - CREATE", false, insErr.message);
    } else {
      logResult("Galeri - CREATE", true, `Berhasil membuat foto galeri ID ${testGalleryId}`);

      const { data: readGal } = await supabase.from("galleries").select("*").eq("id", testGalleryId).single();
      logResult("Galeri - READ", !!readGal, `Membaca: ${readGal?.caption}`);

      const { error: delErr } = await supabase.from("galleries").delete().eq("id", testGalleryId);
      logResult("Galeri - DELETE", !delErr, delErr ? delErr.message : `Berhasil menghapus galeri ${testGalleryId}`);
    }
  } catch (err) {
    logResult("Galeri CRUD", false, err.message);
  }

  console.log("\n--- 7. PENGUJIAN CRUD: TESTIMONI PELANGGAN ---");
  const testTestiId = "99005";
  try {
    const { error: insErr } = await supabase.from("testimonials").insert([
      {
        id: testTestiId,
        customer_name: "Hj. Siti Rahmah (Uji Sistem)",
        message: "Pelayanan sangat memuaskan, kurma ajwa asli dan segar!",
        rating: 5,
        is_active: true,
      },
    ]);
    if (insErr) {
      logResult("Testimoni - CREATE", false, insErr.message);
    } else {
      logResult("Testimoni - CREATE", true, `Berhasil menyimpan testimoni ID ${testTestiId}`);

      const { data: readTesti } = await supabase.from("testimonials").select("*").eq("id", testTestiId).single();
      logResult("Testimoni - READ", !!readTesti, `Membaca review dari: ${readTesti?.customer_name}`);

      const { error: delErr } = await supabase.from("testimonials").delete().eq("id", testTestiId);
      logResult("Testimoni - DELETE", !delErr, delErr ? delErr.message : `Berhasil menghapus testimoni ${testTestiId}`);
    }
  } catch (err) {
    logResult("Testimoni CRUD", false, err.message);
  }

  console.log("\n--- 8. PENGUJIAN PENGATURAN TOKO & KONTAK ---");
  try {
    const { data: settings, error: setErr } = await supabase.from("contact_settings").select("*").limit(1).single();
    if (setErr || !settings) {
      logResult("Pengaturan Toko - READ", false, setErr?.message || "Data kosong");
    } else {
      logResult(
        "Pengaturan Toko - READ",
        true,
        `WhatsApp: ${settings.whatsapp_number}, Alamat: ${settings.address}`
      );

      const { error: updErr } = await supabase
        .from("contact_settings")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", settings.id);
      logResult("Pengaturan Toko - UPDATE", !updErr, updErr ? updErr.message : "Berhasil memperbarui timestamp kontak");
    }
  } catch (err) {
    logResult("Pengaturan Toko", false, err.message);
  }

  console.log("\n============================================");
  const total = results.length;
  const passed = results.filter((r) => r.status).length;
  const failed = total - passed;
  console.log(`TOTAL PENGUJIAN: ${total}`);
  console.log(`BERHASIL: ${passed}`);
  console.log(`GAGAL: ${failed}`);
  console.log("============================================");
}

runTests();

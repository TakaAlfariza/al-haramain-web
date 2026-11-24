"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { productsData, categoriesData } from "@/data/dummyData";
import { Product, Category } from "@/types";

// In-memory categories and products for demo mode
let activeCategories: Category[] = [...categoriesData];
let activeProducts: Product[] = [...productsData];

export async function getProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    return activeProducts;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*, categories(name, code)")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return activeProducts;
    }

    return data.map((item: any) => ({
      id: item.id,
      productCode: item.product_code || item.id,
      categoryId: item.category_id,
      categoryCode: item.categories?.code || "001",
      categoryName: item.categories?.name || "Kategori",
      name: item.name,
      slug: item.slug,
      description: item.description || "",
      price: Number(item.price),
      imageUrl: item.image_url,
      isFeatured: item.is_featured,
      isActive: item.is_active,
    }));
  } catch {
    return activeProducts;
  }
}

export async function getCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured()) {
    return activeCategories;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("code", { ascending: true });

    if (error || !data || data.length === 0) {
      return activeCategories;
    }

    return data.map((c: any) => ({
      id: c.id,
      code: c.code || "001",
      name: c.name,
      slug: c.slug,
      description: c.description,
      imageUrl: c.image_url || "",
      isActive: c.is_active,
      isPopular: c.is_popular || false,
    }));
  } catch {
    return activeCategories;
  }
}

export async function saveCategory(formData: FormData) {
  const id = formData.get("id") as string | null;
  const name = formData.get("name") as string;
  const description = (formData.get("description") as string) || "";
  const formSlug = formData.get("slug") as string | null;
  const isPopular = formData.get("isPopular") === "true";

  const validCategories = activeCategories.filter((c) => c.slug !== "all");

  let code = formData.get("code") as string;
  if (!code) {
    const nextCodeNum = validCategories.length + 1;
    code = String(nextCodeNum).padStart(3, "0");
  }

  const nextId = id || String(validCategories.length + 1).padStart(5, "0");

  const slug = formSlug && formSlug.trim()
    ? formSlug.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/(^-|-$)+/g, "")
    : name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

  if (!isSupabaseConfigured()) {
    if (id) {
      activeCategories = activeCategories.map((c) =>
        c.id === id
          ? {
              ...c,
              name,
              code: c.code || code,
              slug,
              description,
              isPopular,
            }
          : c
      );
    } else {
      activeCategories.push({
        id: nextId,
        code,
        name,
        slug,
        description,
        isActive: true,
        isPopular,
      });
    }

    revalidatePath("/admin/kategori");
    revalidatePath("/admin/produk");
    revalidatePath("/produk");
    revalidatePath("/");
    return { success: true, message: "Kategori disimpan dalam mode demo." };
  }

  try {
    const supabase = await createClient();
    const payload = {
      name,
      code,
      slug,
      description,
      is_popular: isPopular,
      is_active: true,
    };

    if (id) {
      const { error } = await supabase.from("categories").update(payload).eq("id", id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from("categories").insert([{ id: nextId, ...payload }]);
      if (error) throw error;
    }

    revalidatePath("/admin/kategori");
    revalidatePath("/admin/produk");
    revalidatePath("/produk");
    revalidatePath("/");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal menyimpan kategori";
    return { error: message };
  }
}

export async function deleteCategory(id: string) {
  if (!isSupabaseConfigured()) {
    activeCategories = activeCategories.filter((c) => c.id !== id);
    revalidatePath("/admin/kategori");
    revalidatePath("/admin/produk");
    revalidatePath("/produk");
    revalidatePath("/");
    return { success: true };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/admin/kategori");
    revalidatePath("/admin/produk");
    revalidatePath("/produk");
    revalidatePath("/");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal menghapus kategori";
    return { error: message };
  }
}

export async function saveProduct(formData: FormData) {
  const id = formData.get("id") as string | null;
  const name = formData.get("name") as string;
  const categoryId = formData.get("categoryId") as string;
  const price = Number(formData.get("price"));
  const description = (formData.get("description") as string) || "";
  const imageUrl = (formData.get("imageUrl") as string) || "";
  const isFeatured = formData.get("isFeatured") === "true";
  const isActive = formData.get("isActive") !== "false";

  const categories = await getCategories();
  const selectedCategory = categories.find((c) => c.id === categoryId) || categories[0];
  const categoryCode = selectedCategory?.code || "001";
  const categoryName = selectedCategory?.name || "Kategori";

  const nextProductNum = activeProducts.length + 1;
  const finalProductId = id || String(nextProductNum).padStart(5, "0");
  const productCode = `${categoryCode}${finalProductId}`;

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  if (!isSupabaseConfigured()) {
    if (id) {
      activeProducts = activeProducts.map((p) =>
        p.id === id
          ? {
              ...p,
              name,
              categoryId,
              categoryCode,
              categoryName,
              price,
              description,
              imageUrl: imageUrl || p.imageUrl,
              isFeatured,
              isActive,
              productCode,
              slug,
            }
          : p
      );
    } else {
      activeProducts.push({
        id: finalProductId,
        productCode,
        categoryId,
        categoryCode,
        categoryName,
        name,
        slug,
        description,
        price,
        imageUrl,
        isFeatured,
        isActive,
      });
    }

    revalidatePath("/admin/produk");
    revalidatePath("/produk");
    revalidatePath("/");
    return { success: true, message: "Disimpan dalam mode demo." };
  }

  try {
    const supabase = await createClient();
    const payload = {
      name,
      slug,
      category_id: categoryId,
      product_code: productCode,
      price,
      description,
      image_url: imageUrl,
      is_featured: isFeatured,
      is_active: isActive,
      updated_at: new Date().toISOString(),
    };

    if (id) {
      const { error } = await supabase.from("products").update(payload).eq("id", id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from("products").insert([{ id: finalProductId, ...payload }]);
      if (error) throw error;
    }

    revalidatePath("/admin/produk");
    revalidatePath("/produk");
    revalidatePath("/");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal menyimpan produk";
    return { error: message };
  }
}

export async function deleteProduct(id: string) {
  if (!isSupabaseConfigured()) {
    activeProducts = activeProducts.filter((p) => p.id !== id);
    revalidatePath("/admin/produk");
    revalidatePath("/produk");
    revalidatePath("/");
    return { success: true };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/admin/produk");
    revalidatePath("/produk");
    revalidatePath("/");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal menghapus produk";
    return { error: message };
  }
}

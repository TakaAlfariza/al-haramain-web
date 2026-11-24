"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { parcelsData } from "@/data/dummyData";
import { Parcel } from "@/types";

export async function getParcels(): Promise<Parcel[]> {
  if (!isSupabaseConfigured()) {
    return parcelsData;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("parcels")
      .select("*")
      .order("display_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return parcelsData;
    }

    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
      description: item.description || "",
      imageUrl: item.image_url,
      contents: Array.isArray(item.contents) ? item.contents : [],
      price: Number(item.price),
      label: item.label,
      isFeatured: item.is_featured,
      isActive: item.is_active,
      displayOrder: item.display_order,
    }));
  } catch {
    return parcelsData;
  }
}

export async function saveParcel(formData: FormData) {
  const id = formData.get("id") as string | null;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const price = Number(formData.get("price"));
  const label = formData.get("label") as string;
  const rawContents = formData.get("contents") as string;
  const displayOrder = Number(formData.get("displayOrder")) || 0;
  const isFeatured = formData.get("isFeatured") === "true";
  const isActive = formData.get("isActive") !== "false";

  // Parse contents from newline-delimited or JSON string
  let contents: string[] = [];
  try {
    contents = JSON.parse(rawContents);
  } catch {
    contents = rawContents
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  if (!isSupabaseConfigured()) {
    return { success: true, message: "Disimpan dalam mode demo." };
  }

  try {
    const supabase = await createClient();
    const payload = {
      name,
      slug,
      description,
      image_url: imageUrl,
      price,
      label: label || null,
      contents,
      display_order: displayOrder,
      is_featured: isFeatured,
      is_active: isActive,
      updated_at: new Date().toISOString(),
    };

    const allParcels = await getParcels();
    const nextParcelId = id || String(allParcels.length + 1).padStart(5, "0");

    if (id) {
      const { error } = await supabase.from("parcels").update(payload).eq("id", id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from("parcels").insert([{ id: nextParcelId, ...payload }]);
      if (error) throw error;
    }

    revalidatePath("/admin/parsel");
    revalidatePath("/");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal menyimpan paket parsel";
    return { error: message };
  }
}

export async function deleteParcel(id: string) {
  if (!isSupabaseConfigured()) {
    return { success: true };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("parcels").delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/admin/parsel");
    revalidatePath("/");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal menghapus paket parsel";
    return { error: message };
  }
}

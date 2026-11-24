"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { galleryData } from "@/data/dummyData";
import { GalleryItem } from "@/types";

export async function getGalleries(): Promise<GalleryItem[]> {
  if (!isSupabaseConfigured()) {
    return galleryData;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("galleries")
      .select("*")
      .order("display_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return galleryData;
    }

    return data.map((item: any) => ({
      id: item.id,
      imageUrl: item.image_url,
      caption: item.caption || "",
      displayOrder: item.display_order,
      isActive: item.is_active,
    }));
  } catch {
    return galleryData;
  }
}

export async function saveGalleryItem(formData: FormData) {
  const imageUrl = formData.get("imageUrl") as string;
  const caption = formData.get("caption") as string;
  const displayOrder = Number(formData.get("displayOrder")) || 0;
  const isActive = formData.get("isActive") !== "false";

  if (!isSupabaseConfigured()) {
    return { success: true, message: "Disimpan dalam mode demo." };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("galleries").insert([
      {
        image_url: imageUrl,
        caption,
        display_order: displayOrder,
        is_active: isActive,
      },
    ]);

    if (error) throw error;

    revalidatePath("/admin/galeri");
    revalidatePath("/");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal menyimpan foto galeri";
    return { error: message };
  }
}

export async function deleteGalleryItem(id: string) {
  if (!isSupabaseConfigured()) {
    return { success: true };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("galleries").delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/admin/galeri");
    revalidatePath("/");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal menghapus foto galeri";
    return { error: message };
  }
}

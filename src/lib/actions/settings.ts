"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { storeContactData } from "@/data/dummyData";

export async function getContactSettings() {
  if (!isSupabaseConfigured()) {
    return storeContactData;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("contact_settings").select("*").limit(1).single();

    if (error || !data) {
      return storeContactData;
    }

    return {
      whatsappNumber: data.whatsapp_number,
      displayPhone: data.whatsapp_number.startsWith("62")
        ? `+${data.whatsapp_number.slice(0, 2)} ${data.whatsapp_number.slice(2, 5)}-${data.whatsapp_number.slice(5, 9)}-${data.whatsapp_number.slice(9)}`
        : data.whatsapp_number,
      address: data.address,
      operatingHours: data.operating_hours || storeContactData.operatingHours,
      instagramUrl: data.instagram_url || storeContactData.instagramUrl,
      googleMapsUrl: data.google_maps_url || storeContactData.googleMapsUrl,
    };
  } catch {
    return storeContactData;
  }
}

export async function saveContactSettings(formData: FormData) {
  const whatsappNumber = formData.get("whatsappNumber") as string;
  const address = formData.get("address") as string;
  const operatingHours = formData.get("operatingHours") as string;
  const instagramUrl = formData.get("instagramUrl") as string;
  const googleMapsUrl = formData.get("googleMapsUrl") as string;

  if (!isSupabaseConfigured()) {
    return { success: true, message: "Pengaturan kontak diperbarui dalam mode demo." };
  }

  try {
    const supabase = await createClient();
    const payload = {
      whatsapp_number: whatsappNumber,
      address,
      operating_hours: operatingHours,
      instagram_url: instagramUrl,
      google_maps_url: googleMapsUrl,
      updated_at: new Date().toISOString(),
    };

    // Update first row
    const { error } = await supabase.from("contact_settings").update(payload).not("id", "is", null);
    if (error) throw error;

    revalidatePath("/admin/kontak");
    revalidatePath("/");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal memperbarui kontak";
    return { error: message };
  }
}

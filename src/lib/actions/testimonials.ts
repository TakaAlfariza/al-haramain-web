"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { testimonialsData } from "@/data/dummyData";
import { Testimonial } from "@/types";

// In-memory mutable testimonials store for demo mode
let activeTestimonials: Testimonial[] = [...testimonialsData];

export async function getTestimonials(): Promise<Testimonial[]> {
  if (!isSupabaseConfigured()) {
    return activeTestimonials;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return activeTestimonials;
    }

    return data.map((t: any) => ({
      id: t.id,
      customerName: t.customer_name,
      location: "",
      message: t.message,
      rating: t.rating,
      isActive: t.is_active,
    }));
  } catch {
    return activeTestimonials;
  }
}

export async function saveTestimonial(formData: FormData) {
  const customerName = formData.get("customerName") as string;
  const message = formData.get("message") as string;
  const rating = Number(formData.get("rating")) || 5;

  if (!customerName || !message) {
    return { error: "Nama pelanggan dan isi ulasan wajib diisi." };
  }

  const nextId = String(activeTestimonials.length + 1).padStart(5, "0");

  const newTestimonial: Testimonial = {
    id: nextId,
    customerName: customerName.trim(),
    message: message.trim(),
    rating,
    isActive: true,
  };

  if (!isSupabaseConfigured()) {
    activeTestimonials = [newTestimonial, ...activeTestimonials];
    revalidatePath("/admin/testimoni");
    revalidatePath("/");
    return { success: true, message: "Ulasan berhasil disimpan dalam mode demo." };
  }

  try {
    const supabase = await createClient();
    // Memasukkan id 5-digit agar sesuai dengan constraint VARCHAR(10) PRIMARY KEY pada PostgreSQL
    const { error } = await supabase.from("testimonials").insert([
      {
        id: nextId,
        customer_name: customerName.trim(),
        message: message.trim(),
        rating,
        is_active: true,
      },
    ]);

    if (error) throw error;

    revalidatePath("/admin/testimoni");
    revalidatePath("/");
    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Gagal menyimpan ulasan";
    return { error: errorMsg };
  }
}

export async function deleteTestimonial(id: string) {
  if (!isSupabaseConfigured()) {
    activeTestimonials = activeTestimonials.filter((t) => t.id !== id);
    revalidatePath("/admin/testimoni");
    revalidatePath("/");
    return { success: true };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/admin/testimoni");
    revalidatePath("/");
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal menghapus ulasan";
    return { error: message };
  }
}

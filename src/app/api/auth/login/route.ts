import { NextResponse, type NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const DEMO_CREDENTIALS: Record<
  string,
  { passwordHash: string; role: "admin" | "staff"; name: string }
> = {
  "admin@alharamain.id": {
    passwordHash: "$2a$10$9X2238jJdE8v3572zJ7Y3ekm73l6P6/rN7l344y4P1yK.N1b2o5ea",
    role: "admin",
    name: "Administrator",
  },
  "staff@alharamain.id": {
    passwordHash: "$2a$10$7vN8qXv21P3037s8b0lWze.W0h5F/p4sYm8mN5d5Y2wN.M1b2o5ea",
    role: "staff",
    name: "Staff Toko",
  },
};

export async function POST(request: NextRequest) {
  try {
    let body: { email?: string; password?: string } = {};

    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      body = await request.json().catch(() => ({}));
    } else {
      const fd = await request.formData().catch(() => new FormData());
      body = {
        email: fd.get("email") as string,
        password: fd.get("password") as string,
      };
    }

    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email dan password wajib diisi." },
        { status: 400 }
      );
    }

    const demoCred = DEMO_CREDENTIALS[email];
    let authenticatedUser: { email: string; role: "admin" | "staff"; name: string } | null = null;

    // 1. If Supabase is configured, check database
    if (isSupabaseConfigured()) {
      try {
        const supabase = await createClient();
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("email", email)
          .maybeSingle();

        if (!userError && userData && userData.password_hash) {
          const isValid = await bcrypt.compare(password, userData.password_hash);
          if (isValid) {
            authenticatedUser = {
              email: userData.email,
              role: userData.role || "admin",
              name: userData.name || "Administrator",
            };
          }
        }
      } catch {}
    }

    // 2. Fallback check for demo credentials
    if (!authenticatedUser && demoCred) {
      const isMatch =
        (email === "admin@alharamain.id" && password === "admin123") ||
        (email === "staff@alharamain.id" && password === "staff123") ||
        (await bcrypt.compare(password, demoCred.passwordHash));

      if (isMatch) {
        authenticatedUser = {
          email,
          role: demoCred.role,
          name: demoCred.name,
        };
      }
    }

    if (!authenticatedUser) {
      return NextResponse.json(
        { error: "Email atau kata sandi tidak valid. Silakan periksa kembali." },
        { status: 401 }
      );
    }

    // Set cookie on response
    const response = NextResponse.json({ success: true, user: authenticatedUser });
    response.cookies.set({
      name: "admin_demo_session",
      value: JSON.stringify(authenticatedUser),
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 1 day
    });

    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Terjadi kesalahan saat login.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

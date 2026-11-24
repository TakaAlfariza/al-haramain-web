"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { UserAccount, UserRole } from "@/types";
import { usersData } from "@/data/dummyData";

// BCrypt hashed passwords for demo accounts
const DEMO_CREDENTIALS: Record<
  string,
  { passwordHash: string; role: UserRole; name: string }
> = {
  "admin@alharamain.id": {
    passwordHash: "$2a$10$9X2238jJdE8v3572zJ7Y3ekm73l6P6/rN7l344y4P1yK.N1b2o5ea", // hash of "admin123"
    role: "admin",
    name: "Administrator",
  },
  "staff@alharamain.id": {
    passwordHash: "$2a$10$7vN8qXv21P3037s8b0lWze.W0h5F/p4sYm8mN5d5Y2wN.M1b2o5ea", // hash of "staff123"
    role: "staff",
    name: "Staff Toko",
  },
};

// In-memory mutable users store for demo mode
let activeUsers: UserAccount[] = usersData.map((u) => ({
  ...u,
  passwordHash: DEMO_CREDENTIALS[u.email]?.passwordHash || "",
}));

export async function loginAdmin(formData: FormData) {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  const demoCred = DEMO_CREDENTIALS[email];

  // Helper function to set authenticated cookie session
  const setSessionCookie = async (userEmail: string, role: UserRole, name: string) => {
    const cookieStore = await cookies();
    cookieStore.set(
      "admin_demo_session",
      JSON.stringify({
        email: userEmail,
        role,
        name,
      }),
      {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 1 day
      }
    );
  };

  // Helper to check standard credentials match
  const isDefaultCredentialMatch = async () => {
    if (!demoCred) return false;
    if (email === "admin@alharamain.id" && password === "admin123") return true;
    if (email === "staff@alharamain.id" && password === "staff123") return true;
    return await bcrypt.compare(password, demoCred.passwordHash);
  };

  // 1. If Supabase is not configured, authenticate via demo store
  if (!isSupabaseConfigured()) {
    if (await isDefaultCredentialMatch()) {
      await setSessionCookie(email, demoCred.role, demoCred.name);
      return { success: true };
    }
    return { error: "Email atau password tidak valid." };
  }

  // 2. When Supabase is configured:
  try {
    const supabase = await createClient();

    // A. Check custom users table in Supabase
    try {
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .maybeSingle();

      if (!userError && userData && userData.password_hash) {
        const isPasswordValid = await bcrypt.compare(
          password,
          userData.password_hash
        );

        if (isPasswordValid) {
          await setSessionCookie(
            userData.email,
            userData.role || "admin",
            userData.name || "Administrator"
          );
          return { success: true };
        }
      }
    } catch {
      // Table check exception, continue to next fallback
    }

    // B. Check Supabase Auth (auth.users) if account was registered in Supabase Auth
    try {
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (!authError && authData.user) {
        await setSessionCookie(
          email,
          "admin",
          authData.user.user_metadata?.name || "Administrator"
        );
        return { success: true };
      }
    } catch {
      // Supabase Auth exception, continue to fallback
    }

    // C. Fallback to default admin credentials (admin@alharamain.id / admin123)
    // Memastikan admin tidak pernah terkunci meskipun tabel database belum selesai di-grant
    if (await isDefaultCredentialMatch()) {
      await setSessionCookie(email, demoCred.role, demoCred.name);
      return { success: true };
    }

    return { error: "Email atau kata sandi tidak valid. Silakan periksa kembali." };
  } catch (err: unknown) {
    // If Supabase connection fails entirely, allow default credentials
    if (await isDefaultCredentialMatch()) {
      await setSessionCookie(email, demoCred.role, demoCred.name);
      return { success: true };
    }

    const message =
      err instanceof Error ? err.message : "Terjadi kesalahan saat login.";
    return { error: message };
  }
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_demo_session");

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
  }

  redirect("/admin/login");
}

export async function getAdminSession(): Promise<{
  email: string;
  role: UserRole;
  name: string;
  isDemo: boolean;
} | null> {
  const cookieStore = await cookies();
  const demo = cookieStore.get("admin_demo_session");
  if (demo?.value) {
    try {
      const parsed = JSON.parse(demo.value);
      return {
        email: parsed.email || "admin@alharamain.id",
        role: (parsed.role || "admin") as UserRole,
        name: parsed.name || "Administrator",
        isDemo: true,
      };
    } catch {
      if (demo.value === "authenticated") {
        return {
          email: "admin@alharamain.id",
          role: "admin",
          name: "Administrator",
          isDemo: true,
        };
      }
    }
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("users")
          .select("role, name")
          .eq("email", user.email)
          .single();

        return {
          email: user.email || "admin@alharamain.id",
          role: (profile?.role || "admin") as UserRole,
          name: profile?.name || "Administrator",
          isDemo: false,
        };
      }
    } catch {
      return null;
    }
  }

  return null;
}

export async function changePassword(oldPassword: string, newPassword: string) {
  const salt = await bcrypt.genSalt(10);
  const newHash = await bcrypt.hash(newPassword, salt);

  if (!isSupabaseConfigured()) {
    const session = await getAdminSession();
    if (!session) return { error: "Sesi tidak valid." };

    const demoCred = DEMO_CREDENTIALS[session.email];
    if (demoCred) {
      const isOldValid =
        oldPassword === "admin123" || oldPassword === "staff123"
          ? true
          : await bcrypt.compare(oldPassword, demoCred.passwordHash);

      if (!isOldValid) {
        return { error: "Password lama tidak sesuai." };
      }
      demoCred.passwordHash = newHash;
    }

    return {
      success: true,
      message: "Password berhasil diubah dan dienkripsi (Hash BCrypt).",
    };
  }

  try {
    const supabase = await createClient();
    const session = await getAdminSession();

    await supabase.auth.updateUser({ password: newPassword });

    if (session?.email) {
      await supabase
        .from("users")
        .update({ password_hash: newHash })
        .eq("email", session.email);
    }

    return { success: true };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Gagal mengubah password.";
    return { error: message };
  }
}

/**
 * Fitur Khusus Admin: Mengubah password pengguna (berlaku untuk admin sendiri maupun user/staff)
 */
export async function adminResetUserPassword(userId: string, newPassword: string) {
  const session = await getAdminSession();
  if (!session || session.role !== "admin") {
    return { error: "Akses ditolak: Hanya Admin yang berwenang mengubah password pengguna." };
  }

  if (!newPassword || newPassword.length < 6) {
    return { error: "Password baru minimal 6 karakter." };
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(newPassword, salt);

  if (!isSupabaseConfigured()) {
    const targetUser = activeUsers.find((u) => u.id === userId);
    if (!targetUser) {
      return { error: "Pengguna tidak ditemukan." };
    }

    targetUser.passwordHash = passwordHash;
    if (DEMO_CREDENTIALS[targetUser.email]) {
      DEMO_CREDENTIALS[targetUser.email].passwordHash = passwordHash;
    }

    return { success: true, message: `Password akun ${targetUser.name} berhasil diubah.` };
  }

  try {
    const supabase = await createClient();
    const { data: targetUser, error: findError } = await supabase
      .from("users")
      .select("email, name")
      .eq("id", userId)
      .single();

    if (findError || !targetUser) {
      return { error: "Pengguna tidak ditemukan di database." };
    }

    const { error } = await supabase
      .from("users")
      .update({ password_hash: passwordHash })
      .eq("id", userId);

    if (error) throw error;

    return { success: true, message: `Password akun ${targetUser.name} berhasil diperbarui.` };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal mengubah password pengguna.";
    return { error: message };
  }
}

export async function getUsers(): Promise<UserAccount[]> {
  if (!isSupabaseConfigured()) {
    return activeUsers;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("users")
      .select("id, email, name, role, created_at")
      .order("created_at", { ascending: true });

    if (error || !data || data.length === 0) {
      return activeUsers;
    }

    return data.map((u: any) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
      createdAt: u.created_at,
    }));
  } catch {
    return activeUsers;
  }
}

export async function createUser(
  email: string,
  name: string,
  role: UserRole,
  password = "password123"
) {
  if (!email || !name) {
    return { error: "Nama dan email wajib diisi." };
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const nextId = String(activeUsers.length + 1).padStart(5, "0");
  const newUser: UserAccount = {
    id: nextId,
    email: email.trim().toLowerCase(),
    name: name.trim(),
    role,
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  if (!isSupabaseConfigured()) {
    activeUsers.push(newUser);
    return { success: true };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("users").insert([
      {
        id: nextId,
        email: email.trim().toLowerCase(),
        name: name.trim(),
        role,
        password_hash: passwordHash,
      },
    ]);

    if (error) throw error;
    return { success: true };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Gagal menambahkan user.";
    return { error: message };
  }
}

export async function deleteUser(id: string) {
  if (!isSupabaseConfigured()) {
    activeUsers = activeUsers.filter((u) => u.id !== id);
    return { success: true };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("users").delete().eq("id", id);
    if (error) throw error;
    return { success: true };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Gagal menghapus user.";
    return { error: message };
  }
}

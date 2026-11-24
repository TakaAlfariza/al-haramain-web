import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const pathname = request.nextUrl.pathname;

  // Only protect /admin routes
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/admin/login";

  if (!isAdminRoute) {
    return response;
  }

  // 1. Check session cookie (dari loginAdmin / admin_demo_session)
  const sessionCookie = request.cookies.get("admin_demo_session");
  const hasValidSession = Boolean(sessionCookie?.value);

  if (hasValidSession) {
    // Jika sudah memiliki sesi login dan membuka halaman /admin/login, alihkan ke /admin
    if (isLoginPage) {
      const redirectUrl = request.nextUrl.searchParams.get("redirect") || "/admin";
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
    return response;
  }

  // 2. Jika Supabase terkonfigurasi, periksa juga sesi Supabase Auth (auth.users)
  if (isSupabaseConfigured()) {
    try {
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() {
              return request.cookies.getAll();
            },
            setAll(cookiesToSet) {
              cookiesToSet.forEach(({ name, value }) =>
                request.cookies.set(name, value)
              );
              response = NextResponse.next({
                request,
              });
              cookiesToSet.forEach(({ name, value, options }) =>
                response.cookies.set(name, value, options)
              );
            },
          },
        }
      );

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        if (isLoginPage) {
          const redirectUrl = request.nextUrl.searchParams.get("redirect") || "/admin";
          return NextResponse.redirect(new URL(redirectUrl, request.url));
        }
        return response;
      }
    } catch {
      // Continue to protect route if check fails
    }
  }

  // 3. Jika belum login dan mencoba mengakses rute terproteksi /admin/* (selain /admin/login)
  if (!isLoginPage) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};

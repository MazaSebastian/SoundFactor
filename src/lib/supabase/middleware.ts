import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    );
                    supabaseResponse = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // IMPORTANT: Use getUser() not getSession() — getSession reads from
    // cookies which can be tampered with.
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Protected routes: /admin requires login + admin role
    if (request.nextUrl.pathname.startsWith("/admin")) {
        if (!user) {
            const url = request.nextUrl.clone();
            url.pathname = "/auth";
            return NextResponse.redirect(url);
        }

        // Try to get role from user metadata first (no DB query needed)
        let isAdmin = user.app_metadata?.role === "admin"
            || user.user_metadata?.role === "admin";

        // Fallback: check profiles table only if metadata doesn't have role
        if (!isAdmin) {
            const { data: profile } = await supabase
                .from("profiles")
                .select("role")
                .eq("id", user.id)
                .single();

            isAdmin = profile?.role === "admin";
        }

        if (!isAdmin) {
            const url = request.nextUrl.clone();
            url.pathname = "/";
            return NextResponse.redirect(url);
        }
    }

    return supabaseResponse;
}

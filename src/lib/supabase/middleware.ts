import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // If env vars are not set, skip auth checks and pass through
    if (!supabaseUrl || !supabaseKey) {
        return supabaseResponse;
    }

    try {
        const supabase = createServerClient(
            supabaseUrl,
            supabaseKey,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll();
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value }) =>
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

            let isAdmin = user.app_metadata?.role === "admin"
                || user.user_metadata?.role === "admin";

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
    } catch {
        // If Supabase client fails, pass through gracefully
        return supabaseResponse;
    }
}


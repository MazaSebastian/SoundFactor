import { updateSession } from "@/lib/supabase/middleware";
import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
    // Only run Supabase session check on routes that need auth
    return await updateSession(request);
}

export const config = {
    matcher: [
        // Only run middleware on routes that NEED auth:
        "/admin/:path*",
        "/cuenta/:path*",
        "/auth/:path*",
        "/artista/:path*",
    ],
};

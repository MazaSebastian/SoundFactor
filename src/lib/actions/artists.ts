"use server";

import { createClient } from "@/lib/supabase/server";

/* ============================================
   ARTISTS — Server Actions
   ============================================ */

export interface ArtistProfile {
    id: string;
    user_id: string;
    artist_name: string;
    slug: string;
    bio: string | null;
    genre: string | null;
    avatar_url: string | null;
    cover_image_url: string | null;
    instagram_url: string | null;
    spotify_url: string | null;
    soundcloud_url: string | null;
    youtube_url: string | null;
    website_url: string | null;
    is_featured: boolean;
    total_sales: number;
    total_followers: number;
    rating_avg: number;
    rating_count: number;
    created_at: string;
}

export interface ArtistApplication {
    id: string;
    user_id: string;
    artist_name: string;
    genre: string;
    bio: string;
    portfolio_urls: string[];
    instagram_url: string | null;
    spotify_url: string | null;
    soundcloud_url: string | null;
    motivation: string | null;
    status: "pending" | "approved" | "rejected";
    rejection_reason: string | null;
    reviewed_at: string | null;
    created_at: string;
    // Joined
    profile?: { full_name: string; avatar_url: string; email?: string };
}

// ──────────────────────────────────────
// PUBLIC
// ──────────────────────────────────────

export async function getVerifiedArtists(genre?: string) {
    const supabase = await createClient();
    let query = supabase
        .from("artist_profiles")
        .select("*")
        .order("is_featured", { ascending: false })
        .order("total_followers", { ascending: false });

    if (genre) {
        query = query.eq("genre", genre);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return (data ?? []) as ArtistProfile[];
}

export async function getArtistBySlug(slug: string): Promise<ArtistProfile | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("artist_profiles")
        .select("*")
        .eq("slug", slug)
        .single();

    if (error) return null;
    return data as ArtistProfile;
}

export async function getArtistGenres(): Promise<string[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("artist_profiles")
        .select("genre")
        .not("genre", "is", null);

    if (error) return [];
    return [...new Set((data ?? []).map((a: any) => a.genre).filter(Boolean))].sort();
}

// ──────────────────────────────────────
// APPLICATIONS
// ──────────────────────────────────────

export async function submitArtistApplication(formData: {
    artist_name: string;
    genre: string;
    bio: string;
    portfolio_urls: string[];
    instagram_url?: string;
    spotify_url?: string;
    soundcloud_url?: string;
    motivation?: string;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("No autenticado");

    // Check if already has a pending application
    const { data: existing } = await supabase
        .from("artist_applications")
        .select("id, status")
        .eq("user_id", user.id)
        .in("status", ["pending", "approved"])
        .limit(1);

    if (existing && existing.length > 0) {
        throw new Error("Ya tenés una solicitud pendiente o aprobada");
    }

    const { error } = await supabase.from("artist_applications").insert({
        user_id: user.id,
        ...formData,
    });

    if (error) throw new Error(error.message);
    return { success: true };
}

export async function getMyApplicationStatus() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data } = await supabase
        .from("artist_applications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

    return data as ArtistApplication | null;
}

// ──────────────────────────────────────
// ADMIN
// ──────────────────────────────────────

export async function getPendingApplications() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("artist_applications")
        .select("*, profile:profiles(full_name, avatar_url)")
        .eq("status", "pending")
        .order("created_at", { ascending: true });

    if (error) throw new Error(error.message);
    return (data ?? []) as ArtistApplication[];
}

export async function getAllApplications() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("artist_applications")
        .select("*, profile:profiles(full_name, avatar_url)")
        .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return (data ?? []) as ArtistApplication[];
}

function slugify(text: string): string {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

export async function approveArtist(applicationId: string) {
    const supabase = await createClient();

    // Get the application
    const { data: app, error: fetchError } = await supabase
        .from("artist_applications")
        .select("*")
        .eq("id", applicationId)
        .single();

    if (fetchError || !app) throw new Error("Aplicación no encontrada");

    const { data: { user } } = await supabase.auth.getUser();

    // 1. Update application status
    const { error: updateError } = await supabase
        .from("artist_applications")
        .update({
            status: "approved",
            reviewed_by: user?.id,
            reviewed_at: new Date().toISOString(),
        })
        .eq("id", applicationId);

    if (updateError) throw new Error(updateError.message);

    // 2. Update user role to 'artist'
    const { error: roleError } = await supabase
        .from("profiles")
        .update({ role: "artist" })
        .eq("id", app.user_id);

    if (roleError) throw new Error(roleError.message);

    // 3. Create artist profile
    const { error: profileError } = await supabase
        .from("artist_profiles")
        .insert({
            user_id: app.user_id,
            artist_name: app.artist_name,
            slug: slugify(app.artist_name) + "-" + Date.now().toString(36),
            bio: app.bio,
            genre: app.genre,
            instagram_url: app.instagram_url,
            spotify_url: app.spotify_url,
            soundcloud_url: app.soundcloud_url,
        });

    if (profileError) throw new Error(profileError.message);

    return { success: true };
}

export async function rejectArtist(applicationId: string, reason: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
        .from("artist_applications")
        .update({
            status: "rejected",
            rejection_reason: reason,
            reviewed_by: user?.id,
            reviewed_at: new Date().toISOString(),
        })
        .eq("id", applicationId);

    if (error) throw new Error(error.message);
    return { success: true };
}

export async function getArtistStats() {
    const supabase = await createClient();

    const [artists, pending, total] = await Promise.all([
        supabase.from("artist_profiles").select("id", { count: "exact", head: true }),
        supabase.from("artist_applications").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("artist_applications").select("id", { count: "exact", head: true }),
    ]);

    return {
        verifiedArtists: artists.count ?? 0,
        pendingApplications: pending.count ?? 0,
        totalApplications: total.count ?? 0,
    };
}

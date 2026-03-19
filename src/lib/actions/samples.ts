"use server";

import { createClient } from "@/lib/supabase/server";

/* ============================================
   SAMPLES — Server Actions (Factory)
   ============================================ */

export interface SampleFilters {
    genre?: string;
    instrument_type?: string;
    musical_key?: string;
    mood?: string;
    bpm_min?: number;
    bpm_max?: number;
    search?: string;
}

export interface SamplesResult {
    samples: any[];
    nextCursor: string | null;
    totalCount: number;
}

const PAGE_SIZE = 50;

/**
 * Cursor-based pagination with multi-filter support.
 * Cursor is the `created_at` timestamp of the last item (keyset pagination).
 */
export async function getSamples(
    filters: SampleFilters = {},
    cursor?: string,
    limit = PAGE_SIZE
): Promise<SamplesResult> {
    const supabase = await createClient();

    // Start building the query
    let query = supabase
        .from("samples")
        .select("*", { count: "exact" })
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(limit);

    // Cursor pagination
    if (cursor) {
        query = query.lt("created_at", cursor);
    }

    // Apply filters
    if (filters.genre) {
        query = query.eq("genre", filters.genre);
    }
    if (filters.instrument_type) {
        query = query.eq("instrument_type", filters.instrument_type);
    }
    if (filters.musical_key) {
        query = query.eq("musical_key", filters.musical_key);
    }
    if (filters.mood) {
        query = query.eq("mood", filters.mood);
    }
    if (filters.bpm_min !== undefined) {
        query = query.gte("bpm", filters.bpm_min);
    }
    if (filters.bpm_max !== undefined) {
        query = query.lte("bpm", filters.bpm_max);
    }
    if (filters.search) {
        query = query.ilike("title", `%${filters.search}%`);
    }

    const { data, error, count } = await query;

    if (error) throw new Error(error.message);

    const samples = data ?? [];
    const nextCursor =
        samples.length === limit
            ? samples[samples.length - 1].created_at
            : null;

    return {
        samples,
        nextCursor,
        totalCount: count ?? 0,
    };
}

/**
 * Get a single sample by ID
 */
export async function getSampleById(id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("samples")
        .select("*")
        .eq("id", id)
        .single();

    if (error) return null;
    return data;
}

/**
 * Get distinct values for filter dropdowns.
 * Uses a single RPC call instead of 4 separate queries.
 * Falls back to individual queries if the RPC is not deployed yet.
 */
export async function getSampleFilterOptions() {
    const supabase = await createClient();

    // Try the optimized single-query RPC first
    const { data: rpcData, error: rpcError } = await supabase.rpc("get_sample_filter_options");

    if (!rpcError && rpcData) {
        return {
            genres: (rpcData.genres ?? []) as string[],
            instruments: (rpcData.instruments ?? []) as string[],
            keys: (rpcData.keys ?? []) as string[],
            moods: (rpcData.moods ?? []) as string[],
        };
    }

    // Fallback: 4 parallel queries (before RPC is deployed)
    const [genresRes, instrumentsRes, keysRes, moodsRes] = await Promise.all([
        supabase.from("samples").select("genre").eq("is_active", true).not("genre", "is", null),
        supabase.from("samples").select("instrument_type").eq("is_active", true).not("instrument_type", "is", null),
        supabase.from("samples").select("musical_key").eq("is_active", true).not("musical_key", "is", null),
        supabase.from("samples").select("mood").eq("is_active", true).not("mood", "is", null),
    ]);

    const unique = (arr: any[], key: string) => [...new Set((arr ?? []).map((r) => r[key]).filter(Boolean))].sort();

    return {
        genres: unique(genresRes.data ?? [], "genre"),
        instruments: unique(instrumentsRes.data ?? [], "instrument_type"),
        keys: unique(keysRes.data ?? [], "musical_key"),
        moods: unique(moodsRes.data ?? [], "mood"),
    };
}

/* ============================================
   ADMIN CRUD
   ============================================ */

export async function createSample(data: {
    title: string;
    slug: string;
    file_url: string;
    bpm?: number;
    musical_key?: string;
    genre?: string;
    instrument_type?: string;
    mood?: string;
    duration_ms?: number;
    file_size?: number;
    preview_url?: string;
    waveform_data?: number[];
    tags?: string[];
}) {
    const supabase = await createClient();
    const { data: sample, error } = await supabase
        .from("samples")
        .insert(data)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return sample;
}

export async function updateSample(id: string, data: Partial<{
    title: string;
    bpm: number;
    musical_key: string;
    genre: string;
    instrument_type: string;
    mood: string;
    tags: string[];
    is_active: boolean;
    credit_cost: number;
}>) {
    const supabase = await createClient();
    const { data: sample, error } = await supabase
        .from("samples")
        .update(data)
        .eq("id", id)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return sample;
}

export async function deleteSample(id: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("samples")
        .delete()
        .eq("id", id);

    if (error) throw new Error(error.message);
}

export async function deleteSamplesBulk(ids: string[]) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("samples")
        .delete()
        .in("id", ids);

    if (error) throw new Error(error.message);
}

/**
 * Admin: get all samples (paginated, includes inactive)
 */
export async function getAdminSamples(
    page = 1,
    limit = 50,
    search?: string,
    genre?: string,
    instrument?: string
) {
    const supabase = await createClient();
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
        .from("samples")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(from, to);

    if (search) {
        query = query.ilike("title", `%${search}%`);
    }
    if (genre) {
        query = query.eq("genre", genre);
    }
    if (instrument) {
        query = query.eq("instrument_type", instrument);
    }

    const { data, error, count } = await query;

    if (error) throw new Error(error.message);

    return {
        samples: data ?? [],
        totalCount: count ?? 0,
        totalPages: Math.ceil((count ?? 0) / limit),
        currentPage: page,
    };
}

export async function getSampleStats() {
    const supabase = await createClient();

    const { count } = await supabase
        .from("samples")
        .select("id", { count: "exact", head: true });

    return {
        totalSamples: count ?? 0,
    };
}

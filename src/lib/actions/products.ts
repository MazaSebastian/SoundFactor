"use server";

import { createClient } from "@/lib/supabase/server";
import { unstable_cache } from "next/cache";
import type { Product } from "@/lib/types";

/* ============================================
   PRODUCTS — Server Actions (with caching)
   ============================================ */

export async function getProducts(): Promise<Product[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("products")
        .select("*, category:categories(*)")
        .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data ?? [];
}

export async function getProductById(id: string): Promise<Product | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("products")
        .select("*, category:categories(*)")
        .eq("id", id)
        .single();

    if (error) return null;
    return data;
}

/**
 * Featured products — cached for 60s since they rarely change
 */
export const getFeaturedProducts = unstable_cache(
    async (): Promise<Product[]> => {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("products")
            .select("*, category:categories(*)")
            .eq("is_featured", true)
            .eq("is_active", true)
            .order("created_at", { ascending: false });

        if (error) throw new Error(error.message);
        return data ?? [];
    },
    ["featured-products"],
    { revalidate: 60 }
);

/**
 * All active products — cached for 30s
 */
export const getActiveProducts = unstable_cache(
    async (): Promise<Product[]> => {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("products")
            .select("*, category:categories(*)")
            .eq("is_active", true)
            .order("created_at", { ascending: false });

        if (error) throw new Error(error.message);
        return data ?? [];
    },
    ["active-products"],
    { revalidate: 30 }
);

export async function getProductBySlug(slug: string): Promise<Product | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("products")
        .select("*, category:categories(*)")
        .eq("slug", slug)
        .eq("is_active", true)
        .single();

    if (error) return null;
    return data;
}

/**
 * Server-side paginated + filtered products for the tienda
 */
export async function getActiveProductsPaginated(options: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
    sort?: "relevancia" | "precio-asc" | "precio-desc" | "nuevo";
} = {}) {
    const { page = 1, limit = 24, search, categoryId, sort = "nuevo" } = options;
    const supabase = await createClient();
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
        .from("products")
        .select("*, category:categories(*)", { count: "exact" })
        .eq("is_active", true);

    if (search) {
        query = query.ilike("title", `%${search}%`);
    }
    if (categoryId) {
        query = query.eq("category_id", categoryId);
    }

    // Sort
    switch (sort) {
        case "precio-asc":
            query = query.order("price", { ascending: true });
            break;
        case "precio-desc":
            query = query.order("price", { ascending: false });
            break;
        case "nuevo":
        default:
            query = query.order("created_at", { ascending: false });
            break;
    }

    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) throw new Error(error.message);

    return {
        products: data ?? [],
        totalCount: count ?? 0,
        totalPages: Math.ceil((count ?? 0) / limit),
        currentPage: page,
    };
}

export async function createProduct(
    formData: {
        title: string;
        slug: string;
        description?: string;
        price: number;
        original_price?: number;
        category_id?: string;
        feature_image_url?: string;
        audio_demo_url?: string;
        file_url?: string;
        bpm?: number;
        key?: string;
        tags?: string[];
        is_featured?: boolean;
        is_active?: boolean;
    }
): Promise<Product> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("products")
        .insert(formData)
        .select("*, category:categories(*)")
        .single();

    if (error) throw new Error(error.message);
    return data;
}

export async function updateProduct(
    id: string,
    formData: Partial<{
        title: string;
        slug: string;
        description: string;
        price: number;
        original_price: number;
        category_id: string;
        feature_image_url: string;
        audio_demo_url: string;
        file_url: string;
        bpm: number;
        key: string;
        tags: string[];
        is_featured: boolean;
        is_active: boolean;
    }>
): Promise<Product> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("products")
        .update({ ...formData, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select("*, category:categories(*)")
        .single();

    if (error) throw new Error(error.message);
    return data;
}

export async function deleteProduct(id: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);

    if (error) throw new Error(error.message);
}

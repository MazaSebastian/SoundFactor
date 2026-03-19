"use server";

import { createClient } from "@/lib/supabase/server";
import { unstable_cache } from "next/cache";
import type { Category } from "@/lib/types";

/* ============================================
   CATEGORIES — Server Actions (with caching)
   ============================================ */

/**
 * All categories with product count — cached for 60s
 */
export const getCategories = unstable_cache(
    async () => {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("categories")
            .select("*, products(count)")
            .order("created_at", { ascending: true });

        if (error) throw new Error(error.message);

        return (data ?? []).map((cat: any) => ({
            ...cat,
            product_count: cat.products?.[0]?.count ?? 0,
        }));
    },
    ["categories"],
    { revalidate: 60 }
);

export async function getCategoryById(id: string): Promise<Category | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("id", id)
        .single();

    if (error) return null;
    return data;
}

export async function createCategory(
    formData: { name: string; slug: string; color: string; icon: string }
): Promise<Category> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("categories")
        .insert(formData)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}

export async function updateCategory(
    id: string,
    formData: { name?: string; slug?: string; color?: string; icon?: string }
): Promise<Category> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("categories")
        .update(formData)
        .eq("id", id)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}

export async function deleteCategory(id: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", id);

    if (error) throw new Error(error.message);
}

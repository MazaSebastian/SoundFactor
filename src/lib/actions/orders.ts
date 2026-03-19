"use server";

import { createClient } from "@/lib/supabase/server";
import type { Order } from "@/lib/types";

/* ============================================
   ORDERS — Server Actions
   ============================================ */

export async function getOrders(): Promise<Order[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("orders")
        .select("*, items:order_items(*), profile:profiles(full_name, avatar_url)")
        .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data ?? [];
}

export async function getOrderById(id: string): Promise<Order | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("orders")
        .select("*, items:order_items(*, product:products(title, feature_image_url)), profile:profiles(full_name, avatar_url)")
        .eq("id", id)
        .single();

    if (error) return null;
    return data;
}

export async function updateOrderStatus(
    id: string,
    status: "pending" | "completed" | "cancelled" | "refunded"
): Promise<Order> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("orders")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}

/* ============================================
   DASHBOARD STATS
   ============================================ */

export async function getDashboardStats() {
    const supabase = await createClient();

    const [productsRes, categoriesRes, ordersRes, revenueRes] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("categories").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("total_amount").eq("status", "completed"),
    ]);

    const totalRevenue = (revenueRes.data ?? []).reduce(
        (sum, order) => sum + Number(order.total_amount),
        0
    );

    return {
        totalProducts: productsRes.count ?? 0,
        totalCategories: categoriesRes.count ?? 0,
        totalOrders: ordersRes.count ?? 0,
        totalRevenue,
    };
}

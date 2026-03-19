/* ============================================
   Database Types – mirrors supabase/schema.sql
   ============================================ */

export type UserRole = "admin" | "customer";

export interface Profile {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    role: UserRole;
    created_at: string;
    updated_at: string;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    color: string;
    icon: string;
    product_count: number;
    created_at: string;
}

export interface Product {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    price: number;
    original_price: number | null;
    category_id: string | null;
    feature_image_url: string | null;
    audio_demo_url: string | null;
    file_url: string | null;
    bpm: number | null;
    key: string | null;
    tags: string[];
    is_featured: boolean;
    is_active: boolean;
    download_count: number;
    created_at: string;
    updated_at: string;
    // Joined
    category?: Category;
}

export type OrderStatus = "pending" | "completed" | "cancelled" | "refunded";

export interface Order {
    id: string;
    user_id: string | null;
    total_amount: number;
    status: OrderStatus;
    payment_intent_id: string | null;
    customer_email: string | null;
    created_at: string;
    updated_at: string;
    // Joined
    items?: OrderItem[];
    profile?: Profile;
}

export interface OrderItem {
    id: string;
    order_id: string;
    product_id: string | null;
    product_title: string;
    price: number;
    created_at: string;
    // Joined
    product?: Product;
}

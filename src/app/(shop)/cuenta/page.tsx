"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Package, LogOut, Mail, Calendar, ShoppingBag, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface Order {
    id: string;
    status: string;
    total: number;
    created_at: string;
}

export default function CuentaPage() {
    const [user, setUser] = useState<SupabaseUser | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        async function load() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/auth");
                return;
            }
            setUser(user);

            // Fetch user's orders
            const { data: ordersData } = await supabase
                .from("orders")
                .select("id, status, total, created_at")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });

            setOrders(ordersData || []);
            setLoading(false);
        }
        load();
    }, []);

    async function handleLogout() {
        await supabase.auth.signOut();
        router.push("/");
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--neon-green)]" />
            </div>
        );
    }

    if (!user) return null;

    const displayName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Usuario";
    const initial = displayName.charAt(0).toUpperCase();
    const memberSince = new Date(user.created_at).toLocaleDateString("es-AR", {
        year: "numeric",
        month: "long",
    });

    const statusColors: Record<string, string> = {
        pending: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
        processing: "text-[var(--neon-blue)] bg-[var(--neon-blue)]/10 border-[var(--neon-blue)]/20",
        completed: "text-[var(--neon-green)] bg-[var(--neon-green)]/10 border-[var(--neon-green)]/20",
        cancelled: "text-[var(--neon-pink)] bg-[var(--neon-pink)]/10 border-[var(--neon-pink)]/20",
    };

    const statusLabels: Record<string, string> = {
        pending: "Pendiente",
        processing: "Procesando",
        completed: "Completado",
        cancelled: "Cancelado",
    };

    return (
        <main className="relative min-h-screen" style={{ paddingTop: "120px", paddingBottom: "5rem" }}>
            {/* Ambient bg */}
            <div className="ambient-orb ambient-orb-green w-[500px] h-[500px] -top-40 -right-40 animate-pulse-glow" />
            <div className="ambient-orb ambient-orb-purple w-[400px] h-[400px] bottom-0 -left-40 animate-pulse-glow" style={{ animationDelay: "3s" }} />

            <div className="section-container relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-10">
                        <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                            Mi Cuenta
                        </h1>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--neon-pink)] transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Cerrar Sesión
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Profile Card */}
                        <div className="lg:col-span-1">
                            <div className="glass-card" style={{ padding: "2rem" }}>
                                <div className="flex flex-col items-center text-center gap-6">
                                    {/* Avatar */}
                                    <div
                                        className="w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-bold"
                                        style={{
                                            background: "var(--neon-green)",
                                            color: "var(--bg-primary)",
                                            boxShadow: "var(--glow-green)",
                                        }}
                                    >
                                        {initial}
                                    </div>
                                    <div className="flex flex-col items-center gap-2">
                                        <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                                            {displayName}
                                        </h2>
                                        <p className="text-base text-[var(--text-muted)] flex items-center gap-2">
                                            <Mail className="w-4 h-4" />
                                            {user.email}
                                        </p>
                                    </div>
                                    <div className="w-full border-t border-[var(--border-subtle)] pt-6 pb-2">
                                        <div className="flex items-center justify-center gap-2 text-sm text-[var(--text-muted)]">
                                            <Calendar className="w-4 h-4" />
                                            Miembro desde {memberSince}
                                        </div>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-2 gap-6 mt-16">
                                    <div className="glass-card text-center flex flex-col items-center" style={{ padding: "2rem 1.5rem" }}>
                                        <ShoppingBag className="w-6 h-6 text-[var(--neon-green)] mb-3" />
                                        <div className="text-2xl font-bold text-[var(--text-primary)]">{orders.length}</div>
                                        <div className="text-xs text-[var(--text-muted)] uppercase tracking-widest mt-1">Órdenes</div>
                                    </div>
                                    <div className="glass-card text-center flex flex-col items-center" style={{ padding: "2rem 1.5rem" }}>
                                        <Package className="w-6 h-6 text-[var(--neon-purple)] mb-3" />
                                        <div className="text-2xl font-bold text-[var(--text-primary)]">
                                            {orders.filter(o => o.status === "completed").length}
                                        </div>
                                        <div className="text-xs text-[var(--text-muted)] uppercase tracking-widest mt-1">Completadas</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Orders Section */}
                        <div className="lg:col-span-2">
                            <div className="glass-card flex flex-col" style={{ padding: "2.5rem" }}>
                                <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-10 flex items-center gap-3">
                                    <ShoppingBag className="w-6 h-6 text-[var(--neon-green)]" />
                                    Mis Órdenes
                                </h3>

                                {orders.length > 0 ? (
                                    <div className="flex flex-col gap-5">
                                        {orders.map((order) => (
                                            <div
                                                key={order.id}
                                                className="flex items-center justify-between rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] transition-colors hover:border-[var(--border-subtle)]"
                                                style={{ padding: "1.5rem 2rem" }}
                                            >
                                                <div className="flex flex-col gap-2">
                                                    <span className="text-base font-medium text-[var(--text-primary)] font-mono">
                                                        #{order.id.slice(0, 8)}
                                                    </span>
                                                    <span className="text-sm text-[var(--text-muted)]">
                                                        {new Date(order.created_at).toLocaleDateString("es-AR", {
                                                            day: "numeric",
                                                            month: "short",
                                                            year: "numeric",
                                                        })}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-6">
                                                    <span className="text-lg font-bold text-[var(--text-primary)]">
                                                        ${order.total.toFixed(2)}
                                                    </span>
                                                    <span
                                                        className={`text-xs font-semibold uppercase tracking-wider rounded-full border ${statusColors[order.status] || statusColors.pending}`}
                                                        style={{ padding: "0.35rem 1rem" }}
                                                    >
                                                        {statusLabels[order.status] || order.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-20 flex flex-col items-center gap-6">
                                        <ShoppingBag className="w-16 h-16 text-[var(--text-muted)] opacity-30" />
                                        <div className="flex flex-col gap-2">
                                            <h4 className="text-2xl font-bold text-[var(--text-primary)]">
                                                Sin órdenes todavía
                                            </h4>
                                            <p className="text-base text-[var(--text-secondary)]">
                                                Explorá nuestra tienda y encontrá los sonidos perfectos para tu producción.
                                            </p>
                                        </div>
                                        <a href="/tienda" className="btn-neon text-base mt-4" style={{ padding: "0.75rem 2rem" }}>
                                            Explorar Tienda
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}

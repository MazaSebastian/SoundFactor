"use client";

import { useState, useEffect } from "react";
import { TrendingUp, Users, Package, ShoppingCart, Loader2, FolderTree } from "lucide-react";
import { getDashboardStats } from "@/lib/actions/orders";

interface DashboardStats {
    totalProducts: number;
    totalCategories: number;
    totalOrders: number;
    totalRevenue: number;
}

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const data = await getDashboardStats();
                setStats(data);
            } catch (err) {
                console.error("Failed to load stats:", err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const cards = stats
        ? [
            { title: "Ingresos Totales", value: `$${stats.totalRevenue.toFixed(2)}`, icon: TrendingUp },
            { title: "Órdenes", value: String(stats.totalOrders), icon: ShoppingCart },
            { title: "Categorías", value: String(stats.totalCategories), icon: FolderTree },
            { title: "Productos Activos", value: String(stats.totalProducts), icon: Package },
        ]
        : [];

    return (
        <div className="flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ gap: "2.5rem" }}>
            <div>
                <h1 className="text-3xl font-display font-bold text-[var(--text-primary)] mb-2">Dashboard</h1>
                <p className="text-[var(--text-secondary)]">Resumen de la tienda y estado general.</p>
            </div>

            {/* Loading */}
            {loading && (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-[var(--neon-green)]" />
                </div>
            )}

            {/* Stats Grid */}
            {!loading && stats && (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4" style={{ gap: "2rem" }}>
                    {cards.map((stat, i) => {
                        const Icon = stat.icon;
                        return (
                            <div key={i} className="glass-card flex flex-col justify-between group h-40" style={{ padding: "1.5rem" }}>
                                <div className="flex items-start justify-between w-full mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--neon-green)] group-hover:shadow-[var(--glow-green)] transition-all duration-300">
                                        <Icon className="w-6 h-6" />
                                    </div>
                                </div>
                                <div className="mt-auto">
                                    <h3 className="text-[var(--text-muted)] font-medium mb-1" style={{ fontSize: "0.95rem" }}>{stat.title}</h3>
                                    <p className="font-bold text-[var(--text-primary)]" style={{ fontSize: "1.75rem", lineHeight: "1.2" }}>{stat.value}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Placeholder Charts Area */}
            {!loading && (
                <div className="grid grid-cols-1 lg:grid-cols-3" style={{ gap: "2rem" }}>
                    <div className="glass-card lg:col-span-2 flex flex-col items-center justify-center min-h-[400px]" style={{ padding: "2.5rem" }}>
                        <div className="w-16 h-16 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-center mb-6 shadow-[var(--glow-green)]">
                            <TrendingUp className="w-8 h-8 text-[var(--neon-green)]" />
                        </div>
                        <h3 className="text-xl font-medium text-[var(--text-primary)] mb-3">Resumen de Ventas</h3>
                        <p className="text-[var(--text-muted)] text-center max-w-md text-sm">
                            Las gráficas de evolución de ventas se habilitarán cuando el sistema de pagos esté integrado (Fase 9).
                        </p>
                    </div>

                    <div className="glass-card flex flex-col items-center justify-center min-h-[400px]" style={{ padding: "2.5rem" }}>
                        <div className="w-16 h-16 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-center mb-6 shadow-[var(--glow-blue)]">
                            <ShoppingCart className="w-8 h-8 text-[var(--neon-blue)]" />
                        </div>
                        <h3 className="text-xl font-medium text-[var(--text-primary)] mb-3">Últimas Órdenes</h3>
                        <p className="text-[var(--text-muted)] text-center text-sm">
                            {stats && stats.totalOrders > 0 ? `${stats.totalOrders} órdenes registradas. Visitá la sección Órdenes para el detalle completo.` : "Las órdenes aparecerán aquí cuando tus clientes realicen compras."}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

"use client";

import { useState, useEffect, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Eye, X, Loader2, ShoppingBag, ChevronDown } from "lucide-react";
import { getOrders, updateOrderStatus } from "@/lib/actions/orders";
import type { Order, OrderStatus } from "@/lib/types";

const statusConfig: Record<OrderStatus, { label: string; color: string }> = {
    pending: { label: "Pendiente", color: "var(--neon-orange)" },
    completed: { label: "Completada", color: "var(--neon-green)" },
    cancelled: { label: "Cancelada", color: "var(--neon-pink)" },
    refunded: { label: "Reembolsada", color: "var(--neon-blue)" },
};

export default function OrdenesAdminPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const [detailOrder, setDetailOrder] = useState<Order | null>(null);

    useEffect(() => {
        loadOrders();
    }, []);

    async function loadOrders() {
        setLoading(true);
        try {
            const data = await getOrders();
            setOrders(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleStatusChange(orderId: string, newStatus: OrderStatus) {
        startTransition(async () => {
            try {
                await updateOrderStatus(orderId, newStatus);
                await loadOrders();
            } catch (err: any) {
                setError(err.message);
            }
        });
    }

    const filtered = orders.filter((o) => {
        const matchesSearch =
            o.id.toLowerCase().includes(search.toLowerCase()) ||
            (o.customer_email || "").toLowerCase().includes(search.toLowerCase()) ||
            (o.profile as any)?.full_name?.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = !filterStatus || o.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const totalRevenue = filtered
        .filter((o) => o.status === "completed")
        .reduce((sum, o) => sum + Number(o.total_amount), 0);

    return (
        <div className="flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ gap: "2.5rem", paddingTop: "1rem" }}>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-[var(--text-primary)] mb-2">Órdenes</h1>
                    <p className="text-[var(--text-secondary)]">Rastrea y gestiona las compras de tus clientes.</p>
                </div>
                {filtered.length > 0 && (
                    <div className="glass-card self-start sm:self-auto" style={{ padding: "0.75rem 1.25rem" }}>
                        <span className="text-sm text-[var(--text-muted)]">Revenue filtrado: </span>
                        <span className="text-lg font-bold text-[var(--neon-green)]">${totalRevenue.toFixed(2)}</span>
                    </div>
                )}
            </div>

            {/* Error Banner */}
            <AnimatePresence>
                {error && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                        className="rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center justify-between"
                        style={{ padding: "0.75rem 1rem" }}>
                        <span>{error}</span>
                        <button onClick={() => setError(null)} className="ml-4 hover:text-white"><X className="w-4 h-4" /></button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Filters Bar */}
            <div className="glass-card flex flex-col sm:flex-row justify-between items-center z-20" style={{ padding: "1rem", gap: "1rem" }}>
                <div className="relative w-full sm:max-w-md">
                    <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                    <input type="text" placeholder="Buscar por ID, email o cliente..." value={search} onChange={(e) => setSearch(e.target.value)}
                        className="input-neon w-full" style={{ paddingLeft: "3rem" }} />
                </div>
                <div className="flex gap-3 w-full sm:w-auto items-center">
                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="input-neon text-sm flex-1 sm:flex-none">
                        <option value="">Todos los estados</option>
                        <option value="pending">Pendiente</option>
                        <option value="completed">Completada</option>
                        <option value="cancelled">Cancelada</option>
                        <option value="refunded">Reembolsada</option>
                    </select>
                    <span className="text-sm text-[var(--text-muted)] whitespace-nowrap">{filtered.length} orden{filtered.length !== 1 ? "es" : ""}</span>
                </div>
            </div>

            {/* Loading */}
            {loading && (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-[var(--neon-green)]" />
                </div>
            )}

            {/* Data Table */}
            {!loading && filtered.length > 0 && (
                <div className="glass-card overflow-hidden flex flex-col">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
                                    <th className="text-sm font-medium text-[var(--text-secondary)]" style={{ padding: "1rem 1.5rem" }}>ID</th>
                                    <th className="text-sm font-medium text-[var(--text-secondary)]" style={{ padding: "1rem 1.5rem" }}>Cliente</th>
                                    <th className="text-sm font-medium text-[var(--text-secondary)] hidden md:table-cell" style={{ padding: "1rem 1.5rem" }}>Fecha</th>
                                    <th className="text-sm font-medium text-[var(--text-secondary)]" style={{ padding: "1rem 1.5rem" }}>Total</th>
                                    <th className="text-sm font-medium text-[var(--text-secondary)]" style={{ padding: "1rem 1.5rem" }}>Estado</th>
                                    <th className="text-sm font-medium text-[var(--text-secondary)] text-right hidden sm:table-cell" style={{ padding: "1rem 1.5rem" }}>Items</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border-subtle)]">
                                {filtered.map((order) => {
                                    const config = statusConfig[order.status as OrderStatus] || statusConfig.pending;
                                    return (
                                        <tr key={order.id} className="hover:bg-[var(--bg-secondary)] transition-colors group">
                                            <td style={{ padding: "1rem 1.5rem" }}>
                                                <span className="font-mono text-sm text-[var(--text-primary)]">{order.id.slice(0, 8)}...</span>
                                            </td>
                                            <td style={{ padding: "1rem 1.5rem" }}>
                                                <div className="font-medium text-[var(--text-primary)]">{(order.profile as any)?.full_name || "Anónimo"}</div>
                                                <div className="text-xs text-[var(--text-muted)]">{order.customer_email || "—"}</div>
                                            </td>
                                            <td className="hidden md:table-cell text-sm text-[var(--text-secondary)]" style={{ padding: "1rem 1.5rem" }}>
                                                {new Date(order.created_at).toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" })}
                                            </td>
                                            <td className="font-bold text-[var(--text-primary)]" style={{ padding: "1rem 1.5rem" }}>
                                                ${Number(order.total_amount).toFixed(2)}
                                            </td>
                                            <td style={{ padding: "1rem 1.5rem" }}>
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                                                    disabled={isPending}
                                                    className="text-xs font-semibold px-2 py-1 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-secondary)] cursor-pointer appearance-none outline-none"
                                                    style={{ color: config.color }}
                                                >
                                                    <option value="pending">Pendiente</option>
                                                    <option value="completed">Completada</option>
                                                    <option value="cancelled">Cancelada</option>
                                                    <option value="refunded">Reembolsada</option>
                                                </select>
                                            </td>
                                            <td className="hidden sm:table-cell text-right" style={{ padding: "1rem 1.5rem" }}>
                                                <span className="text-sm text-[var(--text-secondary)]">{(order.items as any[])?.length || 0} items</span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className="border-t border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-secondary)] mt-auto rounded-b-xl" style={{ padding: "1rem 1.5rem" }}>
                        <span className="text-sm text-[var(--text-muted)]">Mostrando {filtered.length} orden{filtered.length !== 1 ? "es" : ""}</span>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!loading && filtered.length === 0 && (
                <div className="glass-card flex items-center justify-center border-dashed text-center" style={{ padding: "3rem", minHeight: "200px" }}>
                    <div className="flex flex-col items-center max-w-md">
                        <div className="w-12 h-12 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)] mb-4">
                            <ShoppingBag className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">{search || filterStatus ? "Sin resultados" : "Sin órdenes aún"}</h3>
                        <p className="text-[var(--text-secondary)] text-sm">
                            {search || filterStatus ? "Probá ajustando los filtros." : "Las órdenes aparecerán aquí cuando tus clientes realicen compras."}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

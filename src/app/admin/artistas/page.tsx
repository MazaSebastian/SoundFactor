"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Users, Clock, CheckCircle, XCircle, BadgeCheck,
    Eye, ChevronDown, ChevronUp, Loader2, BarChart3
} from "lucide-react";
import {
    getAllApplications, getPendingApplications,
    approveArtist, rejectArtist, getArtistStats,
    type ArtistApplication
} from "@/lib/actions/artists";

export default function AdminArtistasPage() {
    const [applications, setApplications] = useState<ArtistApplication[]>([]);
    const [stats, setStats] = useState({ verifiedArtists: 0, pendingApplications: 0, totalApplications: 0 });
    const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [processing, setProcessing] = useState<string | null>(null);
    const [rejectReason, setRejectReason] = useState("");
    const [showRejectModal, setShowRejectModal] = useState<string | null>(null);

    const loadData = async () => {
        setLoading(true);
        const [apps, s] = await Promise.all([getAllApplications(), getArtistStats()]);
        setApplications(apps);
        setStats(s);
        setLoading(false);
    };

    useEffect(() => { loadData(); }, []);

    const filtered = filter === "all"
        ? applications
        : applications.filter((a) => a.status === filter);

    const handleApprove = async (id: string) => {
        setProcessing(id);
        try {
            await approveArtist(id);
            await loadData();
        } catch (err: any) {
            alert("Error: " + err.message);
        }
        setProcessing(null);
    };

    const handleReject = async (id: string) => {
        if (!rejectReason.trim()) return;
        setProcessing(id);
        try {
            await rejectArtist(id, rejectReason);
            setShowRejectModal(null);
            setRejectReason("");
            await loadData();
        } catch (err: any) {
            alert("Error: " + err.message);
        }
        setProcessing(null);
    };

    const statusColor = {
        pending: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
        approved: "text-[var(--neon-green)] bg-[var(--neon-green)]/10 border-[var(--neon-green)]/20",
        rejected: "text-red-400 bg-red-400/10 border-red-400/20",
    };
    const statusIcon = { pending: Clock, approved: CheckCircle, rejected: XCircle };

    return (
        <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-8">
                Gestión de <span className="text-[var(--neon-green)]">Artistas</span>
            </h1>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {[
                    { label: "Artistas Verificados", value: stats.verifiedArtists, icon: BadgeCheck, color: "var(--neon-green)" },
                    { label: "Pendientes de Revisión", value: stats.pendingApplications, icon: Clock, color: "#facc15" },
                    { label: "Total Solicitudes", value: stats.totalApplications, icon: BarChart3, color: "#a78bfa" },
                ].map((s) => (
                    <div key={s.label} className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-5">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg" style={{ background: `${s.color}15` }}>
                                <s.icon className="w-5 h-5" style={{ color: s.color }} />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{s.value}</p>
                                <p className="text-sm text-[var(--text-muted)]">{s.label}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-6 flex-wrap">
                {(["all", "pending", "approved", "rejected"] as const).map((f) => (
                    <button key={f} onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === f
                                ? "bg-[var(--neon-green)]/20 text-[var(--neon-green)] border border-[var(--neon-green)]/30"
                                : "bg-[var(--glass-bg)] text-[var(--text-secondary)] border border-[var(--glass-border)]"
                            }`}>
                        {f === "all" ? "Todas" : f === "pending" ? "Pendientes" : f === "approved" ? "Aprobadas" : "Rechazadas"}
                        {f === "pending" && stats.pendingApplications > 0 && (
                            <span className="ml-2 px-1.5 py-0.5 rounded text-xs bg-yellow-400/20 text-yellow-400">
                                {stats.pendingApplications}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Applications list */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="w-10 h-10 rounded-full border-2 border-transparent animate-spin"
                        style={{ borderTopColor: "var(--neon-green)" }} />
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-12">
                    <Users className="w-12 h-12 mx-auto mb-4 text-[var(--text-muted)]" />
                    <p className="text-[var(--text-secondary)]">No hay solicitudes</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filtered.map((app) => {
                        const StatusIcon = statusIcon[app.status];
                        const isExpanded = expandedId === app.id;
                        return (
                            <motion.div
                                key={app.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] overflow-hidden"
                            >
                                {/* Summary row */}
                                <div
                                    onClick={() => setExpandedId(isExpanded ? null : app.id)}
                                    className="flex items-center gap-4 p-5 cursor-pointer hover:bg-white/[0.02] transition-colors"
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="font-semibold truncate">{app.artist_name}</h3>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${statusColor[app.status]}`}>
                                                {app.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-[var(--text-muted)]">
                                            {app.genre} · {new Date(app.created_at).toLocaleDateString("es-AR")}
                                            {app.profile?.full_name && ` · ${app.profile.full_name}`}
                                        </p>
                                    </div>
                                    {isExpanded ? <ChevronUp className="w-5 h-5 text-[var(--text-muted)]" /> : <ChevronDown className="w-5 h-5 text-[var(--text-muted)]" />}
                                </div>

                                {/* Expanded details */}
                                {isExpanded && (
                                    <div className="px-5 pb-5 border-t border-[var(--glass-border)] pt-4 space-y-4">
                                        <div>
                                            <p className="text-sm font-medium text-[var(--text-muted)] mb-1">Bio</p>
                                            <p className="text-sm text-[var(--text-secondary)]">{app.bio}</p>
                                        </div>
                                        {app.motivation && (
                                            <div>
                                                <p className="text-sm font-medium text-[var(--text-muted)] mb-1">Motivación</p>
                                                <p className="text-sm text-[var(--text-secondary)]">{app.motivation}</p>
                                            </div>
                                        )}
                                        {app.portfolio_urls && app.portfolio_urls.length > 0 && (
                                            <div>
                                                <p className="text-sm font-medium text-[var(--text-muted)] mb-1">Portfolio</p>
                                                {app.portfolio_urls.map((url, i) => (
                                                    <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                                                        className="block text-sm text-[var(--neon-green)] hover:underline truncate">{url}</a>
                                                ))}
                                            </div>
                                        )}
                                        <div className="flex gap-3 flex-wrap">
                                            {app.instagram_url && <a href={app.instagram_url} target="_blank" rel="noopener noreferrer" className="text-xs text-[var(--text-muted)] hover:text-[var(--neon-green)]">Instagram ↗</a>}
                                            {app.spotify_url && <a href={app.spotify_url} target="_blank" rel="noopener noreferrer" className="text-xs text-[var(--text-muted)] hover:text-[var(--neon-green)]">Spotify ↗</a>}
                                            {app.soundcloud_url && <a href={app.soundcloud_url} target="_blank" rel="noopener noreferrer" className="text-xs text-[var(--text-muted)] hover:text-[var(--neon-green)]">SoundCloud ↗</a>}
                                        </div>

                                        {/* Actions */}
                                        {app.status === "pending" && (
                                            <div className="flex gap-3 pt-2">
                                                <button
                                                    onClick={() => handleApprove(app.id)}
                                                    disabled={processing === app.id}
                                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-black bg-[var(--neon-green)]
                                                             hover:shadow-[0_0_20px_rgba(0,255,178,0.3)] transition-all disabled:opacity-50"
                                                >
                                                    {processing === app.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                                                    Aprobar
                                                </button>
                                                <button
                                                    onClick={() => setShowRejectModal(app.id)}
                                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-red-400
                                                             bg-red-400/10 border border-red-400/20 hover:bg-red-400/20 transition-all"
                                                >
                                                    <XCircle className="w-4 h-4" /> Rechazar
                                                </button>
                                            </div>
                                        )}

                                        {app.status === "rejected" && app.rejection_reason && (
                                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                                                <p className="text-sm text-red-400"><strong>Motivo:</strong> {app.rejection_reason}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Reject modal */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="rounded-2xl border border-[var(--glass-border)] bg-[var(--bg-secondary)] p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4">Motivo de rechazo</h3>
                        <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)]
                                     text-[var(--text-primary)] focus:outline-none focus:border-red-400/40 transition-colors resize-none mb-4"
                            placeholder="Explicá brevemente por qué se rechaza..."
                        />
                        <div className="flex gap-3 justify-end">
                            <button onClick={() => { setShowRejectModal(null); setRejectReason(""); }}
                                className="px-4 py-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                                Cancelar
                            </button>
                            <button onClick={() => handleReject(showRejectModal)}
                                disabled={!rejectReason.trim() || processing === showRejectModal}
                                className="flex items-center gap-2 px-5 py-2 rounded-xl font-medium text-red-400
                                         bg-red-400/10 border border-red-400/20 disabled:opacity-50">
                                {processing === showRejectModal ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                                Rechazar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

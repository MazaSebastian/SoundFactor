"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Send, Music, CheckCircle, Clock, XCircle, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { submitArtistApplication, getMyApplicationStatus } from "@/lib/actions/artists";

export default function AplicarArtistaPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [existingApp, setExistingApp] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [form, setForm] = useState({
        artist_name: "",
        genre: "",
        bio: "",
        portfolio_urls: "",
        instagram_url: "",
        spotify_url: "",
        soundcloud_url: "",
        motivation: "",
    });

    useEffect(() => {
        const supabase = createClient();
        const checkAuth = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            if (user) {
                const app = await getMyApplicationStatus();
                setExistingApp(app);
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.artist_name || !form.genre || !form.bio) {
            setError("Completá nombre artístico, género y bio");
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            await submitArtistApplication({
                artist_name: form.artist_name,
                genre: form.genre,
                bio: form.bio,
                portfolio_urls: form.portfolio_urls.split("\n").map((u) => u.trim()).filter(Boolean),
                instagram_url: form.instagram_url || undefined,
                spotify_url: form.spotify_url || undefined,
                soundcloud_url: form.soundcloud_url || undefined,
                motivation: form.motivation || undefined,
            });
            setSuccess(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-10 h-10 rounded-full border-2 border-transparent animate-spin"
                    style={{ borderTopColor: "var(--neon-green)" }} />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ paddingTop: "5rem" }}>
                <div className="text-center">
                    <Music className="w-16 h-16 mx-auto mb-4 text-[var(--text-muted)]" />
                    <h2 className="text-2xl font-bold mb-2">Inicia sesión para aplicar</h2>
                    <Link href="/auth" className="btn-primary mt-4 inline-block">Iniciar sesión</Link>
                </div>
            </div>
        );
    }

    // Application status view
    if (existingApp || success) {
        const status = success ? "pending" : existingApp?.status;
        return (
            <div className="section-container py-12" style={{ paddingTop: "6rem" }}>
                <Link href="/artistas" className="inline-flex items-center gap-1 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Artistas
                </Link>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-lg mx-auto rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-8 text-center"
                >
                    {status === "pending" && (
                        <>
                            <Clock className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
                            <h2 className="text-2xl font-bold mb-2">Solicitud en revisión</h2>
                            <p className="text-[var(--text-secondary)]">
                                Tu solicitud está siendo evaluada por nuestro equipo. Te notificaremos cuando haya una respuesta.
                            </p>
                        </>
                    )}
                    {status === "approved" && (
                        <>
                            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-[var(--neon-green)]" />
                            <h2 className="text-2xl font-bold mb-2">¡Aprobado!</h2>
                            <p className="text-[var(--text-secondary)]">
                                Ya sos un artista verificado en SoundFactory.
                            </p>
                        </>
                    )}
                    {status === "rejected" && (
                        <>
                            <XCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
                            <h2 className="text-2xl font-bold mb-2">Solicitud rechazada</h2>
                            <p className="text-[var(--text-secondary)]">
                                {existingApp?.rejection_reason || "Tu solicitud no fue aprobada en esta oportunidad."}
                            </p>
                        </>
                    )}
                </motion.div>
            </div>
        );
    }

    return (
        <div className="section-container py-12" style={{ paddingTop: "6rem" }}>
            <Link href="/artistas" className="inline-flex items-center gap-1 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Artistas
            </Link>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                    Aplicar como{" "}
                    <span className="bg-gradient-to-r from-[var(--neon-green)] to-emerald-400 bg-clip-text text-transparent">Artista</span>
                </h1>
                <p className="text-[var(--text-secondary)] mb-10">
                    Completá el formulario y nuestro equipo evaluará tu perfil para otorgarte el badge de artista verificado.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Artist Name */}
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                            Nombre artístico *
                        </label>
                        <input
                            type="text"
                            value={form.artist_name}
                            onChange={(e) => setForm({ ...form, artist_name: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)]
                                     text-[var(--text-primary)] focus:outline-none focus:border-[var(--neon-green)]/40 transition-colors"
                            placeholder="Tu nombre artístico"
                        />
                    </div>

                    {/* Genre */}
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Género musical *</label>
                        <select
                            value={form.genre}
                            onChange={(e) => setForm({ ...form, genre: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)]
                                     text-[var(--text-primary)] focus:outline-none focus:border-[var(--neon-green)]/40 transition-colors"
                        >
                            <option value="">Seleccionar género</option>
                            {["Trap", "Reggaeton", "Hip Hop", "R&B", "Pop", "EDM", "Rock", "Jazz", "Lo-Fi", "Cumbia", "Otro"].map((g) => (
                                <option key={g} value={g}>{g}</option>
                            ))}
                        </select>
                    </div>

                    {/* Bio */}
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Bio / Descripción *</label>
                        <textarea
                            value={form.bio}
                            onChange={(e) => setForm({ ...form, bio: e.target.value })}
                            rows={4}
                            className="w-full px-4 py-3 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)]
                                     text-[var(--text-primary)] focus:outline-none focus:border-[var(--neon-green)]/40 transition-colors resize-none"
                            placeholder="Contanos sobre vos, tu trayectoria y qué tipo de contenido ofrecerías..."
                        />
                    </div>

                    {/* Portfolio */}
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Links de portfolio (uno por línea)</label>
                        <textarea
                            value={form.portfolio_urls}
                            onChange={(e) => setForm({ ...form, portfolio_urls: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)]
                                     text-[var(--text-primary)] focus:outline-none focus:border-[var(--neon-green)]/40 transition-colors resize-none"
                            placeholder="https://soundcloud.com/tu-perfil&#10;https://youtube.com/tu-canal"
                        />
                    </div>

                    {/* Social links */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Instagram</label>
                            <input type="url" value={form.instagram_url} onChange={(e) => setForm({ ...form, instagram_url: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--neon-green)]/40 transition-colors"
                                placeholder="https://instagram.com/..." />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Spotify</label>
                            <input type="url" value={form.spotify_url} onChange={(e) => setForm({ ...form, spotify_url: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--neon-green)]/40 transition-colors"
                                placeholder="https://open.spotify.com/..." />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">SoundCloud</label>
                            <input type="url" value={form.soundcloud_url} onChange={(e) => setForm({ ...form, soundcloud_url: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--neon-green)]/40 transition-colors"
                                placeholder="https://soundcloud.com/..." />
                        </div>
                    </div>

                    {/* Motivation */}
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">¿Por qué querés unirte?</label>
                        <textarea
                            value={form.motivation}
                            onChange={(e) => setForm({ ...form, motivation: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)]
                                     text-[var(--text-primary)] focus:outline-none focus:border-[var(--neon-green)]/40 transition-colors resize-none"
                            placeholder="¿Qué tipo de servicios ofrecerías? ¿Mentorías, cursos, beats?"
                        />
                    </div>

                    {error && (
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-4 rounded-xl font-semibold text-black bg-[var(--neon-green)]
                                 hover:shadow-[0_0_30px_rgba(0,255,178,0.3)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                        {submitting ? "Enviando..." : "Enviar solicitud"}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}

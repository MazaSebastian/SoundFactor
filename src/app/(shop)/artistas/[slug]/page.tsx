"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
    BadgeCheck, Music, Users, Star, ShoppingBag,
    Instagram, ExternalLink, ArrowLeft, Globe
} from "lucide-react";
import Link from "next/link";
import { getArtistBySlug, type ArtistProfile } from "@/lib/actions/artists";

export default function ArtistProfilePage() {
    const params = useParams();
    const [artist, setArtist] = useState<ArtistProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.slug) {
            getArtistBySlug(params.slug as string)
                .then(setArtist)
                .finally(() => setLoading(false));
        }
    }, [params.slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-10 h-10 rounded-full border-2 border-transparent animate-spin"
                    style={{ borderTopColor: "var(--neon-green)", borderRightColor: "rgba(0,255,178,0.3)" }} />
            </div>
        );
    }

    if (!artist) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Music className="w-16 h-16 mx-auto mb-4 text-[var(--text-muted)]" />
                    <h2 className="text-2xl font-bold mb-2">Artista no encontrado</h2>
                    <Link href="/artistas" className="text-[var(--neon-green)] hover:underline">
                        ← Volver al directorio
                    </Link>
                </div>
            </div>
        );
    }

    const socialLinks = [
        { url: artist.instagram_url, icon: Instagram, label: "Instagram" },
        { url: artist.spotify_url, icon: Music, label: "Spotify" },
        { url: artist.soundcloud_url, icon: Music, label: "SoundCloud" },
        { url: artist.youtube_url, icon: ExternalLink, label: "YouTube" },
        { url: artist.website_url, icon: Globe, label: "Website" },
    ].filter((l) => l.url);

    return (
        <div className="min-h-screen" style={{ paddingTop: "5rem" }}>
            {/* Cover */}
            <div className="h-48 md:h-64 relative bg-gradient-to-br from-[var(--neon-green)]/20 via-purple-500/15 to-blue-500/10">
                {artist.cover_image_url && (
                    <img src={artist.cover_image_url} alt="" className="absolute inset-0 w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] to-transparent" />
            </div>

            <div className="section-container relative -mt-16 z-10 pb-20">
                {/* Back */}
                <Link href="/artistas" className="inline-flex items-center gap-1 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Artistas
                </Link>

                {/* Header */}
                <div className="flex flex-col md:flex-row items-start gap-6 mb-10">
                    {/* Avatar */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-28 h-28 rounded-full border-4 border-[var(--bg-primary)] bg-[var(--glass-bg)]
                                  flex items-center justify-center overflow-hidden shadow-xl"
                    >
                        {artist.avatar_url ? (
                            <img src={artist.avatar_url} alt={artist.artist_name} className="w-full h-full object-cover" />
                        ) : (
                            <Music className="w-12 h-12 text-[var(--text-muted)]" />
                        )}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex-1"
                    >
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-3xl md:text-4xl font-bold">{artist.artist_name}</h1>
                            <BadgeCheck className="w-6 h-6 text-[var(--neon-green)]" />
                        </div>
                        {artist.genre && (
                            <span className="inline-block px-3 py-1 rounded-full text-sm font-medium
                                           bg-[var(--neon-green)]/10 text-[var(--neon-green)] border border-[var(--neon-green)]/20 mb-4">
                                {artist.genre}
                            </span>
                        )}

                        {/* Stats */}
                        <div className="flex gap-8 mt-4">
                            <div>
                                <p className="text-2xl font-bold text-[var(--text-primary)]">{artist.total_followers}</p>
                                <p className="text-sm text-[var(--text-muted)]">Seguidores</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-[var(--text-primary)]">{artist.total_sales}</p>
                                <p className="text-sm text-[var(--text-muted)]">Ventas</p>
                            </div>
                            {artist.rating_count > 0 && (
                                <div>
                                    <p className="text-2xl font-bold text-yellow-400">⭐ {Number(artist.rating_avg).toFixed(1)}</p>
                                    <p className="text-sm text-[var(--text-muted)]">{artist.rating_count} reseñas</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Content grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Bio */}
                        {artist.bio && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-6"
                            >
                                <h2 className="text-lg font-semibold mb-4">Sobre el artista</h2>
                                <p className="text-[var(--text-secondary)] whitespace-pre-wrap leading-relaxed">
                                    {artist.bio}
                                </p>
                            </motion.div>
                        )}

                        {/* Services placeholder */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-6"
                        >
                            <h2 className="text-lg font-semibold mb-4">Servicios</h2>
                            <div className="text-center py-8">
                                <ShoppingBag className="w-10 h-10 mx-auto mb-3 text-[var(--text-muted)]" />
                                <p className="text-[var(--text-muted)]">Próximamente: cursos, mentorías y beats</p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Social links */}
                        {socialLinks.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-6"
                            >
                                <h3 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-4">
                                    Redes Sociales
                                </h3>
                                <div className="space-y-3">
                                    {socialLinks.map((link) => (
                                        <a
                                            key={link.label}
                                            href={link.url!}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 text-[var(--text-secondary)] hover:text-[var(--neon-green)] transition-colors group"
                                        >
                                            <link.icon className="w-4 h-4" />
                                            <span className="text-sm">{link.label}</span>
                                            <ExternalLink className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </a>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

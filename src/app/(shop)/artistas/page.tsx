"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Music, Star, Users, BadgeCheck, ExternalLink } from "lucide-react";
import Link from "next/link";
import { getVerifiedArtists, getArtistGenres, type ArtistProfile } from "@/lib/actions/artists";

export default function ArtistasPage() {
    const [artists, setArtists] = useState<ArtistProfile[]>([]);
    const [genres, setGenres] = useState<string[]>([]);
    const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([getVerifiedArtists(), getArtistGenres()])
            .then(([a, g]) => {
                setArtists(a);
                setGenres(g);
            })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        setLoading(true);
        getVerifiedArtists(selectedGenre || undefined)
            .then(setArtists)
            .finally(() => setLoading(false));
    }, [selectedGenre]);

    const filtered = search
        ? artists.filter((a) =>
            a.artist_name.toLowerCase().includes(search.toLowerCase()) ||
            (a.genre || "").toLowerCase().includes(search.toLowerCase())
        )
        : artists;

    return (
        <div className="section-container py-12" style={{ paddingTop: "6rem" }}>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
            >
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    Artistas{" "}
                    <span className="bg-gradient-to-r from-[var(--neon-green)] to-emerald-400 bg-clip-text text-transparent">
                        Verificados
                    </span>
                </h1>
                <p className="text-[var(--text-secondary)] text-lg max-w-xl">
                    Conectá con los mejores artistas y productores. Mentorías, cursos, beats exclusivos y más.
                </p>
            </motion.div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-10">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar artista..."
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)]
                                 text-[var(--text-primary)] placeholder:text-[var(--text-muted)]
                                 focus:outline-none focus:border-[var(--neon-green)]/40 transition-colors"
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    <button
                        onClick={() => setSelectedGenre(null)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${!selectedGenre
                                ? "bg-[var(--neon-green)]/20 text-[var(--neon-green)] border border-[var(--neon-green)]/30"
                                : "bg-[var(--glass-bg)] text-[var(--text-secondary)] border border-[var(--glass-border)] hover:border-[var(--text-muted)]"
                            }`}
                    >
                        Todos
                    </button>
                    {genres.map((g) => (
                        <button
                            key={g}
                            onClick={() => setSelectedGenre(g)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedGenre === g
                                    ? "bg-[var(--neon-green)]/20 text-[var(--neon-green)] border border-[var(--neon-green)]/30"
                                    : "bg-[var(--glass-bg)] text-[var(--text-secondary)] border border-[var(--glass-border)] hover:border-[var(--text-muted)]"
                                }`}
                        >
                            {g}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-10 h-10 rounded-full border-2 border-transparent animate-spin"
                        style={{ borderTopColor: "var(--neon-green)", borderRightColor: "rgba(0,255,178,0.3)" }} />
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-20">
                    <Users className="w-12 h-12 mx-auto mb-4 text-[var(--text-muted)]" />
                    <p className="text-[var(--text-secondary)]">No se encontraron artistas</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filtered.map((artist, i) => (
                        <motion.div
                            key={artist.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <Link href={`/artistas/${artist.slug}`}>
                                <div className="group relative rounded-2xl overflow-hidden border border-[var(--glass-border)]
                                              bg-[var(--glass-bg)] hover:border-[var(--neon-green)]/30 transition-all duration-300
                                              hover:shadow-[0_0_30px_rgba(0,255,178,0.08)]">
                                    {/* Cover */}
                                    <div className="h-32 bg-gradient-to-br from-[var(--neon-green)]/20 to-purple-500/20 relative">
                                        {artist.cover_image_url && (
                                            <img src={artist.cover_image_url} alt="" className="absolute inset-0 w-full h-full object-cover" />
                                        )}
                                        {artist.is_featured && (
                                            <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-yellow-500/20 border border-yellow-500/30">
                                                <Star className="w-3 h-3 text-yellow-400" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Avatar */}
                                    <div className="flex justify-center -mt-10 relative z-10">
                                        <div className="w-20 h-20 rounded-full border-4 border-[var(--bg-primary)] bg-[var(--glass-bg)]
                                                      flex items-center justify-center overflow-hidden">
                                            {artist.avatar_url ? (
                                                <img src={artist.avatar_url} alt={artist.artist_name} className="w-full h-full object-cover" />
                                            ) : (
                                                <Music className="w-8 h-8 text-[var(--text-muted)]" />
                                            )}
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="p-5 pt-3 text-center">
                                        <div className="flex items-center justify-center gap-1.5 mb-1">
                                            <h3 className="font-semibold text-[var(--text-primary)] group-hover:text-[var(--neon-green)] transition-colors">
                                                {artist.artist_name}
                                            </h3>
                                            <BadgeCheck className="w-4 h-4 text-[var(--neon-green)]" />
                                        </div>
                                        {artist.genre && (
                                            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium
                                                           bg-[var(--neon-green)]/10 text-[var(--neon-green)] border border-[var(--neon-green)]/20 mb-3">
                                                {artist.genre}
                                            </span>
                                        )}
                                        {artist.bio && (
                                            <p className="text-sm text-[var(--text-muted)] line-clamp-2 mt-2">
                                                {artist.bio}
                                            </p>
                                        )}

                                        {/* Stats */}
                                        <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-[var(--glass-border)]">
                                            <div className="text-center">
                                                <p className="text-sm font-semibold text-[var(--text-primary)]">{artist.total_followers}</p>
                                                <p className="text-xs text-[var(--text-muted)]">Seguidores</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-sm font-semibold text-[var(--text-primary)]">{artist.total_sales}</p>
                                                <p className="text-xs text-[var(--text-muted)]">Ventas</p>
                                            </div>
                                            {artist.rating_count > 0 && (
                                                <div className="text-center">
                                                    <p className="text-sm font-semibold text-yellow-400">⭐ {Number(artist.rating_avg).toFixed(1)}</p>
                                                    <p className="text-xs text-[var(--text-muted)]">{artist.rating_count} reseñas</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}

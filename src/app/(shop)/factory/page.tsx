"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search, Filter, X, ChevronDown, Loader2, Play, Pause,
    Music, Download, AudioLines, Zap
} from "lucide-react";
import { getSamples, getSampleFilterOptions, type SampleFilters } from "@/lib/actions/samples";

/* ============================================
   Mini waveform player for each sample card
   ============================================ */
function SamplePlayer({ src, title }: { src: string; title: string }) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        const onTime = () => {
            if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100);
        };
        const onEnd = () => { setIsPlaying(false); setProgress(0); };
        audio.addEventListener("timeupdate", onTime);
        audio.addEventListener("ended", onEnd);
        return () => {
            audio.removeEventListener("timeupdate", onTime);
            audio.removeEventListener("ended", onEnd);
        };
    }, []);

    const toggle = () => {
        const audio = audioRef.current;
        if (!audio) return;
        if (isPlaying) { audio.pause(); } else { audio.play(); }
        setIsPlaying(!isPlaying);
    };

    return (
        <div className="flex items-center gap-3 w-full">
            <audio ref={audioRef} src={src} preload="none" />
            <button
                onClick={toggle}
                className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all"
                style={{
                    background: isPlaying ? "rgba(0,255,178,0.12)" : "rgba(255,255,255,0.04)",
                    border: `1px solid ${isPlaying ? "rgba(0,255,178,0.3)" : "rgba(255,255,255,0.06)"}`,
                }}
            >
                {isPlaying ? (
                    <Pause className="w-3.5 h-3.5 text-[var(--neon-green)]" />
                ) : (
                    <Play className="w-3.5 h-3.5 text-[var(--text-secondary)] ml-0.5" />
                )}
            </button>
            {/* Progress bar */}
            <div className="flex-1 h-1.5 rounded-full bg-[rgba(255,255,255,0.06)] overflow-hidden">
                <div
                    className="h-full rounded-full transition-all duration-100"
                    style={{
                        width: `${progress}%`,
                        background: "var(--neon-green)",
                        boxShadow: isPlaying ? "0 0 8px rgba(0,255,178,0.3)" : "none",
                    }}
                />
            </div>
        </div>
    );
}

/* ============================================
   Filter pill component
   ============================================ */
function FilterSelect({
    label, value, options, onChange,
}: {
    label: string; value: string; options: string[]; onChange: (v: string) => void;
}) {
    const [open, setOpen] = useState(false);
    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                className={`flex items-center gap-1.5 rounded-full text-xs font-medium border transition-all ${value
                    ? "border-neon-green/40 text-neon-green bg-neon-green/5"
                    : "border-border-subtle text-text-secondary hover:border-text-muted"
                    }`}
                style={{ padding: "0.5rem 1rem" }}
            >
                {value || label}
                <ChevronDown className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
                {open && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            className="absolute left-0 top-full mt-3 min-w-[160px] max-h-60 overflow-y-auto rounded-xl border border-[var(--border-subtle)] bg-[rgba(10,12,16,0.96)] backdrop-blur-xl z-50 shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col gap-1"
                            style={{ padding: "0.5rem" }}
                        >
                            <button
                                onClick={() => { onChange(""); setOpen(false); }}
                                className="w-full text-left px-3 py-2 text-xs rounded-lg text-text-muted hover:bg-[rgba(255,255,255,0.05)]"
                            >
                                Todos
                            </button>
                            {options.map((opt) => (
                                <button
                                    key={opt}
                                    onClick={() => { onChange(opt); setOpen(false); }}
                                    className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-all ${value === opt
                                        ? "text-[var(--neon-green)] bg-[rgba(0,255,178,0.1)]"
                                        : "text-[var(--text-secondary)] hover:bg-[rgba(255,255,255,0.05)]"
                                        }`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

/* ============================================
   Instrument / genre color badges
   ============================================ */
const instrumentColors: Record<string, string> = {
    Kick: "#FF3CAC", Snare: "#00D4FF", HiHat: "#00FFB2", Clap: "#FF6B35",
    "808": "#7B61FF", Bass: "#7B61FF", Fx: "#FF9FFC", Vocal: "#FFD700",
    Perc: "#00D4FF", Synth: "#FF3CAC", Lead: "#00FFB2", Pad: "#7B61FF",
};

function getBadgeColor(instrument: string) {
    return instrumentColors[instrument] || "#00FFB2";
}

/* ============================================
   Main Factory Page
   ============================================ */
export default function FactoryPage() {
    const [samples, setSamples] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [cursor, setCursor] = useState<string | null>(null);
    const [totalCount, setTotalCount] = useState(0);
    const [filterOptions, setFilterOptions] = useState<{
        genres: string[]; instruments: string[]; keys: string[]; moods: string[];
    }>({ genres: [], instruments: [], keys: [], moods: [] });

    const [filters, setFilters] = useState<SampleFilters>({});
    const [search, setSearch] = useState("");
    const [showFilters, setShowFilters] = useState(false);

    // Load filter options once
    useEffect(() => {
        getSampleFilterOptions().then(setFilterOptions);
    }, []);

    // Load samples when filters change
    useEffect(() => {
        setLoading(true);
        setSamples([]);
        setCursor(null);

        const timeout = setTimeout(() => {
            const activeFilters: SampleFilters = { ...filters };
            if (search) activeFilters.search = search;

            getSamples(activeFilters).then((res) => {
                setSamples(res.samples);
                setCursor(res.nextCursor);
                setTotalCount(res.totalCount);
                setLoading(false);
            });
        }, 300); // debounce search

        return () => clearTimeout(timeout);
    }, [filters, search]);

    // Load more (cursor pagination)
    const loadMore = useCallback(async () => {
        if (!cursor || loadingMore) return;
        setLoadingMore(true);

        const activeFilters: SampleFilters = { ...filters };
        if (search) activeFilters.search = search;

        const res = await getSamples(activeFilters, cursor);
        setSamples((prev) => [...prev, ...res.samples]);
        setCursor(res.nextCursor);
        setLoadingMore(false);
    }, [cursor, loadingMore, filters, search]);

    const updateFilter = (key: keyof SampleFilters, value: any) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value || undefined,
        }));
    };

    const clearFilters = () => {
        setFilters({});
        setSearch("");
    };

    const hasActiveFilters = Object.values(filters).some(Boolean) || search;

    return (
        <main className="relative min-h-screen" style={{ paddingTop: "120px", paddingBottom: "7rem" }}>
            {/* Ambient orbs */}
            <div
                className="ambient-orb w-[600px] h-[600px] -top-40 -right-40 animate-pulse-glow"
                style={{ background: "radial-gradient(circle, rgba(0,255,178,0.08) 0%, transparent 70%)" }}
            />
            <div
                className="ambient-orb w-[400px] h-[400px] top-[40%] -left-40"
                style={{ background: "radial-gradient(circle, rgba(123,97,255,0.06) 0%, transparent 70%)" }}
            />

            <div className="section-container">
                {/* Hero */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center flex flex-col items-center"
                    style={{ marginBottom: "4rem" }}
                >
                    <div className="flex items-center justify-center gap-3" style={{ marginBottom: "1.5rem" }}>
                        <div
                            className="w-14 h-14 rounded-2xl flex items-center justify-center"
                            style={{
                                background: "rgba(0,255,178,0.08)",
                                border: "1px solid rgba(0,255,178,0.2)",
                                boxShadow: "var(--glow-green)",
                            }}
                        >
                            <AudioLines className="w-7 h-7 text-[var(--neon-green)]" />
                        </div>
                    </div>
                    <h1
                        className="font-display text-4xl md:text-5xl font-bold text-text-primary"
                        style={{ marginBottom: "2.5rem" }}
                    >
                        Sound<span className="text-[var(--neon-green)]">Factory</span>
                    </h1>
                    <p className="text-[var(--text-secondary)] text-lg max-w-lg mx-auto text-center">
                        Miles de samples individuales listos para usar en tus producciones.
                        Buscá por género, instrumento, BPM o key.
                    </p>
                    {totalCount > 0 && (
                        <p className="text-[var(--text-muted)] text-sm mt-3">
                            <span className="text-[var(--neon-green)] font-bold">{totalCount.toLocaleString()}</span> samples disponibles
                        </p>
                    )}
                </motion.div>

                {/* Search + Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    style={{ marginBottom: "3rem" }}
                >
                    {/* Search bar */}
                    <div className="relative" style={{ marginBottom: "1.5rem" }}>
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar samples por nombre..."
                            className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-sm focus:border-[var(--neon-green)] focus:outline-none transition-colors"
                            style={{ padding: "0.85rem 1rem 0.85rem 2.75rem" }}
                        />
                        {search && (
                            <button
                                onClick={() => setSearch("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-white"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Filter pills */}
                    <div className="flex items-center flex-wrap gap-4">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-1.5 rounded-full text-xs font-medium border transition-all ${showFilters
                                ? "border-neon-green/40 text-neon-green bg-neon-green/5"
                                : "border-border-subtle text-text-secondary hover:border-text-muted"
                                }`}
                            style={{ padding: "0.5rem 1rem" }}
                        >
                            <Filter className="w-3 h-3" />
                            Filtros
                        </button>

                        <FilterSelect
                            label="Género" value={filters.genre || ""}
                            options={filterOptions.genres} onChange={(v) => updateFilter("genre", v)}
                        />
                        <FilterSelect
                            label="Instrumento" value={filters.instrument_type || ""}
                            options={filterOptions.instruments} onChange={(v) => updateFilter("instrument_type", v)}
                        />
                        <FilterSelect
                            label="Key" value={filters.musical_key || ""}
                            options={filterOptions.keys} onChange={(v) => updateFilter("musical_key", v)}
                        />
                        <FilterSelect
                            label="Mood" value={filters.mood || ""}
                            options={filterOptions.moods} onChange={(v) => updateFilter("mood", v)}
                        />

                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="flex items-center gap-1 text-xs text-[var(--text-muted)] hover:text-white transition-colors"
                            >
                                <X className="w-3 h-3" />
                                Limpiar
                            </button>
                        )}
                    </div>

                    {/* BPM range (inside expanded filters) */}
                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                <div
                                    className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-[var(--border-subtle)]"
                                >
                                    <span className="text-xs text-[var(--text-muted)]">BPM:</span>
                                    {[
                                        { label: "Todos", min: undefined, max: undefined },
                                        { label: "60-90", min: 60, max: 90 },
                                        { label: "90-120", min: 90, max: 120 },
                                        { label: "120-140", min: 120, max: 140 },
                                        { label: "140-170", min: 140, max: 170 },
                                        { label: "170+", min: 170, max: 300 },
                                    ].map((opt) => {
                                        const isActive = filters.bpm_min === opt.min && filters.bpm_max === opt.max;
                                        return (
                                            <button
                                                key={opt.label}
                                                onClick={() => {
                                                    setFilters((prev) => ({
                                                        ...prev,
                                                        bpm_min: opt.min,
                                                        bpm_max: opt.max,
                                                    }));
                                                }}
                                                className={`rounded-full text-xs font-medium border transition-all ${isActive
                                                    ? "border-neon-green/40 text-neon-green bg-neon-green/5"
                                                    : "border-border-subtle text-text-secondary hover:border-text-muted"
                                                    }`}
                                                style={{ padding: "0.35rem 0.85rem" }}
                                            >
                                                {opt.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Loading state */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-32">
                        <Loader2 className="w-8 h-8 animate-spin text-[var(--neon-green)] mb-4" />
                        <p className="text-[var(--text-muted)] text-sm">Cargando samples...</p>
                    </div>
                )}

                {/* Empty state */}
                {!loading && samples.length === 0 && (
                    <div className="text-center py-32">
                        <div className="flex justify-center mb-4">
                            <Music className="w-12 h-12 text-[var(--text-muted)]" />
                        </div>
                        <p className="text-[var(--text-secondary)] text-lg mb-2">No se encontraron samples</p>
                        <p className="text-[var(--text-muted)] text-sm mb-4">
                            {hasActiveFilters
                                ? "Probá ajustando los filtros"
                                : "Todavía no hay samples cargados"}
                        </p>
                        {hasActiveFilters && (
                            <button onClick={clearFilters} className="text-[var(--neon-green)] text-sm hover:underline">
                                Limpiar filtros
                            </button>
                        )}
                    </div>
                )}

                {/* Samples Grid */}
                {!loading && samples.length > 0 && (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" style={{ marginBottom: "3rem" }}>
                            {samples.map((sample, i) => (
                                <motion.div
                                    key={sample.id}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: Math.min(i * 0.03, 0.5) }}
                                    className="rounded-xl border border-[var(--border-subtle)] bg-[rgba(255,255,255,0.015)] hover:border-[rgba(255,255,255,0.08)] transition-all duration-200"
                                    style={{ padding: "1.25rem" }}
                                >
                                    {/* Title + badges */}
                                    <div className="flex items-start justify-between gap-2" style={{ marginBottom: "0.75rem" }}>
                                        <h3 className="text-sm font-medium text-[var(--text-primary)] line-clamp-1 flex-1">
                                            {sample.title}
                                        </h3>
                                        <button
                                            disabled
                                            className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-muted)] opacity-30 cursor-not-allowed"
                                            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
                                            title="Próximamente"
                                        >
                                            <Download className="w-3.5 h-3.5" />
                                        </button>
                                    </div>

                                    {/* Metadata badges */}
                                    <div className="flex flex-wrap items-center gap-1.5" style={{ marginBottom: "0.85rem" }}>
                                        {sample.instrument_type && (
                                            <span
                                                className="text-[10px] font-semibold uppercase tracking-wider rounded-md"
                                                style={{
                                                    padding: "0.2rem 0.5rem",
                                                    color: getBadgeColor(sample.instrument_type),
                                                    background: `${getBadgeColor(sample.instrument_type)}12`,
                                                    border: `1px solid ${getBadgeColor(sample.instrument_type)}25`,
                                                }}
                                            >
                                                {sample.instrument_type}
                                            </span>
                                        )}
                                        {sample.bpm && (
                                            <span
                                                className="text-[10px] font-mono text-[var(--text-muted)] rounded-md"
                                                style={{
                                                    padding: "0.2rem 0.5rem",
                                                    background: "rgba(255,255,255,0.03)",
                                                    border: "1px solid rgba(255,255,255,0.05)",
                                                }}
                                            >
                                                {sample.bpm} BPM
                                            </span>
                                        )}
                                        {sample.musical_key && (
                                            <span
                                                className="text-[10px] font-mono text-[var(--text-muted)] rounded-md"
                                                style={{
                                                    padding: "0.2rem 0.5rem",
                                                    background: "rgba(255,255,255,0.03)",
                                                    border: "1px solid rgba(255,255,255,0.05)",
                                                }}
                                            >
                                                {sample.musical_key}
                                            </span>
                                        )}
                                        {sample.genre && (
                                            <span className="text-[10px] text-[var(--text-muted)]">
                                                {sample.genre}
                                            </span>
                                        )}
                                    </div>

                                    {/* Player */}
                                    {sample.preview_url && (
                                        <SamplePlayer src={sample.preview_url} title={sample.title} />
                                    )}
                                </motion.div>
                            ))}
                        </div>

                        {/* Load More */}
                        {cursor && (
                            <div className="flex justify-center" style={{ marginBottom: "3rem" }}>
                                <button
                                    onClick={loadMore}
                                    disabled={loadingMore}
                                    className="flex items-center gap-2 rounded-xl border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--neon-green)] hover:text-[var(--neon-green)] transition-all text-sm font-medium disabled:opacity-50"
                                    style={{ padding: "0.85rem 2rem" }}
                                >
                                    {loadingMore ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Zap className="w-4 h-4" />
                                    )}
                                    {loadingMore ? "Cargando..." : "Cargar más samples"}
                                </button>
                            </div>
                        )}

                        {/* Results info */}
                        <p className="text-center text-xs text-[var(--text-muted)]">
                            Mostrando {samples.length} de {totalCount.toLocaleString()} samples
                        </p>
                    </>
                )}
            </div>
        </main>
    );
}

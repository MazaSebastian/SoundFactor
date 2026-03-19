"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

interface AudioPlayerProps {
    src: string;
    title?: string;
}

function formatTime(seconds: number): string {
    if (isNaN(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function AudioPlayer({ src, title }: AudioPlayerProps) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.8);
    const [isMuted, setIsMuted] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    // Generate static waveform bars
    const [bars] = useState(() =>
        Array.from({ length: 80 }, () => 15 + Math.random() * 85)
    );

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const onLoaded = () => setDuration(audio.duration);
        const onTimeUpdate = () => {
            if (!isDragging) setCurrentTime(audio.currentTime);
        };
        const onEnded = () => setIsPlaying(false);

        audio.addEventListener("loadedmetadata", onLoaded);
        audio.addEventListener("timeupdate", onTimeUpdate);
        audio.addEventListener("ended", onEnded);

        return () => {
            audio.removeEventListener("loadedmetadata", onLoaded);
            audio.removeEventListener("timeupdate", onTimeUpdate);
            audio.removeEventListener("ended", onEnded);
        };
    }, [isDragging]);

    const togglePlay = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        setIsPlaying(!isPlaying);
    };

    const toggleMute = () => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.muted = !isMuted;
        setIsMuted(!isMuted);
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = parseFloat(e.target.value);
        setVolume(v);
        if (audioRef.current) {
            audioRef.current.volume = v;
            setIsMuted(v === 0);
        }
    };

    const seekTo = useCallback(
        (clientX: number) => {
            const bar = progressRef.current;
            const audio = audioRef.current;
            if (!bar || !audio || !duration) return;

            const rect = bar.getBoundingClientRect();
            const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
            const newTime = pct * duration;
            audio.currentTime = newTime;
            setCurrentTime(newTime);
        },
        [duration]
    );

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        seekTo(e.clientX);

        const onMove = (ev: MouseEvent) => seekTo(ev.clientX);
        const onUp = () => {
            setIsDragging(false);
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onUp);
        };
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
    };

    const progress = duration ? (currentTime / duration) * 100 : 0;

    return (
        <div className="w-full">
            <audio ref={audioRef} src={src} preload="metadata" />

            <div
                className="rounded-2xl border border-[var(--border-subtle)] overflow-hidden"
                style={{
                    background: "rgba(18, 18, 42, 0.6)",
                    backdropFilter: "blur(12px)",
                    padding: "1.5rem 2rem",
                }}
            >
                {/* Title row */}
                {title && (
                    <div className="flex items-center gap-2 mb-8">
                        <div
                            className="w-1.5 h-1.5 rounded-full"
                            style={{
                                background: isPlaying ? "var(--neon-green)" : "var(--text-muted)",
                                boxShadow: isPlaying ? "var(--glow-green)" : "none",
                            }}
                        />
                        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                            {title}
                        </span>
                    </div>
                )}

                {/* Main controls row */}
                <div className="flex items-center gap-4">
                    {/* Play / Pause button */}
                    <button
                        onClick={togglePlay}
                        className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105"
                        style={{
                            background: isPlaying
                                ? "rgba(0, 255, 178, 0.12)"
                                : "rgba(0, 255, 178, 0.08)",
                            border: `1px solid ${isPlaying ? "rgba(0,255,178,0.3)" : "rgba(0,255,178,0.15)"}`,
                            boxShadow: isPlaying ? "0 0 20px rgba(0,255,178,0.15)" : "none",
                        }}
                    >
                        {isPlaying ? (
                            <Pause className="w-5 h-5 text-[var(--neon-green)]" />
                        ) : (
                            <Play className="w-5 h-5 text-[var(--neon-green)] ml-0.5" />
                        )}
                    </button>

                    {/* Time + Waveform */}
                    <div className="flex-1 min-w-0">
                        {/* Waveform progress bar */}
                        <div
                            ref={progressRef}
                            className="relative h-12 cursor-pointer group"
                            onMouseDown={handleMouseDown}
                        >
                            <div className="absolute inset-0 flex items-end gap-[2px]">
                                {bars.map((height, i) => {
                                    const barPct = (i / bars.length) * 100;
                                    const isActive = barPct <= progress;
                                    const isNearCursor = Math.abs(barPct - progress) < 2;
                                    return (
                                        <div
                                            key={i}
                                            className="flex-1 rounded-full transition-all duration-150"
                                            style={{
                                                height: `${height}%`,
                                                background: isActive
                                                    ? "var(--neon-green)"
                                                    : "rgba(255,255,255,0.08)",
                                                opacity: isActive ? (isNearCursor ? 1 : 0.7) : 0.4,
                                                boxShadow: isNearCursor && isActive
                                                    ? "0 0 6px rgba(0,255,178,0.5)"
                                                    : "none",
                                            }}
                                        />
                                    );
                                })}
                            </div>
                        </div>

                        {/* Time labels */}
                        <div className="flex items-center justify-between mt-2">
                            <span className="text-[11px] font-mono text-[var(--text-muted)]">
                                {formatTime(currentTime)}
                            </span>
                            <span className="text-[11px] font-mono text-[var(--text-muted)]">
                                {formatTime(duration)}
                            </span>
                        </div>
                    </div>

                    {/* Volume */}
                    <div className="flex-shrink-0 flex items-center gap-2">
                        <button
                            onClick={toggleMute}
                            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
                        >
                            {isMuted || volume === 0 ? (
                                <VolumeX className="w-4 h-4" />
                            ) : (
                                <Volume2 className="w-4 h-4" />
                            )}
                        </button>
                        <input
                            type="range"
                            min={0}
                            max={1}
                            step={0.01}
                            value={isMuted ? 0 : volume}
                            onChange={handleVolumeChange}
                            className="w-16 h-1 accent-[var(--neon-green)] rounded-full appearance-none cursor-pointer hidden sm:block"
                            style={{
                                background: `linear-gradient(to right, var(--neon-green) ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.08) ${(isMuted ? 0 : volume) * 100}%)`,
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

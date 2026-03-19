"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

export const Card = React.memo(
    ({
        feature,
        index,
        hovered,
        setHovered,
    }: {
        feature: { title: string; desc: string; icon: LucideIcon };
        index: number;
        hovered: number | null;
        setHovered: React.Dispatch<React.SetStateAction<number | null>>;
    }) => {
        const Icon = feature.icon;
        return (
            <div
                onMouseEnter={() => setHovered(index)}
                onMouseLeave={() => setHovered(null)}
                className={cn(
                    "glass-card group flex flex-col items-center text-center transition-all duration-500 ease-out h-full w-full",
                    hovered !== null && hovered !== index ? "blur-[6px] scale-[0.95] opacity-40 grayscale-[60%]" : "scale-100 opacity-100"
                )}
                style={{ padding: '2rem' }}
            >
                <div
                    className={cn(
                        "w-16 h-16 rounded-2xl bg-[var(--bg-elevated)] flex items-center justify-center mb-6 border border-white/5 transition-all duration-500",
                        hovered === index ? "border-[var(--neon-green)]/50 shadow-[var(--glow-green)]" : "group-hover:border-[var(--neon-green)]/30"
                    )}
                >
                    <Icon
                        className={cn(
                            "w-8 h-8 text-[var(--neon-green)] transition-all duration-500",
                            hovered === index ? "drop-shadow-[0_0_12px_rgba(0,255,178,0.8)] scale-110" : "group-hover:drop-shadow-[0_0_8px_rgba(0,255,178,0.5)]"
                        )}
                    />
                </div>
                <h3 className={cn(
                    "text-xl font-bold mb-4 transition-colors duration-500",
                    hovered === index ? "text-[var(--neon-green)]" : "text-[var(--text-primary)]"
                )}>
                    {feature.title}
                </h3>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                    {feature.desc}
                </p>
            </div>
        );
    }
);

Card.displayName = "Card";

export function FocusCards({ features }: { features: { title: string; desc: string; icon: LucideIcon }[] }) {
    const [hovered, setHovered] = useState<number | null>(null);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{ gap: '2rem' }}>
            {features.map((feature, index) => (
                <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                    <Card
                        feature={feature}
                        index={index}
                        hovered={hovered}
                        setHovered={setHovered}
                    />
                </motion.div>
            ))}
        </div>
    );
}

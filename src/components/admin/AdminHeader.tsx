"use client";

import { useState, useEffect } from "react";
import { Bell, Search, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export function AdminHeader() {
    const [user, setUser] = useState<SupabaseUser | null>(null);

    useEffect(() => {
        async function load() {
            const supabase = createClient();
            const { data: { user: u } } = await supabase.auth.getUser();
            setUser(u);
        }
        load();
    }, []);

    const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Admin";
    const displayEmail = user?.email || "";
    const initial = displayName.charAt(0).toUpperCase();

    return (
        <header className="glass-card flex items-center justify-between z-40" style={{ padding: '1rem' }}>
            <div className="flex items-center gap-4 flex-1">
                <div className="relative w-full max-w-md hidden md:block">
                    <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                    <input
                        type="text"
                        placeholder="Buscar en el panel..."
                        className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl pr-4 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--neon-green)] focus:ring-1 focus:ring-[var(--neon-green)] transition-all"
                        style={{ paddingLeft: '3rem' }}
                    />
                </div>
            </div>
            <div className="flex items-center gap-4">
                <button className="relative w-10 h-10 rounded-xl flex items-center justify-center text-[var(--text-muted)] hover:bg-[rgba(255,255,255,0.05)] hover:text-white transition-colors border border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-[var(--neon-pink)] rounded-full shadow-[var(--glow-pink)]"></span>
                </button>
                <div className="w-px h-8 bg-[var(--border-subtle)] mx-1"></div>
                <div className="flex items-center gap-3">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-medium text-[var(--text-primary)]">{displayName}</p>
                        <p className="text-xs text-[var(--text-muted)] line-clamp-1">{displayEmail}</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-[var(--neon-green)] flex items-center justify-center text-[var(--bg-primary)] font-bold text-sm">
                        {initial}
                    </div>
                </div>
            </div>
        </header>
    );
}

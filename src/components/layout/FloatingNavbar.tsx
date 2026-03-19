"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useCartStore } from "@/store/useCartStore";
import { FloatingDock } from "@/components/ui/floating-dock";
import {
    Home,
    Music,
    Layers,
    Sliders,
    Drum,
    Users,
    Mail,
    ShoppingCart,
    User,
    Shield,
    AudioLines,
} from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { AnimatePresence, motion } from "framer-motion";

export function FloatingNavbar() {
    const [mounted, setMounted] = useState(false);
    const [user, setUser] = useState<SupabaseUser | null>(null);
    const [userRole, setUserRole] = useState<"admin" | "customer">("customer");
    const { items, openCart } = useCartStore();
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    const supabase = createClient();

    useEffect(() => {
        setMounted(true);

        // Initial check
        async function checkUser() {
            const { data: { user: u } } = await supabase.auth.getUser();
            setUser(u);
            if (u) fetchUserRole(u.id);
        }
        checkUser();

        // Listen for auth events
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: string, session: any) => {
            setUser(session?.user || null);
            if (session?.user) {
                fetchUserRole(session.user.id);
            } else {
                setUserRole("customer");
            }
        });

        return () => subscription.unsubscribe();
    }, [supabase.auth]);

    const fetchUserRole = async (userId: string) => {
        const { data } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", userId)
            .single();
        if (data) setUserRole(data.role as "admin" | "customer");
    };

    // Prevent flash of incorrect state
    if (!mounted) return null;

    const pathname = usePathname();

    const getLinks = () => {
        const isActive = (href: string) => {
            if (href === '/') return pathname === '/';
            if (href === '#') return false; // Cart has no route
            return pathname?.startsWith(href);
        };

        const getIconClass = (href: string) =>
            `w-full h-full transition-colors ${isActive(href) ? 'text-[var(--neon-green)]' : ''}`;

        const baseLinks = [
            {
                title: "Inicio",
                icon: <Home className={getIconClass("/")} />,
                href: "/",
            },
            {
                title: "Factory",
                icon: <AudioLines className={getIconClass("/factory")} />,
                href: "/factory",
            },
            {
                title: "Sample Packs",
                icon: <Music className={getIconClass("/tienda/categoria/sample-packs")} />,
                href: "/tienda/categoria/sample-packs",
            },
            {
                title: "Proyectos FL",
                icon: <Layers className={getIconClass("/tienda/categoria/proyectos-fl")} />,
                href: "/tienda/categoria/proyectos-fl",
            },
            {
                title: "Presets",
                icon: <Sliders className={getIconClass("/tienda/categoria/presets")} />,
                href: "/tienda/categoria/presets",
            },
            {
                title: "Drum Kits",
                icon: <Drum className={getIconClass("/tienda/categoria/drum-kits")} />,
                href: "/tienda/categoria/drum-kits",
            },
            {
                title: "Carrito",
                icon: (
                    <div className="relative w-full h-full flex items-center justify-center" onClick={(e) => {
                        e.preventDefault();
                        openCart();
                    }}>
                        <ShoppingCart className="w-full h-full" />
                        {totalItems > 0 && (
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-[var(--neon-green)] text-[var(--bg-primary)] text-[8px] font-bold rounded-full flex items-center justify-center">
                                {totalItems}
                            </span>
                        )}
                    </div>
                ),
                href: "#",
            },
        ];

        if (user) {
            if (userRole === "admin") {
                baseLinks.push({
                    title: "Admin",
                    icon: <Shield className={getIconClass("/admin")} />,
                    href: "/admin",
                });
            } else {
                baseLinks.push({
                    title: "Mi Cuenta",
                    icon: <User className={getIconClass("/cuenta")} />,
                    href: "/cuenta",
                });
            }
        } else {
            baseLinks.push({
                title: "Ingresar",
                icon: <User className={getIconClass("/auth")} />,
                href: "/auth",
            });
        }

        return baseLinks;
    };

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[50]">
            <FloatingDock items={getLinks()} />
        </div>
    );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Home, Package, FolderTree, ShoppingCart, LogOut, ArrowLeft, AudioLines, BadgeCheck } from "lucide-react";
import clsx from "clsx";

export function AdminSidebar() {
    const pathname = usePathname();

    const links = [
        { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
        { href: "/admin/inicio", icon: Home, label: "Inicio" },
        { href: "/admin/productos", icon: Package, label: "Productos" },
        { href: "/admin/categorias", icon: FolderTree, label: "Categorías" },
        { href: "/admin/ordenes", icon: ShoppingCart, label: "Órdenes" },
        { href: "/admin/factory", icon: AudioLines, label: "Factory" },
        { href: "/admin/artistas", icon: BadgeCheck, label: "Artistas" },
    ];

    return (
        <aside className="w-full lg:w-64 flex-shrink-0 glass-card h-fit sticky top-8 z-30" style={{ padding: '1.25rem' }}>
            <Link href="/" className="flex items-center gap-2 group mb-6 px-2 text-[var(--text-muted)] hover:text-[var(--neon-green)] transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Volver a la tienda</span>
            </Link>

            <div className="flex flex-col gap-2 mb-8">
                {links.map((link) => {
                    const isActive = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
                    const Icon = link.icon;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={clsx(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                                isActive
                                    ? "bg-[rgba(0,255,178,0.1)] text-[var(--neon-green)] font-medium border border-[rgba(0,255,178,0.2)]"
                                    : "text-[var(--text-secondary)] hover:bg-[rgba(255,255,255,0.05)] hover:text-white border border-transparent"
                            )}
                        >
                            <Icon className="w-5 h-5" />
                            {link.label}
                        </Link>
                    );
                })}
            </div>

            <div className="pt-4 border-t border-[var(--border-subtle)]">
                <button className="flex items-center gap-3 px-4 py-3 w-full text-[var(--text-muted)] hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all duration-200 border border-transparent">
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium text-sm">Cerrar sesión</span>
                </button>
            </div>
        </aside>
    );
}

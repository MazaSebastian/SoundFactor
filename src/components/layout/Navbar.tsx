"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  User,
  Menu,
  X,
  Search,
  LogOut,
  Shield,
} from "lucide-react";
import clsx from "clsx";
import { useCartStore } from "@/store/useCartStore";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

type UserRole = "admin" | "customer";

const navLinks = [
  { href: "/tienda", label: "Tienda" },
  { href: "/factory", label: "Factory" },
  { href: "/tienda/categoria/sample-packs", label: "Sample Packs" },
  { href: "/tienda/categoria/proyectos-fl", label: "Proyectos FL" },
  { href: "/tienda/categoria/presets", label: "Presets" },
  { href: "/tienda/categoria/drum-kits", label: "Drum Kits" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userRole, setUserRole] = useState<UserRole>("customer");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const openCart = useCartStore((state) => state.openCart);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const router = useRouter();
  const supabase = createClient();

  async function fetchUserRole(userId: string) {
    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();
    setUserRole((data?.role as UserRole) || "customer");
  }

  useEffect(() => {
    // Get initial session
    async function checkUser() {
      const { data: { user: u } } = await supabase.auth.getUser();
      setUser(u);
      if (u) fetchUserRole(u.id);
    }
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: string, session: any) => {
        setUser(session?.user ?? null);
        if (session?.user) fetchUserRole(session.user.id);
        else setUserRole("customer");
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    if (!userMenuOpen) return;
    const handleClick = () => setUserMenuOpen(false);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [userMenuOpen]);

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
    setUserMenuOpen(false);
    router.push("/");
    router.refresh();
  }

  const userInitial = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.charAt(0).toUpperCase()
    : user?.email?.charAt(0).toUpperCase() ?? "U";

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={clsx(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-xl"
        )}
        style={{
          backgroundColor: isScrolled ? "rgba(6,6,12,0.85)" : "transparent",
        }}
      >
        <div className="section-container">
          <nav className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative w-9 h-9 rounded-lg bg-[var(--neon-green)] flex items-center justify-center transition-all duration-300 group-hover:shadow-[var(--glow-green)]">
                <div
                  className="w-5 h-5 bg-[var(--bg-primary)]"
                  style={{
                    maskImage: "url('/logoneon.png')",
                    maskSize: "contain",
                    maskRepeat: "no-repeat",
                    maskPosition: "center",
                    WebkitMaskImage: "url('/logoneon.png')",
                    WebkitMaskSize: "contain",
                    WebkitMaskRepeat: "no-repeat",
                    WebkitMaskPosition: "center",
                  }}
                />
              </div>
              <span className="text-lg font-bold tracking-tight" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
                <span className="text-[var(--text-primary)]">Sound</span>
                <span className="text-[var(--neon-green)]">Factory</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--neon-green)] transition-colors duration-200 rounded-lg hover:bg-[rgba(0,255,178,0.05)]"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <button
                className="hidden md:flex w-10 h-10 items-center justify-center rounded-xl text-[var(--text-secondary)] hover:text-[var(--neon-green)] hover:bg-[rgba(0,255,178,0.05)] transition-all duration-200"
                aria-label="Buscar"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Cart */}
              <button
                onClick={openCart}
                className="relative w-10 h-10 flex items-center justify-center rounded-xl text-[var(--text-secondary)] hover:text-[var(--neon-green)] hover:bg-[rgba(0,255,178,0.05)] transition-all duration-200"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[var(--neon-green)] text-[var(--bg-primary)] text-[10px] font-bold rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* User / Auth */}
              {user ? (
                <div className="relative hidden md:block">
                  <button
                    onClick={(e) => { e.stopPropagation(); setUserMenuOpen(!userMenuOpen); }}
                    className="w-10 h-10 rounded-xl bg-[var(--neon-green)] text-[var(--bg-primary)] font-bold text-sm flex items-center justify-center hover:shadow-[var(--glow-green)] transition-all duration-200"
                  >
                    {userInitial}
                  </button>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-72 glass-card overflow-hidden z-[60]"
                        style={{ padding: 0 }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="border-b border-[var(--border-subtle)]" style={{ padding: '1rem 1.25rem' }}>
                          <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
                            {user.user_metadata?.full_name || "Usuario"}
                          </p>
                          <p className="text-xs text-[var(--text-muted)] truncate mt-1">{user.email}</p>
                        </div>
                        <div style={{ padding: '0.5rem' }}>
                          {userRole === "admin" ? (
                            <Link
                              href="/admin"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 text-sm text-[var(--text-secondary)] hover:text-[var(--neon-green)] hover:bg-[rgba(0,255,178,0.05)] transition-colors rounded-lg"
                              style={{ padding: '0.75rem 1rem' }}
                            >
                              <Shield className="w-4 h-4" />
                              Panel Admin
                            </Link>
                          ) : (
                            <Link
                              href="/cuenta"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 text-sm text-[var(--text-secondary)] hover:text-[var(--neon-green)] hover:bg-[rgba(0,255,178,0.05)] transition-colors rounded-lg"
                              style={{ padding: '0.75rem 1rem' }}
                            >
                              <User className="w-4 h-4" />
                              Mi Cuenta
                            </Link>
                          )}
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 text-sm text-[var(--text-secondary)] hover:text-[var(--neon-pink)] hover:bg-[rgba(255,159,252,0.05)] transition-colors w-full text-left rounded-lg"
                            style={{ padding: '0.75rem 1rem' }}
                          >
                            <LogOut className="w-4 h-4" />
                            Cerrar Sesión
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  href="/auth"
                  className="hidden md:flex w-10 h-10 items-center justify-center rounded-xl text-[var(--text-secondary)] hover:text-[var(--neon-green)] hover:bg-[rgba(0,255,178,0.05)] transition-all duration-200"
                >
                  <User className="w-5 h-5" />
                </Link>
              )}

              {/* Mobile menu */}
              <button
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl text-[var(--text-secondary)] hover:text-[var(--neon-green)] transition-all duration-200"
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                aria-label="Menú"
              >
                {isMobileOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </nav>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsMobileOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute right-0 top-0 bottom-0 w-72 bg-[var(--bg-secondary)] border-l border-[var(--border-subtle)] p-6 pt-20"
            >
              <div className="flex flex-col gap-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileOpen(false)}
                      className="block px-4 py-3 text-base font-medium text-[var(--text-secondary)] hover:text-[var(--neon-green)] hover:bg-[rgba(0,255,178,0.05)] rounded-xl transition-all duration-200"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}

                <hr className="glow-line my-4" />

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {user ? (
                    <div className="flex flex-col gap-1">
                      <div className="px-4 py-2 mb-2">
                        <p className="text-sm font-medium text-[var(--text-primary)]">{user.user_metadata?.full_name || "Usuario"}</p>
                        <p className="text-xs text-[var(--text-muted)] truncate">{user.email}</p>
                      </div>
                      {userRole === "admin" ? (
                        <Link
                          href="/admin"
                          onClick={() => setIsMobileOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-base font-medium text-[var(--text-secondary)] hover:text-[var(--neon-green)] hover:bg-[rgba(0,255,178,0.05)] rounded-xl transition-all duration-200"
                        >
                          <Shield className="w-5 h-5" />
                          Panel Admin
                        </Link>
                      ) : (
                        <Link
                          href="/cuenta"
                          onClick={() => setIsMobileOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-base font-medium text-[var(--text-secondary)] hover:text-[var(--neon-green)] hover:bg-[rgba(0,255,178,0.05)] rounded-xl transition-all duration-200"
                        >
                          <User className="w-5 h-5" />
                          Mi Cuenta
                        </Link>
                      )}
                      <button
                        onClick={() => { handleLogout(); setIsMobileOpen(false); }}
                        className="flex items-center gap-3 px-4 py-3 text-base font-medium text-[var(--text-secondary)] hover:text-[var(--neon-pink)] hover:bg-[rgba(255,159,252,0.05)] rounded-xl transition-all duration-200 w-full text-left"
                      >
                        <LogOut className="w-5 h-5" />
                        Cerrar Sesión
                      </button>
                    </div>
                  ) : (
                    <Link
                      href="/auth"
                      onClick={() => setIsMobileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-base font-medium text-[var(--text-secondary)] hover:text-[var(--neon-green)] hover:bg-[rgba(0,255,178,0.05)] rounded-xl transition-all duration-200"
                    >
                      <User className="w-5 h-5" />
                      Iniciar Sesión
                    </Link>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

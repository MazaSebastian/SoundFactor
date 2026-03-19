"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail, Lock, User, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    // Redirect if already logged in
    useEffect(() => {
        async function checkAuth() {
            const { data: { user: currentUser } } = await supabase.auth.getUser();
            if (currentUser) router.push("/");
        }
        checkAuth();
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                router.push("/");
                router.refresh();
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                        },
                    },
                });
                if (error) throw error;
                setSuccess("¡Cuenta creada! Revisa tu correo para confirmar tu cuenta.");
            }
        } catch (err: any) {
            setError(err.message || "Ocurrió un error inesperado.");
        } finally {
            setLoading(false);
        }
    }



    return (
        <main className="min-h-screen relative flex items-center justify-center overflow-hidden p-6">
            {/* Ambient background */}
            <motion.div
                className="ambient-orb ambient-orb-green w-[800px] h-[800px] top-[-20%] left-[-10%]"
                style={{ opacity: 0.12 }}
                animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="ambient-orb ambient-orb-purple w-[600px] h-[600px] bottom-[-20%] right-[-10%]"
                style={{ opacity: 0.12 }}
                animate={{ y: [0, 30, 0], x: [0, -20, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />

            {/* Back button */}
            <Link
                href="/"
                className="absolute top-8 left-8 flex items-center justify-center w-12 h-12 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--neon-green)] hover:border-[var(--neon-green)] transition-all z-20 group"
            >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </Link>

            <div className="w-full max-w-md relative z-10">
                {/* Brand Logo */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="flex flex-col items-center justify-center"
                    style={{ marginBottom: '3.5rem' }}
                >
                    <div
                        className="w-16 h-16 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center shadow-[0_0_30px_rgba(0,255,178,0.15)] relative overflow-hidden group"
                        style={{ marginBottom: '1.5rem' }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon-green)] to-[var(--neon-blue)] opacity-10 group-hover:opacity-20 transition-opacity" />
                        <motion.div
                            initial={{ scale: 0.5, rotate: -15 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.3 }}
                        >
                            <div
                                className="w-8 h-8 bg-[var(--neon-green)] relative z-10 drop-shadow-[0_0_10px_rgba(0,255,178,0.5)]"
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
                        </motion.div>
                    </div>
                    <motion.h1
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                        className="text-3xl font-bold font-display" style={{ fontFamily: "var(--font-space-grotesk)" }}
                    >
                        <span className="text-[var(--text-primary)]">Sample</span>
                        <span className="text-[var(--neon-green)]">Factory</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                        className="text-[var(--text-secondary)] mt-2 text-center text-sm"
                    >
                        {isLogin ? "Bienvenido de nuevo, el estudio te espera." : "Únete a la comunidad de productores."}
                    </motion.p>
                </motion.div>

                {/* Auth Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.5, type: "spring", bounce: 0.3, delay: 0.1 }}
                    className="glass-card"
                    style={{ padding: '2.5rem', width: '100%', position: 'relative', overflow: 'hidden' }}
                >
                    {/* Subtle top border glow for the card */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-[var(--neon-green)] to-transparent opacity-50" />

                    {/* Form Toggle Tabs */}
                    <div
                        className="flex gap-8 relative border-b border-[var(--border-subtle)]"
                        style={{ marginBottom: '2.5rem' }}
                    >
                        <button
                            onClick={() => { setIsLogin(true); setError(null); setSuccess(null); }}
                            className={`pb-4 text-lg font-medium transition-all relative px-2 ${isLogin ? 'text-white' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'}`}
                        >
                            Iniciar Sesión
                            {isLogin && (
                                <motion.div
                                    layoutId="auth-tab-indicator"
                                    className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[var(--neon-green)] shadow-[0_0_10px_rgba(0,255,178,0.5)]"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                />
                            )}
                        </button>
                        <button
                            onClick={() => { setIsLogin(false); setError(null); setSuccess(null); }}
                            className={`pb-4 text-lg font-medium transition-all relative px-2 ${!isLogin ? 'text-white' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'}`}
                        >
                            Crear Cuenta
                            {!isLogin && (
                                <motion.div
                                    layoutId="auth-tab-indicator"
                                    className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[var(--neon-green)] shadow-[0_0_10px_rgba(0,255,178,0.5)]"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                />
                            )}
                        </button>
                    </div>

                    {/* Error / Success Messages */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm overflow-hidden"
                                style={{ padding: '0.75rem 1rem', marginBottom: '1rem' }}
                            >
                                {error}
                            </motion.div>
                        )}
                        {success && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="rounded-xl bg-[rgba(0,255,178,0.08)] border border-[rgba(0,255,178,0.2)] text-[var(--neon-green)] text-sm overflow-hidden"
                                style={{ padding: '0.75rem 1rem', marginBottom: '1rem' }}
                            >
                                {success}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence mode="wait">
                        <motion.form
                            key={isLogin ? "login" : "register"}
                            initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
                            transition={{ type: "spring", stiffness: 350, damping: 25 }}
                            className="flex flex-col gap-4"
                            onSubmit={handleSubmit}
                        >
                            {!isLogin && (
                                <div className="relative group">
                                    <div
                                        className="absolute inset-y-0 flex items-center pointer-events-none"
                                        style={{ left: '1.25rem' }}
                                    >
                                        <User className="w-4.5 h-4.5 text-[var(--text-muted)] group-focus-within:text-[var(--neon-green)] transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Nombre de usuario o artista"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full bg-[rgba(0,0,0,0.2)] border border-[var(--border-subtle)] rounded-xl text-sm text-[var(--text-primary)] focus:border-[var(--neon-green)] focus:ring-1 focus:ring-[var(--neon-green)] outline-none transition-all placeholder:text-[var(--text-muted)]"
                                        style={{ padding: '0.875rem 1rem 0.875rem 3.5rem' }}
                                    />
                                </div>
                            )}

                            <div className="relative group">
                                <div
                                    className="absolute inset-y-0 flex items-center pointer-events-none"
                                    style={{ left: '1.25rem' }}
                                >
                                    <Mail className="w-4.5 h-4.5 text-[var(--text-muted)] group-focus-within:text-[var(--neon-green)] transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    placeholder="Correo electrónico"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-[rgba(0,0,0,0.2)] border border-[var(--border-subtle)] rounded-xl text-sm text-[var(--text-primary)] focus:border-[var(--neon-green)] focus:ring-1 focus:ring-[var(--neon-green)] outline-none transition-all placeholder:text-[var(--text-muted)]"
                                    style={{ padding: '0.875rem 1rem 0.875rem 3.5rem' }}
                                />
                            </div>

                            <div className="relative group">
                                <div
                                    className="absolute inset-y-0 flex items-center pointer-events-none"
                                    style={{ left: '1.25rem' }}
                                >
                                    <Lock className="w-4.5 h-4.5 text-[var(--text-muted)] group-focus-within:text-[var(--neon-green)] transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    placeholder="Contraseña"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-[rgba(0,0,0,0.2)] border border-[var(--border-subtle)] rounded-xl text-sm text-[var(--text-primary)] focus:border-[var(--neon-green)] focus:ring-1 focus:ring-[var(--neon-green)] outline-none transition-all placeholder:text-[var(--text-muted)]"
                                    style={{ padding: '0.875rem 1rem 0.875rem 3.5rem' }}
                                />
                            </div>

                            {isLogin && (
                                <div className="flex justify-end text-sm mt-1">
                                    <Link href="#" className="text-[var(--text-muted)] hover:text-[var(--neon-green)] transition-colors">
                                        ¿Olvidaste tu contraseña?
                                    </Link>
                                </div>
                            )}

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading}
                                className="w-full relative flex justify-center items-center rounded-xl bg-[var(--neon-green)] text-[var(--bg-primary)] font-bold shadow-[0_0_15px_rgba(0,255,178,0.2)] hover:shadow-[0_0_25px_rgba(0,255,178,0.4)] transition-shadow overflow-hidden group disabled:opacity-60 disabled:cursor-not-allowed"
                                style={{ padding: '0.875rem 1rem', marginTop: '2.5rem' }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    isLogin ? "Entrar al Estudio" : "Crear Cuenta"
                                )}
                            </motion.button>
                        </motion.form>
                    </AnimatePresence>

                </motion.div>

                {/* Footer tiny text */}
                <p
                    className="text-center text-xs text-[var(--text-muted)]"
                    style={{ marginTop: '2.5rem' }}
                >
                    Al {isLogin ? "iniciar sesión" : "crear una cuenta"}, aceptas nuestros <Link href="#" className="hover:text-[var(--neon-green)] underline underline-offset-2 transition-colors">Términos de Servicio</Link> y <Link href="#" className="hover:text-[var(--neon-green)] underline underline-offset-2 transition-colors">Política de Privacidad</Link>.
                </p>
            </div>
        </main>
    );
}

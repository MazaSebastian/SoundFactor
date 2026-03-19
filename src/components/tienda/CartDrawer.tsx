"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Plus, Minus, ShoppingCart, Music } from "lucide-react";
import Image from "next/image";
import { useCartStore } from "@/store/useCartStore";

export function CartDrawer() {
    const { items, isOpen, closeCart, removeItem, updateQuantity, getSubtotal } = useCartStore();

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex justify-end">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeCart}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="relative w-full max-w-md bg-[var(--bg-secondary)] border-l border-[var(--border-subtle)] shadow-2xl flex flex-col h-full"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-8 py-6 border-b border-[var(--border-subtle)]">
                            <h2 className="text-lg font-bold font-display text-[var(--text-primary)] tracking-wide">Carrito de Compras</h2>
                            <button
                                onClick={closeCart}
                                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[rgba(255,255,255,0.05)] transition-colors text-[var(--text-secondary)] hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto" style={{ padding: '1.5rem 2rem' }}>
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                    <div className="w-16 h-16 rounded-full bg-[rgba(255,255,255,0.02)] border border-[var(--border-subtle)] flex items-center justify-center mb-2">
                                        <ShoppingCart className="w-8 h-8 text-[var(--text-muted)]" />
                                    </div>
                                    <p className="text-[var(--text-secondary)]">Tu carrito está vacío</p>
                                    <button onClick={closeCart} className="text-[var(--neon-green)] font-medium hover:underline">
                                        Explorar la tienda
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col" style={{ gap: '1.5rem' }}>
                                    {items.map((item) => (
                                        <div key={item.product.id} className="flex rounded-xl bg-[rgba(255,255,255,0.02)] border border-[var(--border-subtle)]" style={{ gap: '1rem', padding: '1rem' }}>
                                            {/* Product Image */}
                                            <div className="w-16 h-16 bg-[rgba(255,255,255,0.03)] border border-[var(--border-subtle)] rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center">
                                                {item.product.image ? (
                                                    <img
                                                        src={item.product.image}
                                                        alt={item.product.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <Music className="w-5 h-5 text-[var(--text-muted)]" />
                                                )}
                                            </div>

                                            <div className="flex-1 flex flex-col justify-between">
                                                <div>
                                                    <h3 className="font-medium text-[var(--text-primary)] text-sm mb-1 leading-tight line-clamp-2">
                                                        {item.product.name}
                                                    </h3>
                                                    <p className="text-[var(--neon-green)] font-bold text-sm">
                                                        ${item.product.price.toFixed(2)}
                                                    </p>
                                                </div>

                                                <div className="flex items-center justify-between mt-2">
                                                    {/* Quantity */}
                                                    <div className="flex items-center gap-3 bg-[rgba(255,255,255,0.03)] rounded-md border border-[var(--border-subtle)] px-2 py-0.5">
                                                        <button
                                                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                                            className="text-[var(--text-muted)] hover:text-white transition-colors"
                                                        >
                                                            <Minus className="w-3.5 h-3.5" />
                                                        </button>
                                                        <span className="text-xs font-medium w-4 text-center">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                            className="text-[var(--text-muted)] hover:text-white transition-colors"
                                                        >
                                                            <Plus className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>

                                                    {/* Remove */}
                                                    <button
                                                        onClick={() => removeItem(item.product.id)}
                                                        className="text-[var(--text-muted)] hover:text-red-400 transition-colors p-1"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="px-8 py-6 border-t border-[var(--border-subtle)] bg-[rgba(0,0,0,0.2)]">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-[var(--text-secondary)] font-medium">Subtotal</span>
                                    <span className="text-xl font-bold font-display text-[var(--text-primary)]">
                                        ${getSubtotal().toFixed(2)}
                                    </span>
                                </div>
                                <button className="btn-neon w-full flex justify-center py-4 text-[15px]" style={{ padding: '1rem 2rem' }}>
                                    Ir a pagar
                                </button>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

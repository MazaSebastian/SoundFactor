"use client";

import { useState, useEffect, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Edit, Trash2, FolderTree, X, Loader2, Music, Layers, Disc3, Headphones, LayoutTemplate, Piano } from "lucide-react";
import { getCategories, createCategory, updateCategory, deleteCategory } from "@/lib/actions/categories";
import type { Category } from "@/lib/types";

const iconMap: Record<string, any> = {
    Music, Layers, Disc3, Headphones, LayoutTemplate, Piano,
};

export default function CategoriasAdminPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [isPending, startTransition] = useTransition();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [formName, setFormName] = useState("");
    const [formSlug, setFormSlug] = useState("");
    const [formColor, setFormColor] = useState("#00FFB2");
    const [formIcon, setFormIcon] = useState("Music");

    useEffect(() => {
        loadCategories();
    }, []);

    async function loadCategories() {
        setLoading(true);
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    function openCreateModal() {
        setEditingCategory(null);
        setFormName("");
        setFormSlug("");
        setFormColor("#00FFB2");
        setFormIcon("Music");
        setIsModalOpen(true);
    }

    function openEditModal(cat: Category) {
        setEditingCategory(cat);
        setFormName(cat.name);
        setFormSlug(cat.slug);
        setFormColor(cat.color);
        setFormIcon(cat.icon);
        setIsModalOpen(true);
    }

    function handleNameChange(name: string) {
        setFormName(name);
        if (!editingCategory) {
            setFormSlug(name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        startTransition(async () => {
            try {
                if (editingCategory) {
                    await updateCategory(editingCategory.id, {
                        name: formName,
                        slug: formSlug,
                        color: formColor,
                        icon: formIcon,
                    });
                } else {
                    await createCategory({
                        name: formName,
                        slug: formSlug,
                        color: formColor,
                        icon: formIcon,
                    });
                }
                setIsModalOpen(false);
                await loadCategories();
            } catch (err: any) {
                setError(err.message);
            }
        });
    }

    async function handleDelete(id: string) {
        if (!confirm("¿Estás seguro de eliminar esta categoría?")) return;
        startTransition(async () => {
            try {
                await deleteCategory(id);
                await loadCategories();
            } catch (err: any) {
                setError(err.message);
            }
        });
    }

    const filtered = categories.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ gap: "2.5rem", paddingTop: "1rem" }}>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-[var(--text-primary)] mb-2">Categorías</h1>
                    <p className="text-[var(--text-secondary)]">Administra las secciones de tu tienda.</p>
                </div>
                <button onClick={openCreateModal} className="btn-neon whitespace-nowrap self-start sm:self-auto">
                    <Plus className="w-4 h-4" />
                    <span>Añadir Categoría</span>
                </button>
            </div>

            {/* Error Banner */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center justify-between"
                        style={{ padding: "0.75rem 1rem" }}
                    >
                        <span>{error}</span>
                        <button onClick={() => setError(null)} className="ml-4 hover:text-white"><X className="w-4 h-4" /></button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Filters Bar */}
            <div className="glass-card flex flex-col sm:flex-row justify-between items-center z-20" style={{ padding: "1rem", gap: "1rem" }}>
                <div className="relative w-full sm:max-w-md">
                    <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                    <input
                        type="text"
                        placeholder="Buscar categoría..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="input-neon w-full"
                        style={{ paddingLeft: "3rem" }}
                    />
                </div>
                <span className="text-sm text-[var(--text-muted)]">{filtered.length} categoría{filtered.length !== 1 ? "s" : ""}</span>
            </div>

            {/* Loading */}
            {loading && (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-[var(--neon-green)]" />
                </div>
            )}

            {/* Data Grid */}
            {!loading && filtered.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3" style={{ gap: "1.5rem" }}>
                    {filtered.map((category) => {
                        const IconComponent = iconMap[category.icon] || Music;
                        return (
                            <motion.div
                                key={category.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="glass-card flex flex-col group relative overflow-hidden"
                                style={{ padding: "1.5rem" }}
                            >
                                {/* Color Glow Indicator */}
                                <div
                                    className="absolute top-0 right-0 w-32 h-32 rounded-full blur-[50px] opacity-10 group-hover:opacity-30 transition-opacity duration-500"
                                    style={{ background: category.color, transform: "translate(30%, -30%)" }}
                                />

                                <div className="flex items-start justify-between w-full mb-4 relative z-10">
                                    <div
                                        className="w-12 h-12 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-center transition-all duration-300"
                                        style={{ color: category.color, boxShadow: `0 0 10px ${category.color}20` }}
                                    >
                                        <IconComponent className="w-6 h-6" />
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openEditModal(category)} className="p-2 text-[var(--text-secondary)] hover:text-[var(--neon-green)] transition-colors rounded-lg hover:bg-[var(--bg-elevated)]" title="Editar">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(category.id)} className="p-2 text-[var(--text-secondary)] hover:text-[var(--neon-pink)] transition-colors rounded-lg hover:bg-[var(--bg-elevated)]" title="Eliminar">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-auto relative z-10">
                                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-1">{category.name}</h3>
                                    <p className="text-[var(--text-muted)] text-sm mb-4 font-mono">/{category.slug}</p>

                                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--border-subtle)]">
                                        <span className="text-sm text-[var(--text-secondary)]">Productos Asociados</span>
                                        <span className="text-sm font-semibold text-[var(--text-primary)] bg-[var(--bg-secondary)] px-3 py-1 rounded-full border border-[var(--border-subtle)]">
                                            {category.product_count}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Empty State */}
            {!loading && filtered.length === 0 && (
                <div className="glass-card flex items-center justify-center border-dashed border-[var(--border-subtle)] text-center" style={{ padding: "3rem", minHeight: "200px" }}>
                    <div className="flex flex-col items-center max-w-md">
                        <div className="w-12 h-12 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)] mb-4">
                            <FolderTree className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">
                            {search ? "Sin resultados" : "Sin categorías"}
                        </h3>
                        <p className="text-[var(--text-secondary)] text-sm">
                            {search ? `No se encontraron categorías para "${search}".` : "Creá tu primera categoría para empezar a organizar la tienda."}
                        </p>
                    </div>
                </div>
            )}

            {/* Create/Edit Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="glass-card relative z-10 w-full max-w-lg"
                            style={{ padding: "2rem" }}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-[var(--text-primary)]">
                                    {editingCategory ? "Editar Categoría" : "Nueva Categoría"}
                                </h2>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 text-[var(--text-secondary)] hover:text-white rounded-lg hover:bg-[var(--bg-elevated)] transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                <div>
                                    <label className="text-sm text-[var(--text-secondary)] mb-1.5 block">Nombre</label>
                                    <input
                                        type="text"
                                        required
                                        value={formName}
                                        onChange={(e) => handleNameChange(e.target.value)}
                                        placeholder="Ej: Drum Kits"
                                        className="input-neon w-full"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm text-[var(--text-secondary)] mb-1.5 block">Slug (URL)</label>
                                    <input
                                        type="text"
                                        required
                                        value={formSlug}
                                        onChange={(e) => setFormSlug(e.target.value)}
                                        placeholder="ej: drum-kits"
                                        className="input-neon w-full font-mono text-sm"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm text-[var(--text-secondary)] mb-1.5 block">Color</label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="color"
                                                value={formColor}
                                                onChange={(e) => setFormColor(e.target.value)}
                                                className="w-10 h-10 rounded-lg bg-transparent cursor-pointer border border-[var(--border-subtle)]"
                                            />
                                            <input
                                                type="text"
                                                value={formColor}
                                                onChange={(e) => setFormColor(e.target.value)}
                                                className="input-neon flex-1 font-mono text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm text-[var(--text-secondary)] mb-1.5 block">Icono</label>
                                        <select
                                            value={formIcon}
                                            onChange={(e) => setFormIcon(e.target.value)}
                                            className="input-neon w-full"
                                        >
                                            {Object.keys(iconMap).map((name) => (
                                                <option key={name} value={name}>{name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Preview */}
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] mt-2">
                                    <div className="w-10 h-10 rounded-lg border border-[var(--border-subtle)] flex items-center justify-center" style={{ color: formColor, boxShadow: `0 0 10px ${formColor}30` }}>
                                        {(() => { const IC = iconMap[formIcon] || Music; return <IC className="w-5 h-5" />; })()}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-[var(--text-primary)]">{formName || "Nombre"}</p>
                                        <p className="text-xs text-[var(--text-muted)] font-mono">/{formSlug || "slug"}</p>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 mt-4">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="btn-neon-outline text-sm">
                                        Cancelar
                                    </button>
                                    <button type="submit" disabled={isPending} className="btn-neon text-sm">
                                        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : editingCategory ? "Guardar Cambios" : "Crear Categoría"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

"use client";

import { useState, useEffect, useTransition, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Filter, Edit, Trash2, Eye, Music, X, Loader2, Star, StarOff, Image as ImageIcon, Upload, FileAudio, FileArchive } from "lucide-react";
import Link from "next/link";
import { getProducts, createProduct, updateProduct, deleteProduct } from "@/lib/actions/products";
import { getCategories } from "@/lib/actions/categories";
import { uploadFile } from "@/lib/storage";
import type { Product, Category } from "@/lib/types";

export default function ProductosAdminPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [search, setSearch] = useState("");
    const [filterCategory, setFilterCategory] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isPending, startTransition] = useTransition();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [formTitle, setFormTitle] = useState("");
    const [formSlug, setFormSlug] = useState("");
    const [formDescription, setFormDescription] = useState("");
    const [formPrice, setFormPrice] = useState("");
    const [formOriginalPrice, setFormOriginalPrice] = useState("");
    const [formCategoryId, setFormCategoryId] = useState("");
    const [formBpm, setFormBpm] = useState("");
    const [formKey, setFormKey] = useState("");
    const [formTags, setFormTags] = useState("");
    const [formIsFeatured, setFormIsFeatured] = useState(false);
    const [formIsActive, setFormIsActive] = useState(true);

    // File upload state
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [digitalFile, setDigitalFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState("");

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        setLoading(true);
        try {
            const [prods, cats] = await Promise.all([getProducts(), getCategories()]);
            setProducts(prods);
            setCategories(cats);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    function openCreateModal() {
        setEditingProduct(null);
        setFormTitle(""); setFormSlug(""); setFormDescription("");
        setFormPrice(""); setFormOriginalPrice(""); setFormCategoryId("");
        setFormBpm(""); setFormKey(""); setFormTags("");
        setFormIsFeatured(false); setFormIsActive(true);
        setImageFile(null); setAudioFile(null); setDigitalFile(null); setUploadProgress("");
        setIsModalOpen(true);
    }

    function openEditModal(product: Product) {
        setEditingProduct(product);
        setFormTitle(product.title);
        setFormSlug(product.slug);
        setFormDescription(product.description || "");
        setFormPrice(String(product.price));
        setFormOriginalPrice(product.original_price ? String(product.original_price) : "");
        setFormCategoryId(product.category_id || "");
        setFormBpm(product.bpm ? String(product.bpm) : "");
        setFormKey(product.key || "");
        setFormTags((product.tags || []).join(", "));
        setFormIsFeatured(product.is_featured);
        setFormIsActive(product.is_active);
        setImageFile(null); setAudioFile(null); setDigitalFile(null); setUploadProgress("");
        setIsModalOpen(true);
    }

    function handleTitleChange(title: string) {
        setFormTitle(title);
        if (!editingProduct) {
            setFormSlug(title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        startTransition(async () => {
            try {
                const payload: any = {
                    title: formTitle,
                    slug: formSlug,
                    description: formDescription || undefined,
                    price: parseFloat(formPrice),
                    original_price: formOriginalPrice ? parseFloat(formOriginalPrice) : undefined,
                    category_id: formCategoryId || undefined,
                    bpm: formBpm ? parseInt(formBpm) : undefined,
                    key: formKey || undefined,
                    tags: formTags ? formTags.split(",").map(t => t.trim()).filter(Boolean) : [],
                    is_featured: formIsFeatured,
                    is_active: formIsActive,
                };

                // Upload files if selected
                if (imageFile) {
                    setUploadProgress("Subiendo imagen...");
                    payload.feature_image_url = await uploadFile("product-images", imageFile, formSlug);
                }
                if (audioFile) {
                    setUploadProgress("Subiendo audio demo...");
                    payload.audio_demo_url = await uploadFile("audio-demos", audioFile, formSlug);
                }
                if (digitalFile) {
                    setUploadProgress("Subiendo archivo digital...");
                    payload.file_url = await uploadFile("digital-products", digitalFile, formSlug);
                }

                setUploadProgress("");

                if (editingProduct) {
                    await updateProduct(editingProduct.id, payload);
                } else {
                    await createProduct(payload);
                }
                setIsModalOpen(false);
                await loadData();
            } catch (err: any) {
                setError(err.message);
            }
        });
    }

    async function handleDelete(id: string) {
        if (!confirm("¿Estás seguro de eliminar este producto?")) return;
        startTransition(async () => {
            try {
                await deleteProduct(id);
                await loadData();
            } catch (err: any) {
                setError(err.message);
            }
        });
    }

    async function handleToggleFeatured(product: Product) {
        startTransition(async () => {
            try {
                await updateProduct(product.id, { is_featured: !product.is_featured });
                await loadData();
            } catch (err: any) {
                setError(err.message);
            }
        });
    }

    const filtered = products.filter((p) => {
        const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
            (p.tags || []).some(t => t.toLowerCase().includes(search.toLowerCase()));
        const matchesCategory = !filterCategory || p.category_id === filterCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ gap: "2.5rem", paddingTop: "1rem" }}>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-[var(--text-primary)] mb-2">Productos</h1>
                    <p className="text-[var(--text-secondary)]">Gestiona el catálogo de samples, presets y proyectos.</p>
                </div>
                <button onClick={openCreateModal} className="btn-neon whitespace-nowrap self-start sm:self-auto">
                    <Plus className="w-4 h-4" />
                    <span>Añadir Producto</span>
                </button>
            </div>

            {/* Error Banner */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
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
                        type="text" placeholder="Buscar producto por nombre o tag..."
                        value={search} onChange={(e) => setSearch(e.target.value)}
                        className="input-neon w-full" style={{ paddingLeft: "3rem" }}
                    />
                </div>
                <div className="flex gap-3 w-full sm:w-auto items-center">
                    <select
                        value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
                        className="input-neon text-sm flex-1 sm:flex-none"
                    >
                        <option value="">Todas las categorías</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <span className="text-sm text-[var(--text-muted)] whitespace-nowrap">{filtered.length} producto{filtered.length !== 1 ? "s" : ""}</span>
                </div>
            </div>

            {/* Loading */}
            {loading && (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-[var(--neon-green)]" />
                </div>
            )}

            {/* Data Table */}
            {!loading && filtered.length > 0 && (
                <div className="glass-card overflow-hidden flex flex-col">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
                                    <th className="text-sm font-medium text-[var(--text-secondary)] w-16" style={{ padding: "1rem 1.5rem" }}>Img</th>
                                    <th className="text-sm font-medium text-[var(--text-secondary)]" style={{ padding: "1rem 1.5rem" }}>Nombre</th>
                                    <th className="text-sm font-medium text-[var(--text-secondary)] hidden md:table-cell" style={{ padding: "1rem 1.5rem" }}>Categoría</th>
                                    <th className="text-sm font-medium text-[var(--text-secondary)]" style={{ padding: "1rem 1.5rem" }}>Precio</th>
                                    <th className="text-sm font-medium text-[var(--text-secondary)] hidden sm:table-cell" style={{ padding: "1rem 1.5rem" }}>Estado</th>
                                    <th className="text-sm font-medium text-[var(--text-secondary)] text-right" style={{ padding: "1rem 1.5rem" }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border-subtle)]">
                                {filtered.map((product) => (
                                    <tr key={product.id} className="hover:bg-[var(--bg-secondary)] transition-colors group">
                                        <td style={{ padding: "1rem 1.5rem" }}>
                                            <div className="w-10 h-10 rounded bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center overflow-hidden shrink-0 text-[var(--neon-purple)]">
                                                {product.feature_image_url ? (
                                                    <img src={product.feature_image_url} alt={product.title} className="w-full h-full object-cover" />
                                                ) : (
                                                    <Music className="w-5 h-5 opacity-70" />
                                                )}
                                            </div>
                                        </td>
                                        <td style={{ padding: "1rem 1.5rem" }}>
                                            <div className="font-medium text-[var(--text-primary)]">{product.title}</div>
                                            <div className="text-xs text-[var(--text-muted)] md:hidden mt-1">{product.category?.name || "Sin categoría"}</div>
                                        </td>
                                        <td className="hidden md:table-cell text-sm text-[var(--text-secondary)]" style={{ padding: "1rem 1.5rem" }}>
                                            {product.category?.name || "Sin categoría"}
                                        </td>
                                        <td className="font-medium text-[var(--text-primary)]" style={{ padding: "1rem 1.5rem" }}>
                                            ${Number(product.price).toFixed(2)}
                                        </td>
                                        <td className="hidden sm:table-cell tracking-wider" style={{ padding: "1rem 1.5rem" }}>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-xs font-semibold px-2 py-1 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] ${product.is_active ? "text-[var(--neon-green)]" : "text-[var(--text-muted)]"}`}>
                                                    {product.is_active ? "Activo" : "Inactivo"}
                                                </span>
                                                {product.is_featured && (
                                                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--neon-orange)]">
                                                        ⭐ Destacado
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td style={{ padding: "1rem 1.5rem" }}>
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handleToggleFeatured(product)} className={`p-2 transition-colors rounded-lg hover:bg-[var(--bg-elevated)] ${product.is_featured ? "text-[var(--neon-orange)]" : "text-[var(--text-secondary)] hover:text-[var(--neon-orange)]"}`} title={product.is_featured ? "Quitar destacado" : "Destacar"}>
                                                    {product.is_featured ? <Star className="w-4 h-4 fill-current" /> : <StarOff className="w-4 h-4" />}
                                                </button>
                                                <button onClick={() => openEditModal(product)} className="p-2 text-[var(--text-secondary)] hover:text-[var(--neon-green)] transition-colors rounded-lg hover:bg-[var(--bg-elevated)]" title="Editar">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDelete(product.id)} className="p-2 text-[var(--text-secondary)] hover:text-[var(--neon-pink)] transition-colors rounded-lg hover:bg-[var(--bg-elevated)]" title="Eliminar">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="border-t border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-secondary)] mt-auto rounded-b-xl" style={{ padding: "1rem 1.5rem" }}>
                        <span className="text-sm text-[var(--text-muted)]">Mostrando {filtered.length} producto{filtered.length !== 1 ? "s" : ""}</span>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!loading && filtered.length === 0 && (
                <div className="glass-card flex items-center justify-center border-dashed text-center" style={{ padding: "3rem", minHeight: "200px" }}>
                    <div className="flex flex-col items-center max-w-md">
                        <div className="w-12 h-12 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)] mb-4">
                            <Music className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">{search || filterCategory ? "Sin resultados" : "Sin productos"}</h3>
                        <p className="text-[var(--text-secondary)] text-sm">
                            {search || filterCategory ? "Probá ajustando los filtros de búsqueda." : "Creá tu primer producto para empezar a vender."}
                        </p>
                    </div>
                </div>
            )}

            {/* Create/Edit Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="glass-card relative z-10 w-full max-w-2xl max-h-[85vh] overflow-y-auto"
                            style={{ padding: "2rem" }}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-[var(--text-primary)]">
                                    {editingProduct ? "Editar Producto" : "Nuevo Producto"}
                                </h2>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 text-[var(--text-secondary)] hover:text-white rounded-lg hover:bg-[var(--bg-elevated)] transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                {/* Title & Slug */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm text-[var(--text-secondary)] mb-1.5 block">Título</label>
                                        <input type="text" required value={formTitle} onChange={(e) => handleTitleChange(e.target.value)} placeholder="Ej: Urban Elements Vol. 1" className="input-neon w-full" />
                                    </div>
                                    <div>
                                        <label className="text-sm text-[var(--text-secondary)] mb-1.5 block">Slug (URL)</label>
                                        <input type="text" required value={formSlug} onChange={(e) => setFormSlug(e.target.value)} placeholder="urban-elements-vol-1" className="input-neon w-full font-mono text-sm" />
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="text-sm text-[var(--text-secondary)] mb-1.5 block">Descripción</label>
                                    <textarea value={formDescription} onChange={(e) => setFormDescription(e.target.value)} placeholder="Descripción del producto..." className="input-neon w-full" rows={3} />
                                </div>

                                {/* Price, Original Price, Category */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                        <label className="text-sm text-[var(--text-secondary)] mb-1.5 block">Precio (USD)</label>
                                        <input type="number" required step="0.01" min="0" value={formPrice} onChange={(e) => setFormPrice(e.target.value)} placeholder="29.99" className="input-neon w-full" />
                                    </div>
                                    <div>
                                        <label className="text-sm text-[var(--text-secondary)] mb-1.5 block">Precio Original</label>
                                        <input type="number" step="0.01" min="0" value={formOriginalPrice} onChange={(e) => setFormOriginalPrice(e.target.value)} placeholder="49.99" className="input-neon w-full" />
                                    </div>
                                    <div>
                                        <label className="text-sm text-[var(--text-secondary)] mb-1.5 block">Categoría</label>
                                        <select value={formCategoryId} onChange={(e) => setFormCategoryId(e.target.value)} className="input-neon w-full">
                                            <option value="">Sin categoría</option>
                                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                </div>

                                {/* BPM, Key, Tags */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                        <label className="text-sm text-[var(--text-secondary)] mb-1.5 block">BPM</label>
                                        <input type="number" min="1" max="300" value={formBpm} onChange={(e) => setFormBpm(e.target.value)} placeholder="140" className="input-neon w-full" />
                                    </div>
                                    <div>
                                        <label className="text-sm text-[var(--text-secondary)] mb-1.5 block">Key</label>
                                        <input type="text" value={formKey} onChange={(e) => setFormKey(e.target.value)} placeholder="Cm" className="input-neon w-full" />
                                    </div>
                                    <div>
                                        <label className="text-sm text-[var(--text-secondary)] mb-1.5 block">Tags (separados por coma)</label>
                                        <input type="text" value={formTags} onChange={(e) => setFormTags(e.target.value)} placeholder="Trap, 808, Dark" className="input-neon w-full" />
                                    </div>
                                </div>

                                {/* File Uploads */}
                                <div className="border-t border-[var(--border-subtle)] pt-4 mt-2">
                                    <p className="text-sm font-semibold text-[var(--text-primary)] mb-3">Archivos</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        {/* Image Upload */}
                                        <div>
                                            <label className="text-sm text-[var(--text-secondary)] mb-1.5 block">Imagen</label>
                                            <label className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-dashed border-[var(--border-subtle)] bg-[var(--bg-secondary)] cursor-pointer hover:border-[var(--neon-green)] transition-colors text-center">
                                                <ImageIcon className="w-5 h-5 text-[var(--text-muted)]" />
                                                <span className="text-xs text-[var(--text-muted)] truncate max-w-full">
                                                    {imageFile ? imageFile.name : editingProduct?.feature_image_url ? "✓ Imagen existente" : "JPG, PNG"}
                                                </span>
                                                <input type="file" accept="image/*" className="hidden" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
                                            </label>
                                        </div>
                                        {/* Audio Upload */}
                                        <div>
                                            <label className="text-sm text-[var(--text-secondary)] mb-1.5 block">Audio Demo</label>
                                            <label className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-dashed border-[var(--border-subtle)] bg-[var(--bg-secondary)] cursor-pointer hover:border-[var(--neon-green)] transition-colors text-center">
                                                <FileAudio className="w-5 h-5 text-[var(--text-muted)]" />
                                                <span className="text-xs text-[var(--text-muted)] truncate max-w-full">
                                                    {audioFile ? audioFile.name : editingProduct?.audio_demo_url ? "✓ Audio existente" : "MP3, WAV"}
                                                </span>
                                                <input type="file" accept="audio/*" className="hidden" onChange={(e) => setAudioFile(e.target.files?.[0] || null)} />
                                            </label>
                                        </div>
                                        {/* Digital File Upload */}
                                        <div>
                                            <label className="text-sm text-[var(--text-secondary)] mb-1.5 block">Archivo Digital</label>
                                            <label className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-dashed border-[var(--border-subtle)] bg-[var(--bg-secondary)] cursor-pointer hover:border-[var(--neon-green)] transition-colors text-center">
                                                <FileArchive className="w-5 h-5 text-[var(--text-muted)]" />
                                                <span className="text-xs text-[var(--text-muted)] truncate max-w-full">
                                                    {digitalFile ? digitalFile.name : editingProduct?.file_url ? "✓ Archivo existente" : "ZIP, RAR"}
                                                </span>
                                                <input type="file" accept=".zip,.rar,.7z" className="hidden" onChange={(e) => setDigitalFile(e.target.files?.[0] || null)} />
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Toggles */}
                                <div className="flex items-center gap-6 py-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={formIsFeatured} onChange={(e) => setFormIsFeatured(e.target.checked)} className="w-4 h-4 rounded accent-[var(--neon-green)]" />
                                        <span className="text-sm text-[var(--text-secondary)]">⭐ Producto Destacado</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={formIsActive} onChange={(e) => setFormIsActive(e.target.checked)} className="w-4 h-4 rounded accent-[var(--neon-green)]" />
                                        <span className="text-sm text-[var(--text-secondary)]">Activo (visible en tienda)</span>
                                    </label>
                                </div>

                                {/* Upload Progress */}
                                {uploadProgress && (
                                    <div className="flex items-center gap-2 text-sm text-[var(--neon-green)]">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        {uploadProgress}
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-[var(--border-subtle)]">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="btn-neon-outline text-sm">Cancelar</button>
                                    <button type="submit" disabled={isPending} className="btn-neon text-sm">
                                        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : editingProduct ? "Guardar Cambios" : "Crear Producto"}
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

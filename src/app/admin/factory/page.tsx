"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
    Upload, Search, Trash2, Edit3, Loader2, AudioLines,
    ChevronLeft, ChevronRight, CheckSquare, Square, X,
    FileAudio, AlertCircle, CheckCircle2
} from "lucide-react";
import { getAdminSamples, deleteSample, deleteSamplesBulk, updateSample, getSampleStats } from "@/lib/actions/samples";

type UploadStatus = "idle" | "uploading" | "done" | "error";

export default function AdminFactoryPage() {
    const [samples, setSamples] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    // Upload state
    const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
    const [uploadResult, setUploadResult] = useState<any>(null);
    const [dragOver, setDragOver] = useState(false);

    // Inline edit
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editData, setEditData] = useState<any>({});

    // Stats
    const [stats, setStats] = useState({ totalSamples: 0 });

    const loadSamples = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getAdminSamples(currentPage, 50, search || undefined);
            setSamples(res.samples);
            setTotalCount(res.totalCount);
            setTotalPages(res.totalPages);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    }, [currentPage, search]);

    useEffect(() => {
        loadSamples();
        getSampleStats().then(setStats);
    }, [loadSamples]);

    // Debounced search
    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    /* ---- BULK UPLOAD ---- */
    const handleUpload = async (file: File) => {
        if (!file.name.endsWith(".zip")) {
            alert("Solo se aceptan archivos .zip");
            return;
        }
        setUploadStatus("uploading");
        setUploadResult(null);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/factory/upload", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Error en upload");

            setUploadResult(data);
            setUploadStatus("done");
            loadSamples();
            getSampleStats().then(setStats);
        } catch (err: any) {
            setUploadResult({ error: err.message });
            setUploadStatus("error");
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) handleUpload(file);
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleUpload(file);
        e.target.value = "";
    };

    /* ---- SELECTION ---- */
    const toggleSelect = (id: string) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            return next;
        });
    };

    const selectAll = () => {
        if (selectedIds.size === samples.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(samples.map((s) => s.id)));
        }
    };

    const handleBulkDelete = async () => {
        if (!confirm(`¿Eliminar ${selectedIds.size} samples?`)) return;
        await deleteSamplesBulk(Array.from(selectedIds));
        setSelectedIds(new Set());
        loadSamples();
        getSampleStats().then(setStats);
    };

    /* ---- INLINE EDIT ---- */
    const startEdit = (sample: any) => {
        setEditingId(sample.id);
        setEditData({
            bpm: sample.bpm || "",
            musical_key: sample.musical_key || "",
            genre: sample.genre || "",
            instrument_type: sample.instrument_type || "",
        });
    };

    const saveEdit = async () => {
        if (!editingId) return;
        const cleanData: any = {};
        if (editData.bpm) cleanData.bpm = parseInt(editData.bpm);
        if (editData.musical_key) cleanData.musical_key = editData.musical_key;
        if (editData.genre) cleanData.genre = editData.genre;
        if (editData.instrument_type) cleanData.instrument_type = editData.instrument_type;

        await updateSample(editingId, cleanData);
        setEditingId(null);
        loadSamples();
    };

    /* ---- DELETE SINGLE ---- */
    const handleDelete = async (id: string) => {
        if (!confirm("¿Eliminar este sample?")) return;
        await deleteSample(id);
        loadSamples();
        getSampleStats().then(setStats);
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-display font-bold text-[var(--text-primary)]">Factory</h1>
                    <p className="text-[var(--text-muted)] text-sm mt-1">
                        {stats.totalSamples.toLocaleString()} samples en la librería
                    </p>
                </div>
            </div>

            {/* Upload Zone */}
            <div
                className={`relative rounded-2xl border-2 border-dashed transition-all cursor-pointer ${dragOver
                        ? "border-[var(--neon-green)] bg-[rgba(0,255,178,0.05)]"
                        : "border-[var(--border-subtle)] hover:border-[rgba(255,255,255,0.15)]"
                    }`}
                style={{ padding: "3rem 2rem" }}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById("zip-input")?.click()}
            >
                <input
                    id="zip-input"
                    type="file"
                    accept=".zip"
                    className="hidden"
                    onChange={handleFileInput}
                />

                {uploadStatus === "uploading" ? (
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-10 h-10 animate-spin text-[var(--neon-green)]" />
                        <p className="text-[var(--text-secondary)] text-sm">Extrayendo y subiendo samples...</p>
                        <p className="text-[var(--text-muted)] text-xs">Esto puede tardar unos minutos según el tamaño del ZIP</p>
                    </div>
                ) : uploadStatus === "done" && uploadResult ? (
                    <div className="flex flex-col items-center gap-3">
                        <CheckCircle2 className="w-10 h-10 text-[var(--neon-green)]" />
                        <p className="text-[var(--neon-green)] font-medium">
                            {uploadResult.created} samples creados
                        </p>
                        {uploadResult.errors > 0 && (
                            <p className="text-red-400 text-sm">{uploadResult.errors} errores</p>
                        )}
                        {uploadResult.skipped > 0 && (
                            <p className="text-[var(--text-muted)] text-xs">{uploadResult.skipped} archivos ignorados</p>
                        )}
                        <button
                            onClick={(e) => { e.stopPropagation(); setUploadStatus("idle"); }}
                            className="text-[var(--text-muted)] text-xs hover:text-white mt-2"
                        >
                            Subir otro ZIP
                        </button>
                    </div>
                ) : uploadStatus === "error" ? (
                    <div className="flex flex-col items-center gap-3">
                        <AlertCircle className="w-10 h-10 text-red-400" />
                        <p className="text-red-400 text-sm">{uploadResult?.error || "Error desconocido"}</p>
                        <button
                            onClick={(e) => { e.stopPropagation(); setUploadStatus("idle"); }}
                            className="text-[var(--text-muted)] text-xs hover:text-white mt-2"
                        >
                            Reintentar
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-3">
                        <div
                            className="w-14 h-14 rounded-2xl flex items-center justify-center"
                            style={{
                                background: "rgba(0,255,178,0.08)",
                                border: "1px solid rgba(0,255,178,0.15)",
                            }}
                        >
                            <Upload className="w-6 h-6 text-[var(--neon-green)]" />
                        </div>
                        <div className="text-center">
                            <p className="text-[var(--text-secondary)] font-medium">
                                Arrastrá un archivo ZIP o hacé click para seleccionar
                            </p>
                            <p className="text-[var(--text-muted)] text-xs mt-1">
                                Formato: <code className="text-[var(--neon-green)]">BPM_Key_Genre_Instrument_Name.wav</code>
                            </p>
                            <p className="text-[var(--text-muted)] text-xs">
                                Ejemplo: <code>128_Cm_Trap_HiHat_01.wav</code>
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Search + bulk actions */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar samples..."
                        className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-sm focus:border-[var(--neon-green)] focus:outline-none transition-colors"
                        style={{ padding: "0.7rem 1rem 0.7rem 2.5rem" }}
                    />
                </div>
                {selectedIds.size > 0 && (
                    <button
                        onClick={handleBulkDelete}
                        className="flex items-center gap-2 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all text-sm"
                        style={{ padding: "0.7rem 1.25rem" }}
                    >
                        <Trash2 className="w-4 h-4" />
                        Eliminar ({selectedIds.size})
                    </button>
                )}
            </div>

            {/* Table */}
            {loading ? (
                <div className="flex justify-center py-16">
                    <Loader2 className="w-6 h-6 animate-spin text-[var(--neon-green)]" />
                </div>
            ) : samples.length === 0 ? (
                <div className="text-center py-16">
                    <FileAudio className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-3" />
                    <p className="text-[var(--text-secondary)]">No hay samples todavía</p>
                    <p className="text-[var(--text-muted)] text-sm mt-1">Subí un archivo ZIP para empezar</p>
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto rounded-xl border border-[var(--border-subtle)]">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-[var(--border-subtle)] bg-[rgba(255,255,255,0.02)]">
                                    <th className="text-left py-3 px-3 w-10">
                                        <button onClick={selectAll} className="text-[var(--text-muted)] hover:text-white">
                                            {selectedIds.size === samples.length ? (
                                                <CheckSquare className="w-4 h-4 text-[var(--neon-green)]" />
                                            ) : (
                                                <Square className="w-4 h-4" />
                                            )}
                                        </button>
                                    </th>
                                    <th className="text-left py-3 px-3 text-[var(--text-muted)] font-medium">Título</th>
                                    <th className="text-left py-3 px-3 text-[var(--text-muted)] font-medium">BPM</th>
                                    <th className="text-left py-3 px-3 text-[var(--text-muted)] font-medium">Key</th>
                                    <th className="text-left py-3 px-3 text-[var(--text-muted)] font-medium">Género</th>
                                    <th className="text-left py-3 px-3 text-[var(--text-muted)] font-medium">Instrumento</th>
                                    <th className="text-right py-3 px-3 text-[var(--text-muted)] font-medium w-24">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {samples.map((sample) => (
                                    <tr
                                        key={sample.id}
                                        className="border-b border-[var(--border-subtle)] hover:bg-[rgba(255,255,255,0.02)] transition-colors"
                                    >
                                        <td className="py-3 px-3">
                                            <button onClick={() => toggleSelect(sample.id)} className="text-[var(--text-muted)]">
                                                {selectedIds.has(sample.id) ? (
                                                    <CheckSquare className="w-4 h-4 text-[var(--neon-green)]" />
                                                ) : (
                                                    <Square className="w-4 h-4" />
                                                )}
                                            </button>
                                        </td>
                                        <td className="py-3 px-3">
                                            <div className="flex items-center gap-2">
                                                <AudioLines className="w-4 h-4 text-[var(--neon-green)] flex-shrink-0" />
                                                <span className="text-[var(--text-primary)] font-medium truncate max-w-[200px]">
                                                    {sample.title}
                                                </span>
                                            </div>
                                        </td>
                                        {editingId === sample.id ? (
                                            <>
                                                <td className="py-2 px-3">
                                                    <input value={editData.bpm} onChange={(e) => setEditData({ ...editData, bpm: e.target.value })}
                                                        className="w-16 rounded bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-xs px-2 py-1" />
                                                </td>
                                                <td className="py-2 px-3">
                                                    <input value={editData.musical_key} onChange={(e) => setEditData({ ...editData, musical_key: e.target.value })}
                                                        className="w-14 rounded bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-xs px-2 py-1" />
                                                </td>
                                                <td className="py-2 px-3">
                                                    <input value={editData.genre} onChange={(e) => setEditData({ ...editData, genre: e.target.value })}
                                                        className="w-24 rounded bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-xs px-2 py-1" />
                                                </td>
                                                <td className="py-2 px-3">
                                                    <input value={editData.instrument_type} onChange={(e) => setEditData({ ...editData, instrument_type: e.target.value })}
                                                        className="w-24 rounded bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-xs px-2 py-1" />
                                                </td>
                                                <td className="py-2 px-3 text-right">
                                                    <button onClick={saveEdit} className="text-[var(--neon-green)] text-xs hover:underline mr-2">Guardar</button>
                                                    <button onClick={() => setEditingId(null)} className="text-[var(--text-muted)] text-xs hover:underline">Cancelar</button>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="py-3 px-3 text-[var(--text-secondary)]">{sample.bpm || "—"}</td>
                                                <td className="py-3 px-3 text-[var(--text-secondary)]">{sample.musical_key || "—"}</td>
                                                <td className="py-3 px-3 text-[var(--text-secondary)]">{sample.genre || "—"}</td>
                                                <td className="py-3 px-3 text-[var(--text-secondary)]">{sample.instrument_type || "—"}</td>
                                                <td className="py-3 px-3 text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <button
                                                            onClick={() => startEdit(sample)}
                                                            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--neon-blue)] hover:bg-[rgba(0,212,255,0.1)] transition-all"
                                                        >
                                                            <Edit3 className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(sample.id)}
                                                            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-red-400 hover:bg-[rgba(255,0,0,0.1)] transition-all"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between">
                        <p className="text-[var(--text-muted)] text-xs">
                            Página {currentPage} de {totalPages} · {totalCount} samples
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                disabled={currentPage <= 1}
                                onClick={() => setCurrentPage((p) => p - 1)}
                                className="p-2 rounded-lg border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white disabled:opacity-30 transition-all"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                                disabled={currentPage >= totalPages}
                                onClick={() => setCurrentPage((p) => p + 1)}
                                className="p-2 rounded-lg border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white disabled:opacity-30 transition-all"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

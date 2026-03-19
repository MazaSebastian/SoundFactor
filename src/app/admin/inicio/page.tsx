"use client";

import { useSettingsStore } from "@/store/useSettingsStore";
import { Save, LayoutTemplate } from "lucide-react";
import { useState, useEffect } from "react";

export default function InicioAdminPage() {
    const settings = useSettingsStore();
    const [mounted, setMounted] = useState(false);
    const [formData, setFormData] = useState(settings);

    useEffect(() => {
        setMounted(true);
        setFormData((prev) => ({
            ...prev,
            badgeText: settings.badgeText,
            titleLine1Part1: settings.titleLine1Part1,
            titleLine1Part2: settings.titleLine1Part2,
            titleLine1Part3: settings.titleLine1Part3,
            titleLine2Part1: settings.titleLine2Part1,
            titleLine2Part2: settings.titleLine2Part2,
            subtitle: settings.subtitle,
        }));
    }, [settings]);

    if (!mounted) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        settings.updateSettings(formData);

        // Custom simple toast notification for UX
        const toast = document.createElement("div");
        toast.className = "fixed bottom-5 right-5 bg-[var(--neon-green)] text-[var(--bg-primary)] px-6 py-3 rounded-lg font-bold shadow-[var(--glow-green)] z-50 animate-in fade-in slide-in-from-bottom-4";
        toast.textContent = "Configuración de Inicio guardada con éxito";
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.replace("animate-in", "animate-out");
            toast.classList.replace("fade-in", "fade-out");
            toast.classList.replace("slide-in-from-bottom-4", "slide-out-to-bottom-4");
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    };

    return (
        <div className="flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ gap: '2.5rem', paddingTop: '1rem' }}>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-[var(--text-primary)] mb-2">Inicio (Hero)</h1>
                    <p className="text-[var(--text-secondary)]">Personaliza los textos principales de la portada de la tienda.</p>
                </div>
                <button onClick={handleSave} className="btn-neon whitespace-nowrap self-start sm:self-auto">
                    <Save className="w-4 h-4" />
                    <span>Guardar Cambios</span>
                </button>
            </div>

            {/* Form */}
            <div className="glass-card" style={{ padding: '2rem' }}>
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--border-subtle)]">
                    <LayoutTemplate className="w-5 h-5 text-[var(--neon-green)]" />
                    <h2 className="text-xl font-bold text-[var(--text-primary)]">Textos Destacados</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
                    {/* Badge Text */}
                    <div className="flex flex-col gap-2 md:col-span-2">
                        <label className="text-sm font-medium text-[var(--text-secondary)]">Etiqueta Superior (Badge)</label>
                        <input
                            type="text"
                            name="badgeText"
                            value={formData.badgeText}
                            onChange={handleChange}
                            className="input-neon w-full"
                            placeholder="Ej: Nueva colección disponible"
                        />
                        <p className="text-xs text-[var(--text-muted)]">Acompaña al ícono de relámpago sobre el título principal.</p>
                    </div>

                    {/* Title Line 1 */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-[var(--text-secondary)]">Título Superior - Previo</label>
                        <input
                            type="text"
                            name="titleLine1Part1"
                            value={formData.titleLine1Part1}
                            onChange={handleChange}
                            className="input-neon w-full"
                            placeholder="Ej: Sonidos que"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-[var(--neon-green)] flex items-center gap-2">
                            Título Superior - Destacado
                            <span className="inline-block w-2 h-2 rounded-full bg-[var(--neon-green)] shadow-[var(--glow-green)]"></span>
                        </label>
                        <input
                            type="text"
                            name="titleLine1Part2"
                            value={formData.titleLine1Part2}
                            onChange={handleChange}
                            className="input-neon w-full !border-[var(--neon-green)] focus:ring-[var(--neon-green)]"
                            style={{ color: 'var(--neon-green)' }}
                            placeholder="Ej: inspiran"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-[var(--text-secondary)]">Título Superior - Posterior</label>
                        <input
                            type="text"
                            name="titleLine1Part3"
                            value={formData.titleLine1Part3}
                            onChange={handleChange}
                            className="input-neon w-full"
                            placeholder="Ej:  tu"
                        />
                    </div>

                    {/* Spacer for grid structural alignment */}
                    <div className="hidden md:block"></div>

                    {/* Title Line 2 */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-[var(--text-secondary)]">Título Inferior - Previo</label>
                        <input
                            type="text"
                            name="titleLine2Part1"
                            value={formData.titleLine2Part1}
                            onChange={handleChange}
                            className="input-neon w-full"
                            placeholder="Ej: próximo "
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-[var(--neon-orange)] flex items-center gap-2">
                            Título Inferior - Destacado Cálido
                            <span className="inline-block w-2 h-2 rounded-full bg-[var(--neon-orange)]" style={{ boxShadow: '0 0 10px rgba(255,107,53,0.5)' }}></span>
                        </label>
                        <input
                            type="text"
                            name="titleLine2Part2"
                            value={formData.titleLine2Part2}
                            onChange={handleChange}
                            className="input-neon w-full !border-[var(--neon-orange)]"
                            style={{ color: 'var(--neon-orange)', outlineColor: 'var(--neon-orange)', boxShadow: 'none' }}
                            placeholder="Ej: hit"
                            onFocus={(e) => e.target.style.boxShadow = '0 0 0 1px var(--neon-orange)'}
                            onBlur={(e) => e.target.style.boxShadow = 'none'}
                        />
                    </div>

                    {/* Subtitle */}
                    <div className="flex flex-col gap-2 md:col-span-2">
                        <label className="text-sm font-medium text-[var(--text-secondary)]">Subtítulo Descriptivo</label>
                        <textarea
                            name="subtitle"
                            value={formData.subtitle}
                            onChange={handleChange}
                            className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--neon-green)] focus:ring-1 focus:ring-[var(--neon-green)] transition-all min-h-[120px] resize-y"
                            style={{ padding: '1rem', lineHeight: '1.5' }}
                            placeholder="Texto descriptivo aquí..."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

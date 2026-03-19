import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface SettingsState {
    badgeText: string;
    titleLine1Part1: string;
    titleLine1Part2: string;
    titleLine1Part3: string;
    titleLine2Part1: string;
    titleLine2Part2: string;
    subtitle: string;
    updateSettings: (newSettings: Partial<Omit<SettingsState, 'updateSettings'>>) => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            badgeText: "Nueva colección disponible",
            titleLine1Part1: "Sonidos que",
            titleLine1Part2: "inspiran",
            titleLine1Part3: " tu",
            titleLine2Part1: "próximo ",
            titleLine2Part2: "hit",
            subtitle: "Sample packs, proyectos FL Studio, presets, drum kits y templates\nde calidad profesional. Listos para usar en tu DAW.",
            updateSettings: (newSettings) => set((state) => ({ ...state, ...newSettings })),
        }),
        {
            name: 'soundfactory-settings-store',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

"use client";

import { useState } from "react";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";

export interface Filters {
  categories: string[];
  priceRange: [number, number];
  genres: string[];
  bpmRange: [number, number];
  key: string | null;
}

interface CategoryOption {
  name: string;
  slug: string;
  product_count?: number;
}

interface FilterSidebarProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  className?: string;
  categories?: CategoryOption[];
}

const allGenres: string[] = [];
const allKeys: string[] = [];

function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      className="border-b border-border-subtle last:border-b-0 last:pb-0 last:mb-0"
      style={{ paddingBottom: '1.5rem', marginBottom: '1.5rem' }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-left"
        style={{ marginBottom: '1.25rem' }}
      >
        <span className="text-sm font-semibold text-text-primary uppercase tracking-wider">
          {title}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-text-muted transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className="flex flex-col" style={{ gap: '1rem' }}>{children}</div>}
    </div>
  );
}

export default function FilterSidebar({ filters, onChange, className = "", categories = [] }: FilterSidebarProps) {
  const toggleCategory = (slug: string) => {
    const cats = filters.categories.includes(slug)
      ? filters.categories.filter((c) => c !== slug)
      : [...filters.categories, slug];
    onChange({ ...filters, categories: cats });
  };

  const toggleGenre = (genre: string) => {
    const genres = filters.genres.includes(genre)
      ? filters.genres.filter((g) => g !== genre)
      : [...filters.genres, genre];
    onChange({ ...filters, genres });
  };

  const activeCount =
    filters.categories.length +
    filters.genres.length +
    (filters.key ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 100 ? 1 : 0) +
    (filters.bpmRange[0] > 0 || filters.bpmRange[1] < 200 ? 1 : 0);

  const resetFilters = () => {
    onChange({
      categories: [],
      priceRange: [0, 100],
      genres: [],
      bpmRange: [0, 200],
      key: null,
    });
  };

  return (
    <aside className={`${className}`} style={{ padding: '2rem' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-neon-green" />
          <span className="font-display font-semibold text-text-primary">Filtros</span>
          {activeCount > 0 && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-neon-green text-bg-primary">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={resetFilters}
            className="text-xs text-text-muted hover:text-neon-pink transition-colors flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Limpiar
          </button>
        )}
      </div>

      {/* Categorías */}
      <FilterSection title="Categoría">
        {categories.map((cat: CategoryOption) => (
          <label key={cat.slug} className="flex items-center gap-2.5 cursor-pointer group">
            <div
              className={`w-4 h-4 rounded border transition-all flex items-center justify-center ${filters.categories.includes(cat.slug)
                ? "bg-neon-green border-neon-green"
                : "border-text-muted group-hover:border-text-secondary"
                }`}
            >
              {filters.categories.includes(cat.slug) && (
                <svg className="w-3 h-3 text-bg-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors flex-1">
              {cat.name}
            </span>
            <span className="text-xs text-text-muted">{cat.product_count || 0}</span>
          </label>
        ))}
      </FilterSection>

      {/* Precio */}
      <FilterSection title="Precio">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={filters.priceRange[0]}
              onChange={(e) =>
                onChange({
                  ...filters,
                  priceRange: [Number(e.target.value), filters.priceRange[1]],
                })
              }
              className="w-full accent-neon-green"
            />
          </div>
        </div>
        <div className="flex items-center justify-between text-xs text-text-muted">
          <span>${filters.priceRange[0]}</span>
          <span>—</span>
          <span>${filters.priceRange[1]}+</span>
        </div>
      </FilterSection>

      {/* Género */}
      <FilterSection title="Género" defaultOpen={false}>
        <div className="flex flex-wrap gap-1.5">
          {allGenres.map((genre: string) => (
            <button
              key={genre}
              onClick={() => toggleGenre(genre)}
              className={`text-xs px-2.5 py-1 rounded-full border transition-all ${filters.genres.includes(genre)
                ? "bg-neon-green/15 border-neon-green/40 text-neon-green"
                : "border-border-subtle text-text-muted hover:border-text-muted hover:text-text-secondary"
                }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Key */}
      <FilterSection title="Tonalidad" defaultOpen={false}>
        <div className="flex flex-wrap gap-1.5">
          {allKeys.map((k: string) => (
            <button
              key={k}
              onClick={() => onChange({ ...filters, key: filters.key === k ? null : k })}
              className={`text-xs px-2.5 py-1 rounded-full border transition-all ${filters.key === k
                ? "bg-neon-purple/15 border-neon-purple/40 text-neon-purple"
                : "border-border-subtle text-text-muted hover:border-text-muted hover:text-text-secondary"
                }`}
            >
              {k}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* BPM */}
      <FilterSection title="BPM" defaultOpen={false}>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.bpmRange[0] || ""}
            onChange={(e) =>
              onChange({
                ...filters,
                bpmRange: [Number(e.target.value) || 0, filters.bpmRange[1]],
              })
            }
            className="w-full px-3 py-1.5 rounded-lg text-sm bg-bg-elevated border border-border-subtle text-text-primary placeholder:text-text-muted focus:border-neon-green focus:outline-none transition-colors"
          />
          <span className="text-text-muted text-xs">—</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.bpmRange[1] === 200 ? "" : filters.bpmRange[1]}
            onChange={(e) =>
              onChange({
                ...filters,
                bpmRange: [filters.bpmRange[0], Number(e.target.value) || 200],
              })
            }
            className="w-full px-3 py-1.5 rounded-lg text-sm bg-bg-elevated border border-border-subtle text-text-primary placeholder:text-text-muted focus:border-neon-green focus:outline-none transition-colors"
          />
        </div>
      </FilterSection>
    </aside>
  );
}

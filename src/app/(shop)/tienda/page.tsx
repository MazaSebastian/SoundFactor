"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, Grid3X3, List, ChevronDown, X, Loader2 } from "lucide-react";
import ProductCard, { type ProductCardData } from "@/components/tienda/ProductCard";
import FilterSidebar, { type Filters } from "@/components/tienda/FilterSidebar";
import SearchBar from "@/components/tienda/SearchBar";
import { getActiveProducts } from "@/lib/actions/products";
import { getCategories } from "@/lib/actions/categories";
import type { Product, Category } from "@/lib/types";

const defaultFilters: Filters = {
  categories: [],
  priceRange: [0, 100],
  genres: [],
  bpmRange: [0, 200],
  key: null,
};

type SortOption = "relevancia" | "precio-asc" | "precio-desc" | "nuevo";

const sortLabels: Record<SortOption, string> = {
  relevancia: "Relevancia",
  "precio-asc": "Precio: menor a mayor",
  "precio-desc": "Precio: mayor a menor",
  nuevo: "Más recientes",
};

export default function TiendaPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategoriesData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("relevancia");
  const [showSort, setShowSort] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    Promise.all([getActiveProducts(), getCategories()])
      .then(([prods, cats]) => {
        setProducts(prods);
        setCategoriesData(cats);
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.tags || []).some((t) => t.toLowerCase().includes(q)) ||
          ((p.category as any)?.name || "").toLowerCase().includes(q)
      );
    }

    // Category filter
    if (filters.categories.length > 0) {
      result = result.filter((p) => {
        const catSlug = (p.category as any)?.slug || "";
        return filters.categories.includes(catSlug);
      });
    }

    // Price filter
    result = result.filter(
      (p) =>
        p.price >= filters.priceRange[0] &&
        (filters.priceRange[1] >= 100 || p.price <= filters.priceRange[1])
    );

    // Key filter
    if (filters.key) {
      result = result.filter((p) => p.key === filters.key);
    }

    // BPM filter
    if (filters.bpmRange[0] > 0 || filters.bpmRange[1] < 200) {
      result = result.filter(
        (p) =>
          p.bpm !== null &&
          p.bpm !== undefined &&
          p.bpm >= filters.bpmRange[0] &&
          (filters.bpmRange[1] >= 200 || p.bpm <= filters.bpmRange[1])
      );
    }

    // Sort
    switch (sort) {
      case "precio-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "precio-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "nuevo":
        result.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      default:
        result.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
    }

    return result;
  }, [products, search, filters, sort]);

  const activeFilterCount =
    filters.categories.length +
    filters.genres.length +
    (filters.key ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 100 ? 1 : 0) +
    (filters.bpmRange[0] > 0 || filters.bpmRange[1] < 200 ? 1 : 0);

  return (
    <div className="relative min-h-screen" style={{ paddingTop: '120px', paddingBottom: '7rem' }}>
      {/* Ambient background */}
      <div className="ambient-orb ambient-orb-green w-[600px] h-[600px] -top-40 -right-40 animate-pulse-glow" />
      <div
        className="ambient-orb ambient-orb-purple w-[400px] h-[400px] bottom-40 -left-40 animate-pulse-glow"
        style={{ animationDelay: "3s" }}
      />

      <div className="section-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
          style={{ marginBottom: '3rem' }}
        >
          <h1 className="font-display text-4xl md:text-5xl font-bold" style={{ marginBottom: '1.5rem' }}>
            <span className="gradient-text">Tienda</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-xl">
            Explorá nuestra colección de samples, presets, drum kits y proyectos.
            Todo royalty-free y listo para producir.
          </p>
        </motion.div>

        {/* Search + Controls */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col md:flex-row gap-4"
          style={{ paddingBottom: '2.5rem' }}
        >
          <SearchBar value={search} onChange={setSearch} className="flex-1" />

          <div className="flex items-center gap-3">
            {/* Mobile filter toggle */}
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden flex items-center gap-2 rounded-xl text-sm border border-border-subtle text-text-secondary hover:border-neon-green hover:text-neon-green transition-all bg-bg-elevated"
              style={{ padding: '0.75rem 1.5rem' }}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filtros
              {activeFilterCount > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-neon-green text-bg-primary">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Sort dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSort(!showSort)}
                className="flex items-center justify-between gap-2 rounded-xl text-sm border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--neon-green)] hover:text-[var(--neon-green)] transition-all bg-[var(--bg-elevated)]"
                style={{ padding: '0.75rem 1.5rem', width: '220px' }}
              >
                <span className="truncate">{sortLabels[sort]}</span>
                <ChevronDown className={`w-4 h-4 transition-transform flex-shrink-0 ${showSort ? "rotate-180 text-[var(--neon-green)]" : ""}`} />
              </button>

              <AnimatePresence>
                {showSort && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-[220px] rounded-xl border border-[var(--border-subtle)] bg-[rgba(10,12,16,0.95)] backdrop-blur-xl z-[60] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
                    style={{ padding: '0.5rem' }}
                  >
                    {(Object.keys(sortLabels) as SortOption[]).map((key) => (
                      <button
                        key={key}
                        onClick={() => {
                          setSort(key);
                          setShowSort(false);
                        }}
                        className={`w-full text-left px-3 py-2.5 text-sm rounded-lg transition-all flex items-center justify-between ${sort === key
                          ? "text-[var(--neon-green)] bg-[rgba(0,255,178,0.1)] font-medium"
                          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[rgba(255,255,255,0.05)]"
                          }`}
                      >
                        {sortLabels[key]}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Result count */}
            <span className="hidden md:inline text-sm text-text-muted whitespace-nowrap">
              {filteredProducts.length} producto{filteredProducts.length !== 1 ? "s" : ""}
            </span>
          </div>
        </motion.div>

        {/* Active filters chips */}
        {activeFilterCount > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="flex flex-wrap gap-2"
            style={{ paddingBottom: '1.5rem' }}
          >
            {filters.categories.map((slug) => {
              const cat = categories.find((c) => c.slug === slug);
              return (
                <button
                  key={slug}
                  onClick={() =>
                    setFilters({
                      ...filters,
                      categories: filters.categories.filter((c) => c !== slug),
                    })
                  }
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs bg-neon-green/10 text-neon-green border border-neon-green/20 hover:bg-neon-green/20 transition-colors"
                >
                  {cat?.name}
                  <X className="w-3 h-3" />
                </button>
              );
            })}
            {filters.genres.map((genre) => (
              <button
                key={genre}
                onClick={() =>
                  setFilters({
                    ...filters,
                    genres: filters.genres.filter((g) => g !== genre),
                  })
                }
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs bg-neon-purple/10 text-neon-purple border border-neon-purple/20 hover:bg-neon-purple/20 transition-colors"
              >
                {genre}
                <X className="w-3 h-3" />
              </button>
            ))}
            {filters.key && (
              <button
                onClick={() => setFilters({ ...filters, key: null })}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs bg-neon-blue/10 text-neon-blue border border-neon-blue/20 hover:bg-neon-blue/20 transition-colors"
              >
                Key: {filters.key}
                <X className="w-3 h-3" />
              </button>
            )}
          </motion.div>
        )}

        {/* Layout: Sidebar + Grid */}
        <div className="flex gap-8 lg:gap-12" style={{ paddingTop: '1.5rem' }}>
          {/* Desktop sidebar */}
          <FilterSidebar
            filters={filters}
            onChange={setFilters}
            categories={categories}
            className="hidden lg:block w-64 flex-shrink-0 glass-card p-5 h-fit sticky top-28"
          />

          {/* Mobile sidebar drawer */}
          <AnimatePresence>
            {showMobileFilters && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/60 z-40 lg:hidden"
                  onClick={() => setShowMobileFilters(false)}
                />
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="fixed left-0 top-0 bottom-0 w-80 z-50 bg-bg-secondary border-r border-border-subtle p-6 overflow-y-auto lg:hidden"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-display font-semibold text-text-primary text-lg">
                      Filtros
                    </h3>
                    <button
                      onClick={() => setShowMobileFilters(false)}
                      className="p-2 rounded-lg hover:bg-white/5 text-text-muted"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <FilterSidebar filters={filters} onChange={setFilters} categories={categories} />
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Product Grid */}
          <div className="flex-1">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredProducts.map((product, i) => {
                  const cardData: ProductCardData = {
                    id: product.id,
                    name: product.title,
                    slug: product.slug,
                    category: (product.category as any)?.name || "Sin categoría",
                    categorySlug: (product.category as any)?.slug || "",
                    price: product.price,
                    originalPrice: product.original_price || undefined,
                    image: product.feature_image_url || null,
                    tags: product.tags || [],
                    bpm: product.bpm,
                  };
                  return <ProductCard key={product.id} product={cardData} index={i} />;
                })}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-24"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-bg-elevated flex items-center justify-center">
                  <Grid3X3 className="w-8 h-8 text-text-muted" />
                </div>
                <h3 className="font-display text-xl text-text-primary mb-2">
                  No se encontraron productos
                </h3>
                <p className="text-text-secondary mb-6">
                  Probá ajustar los filtros o la búsqueda.
                </p>
                <button
                  onClick={() => {
                    setFilters(defaultFilters);
                    setSearch("");
                  }}
                  className="btn-neon-outline text-sm"
                >
                  Limpiar filtros
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useParams, notFound } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronRight, SlidersHorizontal, ChevronDown, Loader2, Music, Layers, Disc3, Sliders, FileAudio, Package } from "lucide-react";
import { getCategories } from "@/lib/actions/categories";
import { getActiveProducts } from "@/lib/actions/products";
import type { Product } from "@/lib/types";
import ProductCard, { type ProductCardData } from "@/components/tienda/ProductCard";

type SortOption = "relevance" | "price-asc" | "price-desc" | "newest";

const sortOptions: Record<SortOption, string> = {
  "relevance": "Relevancia",
  "price-asc": "Precio: menor a mayor",
  "price-desc": "Precio: mayor a menor",
  "newest": "Más recientes",
};

/* Icon mapping by slug */
const iconMap: Record<string, any> = {
  "sample-packs": Music,
  "proyectos-fl": Layers,
  "presets": Sliders,
  "drum-kits": Disc3,
  "midi-packs": FileAudio,
};

const colorMap: Record<string, string> = {
  "sample-packs": "#00FFB2",
  "proyectos-fl": "#7B61FF",
  "presets": "#00D4FF",
  "drum-kits": "#FF3CAC",
  "midi-packs": "#FF6B35",
};

function mapProduct(p: Product): ProductCardData {
  return {
    id: p.id,
    name: p.title,
    slug: p.slug,
    category: (p.category as any)?.name || "Sin categoría",
    categorySlug: (p.category as any)?.slug || "",
    price: p.price,
    originalPrice: p.original_price || undefined,
    image: p.feature_image_url || null,
    tags: p.tags || [],
    bpm: p.bpm,
  };
}

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [category, setCategory] = useState<any>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [siblingCategories, setSiblingCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<SortOption>("relevance");
  const [showSort, setShowSort] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);

  useEffect(() => {
    async function load() {
      const [cats, products] = await Promise.all([
        getCategories(),
        getActiveProducts(),
      ]);

      const currentCat = cats.find((c: any) => c.slug === slug);
      if (!currentCat) {
        setLoading(false);
        return;
      }

      setCategory(currentCat);
      setAllProducts(products.filter((p) => p.category_id === currentCat.id));
      setSiblingCategories(cats.filter((c: any) => c.slug !== slug));
      setLoading(false);
    }
    load();
  }, [slug]);

  const filtered = useMemo(() => {
    let result = allProducts.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    switch (sort) {
      case "price-asc":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result = [...result].sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
    }
    return result;
  }, [allProducts, sort, priceRange]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--neon-green)]" />
      </div>
    );
  }

  if (!category) {
    notFound();
  }

  const catColor = colorMap[slug] || "#00FFB2";
  const CatIcon = iconMap[slug] || Package;

  return (
    <main className="relative min-h-screen" style={{ paddingTop: '120px', paddingBottom: '7rem' }}>
      {/* Ambient orb */}
      <div
        className="ambient-orb w-[500px] h-[500px] -top-32 -right-32 animate-pulse-glow"
        style={{
          background: `radial-gradient(circle, ${catColor}22 0%, transparent 70%)`,
        }}
      />

      <div className="section-container">
        {/* Breadcrumbs */}
        <motion.nav
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-text-muted"
          style={{ marginBottom: '3rem' }}
        >
          <Link href="/tienda" className="hover:text-neon-green transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            Tienda
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-text-secondary">{category.name}</span>
        </motion.nav>

        {/* Category Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: '4rem' }}
        >
          <div className="flex items-center gap-4" style={{ marginBottom: '1.5rem' }}>
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{
                background: `${catColor}15`,
                border: `1px solid ${catColor}30`,
              }}
            >
              <CatIcon className="w-7 h-7" style={{ color: catColor }} />
            </div>
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-text-primary">
                {category.name}
              </h1>
            </div>
          </div>
          <p className="text-text-muted text-sm">
            {allProducts.length} producto{allProducts.length !== 1 ? "s" : ""} disponible{allProducts.length !== 1 ? "s" : ""}
          </p>
        </motion.div>

        {/* Sort + Filters bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex flex-wrap items-center gap-4"
          style={{ marginBottom: '4rem' }}
        >
          {/* Sort */}
          <div className="relative">
            <button
              onClick={() => setShowSort(!showSort)}
              className="flex items-center justify-between gap-2 rounded-xl text-sm border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--neon-green)] hover:text-[var(--neon-green)] transition-all bg-[var(--bg-elevated)]"
              style={{ padding: '0.75rem 1.5rem', width: '220px' }}
            >
              <div className="flex items-center gap-2 truncate">
                <SlidersHorizontal className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{sortOptions[sort]}</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform flex-shrink-0 ${showSort ? "rotate-180 text-[var(--neon-green)]" : ""}`} />
            </button>

            <AnimatePresence>
              {showSort && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 top-full mt-2 w-[220px] rounded-xl border border-[var(--border-subtle)] bg-[rgba(10,12,16,0.95)] backdrop-blur-xl z-[60] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
                  style={{ padding: '0.5rem' }}
                >
                  {(Object.keys(sortOptions) as SortOption[]).map((key) => (
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
                      {sortOptions[key]}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Quick-price filters */}
          <div className="flex gap-2 flex-wrap">
            {[
              { label: "Todos", range: [0, 100] as [number, number] },
              { label: "< $20", range: [0, 20] as [number, number] },
              { label: "$20-$30", range: [20, 30] as [number, number] },
              { label: "> $30", range: [30, 100] as [number, number] },
            ].map((opt) => {
              const isActive =
                priceRange[0] === opt.range[0] &&
                priceRange[1] === opt.range[1];
              return (
                <button
                  key={opt.label}
                  onClick={() => setPriceRange(opt.range)}
                  className={`rounded-full text-xs font-medium border transition-all ${isActive
                    ? "border-neon-green/40 text-neon-green bg-neon-green/5"
                    : "border-border-subtle text-text-secondary hover:border-text-muted"
                    }`}
                  style={{ padding: '0.5rem 1.25rem' }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Products Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" style={{ marginBottom: '6rem' }}>
            {filtered.map((product, i) => (
              <ProductCard key={product.id} product={mapProduct(product)} index={i} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <p className="text-text-muted text-lg mb-3">
              No hay productos en este rango de precio.
            </p>
            <button
              onClick={() => setPriceRange([0, 100])}
              className="text-neon-green text-sm hover:underline"
            >
              Mostrar todos
            </button>
          </motion.div>
        )}

        {/* Other Categories */}
        {siblingCategories.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="font-display text-2xl font-bold text-text-primary" style={{ marginBottom: '2.5rem' }}>
              Otras Categorías
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {siblingCategories.map((cat: any) => {
                const SibIcon = iconMap[cat.slug] || Package;
                const sibColor = colorMap[cat.slug] || "#00FFB2";
                return (
                  <Link
                    key={cat.slug}
                    href={`/tienda/categoria/${cat.slug}`}
                    className="glass-card group flex flex-col items-center justify-center hover:border-[rgba(255,255,255,0.1)] transition-all duration-300 z-10 hover:z-20 relative"
                    style={{ padding: '1.75rem 1rem' }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:scale-110"
                      style={{
                        background: `${sibColor}10`,
                        border: `1px solid ${sibColor}25`,
                      }}
                    >
                      <SibIcon className="w-6 h-6" style={{ color: sibColor }} />
                    </div>
                    <span className="text-base font-medium text-text-secondary group-hover:text-text-primary transition-colors">
                      {cat.name}
                    </span>
                    <span className="block text-[13px] text-text-muted mt-2">
                      {cat.product_count || 0} productos
                    </span>
                  </Link>
                );
              })}
            </div>
          </motion.section>
        )}
      </div>
    </main>
  );
}

"use client";

import { useParams, notFound } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Play,
  ShoppingCart,
  Download,
  Music,
  Clock,
  Disc3,
  FileAudio,
  HardDrive,
  ChevronRight,
  ArrowLeft,
  Heart,
  Share2,
  Loader2,
} from "lucide-react";
import { getProductBySlug, getActiveProducts } from "@/lib/actions/products";
import type { Product } from "@/lib/types";
import { useCartStore } from "@/store/useCartStore";
import ProductCard, { type ProductCardData } from "@/components/tienda/ProductCard";
import AudioPlayer from "@/components/tienda/AudioPlayer";

function mapProductToCardData(p: Product): ProductCardData {
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

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    async function load() {
      const p = await getProductBySlug(slug);
      setProduct(p);

      if (p?.category_id) {
        const all = await getActiveProducts();
        setRelated(
          all
            .filter((r) => r.category_id === p.category_id && r.id !== p.id)
            .slice(0, 3)
        );
      }
      setLoading(false);
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--neon-green)]" />
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const categorySlug = (product.category as any)?.slug || "";
  const categoryName = (product.category as any)?.name || "Sin categoría";
  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : null;

  const cardData = mapProductToCardData(product);

  return (
    <main className="relative min-h-screen pb-20 overflow-hidden" style={{ paddingTop: '120px' }}>
      {/* Ambient background */}
      <div className="ambient-orb ambient-orb-green w-[500px] h-[500px] -top-32 -right-32 animate-pulse-glow" />
      <div
        className="ambient-orb ambient-orb-purple w-[400px] h-[400px] top-96 -left-40 animate-pulse-glow"
        style={{ animationDelay: "2s" }}
      />

      <div className="section-container">
        {/* Breadcrumbs */}
        <motion.nav
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-text-muted"
          style={{ marginBottom: '3.5rem' }}
        >
          <Link href="/tienda" className="hover:text-neon-green transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            Tienda
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link
            href={`/tienda/categoria/${categorySlug}`}
            className="hover:text-neon-green transition-colors"
          >
            {categoryName}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-text-secondary">{product.title}</span>
        </motion.nav>

        {/* Hero section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          {/* Product image / visual — 3D rotating showcase */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div
              className="relative aspect-square rounded-2xl overflow-hidden"
              style={{
                perspective: "1200px",
                background: "radial-gradient(ellipse at center bottom, rgba(0,255,178,0.06) 0%, rgba(6,6,12,0.95) 70%)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              {/* 3D rotating inner */}
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  transformStyle: "preserve-3d",
                  animation: isHovering ? "spin-y-slow 4s linear infinite" : "none",
                  transition: !isHovering ? "transform 0.6s ease-out" : undefined,
                }}
              >
                {product.feature_image_url ? (
                  <img
                    src={product.feature_image_url}
                    alt={product.title}
                    className="w-full h-full object-contain"
                    style={{
                      filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.6)) drop-shadow(0 0 60px rgba(0,255,178,0.1))",
                    }}
                  />
                ) : (
                  <div className="w-full h-full rounded-2xl flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${categorySlug === "sample-packs"
                        ? "rgba(0,255,178,0.15), rgba(0,212,255,0.08)"
                        : categorySlug === "presets"
                          ? "rgba(0,212,255,0.15), rgba(123,97,255,0.08)"
                          : categorySlug === "drum-kits"
                            ? "rgba(255,60,172,0.15), rgba(123,97,255,0.08)"
                            : categorySlug === "proyectos-fl"
                              ? "rgba(123,97,255,0.15), rgba(255,60,172,0.08)"
                              : "rgba(255,107,53,0.15), rgba(255,60,172,0.08)"
                        })`,
                      border: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    <div className="flex items-end gap-[3px] h-28 w-[80%]">
                      {Array.from({ length: 50 }).map((_, i) => {
                        const height = 10 + Math.random() * 90;
                        return (
                          <div
                            key={i}
                            className="flex-1 rounded-full"
                            style={{
                              height: `${height}%`,
                              opacity: 0.4,
                              background:
                                categorySlug === "sample-packs"
                                  ? "var(--neon-green)"
                                  : categorySlug === "presets"
                                    ? "var(--neon-blue)"
                                    : categorySlug === "drum-kits"
                                      ? "var(--neon-pink)"
                                      : categorySlug === "proyectos-fl"
                                        ? "var(--neon-purple)"
                                        : "var(--neon-orange)",
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Floor reflection glow */}
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-[2px] rounded-full transition-opacity duration-700"
                style={{
                  opacity: isHovering ? 1 : 0,
                  background: "var(--neon-green)",
                  boxShadow: "0 0 40px 15px rgba(0,255,178,0.15), 0 0 80px 30px rgba(0,255,178,0.05)",
                }}
              />

              {/* Reflection under image */}
              <div
                className="absolute bottom-0 left-0 right-0 h-[30%] pointer-events-none transition-opacity duration-700"
                style={{
                  opacity: isHovering ? 0.3 : 0,
                  background: "linear-gradient(to top, rgba(0,255,178,0.04), transparent)",
                }}
              />

              {/* Play button — hides on hover */}
              <div
                className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none transition-opacity duration-300"
                style={{ opacity: isHovering ? 0 : 1 }}
              >
                <button
                  className="w-20 h-20 rounded-full flex items-center justify-center backdrop-blur-md transition-transform hover:scale-110 pointer-events-auto"
                  style={{
                    background: "rgba(0,0,0,0.5)",
                    border: "2px solid rgba(0,255,178,0.3)",
                    boxShadow: "var(--glow-green)",
                  }}
                >
                  <Play className="w-8 h-8 text-neon-green ml-1" fill="currentColor" />
                </button>
              </div>

              {/* Hover hint */}
              <div
                className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-widest text-[var(--text-muted)] transition-opacity duration-500 z-10"
                style={{ opacity: isHovering ? 0.6 : 0 }}
              >
                ✦ Vista 360° ✦
              </div>

              {/* Discount badge */}
              {discount && (
                <div
                  className="absolute top-5 left-5 rounded-full text-sm font-bold bg-neon-pink text-white z-10"
                  style={{ padding: '0.5rem 1.25rem' }}
                >
                  -{discount}%
                </div>
              )}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col h-full"
          >
            {/* Category badge */}
            <Link
              href={`/tienda/categoria/${categorySlug}`}
              className="text-xs font-semibold uppercase tracking-wider text-neon-green hover:underline w-fit"
              style={{ marginBottom: '1.5rem' }}
            >
              {categoryName}
            </Link>

            <h1
              className="font-display text-3xl md:text-5xl font-bold text-text-primary"
              style={{ marginBottom: '2rem' }}
            >
              {product.title}
            </h1>

            {/* Tags */}
            <div className="flex flex-wrap gap-2" style={{ marginBottom: '2.5rem' }}>
              {(product.tags || []).map((tag) => (
                <span
                  key={tag}
                  className="text-xs rounded-full border border-border-subtle text-text-secondary"
                  style={{ padding: '0.375rem 1rem' }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Metadata grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4" style={{ marginBottom: '3rem' }}>
              {product.bpm && (
                <div className="glass-card flex flex-col items-center justify-center text-center" style={{ padding: '1rem' }}>
                  <Clock className="w-6 h-6 text-neon-green mb-2 drop-shadow-[0_0_8px_rgba(0,255,178,0.5)]" />
                  <div className="text-xs text-text-muted mb-0.5">BPM</div>
                  <div className="text-sm font-bold text-text-primary">{product.bpm}</div>
                </div>
              )}
              {product.key && (
                <div className="glass-card flex flex-col items-center justify-center text-center" style={{ padding: '1rem' }}>
                  <Music className="w-6 h-6 text-neon-blue mb-2 drop-shadow-[0_0_8px_rgba(0,212,255,0.5)]" />
                  <div className="text-xs text-text-muted mb-0.5">Key</div>
                  <div className="text-sm font-bold text-text-primary">{product.key}</div>
                </div>
              )}
              <div className="glass-card flex flex-col items-center justify-center text-center" style={{ padding: '1rem' }}>
                <FileAudio className="w-6 h-6 text-neon-purple mb-2 drop-shadow-[0_0_8px_rgba(123,97,255,0.5)]" />
                <div className="text-xs text-text-muted mb-0.5">Formato</div>
                <div className="text-sm font-bold text-text-primary">WAV / MP3</div>
              </div>
              <div className="glass-card flex flex-col items-center justify-center text-center col-span-2 sm:col-span-1" style={{ padding: '1rem' }}>
                <Disc3 className="w-6 h-6 text-neon-orange mb-2 drop-shadow-[0_0_8px_rgba(255,107,53,0.5)]" />
                <div className="text-xs text-text-muted mb-0.5">Compatible</div>
                <div className="text-sm font-bold text-text-primary">Todos los DAWs</div>
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <p
                className="text-text-secondary text-base leading-relaxed"
                style={{ marginBottom: '3.5rem' }}
              >
                {product.description}
              </p>
            )}

            {/* Price + CTA */}
            <div className="mt-auto">
              <div className="flex items-baseline gap-3" style={{ marginBottom: '2.5rem' }}>
                <span className="font-display text-3xl font-bold text-text-primary">
                  ${product.price.toFixed(2)}
                </span>
                {product.original_price && (
                  <span className="text-lg text-text-muted line-through">
                    ${product.original_price.toFixed(2)}
                  </span>
                )}
                {discount && (
                  <span className="text-sm font-semibold text-neon-pink">
                    Ahorrás ${(product.original_price! - product.price).toFixed(2)}
                  </span>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    addItem(cardData);
                    openCart();
                  }}
                  className="btn-neon flex-1 flex items-center justify-center gap-2 text-base py-3.5"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Agregar al Carrito
                </button>
                <button
                  className="rounded-xl border border-border-subtle text-text-muted hover:text-neon-pink hover:border-neon-pink/30 transition-all"
                  style={{ padding: '1.25rem' }}
                >
                  <Heart className="w-5 h-5" />
                </button>
                <button
                  className="rounded-xl border border-border-subtle text-text-muted hover:text-neon-blue hover:border-neon-blue/30 transition-all"
                  style={{ padding: '1.25rem' }}
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Audio demo player */}
        {product.audio_demo_url && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ marginBottom: '6rem' }}
          >
            <h2 className="font-display text-2xl font-bold text-text-primary" style={{ marginBottom: '2.5rem' }}>
              Preview
            </h2>
            <AudioPlayer src={product.audio_demo_url} title={product.title} />
          </motion.section>
        )}

        {/* Related Products */}
        {related.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between" style={{ marginBottom: '2.5rem' }}>
              <h2 className="font-display text-2xl font-bold text-text-primary">
                Productos Relacionados
              </h2>
              <Link
                href={`/tienda/categoria/${categorySlug}`}
                className="text-sm text-neon-green hover:underline flex items-center gap-1"
              >
                Ver todos
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={mapProductToCardData(p)} index={i} />
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </main>
  );
}

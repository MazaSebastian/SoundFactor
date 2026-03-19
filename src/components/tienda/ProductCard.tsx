"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Play, ShoppingCart, Tag } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";

export interface ProductCardData {
  id: string;
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  price: number;
  originalPrice?: number;
  image?: string | null;
  tags: string[];
  bpm?: number | null;
}

interface ProductCardProps {
  product: ProductCardData;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="h-full"
    >
      <CardContainer className="inter-var w-full h-full">
        <CardBody className="glass-card relative group/card w-full h-full rounded-2xl flex flex-col border border-white/[0.05] bg-bg-elevated hover:shadow-2xl hover:shadow-[var(--neon-green)]/[0.1] transition-shadow duration-300">
          <Link href={`/tienda/${product.slug}`} className="block h-full w-full flex flex-col">
            <div className="relative aspect-[4/5] overflow-hidden rounded-t-2xl w-full">
              {/* Gradient placeholder or real image */}
              {product.image ? (
                <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover z-0" />
              ) : (
                <div
                  className="absolute inset-0 z-0"
                  style={{
                    background: `linear-gradient(135deg, ${product.categorySlug === "sample-packs"
                      ? "rgba(0,255,178,0.15), rgba(0,212,255,0.08)"
                      : product.categorySlug === "presets"
                        ? "rgba(0,212,255,0.15), rgba(123,97,255,0.08)"
                        : product.categorySlug === "drum-kits"
                          ? "rgba(255,60,172,0.15), rgba(123,97,255,0.08)"
                          : product.categorySlug === "proyectos-fl"
                            ? "rgba(123,97,255,0.15), rgba(255,60,172,0.08)"
                            : "rgba(255,107,53,0.15), rgba(255,60,172,0.08)"
                      })`,
                  }}
                />
              )}

              {/* Waveform visual placeholder */}
              {!product.image && (
                <CardItem translateZ="60" className="absolute inset-0 flex items-center justify-center px-6 w-full h-full pointer-events-none">
                  <div className="w-full flex items-center gap-[2px] h-12">
                    {Array.from({ length: 40 }).map((_, i) => {
                      const height = 15 + Math.random() * 85;
                      return (
                        <div
                          key={i}
                          className="flex-1 rounded-full opacity-30 group-hover/card:opacity-80 transition-opacity duration-300"
                          style={{
                            height: `${height}%`,
                            background:
                              product.categorySlug === "sample-packs"
                                ? "var(--neon-green)"
                                : product.categorySlug === "presets"
                                  ? "var(--neon-blue)"
                                  : product.categorySlug === "drum-kits"
                                    ? "var(--neon-pink)"
                                    : product.categorySlug === "proyectos-fl"
                                      ? "var(--neon-purple)"
                                      : "var(--neon-orange)",
                          }}
                        />
                      );
                    })}
                  </div>
                </CardItem>
              )}


              {/* Discount badge */}
              {discount && (
                <CardItem translateZ="100" className="absolute top-3 left-3 rounded-full text-xs font-bold bg-neon-pink text-white z-10 pointer-events-none" style={{ padding: '0.375rem 0.875rem' }}>
                  -{discount}%
                </CardItem>
              )}

              {/* Category badge */}
              <CardItem translateZ="40" className="absolute top-3 right-3 rounded-full text-[10px] font-semibold uppercase tracking-wider backdrop-blur-sm pointer-events-none" style={{
                background: "rgba(18,18,42,0.7)",
                border: "1px solid var(--border-subtle)",
                color: "var(--text-secondary)",
                padding: '0.375rem 0.875rem'
              }}>
                {product.category}
              </CardItem>
            </div>

            {/* Info */}
            <div className="flex flex-col flex-1" style={{ padding: '1.75rem' }}>
              <CardItem translateZ="50" as="h3" className="font-display font-semibold text-text-primary text-[15px] leading-tight group-hover/card:text-neon-green transition-colors" style={{ marginBottom: '1rem' }}>
                {product.name}
              </CardItem>

              {/* Tags */}
              <CardItem translateZ="30" className="flex flex-wrap gap-1.5 pointer-events-none w-full" style={{ marginBottom: '1.25rem' }}>
                {product.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-medium uppercase tracking-wider rounded-full pointer-events-auto"
                    style={{
                      padding: '0.25rem 0.75rem',
                      background: "rgba(255,255,255,0.04)",
                      color: "var(--text-muted)",
                      border: "1px solid var(--border-subtle)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
                {product.bpm && (
                  <span
                    className="text-[10px] font-medium rounded-full pointer-events-auto"
                    style={{
                      padding: '0.25rem 0.75rem',
                      background: "rgba(0,255,178,0.06)",
                      color: "var(--neon-green)",
                      border: "1px solid rgba(0,255,178,0.15)",
                    }}
                  >
                    {product.bpm} BPM
                  </span>
                )}
              </CardItem>

              {/* Price + Cart */}
              <CardItem translateZ="40" className="mt-auto flex items-center justify-between pointer-events-auto w-full">
                <div className="flex items-baseline gap-2 pointer-events-none">
                  <span className="text-lg font-bold text-text-primary">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-text-muted line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    addItem(product);
                    openCart();
                  }}
                  className="p-2 rounded-lg transition-all hover:bg-neon-green/10 hover:text-neon-green text-text-muted relative z-20 pointer-events-auto"
                  aria-label="Agregar al carrito"
                >
                  <ShoppingCart className="w-4.5 h-4.5" />
                </button>
              </CardItem>
            </div>
          </Link>
        </CardBody>
      </CardContainer>
    </motion.div>
  );
}

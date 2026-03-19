"use client";

import { useEffect, useState } from "react";
import { useSettingsStore } from "@/store/useSettingsStore";
import GradientText from "@/components/GradientText";
import AnimatedContent from "@/components/AnimatedContent";
import CountUp from "@/components/CountUp";
import TiltedCard from "@/components/TiltedCard";
import { ChromaGrid, ChromaGridItem } from "@/components/ChromaGrid";
import TopProductsCarousel from "@/components/tienda/TopProductsCarousel";
import { FocusCards } from "@/components/ui/focus-cards";
import { getCategories } from "@/lib/actions/categories";
import { getFeaturedProducts } from "@/lib/actions/products";
import type { Category, Product } from "@/lib/types";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Headphones,
  Music2,
  Layers,
  Disc3,
  LayoutTemplate,
  Play,
  Zap,
  Download,
  Shield,
  Package,
  type LucideIcon,
} from "lucide-react";

/* ========================================
   ICON MAP — Maps category icon names to components
   ======================================== */
const iconMap: Record<string, LucideIcon> = {
  headphones: Headphones,
  music2: Music2,
  layers: Layers,
  disc3: Disc3,
  layouttemplate: LayoutTemplate,
  package: Package,
  play: Play,
  zap: Zap,
  download: Download,
};

const colorMap: Record<number, { color: string; glow: string }> = {
  0: { color: "var(--neon-green)", glow: "var(--glow-green)" },
  1: { color: "var(--neon-purple)", glow: "var(--glow-purple)" },
  2: { color: "var(--neon-blue)", glow: "var(--glow-blue)" },
  3: { color: "var(--neon-pink)", glow: "var(--glow-pink)" },
  4: { color: "var(--neon-orange)", glow: "0 0 20px rgba(255,107,53,0.3)" },
};

function getIconForCategory(cat: Category): LucideIcon {
  if (cat.icon) {
    const key = cat.icon.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (iconMap[key]) return iconMap[key];
  }
  return Package;
}

const stats = [
  { value: 500, suffix: "+", label: "Samples" },
  { value: 50, suffix: "+", label: "Packs" },
  { value: 2000, suffix: "+", label: "Productores", separator: "," },
  { value: 100, suffix: "%", label: "Libres de Regalías" },
];

/* ========================================
   COMPONENTS
   ======================================== */

function HeroSection() {
  const settings = useSettingsStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const displaySettings = mounted ? settings : {
    badgeText: "Nueva colección disponible",
    titleLine1Part1: "Sonidos que ",
    titleLine1Part2: "inspiran",
    titleLine2Part1: "tu próximo ",
    titleLine2Part2: "hit",
    subtitle: "Sample packs, proyectos FL Studio, presets, drum kits y templates\nde calidad profesional. Listos para usar en tu DAW.",
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-x-clip">
      {/* Ambient orbs */}
      <div className="ambient-orb ambient-orb-green w-[500px] h-[500px] -top-20 -right-20 animate-pulse-glow" />
      <div className="ambient-orb ambient-orb-purple w-[400px] h-[400px] bottom-20 -left-40 animate-pulse-glow" style={{ animationDelay: "2s" }} />
      <div className="ambient-orb ambient-orb-pink w-[300px] h-[300px] top-1/2 left-1/2 animate-pulse-glow" style={{ animationDelay: "4s" }} />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "linear-gradient(to bottom, black 40%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 40%, transparent 100%)",
        }}
      />

      <motion.div style={{ textAlign: 'center', paddingTop: '6rem' }} className="section-container relative z-10">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center"
          style={{ marginBottom: '4rem' }}
        >
          <Link href="/" className="inline-flex items-center gap-5 group pointer-events-auto transition-all duration-300 transform hover:scale-105">
            <div className="relative w-16 h-16 flex items-center justify-center overflow-hidden rounded-2xl bg-[rgba(255,255,255,0.03)] border border-[var(--border-subtle)] group-hover:border-[var(--neon-green)] transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover:shadow-[var(--glow-green)]">
              <div className="absolute inset-0 bg-gradient-to-br from-[rgba(0,255,178,0.1)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div
                className="w-10 h-10 z-10"
                style={{
                  maskImage: "url('/logoneon.png')",
                  maskSize: "contain",
                  maskRepeat: "no-repeat",
                  maskPosition: "center",
                  WebkitMaskImage: "url('/logoneon.png')",
                  WebkitMaskSize: "contain",
                  WebkitMaskRepeat: "no-repeat",
                  WebkitMaskPosition: "center",
                  backgroundColor: "var(--neon-green)"
                }}
              />
            </div>
            <span className="text-4xl sm:text-5xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
              <span className="text-[var(--text-primary)]">Sound</span>
              <span className="text-[var(--neon-green)]">Factory</span>
            </span>
          </Link>
        </motion.div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center rounded-full bg-[rgba(0,255,178,0.06)] border border-[rgba(0,255,178,0.12)]"
          style={{ padding: '0.85rem 2.25rem', gap: '0.75rem' }}
        >
          <Zap className="w-4 h-4 text-[var(--neon-green)]" />
          <span className="text-sm text-[var(--neon-green)] font-medium">
            {displaySettings.badgeText}
          </span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight flex flex-col items-center"
          style={{ fontFamily: "var(--font-space-grotesk)", lineHeight: 1.1, marginTop: '2.5rem', marginBottom: '2.5rem' }}
        >
          <div className="flex flex-wrap justify-center items-center gap-x-4">
            <span className="text-[var(--text-primary)]">{displaySettings.titleLine1Part1}</span>
            <GradientText
              colors={["#5227FF", "#FF9FFC", "#B19EEF", "#5227FF"]}
              animationSpeed={2.5}
              showBorder={false}
              className="pb-2"
            >
              {displaySettings.titleLine1Part2}
            </GradientText>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-x-4 mt-2 md:mt-4">
            <span className="text-[var(--text-primary)]">{displaySettings.titleLine2Part1}</span>
            <GradientText
              colors={["#ff6b35", "#ffaa00", "#ff4d4d", "#ff6b35"]}
              animationSpeed={2.5}
              showBorder={false}
              className="pb-2"
            >
              {displaySettings.titleLine2Part2}
            </GradientText>
          </div>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap"
          style={{ maxWidth: '42rem', margin: '0 auto 3.5rem auto' }}
        >
          {displaySettings.subtitle}
        </motion.p>
      </motion.div>

      {/* CTAs (Moved out of fading wrapper for clickability & persistence) */}
      <AnimatedContent
        distance={100}
        direction="vertical"
        reverse={false}
        duration={0.8}
        ease="power3.out"
        initialOpacity={0}
        animateOpacity
        scale={1}
        threshold={0.1}
        delay={0.4}
      >
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-50 pointer-events-auto section-container"
        >
          <Link href="/tienda" className="btn-neon text-base group" style={{ padding: '1rem 2.5rem' }}>
            Explorar tienda
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
          <button className="btn-neon-outline text-base">
            <Play className="w-4 h-4" />
            Escuchar demos
          </button>
        </div>
      </AnimatedContent>
    </section>
  );
}

function StatsSection() {
  return (
    <section className="relative" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4"
          style={{ gap: '3rem', maxWidth: '56rem', marginLeft: 'auto', marginRight: 'auto' }}
        >
          {stats.map((stat, i) => (
            <div key={stat.label} className="text-center">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-3xl md:text-4xl font-bold gradient-text mb-2 flex items-center justify-center"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                <CountUp
                  from={0}
                  to={stat.value}
                  separator={stat.separator || ""}
                  direction="up"
                  duration={1.5}
                  startWhen={true}
                />
                <span>{stat.suffix}</span>
              </motion.div>
              <div className="text-sm text-[var(--text-muted)]">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function CategoriesSection({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;

  const catItems = categories.map((c, i) => {
    const colors = colorMap[i % 5];
    return { ...c, color: c.color || colors.color, glow: colors.glow, Icon: getIconForCategory(c) };
  });

  return (
    <section className="relative" style={{ paddingTop: '8rem', paddingBottom: '8rem' }}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '5rem' }}
        >
          <h2
            className="text-3xl md:text-5xl font-bold"
            style={{ fontFamily: "var(--font-space-grotesk)", marginBottom: '1.25rem' }}
          >
            Explorá por{" "}
            <span className="gradient-text">categoría</span>
          </h2>
          <p className="text-[var(--text-secondary)] text-lg" style={{ maxWidth: '32rem', margin: '0 auto' }}>
            Encontrá exactamente lo que necesitás para tu producción
          </p>
        </motion.div>

        <ChromaGrid
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
          items={catItems.map(c => ({
            ...c,
            id: c.slug,
            borderColor: c.color,
            gradient: `linear-gradient(145deg, ${c.color}15, transparent)`,
            url: `/tienda/categoria/${c.slug}`
          }))}
          radius={300}
          damping={0.45}
          fadeOut={0.6}
          ease="power3.out"
          renderItem={(cat: any, i: number) => {
            const CatIcon = cat.Icon;
            return (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="w-full h-full"
              >
                <TiltedCard
                  containerHeight="100%"
                  containerWidth="100%"
                  imageHeight="100%"
                  imageWidth="100%"
                  rotateAmplitude={12}
                  scaleOnHover={1.05}
                  showTooltip={false}
                  showMobileWarning={false}
                  displayOverlayContent={false}
                  className="w-full h-full"
                >
                  <div
                    className="group flex flex-col items-center justify-center w-full h-full border-0"
                    style={{ padding: '2.5rem 1rem', textAlign: 'center' }}
                  >
                    <div
                      className="w-16 h-16 mx-auto mb-5 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                      style={{
                        background: `${cat.color}15`,
                        border: `1px solid ${cat.color}20`,
                        boxShadow: `0 0 20px ${cat.color}20`
                      }}
                    >
                      <CatIcon className="w-6 h-6" style={{ color: cat.color }} />
                    </div>
                    <h3 className="font-semibold text-[var(--text-primary)] mb-2 group-hover:text-white transition-colors duration-300">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-[var(--text-muted)]">
                      {(cat as any).product_count || 0} productos
                    </p>
                  </div>
                </TiltedCard>
              </motion.div>
            );
          }}
        />
      </div>
    </section>
  );
}

function FeaturedProductsSection({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  // Map Supabase product shape to what TopProductsCarousel expects
  const carouselProducts = products.map(p => ({
    id: p.id,
    name: p.title,
    slug: p.slug,
    category: (p.category as any)?.name || "Sin categoría",
    price: p.price,
    originalPrice: p.original_price || undefined,
    image: p.feature_image_url || null,
    tags: p.tags || [],
    bpm: p.bpm || null,
  }));

  return (
    <section className="relative" style={{ paddingTop: '8rem', paddingBottom: '8rem' }}>
      <div className="ambient-orb ambient-orb-purple w-[600px] h-[600px] top-1/2 -right-60 animate-pulse-glow" />
      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <h2
            className="text-3xl md:text-5xl font-bold"
            style={{ fontFamily: "var(--font-space-grotesk)", marginBottom: '1.25rem' }}
          >
            Productos{" "}
            <span className="gradient-text-warm">destacados</span>
          </h2>
          <p className="text-[var(--text-secondary)] text-lg" style={{ maxWidth: '32rem', margin: '0 auto' }}>
            Los más elegidos por nuestra comunidad
          </p>
        </motion.div>
        <TopProductsCarousel products={carouselProducts as any} />
        <div className="mt-12 text-center md:hidden">
          <Link href="/tienda" className="btn-neon-outline">
            Ver todos los productos
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function WhyUsSection() {
  const features = [
    {
      icon: Headphones,
      title: "Calidad Profesional",
      desc: "Sonidos grabados y procesados con equipamiento de alta gama. WAV 24-bit.",
    },
    {
      icon: Download,
      title: "Descarga Inmediata",
      desc: "Accedé a tus archivos instantáneamente después de confirmar tu compra.",
    },
    {
      icon: Shield,
      title: "100% Libres de Regalías",
      desc: "Usá nuestros sonidos en cualquier proyecto comercial sin restricciones.",
    },
    {
      icon: Zap,
      title: "Listos para tu DAW",
      desc: "Compatible con FL Studio, Ableton, Logic Pro y cualquier DAW moderno.",
    },
  ];

  return (
    <section className="relative" style={{ paddingTop: '8rem', paddingBottom: '8rem' }}>
      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '5rem' }}
        >
          <h2
            className="text-3xl md:text-5xl font-bold"
            style={{ fontFamily: "var(--font-space-grotesk)", marginBottom: '1.25rem' }}
          >
            ¿Por qué{" "}
            <span className="gradient-text">SoundFactory</span>?
          </h2>
          <p className="text-[var(--text-secondary)] text-lg" style={{ maxWidth: '32rem', margin: '0 auto' }}>
            Todo lo que necesitás para producir, en un solo lugar
          </p>
        </motion.div>

        <FocusCards features={features} />
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="relative" style={{ paddingTop: '8rem', paddingBottom: '8rem' }}>
      {/* Background effects */}
      <div className="ambient-orb ambient-orb-green w-[500px] h-[500px] left-1/4 animate-pulse-glow" style={{ top: '-250px' }} />
      <div className="ambient-orb ambient-orb-pink w-[400px] h-[400px] bottom-0 right-1/4 animate-pulse-glow" style={{ animationDelay: "2s" }} />

      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="glass-card"
          style={{
            border: "1px solid rgba(0, 255, 178, 0.1)",
            maxWidth: '56rem',
            margin: '0 auto',
            padding: '5rem 3rem',
            textAlign: 'center',
          }}
        >
          <h2
            className="text-3xl md:text-5xl font-bold"
            style={{ fontFamily: "var(--font-space-grotesk)", marginBottom: '1.5rem' }}
          >
            ¿Listo para <span className="gradient-text">producir</span>?
          </h2>
          <p className="text-[var(--text-secondary)] text-lg leading-relaxed" style={{ maxWidth: '32rem', margin: '0 auto 3rem auto' }}>
            Explorá nuestra colección de sonidos profesionales y empezá a crear
            tu próximo hitazo.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4" style={{ justifyContent: 'center' }}>
            <Link href="/tienda" className="btn-neon text-base group" style={{ padding: '1rem 2.5rem' }}>
              Ir a la tienda
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            <Link href="/contacto" className="btn-neon-outline text-base">
              Contactanos
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ========================================
   PAGE
   ======================================== */

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featured, setFeatured] = useState<Product[]>([]);

  useEffect(() => {
    getCategories().then(setCategories).catch(() => { });
    getFeaturedProducts().then(setFeatured).catch(() => { });
  }, []);

  return (
    <>
      <HeroSection />
      <StatsSection />
      <CategoriesSection categories={categories} />
      <FeaturedProductsSection products={featured} />
      <WhyUsSection />
      <CTASection />
    </>
  );
}

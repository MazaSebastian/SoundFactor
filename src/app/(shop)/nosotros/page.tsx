"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Music,
  Headphones,
  Zap,
  Shield,
  Globe,
  Heart,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { stats, testimonials } from "@/lib/mock-data";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

const values = [
  {
    icon: Headphones,
    title: "Calidad Profesional",
    desc: "Cada sample es grabado, procesado y curado con estándares de estudio AAA.",
    color: "var(--neon-green)",
    glow: "var(--glow-green)",
  },
  {
    icon: Shield,
    title: "100% Royalty-Free",
    desc: "Usá nuestros sonidos en tus producciones comerciales sin restricciones.",
    color: "var(--neon-blue)",
    glow: "var(--glow-blue)",
  },
  {
    icon: Zap,
    title: "Descarga Instantánea",
    desc: "Comprá y descargá en segundos. Sin esperas, directo a tu DAW.",
    color: "var(--neon-pink)",
    glow: "var(--glow-pink)",
  },
  {
    icon: Globe,
    title: "Comunidad Latina",
    desc: "Creado por productores latinos, para productores de todo el mundo.",
    color: "var(--neon-purple)",
    glow: "var(--glow-purple)",
  },
];

const team = [
  {
    name: "Carlos M.",
    role: "Fundador & Sound Designer",
    bio: "10+ años produciendo para artistas independientes y sellos discográficos. Especializado en urban, latin y electronic.",
  },
  {
    name: "María L.",
    role: "Audio Engineer",
    bio: "Ingeniera de mezcla y mastering con experiencia en estudios de Buenos Aires y CDMX. Procesa cada sample del catálogo.",
  },
  {
    name: "Diego R.",
    role: "Desarrollador & UX",
    bio: "Construye la plataforma y garantiza que comprar samples sea tan rápido como arrastrarlos al DAW.",
  },
];

export default function NosotrosPage() {
  return (
    <main className="min-h-screen pt-28 pb-20">
      {/* Ambient */}
      <div className="ambient-orb ambient-orb-green w-[600px] h-[600px] -top-40 left-1/2 -translate-x-1/2 animate-pulse-glow" />

      <div className="section-container">
        {/* Hero */}
        <motion.section
          initial="hidden"
          animate="visible"
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <motion.div
            variants={fadeUp}
            custom={0}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border-subtle text-xs text-neon-green font-semibold mb-6"
          >
            <Sparkles className="w-3.5 h-3.5" />
            NUESTRA HISTORIA
          </motion.div>

          <motion.h1
            variants={fadeUp}
            custom={1}
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-6 leading-tight"
          >
            Sonidos que
            <span className="text-neon-green"> inspiran</span> tu próximo hit
          </motion.h1>

          <motion.p
            variants={fadeUp}
            custom={2}
            className="text-text-secondary text-base md:text-lg leading-relaxed"
          >
            SoundFactory nació de la necesidad de tener samples de calidad
            profesional, diseñados desde Latinoamérica para productores de
            todo el mundo. Creemos que el talento no debería limitarse por
            la falta de herramientas.
          </motion.p>
        </motion.section>

        {/* Stats */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              custom={i}
              className="glass-card p-6 text-center"
            >
              <div className="font-display text-3xl font-bold text-neon-green mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-text-secondary">{stat.label}</div>
            </motion.div>
          ))}
        </motion.section>

        {/* Values */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="mb-20"
        >
          <motion.h2
            variants={fadeUp}
            custom={0}
            className="font-display text-2xl md:text-3xl font-bold text-text-primary text-center mb-10"
          >
            ¿Por qué <span className="text-neon-green">SoundFactory</span>?
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div
                  key={v.title}
                  variants={fadeUp}
                  custom={i + 1}
                  className="glass-card p-6 group"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                    style={{
                      background: `${v.color}12`,
                      border: `1px solid ${v.color}30`,
                    }}
                  >
                    <Icon className="w-6 h-6" style={{ color: v.color }} />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-text-primary mb-2">
                    {v.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {v.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Team */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="mb-20"
        >
          <motion.h2
            variants={fadeUp}
            custom={0}
            className="font-display text-2xl md:text-3xl font-bold text-text-primary text-center mb-10"
          >
            El equipo
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                variants={fadeUp}
                custom={i + 1}
                className="glass-card p-6"
              >
                {/* Avatar placeholder */}
                <div className="w-16 h-16 rounded-full bg-bg-elevated flex items-center justify-center mb-4 border border-border-subtle">
                  <span className="text-xl font-bold text-neon-green">
                    {member.name.charAt(0)}
                  </span>
                </div>
                <h3 className="font-display text-lg font-semibold text-text-primary">
                  {member.name}
                </h3>
                <p className="text-xs text-neon-green font-semibold uppercase tracking-wider mb-3">
                  {member.role}
                </p>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {member.bio}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Testimonials */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="mb-20"
        >
          <motion.h2
            variants={fadeUp}
            custom={0}
            className="font-display text-2xl md:text-3xl font-bold text-text-primary text-center mb-10"
          >
            Lo que dicen los productores
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                variants={fadeUp}
                custom={i + 1}
                className="glass-card p-6"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <span key={s} className="text-neon-green text-sm">
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-sm text-text-secondary leading-relaxed mb-4 italic">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div>
                  <span className="text-sm font-semibold text-text-primary block">
                    {t.name}
                  </span>
                  <span className="text-xs text-text-muted">{t.role}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div
            variants={fadeUp}
            custom={0}
            className="glass-card p-10 md:p-14 text-center relative overflow-hidden"
          >
            <div className="ambient-orb ambient-orb-green w-[300px] h-[300px] -top-20 -right-20 animate-pulse-glow" />
            <div className="relative z-10">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-text-primary mb-4">
                ¿Listo para elevar tus producciones?
              </h2>
              <p className="text-text-secondary mb-8 max-w-md mx-auto">
                Explorá nuestro catálogo de sonidos profesionales y encontrá lo
                que tu próximo track necesita.
              </p>
              <Link
                href="/tienda"
                className="btn-neon inline-flex items-center gap-2"
              >
                Explorar Tienda
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </motion.section>
      </div>
    </main>
  );
}

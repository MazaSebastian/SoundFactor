"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Search,
  HelpCircle,
  ArrowRight,
  MessageCircle,
} from "lucide-react";
import { faqSections } from "@/lib/mock-data";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

function AccordionItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-border-subtle last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-start justify-between gap-4 py-5 px-1 text-left group"
      >
        <span
          className={`text-sm md:text-base font-medium transition-colors duration-200 ${
            isOpen ? "text-neon-green" : "text-text-primary group-hover:text-neon-green"
          }`}
        >
          {question}
        </span>
        <ChevronDown
          className={`w-5 h-5 flex-shrink-0 mt-0.5 transition-transform duration-300 ${
            isOpen ? "rotate-180 text-neon-green" : "text-text-muted"
          }`}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="text-sm text-text-secondary leading-relaxed pb-5 px-1">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQPage() {
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  /* Flatten all items with a unique ID for open/close */
  const allItems = faqSections.flatMap((section, si) =>
    section.items.map((item, qi) => ({
      ...item,
      section: section.title,
      id: `${si}-${qi}`,
    }))
  );

  /* Filter by search */
  const filtered = search.trim()
    ? allItems.filter(
        (item) =>
          item.question.toLowerCase().includes(search.toLowerCase()) ||
          item.answer.toLowerCase().includes(search.toLowerCase())
      )
    : null; // null = show sections view

  return (
    <main className="min-h-screen pt-28 pb-20">
      {/* Ambient */}
      <div className="ambient-orb ambient-orb-purple w-[500px] h-[500px] -top-32 -right-32 animate-pulse-glow" />

      <div className="section-container max-w-3xl mx-auto">
        {/* Header */}
        <motion.section
          initial="hidden"
          animate="visible"
          className="text-center mb-12"
        >
          <motion.div
            variants={fadeUp}
            custom={0}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border-subtle text-xs text-neon-purple font-semibold mb-6"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            PREGUNTAS FRECUENTES
          </motion.div>

          <motion.h1
            variants={fadeUp}
            custom={1}
            className="font-display text-4xl md:text-5xl font-bold text-text-primary mb-4"
          >
            ¿Tenés dudas?
          </motion.h1>

          <motion.p
            variants={fadeUp}
            custom={2}
            className="text-text-secondary text-base md:text-lg mb-8"
          >
            Encontrá respuestas rápidas sobre pagos, descargas, licencias y
            compatibilidad.
          </motion.p>

          {/* Search */}
          <motion.div
            variants={fadeUp}
            custom={3}
            className="relative max-w-md mx-auto"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar preguntas..."
              className="w-full bg-bg-elevated border border-border-subtle rounded-xl pl-11 pr-4 py-3 text-sm text-text-primary outline-none focus:border-neon-purple/40 transition-colors placeholder:text-text-muted"
            />
          </motion.div>
        </motion.section>

        {/* Content */}
        {filtered !== null ? (
          /* Search results */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card overflow-hidden"
          >
            {filtered.length > 0 ? (
              <div className="divide-y divide-border-subtle px-5">
                {filtered.map((item) => (
                  <AccordionItem
                    key={item.id}
                    question={item.question}
                    answer={item.answer}
                    isOpen={openId === item.id}
                    onToggle={() =>
                      setOpenId(openId === item.id ? null : item.id)
                    }
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 px-5">
                <p className="text-text-muted text-sm mb-2">
                  No encontramos resultados para &ldquo;{search}&rdquo;
                </p>
                <Link
                  href="/contacto"
                  className="text-neon-green text-sm hover:underline inline-flex items-center gap-1"
                >
                  Contactanos directamente
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </motion.div>
        ) : (
          /* Sections view */
          <div className="space-y-8">
            {faqSections.map((section, si) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + si * 0.1 }}
              >
                <h2 className="font-display text-lg font-bold text-text-primary mb-3 px-1">
                  {section.title}
                </h2>
                <div className="glass-card overflow-hidden px-5">
                  {section.items.map((item, qi) => {
                    const id = `${si}-${qi}`;
                    return (
                      <AccordionItem
                        key={id}
                        question={item.question}
                        answer={item.answer}
                        isOpen={openId === id}
                        onToggle={() =>
                          setOpenId(openId === id ? null : id)
                        }
                      />
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-8 md:p-10 text-center mt-14 relative overflow-hidden"
        >
          <div className="ambient-orb ambient-orb-green w-[200px] h-[200px] -top-10 -right-10 animate-pulse-glow" />
          <div className="relative z-10">
            <MessageCircle className="w-10 h-10 text-neon-green mx-auto mb-4" />
            <h3 className="font-display text-xl font-bold text-text-primary mb-2">
              ¿No encontraste tu respuesta?
            </h3>
            <p className="text-text-secondary text-sm mb-6 max-w-sm mx-auto">
              Escribinos y te respondemos en menos de 24 horas.
            </p>
            <Link
              href="/contacto"
              className="btn-neon inline-flex items-center gap-2"
            >
              Contactar Soporte
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

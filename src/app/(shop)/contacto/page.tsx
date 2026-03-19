"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Send,
  MapPin,
  Clock,
  MessageCircle,
  Instagram,
  Youtube,
  Music,
  CheckCircle2,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "hola@soundfactory.com",
    color: "var(--neon-green)",
  },
  {
    icon: MapPin,
    label: "Ubicación",
    value: "Buenos Aires, Argentina",
    color: "var(--neon-blue)",
  },
  {
    icon: Clock,
    label: "Respuesta",
    value: "Menos de 24hs",
    color: "var(--neon-purple)",
  },
  {
    icon: MessageCircle,
    label: "Soporte",
    value: "Lun a Vie, 10-18h (ART)",
    color: "var(--neon-pink)",
  },
];

const socials = [
  { icon: Instagram, label: "Instagram", href: "#", color: "var(--neon-pink)" },
  { icon: Youtube, label: "YouTube", href: "#", color: "var(--neon-green)" },
  { icon: Music, label: "TikTok", href: "#", color: "var(--neon-blue)" },
];

const topics = [
  "Consulta general",
  "Problema con descarga",
  "Propuesta de colaboración",
  "Reporte de bug",
  "Soporte técnico",
  "Otro",
];

export default function ContactoPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    topic: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: integrate with API
    setSent(true);
  };

  return (
    <main className="min-h-screen pt-28 pb-20">
      {/* Ambient */}
      <div className="ambient-orb ambient-orb-blue w-[500px] h-[500px] -top-32 -right-32 animate-pulse-glow" />
      <div
        className="ambient-orb ambient-orb-purple w-[400px] h-[400px] top-[50%] -left-40 animate-pulse-glow"
        style={{ animationDelay: "2s" }}
      />

      <div className="section-container">
        {/* Header */}
        <motion.section
          initial="hidden"
          animate="visible"
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <motion.h1
            variants={fadeUp}
            custom={0}
            className="font-display text-4xl md:text-5xl font-bold text-text-primary mb-4"
          >
            Hablemos<span className="text-neon-green">.</span>
          </motion.h1>
          <motion.p
            variants={fadeUp}
            custom={1}
            className="text-text-secondary text-base md:text-lg"
          >
            ¿Tenés una pregunta, sugerencia o querés colaborar? Nos encanta
            escuchar a la comunidad.
          </motion.p>
        </motion.section>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-16">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="glass-card p-6 md:p-8">
              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16"
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                    style={{
                      background: "rgba(0,255,178,0.1)",
                      border: "1px solid rgba(0,255,178,0.3)",
                    }}
                  >
                    <CheckCircle2 className="w-8 h-8 text-neon-green" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-text-primary mb-2">
                    ¡Mensaje enviado!
                  </h3>
                  <p className="text-text-secondary text-sm mb-6">
                    Te respondemos en menos de 24 horas.
                  </p>
                  <button
                    onClick={() => {
                      setSent(false);
                      setForm({ name: "", email: "", topic: "", message: "" });
                    }}
                    className="text-neon-green text-sm hover:underline"
                  >
                    Enviar otro mensaje
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Name */}
                    <div>
                      <label className="block text-sm text-text-secondary mb-1.5">
                        Nombre
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                        className="w-full bg-bg-elevated border border-border-subtle rounded-xl px-4 py-3 text-sm text-text-primary outline-none focus:border-neon-green/40 transition-colors placeholder:text-text-muted"
                        placeholder="Tu nombre"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm text-text-secondary mb-1.5">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                        className="w-full bg-bg-elevated border border-border-subtle rounded-xl px-4 py-3 text-sm text-text-primary outline-none focus:border-neon-green/40 transition-colors placeholder:text-text-muted"
                        placeholder="tu@email.com"
                      />
                    </div>
                  </div>

                  {/* Topic */}
                  <div>
                    <label className="block text-sm text-text-secondary mb-1.5">
                      Asunto
                    </label>
                    <select
                      required
                      value={form.topic}
                      onChange={(e) =>
                        setForm({ ...form, topic: e.target.value })
                      }
                      className="w-full bg-bg-elevated border border-border-subtle rounded-xl px-4 py-3 text-sm text-text-primary outline-none focus:border-neon-green/40 transition-colors cursor-pointer"
                    >
                      <option value="" disabled>
                        Seleccioná un tema
                      </option>
                      {topics.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm text-text-secondary mb-1.5">
                      Mensaje
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) =>
                        setForm({ ...form, message: e.target.value })
                      }
                      className="w-full bg-bg-elevated border border-border-subtle rounded-xl px-4 py-3 text-sm text-text-primary outline-none focus:border-neon-green/40 transition-colors placeholder:text-text-muted resize-none"
                      placeholder="Contanos en qué podemos ayudarte..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-neon w-full flex items-center justify-center gap-2 py-3.5 text-base"
                  >
                    <Send className="w-4 h-4" />
                    Enviar Mensaje
                  </button>
                </form>
              )}
            </div>
          </motion.div>

          {/* Sidebar Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-2 space-y-4"
          >
            {/* Contact cards */}
            {contactInfo.map((info) => {
              const Icon = info.icon;
              return (
                <div key={info.label} className="glass-card p-5 flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      background: `${info.color}12`,
                      border: `1px solid ${info.color}25`,
                    }}
                  >
                    <Icon className="w-5 h-5" style={{ color: info.color }} />
                  </div>
                  <div>
                    <span className="text-xs text-text-muted uppercase tracking-wider block mb-0.5">
                      {info.label}
                    </span>
                    <span className="text-sm text-text-primary font-medium">
                      {info.value}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Socials */}
            <div className="glass-card p-5">
              <span className="text-xs text-text-muted uppercase tracking-wider block mb-3">
                Seguinos
              </span>
              <div className="flex gap-3">
                {socials.map((s) => {
                  const Icon = s.icon;
                  return (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                      style={{
                        background: `${s.color}12`,
                        border: `1px solid ${s.color}25`,
                      }}
                    >
                      <Icon className="w-5 h-5" style={{ color: s.color }} />
                    </a>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}

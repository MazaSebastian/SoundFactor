import Link from "next/link";
import { Music, Instagram, Youtube, Twitter } from "lucide-react";

const footerLinks = {
  productos: [
    { label: "Sample Packs", href: "/tienda/categoria/sample-packs" },
    { label: "Proyectos FL Studio", href: "/tienda/categoria/proyectos-fl" },
    { label: "Presets", href: "/tienda/categoria/presets" },
    { label: "Drum Kits", href: "/tienda/categoria/drum-kits" },
    { label: "Templates", href: "/tienda/categoria/templates" },
  ],
  info: [
    { label: "Sobre nosotros", href: "/nosotros" },
    { label: "Preguntas frecuentes", href: "/faq" },
    { label: "Contacto", href: "/contacto" },
    { label: "Términos y condiciones", href: "/terminos" },
    { label: "Política de privacidad", href: "/privacidad" },
  ],
  social: [
    { label: "Instagram", href: "#", icon: Instagram },
    { label: "YouTube", href: "#", icon: Youtube },
    { label: "Twitter", href: "#", icon: Twitter },
  ],
};

export function Footer() {
  return (
    <footer className="relative border-t border-[var(--border-subtle)]" style={{ marginTop: '8rem' }}>
      {/* Glow accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-[var(--neon-green)] to-transparent opacity-40" />

      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          paddingTop: '5rem',
          paddingBottom: '5rem',
          paddingLeft: '2.5rem',
          paddingRight: '2.5rem',
        }}
      >
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
          style={{ gap: '4rem' }}
        >
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2" style={{ marginBottom: '1.5rem' }}>
              <div className="w-9 h-9 rounded-lg bg-[var(--neon-green)] flex items-center justify-center">
                <div
                  className="w-5 h-5 bg-[var(--bg-primary)]"
                  style={{
                    maskImage: "url('/logoneon.png')",
                    maskSize: "contain",
                    maskRepeat: "no-repeat",
                    maskPosition: "center",
                    WebkitMaskImage: "url('/logoneon.png')",
                    WebkitMaskSize: "contain",
                    WebkitMaskRepeat: "no-repeat",
                    WebkitMaskPosition: "center",
                  }}
                />
              </div>
              <span
                className="text-lg font-bold tracking-tight"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                <span className="text-[var(--text-primary)]">Sound</span>
                <span className="text-[var(--neon-green)]">Factory</span>
              </span>
            </Link>
            <p
              className="text-sm text-[var(--text-secondary)] leading-relaxed"
              style={{ marginBottom: '2rem', maxWidth: '20rem' }}
            >
              Sonidos profesionales para llevar tu producción musical al
              siguiente nivel. Sample packs, presets y más.
            </p>

            {/* Social */}
            <div className="flex items-center" style={{ gap: '0.75rem' }}>
              {footerLinks.social.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--neon-green)] hover:bg-[rgba(0,255,178,0.08)] border border-[var(--border-subtle)] hover:border-[var(--border-neon)] transition-all duration-300"
                    aria-label={social.label}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Productos */}
          <div>
            <h3
              className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider"
              style={{ fontFamily: "var(--font-space-grotesk)", marginBottom: '1.5rem' }}
            >
              Productos
            </h3>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {footerLinks.productos.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--text-secondary)] hover:text-[var(--neon-green)] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3
              className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider"
              style={{ fontFamily: "var(--font-space-grotesk)", marginBottom: '1.5rem' }}
            >
              Información
            </h3>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {footerLinks.info.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--text-secondary)] hover:text-[var(--neon-green)] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3
              className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider"
              style={{ fontFamily: "var(--font-space-grotesk)", marginBottom: '1.5rem' }}
            >
              Newsletter
            </h3>
            <p className="text-sm text-[var(--text-secondary)]" style={{ marginBottom: '1.5rem' }}>
              Recibí las novedades y descuentos exclusivos.
            </p>
            <form className="flex" style={{ gap: '0.5rem' }}>
              <input
                type="email"
                placeholder="tu@email.com"
                className="input-neon flex-1 text-sm"
              />
              <button type="submit" className="btn-neon !px-4 !py-2 text-xs">
                Unirme
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div
          className="flex flex-col md:flex-row items-center justify-between"
          style={{
            marginTop: '4rem',
            paddingTop: '2rem',
            borderTop: '1px solid var(--border-subtle)',
            gap: '1rem',
          }}
        >
          <p className="text-xs text-[var(--text-muted)]">
            © {new Date().getFullYear()} SoundFactory. Todos los derechos
            reservados.
          </p>
          <div className="flex items-center" style={{ gap: '1rem' }}>
            <span className="text-xs text-[var(--text-muted)] flex items-center" style={{ gap: '0.375rem' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--neon-green)] animate-pulse" />
              Hecho con pasión para productores
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

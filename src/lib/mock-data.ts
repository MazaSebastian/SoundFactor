import {
  Headphones,
  Music2,
  Layers,
  Disc3,
  LayoutTemplate,
  type LucideIcon,
} from "lucide-react";

/* ============================================
   TYPES
   ============================================ */

export interface Category {
  name: string;
  slug: string;
  icon: LucideIcon;
  count: number;
  color: string;
  glow: string;
  description: string;
}

export interface ProductPreview {
  name: string;
  duration: string; // e.g. "0:32"
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  price: number;
  originalPrice?: number;
  image: string | null;
  tags: string[];
  genres: string[];
  bpm: number | null;
  key: string | null;
  fileCount: number;
  fileSize: string;
  dawCompatibility: string[];
  description: string;
  isFeatured: boolean;
  previews: ProductPreview[];
  createdAt: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface FAQSection {
  title: string;
  items: FAQ[];
}

export interface Testimonial {
  name: string;
  role: string;
  text: string;
  avatar: string | null;
}

/* ============================================
   CATEGORIES
   ============================================ */

export const categories: Category[] = [
  {
    name: "Sample Packs",
    slug: "sample-packs",
    icon: Headphones,
    count: 24,
    color: "var(--neon-green)",
    glow: "var(--glow-green)",
    description: "Loops, one-shots y texturas para cualquier género.",
  },
  {
    name: "Proyectos FL",
    slug: "proyectos-fl",
    icon: Music2,
    count: 18,
    color: "var(--neon-purple)",
    glow: "var(--glow-purple)",
    description: "Proyectos completos listos para estudiar y remixar.",
  },
  {
    name: "Presets",
    slug: "presets",
    icon: Layers,
    count: 32,
    color: "var(--neon-blue)",
    glow: "var(--glow-blue)",
    description: "Sonidos listos para Serum, Vital, Omnisphere y más.",
  },
  {
    name: "Drum Kits",
    slug: "drum-kits",
    icon: Disc3,
    count: 15,
    color: "var(--neon-pink)",
    glow: "var(--glow-pink)",
    description: "Kicks, snares, hi-hats y percusión de alta calidad.",
  },
  {
    name: "Templates",
    slug: "templates",
    icon: LayoutTemplate,
    count: 12,
    color: "var(--neon-orange)",
    glow: "0 0 20px rgba(255,107,53,0.3)",
    description: "Estructuras de tracks completos para acelerar tu workflow.",
  },
];

/* ============================================
   PRODUCTS
   ============================================ */

export const products: Product[] = [
  {
    id: "1",
    name: "Urban Elements Vol. 1",
    slug: "urban-elements-vol-1",
    category: "Sample Packs",
    categorySlug: "sample-packs",
    price: 29.99,
    originalPrice: 49.99,
    image: null,
    tags: ["Trap", "Hip-Hop"],
    genres: ["Trap", "Hip-Hop", "Urban"],
    bpm: 140,
    key: "Cm",
    fileCount: 120,
    fileSize: "450 MB",
    dawCompatibility: ["Any DAW"],
    description:
      "Más de 120 samples urbanos: 808s, hi-hats, melodías, FX y texturas. Grabados y procesados con equipo analógico premium. Cada sample está etiquetado con BPM y tonalidad para integración instantánea en tu proyecto.",
    isFeatured: true,
    previews: [
      { name: "Melody Loop - Dark Trap", duration: "0:28" },
      { name: "808 Pattern - Heavy", duration: "0:15" },
      { name: "Hi-Hat Roll - Fast", duration: "0:12" },
      { name: "Ambient Texture - Cinematic", duration: "0:35" },
      { name: "FX Riser - Neon", duration: "0:08" },
    ],
    createdAt: "2025-12-01",
  },
  {
    id: "2",
    name: "Neon Synths Collection",
    slug: "neon-synths-collection",
    category: "Presets",
    categorySlug: "presets",
    price: 19.99,
    image: null,
    tags: ["Synth", "Pop"],
    genres: ["Future Bass", "Pop", "Electronic"],
    bpm: null,
    key: null,
    fileCount: 64,
    fileSize: "85 MB",
    dawCompatibility: ["Serum", "Vital"],
    description:
      "64 presets de sintetizador diseñados para producciones modernas. Leads cristalinos, pads atmosféricos, basslines contundentes y plucks melódicos. Compatibles con Serum y Vital.",
    isFeatured: true,
    previews: [
      { name: "Lead - Crystal Wave", duration: "0:20" },
      { name: "Pad - Midnight Glow", duration: "0:30" },
      { name: "Bass - SubWoofer", duration: "0:15" },
      { name: "Pluck - Stardust", duration: "0:18" },
    ],
    createdAt: "2025-11-15",
  },
  {
    id: "3",
    name: "808 Madness Kit",
    slug: "808-madness-kit",
    category: "Drum Kits",
    categorySlug: "drum-kits",
    price: 14.99,
    image: null,
    tags: ["808", "Trap"],
    genres: ["Trap", "Drill", "Hip-Hop"],
    bpm: null,
    key: null,
    fileCount: 200,
    fileSize: "320 MB",
    dawCompatibility: ["Any DAW"],
    description:
      "200 drums one-shot: 50 kicks (808, distorted, acoustic), 40 snares, 35 hi-hats, 25 claps, 20 percs, 15 FX y 15 open hats. Procesados para cortar en cualquier mezcla.",
    isFeatured: true,
    previews: [
      { name: "808 - Earthquake", duration: "0:10" },
      { name: "Snare - Crack", duration: "0:05" },
      { name: "Hi-Hat - Metallic Roll", duration: "0:12" },
      { name: "Perc - Tribal Hit", duration: "0:06" },
    ],
    createdAt: "2025-10-20",
  },
  {
    id: "4",
    name: "Reggaetón Starter FLP",
    slug: "reggaeton-starter-flp",
    category: "Proyectos FL",
    categorySlug: "proyectos-fl",
    price: 24.99,
    originalPrice: 39.99,
    image: null,
    tags: ["Reggaetón", "Latin"],
    genres: ["Reggaetón", "Latin", "Dancehall"],
    bpm: 95,
    key: "Dm",
    fileCount: 1,
    fileSize: "180 MB",
    dawCompatibility: ["FL Studio 21+"],
    description:
      "Proyecto completo de reggaetón en FL Studio 21. Incluye todas las pistas separadas, mezcla profesional, y guía de estructura. Ideal para estudiar técnicas de producción latin.",
    isFeatured: true,
    previews: [
      { name: "Full Mix Preview", duration: "1:05" },
      { name: "Instrumental Only", duration: "0:45" },
      { name: "Dembow Pattern", duration: "0:20" },
    ],
    createdAt: "2025-11-01",
  },
  {
    id: "5",
    name: "Lo-Fi Dreams Pack",
    slug: "lofi-dreams-pack",
    category: "Sample Packs",
    categorySlug: "sample-packs",
    price: 17.99,
    image: null,
    tags: ["Lo-Fi", "Chill"],
    genres: ["Lo-Fi", "Chill", "Ambient"],
    bpm: 85,
    key: "Eb",
    fileCount: 80,
    fileSize: "290 MB",
    dawCompatibility: ["Any DAW"],
    description:
      "80 samples lo-fi con carácter analógico: piano loops con vinyl crackle, guitar licks jazzy, pads warm, e instrumentos procesados con cinta. Perfectos para beats chill y study music.",
    isFeatured: true,
    previews: [
      { name: "Piano Loop - Rainy Day", duration: "0:30" },
      { name: "Guitar - Jazz Lick", duration: "0:22" },
      { name: "Pad - Warm Tape", duration: "0:28" },
    ],
    createdAt: "2026-01-10",
  },
  {
    id: "6",
    name: "Perreo Template Pack",
    slug: "perreo-template-pack",
    category: "Templates",
    categorySlug: "templates",
    price: 34.99,
    image: null,
    tags: ["Reggaetón", "Template"],
    genres: ["Reggaetón", "Perreo", "Latin"],
    bpm: 100,
    key: "Am",
    fileCount: 5,
    fileSize: "650 MB",
    dawCompatibility: ["FL Studio 21+", "Ableton 11+"],
    description:
      "5 templates completos de perreo/reggaetón con mezcla y master profesional. Cada template incluye estructura completa, presets customizados y cadenas de procesamiento explicadas.",
    isFeatured: false,
    previews: [
      { name: "Template 1 - Full Mix", duration: "0:55" },
      { name: "Template 2 - Full Mix", duration: "1:02" },
      { name: "Template 3 - Full Mix", duration: "0:48" },
    ],
    createdAt: "2026-02-01",
  },
  {
    id: "7",
    name: "Cinematic Textures Vol. 2",
    slug: "cinematic-textures-vol-2",
    category: "Sample Packs",
    categorySlug: "sample-packs",
    price: 39.99,
    originalPrice: 59.99,
    image: null,
    tags: ["Cinematic", "Ambient"],
    genres: ["Cinematic", "Film Score", "Ambient"],
    bpm: null,
    key: null,
    fileCount: 95,
    fileSize: "780 MB",
    dawCompatibility: ["Any DAW"],
    description:
      "95 texturas cinematográficas: drones, risers, impacts, pads orquestales y ambientes diseñados para trailers, scoring y producción épica. Calidad broadcast 24bit/96kHz.",
    isFeatured: false,
    previews: [
      { name: "Drone - Deep Space", duration: "0:40" },
      { name: "Impact - Thunder Hit", duration: "0:08" },
      { name: "Riser - Tension Build", duration: "0:25" },
      { name: "Pad - Orchestral Swell", duration: "0:35" },
    ],
    createdAt: "2026-01-25",
  },
  {
    id: "8",
    name: "Drill UK Essentials",
    slug: "drill-uk-essentials",
    category: "Drum Kits",
    categorySlug: "drum-kits",
    price: 12.99,
    image: null,
    tags: ["Drill", "UK"],
    genres: ["Drill", "Grime", "UK Rap"],
    bpm: null,
    key: null,
    fileCount: 150,
    fileSize: "210 MB",
    dawCompatibility: ["Any DAW"],
    description:
      "150 drums diseñados para producción drill: 808s agresivos con glide, snares crujientes, hi-hats rápidos con swing, y percs únicas. El kit definitivo para drill UK y NY.",
    isFeatured: false,
    previews: [
      { name: "808 - Slide Bass", duration: "0:12" },
      { name: "Snare - Tight Crack", duration: "0:05" },
      { name: "Hi-Hat - Triplet Flow", duration: "0:10" },
    ],
    createdAt: "2025-12-15",
  },
  {
    id: "9",
    name: "Vocal Chops Toolkit",
    slug: "vocal-chops-toolkit",
    category: "Sample Packs",
    categorySlug: "sample-packs",
    price: 22.99,
    image: null,
    tags: ["Vocals", "Chops"],
    genres: ["Pop", "EDM", "Future Bass"],
    bpm: null,
    key: null,
    fileCount: 180,
    fileSize: "520 MB",
    dawCompatibility: ["Any DAW"],
    description:
      "180 vocal chops, ad-libs y frases procesadas. Incluye vocals limpios + versiones con reverb, delay y vocoder. Organizados por tonalidad y BPM.",
    isFeatured: false,
    previews: [
      { name: "Chop - Ethereal Female", duration: "0:15" },
      { name: "Ad-lib - Hey Yeah", duration: "0:08" },
      { name: "Phrase - Vocoded", duration: "0:20" },
    ],
    createdAt: "2026-02-10",
  },
  {
    id: "10",
    name: "Future Bass Serum Pack",
    slug: "future-bass-serum-pack",
    category: "Presets",
    categorySlug: "presets",
    price: 24.99,
    originalPrice: 34.99,
    image: null,
    tags: ["Future Bass", "Serum"],
    genres: ["Future Bass", "EDM", "Pop"],
    bpm: null,
    key: null,
    fileCount: 80,
    fileSize: "120 MB",
    dawCompatibility: ["Serum"],
    description:
      "80 presets Serum inspirados en Flume, Marshmello y The Chainsmokers. Supersaws masivos, wobble basses, plucks brillantes y pads etéreos con macros personalizados.",
    isFeatured: false,
    previews: [
      { name: "Supersaw - Festival", duration: "0:18" },
      { name: "Wobble - Liquid", duration: "0:14" },
      { name: "Pluck - Bright Stars", duration: "0:12" },
    ],
    createdAt: "2026-01-05",
  },
  {
    id: "11",
    name: "Trap Orchestra FLP",
    slug: "trap-orchestra-flp",
    category: "Proyectos FL",
    categorySlug: "proyectos-fl",
    price: 29.99,
    image: null,
    tags: ["Trap", "Orchestral"],
    genres: ["Trap", "Orchestral", "Cinematic"],
    bpm: 135,
    key: "Gm",
    fileCount: 1,
    fileSize: "250 MB",
    dawCompatibility: ["FL Studio 21+"],
    description:
      "Proyecto que fusiona trap duro con orquestación cinematográfica. Strings, brass, 808s y hi-hats en un mix profesional. Aprende a mezclar géneros urbanos con música clásica.",
    isFeatured: false,
    previews: [
      { name: "Full Mix - Orchestral Trap", duration: "1:15" },
      { name: "Strings Only", duration: "0:30" },
    ],
    createdAt: "2026-02-20",
  },
  {
    id: "12",
    name: "Latin Guitar Loops",
    slug: "latin-guitar-loops",
    category: "Sample Packs",
    categorySlug: "sample-packs",
    price: 19.99,
    image: null,
    tags: ["Guitar", "Latin"],
    genres: ["Reggaetón", "Latin Pop", "Bachata"],
    bpm: 95,
    key: null,
    fileCount: 60,
    fileSize: "380 MB",
    dawCompatibility: ["Any DAW"],
    description:
      "60 loops de guitarra latina grabados por músicos profesionales. Nylon, acoustic, electric — con variaciones de BPM y tonalidad. Ideales para reggaetón, bachata y latin pop.",
    isFeatured: false,
    previews: [
      { name: "Nylon - Romantic", duration: "0:25" },
      { name: "Electric - Reggaeton Riff", duration: "0:18" },
      { name: "Acoustic - Bachata", duration: "0:22" },
    ],
    createdAt: "2026-03-01",
  },
];

/* ============================================
   HELPERS
   ============================================ */

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.categorySlug === categorySlug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.isFeatured);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getAllGenres(): string[] {
  const genresSet = new Set<string>();
  products.forEach((p) => p.genres.forEach((g) => genresSet.add(g)));
  return Array.from(genresSet).sort();
}

export function getAllKeys(): string[] {
  const keysSet = new Set<string>();
  products.forEach((p) => {
    if (p.key) keysSet.add(p.key);
  });
  return Array.from(keysSet).sort();
}

/* ============================================
   STATS
   ============================================ */

export const stats = [
  { value: "500+", label: "Samples" },
  { value: "50+", label: "Packs" },
  { value: "2K+", label: "Productores" },
  { value: "100%", label: "Libres de Regalías" },
];

/* ============================================
   TESTIMONIALS
   ============================================ */

export const testimonials: Testimonial[] = [
  {
    name: "Matías R.",
    role: "Productor - Buenos Aires",
    text: "Los sample packs de SampleFactory tienen una calidad que no encontré en ningún otro lado. Los uso en todas mis producciones.",
    avatar: null,
  },
  {
    name: "Valentina L.",
    role: "Beatmaker - CDMX",
    text: "Los presets de Serum son increíbles. Me ahorraron horas de diseño de sonido y suenan profesionales desde el primer momento.",
    avatar: null,
  },
  {
    name: "Santiago D.",
    role: "Productor Musical - Medellín",
    text: "El proyecto de FL Studio me enseñó más de producción que cualquier curso. Poder ver toda la cadena de procesamiento es invaluable.",
    avatar: null,
  },
];

/* ============================================
   FAQ SECTIONS
   ============================================ */

export const faqSections: FAQSection[] = [
  {
    title: "Compras y Pagos",
    items: [
      {
        question: "¿Qué métodos de pago aceptan?",
        answer:
          "Aceptamos tarjetas de crédito/débito a través de Stripe, PayPal y MercadoPago. En Latinoamérica, MercadoPago permite pagar con transferencia bancaria y medios locales.",
      },
      {
        question: "¿Puedo pagar en cuotas?",
        answer:
          "Sí, a través de MercadoPago podés pagar en hasta 12 cuotas dependiendo de tu banco y país.",
      },
      {
        question: "¿Ofrecen reembolsos?",
        answer:
          "Por la naturaleza digital de nuestros productos, no ofrecemos reembolsos una vez descargados. Sin embargo, si tenés algún problema técnico con un producto, contactanos y lo resolvemos.",
      },
    ],
  },
  {
    title: "Descargas y Archivos",
    items: [
      {
        question: "¿Cómo descargo mis productos después de la compra?",
        answer:
          "Después de completar la compra, recibirás un email con el link de descarga. También podés acceder desde tu cuenta en la sección 'Mis Compras'. Los links son válidos por 30 días.",
      },
      {
        question: "¿En qué formato están los archivos?",
        answer:
          "Los samples y drum kits están en WAV 24-bit/44.1kHz. Los presets incluyen el archivo nativo del sintetizador (.fxp para Serum, .vital para Vital). Los proyectos están en formato nativo de FL Studio (.flp).",
      },
      {
        question: "¿Cuántas veces puedo descargar un producto?",
        answer:
          "Podés descargar cada producto hasta 5 veces. Si necesitás más descargas, contactanos desde tu cuenta.",
      },
    ],
  },
  {
    title: "Licencias y Uso",
    items: [
      {
        question: "¿Los samples son libres de regalías?",
        answer:
          "Sí, todos nuestros samples y loops son 100% libres de regalías (royalty-free). Podés usarlos en tus producciones comerciales sin pagar regalías adicionales.",
      },
      {
        question: "¿Puedo revender o redistribuir los samples?",
        answer:
          "No. La licencia te permite usar los samples en tus producciones musicales, pero no redistribuirlos como samples individuales ni incluirlos en otros sample packs.",
      },
      {
        question: "¿Puedo usar los samples en música que publique en Spotify?",
        answer:
          "¡Absolutamente! Podés usar nuestros samples en cualquier plataforma de streaming, YouTube, y cualquier distribución comercial sin restricciones.",
      },
    ],
  },
  {
    title: "Compatibilidad",
    items: [
      {
        question: "¿Los samples son compatibles con mi DAW?",
        answer:
          "Los samples en formato WAV son compatibles con todos los DAWs: FL Studio, Ableton Live, Logic Pro, Pro Tools, Cubase, Studio One, Reaper, etc. Los presets requieren el sintetizador indicado.",
      },
      {
        question: "¿Los proyectos de FL Studio funcionan en Mac?",
        answer:
          "Sí, FL Studio está disponible para Mac y Windows. Los proyectos son compatibles con FL Studio 21 o superior en ambas plataformas.",
      },
    ],
  },
];

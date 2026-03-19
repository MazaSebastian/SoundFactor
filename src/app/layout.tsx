import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SoundFactory — Samples, Presets & Kits para Productores",
  description:
    "Tu fuente de sample packs, proyectos FL Studio, presets, drum kits y templates de producción musical. Sonidos profesionales para llevar tu música al siguiente nivel.",
  keywords: [
    "sample packs",
    "FL Studio",
    "presets",
    "drum kits",
    "producción musical",
    "beats",
    "loops",
    "one shots",
    "MIDI",
    "templates",
  ],
  openGraph: {
    title: "SoundFactory — Samples, Presets & Kits para Productores",
    description:
      "Tu fuente de sample packs, proyectos FL Studio, presets, drum kits y templates de producción musical.",
    type: "website",
    locale: "es_AR",
  },
};

import { Grainient } from "@/components/ui/grainient";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} antialiased relative`}
      >
        <div className="fixed inset-0 z-[-1] pointer-events-none">
          <Grainient
            color1="#09090b"
            color2="#12122a"
            color3="#003324"
            timeSpeed={0.15}
            warpStrength={1.5}
            grainAmount={0.05}
          />
        </div>
        {children}
      </body>
    </html>
  );
}

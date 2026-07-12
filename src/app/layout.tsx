import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "INstituto Kalapa — Sessões Terapêuticas em Grupo",
  description:
    "Transforme sua jornada de autoconhecimento com sessões terapêuticas em grupo a cada 15 dias. Acolhimento, pertencimento e cura coletiva no INstituto Kalapa.",
  keywords: [
    "terapia em grupo",
    "psicologia",
    "autoconhecimento",
    "INstituto Kalapa",
    "bem-estar",
    "saúde mental",
    "sessão terapêutica",
    "InfinitePay",
  ],
  openGraph: {
    title: "INstituto Kalapa — Sessões Terapêuticas em Grupo",
    description:
      "Acolhimento e transformação em grupo. Participe das sessões quinzenais do INstituto Kalapa.",
    type: "website",
    locale: "pt_BR",
    siteName: "INstituto Kalapa",
  },
  twitter: {
    card: "summary_large_image",
    title: "INstituto Kalapa — Sessões Terapêuticas em Grupo",
    description:
      "Acolhimento e transformação em grupo. Participe das sessões quinzenais do INstituto Kalapa.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#4A4A4A",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Logo fixo no canto superior esquerdo */}
        <div className="fixed top-4 left-4 z-50">
          <a href="/" className="block hover:scale-105 transition-transform duration-300">
            <img
              src="/logo-kalapa-rounded.png"
              alt="INstituto Kalapa"
              className="w-32 h-32 md:w-40 md:h-40 object-contain rounded-2xl shadow-lg bg-white/90 p-1"
            />
          </a>
        </div>
        {children}
      </body>
    </html>
  );
}

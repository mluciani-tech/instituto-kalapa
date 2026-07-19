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
    "constelação familiar",
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
  themeColor: "#F8F4ED",
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
          <a
            href="/"
            aria-label="INstituto Kalapa — voltar para a página inicial"
            className="block rounded-2xl transition-transform duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-terracotta focus-visible:ring-offset-2"
          >
            <img
              src="/logo-kalapa.png"
              alt=""
              width={80}
              height={80}
              className="w-16 h-16 md:w-20 md:h-20 object-contain rounded-2xl bg-white/85 backdrop-blur-md border border-white/60 shadow-lg shadow-brand-purple-deep/15 p-1.5"
            />
          </a>
        </div>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "HealthAndBeautyBusiness",
              name: "INstituto Kalapa",
              description: "Sessões terapêuticas em grupo para autoconhecimento e transformação.",
              url: "https://www.institutokalapa.com.br",
              logo: "https://www.institutokalapa.com.br/logo-kalapa.png",
              sameAs: [],
              priceRange: "$$",
            }),
          }}
        />
      </body>
    </html>
  );
}

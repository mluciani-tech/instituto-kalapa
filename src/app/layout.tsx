import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "./components/Header";

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
        <Header />
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

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
  themeColor: "#282D30",
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
        {children}
      </body>
    </html>
  );
}

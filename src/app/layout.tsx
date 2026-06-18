import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Instituto Kalapa — Sessões Terapêuticas em Grupo",
  description:
    "Transforme sua jornada de autoconhecimento com sessões terapêuticas em grupo a cada 15 dias. Acolhimento, pertencimento e cura coletiva no Instituto Kalapa.",
  keywords: [
    "terapia em grupo",
    "psicologia",
    "autoconhecimento",
    "Instituto Kalapa",
    "bem-estar",
    "saúde mental",
    "sessão terapêutica",
    "InfinitePay",
  ],
  openGraph: {
    title: "Instituto Kalapa — Sessões Terapêuticas em Grupo",
    description:
      "Acolhimento e transformação em grupo. Participe das sessões quinzenais do Instituto Kalapa.",
    type: "website",
    locale: "pt_BR",
    siteName: "Instituto Kalapa",
  },
  twitter: {
    card: "summary_large_image",
    title: "Instituto Kalapa — Sessões Terapêuticas em Grupo",
    description:
      "Acolhimento e transformação em grupo. Participe das sessões quinzenais do Instituto Kalapa.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}

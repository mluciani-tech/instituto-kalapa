import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "./components/Header";
import CartDrawer from "./components/CartDrawer";
import { CartProvider } from "@/context/CartContext";
import { MotionConfig } from "framer-motion";

export const metadata: Metadata = {
  title: "INstituto Kalapa — Vivências Terapêuticas em Grupo",
  description:
    "Transforme sua jornada de autoconhecimento com vivências terapêuticas em grupo. Acolhimento, pertencimento e cura coletiva no INstituto Kalapa.",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
    ],
    shortcut: "/favicon-32x32.png",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "INstituto Kalapa — Vivências Terapêuticas em Grupo",
    description:
      "Acolhimento e transformação em grupo. Participe das vivências do INstituto Kalapa.",
    type: "website",
    locale: "pt_BR",
    siteName: "INstituto Kalapa",
    images: [
      {
        url: "https://www.institutokalapa.com.br/logo-kalapa.png",
        width: 512,
        height: 512,
        alt: "INstituto Kalapa",
      },
    ],
  },
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
  twitter: {
    card: "summary_large_image",
    title: "INstituto Kalapa — Vivências Terapêuticas em Grupo",
    description:
      "Acolhimento e transformação em grupo. Participe das vivências do INstituto Kalapa.",
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
        <MotionConfig reducedMotion="user">
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <CartProvider>
            <Header />
            <CartDrawer />
            {children}
          </CartProvider>
        </MotionConfig>
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

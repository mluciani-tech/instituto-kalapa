import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import CartDrawer from "./components/CartDrawer";
import { CartProvider } from "@/context/CartContext";
import { MotionConfig } from "framer-motion";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-cormorant",
});

export const metadata: Metadata = {
  title: "INstituto Kalapa — Vivências Terapêuticas em Grupo",
  description:
    "Transforme sua jornada de autoconhecimento com vivências terapêuticas em grupo. Acolhimento, pertencimento e cura coletiva no INstituto Kalapa.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png?v=2", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png?v=2", type: "image/png", sizes: "16x16" },
      { url: "/favicon-48x48.png?v=2", type: "image/png", sizes: "48x48" },
    ],
    shortcut: "/favicon.ico?v=2",
    apple: [
      { url: "/apple-touch-icon.png?v=2", sizes: "180x180", type: "image/png" },
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
    <html
      lang="pt-BR"
      className={`h-full antialiased ${inter.variable} ${playfair.variable} ${cormorant.variable}`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <MotionConfig reducedMotion="user">
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

// =============================================================================
// NUPCIAL HUB — Root Layout
// Next.js 14 App Router · Server Component
//
// Responsabilidades:
// 1. Registrar fontes via next/font/google e injetar variáveis CSS globais
// 2. Definir metadata de SEO em português para o mercado de Curitiba
// 3. Garantir estrutura flexbox full-height com <main> flex-grow
// =============================================================================

import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

// ─────────────────────────────────────────────────────────────────────────────
// FONTES
//
// Cormorant Garamond → display (títulos, headings, hero)
//   Serifa de alto contraste que carrega a personalidade da marca.
//   Variável CSS: --font-cormorant
//
// Plus Jakarta Sans → body/UI (parágrafos, botões, labels, inputs)
//   Geométrica moderna com boa legibilidade em tamanhos pequenos.
//   Variável CSS: --font-jakarta
// ─────────────────────────────────────────────────────────────────────────────

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "sans-serif"],
});

// ─────────────────────────────────────────────────────────────────────────────
// SEO — METADATA
//
// Otimizado para ranquear em buscas locais de Curitiba e Região Metropolitana.
// O template "%s | Nupcial Hub" é herdado por todas as páginas filhas.
// ─────────────────────────────────────────────────────────────────────────────

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),

  title: {
    default:
      "Nupcial Hub | O Ecossistema de Inteligência para Eventos — Curitiba e Região",
    template: "%s | Nupcial Hub",
  },

  description:
    "Descubra os melhores espaços para casamentos e eventos em Curitiba e Região Metropolitana. " +
    "Disponibilidade em tempo real, galeria completa de fotos e conexão direta com cerimonialistas. " +
    "Seu evento começa aqui.",

  keywords: [
    "espaço para casamento curitiba",
    "espaço para eventos curitiba",
    "salão de festas curitiba",
    "chácara para casamento curitiba",
    "buffet casamento curitiba",
    "local para casamento região metropolitana curitiba",
    "cerimonialista curitiba",
    "wedding venue curitiba paraná",
    "espaço para festas são josé dos pinhais",
    "chácara para eventos campo largo",
    "espaço eventos araucária",
    "nupcial hub",
  ],

  applicationName: "Nupcial Hub",
  authors: [{ name: "Nupcial Hub", url: APP_URL }],
  creator: "Nupcial Hub",
  publisher: "Nupcial Hub",
  category: "Casamentos & Eventos",

  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Nupcial Hub",
    title: "Nupcial Hub | O Ecossistema de Inteligência para Eventos",
    description:
      "O maior diretório de espaços para casamentos e eventos do Paraná. " +
      "Agenda em tempo real, rede de cerimonialistas e conexão inteligente.",
    url: APP_URL,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Nupcial Hub — Espaços para Casamento em Curitiba",
        type: "image/jpeg",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Nupcial Hub | Ecossistema de Inteligência para Eventos",
    description:
      "Encontre espaços para casamentos em Curitiba com disponibilidade em tempo real.",
    images: ["/og-image.jpg"],
    creator: "@nupcialhub",
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },

  manifest: "/site.webmanifest",

  alternates: {
    canonical: "/",
  },

  other: {
    "google-site-verification": process.env.GOOGLE_SITE_VERIFICATION || "",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0B0B0F" },
    { media: "(prefers-color-scheme: light)", color: "#0B0B0F" },
  ],
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

// ─────────────────────────────────────────────────────────────────────────────
// JSON-LD — Dados Estruturados para Google
//
// Schema.org: WebSite + SearchAction (sitelinks search box) + areaServed
// ─────────────────────────────────────────────────────────────────────────────

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Nupcial Hub",
  alternateName: "Nupcial Hub — Ecossistema de Inteligência para Eventos",
  description:
    "Diretório de espaços para casamentos e eventos em Curitiba e Região Metropolitana do Paraná",
  url: APP_URL,
  inLanguage: "pt-BR",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${APP_URL}/?busca={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
  areaServed: {
    "@type": "City",
    name: "Curitiba",
    containedInPlace: {
      "@type": "State",
      name: "Paraná",
      containedInPlace: {
        "@type": "Country",
        name: "Brasil",
      },
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// ROOT LAYOUT
//
// Estrutura:
//   <html>           ← variáveis de fonte injetadas aqui (global)
//     <body>         ← bg-void, text-ivory, antialiased
//       <a>          ← skip-link acessível
//       <div.flex>   ← wrapper full-height
//         {children} ← páginas filhas (Navbar + main + Footer já dentro)
//       </div>
//       <Toaster />  ← notificações toast
//       <script />   ← JSON-LD (SEO)
//     </body>
//   </html>
// ─────────────────────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${cormorant.variable} ${jakarta.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-void text-ivory font-body antialiased">

        {/* ── Skip to Content (acessibilidade por teclado) ────────────── */}
        <a
          href="#main-content"
          className={[
            "sr-only focus:not-sr-only",
            "focus:fixed focus:top-4 focus:left-4 focus:z-[999]",
            "focus:px-4 focus:py-2",
            "focus:bg-gold-400 focus:text-void",
            "focus:rounded-lg focus:font-semibold focus:text-sm",
            "focus:shadow-gold focus:outline-none",
          ].join(" ")}
        >
          Ir para o conteúdo principal
        </a>

        {/* ── Estrutura Flex Full-Height ──────────────────────────────── */}
        {/*                                                                */}
        {/*  flex flex-col min-h-screen garante:                           */}
        {/*  - Navbar fixa no topo                                         */}
        {/*  - <main> com flex-grow preenche o espaço                      */}
        {/*  - Footer colado no fundo mesmo com pouco conteúdo             */}
        {/*                                                                */}
        <div className="flex flex-col min-h-screen">
          <main id="main-content" className="flex-grow">
            {children}
          </main>
        </div>

        {/* ── Toast Notifications ─────────────────────────────────────── */}
        <Toaster
          position="bottom-right"
          gutter={8}
          containerStyle={{ zIndex: 9999 }}
          toastOptions={{
            className: "toast-dark",
            duration: 4000,
            style: {
              background: "#1E1E26",
              color: "#F0EBE1",
              border: "1px solid #2A2A36",
              fontFamily: "var(--font-jakarta)",
              fontSize: "0.875rem",
              borderRadius: "0.75rem",
              padding: "0.75rem 1rem",
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            },
            success: {
              iconTheme: { primary: "#22C55E", secondary: "#0B0B0F" },
            },
            error: {
              iconTheme: { primary: "#EF4444", secondary: "#0B0B0F" },
            },
          }}
        />

        {/* ── JSON-LD Schema.org (dados estruturados para SEO) ────────── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}

import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      // ─── Paleta de Cores ──────────────────────────────────────────────────
      // Sistema de Design: Dark mode sofisticado + Ouro Antigo como accent
      colors: {
        // ─ Fundos ────────────────────────────────────────────────────────
        void:    "#0B0B0F", // Fundo principal da aplicação
        surface: "#141418", // Cards, painéis, modais
        raised:  "#1E1E26", // Elementos elevados (dropdowns, tooltips)
        rim:     "#2A2A36", // Bordas e divisores

        // ─ Accent — Ouro Antigo ──────────────────────────────────────────
        gold: {
          50:  "#FDF9F0",
          100: "#F9EFD3",
          200: "#F0D999",
          300: "#E6C15C",
          400: "#C4A45A", // ← TOKEN PRINCIPAL
          500: "#A8873A",
          600: "#8C6E2C",
          700: "#6F5520",
          800: "#523D16",
          900: "#35260C",
        },

        // ─ Texto ─────────────────────────────────────────────────────────
        ivory: "#F0EBE1", // Texto principal (máxima legibilidade no dark)
        ash:   "#6E6E80", // Texto secundário / placeholders
        mist:  "#9E9EAE", // Labels, metadados

        // ─ Feedback ─────────────────────────────────────────────────────
        success: "#22C55E",
        warning: "#F59E0B",
        danger:  "#EF4444",
        info:    "#3B82F6",

        // ─ Status de disponibilidade do calendário ───────────────────────
        available: "#16A34A",
        occupied:  "#DC2626",
        pending:   "#D97706",
      },

      // ─── Tipografia ───────────────────────────────────────────────────────
      fontFamily: {
        // Display: Cormorant Garamond — serifa de alto contraste para títulos
        display: ["var(--font-cormorant)", ...fontFamily.serif],
        // Body/UI: Plus Jakarta Sans — geométrica moderna
        sans:    ["var(--font-jakarta)", ...fontFamily.sans],
        // Mono: JetBrains Mono — dados técnicos e código
        mono:    ["var(--font-jetbrains)", ...fontFamily.mono],
      },

      fontSize: {
        // Escala de tipografia customizada para o projeto
        "2xs": ["0.625rem", { lineHeight: "1rem" }],
        xs:    ["0.75rem",  { lineHeight: "1rem" }],
        sm:    ["0.875rem", { lineHeight: "1.25rem" }],
        base:  ["1rem",     { lineHeight: "1.5rem" }],
        lg:    ["1.125rem", { lineHeight: "1.75rem" }],
        xl:    ["1.25rem",  { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem",   { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem",  { lineHeight: "2.5rem" }],
        "5xl": ["3rem",     { lineHeight: "1" }],
        "6xl": ["3.75rem",  { lineHeight: "1" }],
        "7xl": ["4.5rem",   { lineHeight: "1" }],
        "8xl": ["6rem",     { lineHeight: "1" }],
        "9xl": ["8rem",     { lineHeight: "1" }],
        // Títulos heroicos para a landing page
        "hero": ["clamp(3rem, 8vw, 6rem)", { lineHeight: "0.95", letterSpacing: "-0.03em" }],
      },

      // ─── Espaçamento ──────────────────────────────────────────────────────
      spacing: {
        "4.5": "1.125rem",
        "13":  "3.25rem",
        "15":  "3.75rem",
        "18":  "4.5rem",
        "22":  "5.5rem",
        "26":  "6.5rem",
        "30":  "7.5rem",
      },

      // ─── Border Radius ────────────────────────────────────────────────────
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },

      // ─── Sombras ──────────────────────────────────────────────────────────
      boxShadow: {
        // Sombras para dark mode — usam cores escuras sem muito blur
        "card":    "0 1px 3px 0 rgba(0,0,0,0.5), 0 1px 2px -1px rgba(0,0,0,0.5)",
        "card-lg": "0 10px 30px -5px rgba(0,0,0,0.7), 0 4px 15px -3px rgba(0,0,0,0.5)",
        "gold":    "0 0 20px rgba(196,164,90,0.2), 0 0 40px rgba(196,164,90,0.08)",
        "gold-lg": "0 0 40px rgba(196,164,90,0.3), 0 0 80px rgba(196,164,90,0.12)",
        "inner-gold": "inset 0 1px 0 rgba(196,164,90,0.15)",
        // Modal backdrop
        "modal":   "0 25px 50px -12px rgba(0,0,0,0.9)",
      },

      // ─── Animações ────────────────────────────────────────────────────────
      keyframes: {
        // Entrada suave de modais
        "slide-up": {
          "0%":   { opacity: "0", transform: "translateY(24px) scale(0.98)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        // Fade simples
        "fade-in": {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        // Pulso de data ocupada no calendário
        "pulse-occupied": {
          "0%, 100%": { opacity: "1",    transform: "scale(1)" },
          "50%":      { opacity: "0.7",  transform: "scale(0.95)" },
        },
        // Shimmer para skeleton loading
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        // Glow do accent dourado
        "gold-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(196,164,90,0.2)" },
          "50%":      { boxShadow: "0 0 40px rgba(196,164,90,0.4)" },
        },
        // Escala de entrada para cards
        "scale-in": {
          "0%":   { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        // Contador crescente (indicador de lead recém-chegado)
        "count-up": {
          "0%":   { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0%)" },
        },
      },
      animation: {
        "slide-up":       "slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in":        "fade-in 0.3s ease forwards",
        "pulse-occupied": "pulse-occupied 2s ease-in-out infinite",
        shimmer:          "shimmer 2s linear infinite",
        "gold-glow":      "gold-glow 3s ease-in-out infinite",
        "scale-in":       "scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "count-up":       "count-up 0.3s ease forwards",
      },

      // ─── Transições ───────────────────────────────────────────────────────
      transitionTimingFunction: {
        "spring": "cubic-bezier(0.16, 1, 0.3, 1)",
        "ease-out-expo": "cubic-bezier(0.19, 1, 0.22, 1)",
      },

      // ─── Backgrounds ──────────────────────────────────────────────────────
      backgroundImage: {
        // Gradiente sutil para o hero da homepage
        "hero-gradient": "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(196,164,90,0.12) 0%, transparent 70%)",
        // Shimmer para skeleton
        "shimmer-gradient": "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)",
        // Bordas com gradiente dourado
        "gold-border": "linear-gradient(135deg, rgba(196,164,90,0.6) 0%, rgba(196,164,90,0.1) 100%)",
        // Fundo de cards com micro-textura
        "card-texture": "radial-gradient(circle at 100% 0%, rgba(196,164,90,0.03) 0%, transparent 50%)",
        // Noise overlay (desabilitado por padrão, ativar se quiser textura)
        "noise": "url(\"data:image/svg+xml,%3Csvg...%3E%3C/svg%3E\")",
      },

      // ─── Aspect Ratios ───────────────────────────────────────────────────
      aspectRatio: {
        "venue-hero": "16 / 9",
        "venue-card": "4 / 3",
        "venue-thumb": "1 / 1",
        "portrait": "3 / 4",
      },

      // ─── Breakpoints extras ───────────────────────────────────────────────
      screens: {
        xs: "375px",
        "3xl": "1920px",
      },

      // ─── Grid ─────────────────────────────────────────────────────────────
      gridTemplateColumns: {
        // Grid assimétrico para galeria de fotos
        "venue-gallery": "2fr 1fr 1fr",
        "venue-gallery-sm": "1fr 1fr",
        // Grid do dashboard de leads
        "leads": "repeat(auto-fill, minmax(340px, 1fr))",
      },

      // ─── Z-Index ──────────────────────────────────────────────────────────
      zIndex: {
        "navbar":  "100",
        "modal":   "200",
        "toast":   "300",
        "overlay": "150",
      },
    },
  },

  plugins: [
    require("@tailwindcss/forms")({
      strategy: "class",
    }),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
  ],
};

export default config;

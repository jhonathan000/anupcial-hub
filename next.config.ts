import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ─── Otimização de Imagens ────────────────────────────────────────────────
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // Uploads do usuário (ex: Supabase Storage ou S3)
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      // CDN própria futura
      {
        protocol: "https",
        hostname: "cdn.nupcialhub.com.br",
      },
      // Placeholder para desenvolvimento
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
    // Tamanhos para grid assimétrico e cards
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512],
  },

  // ─── Cabeçalhos de Segurança ──────────────────────────────────────────────
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options",    value: "nosniff" },
          { key: "X-Frame-Options",           value: "DENY" },
          { key: "X-XSS-Protection",          value: "1; mode=block" },
          { key: "Referrer-Policy",           value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self)",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
      // Cache agressivo para assets estáticos
      {
        source: "/_next/static/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },

  // ─── Redirects ────────────────────────────────────────────────────────────
  async redirects() {
    return [
      {
        source: "/espacos",
        destination: "/",
        permanent: false,
      },
    ];
  },

  // ─── Configurações de Compilação ─────────────────────────────────────────
  experimental: {
    // Melhora a performance de Server Components
    serverComponentsExternalPackages: ["@prisma/client", "bcryptjs", "node-ical"],
  },

  // ─── Variáveis de ambiente expostas ao cliente ───────────────────────────
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    NEXT_PUBLIC_APP_NAME: "Nupcial Hub",
  },

  // ─── Compressão e performance ────────────────────────────────────────────
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;

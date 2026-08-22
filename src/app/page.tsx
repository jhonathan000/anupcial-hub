// =============================================================================
// NUPCIAL HUB — Landing Page (B2C)
// Fachada pública para noivos buscarem espaços em Curitiba e RM.
//
// Seções:
//   1. Navbar (sticky, glass)
//   2. HeroSection (título heroico + métricas)
//   3. SearchFilters (barra de busca flutuante com dropdowns)
//   4. Grid assimétrico de espaços em destaque (VenueCard)
//   5. Seção "Como Funciona" (proposta de valor disruptiva)
//   6. CTA final
//   7. Footer
// =============================================================================

import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/home/HeroSection";
import SearchFilters from "@/components/home/SearchFilters";
import VenueCard from "@/components/venue/VenueCard";
import Footer from "@/components/layout/Footer";
import HowItWorksSection from "./HowItWorksSection";
import FinalCTA from "./FinalCTA";
import type { VenueCardData } from "@/types";

// ─── SEO ────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Nupcial Hub | O Ecossistema de Inteligência para Eventos — Curitiba",
  description:
    "Descubra os melhores espaços para casamentos e eventos em Curitiba e Região " +
    "Metropolitana. Disponibilidade em tempo real, fotos em alta resolução e " +
    "conexão direta com cerimonialistas verificados.",
  alternates: { canonical: "/" },
};

// ─── Dados Mockados (serão substituídos por fetch do banco) ─────────────────

const FEATURED_VENUES: VenueCardData[] = [
  {
    id: "1",
    slug: "villa-toscana-santa-felicidade",
    name: "Villa Toscana",
    type: "VILLA",
    neighborhood: "Santa Felicidade",
    city: "Curitiba",
    state: "PR",
    minCapacity: 80,
    maxCapacity: 250,
    coverImageUrl: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80",
    images: [],
    minimumBudget: 18000,
    averageBudget: 32000,
    isFeatured: true,
    isClaimed: true,
    amenities: ["Estacionamento", "Ar-condicionado", "Cozinha industrial", "WiFi", "Acessibilidade"],
  },
  {
    id: "2",
    slug: "chacara-mangala-campo-largo",
    name: "Chácara Mangala",
    type: "CHACARA",
    neighborhood: "Centro",
    city: "Campo Largo",
    state: "PR",
    minCapacity: 100,
    maxCapacity: 400,
    coverImageUrl: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80",
    images: [],
    minimumBudget: 12000,
    averageBudget: 22000,
    isFeatured: true,
    isClaimed: false,
    amenities: ["Estacionamento", "Área externa", "Lago", "Churrasqueira"],
  },
  {
    id: "3",
    slug: "salao-crystal-batel",
    name: "Salão Crystal",
    type: "SALAO",
    neighborhood: "Batel",
    city: "Curitiba",
    state: "PR",
    minCapacity: 50,
    maxCapacity: 180,
    coverImageUrl: "https://images.unsplash.com/photo-1530023367847-a683933f4172?w=800&q=80",
    images: [],
    minimumBudget: 15000,
    averageBudget: 28000,
    isFeatured: true,
    isClaimed: true,
    amenities: ["Ar-condicionado", "Valet", "Buffet incluso", "DJ incluso"],
  },
  {
    id: "4",
    slug: "espaco-verde-pinhais",
    name: "Espaço Verde",
    type: "CHACARA",
    neighborhood: "Centro",
    city: "Pinhais",
    state: "PR",
    minCapacity: 60,
    maxCapacity: 200,
    coverImageUrl: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800&q=80",
    images: [],
    minimumBudget: 8000,
    averageBudget: 15000,
    isFeatured: true,
    isClaimed: false,
    amenities: ["Estacionamento", "Área verde", "Churrasqueira"],
  },
  {
    id: "5",
    slug: "hotel-rayon-centro",
    name: "Hotel Rayon",
    type: "HOTEL",
    neighborhood: "Centro",
    city: "Curitiba",
    state: "PR",
    minCapacity: 40,
    maxCapacity: 300,
    coverImageUrl: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80",
    images: [],
    minimumBudget: 25000,
    averageBudget: 45000,
    isFeatured: true,
    isClaimed: true,
    amenities: ["Hospedagem", "Valet", "Buffet", "Ar-condicionado", "WiFi", "Acessibilidade"],
  },
  {
    id: "6",
    slug: "fazenda-rio-bonito-sjp",
    name: "Fazenda Rio Bonito",
    type: "FAZENDA",
    neighborhood: "Afonso Pena",
    city: "São José dos Pinhais",
    state: "PR",
    minCapacity: 120,
    maxCapacity: 500,
    coverImageUrl: "https://images.unsplash.com/photo-1510076857177-7470076d4098?w=800&q=80",
    images: [],
    minimumBudget: 20000,
    averageBudget: 35000,
    isFeatured: true,
    isClaimed: true,
    amenities: ["Estacionamento", "Heliponto", "Suíte noivos", "Área externa"],
  },
];

// ─── Página ─────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      <Navbar />

      {/* ════════════════════════════════════════════════════════════════
          SEÇÃO 1 — Hero
          ════════════════════════════════════════════════════════════════ */}
      <HeroSection />

      {/* ════════════════════════════════════════════════════════════════
          SEÇÃO 2 — Barra de Busca (sobrepõe o final do Hero via -mt)
          ════════════════════════════════════════════════════════════════ */}
      <SearchFilters />

      {/* ════════════════════════════════════════════════════════════════
          SEÇÃO 3 — Grid Assimétrico de Espaços em Destaque
          ════════════════════════════════════════════════════════════════ */}
      <section id="resultados" className="section-gap">
        <div className="container-app">

          {/* Header da seção */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="label-gold">Destaques</span>
              <h2 className="display-md mt-2 text-ivory">
                Espaços exclusivos em destaque
                <br className="hidden sm:block" />
                <span className="text-gradient-gold"> na região de Curitiba</span>
              </h2>
            </div>
            <p className="text-sm text-ash max-w-xs">
              Seleção curada dos espaços mais procurados para casamentos
              e eventos na capital paranaense.
            </p>
          </div>

          {/* Grid assimétrico
              ┌──────────┬─────────┐
              │  GRANDE  │ pequeno │
              │  (span2) ├─────────┤
              │          │ pequeno │
              ├──────────┼─────────┤
              │ pequeno  │  GRANDE │
              ├──────────┤ (span2) │
              │ pequeno  │         │
              └──────────┴─────────┘  */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 auto-rows-auto">
            {FEATURED_VENUES.map((venue, i) => (
              <VenueCard
                key={venue.id}
                venue={venue}
                featured={i === 0 || i === 5}
              />
            ))}
          </div>

          {/* Link para ver todos */}
          <div className="mt-10 text-center">
            <button
              type="button"
              className="btn btn-outline btn-md"
            >
              Ver todos os espaços
            </button>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          SEÇÃO 4 — Como Funciona (proposta de valor)
          ════════════════════════════════════════════════════════════════ */}
      <HowItWorksSection />

      {/* ════════════════════════════════════════════════════════════════
          SEÇÃO 5 — CTA Final
          ════════════════════════════════════════════════════════════════ */}
      <FinalCTA />

      {/* ════════════════════════════════════════════════════════════════
          Footer
          ════════════════════════════════════════════════════════════════ */}
      <Footer />
    </>
  );
}

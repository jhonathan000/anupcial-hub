// =============================================================================
// NUPCIAL HUB — Página de Detalhe do Espaço
// Renderiza galeria, especificações, calendário e modal de lead capture
// =============================================================================

import type { Metadata } from "next";
import VenueDetailClient from "./VenueDetailClient";

// Mock data — replace with Prisma fetch by slug
function getVenueBySlug(slug: string) {
  return {
    id: "1",
    slug,
    name: "Villa Toscana",
    type: "VILLA",
    description:
      "Espaço sofisticado inspirado na arquitetura toscana, rodeado por vinhedos e jardins italianos. " +
      "Ideal para casamentos íntimos ou grandes celebrações com até 250 convidados. " +
      "Cozinha industrial completa, salão climatizado e área externa com pérgola iluminada.",
    neighborhood: "Santa Felicidade",
    city: "Curitiba",
    state: "PR",
    address: "Rua das Acácias, 1240 — Santa Felicidade, Curitiba/PR",
    zipCode: "82020-000",
    latitude: -25.3762,
    longitude: -49.3313,
    minCapacity: 80,
    maxCapacity: 250,
    pricePerHour: null,
    pricePerEvent: 18000,
    minimumBudget: 18000,
    averageBudget: 32000,
    coverImageUrl: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=80",
    images: [
      { url: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=80", blurHash: null, order: 0 },
      { url: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80", blurHash: null, order: 1 },
      { url: "https://images.unsplash.com/photo-1530023367847-a683933f4172?w=800&q=80", blurHash: null, order: 2 },
      { url: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800&q=80", blurHash: null, order: 3 },
      { url: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80", blurHash: null, order: 4 },
    ],
    amenities: ["Estacionamento 80 vagas", "Ar-condicionado", "Cozinha industrial", "WiFi", "Acessibilidade", "Gerador próprio", "Suíte noivos"],
    restrictions: ["Sem fogos de artifício", "Música até 2h"],
    isFeatured: true,
    isClaimed: true,
    ownerId: "owner-1",
    metaTitle: "Villa Toscana — Espaço para Casamento em Santa Felicidade, Curitiba",
    metaDescription: "Espaço para casamentos com até 250 convidados em Santa Felicidade. Salão climatizado, área externa e cozinha industrial.",
    bookedDates: [
      "2026-09-05", "2026-09-12", "2026-09-19",
      "2026-10-03", "2026-10-10", "2026-10-17", "2026-10-24",
      "2026-11-07", "2026-11-14", "2026-11-21", "2026-11-28",
      "2026-12-05", "2026-12-12",
    ],
    createdAt: "2024-01-15T00:00:00.000Z",
  };
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const venue = getVenueBySlug(params.slug);
  return {
    title: venue.metaTitle || `${venue.name} — Nupcial Hub`,
    description: venue.metaDescription || venue.description?.slice(0, 160),
    openGraph: {
      title: venue.name,
      description: venue.metaDescription || undefined,
      images: venue.coverImageUrl ? [{ url: venue.coverImageUrl }] : [],
    },
  };
}

export default function VenueDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const venue = getVenueBySlug(params.slug);
  return <VenueDetailClient venue={venue} />;
}

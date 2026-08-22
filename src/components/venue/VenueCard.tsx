"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Users, CheckCircle2 } from "lucide-react";
import type { VenueCardData } from "@/types";
import { VENUE_TYPE_LABELS } from "@/types";

interface VenueCardProps {
  venue: VenueCardData;
  /** Variante de tamanho no grid assimétrico */
  featured?: boolean;
}

export default function VenueCard({ venue, featured = false }: VenueCardProps) {
  const typeLabel = VENUE_TYPE_LABELS[venue.type] || venue.type;

  const formatBudget = (value: number | null) => {
    if (!value) return null;
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const budgetDisplay = formatBudget(venue.averageBudget || venue.minimumBudget);

  return (
    <Link
      href={`/espacos/${venue.slug}`}
      className={[
        "group card overflow-hidden flex flex-col",
        featured ? "row-span-2" : "",
      ].join(" ")}
    >
      {/* ── Imagem ─────────────────────────────────────────────────── */}
      <div
        className={[
          "relative overflow-hidden",
          featured ? "aspect-[3/4]" : "aspect-[4/3]",
        ].join(" ")}
      >
        {venue.coverImageUrl ? (
          <Image
            src={venue.coverImageUrl}
            alt={`${venue.name} — ${typeLabel} em ${venue.neighborhood}, ${venue.city}`}
            fill
            sizes={featured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 33vw"}
            className="object-cover transition-transform duration-700 ease-spring group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 bg-raised flex items-center justify-center">
            <span className="text-ash text-sm">Sem imagem</span>
          </div>
        )}

        {/* Gradiente sobre a imagem */}
        <div className="absolute inset-0 bg-gradient-to-t from-void/80 via-void/20 to-transparent opacity-60 group-hover:opacity-50 transition-opacity duration-500" />

        {/* Badge tipo */}
        <span className="absolute top-3 left-3 badge-gold text-2xs">
          {typeLabel}
        </span>

        {/* Selo verificado */}
        {venue.isClaimed && (
          <span className="absolute top-3 right-3 flex items-center gap-1 badge-green text-2xs">
            <CheckCircle2 className="w-3 h-3" />
            Verificado
          </span>
        )}

        {/* Preço sobre a imagem */}
        {budgetDisplay && (
          <div className="absolute bottom-3 right-3 card-glass px-3 py-1.5 rounded-lg">
            <span className="text-sm font-bold text-ivory">
              {budgetDisplay}
            </span>
            <span className="text-2xs text-ash ml-1">média</span>
          </div>
        )}
      </div>

      {/* ── Info ───────────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        <h3
          className={[
            "font-display font-bold text-ivory leading-tight tracking-tight",
            "group-hover:text-gold-400 transition-colors duration-200",
            featured ? "text-xl sm:text-2xl" : "text-lg",
          ].join(" ")}
        >
          {venue.name}
        </h3>

        <div className="flex items-center gap-1.5 mt-2 text-ash">
          <MapPin className="w-3.5 h-3.5 text-gold-400/60 flex-shrink-0" />
          <span className="text-xs truncate">
            {venue.neighborhood}, {venue.city}
          </span>
        </div>

        {/* Dados técnicos */}
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-rim/50">
          <div className="flex items-center gap-1.5 text-ash">
            <Users className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">
              {venue.minCapacity}–{venue.maxCapacity} pessoas
            </span>
          </div>

          {venue.amenities.length > 0 && (
            <span className="text-2xs text-ash bg-raised px-2 py-0.5 rounded-md">
              {venue.amenities.length} comodidade{venue.amenities.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

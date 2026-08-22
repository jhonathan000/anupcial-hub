"use client";

import { useState } from "react";
import Image from "next/image";
import { Expand, ImageIcon } from "lucide-react";

interface GalleryImage {
  url: string;
  caption?: string | null;
  blurHash?: string | null;
}

interface VenueGalleryProps {
  images: GalleryImage[];
  venueName: string;
}

export default function VenueGallery({ images, venueName }: VenueGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Ensure we always have 3 slots
  const displayImages = images.length > 0 ? images : [];
  const primary = displayImages[0] ?? null;
  const secondary = displayImages[1] ?? null;
  const tertiary = displayImages[2] ?? null;
  const remaining = Math.max(0, displayImages.length - 3);

  if (!primary) {
    return (
      <div className="aspect-video rounded-2xl bg-raised border border-rim flex items-center justify-center">
        <div className="text-center text-ash">
          <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-40" />
          <p className="text-sm">Nenhuma foto disponível</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ── Grid Assimétrico Editorial ────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-2 rounded-2xl overflow-hidden">
        {/* Imagem Principal — ocupa toda a altura */}
        <button
          type="button"
          onClick={() => setLightboxIndex(0)}
          className="relative aspect-[4/3] md:aspect-auto md:row-span-2 group overflow-hidden bg-raised cursor-pointer"
          aria-label={`Ver foto principal: ${venueName}`}
        >
          <Image
            src={primary.url}
            alt={`${venueName} — foto principal`}
            fill
            sizes="(max-width: 768px) 100vw, 66vw"
            className="object-cover transition-transform duration-700 ease-spring group-hover:scale-[1.03]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-void/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="btn btn-sm card-glass text-ivory text-xs gap-1.5">
              <Expand className="w-3.5 h-3.5" />
              Ampliar
            </span>
          </div>
        </button>

        {/* Imagem Secundária — topo direita */}
        {secondary ? (
          <button
            type="button"
            onClick={() => setLightboxIndex(1)}
            className="relative aspect-[4/3] group overflow-hidden bg-raised cursor-pointer hidden md:block"
            aria-label="Ver segunda foto"
          >
            <Image
              src={secondary.url}
              alt={`${venueName} — foto 2`}
              fill
              sizes="33vw"
              className="object-cover transition-transform duration-700 ease-spring group-hover:scale-[1.03]"
            />
          </button>
        ) : (
          <div className="hidden md:block bg-raised aspect-[4/3]" />
        )}

        {/* Imagem Terciária — baixo direita + contador de fotos extras */}
        {tertiary ? (
          <button
            type="button"
            onClick={() => setLightboxIndex(2)}
            className="relative aspect-[4/3] group overflow-hidden bg-raised cursor-pointer hidden md:block"
            aria-label="Ver terceira foto"
          >
            <Image
              src={tertiary.url}
              alt={`${venueName} — foto 3`}
              fill
              sizes="33vw"
              className="object-cover transition-transform duration-700 ease-spring group-hover:scale-[1.03]"
            />

            {/* Overlay com contador de fotos extras */}
            {remaining > 0 && (
              <div className="absolute inset-0 bg-void/60 flex items-center justify-center backdrop-blur-sm transition-all group-hover:bg-void/50">
                <span className="font-display text-2xl font-bold text-ivory">
                  +{remaining}
                </span>
                <span className="text-xs text-ash ml-2">fotos</span>
              </div>
            )}
          </button>
        ) : (
          <div className="hidden md:block bg-raised aspect-[4/3]" />
        )}
      </div>

      {/* ── Lightbox simples ─────────────────────────────────────── */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-modal flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 backdrop-dark"
            onClick={() => setLightboxIndex(null)}
          />
          <div className="relative max-w-4xl w-full max-h-[85vh] animate-scale-in">
            <Image
              src={displayImages[lightboxIndex]?.url ?? ""}
              alt={`${venueName} — foto ${lightboxIndex + 1}`}
              width={1200}
              height={800}
              className="object-contain w-full h-full rounded-xl"
            />
            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              className="absolute top-3 right-3 w-10 h-10 rounded-full bg-void/80 border border-rim flex items-center justify-center text-ivory hover:bg-raised transition-colors"
              aria-label="Fechar"
            >
              ✕
            </button>

            {/* Navigation */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {displayImages.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setLightboxIndex(idx)}
                  className={[
                    "w-2 h-2 rounded-full transition-all duration-200",
                    idx === lightboxIndex
                      ? "bg-gold-400 w-6"
                      : "bg-ivory/30 hover:bg-ivory/60",
                  ].join(" ")}
                  aria-label={`Foto ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

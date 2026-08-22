"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MapPin, Users, Wallet, CheckCircle2, Shield, Wifi,
  ParkingCircle, Snowflake, ChefHat, Accessibility, Zap, BedDouble,
  ArrowLeft, Share2, Heart, AlertTriangle,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import VenueGallery from "@/components/venue/VenueGallery";
import VenueCalendar from "@/components/venue/VenueCalendar";
import LeadCaptureModal from "@/components/venue/LeadCaptureModal";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { VENUE_TYPE_LABELS } from "@/types";

interface VenueData {
  id: string;
  slug: string;
  name: string;
  type: string;
  description: string | null;
  neighborhood: string;
  city: string;
  state: string;
  address: string;
  minCapacity: number;
  maxCapacity: number;
  pricePerEvent: number | null;
  minimumBudget: number | null;
  averageBudget: number | null;
  coverImageUrl: string | null;
  images: Array<{ url: string; blurHash?: string | null; order: number }>;
  amenities: string[];
  restrictions: string[];
  isClaimed: boolean;
  ownerId: string | null;
  bookedDates: string[];
}

const AMENITY_ICONS: Record<string, React.ElementType> = {
  WiFi: Wifi,
  Estacionamento: ParkingCircle,
  "Ar-condicionado": Snowflake,
  "Cozinha industrial": ChefHat,
  Acessibilidade: Accessibility,
  "Gerador próprio": Zap,
  "Suíte noivos": BedDouble,
};

export default function VenueDetailClient({ venue }: { venue: VenueData }) {
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  const typeLabel = VENUE_TYPE_LABELS[venue.type] || venue.type;

  const formatCurrency = (v: number | null) =>
    v
      ? v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 })
      : null;

  const handleOccupiedDate = (dateStr: string) => {
    setSelectedDate(dateStr);
    setLeadModalOpen(true);
  };

  return (
    <>
      <Navbar />

      <div className="pt-24 pb-8">
        {/* ── Back nav ─────────────────────────────────────────── */}
        <div className="container-app mb-6">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-ash hover:text-ivory transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar aos espaços
            </Link>
            <div className="flex items-center gap-2">
              <button className="btn btn-ghost btn-sm" aria-label="Compartilhar">
                <Share2 className="w-4 h-4" />
              </button>
              <button className="btn btn-ghost btn-sm" aria-label="Favoritar">
                <Heart className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Gallery ──────────────────────────────────────────── */}
        <div className="container-app mb-10">
          <VenueGallery
            images={venue.images.map((img) => ({
              url: img.url,
              blurHash: img.blurHash,
            }))}
            venueName={venue.name}
          />
        </div>

        {/* ── Content grid ─────────────────────────────────────── */}
        <div className="container-app">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 lg:gap-12">

            {/* ── LEFT: Info ─────────────────────────────────── */}
            <div>
              {/* Title block */}
              <div className="flex items-start gap-3 mb-2">
                <Badge variant="gold">{typeLabel}</Badge>
                {venue.isClaimed && (
                  <Badge variant="green">
                    <CheckCircle2 className="w-3 h-3" /> Verificado
                  </Badge>
                )}
              </div>

              <h1 className="font-display text-3xl sm:text-4xl font-bold text-ivory tracking-tight mt-3">
                {venue.name}
              </h1>

              <div className="flex items-center gap-2 mt-3 text-ash text-sm">
                <MapPin className="w-4 h-4 text-gold-400" />
                {venue.address}
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-4 mt-8 mb-8">
                <div className="card p-4 text-center">
                  <Users className="w-5 h-5 text-gold-400 mx-auto mb-2" />
                  <p className="text-lg font-bold text-ivory">
                    {venue.minCapacity}–{venue.maxCapacity}
                  </p>
                  <p className="text-2xs text-ash">convidados</p>
                </div>
                <div className="card p-4 text-center">
                  <Wallet className="w-5 h-5 text-gold-400 mx-auto mb-2" />
                  <p className="text-lg font-bold text-ivory">
                    {formatCurrency(venue.averageBudget) || "Consulte"}
                  </p>
                  <p className="text-2xs text-ash">orçamento médio</p>
                </div>
                <div className="card p-4 text-center">
                  <Shield className="w-5 h-5 text-gold-400 mx-auto mb-2" />
                  <p className="text-lg font-bold text-ivory">
                    {venue.bookedDates.length}
                  </p>
                  <p className="text-2xs text-ash">datas ocupadas</p>
                </div>
              </div>

              {/* Description */}
              {venue.description && (
                <div className="mb-8">
                  <h2 className="font-display text-xl font-bold text-ivory mb-3">
                    Sobre o espaço
                  </h2>
                  <p className="text-sm text-mist leading-relaxed whitespace-pre-line">
                    {venue.description}
                  </p>
                </div>
              )}

              {/* Amenities */}
              <div className="mb-8">
                <h2 className="font-display text-xl font-bold text-ivory mb-4">
                  Comodidades
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {venue.amenities.map((amenity) => {
                    const baseKey = Object.keys(AMENITY_ICONS).find((k) =>
                      amenity.toLowerCase().includes(k.toLowerCase())
                    );
                    const Icon = baseKey ? AMENITY_ICONS[baseKey] : CheckCircle2;
                    return (
                      <div key={amenity} className="flex items-center gap-2.5 text-sm text-mist">
                        <Icon className="w-4 h-4 text-gold-400/70 flex-shrink-0" />
                        {amenity}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Restrictions */}
              {venue.restrictions.length > 0 && (
                <div className="mb-8">
                  <h2 className="font-display text-xl font-bold text-ivory mb-4">
                    Restrições
                  </h2>
                  <div className="space-y-2">
                    {venue.restrictions.map((r) => (
                      <div key={r} className="flex items-center gap-2.5 text-sm text-ash">
                        <AlertTriangle className="w-4 h-4 text-orange-400/70 flex-shrink-0" />
                        {r}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Claim CTA */}
              {!venue.isClaimed && (
                <div className="card-glass rounded-xl p-5 border border-gold-400/10 mt-8">
                  <h3 className="text-sm font-bold text-ivory mb-1">
                    Você é o proprietário deste espaço?
                  </h3>
                  <p className="text-xs text-ash mb-4">
                    Reivindique este perfil gratuitamente para gerenciar fotos,
                    disponibilidade e receber contatos diretamente.
                  </p>
                  <Button variant="outline" size="sm">
                    Reivindicar este perfil
                  </Button>
                </div>
              )}
            </div>

            {/* ── RIGHT: Sticky calendar ─────────────────────── */}
            <div className="lg:sticky lg:top-24 lg:self-start space-y-5">
              <VenueCalendar
                bookedDates={venue.bookedDates}
                onOccupiedDateClick={handleOccupiedDate}
              />

              <div className="card p-5">
                <h3 className="text-sm font-bold text-ivory mb-2">
                  Tem interesse neste espaço?
                </h3>
                <p className="text-xs text-ash mb-4 leading-relaxed">
                  Entre em contato para visitar, negociar valores ou
                  verificar disponibilidade para sua data.
                </p>
                <Button variant="gold" size="md" fullWidth>
                  Solicitar orçamento
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Lead Capture Modal ────────────────────────────────── */}
      <LeadCaptureModal
        isOpen={leadModalOpen}
        onClose={() => setLeadModalOpen(false)}
        selectedDate={selectedDate}
        venueName={venue.name}
        venueId={venue.id}
        venueCity={venue.city}
      />

      <Footer />
    </>
  );
}

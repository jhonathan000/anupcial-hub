"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Filter, ChevronLeft, Lock, TrendingUp,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LeadCard from "@/components/dashboard/LeadCard";
import LeadUnlockModal from "@/components/dashboard/LeadUnlockModal";
import Button from "@/components/ui/Button";
import { EVENT_TYPE_LABELS } from "@/types";
import type { LeadMarketplaceItem } from "@/types";

// ─── Mock Data ───────────────────────────────────────────────────────────────

const MOCK_LEADS: LeadMarketplaceItem[] = [
  {
    id: "lead-1",
    eventDate: "2026-09-15",
    city: "Curitiba",
    neighborhood: "Batel",
    eventType: "CASAMENTO",
    guestCount: 150,
    estimatedBudget: 35000,
    notes: "Casal jovem, primeira vez planejando. Preferem chácara com área verde.",
    sourceVenueName: "Villa Toscana",
    sourceChannel: "VENUE_MODAL",
    status: "AVAILABLE",
    expiresAt: "2026-09-01",
    allowedModels: ["PAY_PER_LEAD", "SUCCESS_FEE"],
    creditCost: 5,
    successFeePercentage: 7.5,
    claimCount: 2,
    maxClaims: 5,
    isClaimedByMe: false,
    createdAt: "2026-08-18T10:30:00Z",
  },
  {
    id: "lead-2",
    eventDate: "2026-10-22",
    city: "São José dos Pinhais",
    neighborhood: "Centro",
    eventType: "CASAMENTO",
    guestCount: 220,
    estimatedBudget: 52000,
    notes: null,
    sourceVenueName: "Chácara Mangala",
    sourceChannel: "VENUE_MODAL",
    status: "AVAILABLE",
    expiresAt: "2026-10-05",
    allowedModels: ["SUCCESS_FEE"],
    creditCost: 0,
    successFeePercentage: 10,
    claimCount: 1,
    maxClaims: 4,
    isClaimedByMe: true,
    createdAt: "2026-08-19T14:15:00Z",
  },
  {
    id: "lead-3",
    eventDate: "2026-09-28",
    city: "Curitiba",
    neighborhood: "Santa Felicidade",
    eventType: "CASAMENTO",
    guestCount: 180,
    estimatedBudget: 40000,
    notes: "Cerimônia ao entardecer, quer muita atenção com a iluminação.",
    sourceVenueName: null,
    sourceChannel: "MANUAL_CEREMONIAL",
    status: "AVAILABLE",
    expiresAt: "2026-09-10",
    allowedModels: ["PAY_PER_LEAD"],
    creditCost: 8,
    successFeePercentage: 0,
    claimCount: 3,
    maxClaims: 5,
    isClaimedByMe: false,
    createdAt: "2026-08-20T09:45:00Z",
  },
  {
    id: "lead-4",
    eventDate: "2026-10-05",
    city: "Campo Largo",
    neighborhood: "Centro",
    eventType: "CASAMENTO",
    guestCount: 250,
    estimatedBudget: 60000,
    notes: "Casal internacional, cerimônia bilíngue. Orçamento elevado.",
    sourceVenueName: null,
    sourceChannel: "MANUAL_CEREMONIAL",
    status: "AVAILABLE",
    expiresAt: "2026-09-20",
    allowedModels: ["SUCCESS_FEE"],
    creditCost: 0,
    successFeePercentage: 8,
    claimCount: 0,
    maxClaims: 3,
    isClaimedByMe: false,
    createdAt: "2026-08-20T16:20:00Z",
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function LeadsMarketplace() {
  const [filters, setFilters] = useState({
    city: "",
    eventType: "",
  });
  const [unlockModal, setUnlockModal] = useState<{
    isOpen: boolean;
    leadId?: string;
    creditCost?: number;
    successFeePercentage?: number;
  }>({ isOpen: false });

  const userCreditBalance = 23;

  // Filter leads
  const filteredLeads = useMemo(() => {
    return MOCK_LEADS.filter((lead) => {
      if (filters.city && lead.city !== filters.city) return false;
      if (filters.eventType && lead.eventType !== filters.eventType) return false;
      return true;
    });
  }, [filters]);

  const handleUnlock = (leadId: string) => {
    const lead = MOCK_LEADS.find((l) => l.id === leadId);
    if (!lead) return;
    setUnlockModal({
      isOpen: true,
      leadId,
      creditCost: lead.creditCost,
      successFeePercentage: lead.successFeePercentage,
    });
  };

  const cities = Array.from(new Set(MOCK_LEADS.map((l) => l.city))).sort();
  const eventTypes = Object.entries(EVENT_TYPE_LABELS);

  return (
    <>
      <Navbar />
      <div className="pt-24 section-gap">
        <div className="container-app">

          {/* ── Header ─────────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <Link
                href="/cerimonialistas/dashboard"
                className="flex items-center gap-1 text-sm text-ash hover:text-ivory transition-colors mb-3"
              >
                <ChevronLeft className="w-4 h-4" />
                Voltar ao painel
              </Link>
              <h1 className="display-md text-ivory">
                Mural de <span className="text-gradient-gold">Leads</span>
              </h1>
              <p className="text-sm text-mist mt-2">
                {filteredLeads.length} oportunidade{filteredLeads.length !== 1 ? "s" : ""} disponível{filteredLeads.length !== 1 ? "is" : ""} em Curitiba e região
              </p>
            </div>
            <div className="flex items-center gap-2 bg-raised rounded-xl px-4 py-2 text-sm">
              <Lock className="w-4 h-4 text-gold-400" />
              <span className="text-ivory font-bold">{userCreditBalance}</span>
              <span className="text-ash">créditos</span>
            </div>
          </div>

          {/* ── Filters ────────────────────────────────────────── */}
          <div className="card p-4 mb-8 flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label htmlFor="filter-city" className="block text-xs font-medium text-ash mb-1.5">
                Cidade
              </label>
              <select
                id="filter-city"
                value={filters.city}
                onChange={(e) => setFilters((p) => ({ ...p, city: e.target.value }))}
                className="input-base"
              >
                <option value="">Todas as cidades</option>
                {cities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label htmlFor="filter-type" className="block text-xs font-medium text-ash mb-1.5">
                Tipo de evento
              </label>
              <select
                id="filter-type"
                value={filters.eventType}
                onChange={(e) => setFilters((p) => ({ ...p, eventType: e.target.value }))}
                className="input-base"
              >
                <option value="">Todos os tipos</option>
                {eventTypes.map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <Button
                variant="ghost"
                size="md"
                onClick={() => setFilters({ city: "", eventType: "" })}
                icon={<Filter className="w-4 h-4" />}
              >
                Limpar
              </Button>
            </div>
          </div>

          {/* ── Leads Grid ────────────────────────────────────── */}
          {filteredLeads.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredLeads.map((lead) => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  onUnlock={handleUnlock}
                />
              ))}
            </div>
          ) : (
            <div className="card p-12 text-center">
              <TrendingUp className="w-12 h-12 text-ash/30 mx-auto mb-4" />
              <h3 className="font-display text-lg font-bold text-ivory mb-2">
                Nenhum lead encontrado
              </h3>
              <p className="text-sm text-ash">
                Tente ajustar os filtros ou volte mais tarde para ver novas oportunidades.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Unlock Modal ───────────────────────────────────────── */}
      <LeadUnlockModal
        isOpen={unlockModal.isOpen}
        onClose={() => setUnlockModal({ isOpen: false })}
        leadId={unlockModal.leadId || ""}
        creditCost={unlockModal.creditCost || 0}
        successFeePercentage={unlockModal.successFeePercentage || 0}
        userCreditBalance={userCreditBalance}
        onUnlockSuccess={() => {
          // Refetch leads or update local state
          console.log("Lead desbloqueado");
        }}
      />

      <Footer />
    </>
  );
}

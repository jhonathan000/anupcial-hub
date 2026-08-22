"use client";

import {
  Calendar,
  MapPin,
  Users,
  Wallet,
  Lock,
  Eye,
  Clock,
} from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { format, parseISO, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { LeadMarketplaceItem } from "@/types";
import { EVENT_TYPE_LABELS } from "@/types";

interface LeadCardProps {
  lead: LeadMarketplaceItem;
  onUnlock: (leadId: string) => void;
}

export default function LeadCard({ lead, onUnlock }: LeadCardProps) {
  const eventLabel = EVENT_TYPE_LABELS[lead.eventType] || lead.eventType;
  const daysUntil = differenceInDays(parseISO(lead.eventDate), new Date());
  const slotsLeft = lead.maxClaims - lead.claimCount;

  const formatBudget = (val: number) =>
    val.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
    });

  const formattedDate = (() => {
    try {
      return format(parseISO(lead.eventDate), "d 'de' MMM, yyyy", { locale: ptBR });
    } catch {
      return lead.eventDate;
    }
  })();

  return (
    <div className="card p-5 flex flex-col">
      {/* ── Top row: type + urgency ───────────────────────────── */}
      <div className="flex items-center justify-between mb-4">
        <Badge variant="gold">{eventLabel}</Badge>
        {daysUntil <= 60 && daysUntil > 0 && (
          <Badge variant="orange" dot>
            {daysUntil}d restantes
          </Badge>
        )}
        {daysUntil <= 0 && (
          <Badge variant="red" dot>Evento próximo</Badge>
        )}
      </div>

      {/* ── Data details ──────────────────────────────────────── */}
      <div className="space-y-3 flex-1">
        <div className="flex items-center gap-2.5 text-sm">
          <Calendar className="w-4 h-4 text-gold-400 flex-shrink-0" />
          <span className="text-ivory font-medium">{formattedDate}</span>
        </div>

        <div className="flex items-center gap-2.5 text-sm">
          <MapPin className="w-4 h-4 text-gold-400 flex-shrink-0" />
          <span className="text-mist">
            {lead.neighborhood ? `${lead.neighborhood}, ` : ""}
            {lead.city}
          </span>
        </div>

        <div className="flex items-center gap-2.5 text-sm">
          <Users className="w-4 h-4 text-gold-400 flex-shrink-0" />
          <span className="text-mist">{lead.guestCount} convidados</span>
        </div>

        <div className="flex items-center gap-2.5 text-sm">
          <Wallet className="w-4 h-4 text-gold-400 flex-shrink-0" />
          <span className="text-ivory font-semibold">
            {formatBudget(lead.estimatedBudget)}
          </span>
          <span className="text-ash text-xs">orçamento estimado</span>
        </div>

        {lead.sourceVenueName && (
          <p className="text-xs text-ash mt-1">
            Origem: <span className="text-mist">{lead.sourceVenueName}</span>
          </p>
        )}
      </div>

      {/* ── Contact hidden indicator ─────────────────────────── */}
      <div className="mt-4 pt-4 border-t border-rim/50">
        {lead.isClaimedByMe ? (
          <div className="flex items-center gap-2 text-sm text-green-400">
            <Eye className="w-4 h-4" />
            <span className="font-medium">Contato desbloqueado</span>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 text-sm text-ash mb-3">
              <Lock className="w-3.5 h-3.5" />
              <span>Nome e WhatsApp ocultos</span>
            </div>
            <div className="flex items-center justify-between">
              <Button
                variant="gold"
                size="sm"
                onClick={() => onUnlock(lead.id)}
                icon={<Lock className="w-3.5 h-3.5" />}
              >
                Desbloquear contato
              </Button>
              {slotsLeft <= 3 && slotsLeft > 0 && (
                <span className="flex items-center gap-1 text-2xs text-orange-400">
                  <Clock className="w-3 h-3" />
                  {slotsLeft} vaga{slotsLeft !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

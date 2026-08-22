"use client";

import { useState } from "react";
import { CalendarX, Send, Sparkles } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import toast from "react-hot-toast";

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** ISO date string "YYYY-MM-DD" of the occupied date the user clicked */
  selectedDate: string;
  /** Name of the venue the user was viewing */
  venueName: string;
  /** ID of the venue for sourceVenueId */
  venueId: string;
  /** City for pre-filling */
  venueCity?: string;
}

export default function LeadCaptureModal({
  isOpen,
  onClose,
  selectedDate,
  venueName,
  venueId,
  venueCity = "Curitiba",
}: LeadCaptureModalProps) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    contactName: "",
    contactPhone: "",
    guestCount: "",
    estimatedBudget: "",
    notes: "",
  });

  const formattedDate = (() => {
    try {
      return format(parseISO(selectedDate), "d 'de' MMMM 'de' yyyy", {
        locale: ptBR,
      });
    } catch {
      return selectedDate;
    }
  })();

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!form.contactName.trim()) {
      toast.error("Por favor, informe seu nome.");
      return;
    }
    if (!form.contactPhone.trim() || form.contactPhone.replace(/\D/g, "").length < 10) {
      toast.error("Informe um WhatsApp válido com DDD.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactName: form.contactName.trim(),
          contactPhone: form.contactPhone.trim(),
          eventDate: selectedDate,
          city: venueCity,
          guestCount: parseInt(form.guestCount) || 150,
          estimatedBudget: parseFloat(form.estimatedBudget) || 20000,
          notes: form.notes.trim() || null,
          sourceVenueId: venueId,
        }),
      });

      if (!res.ok) throw new Error("Falha ao enviar");

      toast.success("Pronto! Nossos cerimonialistas entrarão em contato em até 24h.");
      onClose();
      setForm({ contactName: "", contactPhone: "", guestCount: "", estimatedBudget: "", notes: "" });
    } catch {
      toast.error("Erro ao enviar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
    >
      {/* ── Header visual ─────────────────────────────────────── */}
      <div className="text-center mb-6">
        <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
          <CalendarX className="w-6 h-6 text-red-400" />
        </div>
        <h2 className="font-display text-2xl font-bold text-ivory">
          Data indisponível
        </h2>
        <p className="text-sm text-ash mt-2 leading-relaxed">
          O espaço <span className="text-ivory font-medium">{venueName}</span> está
          ocupado em{" "}
          <span className="text-gold-400 font-medium">{formattedDate}</span>.
        </p>
      </div>

      {/* ── Value proposition ─────────────────────────────────── */}
      <div className="card-glass rounded-xl p-4 mb-6 border border-gold-400/10">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-gold-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-mist leading-relaxed">
            Nossa rede exclusiva de cerimonialistas em {venueCity} pode encontrar
            espaços alternativos perfeitos e disponíveis para essa data em{" "}
            <span className="text-ivory font-semibold">até 24 horas</span>.
          </p>
        </div>
      </div>

      {/* ── Form ──────────────────────────────────────────────── */}
      <div className="space-y-4">
        <div>
          <label htmlFor="lead-name" className="block text-xs font-medium text-ash mb-1.5">
            Seu nome
          </label>
          <input
            id="lead-name"
            type="text"
            value={form.contactName}
            onChange={(e) => updateField("contactName", e.target.value)}
            placeholder="Maria e João"
            className="input-base"
            autoFocus
          />
        </div>

        <div>
          <label htmlFor="lead-phone" className="block text-xs font-medium text-ash mb-1.5">
            WhatsApp (com DDD)
          </label>
          <input
            id="lead-phone"
            type="tel"
            value={form.contactPhone}
            onChange={(e) => updateField("contactPhone", e.target.value)}
            placeholder="(41) 99999-0000"
            className="input-base"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="lead-guests" className="block text-xs font-medium text-ash mb-1.5">
              Convidados
            </label>
            <input
              id="lead-guests"
              type="number"
              value={form.guestCount}
              onChange={(e) => updateField("guestCount", e.target.value)}
              placeholder="150"
              className="input-base"
            />
          </div>
          <div>
            <label htmlFor="lead-budget" className="block text-xs font-medium text-ash mb-1.5">
              Orçamento (R$)
            </label>
            <input
              id="lead-budget"
              type="number"
              value={form.estimatedBudget}
              onChange={(e) => updateField("estimatedBudget", e.target.value)}
              placeholder="25000"
              className="input-base"
            />
          </div>
        </div>

        <div>
          <label htmlFor="lead-notes" className="block text-xs font-medium text-ash mb-1.5">
            Observações <span className="text-ash/50">(opcional)</span>
          </label>
          <textarea
            id="lead-notes"
            value={form.notes}
            onChange={(e) => updateField("notes", e.target.value)}
            rows={2}
            placeholder="Preferência por chácara com espaço externo..."
            className="input-base resize-none"
          />
        </div>
      </div>

      {/* ── Actions ───────────────────────────────────────────── */}
      <div className="mt-6 flex flex-col gap-2">
        <Button
          variant="gold"
          size="lg"
          fullWidth
          loading={loading}
          onClick={handleSubmit}
          icon={<Send className="w-4 h-4" />}
        >
          Receber propostas em 24h
        </Button>
        <Button variant="ghost" size="md" fullWidth onClick={onClose}>
          Voltar ao calendário
        </Button>
      </div>
    </Modal>
  );
}

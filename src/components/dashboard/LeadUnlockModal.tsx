"use client";

import { useState } from "react";
import { CreditCard, Handshake, Check, AlertCircle } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";

interface LeadUnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadId: string;
  creditCost: number;
  successFeePercentage: number;
  userCreditBalance: number;
  onUnlockSuccess: () => void;
}

type AcquisitionModel = "PAY_PER_LEAD" | "SUCCESS_FEE" | null;

export default function LeadUnlockModal({
  isOpen,
  onClose,
  leadId,
  creditCost,
  successFeePercentage,
  userCreditBalance,
  onUnlockSuccess,
}: LeadUnlockModalProps) {
  const [selected, setSelected] = useState<AcquisitionModel>(null);
  const [loading, setLoading] = useState(false);
  const hasEnoughCredits = userCreditBalance >= creditCost;

  const handleConfirm = async () => {
    if (!selected) {
      toast.error("Selecione um modelo de aquisição.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId,
          model: selected,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Falha ao desbloquear");
      }

      toast.success("Contato desbloqueado com sucesso!");
      onUnlockSuccess();
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao desbloquear");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Desbloquear contato"
      subtitle="Escolha como deseja acessar este lead."
      maxWidth="md"
    >
      <div className="space-y-3 mt-2">
        {/* ── Option 1: Pay-per-Lead ─────────────────────────── */}
        <button
          type="button"
          onClick={() => setSelected("PAY_PER_LEAD")}
          disabled={!hasEnoughCredits}
          className={[
            "w-full text-left p-5 rounded-xl border transition-all duration-200",
            selected === "PAY_PER_LEAD"
              ? "border-gold-400/50 bg-gold-400/5 shadow-gold"
              : "border-rim bg-raised/40 hover:border-rim hover:bg-raised/60",
            !hasEnoughCredits && "opacity-40 cursor-not-allowed",
          ].join(" ")}
        >
          <div className="flex items-start gap-4">
            <div className={[
              "w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0",
              selected === "PAY_PER_LEAD"
                ? "bg-gold-400/15 border border-gold-400/25"
                : "bg-raised border border-rim",
            ].join(" ")}>
              <CreditCard className={[
                "w-5 h-5",
                selected === "PAY_PER_LEAD" ? "text-gold-400" : "text-ash",
              ].join(" ")} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-ivory">Pay-per-Lead</h4>
                {selected === "PAY_PER_LEAD" && (
                  <Check className="w-4 h-4 text-gold-400" />
                )}
              </div>
              <p className="text-xs text-mist mt-1 leading-relaxed">
                Débito imediato de{" "}
                <span className="text-ivory font-bold">{creditCost} créditos</span>{" "}
                do seu saldo para liberar nome e WhatsApp.
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="font-data text-xs text-ash">
                  Saldo: {userCreditBalance} créditos
                </span>
                {!hasEnoughCredits && (
                  <span className="flex items-center gap-1 text-2xs text-red-400">
                    <AlertCircle className="w-3 h-3" />
                    Saldo insuficiente
                  </span>
                )}
              </div>
            </div>
          </div>
        </button>

        {/* ── Option 2: Success Fee ──────────────────────────── */}
        <button
          type="button"
          onClick={() => setSelected("SUCCESS_FEE")}
          className={[
            "w-full text-left p-5 rounded-xl border transition-all duration-200",
            selected === "SUCCESS_FEE"
              ? "border-gold-400/50 bg-gold-400/5 shadow-gold"
              : "border-rim bg-raised/40 hover:border-rim hover:bg-raised/60",
          ].join(" ")}
        >
          <div className="flex items-start gap-4">
            <div className={[
              "w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0",
              selected === "SUCCESS_FEE"
                ? "bg-gold-400/15 border border-gold-400/25"
                : "bg-raised border border-rim",
            ].join(" ")}>
              <Handshake className={[
                "w-5 h-5",
                selected === "SUCCESS_FEE" ? "text-gold-400" : "text-ash",
              ].join(" ")} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-ivory">Success Fee</h4>
                {selected === "SUCCESS_FEE" && (
                  <Check className="w-4 h-4 text-gold-400" />
                )}
              </div>
              <p className="text-xs text-mist mt-1 leading-relaxed">
                Sem custo agora. Compromisso de comissão de{" "}
                <span className="text-ivory font-bold">{successFeePercentage}%</span>{" "}
                sobre o valor do contrato fechado com o cliente.
              </p>
              <p className="text-2xs text-ash mt-2">
                Você só paga se fechar o negócio.
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* ── Confirm ──────────────────────────────────────────── */}
      <div className="mt-6 flex flex-col gap-2">
        <Button
          variant="gold"
          size="lg"
          fullWidth
          loading={loading}
          disabled={!selected}
          onClick={handleConfirm}
        >
          {selected === "PAY_PER_LEAD"
            ? `Desbloquear por ${creditCost} créditos`
            : selected === "SUCCESS_FEE"
              ? `Aceitar ${successFeePercentage}% de comissão`
              : "Selecione uma opção"}
        </Button>
        <Button variant="ghost" size="md" fullWidth onClick={onClose}>
          Cancelar
        </Button>
      </div>
    </Modal>
  );
}

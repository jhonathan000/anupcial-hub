"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Search, CalendarX, Handshake } from "lucide-react";

const STEPS = [
  {
    icon: Search,
    title: "Busque com filtros reais",
    description:
      "Selecione cidade, capacidade e tipo de espaço. Nosso diretório cobre " +
      "Curitiba e toda a Região Metropolitana com dados verificados e fotos reais.",
  },
  {
    icon: CalendarX,
    title: "Veja a disponibilidade ao vivo",
    description:
      "Cada espaço exibe um calendário sincronizado em tempo real. Sem " +
      "telefonemas, sem espera. Se a data está livre, você sabe na hora.",
  },
  {
    icon: Handshake,
    title: "Data ocupada? A gente resolve",
    description:
      "Se a data que você quer está tomada, nossa rede exclusiva de " +
      "cerimonialistas encontra alternativas perfeitas para você em 24 horas.",
  },
] as const;

export default function HowItWorksSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section
      ref={ref}
      id="como-funciona"
      className="section-gap relative overflow-hidden"
    >
      {/* Gradiente de fundo sutil */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(196,164,90,0.05) 0%, transparent 70%)",
        }}
      />

      <div className="container-app relative z-10">
        {/* Header */}
        <motion.div
          className="text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="label-gold">Como funciona</span>
          <h2 className="display-lg mt-3 text-ivory">
            Como encontramos o espaço ideal,{" "}
            <span className="text-gradient-gold">
              mesmo em datas concorridas
            </span>
          </h2>
          <p className="mt-4 text-mist text-base leading-relaxed">
            Três passos simples separam você do lugar perfeito para
            o seu casamento em Curitiba e região.
          </p>
        </motion.div>

        {/* Cards dos passos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-8">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                className="card p-6 sm:p-8 flex flex-col items-start"
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.15 * i }}
              >
                {/* Ícone com fundo dourado */}
                <div className="w-12 h-12 rounded-xl bg-gold-400/10 border border-gold-400/20 flex items-center justify-center mb-6">
                  <Icon className="w-5 h-5 text-gold-400" />
                </div>

                {/* Número do passo */}
                <span className="font-data text-2xs text-ash tracking-wider mb-3">
                  PASSO {String(i + 1).padStart(2, "0")}
                </span>

                <h3 className="font-display text-xl font-bold text-ivory mb-3 leading-tight">
                  {step.title}
                </h3>

                <p className="text-sm text-mist leading-relaxed flex-1">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

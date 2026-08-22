"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MapPin, ArrowDown } from "lucide-react";

export default function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section
      ref={ref}
      className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* ── Radial glow de fundo (accent dourado sutil) ──────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: [
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(196,164,90,0.08) 0%, transparent 70%)",
            "radial-gradient(ellipse 40% 40% at 80% 80%, rgba(196,164,90,0.04) 0%, transparent 60%)",
          ].join(", "),
        }}
      />

      {/* ── Linha horizontal decorativa no fundo ─────────────────── */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-0 right-0 h-px opacity-[0.04]"
        style={{ background: "linear-gradient(90deg, transparent, #C4A45A, transparent)" }}
      />

      {/* ── Conteúdo ─────────────────────────────────────────────── */}
      <div className="container-app relative z-10 text-center max-w-5xl mx-auto px-4">

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <span className="label-gold inline-flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5" />
            Curitiba e Região Metropolitana
          </span>
        </motion.div>

        {/* Título principal */}
        <motion.h1
          className="display-xl mt-6 text-ivory"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          O espaço perfeito
          <br />
          <span className="text-gradient-gold">
            para o seu evento
          </span>
        </motion.h1>

        {/* Subtítulo */}
        <motion.p
          className="mt-6 text-lg sm:text-xl text-mist max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.35 }}
        >
          Explore chácaras, salões e espaços exclusivos com disponibilidade
          em tempo real. Encontre, compare e reserve — tudo em um único lugar.
        </motion.p>

        {/* Métricas sociais */}
        <motion.div
          className="mt-10 flex items-center justify-center gap-8 sm:gap-12 flex-wrap"
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {[
            { value: "200+",  label: "Espaços catalogados" },
            { value: "14",    label: "Cidades cobertas" },
            { value: "24h",   label: "Resposta média" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-3xl sm:text-4xl font-bold text-ivory tracking-tight">
                {stat.value}
              </p>
              <p className="text-xs text-ash mt-1 tracking-wide uppercase">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── Scroll indicator ─────────────────────────────────────── */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <span className="text-2xs uppercase tracking-[0.2em] text-ash">
          Explorar
        </span>
        <ArrowDown className="w-4 h-4 text-ash animate-bounce" />
      </motion.div>
    </section>
  );
}

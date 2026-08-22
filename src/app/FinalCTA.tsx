"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Shield } from "lucide-react";

export default function FinalCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="section-gap-sm">
      <div className="container-narrow">
        <motion.div
          className="border-gradient-gold rounded-2xl overflow-hidden"
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-surface rounded-2xl px-6 py-12 sm:px-12 sm:py-16 text-center relative overflow-hidden">
            {/* Radial glow */}
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at 50% 0%, rgba(196,164,90,0.08) 0%, transparent 60%)",
              }}
            />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 badge-gold mb-6">
                <Shield className="w-3.5 h-3.5" />
                <span>Para Cerimonialistas Verificados</span>
              </div>

              <h2 className="display-md text-ivory">
                Você é cerimonialista?
                <br />
                <span className="text-gradient-gold">
                  Acesse nossa rede exclusiva
                </span>
              </h2>

              <p className="mt-4 text-mist max-w-lg mx-auto leading-relaxed">
                Conecte-se com leads qualificados, encontre espaços
                disponíveis e faça parcerias com outros profissionais
                de Curitiba e região.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/auth/cadastro"
                  className="btn btn-gold btn-lg"
                >
                  Criar conta profissional
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/cerimonialistas/dashboard"
                  className="btn btn-outline btn-lg"
                >
                  Saiba mais
                </Link>
              </div>

              <p className="mt-6 text-2xs text-ash">
                Acesso gratuito ao diretório. Leads disponíveis via créditos
                ou modelo de sucesso.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

import Link from "next/link";
import { Sparkles, Instagram, Linkedin, Mail } from "lucide-react";

const FOOTER_LINKS = {
  "Para Noivos": [
    { label: "Buscar espaços",        href: "/" },
    { label: "Como funciona",          href: "#como-funciona" },
    { label: "Cidades disponíveis",    href: "#cidades" },
  ],
  "Para Profissionais": [
    { label: "Área do cerimonialista", href: "/cerimonialistas/dashboard" },
    { label: "Mural de leads",         href: "/cerimonialistas/leads" },
    { label: "Cadastre seu espaço",    href: "/auth/cadastro" },
  ],
  Institucional: [
    { label: "Sobre o Nupcial Hub",    href: "#" },
    { label: "Termos de uso",          href: "#" },
    { label: "Política de privacidade", href: "#" },
  ],
} as const;

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-rim/40 bg-surface/50">
      <div className="container-app section-gap-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-16">

          {/* ── Marca ─────────────────────────────────────────────── */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-void" />
              </div>
              <span className="font-display text-lg font-bold text-ivory">
                Nupcial<span className="text-gradient-gold ml-0.5">Hub</span>
              </span>
            </Link>
            <p className="mt-3 text-xs text-ash leading-relaxed max-w-[240px]">
              O ecossistema de inteligência para casamentos e eventos
              em Curitiba e Região Metropolitana.
            </p>

            {/* Redes sociais */}
            <div className="flex items-center gap-3 mt-5">
              {[
                { icon: Instagram, label: "Instagram", href: "#" },
                { icon: Linkedin,  label: "LinkedIn",  href: "#" },
                { icon: Mail,      label: "E-mail",    href: "mailto:contato@nupcialhub.com.br" },
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  aria-label={label}
                  className="w-8 h-8 rounded-lg bg-raised border border-rim flex items-center justify-center text-ash hover:text-gold-400 hover:border-gold-400/30 transition-all duration-200"
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* ── Colunas de links ───────────────────────────────────── */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-xs font-bold uppercase tracking-[0.12em] text-ivory mb-4 font-body">
                {title}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-xs text-ash hover:text-gold-400 transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Bottom bar ──────────────────────────────────────────── */}
        <div className="divider-gold mt-10 mb-6" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-2xs text-ash">
            &copy; {year} Nupcial Hub. Todos os direitos reservados.
          </p>
          <p className="text-2xs text-ash/60">
            Feito em Curitiba, PR
          </p>
        </div>
      </div>
    </footer>
  );
}

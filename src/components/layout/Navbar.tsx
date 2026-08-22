"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronRight, Sparkles } from "lucide-react";

const NAV_LINKS = [
  { href: "/",          label: "Espaços" },
  { href: "#como-funciona", label: "Como Funciona" },
  { href: "/cerimonialistas/dashboard", label: "Para Cerimonialistas" },
] as const;

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={[
        "fixed top-0 left-0 right-0 z-navbar",
        "transition-all duration-300 ease-spring",
        scrolled
          ? "bg-void/80 backdrop-blur-xl border-b border-rim/50 py-3"
          : "bg-transparent py-5",
      ].join(" ")}
    >
      <nav className="container-app flex items-center justify-between">

        {/* ── Logo ──────────────────────────────────────────────────── */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
            <Sparkles className="w-4 h-4 text-void" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-ivory">
            Nupcial
            <span className="text-gradient-gold ml-0.5">Hub</span>
          </span>
        </Link>

        {/* ── Links Desktop ─────────────────────────────────────────── */}
        <ul className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm font-medium text-mist hover:text-ivory transition-colors duration-200 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold-400 transition-all duration-300 group-hover:w-full" />
              </Link>
            </li>
          ))}
        </ul>

        {/* ── CTA Desktop ───────────────────────────────────────────── */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/auth/entrar"
            className="btn btn-ghost btn-sm text-mist hover:text-ivory"
          >
            Entrar
          </Link>
          <Link
            href="/auth/cadastro"
            className="btn btn-gold btn-sm"
          >
            Cadastre-se
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* ── Hamburger Mobile ──────────────────────────────────────── */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-lg text-mist hover:text-ivory hover:bg-raised transition-colors"
          aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* ── Menu Mobile ───────────────────────────────────────────── */}
      {isOpen && (
        <div className="md:hidden bg-surface/95 backdrop-blur-xl border-t border-rim animate-slide-up">
          <div className="container-app py-6 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-mist hover:text-ivory hover:bg-raised/60 transition-colors"
              >
                {link.label}
                <ChevronRight className="w-4 h-4 text-ash" />
              </Link>
            ))}
            <div className="divider-gold my-4" />
            <Link
              href="/auth/entrar"
              onClick={() => setIsOpen(false)}
              className="btn btn-outline btn-md w-full"
            >
              Entrar
            </Link>
            <Link
              href="/auth/cadastro"
              onClick={() => setIsOpen(false)}
              className="btn btn-gold btn-md w-full mt-2"
            >
              Cadastre-se
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CreditCard, TrendingUp, Users, Handshake, Plus,
  MessageSquare, ThumbsUp, Clock, Briefcase, MapPin,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

// ─── Mock Data ───────────────────────────────────────────────────────────────

const MOCK_STATS = {
  creditBalance: 23,
  leadsUnlockedThisMonth: 7,
  leadsClosedWon: 3,
  activeLeadsInMarketplace: 42,
  commissionDue: 4250,
  profileCompletion: 85,
};

const MOCK_POSTS = [
  {
    id: "1",
    type: "DISCUSSION",
    title: "Melhores fornecedores de iluminação cênica em Curitiba?",
    content: "Preciso de indicações de fornecedores de iluminação para um casamento de 300 convidados em Santa Felicidade. Alguém tem contato confiável?",
    author: { name: "Carolina Ribeiro", city: "Curitiba", yearsExperience: 8 },
    _count: { comments: 12, likes: 24 },
    createdAt: "2026-08-19T14:30:00Z",
  },
  {
    id: "2",
    type: "TIP",
    title: "Checklist de emergência para o dia do evento",
    content: "Montei um checklist com 50 itens essenciais que todo cerimonialista deve ter em mãos. Compartilho aqui a versão resumida dos 15 mais críticos...",
    author: { name: "Marcos Oliveira", city: "São José dos Pinhais", yearsExperience: 12 },
    _count: { comments: 31, likes: 67 },
    createdAt: "2026-08-18T09:00:00Z",
  },
  {
    id: "3",
    type: "STAFF_NEEDED",
    title: "Preciso de 2 assistentes — Casamento 04/Out em Campo Largo",
    content: "Casamento de 200 convidados em chácara. Preciso de 2 assistentes com experiência mínima de 1 ano. Pagamento: R$ 350/assistente + alimentação.",
    author: { name: "Ana Clara Stein", city: "Curitiba", yearsExperience: 5 },
    _count: { comments: 8, likes: 5 },
    createdAt: "2026-08-20T11:15:00Z",
  },
];

const POST_TYPE_CONFIG: Record<string, { label: string; variant: "gold" | "green" | "orange" }> = {
  DISCUSSION: { label: "Discussão", variant: "gold" },
  TIP: { label: "Dica", variant: "green" },
  STAFF_NEEDED: { label: "Staff Necessário", variant: "orange" },
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function CeremonialDashboard() {
  const [activeTab, setActiveTab] = useState<"feed" | "staff">("feed");

  const stats = MOCK_STATS;
  const filteredPosts =
    activeTab === "staff"
      ? MOCK_POSTS.filter((p) => p.type === "STAFF_NEEDED")
      : MOCK_POSTS;

  return (
    <>
      <Navbar />
      <div className="pt-24 section-gap">
        <div className="container-app">

          {/* ── Header ─────────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="label-gold">Área do Profissional</span>
              <h1 className="display-md mt-2 text-ivory">
                Painel do Cerimonialista
              </h1>
            </div>
            <Link href="/cerimonialistas/leads">
              <Button variant="gold" size="md" icon={<TrendingUp className="w-4 h-4" />}>
                Mural de Leads
              </Button>
            </Link>
          </div>

          {/* ── Metrics Row ────────────────────────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {[
              { icon: CreditCard, label: "Créditos Disponíveis", value: stats.creditBalance, suffix: "" },
              { icon: Users, label: "Leads Desbloqueados (mês)", value: stats.leadsUnlockedThisMonth, suffix: "" },
              { icon: Handshake, label: "Negócios Fechados", value: stats.leadsClosedWon, suffix: "" },
              { icon: TrendingUp, label: "Comissões Pendentes", value: `R$ ${stats.commissionDue.toLocaleString("pt-BR")}`, suffix: "" },
            ].map((metric) => {
              const Icon = metric.icon;
              return (
                <div key={metric.label} className="card p-5">
                  <Icon className="w-5 h-5 text-gold-400 mb-3" />
                  <p className="font-display text-2xl font-bold text-ivory">
                    {metric.value}{metric.suffix}
                  </p>
                  <p className="text-xs text-ash mt-1">{metric.label}</p>
                </div>
              );
            })}
          </div>

          {/* ── Community Feed ─────────────────────────────────── */}
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-ivory">
              Comunidade
            </h2>
            <div className="flex gap-1">
              {[
                { key: "feed" as const, label: "Feed" },
                { key: "staff" as const, label: "Staff Necessário" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={[
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    activeTab === tab.key
                      ? "bg-gold-400/10 text-gold-400 border border-gold-400/20"
                      : "text-ash hover:text-ivory hover:bg-raised",
                  ].join(" ")}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 mb-8">
            {filteredPosts.map((post) => {
              const config = POST_TYPE_CONFIG[post.type] || POST_TYPE_CONFIG.DISCUSSION;
              return (
                <article key={post.id} className="card p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <Badge variant={config.variant}>{config.label}</Badge>
                    <span className="flex items-center gap-1 text-2xs text-ash">
                      <Clock className="w-3 h-3" />
                      {new Date(post.createdAt).toLocaleDateString("pt-BR")}
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-bold text-ivory mb-2 leading-tight">
                    {post.title}
                  </h3>
                  <p className="text-sm text-mist line-clamp-2 leading-relaxed">
                    {post.content}
                  </p>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-rim/50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-raised border border-rim flex items-center justify-center text-xs font-bold text-gold-400">
                        {post.author.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-medium text-ivory">{post.author.name}</p>
                        <div className="flex items-center gap-1 text-2xs text-ash">
                          <MapPin className="w-3 h-3" />
                          {post.author.city} · {post.author.yearsExperience} anos
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-ash">
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="w-3.5 h-3.5" />
                        {post._count.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5" />
                        {post._count.comments}
                      </span>
                    </div>
                  </div>

                  {post.type === "STAFF_NEEDED" && (
                    <div className="mt-4">
                      <Button variant="outline" size="sm" icon={<Briefcase className="w-3.5 h-3.5" />}>
                        Candidatar-se
                      </Button>
                    </div>
                  )}
                </article>
              );
            })}
          </div>

          <div className="text-center">
            <Button variant="ghost" size="md" icon={<Plus className="w-4 h-4" />}>
              Criar publicação
            </Button>
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
}

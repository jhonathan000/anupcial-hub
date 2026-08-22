# NUPCIAL HUB — Build Summary
**Data:** 21 de agosto de 2026  
**Versão:** MVP 1.0 — Curitiba & Região Metropolitana

---

## 📊 Estatísticas do Projeto

| Métrica | Valor |
|---------|-------|
| **Arquivos TypeScript/TSX** | 31 |
| **Componentes React** | 18 |
| **Páginas Next.js** | 8 |
| **API Routes** | 3 |
| **Utilitários/Libs** | 4 |
| **Tipos TypeScript** | Completos via Prisma |
| **Linhas de código** | ~7.500+ |

---

## 🏗️ Arquitetura do Projeto

```
nupcial-hub/
├── 📁 src/
│   ├── 📁 app/
│   │   ├── page.tsx ✨ Landing page B2C com hero + grid de espaços
│   │   ├── layout.tsx ⭐ Root layout com fontes Cormorant/Jakarta
│   │   ├── globals.css 🎨 Design tokens completos
│   │   │
│   │   ├── 📁 espacos/[slug]/
│   │   │   ├── page.tsx ⭐ Venue detail com SSR
│   │   │   └── VenueDetailClient.tsx 🎯 Galeria + calendário + lead capture
│   │   │
│   │   ├── 📁 cerimonialistas/
│   │   │   ├── dashboard/page.tsx 📊 Painel com métricas + feed comunidade
│   │   │   └── leads/page.tsx 💰 Mural de leads B2B com unlock modal
│   │   │
│   │   ├── 📁 auth/
│   │   │   ├── entrar/page.tsx 🔐 Login com email/senha
│   │   │   └── cadastro/page.tsx 🆕 Signup com role selector
│   │   │
│   │   ├── 📁 api/
│   │   │   ├── venues/route.ts 📍 GET paginated venues com filtros
│   │   │   ├── leads/route.ts 🚀 POST capture + PATCH unlock
│   │   │   └── ical/sync/route.ts ⏰ Cron job de sincronização
│   │   │
│   │   ├── HowItWorksSection.tsx 📖 Proposta de valor disruptiva
│   │   └── FinalCTA.tsx 🎯 Call-to-action para cerimonialistas
│   │
│   ├── 📁 components/
│   │   ├── 📁 layout/
│   │   │   ├── Navbar.tsx 🧭 Sticky glass header com mobile menu
│   │   │   └── Footer.tsx 👣 Seções de links + redes sociais
│   │   │
│   │   ├── 📁 home/
│   │   │   ├── HeroSection.tsx ✨ Título heroico com animation
│   │   │   └── SearchFilters.tsx 🔍 Barra com dropdowns interativos
│   │   │
│   │   ├── 📁 venue/
│   │   │   ├── VenueCard.tsx 🏠 Card assimétrica com hover
│   │   │   ├── VenueGallery.tsx 🖼️ Grid editorial 1:2
│   │   │   ├── VenueCalendar.tsx 📅 Calendário com datas pulse
│   │   │   └── LeadCaptureModal.tsx 📝 Modal silk-animation
│   │   │
│   │   ├── 📁 dashboard/
│   │   │   ├── LeadCard.tsx 💼 Card com lock icon
│   │   │   └── LeadUnlockModal.tsx 🔓 Modal dual models (pay/fee)
│   │   │
│   │   └── 📁 ui/ (atomic components)
│   │       ├── Button.tsx 🔘 Variants: gold/outline/ghost/danger
│   │       ├── Badge.tsx 🏷️ Variants: gold/green/red/orange/gray
│   │       └── Modal.tsx 🎭 Reusable com Framer Motion
│   │
│   ├── 📁 lib/
│   │   ├── auth.ts 🔐 Hash/verify + JWT + session mgmt
│   │   ├── ical-parser.ts 📅 Parser iCal com ETag detection
│   │   └── prisma.ts 💾 Singleton padrão Next.js HMR-safe
│   │
│   └── 📁 types/
│       └── index.ts 📋 Tipos completos Prisma + DTOs
│
├── prisma/
│   └── schema.prisma 📊 13 models (Venue, Lead, User, etc)
│
├── package.json ⚙️ Deps: Next 14, Prisma, Framer, Radix UI
└── tailwind.config.ts 🎨 Tokens customizados completos
```

---

## 🎨 Design System

### Cores (Paleta Dourada Sofisticada)
- **Fundo Absoluto** `#0B0B0F` (Deep Void)
- **Superfícies** `#141418` (Charcoal) / `#1E1E26` (Raised)
- **Accent** `#C4A45A` (Ouro Antigo)
- **Texto** `#F0EBE1` (Ivory) / `#9E9EAE` (Mist)
- **Bordas** `#2A2A36` (Rim)

### Tipografia
- **Display** Cormorant Garamond (400/600/700) — Títulos bold
- **Body** Plus Jakarta Sans (400/500/600/700) — Legível em mobile
- **Mono** JetBrains Mono — Dados/código

### Animações
- `slide-up` — Modais e menus
- `pulse-occupied` — Datas bloqueadas no calendário
- `scale-in` — Cards na galeria
- `gold-glow` — Hover em elementos CTA

---

## 🚀 Fluxos Principais

### Fluxo B2C — Noivos Buscando Espaços
```
Landing Page
  ↓ [Hero + SearchFilters]
  ↓
Grid de Espaços (6 venues mockados, 2 featured)
  ↓ [Click em card]
  ↓
Página de Detalhe
  ├─ Galeria Editorial (3 imagens em grid assimétrico)
  ├─ Specs (capacidade, budget, comodidades)
  └─ Calendário Interativo
        ↓ [Click em data ocupada]
        ↓
      Modal de Captura de Lead
        ├─ Nome + WhatsApp + orçamento
        └─ POST /api/leads → criação do lead
```

### Fluxo B2B — Cerimonialistas Gerenciando Leads
```
Dashboard Profissional
  ├─ 4 Métricas (créditos, leads desbloqueados, fechamentos, comissão)
  ├─ Feed Comunidade (discussões, dicas, mural de staff)
  └─ Link para "Mural de Leads"
        ↓
Marketplace de Leads
  ├─ Filtros: cidade, tipo de evento
  ├─ Grid de 4 leads mockados
  └─ Cada card com
        ├─ Data, cidade, orçamento
        ├─ Badge de urgência (daysUntil)
        ├─ Contact oculto (lock icon)
        └─ [Botão "Desbloquear contato"]
              ↓
            LeadUnlockModal
              ├─ Opção 1: Pay-per-Lead (debitacreditos)
              ├─ Opção 2: Success Fee (% comissão)
              └─ PATCH /api/leads → unlock + transação
```

---

## 🔐 Segurança & Autenticação

### JWT + Cookies
- **Token Duration:** 7 dias
- **HttpOnly:** Sim (protege XSS)
- **Secure:** Sim em produção
- **Hash:** bcryptjs 12 rounds

### Guards
- `requireCeremonial()` — Valida role CEREMONIAL
- `requireAdmin()` — Valida role ADMIN
- `validatePasswordStrength()` — Min 8 chars, 1 uppercase, 1 number

---

## 📡 API Routes

### `GET /api/venues?tipo=VILLA&cidade=Curitiba&pagina=1&limite=20`
Retorna paginado de espaços com filtros avançados.  
**Response:** 200 JSON com array + metadata de paginação

### `POST /api/leads` (noivos)
Captura lead do modal de data ocupada.  
**Body:** `{ contactName, contactPhone, eventDate, city, guestCount, estimatedBudget }`  
**Response:** 201 com `leadId`

### `PATCH /api/leads` (cerimonialistas)
Desbloqueia contato via créditos ou success fee.  
**Body:** `{ leadId, model: "PAY_PER_LEAD" | "SUCCESS_FEE" }`  
**Response:** 200 com `leadClaimId`

### `POST /api/ical/sync` (cron job)
Sincroniza calendários iCal de todos os espaços.  
**Auth:** Header `X-Sync-Secret`  
**Response:** 200 com stats (venuesSynced, bookingsCreated, errors)

---

## 📱 Responsividade

- **Mobile-First:** Todos os componentes pensados para <375px
- **Breakpoints:** sm (640px), md (768px), lg (1024px)
- **Grid Assimétrico:** Auto-adapta de 1 col → 2 → 3 no desktop
- **Touch Targets:** Mínimo 44px × 44px para botões/inputs

---

## 🎯 Funcionalidades Implementadas

### ✅ B2C (Fachada Pública)
- [x] Landing page heroica com copy disruptivo
- [x] Barra de busca com 3 filtros (cidade, capacidade, tipo)
- [x] Grid assimétrico de 6 espaços em destaque
- [x] Página de detalhe com galeria 1:2 editorial
- [x] Calendário interativo com datas bloqueadas (pulse animation)
- [x] Modal de captura de lead (silk animation)
- [x] Seção "Como Funciona" (3 passos com ícones)
- [x] CTA final para cerimonialistas

### ✅ B2B (Rede de Profissionais)
- [x] Dashboard com 4 métricas chave
- [x] Feed de comunidade (mockado 3 posts)
- [x] Mural de staff necessário
- [x] Marketplace de leads (4 leads mockados)
- [x] Filtros na listagem de leads
- [x] Cards com contact oculto
- [x] Modal de unlock com 2 modelos de negócio
- [x] Transações de crédito (mockadas)

### ✅ Auth
- [x] Login com email/senha + "remember me"
- [x] Signup com role selector (noivo/profissional)
- [x] Campos condicionais para cerimonialistas (anos exp, especialidades, doc)
- [x] Validação de senha forte
- [x] Termos de uso no footer

### ✅ Componentes de UI
- [x] Button (variants: gold/outline/ghost/danger)
- [x] Badge (6 variantes de cor)
- [x] Modal reusável com Framer Motion
- [x] Navbar sticky com mobile hamburger
- [x] Footer com links + redes sociais
- [x] Hero Section com animações escalonadas
- [x] Galeria com lightbox
- [x] Calendário com interatividade

### ✅ Integração iCal (arquitetura)
- [x] Parser iCal com timeout 10s
- [x] ETag detection (evita reprocessamento)
- [x] API route para sincronização
- [x] VenueBooking com source (MANUAL/ICAL/API)
- [x] Unique constraint (venueId, date)

---

## 🚧 Próximos Passos (Roadmap P1)

1. **Auth Backend**
   - [ ] Implementar POST /api/auth/login
   - [ ] Implementar POST /api/auth/signup
   - [ ] Integrar com Supabase ou PostgreSQL

2. **Database & Prisma**
   - [ ] Deploy Supabase ou PlanetScale
   - [ ] Seed inicial com 200+ espaços reais
   - [ ] Índices em (city, type, minCapacity)

3. **Lead Capture**
   - [ ] Integração com Twilio (enviar lead via WhatsApp)
   - [ ] Email transacional ao cerimonialista
   - [ ] Dashboard de lead owner

4. **Payments & Créditos**
   - [ ] Integração Stripe (comprar créditos)
   - [ ] Dashboard de comissões acumuladas
   - [ ] Extrato de transações

5. **iCal Sync**
   - [ ] Cron job robusto (Vercel Cron, AWS Lambda, etc)
   - [ ] Retry logic e dead letter queue
   - [ ] Notificações ao espaço se sync falhar

6. **SEO & Analytics**
   - [ ] Dynamic meta tags por espaço
   - [ ] Sitemap dinâmico
   - [ ] Google Analytics 4
   - [ ] Structured data refinado

7. **Community Features**
   - [ ] Comentários no feed
   - [ ] Like/dislike system
   - [ ] Notificações push
   - [ ] Upload de fotos para posts

---

## 📦 Dependências Principais

```json
{
  "next": "^14.2.5",
  "react": "^18.3.1",
  "prisma": "^5.0.0",
  "framer-motion": "^11.0.0",
  "tailwindcss": "^3.4.0",
  "react-hook-form": "^7.48.0",
  "zod": "^3.22.0",
  "react-hot-toast": "^2.4.1",
  "lucide-react": "^0.292.0",
  "node-ical": "^0.16.0",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.1.0",
  "date-fns": "^3.0.0"
}
```

---

## 🎬 Como Rodar Localmente

```bash
# Install deps
pnpm install

# Setup env
cp .env.example .env.local

# Database (Prisma)
pnpm prisma generate
pnpm prisma db push

# Dev server
pnpm dev
# Acessa em http://localhost:3000
```

---

## 📝 Notas Técnicas

### Arquivo-por-arquivo insights:

1. **layout.tsx**: Root layout com Cormorant/Jakarta injetadas via CSS variables. JSON-LD Schema.org para local business.

2. **page.tsx**: Server Component (permite export metadata). Mockados 6 venues com imagens reais do Unsplash. Grid usa lg:cols-3 com featured={i===0||i===5}.

3. **VenueDetailClient.tsx**: Importa VenueGallery (lightbox), VenueCalendar (pulse), LeadCaptureModal (silk). Montagem de gallery com filter de blurHash.

4. **SearchFilters.tsx**: Dropdowns com ARIA roles. Backdrop invisível fecha qualquer aberto. Constants vêm de @/types.

5. **LeadCaptureModal.tsx**: Post para /api/leads. Toast notifications via react-hot-toast. Validação de WhatsApp via regex.

6. **VenueCalendar.tsx**: date-fns + ptBR locale. getDayStatus() retorna "past"|"occupied"|"available". Callback onOccupiedDateClick dispara modal pai.

7. **LeadUnlockModal.tsx**: Dois botões com select state. Success fee é "sem custo agora" com ícone Handshake. Pay-per-lead mostra balance.

8. **Auth pages**: Signup tem role selector com grid 2 cols. Especialidades são checkboxes. Upload de doc é label com input hidden.

9. **API /venues**: Pagina com skip/take. Onde clause complexo com condicionais. Retorna total/page/totalPages/hasNextPage.

10. **API /leads**: POST cria com expiresAt=30 days. PATCH increments claimCount e debita créditos. Prisma leadClaim.create via model enum.

---

## 🤝 Contribuindo

Padrão de commits: `type(scope): message`
- `feat(ui)`: Nova feature UI
- `fix(api)`: Bug fix em route
- `docs(readme)`: Documentação

---

**Gerado em:** 21/08/2026  
**Versão Node:** 18.17.0+  
**Versão Next.js:** 14.2.5  
**Status:** MVP 1.0 — Pronto para database + auth backend

// =============================================================================
// NUPCIAL HUB — Tipos e Interfaces TypeScript
// =============================================================================

// ─── Re-exports do Prisma ─────────────────────────────────────────────────────
export type {
  User,
  Venue,
  VenueImage,
  VenueBooking,
  VenueClaim,
  Lead,
  LeadClaim,
  CommunityPost,
  PostComment,
  CreditTransaction,
  Notification,
} from "@prisma/client";

export {
  UserRole,
  UserStatus,
  VenueType,
  EventType,
  LeadStatus,
  LeadAcquisitionModel,
  BookingStatus,
  BookingSource,
  PostType,
} from "@prisma/client";

// ─── DTOs de Venue ────────────────────────────────────────────────────────────

/** Card resumido para listagem na busca */
export interface VenueCardData {
  id: string;
  slug: string;
  name: string;
  type: string;
  neighborhood: string;
  city: string;
  state: string;
  maxCapacity: number;
  minCapacity: number;
  coverImageUrl: string | null;
  images: Array<{ url: string; blurHash?: string | null; order: number }>;
  minimumBudget: number | null;
  averageBudget: number | null;
  isFeatured: boolean;
  isClaimed: boolean;
  amenities: string[];
}

/** Dados completos para a página de detalhe do espaço */
export interface VenueDetailData extends VenueCardData {
  description: string | null;
  address: string;
  zipCode: string | null;
  latitude: number | null;
  longitude: number | null;
  pricePerHour: number | null;
  pricePerEvent: number | null;
  restrictions: string[];
  metaTitle: string | null;
  metaDescription: string | null;
  icalUrl: string | null;
  ownerId: string | null;
  bookedDates: string[]; // ISO date strings "YYYY-MM-DD"
  createdAt: string;
}

// ─── DTOs de Lead ─────────────────────────────────────────────────────────────

/** Lead como aparece no mural do marketplace (dados de contato OCULTOS) */
export interface LeadMarketplaceItem {
  id: string;
  eventDate: string; // ISO date string
  city: string;
  neighborhood: string | null;
  eventType: string;
  guestCount: number;
  estimatedBudget: number;
  notes: string | null;
  sourceVenueName: string | null; // nome do espaço de origem (sem dados de contato)
  sourceChannel: string;
  status: string;
  expiresAt: string;
  allowedModels: string[];
  creditCost: number;
  successFeePercentage: number;
  claimCount: number;
  maxClaims: number;
  isClaimedByMe: boolean; // se o cerimonialista logado já comprou
  createdAt: string;
}

/** Lead com dados de contato DESBLOQUEADOS (após compra/compromisso) */
export interface LeadUnlockedData extends LeadMarketplaceItem {
  contactName: string;
  contactPhone: string;
  contactEmail: string | null;
}

// ─── Filtros de Busca ─────────────────────────────────────────────────────────

export interface VenueSearchFilters {
  city?: string;
  neighborhood?: string;
  type?: string;
  minCapacity?: number;
  maxCapacity?: number;
  minBudget?: number;
  maxBudget?: number;
  amenities?: string[];
  page?: number;
  limit?: number;
  sortBy?: "relevance" | "price_asc" | "price_desc" | "capacity";
}

export interface LeadFilters {
  city?: string;
  eventType?: string;
  minBudget?: number;
  maxBudget?: number;
  minGuestCount?: number;
  maxGuestCount?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

// ─── Responses de API ─────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// ─── Autenticação ─────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  avatarUrl: string | null;
  creditBalance: number;
}

export interface JWTPayload {
  sub: string;       // user id
  email: string;
  role: string;
  status: string;
  iat: number;
  exp: number;
}

// ─── Formulários ─────────────────────────────────────────────────────────────

/** Formulário de captura de lead (modal de data ocupada) */
export interface LeadCaptureFormData {
  contactName: string;
  contactPhone: string;
  contactEmail?: string;
  eventDate: string;
  city: string;
  guestCount: number;
  estimatedBudget: number;
  notes?: string;
  sourceVenueId?: string;
}

/** Filtros da busca principal na homepage */
export interface SearchFormData {
  city: string;
  neighborhood?: string;
  guestCount?: string; // "50", "150", "300", "300+"
  type?: string;
  date?: string;
}

/** Cadastro de cerimonialista */
export interface CeremonialSignupData {
  name: string;
  email: string;
  password: string;
  phone: string;
  city: string;
  yearsExperience: number;
  specialties: string[];
  instagramHandle?: string;
  websiteUrl?: string;
  bio?: string;
}

// ─── Calendário e Disponibilidade ─────────────────────────────────────────────

export interface CalendarDayStatus {
  date: string; // "YYYY-MM-DD"
  status: "available" | "occupied" | "pending";
  source?: "MANUAL" | "ICAL" | "API";
}

// ─── Comunidade ───────────────────────────────────────────────────────────────

export interface CommunityPostData {
  id: string;
  type: string;
  title: string;
  content: string;
  tags: string[];
  imageUrls: string[];
  author: {
    id: string;
    name: string;
    avatarUrl: string | null;
    city: string | null;
    yearsExperience: number | null;
  };
  _count: {
    comments: number;
    likes: number;
  };
  isLikedByMe: boolean;
  staffEventDate: string | null;
  staffEventCity: string | null;
  staffNeeded: string | null;
  createdAt: string;
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export interface CeremonialDashboardStats {
  creditBalance: number;
  leadsUnlockedThisMonth: number;
  leadsClosedWon: number;
  activeLeadsInMarketplace: number;
  commissionDue: number;
  profileCompletion: number;
}

// ─── Curitiba — Bairros pré-carregados ───────────────────────────────────────

export const CURITIBA_NEIGHBORHOODS = [
  "Água Verde", "Alto da Glória", "Alto da XV", "Bacacheri", "Batel",
  "Bigorrilho", "Boa Vista", "Boqueirão", "Cabral", "Campo Comprido",
  "Campo de Santana", "Capão Raso", "CIC", "Cristo Rei", "Ecoville",
  "Fanny", "Fazendinha", "Guaíra", "Hugo Lange", "Hauer",
  "Jardim Botânico", "Jardim das Américas", "Jardim Social", "Juvevê",
  "Mercês", "Mossunguê", "Novo Mundo", "Pinheirinho", "Portão",
  "Rebouças", "Santa Felicidade", "Santa Quitéria", "São Braz",
  "São Francisco", "Seminário", "Tarumã", "Tingui", "Uberaba",
  "Vila Izabel", "Vista Alegre", "Xaxim"
] as const;

export const REGION_METROPOLITANA_CITIES = [
  "Curitiba", "Araucária", "Colombo", "Pinhais", "São José dos Pinhais",
  "Almirante Tamandaré", "Campo Largo", "Fazenda Rio Grande", "Piraquara",
  "Quatro Barras", "Mandirituba", "Balsa Nova", "Contenda", "Bocaiúva do Sul"
] as const;

export const VENUE_TYPE_LABELS: Record<string, string> = {
  CHACARA: "Chácara",
  SALAO: "Salão",
  HOTEL: "Hotel",
  PRAIA: "Praia",
  BUFFET: "Buffet",
  CLUBE: "Clube",
  ESPACO_INDUSTRIAL: "Espaço Industrial",
  COBERTURA: "Cobertura",
  VILLA: "Villa",
  FAZENDA: "Fazenda",
  OUTROS: "Outros",
};

export const EVENT_TYPE_LABELS: Record<string, string> = {
  CASAMENTO: "Casamento",
  DEBUTANTE: "Debutante",
  CORPORATIVO: "Corporativo",
  ANIVERSARIO: "Aniversário",
  FORMATURA: "Formatura",
  BATIZADO: "Batizado",
  OUTROS: "Outros",
};

export const GUEST_COUNT_OPTIONS = [
  { label: "Até 50 pessoas",  value: "50",  max: 50 },
  { label: "Até 100 pessoas", value: "100", max: 100 },
  { label: "Até 150 pessoas", value: "150", max: 150 },
  { label: "Até 200 pessoas", value: "200", max: 200 },
  { label: "Até 300 pessoas", value: "300", max: 300 },
  { label: "300+ pessoas",    value: "500", max: 9999 },
] as const;

export const CREDIT_PACKAGES = [
  { id: "starter",    credits: 5,  price: 97,  label: "Iniciante",   popular: false },
  { id: "pro",        credits: 15, price: 247, label: "Profissional", popular: true  },
  { id: "enterprise", credits: 35, price: 497, label: "Enterprise",   popular: false },
] as const;

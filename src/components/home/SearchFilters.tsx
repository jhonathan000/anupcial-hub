"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Users, Building2, ChevronDown } from "lucide-react";
import {
  REGION_METROPOLITANA_CITIES,
  GUEST_COUNT_OPTIONS,
  VENUE_TYPE_LABELS,
} from "@/types";

interface FilterState {
  city: string;
  guestCount: string;
  type: string;
}

export default function SearchFilters() {
  const router = useRouter();
  const [filters, setFilters] = useState<FilterState>({
    city: "",
    guestCount: "",
    type: "",
  });
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const update = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setOpenDropdown(null);
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (filters.city) params.set("cidade", filters.city);
    if (filters.guestCount) params.set("capacidade", filters.guestCount);
    if (filters.type) params.set("tipo", filters.type);
    router.push(`/?${params.toString()}#resultados`);
  };

  return (
    <section id="busca" className="relative z-20 -mt-8 sm:-mt-10">
      <div className="container-app">
        <div className="card-glass rounded-2xl p-2 sm:p-3 shadow-card-lg border border-rim/40">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">

            {/* ── Cidade ────────────────────────────────────────────── */}
            <FilterDropdown
              id="city"
              icon={<MapPin className="w-4 h-4 text-gold-400" />}
              label="Cidade"
              value={filters.city || "Todas as cidades"}
              isOpen={openDropdown === "city"}
              onToggle={() => setOpenDropdown(openDropdown === "city" ? null : "city")}
            >
              <DropdownItem
                label="Todas as cidades"
                selected={filters.city === ""}
                onClick={() => update("city", "")}
              />
              {REGION_METROPOLITANA_CITIES.map((city) => (
                <DropdownItem
                  key={city}
                  label={city}
                  selected={filters.city === city}
                  onClick={() => update("city", city)}
                />
              ))}
            </FilterDropdown>

            {/* ── Capacidade ────────────────────────────────────────── */}
            <FilterDropdown
              id="guests"
              icon={<Users className="w-4 h-4 text-gold-400" />}
              label="Convidados"
              value={
                GUEST_COUNT_OPTIONS.find((o) => o.value === filters.guestCount)?.label
                || "Qualquer quantidade"
              }
              isOpen={openDropdown === "guests"}
              onToggle={() => setOpenDropdown(openDropdown === "guests" ? null : "guests")}
            >
              <DropdownItem
                label="Qualquer quantidade"
                selected={filters.guestCount === ""}
                onClick={() => update("guestCount", "")}
              />
              {GUEST_COUNT_OPTIONS.map((opt) => (
                <DropdownItem
                  key={opt.value}
                  label={opt.label}
                  selected={filters.guestCount === opt.value}
                  onClick={() => update("guestCount", opt.value)}
                />
              ))}
            </FilterDropdown>

            {/* ── Tipo de Espaço ─────────────────────────────────────── */}
            <FilterDropdown
              id="type"
              icon={<Building2 className="w-4 h-4 text-gold-400" />}
              label="Tipo"
              value={
                filters.type
                  ? VENUE_TYPE_LABELS[filters.type] || filters.type
                  : "Todos os tipos"
              }
              isOpen={openDropdown === "type"}
              onToggle={() => setOpenDropdown(openDropdown === "type" ? null : "type")}
            >
              <DropdownItem
                label="Todos os tipos"
                selected={filters.type === ""}
                onClick={() => update("type", "")}
              />
              {Object.entries(VENUE_TYPE_LABELS).map(([key, label]) => (
                <DropdownItem
                  key={key}
                  label={label}
                  selected={filters.type === key}
                  onClick={() => update("type", key)}
                />
              ))}
            </FilterDropdown>

            {/* ── Botão de Busca ──────────────────────────────────────── */}
            <button
              type="button"
              onClick={handleSearch}
              className="btn btn-gold btn-lg rounded-xl w-full gap-2 text-sm font-bold"
            >
              <Search className="w-4 h-4" />
              Buscar Espaços
            </button>
          </div>
        </div>
      </div>

      {/* Backdrop para fechar dropdowns */}
      {openDropdown && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setOpenDropdown(null)}
          aria-hidden="true"
        />
      )}
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Sub-componentes internos
   ═══════════════════════════════════════════════════════════════════════════ */

function FilterDropdown({
  id,
  icon,
  label,
  value,
  isOpen,
  onToggle,
  children,
}: {
  id: string;
  icon: React.ReactNode;
  label: string;
  value: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative z-20">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`dropdown-${id}`}
        className={[
          "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl",
          "text-left transition-all duration-200",
          isOpen
            ? "bg-raised border border-gold-400/30"
            : "bg-raised/60 border border-transparent hover:bg-raised hover:border-rim",
        ].join(" ")}
      >
        {icon}
        <div className="flex-1 min-w-0">
          <p className="text-2xs uppercase tracking-[0.1em] text-ash leading-none mb-0.5">
            {label}
          </p>
          <p className="text-sm font-medium text-ivory truncate">{value}</p>
        </div>
        <ChevronDown
          className={[
            "w-4 h-4 text-ash transition-transform duration-200",
            isOpen ? "rotate-180" : "",
          ].join(" ")}
        />
      </button>

      {isOpen && (
        <div
          id={`dropdown-${id}`}
          role="listbox"
          className={[
            "absolute top-full left-0 right-0 mt-1",
            "bg-surface border border-rim rounded-xl shadow-modal",
            "max-h-60 overflow-y-auto",
            "animate-scale-in origin-top",
            "py-1",
          ].join(" ")}
        >
          {children}
        </div>
      )}
    </div>
  );
}

function DropdownItem({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      onClick={onClick}
      className={[
        "w-full text-left px-4 py-2.5 text-sm transition-colors duration-150",
        selected
          ? "text-gold-400 bg-gold-400/5 font-medium"
          : "text-mist hover:text-ivory hover:bg-raised/60",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

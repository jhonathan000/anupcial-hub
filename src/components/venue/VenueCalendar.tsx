"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  isBefore,
  startOfDay,
  addMonths,
  subMonths,
  getDay,
} from "date-fns";
import { ptBR } from "date-fns/locale";

interface VenueCalendarProps {
  /** Array of ISO date strings "YYYY-MM-DD" that are booked/blocked */
  bookedDates: string[];
  /** Fires when user clicks a booked date (triggers lead capture modal) */
  onOccupiedDateClick: (dateStr: string) => void;
}

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export default function VenueCalendar({
  bookedDates,
  onOccupiedDateClick,
}: VenueCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(() => startOfMonth(new Date()));

  // Parse booked dates into a Set for O(1) lookup
  const bookedSet = useMemo(
    () => new Set(bookedDates),
    [bookedDates]
  );

  const today = startOfDay(new Date());
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Padding days for grid alignment (starts on Sunday = 0)
  const startDayOfWeek = getDay(monthStart);
  const paddingDays = Array.from({ length: startDayOfWeek }, (_, i) => i);

  const handleDayClick = (day: Date) => {
    const dateStr = format(day, "yyyy-MM-dd");
    const isBooked = bookedSet.has(dateStr);
    const isPast = isBefore(day, today);

    if (isPast) return;

    if (isBooked) {
      onOccupiedDateClick(dateStr);
    }
    // Available dates: no action in public view (future: redirect to booking)
  };

  const getDayStatus = (day: Date) => {
    const dateStr = format(day, "yyyy-MM-dd");
    const isPast = isBefore(day, today) && !isToday(day);

    if (isPast) return "past";
    if (bookedSet.has(dateStr)) return "occupied";
    return "available";
  };

  return (
    <div className="card p-5 sm:p-6">
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-ash hover:text-ivory hover:bg-raised transition-colors"
          aria-label="Mês anterior"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <h3 className="font-display text-lg font-semibold text-ivory capitalize tracking-wide">
          {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
        </h3>

        <button
          type="button"
          onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-ash hover:text-ivory hover:bg-raised transition-colors"
          aria-label="Próximo mês"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* ── Weekday headers ────────────────────────────────────── */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAYS.map((wd) => (
          <div
            key={wd}
            className="text-center text-2xs font-semibold uppercase tracking-widest text-ash py-1"
          >
            {wd}
          </div>
        ))}
      </div>

      {/* ── Day grid ───────────────────────────────────────────── */}
      <div className="grid grid-cols-7 gap-1">
        {/* Padding for first week alignment */}
        {paddingDays.map((i) => (
          <div key={`pad-${i}`} className="aspect-square" />
        ))}

        {days.map((day) => {
          const status = getDayStatus(day);
          const dayIsToday = isToday(day);
          const dateStr = format(day, "yyyy-MM-dd");

          return (
            <button
              key={dateStr}
              type="button"
              onClick={() => handleDayClick(day)}
              disabled={status === "past"}
              className={[
                "aspect-square rounded-lg flex items-center justify-center",
                "text-sm font-medium transition-all duration-200 relative",

                // Past
                status === "past" &&
                  "text-rim cursor-not-allowed",

                // Available
                status === "available" && [
                  "text-mist hover:text-ivory hover:bg-raised cursor-default",
                  dayIsToday && "ring-1 ring-gold-400/30 text-ivory",
                ]
                  .flat()
                  .filter(Boolean)
                  .join(" "),

                // Occupied — pulse-silk animation
                status === "occupied" && [
                  "bg-red-500/10 text-red-400 border border-red-500/20",
                  "cursor-pointer hover:bg-red-500/20",
                  "animate-pulse-occupied",
                ]
                  .join(" "),
              ]
                .filter(Boolean)
                .join(" ")}
              aria-label={
                status === "occupied"
                  ? `${format(day, "d 'de' MMMM", { locale: ptBR })} — Data ocupada, clique para receber propostas`
                  : status === "available"
                    ? `${format(day, "d 'de' MMMM", { locale: ptBR })} — Disponível`
                    : undefined
              }
            >
              {format(day, "d")}

              {/* Today dot */}
              {dayIsToday && status !== "occupied" && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gold-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* ── Legend ──────────────────────────────────────────────── */}
      <div className="flex items-center gap-5 mt-5 pt-4 border-t border-rim/50">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-raised border border-rim" />
          <span className="text-2xs text-ash">Disponível</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-red-500/15 border border-red-500/25 animate-pulse-occupied" />
          <span className="text-2xs text-ash">Ocupado</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm ring-1 ring-gold-400/40 bg-raised" />
          <span className="text-2xs text-ash">Hoje</span>
        </div>
      </div>
    </div>
  );
}

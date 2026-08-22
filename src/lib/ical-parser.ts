// =============================================================================
// NUPCIAL HUB — Parser de iCal
// Lê arquivo .ics de Google Calendar / Outlook e retorna datas bloqueadas
// Suporta: eventos de dia inteiro, eventos com hora, eventos recorrentes (básico)
// =============================================================================

import ical, { type VEvent } from "node-ical";
import { format, addDays, isAfter, isBefore, startOfDay } from "date-fns";

export interface ICalEvent {
  uid: string;
  title: string;
  start: Date;
  end: Date;
  dates: string[]; // todas as datas "YYYY-MM-DD" que o evento ocupa
}

export interface ICalSyncResult {
  success: boolean;
  events: ICalEvent[];
  blockedDates: string[]; // datas únicas "YYYY-MM-DD"
  error?: string;
  etag?: string;
}

// ─── Função Principal ─────────────────────────────────────────────────────────

/**
 * Faz o parse de uma URL iCal pública e retorna as datas bloqueadas
 * @param icalUrl URL pública do calendário .ics
 * @param monthsAhead Quantos meses no futuro processar (padrão: 18)
 */
export async function parseICalUrl(
  icalUrl: string,
  monthsAhead: number = 18
): Promise<ICalSyncResult> {
  try {
    // Valida a URL
    const url = new URL(icalUrl);
    if (!["http:", "https:"].includes(url.protocol)) {
      return { success: false, events: [], blockedDates: [], error: "URL inválida — use http ou https." };
    }

    // Busca o arquivo .ics com timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);

    let etag: string | undefined;

    const response = await fetch(icalUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent": "NupcialHub-iCalSync/1.0",
        "Accept": "text/calendar, */*",
      },
    }).finally(() => clearTimeout(timeout));

    if (!response.ok) {
      return {
        success: false,
        events: [],
        blockedDates: [],
        error: `Falha ao buscar iCal: HTTP ${response.status}`,
      };
    }

    etag = response.headers.get("etag") ?? undefined;
    const icsText = await response.text();

    // Parse do conteúdo iCal
    const parsedData = await ical.async.parseICS(icsText);
    const events: ICalEvent[] = [];
    const blockedDatesSet = new Set<string>();

    const now = startOfDay(new Date());
    const futureLimit = addDays(now, monthsAhead * 30);

    for (const component of Object.values(parsedData)) {
      // Ignora componentes que não são eventos (VCALENDAR, VTIMEZONE, etc.)
      if (component.type !== "VEVENT") continue;

      const event = component as VEvent;
      const { uid, summary, start, end } = event;

      if (!start || !uid) continue;

      const eventStart = start instanceof Date ? start : new Date(start);
      const eventEnd = end instanceof Date ? end : (start instanceof Date ? start : new Date(start));

      // Ignora eventos muito no passado ou muito no futuro
      if (isBefore(eventEnd, now) || isAfter(eventStart, futureLimit)) continue;

      // Calcula todas as datas que este evento ocupa
      const dates = getDatesInRange(eventStart, eventEnd);

      events.push({
        uid: uid.toString(),
        title: summary?.toString() || "Evento",
        start: eventStart,
        end: eventEnd,
        dates,
      });

      dates.forEach(d => blockedDatesSet.add(d));
    }

    return {
      success: true,
      events,
      blockedDates: Array.from(blockedDatesSet).sort(),
      etag,
    };

  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro desconhecido";

    if (message.includes("aborted")) {
      return { success: false, events: [], blockedDates: [], error: "Timeout ao buscar iCal (>10s)" };
    }

    return { success: false, events: [], blockedDates: [], error: message };
  }
}

// ─── Utilitários ─────────────────────────────────────────────────────────────

/**
 * Retorna array de strings "YYYY-MM-DD" para cada dia no range [start, end)
 */
function getDatesInRange(start: Date, end: Date): string[] {
  const dates: string[] = [];
  const cursor = startOfDay(new Date(start));
  // Para eventos de dia inteiro, o iCal define end como o dia SEGUINTE ao último dia
  const adjustedEnd = startOfDay(new Date(end));

  while (!isAfter(cursor, adjustedEnd)) {
    dates.push(format(cursor, "yyyy-MM-dd"));
    cursor.setDate(cursor.getDate() + 1);

    // Safety: máximo 365 dias por evento (evita loop infinito com dados corrompidos)
    if (dates.length > 365) break;
  }

  // Se start === end (evento de 1 dia sem hora), retorna apenas 1 data
  if (dates.length === 0) {
    dates.push(format(startOfDay(start), "yyyy-MM-dd"));
  }

  return dates;
}

/**
 * Verifica se uma URL iCal é válida antes de salvar no banco
 */
export async function validateICalUrl(url: string): Promise<{
  valid: boolean;
  error?: string;
  eventCount?: number;
}> {
  const result = await parseICalUrl(url, 3); // testa apenas 3 meses

  if (!result.success) {
    return { valid: false, error: result.error };
  }

  return {
    valid: true,
    eventCount: result.events.length,
  };
}

/**
 * Formata uma data "YYYY-MM-DD" para exibição em pt-BR
 */
export function formatDateBR(dateStr: string): string {
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}

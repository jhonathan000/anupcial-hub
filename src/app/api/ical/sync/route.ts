// =============================================================================
// POST /api/ical/sync
// Job cron-acionado que sincroniza calendários iCal de todos os espaços
// Secret: ICAL_SYNC_SECRET (via header X-Sync-Secret)
// Atualiza VenueBooking com datas do iCal sem duplicar por externalId
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseICalUrl } from "@/lib/ical-parser";
import { parseISO } from "date-fns";

export const runtime = "nodejs";
export const maxDuration = 300; // 5 minutos (Vercel limit)

export async function POST(request: NextRequest) {
  try {
    // Verify secret
    const syncSecret = request.headers.get("x-sync-secret");
    if (syncSecret !== process.env.ICAL_SYNC_SECRET) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch venues with iCal URLs
    const venuesWithICal = await prisma.venue.findMany({
      where: {
        icalUrl: { not: null },
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        icalUrl: true,
        icalLastSync: true,
        icalEtag: true,
      },
    });

    let totalVenuesSynced = 0;
    let totalBookingsCreated = 0;
    let totalErrors = 0;

    // Process each venue
    for (const venue of venuesWithICal) {
      if (!venue.icalUrl) continue;

      try {
        // Parse iCal
        const result = await parseICalUrl(venue.icalUrl, 18); // 18 meses

        if (!result.success) {
          console.warn(`[iCal Sync] Falha para venue ${venue.id}: ${result.error}`);
          totalErrors++;
          continue;
        }

        // Skip if ETag não mudou (no changes)
        if (result.etag === venue.icalEtag) {
          console.log(`[iCal Sync] Sem mudanças para ${venue.name}`);
          continue;
        }

        totalVenuesSynced++;

        // Delete old ICAL bookings (para reconstruir a partir do novo arquivo)
        await prisma.venueBooking.deleteMany({
          where: {
            venueId: venue.id,
            source: "ICAL",
          },
        });

        // Create new bookings for each blocked date
        const bookingsToCreate = result.blockedDates.map((dateStr) => {
          const date = parseISO(dateStr);
          const event = result.events.find((e) => e.dates.includes(dateStr));
          return {
            venueId: venue.id,
            date,
            status: "CONFIRMED" as const,
            source: "ICAL" as const,
            externalId: event?.uid,
            externalTitle: event?.title,
            externalStart: event?.start,
            externalEnd: event?.end,
          };
        });

        if (bookingsToCreate.length > 0) {
          await prisma.venueBooking.createMany({
            data: bookingsToCreate,
            skipDuplicates: true, // Via unique constraint (venueId, date)
          });
          totalBookingsCreated += bookingsToCreate.length;
        }

        // Update venue with new sync metadata
        await prisma.venue.update({
          where: { id: venue.id },
          data: {
            icalLastSync: new Date(),
            icalEtag: result.etag || undefined,
          },
        });

        console.log(`[iCal Sync] ✓ ${venue.name} — ${bookingsToCreate.length} datas`);
      } catch (error) {
        console.error(`[iCal Sync] Erro para ${venue.name}:`, error);
        totalErrors++;
      }
    }

    return NextResponse.json(
      {
        message: "Sincronização concluída",
        stats: {
          totalVenuesSynced,
          totalBookingsCreated,
          totalErrors,
          totalVenuesWithICal: venuesWithICal.length,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[POST /api/ical/sync]", error);
    return NextResponse.json(
      {
        error: "Erro durante sincronização de iCal",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

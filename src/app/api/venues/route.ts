// =============================================================================
// GET /api/venues
// Retorna lista paginada de espaços com filtros avançados
// Query params: tipo, cidade, bairro, capacidadeMin, capacidadeMax, pagina, limite
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Parse query parameters
    const tipo = searchParams.get("tipo") || undefined;
    const cidade = searchParams.get("cidade") || "Curitiba";
    const bairro = searchParams.get("bairro") || undefined;
    const capacidadeMin = searchParams.get("capacidadeMin")
      ? parseInt(searchParams.get("capacidadeMin")!)
      : undefined;
    const capacidadeMax = searchParams.get("capacidadeMax")
      ? parseInt(searchParams.get("capacidadeMax")!)
      : undefined;
    const pagina = Math.max(1, parseInt(searchParams.get("pagina") || "1"));
    const limite = Math.min(50, parseInt(searchParams.get("limite") || "20"));
    const skip = (pagina - 1) * limite;

    // Build Prisma filter
    const where: any = {
      isActive: true,
      city: cidade,
    };

    if (tipo) where.type = tipo;
    if (bairro) where.neighborhood = bairro;
    if (capacidadeMin !== undefined) {
      where.maxCapacity = { gte: capacidadeMin };
    }
    if (capacidadeMax !== undefined) {
      if (where.maxCapacity) {
        where.maxCapacity.lte = capacidadeMax;
      } else {
        where.maxCapacity = { lte: capacidadeMax };
      }
    }

    // Fetch venues
    const [venues, total] = await Promise.all([
      prisma.venue.findMany({
        where,
        select: {
          id: true,
          slug: true,
          name: true,
          type: true,
          neighborhood: true,
          city: true,
          state: true,
          minCapacity: true,
          maxCapacity: true,
          coverImageUrl: true,
          images: {
            select: { url: true, blurHash: true, order: true },
            orderBy: { order: "asc" },
          },
          minimumBudget: true,
          averageBudget: true,
          isFeatured: true,
          isClaimed: true,
          amenities: true,
        },
        orderBy: [
          { isFeatured: "desc" },
          { profileScore: "desc" },
          { name: "asc" },
        ],
        take: limite,
        skip,
      }),
      prisma.venue.count({ where }),
    ]);

    // Compute pagination metadata
    const totalPages = Math.ceil(total / limite);
    const hasNextPage = pagina < totalPages;
    const hasPrevPage = pagina > 1;

    return NextResponse.json(
      {
        data: venues,
        total,
        page: pagina,
        limit: limite,
        totalPages,
        hasNextPage,
        hasPrevPage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[GET /api/venues]", error);
    return NextResponse.json(
      { error: "Erro ao buscar espaços" },
      { status: 500 }
    );
  }
}

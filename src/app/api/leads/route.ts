// =============================================================================
// POST/PATCH /api/leads
// POST: Captura lead do modal de data ocupada (noivos)
// PATCH: Cerimonialista desbloqueia contato (PAY_PER_LEAD ou SUCCESS_FEE)
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { addDays } from "date-fns";

// ─── POST — Capture lead ──────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      contactName,
      contactPhone,
      contactEmail,
      eventDate,
      city,
      neighborhood,
      guestCount,
      estimatedBudget,
      notes,
      sourceVenueId,
    } = body;

    // Validation
    if (!contactName?.trim() || !contactPhone?.trim() || !eventDate || !city) {
      return NextResponse.json(
        { error: "Dados obrigatórios faltando" },
        { status: 400 }
      );
    }

    // Create lead (expires in 30 days)
    const lead = await prisma.lead.create({
      data: {
        contactName: contactName.trim(),
        contactPhone: contactPhone.trim(),
        contactEmail: contactEmail?.trim() || null,
        eventDate: new Date(eventDate),
        city,
        neighborhood: neighborhood || null,
        guestCount: parseInt(guestCount) || 150,
        estimatedBudget: parseFloat(estimatedBudget) || 20000,
        notes: notes?.trim() || null,
        sourceVenueId: sourceVenueId || null,
        sourceChannel: "VENUE_MODAL",
        status: "AVAILABLE",
        expiresAt: addDays(new Date(), 30),
        allowedModels: ["PAY_PER_LEAD", "SUCCESS_FEE"],
        creditCost: 5,
        successFeePercentage: 7.5,
        maxClaims: 5,
      },
    });

    // TODO: Trigger notification to cerimonialistas in the region

    return NextResponse.json(
      { message: "Lead capturado com sucesso", leadId: lead.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/leads]", error);
    return NextResponse.json(
      { error: "Erro ao capturar lead" },
      { status: 500 }
    );
  }
}

// ─── PATCH — Unlock contact ───────────────────────────────────────────────

export async function PATCH(request: NextRequest) {
  try {
    // Verify authentication
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: "Autenticação necessária" },
        { status: 401 }
      );
    }

    // Verify is ceremonial user
    if (user.role !== "CEREMONIAL") {
      return NextResponse.json(
        { error: "Apenas cerimonialistas podem desbloquear contatos" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { leadId, model } = body;

    if (!leadId || !["PAY_PER_LEAD", "SUCCESS_FEE"].includes(model)) {
      return NextResponse.json(
        { error: "Parâmetros inválidos" },
        { status: 400 }
      );
    }

    // Fetch lead
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: { claims: { where: { ceremonialId: user.sub } } },
    });

    if (!lead) {
      return NextResponse.json({ error: "Lead não encontrado" }, { status: 404 });
    }

    // Check if user already claimed it
    if (lead.claims.length > 0) {
      return NextResponse.json(
        { error: "Você já desbloqueou este lead" },
        { status: 400 }
      );
    }

    // Check max claims
    if (lead.claimCount >= lead.maxClaims) {
      return NextResponse.json(
        { error: "Limite de cerimonialistas atingido para este lead" },
        { status: 400 }
      );
    }

    // Check if model is allowed
    if (!lead.allowedModels.includes(model)) {
      return NextResponse.json(
        { error: "Este modelo não é permitido para este lead" },
        { status: 400 }
      );
    }

    // Get user from database to check balance (PAY_PER_LEAD)
    const ceremonialist = await prisma.user.findUnique({
      where: { id: user.sub },
      select: { creditBalance: true },
    });

    if (model === "PAY_PER_LEAD") {
      if (!ceremonialist || ceremonialist.creditBalance < lead.creditCost) {
        return NextResponse.json(
          { error: "Créditos insuficientes" },
          { status: 400 }
        );
      }
    }

    // Create claim
    const leadClaim = await prisma.leadClaim.create({
      data: {
        leadId,
        ceremonialId: user.sub,
        model,
      },
    });

    // Handle payment/transaction
    if (model === "PAY_PER_LEAD") {
      // Debit credits
      await prisma.user.update({
        where: { id: user.sub },
        data: { creditBalance: { decrement: lead.creditCost } },
      });

      // Create transaction
      await prisma.creditTransaction.create({
        data: {
          userId: user.sub,
          type: "LEAD_UNLOCK",
          amount: -lead.creditCost,
          balanceAfter: ceremonialist!.creditBalance - lead.creditCost,
          description: `Desbloqueio do lead #${lead.id.slice(0, 8)}...`,
          leadClaimId: leadClaim.id,
        },
      });
    }

    // Increment claim count
    await prisma.lead.update({
      where: { id: leadId },
      data: { claimCount: { increment: 1 } },
    });

    return NextResponse.json(
      {
        message: "Contato desbloqueado com sucesso",
        leadClaim: {
          id: leadClaim.id,
          model,
          unlockedAt: leadClaim.unlockedAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[PATCH /api/leads]", error);
    return NextResponse.json(
      { error: "Erro ao desbloquear contato" },
      { status: 500 }
    );
  }
}

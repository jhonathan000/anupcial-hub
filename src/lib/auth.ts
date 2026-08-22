// =============================================================================
// NUPCIAL HUB — Autenticação
// JWT stateless + bcrypt para hashing de senha
// =============================================================================

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { prisma } from "./prisma";
import type { AuthUser, JWTPayload } from "@/types";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const COOKIE_NAME = "nupcial_token";
const BCRYPT_ROUNDS = 12;

// ─── Hashing ─────────────────────────────────────────────────────────────────

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ─── JWT ─────────────────────────────────────────────────────────────────────

export function signToken(payload: Omit<JWTPayload, "iat" | "exp">): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    algorithm: "HS256",
  });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

// ─── Cookie ──────────────────────────────────────────────────────────────────

export function setAuthCookie(token: string): void {
  const cookieStore = cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 dias
    path: "/",
  });
}

export function clearAuthCookie(): void {
  const cookieStore = cookies();
  cookieStore.delete(COOKIE_NAME);
}

export function getTokenFromCookie(): string | undefined {
  const cookieStore = cookies();
  return cookieStore.get(COOKIE_NAME)?.value;
}

// ─── Sessão do Usuário ───────────────────────────────────────────────────────

/** Retorna o usuário autenticado a partir do cookie (Server Component) */
export async function getAuthUser(): Promise<AuthUser | null> {
  const token = getTokenFromCookie();
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      avatarUrl: true,
      creditBalance: true,
    },
  });

  if (!user) return null;

  return user as AuthUser;
}

/** Extrai o usuário do token no header Authorization (API Routes) */
export function getUserFromRequest(req: NextRequest): JWTPayload | null {
  // 1. Tenta cookie
  const cookieToken = req.cookies.get(COOKIE_NAME)?.value;
  if (cookieToken) {
    return verifyToken(cookieToken);
  }

  // 2. Tenta Authorization header (para APIs externas/mobile)
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    return verifyToken(token);
  }

  return null;
}

// ─── Guards de Rota ──────────────────────────────────────────────────────────

/** Garante que apenas cerimonialistas com status ACTIVE acessem a rota */
export function requireCeremonial(payload: JWTPayload | null): void {
  if (!payload) {
    throw new Error("UNAUTHORIZED");
  }
  if (payload.role !== "CEREMONIAL" && payload.role !== "ADMIN") {
    throw new Error("FORBIDDEN");
  }
  if (payload.status !== "ACTIVE") {
    throw new Error("PENDING_VALIDATION");
  }
}

export function requireAdmin(payload: JWTPayload | null): void {
  if (!payload || payload.role !== "ADMIN") {
    throw new Error("FORBIDDEN");
  }
}

// ─── Validação de Senha ──────────────────────────────────────────────────────

export function validatePasswordStrength(password: string): {
  valid: boolean;
  message?: string;
} {
  if (password.length < 8) {
    return { valid: false, message: "A senha deve ter pelo menos 8 caracteres." };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: "A senha deve ter pelo menos uma letra maiúscula." };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: "A senha deve ter pelo menos um número." };
  }
  return { valid: true };
}

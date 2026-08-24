import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import type { IdeaxchangePersona } from "@/lib/ideaxchange-persona";
import {
  canPersonaAccessPillar,
  type IdeaxchangePillarKey,
} from "@/lib/ideaxchange-pillar-visibility";

export const IDEAXCHANGE_DEV_VIEW_COOKIE = "ideaxchange_dev_view";

export type IdeaxchangeDevViewMode = "off" | "all" | "brokerage" | "career";

const VALID_MODES = new Set<IdeaxchangeDevViewMode>(["off", "all", "brokerage", "career"]);

export function isIdeaxchangeDevUnlockEnabled(): boolean {
  if (process.env.NODE_ENV === "production") return false;
  return process.env.IDEAXCHANGE_DEV_UNLOCK === "1";
}

function parseDevViewMode(value: string | undefined): IdeaxchangeDevViewMode {
  if (!value) return "all";
  const normalized = value.trim().toLowerCase();
  if (VALID_MODES.has(normalized as IdeaxchangeDevViewMode)) {
    return normalized as IdeaxchangeDevViewMode;
  }
  return "all";
}

export function getIdeaxchangeDevViewFromRequest(
  request: NextRequest,
): IdeaxchangeDevViewMode {
  if (!isIdeaxchangeDevUnlockEnabled()) return "off";
  return parseDevViewMode(request.cookies.get(IDEAXCHANGE_DEV_VIEW_COOKIE)?.value);
}

export async function getIdeaxchangeDevViewMode(): Promise<IdeaxchangeDevViewMode> {
  if (!isIdeaxchangeDevUnlockEnabled()) return "off";
  const store = await cookies();
  return parseDevViewMode(store.get(IDEAXCHANGE_DEV_VIEW_COOKIE)?.value);
}

/** Persona used for content filtering when dev override is active. */
export function getEffectiveIdeaxchangePersona(
  entraPersona: IdeaxchangePersona,
  devView: IdeaxchangeDevViewMode,
): IdeaxchangePersona {
  if (devView === "career") return "career";
  if (devView === "brokerage") return "brokerage";
  return entraPersona;
}

export function canAccessCareerLeaderboard(
  entraPersona: IdeaxchangePersona,
  devView: IdeaxchangeDevViewMode,
): boolean {
  if (devView === "all") return true;
  const persona = devView === "brokerage" ? "brokerage" : devView === "career" ? "career" : entraPersona;
  return canPersonaAccessPillar("career-leaderboard", persona);
}

export function canAccessSalesLeaderboard(
  entraPersona: IdeaxchangePersona,
  devView: IdeaxchangeDevViewMode,
): boolean {
  if (devView === "all") return true;
  const persona = devView === "brokerage" ? "brokerage" : devView === "career" ? "career" : entraPersona;
  return canPersonaAccessPillar("sales-leaderboard", persona);
}

export function canAccessIdeaxchangePillar(
  pillarKey: IdeaxchangePillarKey,
  entraPersona: IdeaxchangePersona,
  devView: IdeaxchangeDevViewMode,
): boolean {
  if (devView === "all") return true;
  const persona = devView === "brokerage" ? "brokerage" : devView === "career" ? "career" : entraPersona;
  return canPersonaAccessPillar(pillarKey, persona);
}

export function devViewCookieOptions(maxAgeSeconds = 60 * 60 * 24 * 30) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeSeconds,
  };
}

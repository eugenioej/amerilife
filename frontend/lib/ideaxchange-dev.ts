import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { getIdeaxchangeAuth } from "@/lib/ideaxchange-auth";
import type { IdeaxchangePersona } from "@/lib/ideaxchange-persona";
import {
  canPersonaAccessPillar,
  type IdeaxchangePillarKey,
} from "@/lib/ideaxchange-pillar-visibility";

export const IDEAXCHANGE_DEV_VIEW_COOKIE = "ideaxchange_dev_view";

export type IdeaxchangeDevViewMode = "off" | "all" | "brokerage" | "career";

const VALID_MODES = new Set<IdeaxchangeDevViewMode>(["off", "all", "brokerage", "career"]);

const normalizeEmail = (email: string) =>
  email.trim().toLowerCase();

/** Signed-in Microsoft emails allowed to use the ideaXchange persona preview switcher. */
const IDEAXCHANGE_DEV_VIEW_ALLOWED_EMAILS = new Set([
  "bjoseph@amerilife.com",
  "cmccormack@amerilife.com",
  "aallen@amerilife.com",
  "cyounger@amerilife.com",
  "eugenio.elizondo@amerilife.com",
  "eugenio@klemtek.com",
  "bstewart@amerilife.com",
  "spwilson@amerilife.com",
  "mjones@amerilife.com",
  "psthanason@amerilife.com",
  "amcNatt@amerilife.com",
  "wdeCourcy@amerilife.com",
  "ccushing@amerilife.com",
  "pzadorozny@amerilife.com",
  "edahms@amerilife.com",
  "vgonsalves@amerilife.com",
  "cking@amerilife.com",
  "tperko@amerilife.com",
  "jbarker@amerilife.com",
  "klove@amerilife.com"
].map(normalizeEmail));

export function isIdeaxchangeDevUnlockEnabled(): boolean {
  if (process.env.NODE_ENV === "production") return false;
  return process.env.IDEAXCHANGE_DEV_UNLOCK === "1";
}

export function isIdeaxchangeDevViewEmailAllowed(email?: string | null): boolean {
  if (!email) return false;
  return IDEAXCHANGE_DEV_VIEW_ALLOWED_EMAILS.has(normalizeEmail(email));
}

/** Marketing allowlist in production; env flag is a local-only fallback. */
export function canUseIdeaxchangeDevView(email?: string | null): boolean {
  if (isIdeaxchangeDevViewEmailAllowed(email)) return true;
  return isIdeaxchangeDevUnlockEnabled();
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
  email?: string | null,
): IdeaxchangeDevViewMode {
  if (!canUseIdeaxchangeDevView(email)) return "off";
  return parseDevViewMode(request.cookies.get(IDEAXCHANGE_DEV_VIEW_COOKIE)?.value);
}

export async function getIdeaxchangeDevViewMode(
  email?: string | null,
): Promise<IdeaxchangeDevViewMode> {
  const resolvedEmail =
    email !== undefined ? email : (await getIdeaxchangeAuth())?.user?.email;
  if (!canUseIdeaxchangeDevView(resolvedEmail)) return "off";
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

import type { NavItem } from "@/lib/wp-menus";
import {
  IDEAXCHANGE_CAREER_LEADERBOARD_PATH,
  IDEAXCHANGE_CARRIER_SPOTLIGHT_NAV_ENABLED,
  IDEAXCHANGE_CARRIER_SPOTLIGHT_PATH,
  IDEAXCHANGE_HOME_FEED_PATH,
  IDEAXCHANGE_LEADERBOARD_PATH,
  IDEAXCHANGE_RECRUITING_HUB_PATH,
  IDEAXCHANGE_SALES_SUCCESS_PATH,
} from "@/lib/ideaxchange-constants";

export type IdeaxchangeAudiencePersona = "brokerage" | "career";

/** ideaXchange pillar keys — used for nav and route guards. */
export type IdeaxchangePillarKey =
  | "home"
  | "recruiting-hub"
  | "sales-leaderboard"
  | "career-leaderboard"
  | "career-spotlight"
  | "sales-success";

type PillarAudiences = IdeaxchangeAudiencePersona[] | "both";

export type IdeaxchangePillarDef = {
  key: IdeaxchangePillarKey;
  label: string;
  href: string;
  /** Brokerage, Career, or both — editorial audience visibility. */
  audiences: PillarAudiences;
};

/**
 * Audience visibility for ideaXchange pillars.
 * Recruiting Hub, Career Spotlight, and Sales Success → both audiences.
 * Sales Leaderboard → brokerage only. Career Leaderboard → career only.
 */
export const IDEAXCHANGE_PILLARS: IdeaxchangePillarDef[] = [
  { key: "home", label: "Home", href: IDEAXCHANGE_HOME_FEED_PATH, audiences: "both" },
  {
    key: "recruiting-hub",
    label: "Recruiting Hub",
    href: IDEAXCHANGE_RECRUITING_HUB_PATH,
    audiences: "both",
  },
  {
    key: "sales-leaderboard",
    label: "Sales Leaderboard",
    href: IDEAXCHANGE_LEADERBOARD_PATH,
    audiences: ["brokerage"],
  },
  {
    key: "career-leaderboard",
    label: "Career Leaderboard",
    href: IDEAXCHANGE_CAREER_LEADERBOARD_PATH,
    audiences: ["career"],
  },
  {
    key: "career-spotlight",
    label: "Career Spotlight",
    href: IDEAXCHANGE_CARRIER_SPOTLIGHT_PATH,
    audiences: "both",
  },
  {
    key: "sales-success",
    label: "Sales Success",
    href: IDEAXCHANGE_SALES_SUCCESS_PATH,
    audiences: "both",
  },
];

export function isPillarVisibleToPersona(
  audiences: PillarAudiences,
  persona: IdeaxchangeAudiencePersona,
): boolean {
  if (audiences === "both") return true;
  return audiences.includes(persona);
}

export function getIdeaxchangePillarsForPersona(
  persona: IdeaxchangeAudiencePersona,
): IdeaxchangePillarDef[] {
  return IDEAXCHANGE_PILLARS.filter((pillar) =>
    isPillarVisibleToPersona(pillar.audiences, persona),
  );
}

export function getIdeaxchangeNavItemsForPersona(persona: IdeaxchangeAudiencePersona): NavItem[] {
  return getIdeaxchangePillarsForPersona(persona)
    .filter(
      (pillar) =>
        pillar.key !== "career-spotlight" || IDEAXCHANGE_CARRIER_SPOTLIGHT_NAV_ENABLED,
    )
    .map(({ label, href }) => ({ label, href }));
}

export function getIdeaxchangePillarForPath(pathname: string): IdeaxchangePillarDef | null {
  const normalized = pathname.replace(/\/+$/, "") || "/";
  for (const pillar of IDEAXCHANGE_PILLARS) {
    const base = pillar.href.replace(/\/$/, "");
    if (normalized === base || normalized.startsWith(`${base}/`)) {
      return pillar;
    }
  }
  return null;
}

export function canPersonaAccessIdeaxchangePillarPath(
  pathname: string,
  persona: IdeaxchangeAudiencePersona,
): boolean {
  const pillar = getIdeaxchangePillarForPath(pathname);
  if (!pillar || pillar.key === "home") return false;
  return isPillarVisibleToPersona(pillar.audiences, persona);
}

export function canPersonaAccessPillar(
  pillarKey: IdeaxchangePillarKey,
  persona: IdeaxchangeAudiencePersona,
): boolean {
  const pillar = IDEAXCHANGE_PILLARS.find((p) => p.key === pillarKey);
  if (!pillar) return false;
  return isPillarVisibleToPersona(pillar.audiences, persona);
}

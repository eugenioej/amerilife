import type { NavItem } from "@/lib/wp-menus";
import { IDEAXCHANGE_CARRIER_SPOTLIGHT_NAV_ENABLED } from "@/lib/ideaxchange-constants";
import {
  getIdeaxchangeNavItemsForPersona,
  IDEAXCHANGE_PILLARS,
} from "@/lib/ideaxchange-pillar-visibility";

export const IDEAXCHANGE_LOGO_SRC =
  "https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/05/ideaXchange-2-scaled.png";

/** True for all gated ideaXchange pillar routes (not the public login page). */
export function isIdeaxchangePath(pathname: string): boolean {
  const normalized = pathname.replace(/\/+$/, "") || "/";
  if (normalized === "/ideaxchange") return false;
  return normalized.startsWith("/ideaxchange/");
}

/** Dev-only: all pillars visible in the header (requires IDEAXCHANGE_DEV_UNLOCK=1). */
export const IDEAXCHANGE_DEV_ALL_NAV: NavItem[] = IDEAXCHANGE_PILLARS.filter(
  (pillar) => pillar.key !== "career-spotlight" || IDEAXCHANGE_CARRIER_SPOTLIGHT_NAV_ENABLED,
).map(({ label, href }) => ({
  label,
  href,
}));

/** @deprecated Use getIdeaxchangeNavItemsForPersona("career") */
export const IDEAXCHANGE_CAREER_NAV: NavItem[] = getIdeaxchangeNavItemsForPersona("career");

/** @deprecated Use getIdeaxchangeNavItemsForPersona("brokerage") */
export const IDEAXCHANGE_BROKERAGE_NAV: NavItem[] = getIdeaxchangeNavItemsForPersona("brokerage");

/** Header nav for the signed-in member's audience (optional dev override). */
export function getIdeaxchangeHeaderNav(
  persona: "brokerage" | "career",
  devView: "off" | "all" | "brokerage" | "career" = "off",
): NavItem[] {
  if (devView === "all") return IDEAXCHANGE_DEV_ALL_NAV;
  if (devView === "career") return getIdeaxchangeNavItemsForPersona("career");
  if (devView === "brokerage") return getIdeaxchangeNavItemsForPersona("brokerage");
  return getIdeaxchangeNavItemsForPersona(persona);
}

/** @deprecated Use getIdeaxchangeHeaderNav(persona) */
export const IDEAXCHANGE_PILLAR_NAV: NavItem[] = IDEAXCHANGE_DEV_ALL_NAV;

/** @deprecated Use IDEAXCHANGE_PILLAR_NAV */
export const IDEAXCHANGE_VERTICAL_NAV: NavItem[] = IDEAXCHANGE_PILLAR_NAV;

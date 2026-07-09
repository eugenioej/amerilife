import type { NavItem } from "@/lib/wp-menus";
import {
  IDEAXCHANGE_CAREER_LEADERBOARD_PATH,
  IDEAXCHANGE_CARRIER_SPOTLIGHT_PATH,
  IDEAXCHANGE_HOME_FEED_PATH,
  IDEAXCHANGE_LEADERBOARD_PATH,
  IDEAXCHANGE_RECRUITING_HUB_PATH,
  IDEAXCHANGE_SALES_SUCCESS_PATH,
} from "@/lib/ideaxchange-constants";

export const IDEAXCHANGE_LOGO_SRC =
  "https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/05/ideaXchange-2-scaled.png";

/** True for all gated ideaXchange pillar routes (not the public login page). */
export function isIdeaxchangePath(pathname: string): boolean {
  const normalized = pathname.replace(/\/+$/, "") || "/";
  if (normalized === "/ideaxchange") return false;
  return normalized.startsWith("/ideaxchange/");
}

/** ideaXchange header nav — Career audience (Piper leaderboard). */
export const IDEAXCHANGE_CAREER_NAV: NavItem[] = [
  { label: "Home", href: IDEAXCHANGE_HOME_FEED_PATH },
  { label: "Recruiting Hub", href: IDEAXCHANGE_RECRUITING_HUB_PATH },
  { label: "Career Leaderboard", href: IDEAXCHANGE_CAREER_LEADERBOARD_PATH },
];

/** ideaXchange header nav — Brokerage audience (SFTP sales leaderboard). */
export const IDEAXCHANGE_BROKERAGE_NAV: NavItem[] = [
  { label: "Home", href: IDEAXCHANGE_HOME_FEED_PATH },
  { label: "Recruiting Hub", href: IDEAXCHANGE_RECRUITING_HUB_PATH },
  { label: "Sales Leaderboard", href: IDEAXCHANGE_LEADERBOARD_PATH },
  { label: "Carrier Spotlight", href: IDEAXCHANGE_CARRIER_SPOTLIGHT_PATH },
  { label: "Sales Success", href: IDEAXCHANGE_SALES_SUCCESS_PATH },
];

/** Dev-only: all pillars visible in the header (requires IDEAXCHANGE_DEV_UNLOCK=1). */
export const IDEAXCHANGE_DEV_ALL_NAV: NavItem[] = [
  { label: "Home", href: IDEAXCHANGE_HOME_FEED_PATH },
  { label: "Recruiting Hub", href: IDEAXCHANGE_RECRUITING_HUB_PATH },
  { label: "Career Leaderboard", href: IDEAXCHANGE_CAREER_LEADERBOARD_PATH },
  { label: "Sales Leaderboard", href: IDEAXCHANGE_LEADERBOARD_PATH },
  { label: "Carrier Spotlight", href: IDEAXCHANGE_CARRIER_SPOTLIGHT_PATH },
  { label: "Sales Success", href: IDEAXCHANGE_SALES_SUCCESS_PATH },
];

/** Header nav for the signed-in member's audience (optional dev override). */
export function getIdeaxchangeHeaderNav(
  persona: "brokerage" | "career",
  devView: "off" | "all" | "brokerage" | "career" = "off",
): NavItem[] {
  if (devView === "all") return IDEAXCHANGE_DEV_ALL_NAV;
  if (devView === "career") return IDEAXCHANGE_CAREER_NAV;
  if (devView === "brokerage") return IDEAXCHANGE_BROKERAGE_NAV;
  return persona === "career" ? IDEAXCHANGE_CAREER_NAV : IDEAXCHANGE_BROKERAGE_NAV;
}

/** @deprecated Use getIdeaxchangeHeaderNav(persona) */
export const IDEAXCHANGE_PILLAR_NAV: NavItem[] = [
  ...IDEAXCHANGE_BROKERAGE_NAV,
  { label: "Career Leaderboard", href: IDEAXCHANGE_CAREER_LEADERBOARD_PATH },
];

/** @deprecated Use IDEAXCHANGE_PILLAR_NAV */
export const IDEAXCHANGE_VERTICAL_NAV: NavItem[] = IDEAXCHANGE_PILLAR_NAV;

import type { NavItem } from "@/lib/wp-menus";

export const IDEAXCHANGE_LOGO_SRC =
  "https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/05/ideaXchange-2-scaled.png";

/** True for all gated ideaXchange pillar routes (not the public login page). */
export function isIdeaxchangePath(pathname: string): boolean {
  const normalized = pathname.replace(/\/+$/, "") || "/";
  if (normalized === "/ideaxchange") return false;
  return normalized.startsWith("/ideaxchange/");
}

/** Primary pillar navigation — matches ideaXchange mockups. */
export const IDEAXCHANGE_PILLAR_NAV: NavItem[] = [
  { label: "Magazine", href: "/ideaxchange/magazine/" },
  { label: "Recruiting Hub", href: "/ideaxchange/recruiting-hub/" },
  { label: "Sales Leaderboard", href: "/ideaxchange/leaderboard/" },
  { label: "Carrier Spotlight", href: "/ideaxchange/carrier-spotlight/" },
  { label: "Sales Success", href: "/ideaxchange/sales-success/" },
];

/** @deprecated Use IDEAXCHANGE_PILLAR_NAV */
export const IDEAXCHANGE_VERTICAL_NAV: NavItem[] = IDEAXCHANGE_PILLAR_NAV;

import type { NavItem } from "@/lib/wp-menus";
import {
  IDEAXCHANGE_CARRIER_SPOTLIGHT_PATH,
  IDEAXCHANGE_LEADERBOARD_PATH,
  IDEAXCHANGE_MAGAZINE_PATH,
  IDEAXCHANGE_RECRUITING_HUB_PATH,
  IDEAXCHANGE_SALES_SUCCESS_PATH,
} from "@/lib/ideaxchange-constants";
import { IDEAXCHANGE_PILLAR_NAV } from "@/lib/ideaxchange-nav";

export type IdeaxchangePersona = "sales" | "recruit" | "carrier" | "leadership" | "admin";

/** App role values configured in Entra (Token configuration → App roles). */
export const IDEAXCHANGE_APP_ROLES = {
  ADMIN: "IDEAXCHANGE_ADMIN",
  LEADERSHIP: "IDEAXCHANGE_LEADERSHIP",
  CARRIER: "IDEAXCHANGE_CARRIER",
  RECRUIT: "IDEAXCHANGE_RECRUIT",
  SALES: "IDEAXCHANGE_SALES",
} as const;

function entraGroupIdForPersona(persona: Exclude<IdeaxchangePersona, "admin">): string | undefined {
  // Env vars map Entra security groups → personas (Brokerage=sales, Career=recruit, etc.)
  const map: Record<Exclude<IdeaxchangePersona, "admin">, string | undefined> = {
    sales: process.env.IDEAXCHANGE_ENTRA_GROUP_SALES_ID,
    recruit: process.env.IDEAXCHANGE_ENTRA_GROUP_RECRUIT_ID,
    carrier: process.env.IDEAXCHANGE_ENTRA_GROUP_CARRIER_ID,
    leadership: process.env.IDEAXCHANGE_ENTRA_GROUP_LEADERSHIP_ID,
  };
  return map[persona]?.trim() || undefined;
}

function hasRole(roles: Set<string>, role: string): boolean {
  return roles.has(role.toUpperCase());
}

const GUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isGuid(value: string): boolean {
  return GUID_PATTERN.test(value);
}

function hasMembership(membershipIds: Set<string>, groupId: string | undefined): boolean {
  if (!groupId) return false;
  const normalized = groupId.toLowerCase();
  return membershipIds.has(normalized) || membershipIds.has(groupId);
}

/** Entra may emit security group object IDs in `roles` or `groups` — merge both for lookup. */
export function mergeEntraMembershipIds(
  roles: string[] | undefined,
  groupIds: string[] | undefined,
): string[] {
  const merged = new Set<string>();
  for (const value of [...(roles ?? []), ...(groupIds ?? [])]) {
    if (isGuid(value)) merged.add(value.toLowerCase());
  }
  return [...merged];
}

/** Map Entra app roles and/or security group object IDs to an IdeaXchange persona. */
export function resolveIdeaxchangePersona(
  roles: string[] | undefined,
  groupIds: string[] | undefined,
): IdeaxchangePersona {
  const roleSet = new Set((roles ?? []).map((r) => r.toUpperCase()));
  const membershipSet = new Set(mergeEntraMembershipIds(roles, groupIds));

  if (hasRole(roleSet, IDEAXCHANGE_APP_ROLES.ADMIN)) return "admin";
  if (hasRole(roleSet, IDEAXCHANGE_APP_ROLES.LEADERSHIP)) return "leadership";
  if (hasMembership(membershipSet, entraGroupIdForPersona("leadership"))) return "leadership";
  if (hasRole(roleSet, IDEAXCHANGE_APP_ROLES.CARRIER)) return "carrier";
  if (hasMembership(membershipSet, entraGroupIdForPersona("carrier"))) return "carrier";
  if (hasRole(roleSet, IDEAXCHANGE_APP_ROLES.RECRUIT)) return "recruit";
  if (hasMembership(membershipSet, entraGroupIdForPersona("recruit"))) return "recruit";
  if (hasRole(roleSet, IDEAXCHANGE_APP_ROLES.SALES)) return "sales";
  if (hasMembership(membershipSet, entraGroupIdForPersona("sales"))) return "sales";

  return "sales";
}

export function getIdeaxchangeHomeForPersona(persona: IdeaxchangePersona): string {
  switch (persona) {
    case "recruit":
      return IDEAXCHANGE_RECRUITING_HUB_PATH;
    case "carrier":
      return IDEAXCHANGE_CARRIER_SPOTLIGHT_PATH;
    case "leadership":
    case "admin":
      return IDEAXCHANGE_LEADERBOARD_PATH;
    case "sales":
    default:
      return IDEAXCHANGE_MAGAZINE_PATH;
  }
}

function navHrefAllowedForPersona(href: string, persona: IdeaxchangePersona): boolean {
  if (href === "#" || href.startsWith("#")) return true;

  switch (persona) {
    case "admin":
    case "leadership":
      return true;
    case "sales":
      return (
        href.startsWith(IDEAXCHANGE_MAGAZINE_PATH) ||
        href.startsWith(IDEAXCHANGE_LEADERBOARD_PATH) ||
        href.startsWith(IDEAXCHANGE_CARRIER_SPOTLIGHT_PATH) ||
        href.startsWith(IDEAXCHANGE_SALES_SUCCESS_PATH)
      );
    case "recruit":
      return (
        href.startsWith(IDEAXCHANGE_MAGAZINE_PATH) ||
        href.startsWith(IDEAXCHANGE_RECRUITING_HUB_PATH)
      );
    case "carrier":
      return (
        href.startsWith(IDEAXCHANGE_MAGAZINE_PATH) ||
        href.startsWith(IDEAXCHANGE_CARRIER_SPOTLIGHT_PATH)
      );
    default:
      return true;
  }
}

/** Filter pillar nav items based on the signed-in member's persona. */
export function getIdeaxchangeNavForPersona(persona: IdeaxchangePersona): NavItem[] {
  return IDEAXCHANGE_PILLAR_NAV.filter((item) => navHrefAllowedForPersona(item.href, persona));
}

export function canAccessIdeaxchangePath(pathname: string, persona: IdeaxchangePersona): boolean {
  const normalized = pathname.replace(/\/+$/, "") || "/";
  if (!normalized.startsWith("/ideaxchange")) return true;

  const allowedPrefixes = getIdeaxchangeNavForPersona(persona)
    .map((item) => item.href.replace(/\/+$/, ""))
    .filter((href) => href && href !== "#");

  return allowedPrefixes.some(
    (prefix) => normalized === prefix || normalized.startsWith(`${prefix}/`),
  );
}

import type { NavItem } from "@/lib/wp-menus";
import {
  IDEAXCHANGE_ARTICLE_PATH,
  IDEAXCHANGE_CATEGORY_PATH,
  IDEAXCHANGE_HOME_FEED_PATH,
  IDEAXCHANGE_MAGAZINE_PATH,
  IDEAXCHANGE_SEARCH_PATH,
} from "@/lib/ideaxchange-constants";
import { getIdeaxchangeHeaderNav } from "@/lib/ideaxchange-nav";
import { canPersonaAccessIdeaxchangePillarPath } from "@/lib/ideaxchange-pillar-visibility";
import type { IdeaxchangeDevViewMode } from "@/lib/ideaxchange-dev";

/** Entra audience — Brokerage or Career only. */
export type IdeaxchangePersona = "brokerage" | "career";

/** Legacy app role values in Entra (still accepted on tokens). */
export const IDEAXCHANGE_APP_ROLES = {
  BROKERAGE: "IDEAXCHANGE_BROKERAGE",
  CAREER: "IDEAXCHANGE_CAREER",
  /** @deprecated use IDEAXCHANGE_BROKERAGE */
  SALES: "IDEAXCHANGE_SALES",
  /** @deprecated use IDEAXCHANGE_CAREER */
  RECRUIT: "IDEAXCHANGE_RECRUIT",
} as const;

/** Entra group IDs currently emitted in the roles claim. */
export const IDEAXCHANGE_ENTRA_GROUP_IDS = {
  BROKERAGE: "8c92f39c-71fb-447b-8dfa-18c0671039f0",
  CAREER: "c6ebca04-4b62-47c2-a3c8-ec21ffc04330",
} as const;

function entraGroupIdForPersona(persona: IdeaxchangePersona): string | undefined {
  const brokerage =
    process.env.IDEAXCHANGE_ENTRA_GROUP_BROKERAGE_ID?.trim() ||
    process.env.IDEAXCHANGE_ENTRA_GROUP_SALES_ID?.trim();
  const career =
    process.env.IDEAXCHANGE_ENTRA_GROUP_CAREER_ID?.trim() ||
    process.env.IDEAXCHANGE_ENTRA_GROUP_RECRUIT_ID?.trim();

  return persona === "brokerage" ? brokerage : career;
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

function isCareerRole(role: string): boolean {
  const upper = role.toUpperCase();
  const careerGuid = IDEAXCHANGE_ENTRA_GROUP_IDS.CAREER.toUpperCase();

  const matches =
    upper === IDEAXCHANGE_APP_ROLES.CAREER ||
    upper === IDEAXCHANGE_APP_ROLES.RECRUIT ||
    upper === careerGuid ||
    upper.includes("CAREER") ||
    upper.includes("RECRUIT");

  console.log("[IX DEBUG] isCareerRole", {
    originalRole: role,
    normalizedRole: upper,
    expectedCareerRole: IDEAXCHANGE_APP_ROLES.CAREER,
    expectedRecruitRole: IDEAXCHANGE_APP_ROLES.RECRUIT,
    expectedCareerGuid: careerGuid,
    matches,
  });

  return matches;
}

function isBrokerageRole(role: string): boolean {
  const upper = role.toUpperCase();
  const brokerageGuid = IDEAXCHANGE_ENTRA_GROUP_IDS.BROKERAGE.toUpperCase();

  const matches =
    upper === IDEAXCHANGE_APP_ROLES.BROKERAGE ||
    upper === IDEAXCHANGE_APP_ROLES.SALES ||
    upper === brokerageGuid ||
    upper.includes("BROKERAGE") ||
    upper.includes("SALES");

  console.log("[IX DEBUG] isBrokerageRole", {
    originalRole: role,
    normalizedRole: upper,
    expectedBrokerageRole: IDEAXCHANGE_APP_ROLES.BROKERAGE,
    expectedSalesRole: IDEAXCHANGE_APP_ROLES.SALES,
    expectedBrokerageGuid: brokerageGuid,
    matches,
  });

  return matches;
}

/** Map Entra app roles and/or security group object IDs to Brokerage or Career. */
export function resolveIdeaxchangePersona(
  roles: string[] | undefined,
  groupIds: string[] | undefined,
): IdeaxchangePersona {
  const roleSet = new Set((roles ?? []).map((r) => r.toUpperCase()));
  const membershipSet = new Set(mergeEntraMembershipIds(roles, groupIds));

  for (const role of roleSet) {
    if (isCareerRole(role)) return "career";
  }
  if (hasMembership(membershipSet, entraGroupIdForPersona("career"))) return "career";

  for (const role of roleSet) {
    if (isBrokerageRole(role)) return "brokerage";
  }
  if (hasMembership(membershipSet, entraGroupIdForPersona("brokerage"))) return "brokerage";

  return "brokerage";
}

export function getIdeaxchangeHomeForPersona(_persona: IdeaxchangePersona): string {
  return IDEAXCHANGE_HOME_FEED_PATH;
}

function effectivePersonaForAccess(
  persona: IdeaxchangePersona,
  devView: IdeaxchangeDevViewMode,
): IdeaxchangePersona {
  if (devView === "career") return "career";
  if (devView === "brokerage") return "brokerage";
  return persona;
}

/** ideaXchange SiteHeader / mobile nav for Brokerage or Career. */
export function getIdeaxchangeNavForPersona(
  persona: IdeaxchangePersona,
  devView: IdeaxchangeDevViewMode = "off",
): NavItem[] {
  return getIdeaxchangeHeaderNav(persona, devView);
}

export function canAccessIdeaxchangePath(
  pathname: string,
  persona: IdeaxchangePersona,
  devView: IdeaxchangeDevViewMode = "off",
): boolean {
  if (devView === "all") {
    const normalized = pathname.replace(/\/+$/, "") || "/";
    if (!normalized.startsWith("/ideaxchange")) return true;
    return normalized !== "/ideaxchange" && normalized !== "/ideaxchange/";
  }
  if (devView === "career") {
    return canAccessIdeaxchangePath(pathname, "career", "off");
  }
  if (devView === "brokerage") {
    return canAccessIdeaxchangePath(pathname, "brokerage", "off");
  }

  const normalized = pathname.replace(/\/+$/, "") || "/";
  if (!normalized.startsWith("/ideaxchange")) return true;

  const accessPersona = effectivePersonaForAccess(persona, devView);

  const homeBase = IDEAXCHANGE_HOME_FEED_PATH.replace(/\/$/, "");
  if (normalized === homeBase || normalized.startsWith(`${homeBase}/`)) {
    return true;
  }

  const articleBase = IDEAXCHANGE_ARTICLE_PATH.replace(/\/$/, "");
  if (normalized.startsWith(`${articleBase}/`) && normalized !== articleBase) {
    return true;
  }

  const categoryBase = IDEAXCHANGE_CATEGORY_PATH.replace(/\/$/, "");
  if (normalized === categoryBase || normalized.startsWith(`${categoryBase}/`)) {
    return true;
  }

  const searchBase = IDEAXCHANGE_SEARCH_PATH.replace(/\/$/, "");
  if (normalized === searchBase || normalized.startsWith(`${searchBase}/`)) {
    return true;
  }

  // Legacy magazine article URLs — redirect to /article/ (index redirects to /home).
  if (
    normalized.startsWith(IDEAXCHANGE_MAGAZINE_PATH.replace(/\/$/, "")) &&
    normalized !== IDEAXCHANGE_MAGAZINE_PATH.replace(/\/$/, "") &&
    !normalized.includes("/category/")
  ) {
    return true;
  }

  return canPersonaAccessIdeaxchangePillarPath(normalized, accessPersona);
}

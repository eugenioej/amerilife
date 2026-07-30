import type { Account, Profile } from "next-auth";
import type { IdeaxchangePersona } from "@/lib/ideaxchange-persona";
import { IDEAXCHANGE_APP_ROLES, resolveIdeaxchangePersona } from "@/lib/ideaxchange-persona";

export type EntraAuthClaims = {
  roles: string[];
  groups: string[];
  oid?: string;
  tid?: string;
  /** Raw claim keys from id_token/profile — for IT validation. */
  claimKeys: string[];
  /** Custom persona claim value when IDEAXCHANGE_ENTRA_PERSONA_CLAIM is set. */
  personaClaimValue?: string;
};

function readStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((entry) => String(entry));
}

function decodeJwtPayload(idToken: string): Record<string, unknown> {
  try {
    const payload = idToken.split(".")[1];
    if (!payload) return {};
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = Buffer.from(normalized, "base64").toString("utf8");
    const parsed: unknown = JSON.parse(json);
    return typeof parsed === "object" && parsed !== null ? (parsed as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

function mergeClaimRecords(
  profile: Profile | undefined,
  account: Account | null | undefined,
): Record<string, unknown> {
  const fromProfile = (profile ?? {}) as Record<string, unknown>;
  const fromIdToken =
    account?.id_token && typeof account.id_token === "string"
      ? decodeJwtPayload(account.id_token)
      : {};

  console.info("[Entra Raw ID Token Payload]", fromIdToken);

  return { ...fromIdToken, ...fromProfile };
}

function personaFromCustomClaim(value: unknown): IdeaxchangePersona | null {
  if (typeof value !== "string" || !value.trim()) return null;
  const normalized = value.trim().toUpperCase();

  if (normalized.includes("CAREER") || normalized.includes("RECRUIT")) return "career";
  if (normalized.includes("BROKERAGE") || normalized.includes("SALES")) return "brokerage";

  if (
    normalized === IDEAXCHANGE_APP_ROLES.CAREER ||
    normalized === IDEAXCHANGE_APP_ROLES.RECRUIT
  ) {
    return "career";
  }
  if (
    normalized === IDEAXCHANGE_APP_ROLES.BROKERAGE ||
    normalized === IDEAXCHANGE_APP_ROLES.SALES
  ) {
    return "brokerage";
  }

  return null;
}

/** Read Entra roles/groups from OAuth profile + id_token (JIT). */
export function extractEntraAuthClaims(
  profile: Profile | undefined,
  account?: Account | null,
): EntraAuthClaims {
  const record = mergeClaimRecords(profile, account);
  const roles = readStringArray(record.roles);
  const groups = readStringArray(record.groups);

  const personaClaimName = process.env.IDEAXCHANGE_ENTRA_PERSONA_CLAIM?.trim();
  const personaClaimValue =
    personaClaimName && typeof record[personaClaimName] === "string"
      ? record[personaClaimName]
      : undefined;

  return {
    roles,
    groups,
    oid: typeof record.oid === "string" ? record.oid : undefined,
    tid: typeof record.tid === "string" ? record.tid : undefined,
    claimKeys: Object.keys(record).sort(),
    personaClaimValue,
  };
}

export function resolvePersonaFromEntraClaims(claims: EntraAuthClaims): IdeaxchangePersona {
  const fromCustom = personaFromCustomClaim(claims.personaClaimValue);
  if (fromCustom) return fromCustom;
  return resolveIdeaxchangePersona(claims.roles, claims.groups);
}

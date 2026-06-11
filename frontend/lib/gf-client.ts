import { fetchGraphQL } from "@/lib/wp-client";
import { GET_GF_FORM, SUBMIT_GF_FORM } from "@/lib/gf-queries";
import type { LocationData } from "@/lib/locations-data";
import type { GfFormData } from "@/lib/gf-types";

/** Gravity Forms database ID for `/contact/` (Contact Us). */
export const CONTACT_US_FORM_ID = 1;

/** Gravity Forms database ID for `/valspar/`. */
export const VALSPAR_FORM_ID = 37;

/** Gravity Forms database ID for `/worksite/lead/`. */
export const WORKSITE_LEAD_FORM_ID = 12;

/** Gravity Forms database ID for `/state-specific-privacy-addendum-request/`. */
export const PRIVACY_ADDENDUM_REQUEST_FORM_ID = 57;

/** Gravity Forms database ID for the header “Contact” popup (matches live site Contact Us popup). */
export const HEADER_CONTACT_POPUP_FORM_ID = 54;

/** Gravity Forms database ID for `/find-an-agent/` and `/consumers/` (Connect with an Agent). */
export const FIND_AN_AGENT_FORM_ID = 26;

/** Gravity Forms database ID for `/acquisition-partner-program/` (Exploratory Discussion). */
export const ACQUISITION_PARTNER_FORM_ID = 90;

/** Headless default “Connect with an Agent” form when agency has no `gravityFormId`. */
export const DEFAULT_CONNECT_GF_FORM_ID = 31;

export function resolveConnectFormId(location: LocationData): number {
  const raw = location.gravityFormId;
  if (typeof raw === "number" && raw > 0) return raw;
  return DEFAULT_CONNECT_GF_FORM_ID;
}

export async function fetchGravityForm(databaseId: number): Promise<GfFormData | null> {
  if (!Number.isFinite(databaseId) || databaseId < 1) return null;
  const data = await fetchGraphQL<{ gfForm: GfFormData | null }>(GET_GF_FORM, {
    id: String(databaseId),
  });
  return data?.gfForm ?? null;
}

export type SubmitGfFormPayload = {
  confirmation: {
    type: string;
    message?: string | null;
    url?: string | null;
  } | null;
  errors: { id: string; message?: string | null }[] | null;
  entry: { databaseId?: number | null } | null;
};

export async function submitGravityForm(
  formDatabaseId: number,
  fieldValues: Record<string, unknown>[],
): Promise<SubmitGfFormPayload | null> {
  const data = await fetchGraphQL<{ submitGfForm: SubmitGfFormPayload | null }>(
    SUBMIT_GF_FORM,
    {
      id: String(formDatabaseId),
      values: fieldValues,
    },
  );
  return data?.submitGfForm ?? null;
}

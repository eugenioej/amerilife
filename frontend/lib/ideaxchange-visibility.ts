import type { IdeaxchangePersona } from "@/lib/ideaxchange-persona";

/** Matches WordPress IdeaxchangeVisibility enum / ideaxchange_visibility meta. */
export type IdeaxchangeVisibility = "brokerage" | "career" | "brokerage_career";

const VISIBILITY_LABELS: Record<IdeaxchangeVisibility, string> = {
  brokerage: "Brokerage",
  career: "Career",
  brokerage_career: "Brokerage+Career",
};

/** Normalize GraphQL enum or WP meta string to internal visibility key. */
export function parseIdeaxchangeVisibility(
  raw?: string | null,
): IdeaxchangeVisibility {
  const normalized = (raw ?? "").trim().toUpperCase().replace(/-/g, "_");
  if (normalized === "BROKERAGE") return "brokerage";
  if (normalized === "CAREER") return "career";
  if (normalized === "BROKERAGE_CAREER" || normalized === "BROKERAGE+CAREER") {
    return "brokerage_career";
  }
  return "brokerage_career";
}

export function ideaxchangeVisibilityLabel(visibility: IdeaxchangeVisibility): string {
  return VISIBILITY_LABELS[visibility];
}

export function personaCanSeeVisibility(
  persona: IdeaxchangePersona,
  visibility: IdeaxchangeVisibility,
): boolean {
  switch (visibility) {
    case "brokerage_career":
      return true;
    case "brokerage":
      return persona === "brokerage";
    case "career":
      return persona === "career";
    default:
      return true;
  }
}

export type IdeaxchangeVisibilityFields = {
  visibility?: string | null;
};

export type IdeaxchangeItemWithVisibility = {
  ideaxchangeFields?: IdeaxchangeVisibilityFields | null;
  ideaxchangeCaseStudyFields?: IdeaxchangeVisibilityFields | null;
  ideaxchangeCompanyFields?: IdeaxchangeVisibilityFields | null;
  ideaxchangeCarrierFields?: IdeaxchangeVisibilityFields | null;
  ideaxchangeLbTableFields?: IdeaxchangeVisibilityFields | null;
};

export function readItemVisibility(item: IdeaxchangeItemWithVisibility): IdeaxchangeVisibility {
  const raw =
    item.ideaxchangeFields?.visibility ??
    item.ideaxchangeCaseStudyFields?.visibility ??
    item.ideaxchangeCompanyFields?.visibility ??
    item.ideaxchangeCarrierFields?.visibility ??
    item.ideaxchangeLbTableFields?.visibility ??
    null;
  return parseIdeaxchangeVisibility(raw);
}

export function isItemVisibleToPersona(
  item: IdeaxchangeItemWithVisibility,
  persona: IdeaxchangePersona,
): boolean {
  return personaCanSeeVisibility(persona, readItemVisibility(item));
}

export function filterItemsByPersonaVisibility<T extends IdeaxchangeItemWithVisibility>(
  items: T[],
  persona: IdeaxchangePersona,
): T[] {
  return items.filter((item) => isItemVisibleToPersona(item, persona));
}

import type { GfNameInput } from "@/lib/gf-types";

/**
 * Gravity Forms Name fields expose every enabled sub-input (Prefix, First, Middle, Last, Suffix).
 * WPGraphQL returns them in `inputs { id label }`. We only show First + Last in the headless UI;
 * hidden parts still submit as empty strings via `buildNameValues` (mapped by label).
 */

export function shouldShowNameSubfieldLabel(label: string | null | undefined): boolean {
  const lab = (label ?? "").toLowerCase().trim();
  if (!lab) return true;

  if (/\bprefix\b|prefijo/.test(lab)) return false;
  if (/\bmiddle\b|segundo(\s+nombre)?/.test(lab)) return false;
  if (/\bsuffix\b|sufijo/.test(lab)) return false;

  if (/\bfirst\b|^nombre$/i.test(lab) || /^nombre(\s|$)/i.test(lab)) return true;
  if (/\bgiven\b/.test(lab)) return true;
  if (/\blast\b|apellido|surname|family\s*name/.test(lab)) return true;

  return false;
}

/** Inputs to render; if filtering removes everything (unknown labels), show all so the form still works. */
export function nameInputsForDisplay(inputs: GfNameInput[] | null | undefined): GfNameInput[] {
  const raw = inputs ?? [];
  const filtered = raw.filter((inp) => shouldShowNameSubfieldLabel(inp.label));
  return filtered.length > 0 ? filtered : raw;
}

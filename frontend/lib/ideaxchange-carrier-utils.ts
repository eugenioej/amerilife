import { IDEAXCHANGE_CARRIER_SPOTLIGHT_PATH } from "@/lib/ideaxchange-constants";
import type { CarrierListItem } from "@/lib/ideaxchange-carrier-queries";

export const CARRIER_SPOTLIGHT_FIRST = 36;

export function carrierHref(slug: string | null | undefined): string {
  if (!slug) return IDEAXCHANGE_CARRIER_SPOTLIGHT_PATH;
  return `${IDEAXCHANGE_CARRIER_SPOTLIGHT_PATH}${slug}/`;
}

export function isCarrierHero(
  post: Pick<CarrierListItem, "ideaxchangeCarrierFields">,
): boolean {
  return post.ideaxchangeCarrierFields?.isHero === true;
}

export function carrierBrandColor(
  post: Pick<CarrierListItem, "ideaxchangeCarrierFields">,
): string {
  return post.ideaxchangeCarrierFields?.brandColor?.trim() || "var(--color-brand-dark)";
}

export function partitionCarriers(carriers: CarrierListItem[]): {
  hero: CarrierListItem[];
  additional: CarrierListItem[];
} {
  const heroFlagged = carriers.filter(isCarrierHero);
  const hero = heroFlagged.length > 0 ? heroFlagged.slice(0, 3) : carriers.slice(0, 3);
  const heroIds = new Set(hero.map((c) => c.id));
  const additional = carriers.filter((c) => !heroIds.has(c.id));
  return { hero, additional };
}

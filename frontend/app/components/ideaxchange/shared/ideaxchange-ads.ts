import type {
  IdeaxchangeAdCreative,
  IdeaxchangeAdSlot,
  InsightsAdSlotSetting,
} from "@/lib/queries";

/** Creatives that have a usable image URL. */
export function getIdeaxchangeAdCreatives(
  slot?: IdeaxchangeAdSlot | null,
): IdeaxchangeAdCreative[] {
  const list = slot?.creatives ?? [];
  return list.filter((c) => Boolean(c?.imageUrl?.trim()));
}

export function hasIdeaxchangeAdSlotImage(
  slot?: IdeaxchangeAdSlot | null,
): boolean {
  return getIdeaxchangeAdCreatives(slot).length > 0;
}

/** Pick one creative at random for this render (server or client). */
export function pickIdeaxchangeAdCreative(
  slot?: IdeaxchangeAdSlot | null,
): InsightsAdSlotSetting | null {
  const creatives = getIdeaxchangeAdCreatives(slot);
  if (creatives.length === 0) return null;
  const index = Math.floor(Math.random() * creatives.length);
  const chosen = creatives[index];
  return {
    imageUrl: chosen.imageUrl,
    targetUrl: chosen.targetUrl,
    altText: chosen.altText,
  };
}

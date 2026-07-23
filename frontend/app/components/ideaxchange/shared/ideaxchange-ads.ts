import type {
  IdeaxchangeAdCreative,
  IdeaxchangeAdSlot,
  IdeaxchangeAdsSettings,
  InsightsAdSlotSetting,
} from "@/lib/queries";

export type IdeaxchangeAdAudience = "brokerage" | "career";
export type IdeaxchangeAdVisibility = IdeaxchangeAdAudience | "both";

/**
 * Maps the logged-in ideaXchange persona to ad audience.
 *
 * If your auth.persona is exactly "career" or "brokerage", this is direct.
 * If your site treats all non-career users as brokerage/sales, this keeps that behavior.
 */
export function getIdeaxchangeAdAudienceFromPersona(
  persona?: string | null,
): IdeaxchangeAdAudience {
  return persona === "career" ? "career" : "brokerage";
}

function normalizeIdeaxchangeAdVisibility(
  visibility?: string | null,
): IdeaxchangeAdVisibility {
  if (
    visibility === "brokerage" ||
    visibility === "career" ||
    visibility === "both"
  ) {
    return visibility;
  }

  return "both";
}

function isIdeaxchangeAdCreativeVisibleForAudience(
  creative: IdeaxchangeAdCreative,
  audience: IdeaxchangeAdAudience,
): boolean {
  const visibility = normalizeIdeaxchangeAdVisibility(creative.visibility);

  return visibility === "both" || visibility === audience;
}

/** Creatives that have a usable image URL. */
export function getIdeaxchangeAdCreatives(
  slot?: IdeaxchangeAdSlot | null,
): IdeaxchangeAdCreative[] {
  const list = slot?.creatives ?? [];

  return list.filter((creative) => Boolean(creative?.imageUrl?.trim()));
}

export function hasIdeaxchangeAdSlotImage(
  slot?: IdeaxchangeAdSlot | null,
): boolean {
  return getIdeaxchangeAdCreatives(slot).length > 0;
}

/**
 * Filters one ad slot to only creatives allowed for the logged-in user's audience.
 * Random selection still happens later in pickIdeaxchangeAdCreative().
 */
export function filterIdeaxchangeAdSlotByAudience(
  slot: IdeaxchangeAdSlot | null | undefined,
  audience: IdeaxchangeAdAudience,
): IdeaxchangeAdSlot | null {
  if (!slot) {
    return null;
  }

  const creatives = getIdeaxchangeAdCreatives(slot).filter((creative) =>
    isIdeaxchangeAdCreativeVisibleForAudience(creative, audience),
  );

  return {
    creatives,
  };
}

/**
 * Filters all global ideaXchange ad settings by logged-in audience.
 */
export function filterIdeaxchangeAdsSettingsByAudience(
  settings: IdeaxchangeAdsSettings | null | undefined,
  audience: IdeaxchangeAdAudience,
): IdeaxchangeAdsSettings | null {
  if (!settings) {
    return null;
  }

  return {
    ...settings,
    homePrimaryHorizontal: filterIdeaxchangeAdSlotByAudience(
      settings.homePrimaryHorizontal,
      audience,
    ),
    homeSecondaryHorizontal: filterIdeaxchangeAdSlotByAudience(
      settings.homeSecondaryHorizontal,
      audience,
    ),
    homeSidebarVertical: filterIdeaxchangeAdSlotByAudience(
      settings.homeSidebarVertical,
      audience,
    ),
  };
}

/** Pick one creative at random for this render. */
export function pickIdeaxchangeAdCreative(
  slot?: IdeaxchangeAdSlot | null,
): InsightsAdSlotSetting | null {
  const creatives = getIdeaxchangeAdCreatives(slot);

  if (creatives.length === 0) {
    return null;
  }

  const index = Math.floor(Math.random() * creatives.length);
  const chosen = creatives[index];

  if (!chosen) {
    return null;
  }

  return {
    imageUrl: chosen.imageUrl,
    targetUrl: chosen.targetUrl,
    altText: chosen.altText,
  };
}
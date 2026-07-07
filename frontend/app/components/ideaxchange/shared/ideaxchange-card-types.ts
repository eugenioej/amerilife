export type IdeaxchangeCardItem = {
  id: string;
  slug?: string | null;
  title?: string | null;
  date?: string | null;
  excerpt?: string | null;
  badgeLabel?: string | null;
  href: string;
  featuredImage?: {
    node?: { sourceUrl?: string | null; altText?: string | null };
  } | null;
  isFeatured?: boolean;
  isSpotlight?: boolean;
};

/** Neutral gray placeholder for ideaXchange mock / missing featured images. */
export const IDEAXCHANGE_PLACEHOLDER_IMG = "/images/ideaxchange-placeholder.svg";

export function ideaxchangeFeaturedImageSrc(sourceUrl?: string | null): string {
  return sourceUrl?.trim() || IDEAXCHANGE_PLACEHOLDER_IMG;
}

export const IDEAXCHANGE_IMG_QUALITY = 82;

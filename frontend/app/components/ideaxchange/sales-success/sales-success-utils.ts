import type { IdeaxchangeListItem } from "@/lib/ideaxchange-queries";
import { IDEAXCHANGE_SALES_SUCCESS_PATH } from "@/lib/ideaxchange-constants";
import {
  dedupeIdeaxchangePosts,
  isIdeaxchangeFeatured,
} from "@/app/components/ideaxchange/magazine/ideaxchange-utils";

export const SALES_SUCCESS_BADGE_LABEL = "INCENTIVES";

export function salesSuccessHref(slug: string | null | undefined): string {
  if (!slug) return IDEAXCHANGE_SALES_SUCCESS_PATH;
  return `${IDEAXCHANGE_SALES_SUCCESS_PATH}${slug}/`;
}

export function partitionSalesSuccessPosts(posts: IdeaxchangeListItem[]) {
  const unique = dedupeIdeaxchangePosts(posts);

  let featured: IdeaxchangeListItem | null = null;
  const spotlightIdx = unique.findIndex((p) => p.ideaxchangeFields?.isSpotlight);
  if (spotlightIdx >= 0) {
    featured = unique[spotlightIdx]!;
  } else {
    const featuredIdx = unique.findIndex((p) => isIdeaxchangeFeatured(p));
    if (featuredIdx >= 0) {
      featured = unique[featuredIdx]!;
    } else if (unique.length > 0) {
      featured = unique[0]!;
    }
  }

  const rest = unique.filter((p) => p.id !== featured?.id);
  return { featured, rest };
}

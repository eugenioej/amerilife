import type { IdeaxchangeListItem } from "@/lib/ideaxchange-queries";
import { IDEAXCHANGE_SALES_SUCCESS_PATH } from "@/lib/ideaxchange-constants";
import {
  dedupeIdeaxchangePosts,
} from "@/app/components/ideaxchange/magazine/ideaxchange-utils";

export const SALES_SUCCESS_BADGE_LABEL = "INCENTIVES";

export function salesSuccessHref(slug: string | null | undefined): string {
  if (!slug) return IDEAXCHANGE_SALES_SUCCESS_PATH;
  return `${IDEAXCHANGE_SALES_SUCCESS_PATH}${slug}/`;
}

export function partitionSalesSuccessPosts(posts: IdeaxchangeListItem[]) {
  const unique = dedupeIdeaxchangePosts(posts);
  const featured = unique;
  const rest = unique;

  return { featured, rest };
}

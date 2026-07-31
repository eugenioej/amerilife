import { IDEAXCHANGE_RECRUITING_HUB_PATH } from "@/lib/ideaxchange-constants";
import type { CaseStudyListItem } from "@/lib/ideaxchange-recruiting-queries";

export const RECRUITING_HUB_FIRST = 36;
export const RECRUITING_LOAD_MORE_FIRST = 12;
export const RECRUITING_NEWSROOM_INITIAL = 8;

export function cleanOverviewText(value: string | null | undefined): string {
  if (!value) return "";

  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&#160;/g, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#034;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&ndash;/gi, "-")
    .replace(/&#8211;/g, "-")
    .replace(/&mdash;/gi, "-")
    .replace(/&#8212;/g, "-")
    .replace(/&hellip;/gi, "…")
    .replace(/&#8230;/g, "…")
    .replace(/\s+/g, " ")
    .trim();
}

export function caseStudyHref(slug: string | null | undefined): string {
  if (!slug) return IDEAXCHANGE_RECRUITING_HUB_PATH;
  return `${IDEAXCHANGE_RECRUITING_HUB_PATH}${slug}/`;
}

export function companyHref(slug: string | null | undefined): string {
  if (!slug) return IDEAXCHANGE_RECRUITING_HUB_PATH;
  return `${IDEAXCHANGE_RECRUITING_HUB_PATH}company/${slug}/`;
}

export function isCaseStudyFeatured(
  post: Pick<CaseStudyListItem, "ideaxchangeCaseStudyFields">,
): boolean {
  return post.ideaxchangeCaseStudyFields?.isFeatured === true;
}

export function isCaseStudyHeroFeatured(
  post: Pick<CaseStudyListItem, "ideaxchangeCaseStudyFields">,
): boolean {
  return post.ideaxchangeCaseStudyFields?.isHeroFeatured === true;
}

export function companyLabel(
  post: Pick<CaseStudyListItem, "caseStudyCompany">,
): string {
  return post.caseStudyCompany?.title?.trim() || "RECRUITING";
}

export type CampaignTableRow = {
  id: string;
  slug: string;
  title: string;
  targetAudience: string;
  spend: string;
  results: string;
  overview: string;
};

const DEFAULT_TARGET_AUDIENCE = "Target Audience Placeholder";

export function toCampaignTableRow(post: CaseStudyListItem): CampaignTableRow {
  const fields = post.ideaxchangeCaseStudyFields;
  const overview =
  cleanOverviewText(fields?.campaignOverview) ||
  cleanOverviewText(post.excerpt);

  return {
    id: post.id,
    slug: post.slug ?? "",
    title: post.title?.trim() || "Untitled campaign",
    targetAudience: fields?.targetAudience?.trim() || DEFAULT_TARGET_AUDIENCE,
    spend: fields?.campaignSpend?.trim() || "—",
    results: fields?.campaignResults?.trim() || "—",
    overview,
  };
}

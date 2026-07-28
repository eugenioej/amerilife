import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IdeaXchangeHomeArchivePage } from "@/app/components/ideaxchange/magazine/IdeaXchangeHomeArchivePage";
import { IdeaXchangeMagazinePage } from "@/app/components/ideaxchange/magazine/IdeaXchangeMagazinePage";
import {
  getIdeaxchangeAdAudienceFromPersona,
  getVisibleIdeaxchangeAdSlot,
  getVisibleIdeaxchangeAdsSettings,
} from "@/app/components/ideaxchange/shared/ideaxchange-ads";
import { requireIdeaxchangeAuth } from "@/lib/ideaxchange-auth";
import {
  IDEAXCHANGE_CAREER_LEADERBOARD_PATH,
  IDEAXCHANGE_HOME_FEED_PATH,
  IDEAXCHANGE_LEADERBOARD_PATH,
} from "@/lib/ideaxchange-constants";
import {
  getEffectiveIdeaxchangePersona,
  getIdeaxchangeDevViewMode,
} from "@/lib/ideaxchange-dev";
import {
  getIdeaxchangeAdsSettings,
  getIdeaxchangeHomeArchivePageData,
  getIdeaxchangeMagazineBundle,
  IDEAXCHANGE_HOME_PAGE_FIRST,
} from "@/lib/ideaxchange-data";
import { privatePageMetadata } from "@/lib/seo";

type SearchParams = Promise<{ page?: string | string[] }>;

function parseHomeArchivePage(sp: { page?: string | string[] }): number | null {
  const raw = sp.page;
  if (raw == null) return null;
  const s = Array.isArray(raw) ? raw[0] : raw;
  if (!s?.trim()) return null;
  const n = parseInt(s, 10);
  if (!Number.isFinite(n) || n < 1) return 1;
  return Math.floor(n);
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const page = parseHomeArchivePage(await searchParams);

  if (page == null) {
    return privatePageMetadata(
      "ideaXchange Home",
      "Your personalized ideaXchange feed — articles and updates across AmeriLife pillars.",
    );
  }

  const titlePage = page > 1 ? ` (Page ${page})` : "";

  return privatePageMetadata(
    `All Articles${titlePage} | ideaXchange`,
    `Browse every ideaXchange article by page${page > 1 ? ` (page ${page})` : ""}.`,
  );
}

export default async function IdeaxchangeHomePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const archivePage = parseHomeArchivePage(await searchParams);

  const auth = await requireIdeaxchangeAuth(IDEAXCHANGE_HOME_FEED_PATH);
  const devView = await getIdeaxchangeDevViewMode();

  const effectivePersona = getEffectiveIdeaxchangePersona(
    auth.persona,
    devView,
  );

  const adAudience = getIdeaxchangeAdAudienceFromPersona(effectivePersona);

  if (archivePage != null) {
    const [data, ideaxchangeAds] = await Promise.all([
      getIdeaxchangeHomeArchivePageData(archivePage, effectivePersona),
      getIdeaxchangeAdsSettings(),
    ]);

    if (!data) notFound();

    const visibleAdSlot = getVisibleIdeaxchangeAdSlot(
      ideaxchangeAds?.homePrimaryHorizontal,
      adAudience,
      devView,
    );

    return (
      <IdeaXchangeHomeArchivePage
        posts={data.posts}
        currentPage={data.currentPage}
        totalPages={data.totalPages}
        adSlot={visibleAdSlot}
      />
    );
  }

  const [bundle, ideaxchangeAds] = await Promise.all([
    getIdeaxchangeMagazineBundle(effectivePersona),
    getIdeaxchangeAdsSettings(),
  ]);

  const visibleIdeaxchangeAds = getVisibleIdeaxchangeAdsSettings(
    ideaxchangeAds,
    adAudience,
    devView,
  );

  const leaderboardCta =
    effectivePersona === "career"
      ? {
          href: IDEAXCHANGE_CAREER_LEADERBOARD_PATH,
          heading: "View current career leaderboards",
        }
      : {
          href: IDEAXCHANGE_LEADERBOARD_PATH,
          heading: "View current sales leaderboards",
        };

  return (
    <IdeaXchangeMagazinePage
      posts={bundle.posts}
      listPageInfo={bundle.pageInfo}
      ideaxchangeAds={visibleIdeaxchangeAds}
      leaderboardCta={leaderboardCta}
      paginationHref={
        bundle.pageInfo.hasNextPage || bundle.posts.length > IDEAXCHANGE_HOME_PAGE_FIRST
          ? `${IDEAXCHANGE_HOME_FEED_PATH}?page=2`
          : undefined
      }
    />
  );
}
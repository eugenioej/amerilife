import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SalesLeaderboardPage } from "@/app/components/ideaxchange/leaderboard/SalesLeaderboardPage";
import {
  getIdeaxchangeAdAudienceFromPersona,
  getVisibleIdeaxchangeAdsSettings,
} from "@/app/components/ideaxchange/shared/ideaxchange-ads";
import { requireIdeaxchangeAuth } from "@/lib/ideaxchange-auth";
import { IDEAXCHANGE_LEADERBOARD_PATH } from "@/lib/ideaxchange-constants";
import {
  canAccessSalesLeaderboard,
  getEffectiveIdeaxchangePersona,
  getIdeaxchangeDevViewMode,
} from "@/lib/ideaxchange-dev";
import {
  getLeaderboardHeroStories,
  getLeaderboardTables,
} from "@/lib/ideaxchange-leaderboard-data";
import {
  getIdeaxchangeAdsSettings,
  getIdeaxchangeSalesMagazineBundle,
} from "@/lib/ideaxchange-data";
import { getIdeaxchangeHomeForPersona } from "@/lib/ideaxchange-persona";
import { privatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = privatePageMetadata(
  "Sales Leaderboard | ideaXchange",
  "Health and wealth distribution standings for AmeriLife affiliates.",
);

export default async function LeaderboardIndexPage() {
  const auth = await requireIdeaxchangeAuth(IDEAXCHANGE_LEADERBOARD_PATH);
  const devView = await getIdeaxchangeDevViewMode();

  if (!canAccessSalesLeaderboard(auth.persona, devView)) {
    redirect(getIdeaxchangeHomeForPersona(auth.persona));
  }

  const effectivePersona = getEffectiveIdeaxchangePersona(
    auth.persona,
    devView,
  );

  const adAudience = getIdeaxchangeAdAudienceFromPersona(effectivePersona);

  const [tableData, heroStories, salesBundle, ideaxchangeAds] =
    await Promise.all([
      getLeaderboardTables(effectivePersona),
      Promise.resolve(getLeaderboardHeroStories()),
      getIdeaxchangeSalesMagazineBundle(effectivePersona),
      getIdeaxchangeAdsSettings(),
    ]);

  const visibleIdeaxchangeAds = getVisibleIdeaxchangeAdsSettings(
    ideaxchangeAds,
    adAudience,
    devView,
  );

  return (
    <SalesLeaderboardPage
      heroStories={heroStories}
      tableData={tableData}
      salesPosts={salesBundle.posts}
      salesListPageInfo={salesBundle.pageInfo}
      ideaxchangeAds={visibleIdeaxchangeAds}
    />
  );
}
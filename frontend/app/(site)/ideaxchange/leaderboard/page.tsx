import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SalesLeaderboardPage } from "@/app/components/ideaxchange/leaderboard/SalesLeaderboardPage";
import {
  filterIdeaxchangeAdsSettingsByAudience,
  getIdeaxchangeAdAudienceFromPersona,
} from "@/app/components/ideaxchange/shared/ideaxchange-ads";
import { requireIdeaxchangeAuth } from "@/lib/ideaxchange-auth";
import { IDEAXCHANGE_LEADERBOARD_PATH } from "@/lib/ideaxchange-constants";
import { canAccessSalesLeaderboard, getIdeaxchangeDevViewMode } from "@/lib/ideaxchange-dev";
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
  const adAudience = getIdeaxchangeAdAudienceFromPersona(auth.persona);
  const devView = await getIdeaxchangeDevViewMode();

  if (!canAccessSalesLeaderboard(auth.persona, devView)) {
    redirect(getIdeaxchangeHomeForPersona(auth.persona));
  }

  const [tableData, heroStories, salesBundle, ideaxchangeAds] = await Promise.all([
    getLeaderboardTables(auth.persona),
    Promise.resolve(getLeaderboardHeroStories()),
    getIdeaxchangeSalesMagazineBundle(auth.persona),
    getIdeaxchangeAdsSettings(),
  ]);

  const visibleIdeaxchangeAds = filterIdeaxchangeAdsSettingsByAudience(
    ideaxchangeAds,
    adAudience,
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
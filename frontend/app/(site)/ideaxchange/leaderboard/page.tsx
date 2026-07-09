import type { Metadata } from "next";
import { SalesLeaderboardPage } from "@/app/components/ideaxchange/leaderboard/SalesLeaderboardPage";
import { requireIdeaxchangeAuth } from "@/lib/ideaxchange-auth";
import { IDEAXCHANGE_LEADERBOARD_PATH } from "@/lib/ideaxchange-constants";
import {
  getLeaderboardHeroStories,
  getLeaderboardTables,
} from "@/lib/ideaxchange-leaderboard-data";
import { getIdeaxchangeSalesMagazineBundle } from "@/lib/ideaxchange-data";
import { getInsightsAdsSettings } from "@/lib/insights-data";
import { privatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = privatePageMetadata(
  "Sales Leaderboard | ideaXchange",
  "Health and wealth distribution standings for AmeriLife affiliates.",
);

export default async function LeaderboardIndexPage() {
  const auth = await requireIdeaxchangeAuth(IDEAXCHANGE_LEADERBOARD_PATH);

  const [tableData, heroStories, salesBundle, insightsAds] = await Promise.all([
    getLeaderboardTables(auth.persona),
    Promise.resolve(getLeaderboardHeroStories()),
    getIdeaxchangeSalesMagazineBundle(auth.persona),
    getInsightsAdsSettings(),
  ]);

  return (
    <SalesLeaderboardPage
      heroStories={heroStories}
      tableData={tableData}
      salesPosts={salesBundle.posts}
      salesListPageInfo={salesBundle.pageInfo}
      insightsAds={insightsAds}
    />
  );
}

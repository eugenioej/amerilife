import type { Metadata } from "next";
import { InsightsMagazinePage } from "@/app/components/insights/InsightsMagazinePage";
import { getInsightsAdsSettings, getInsightsMagazineBundle } from "@/lib/insights-data";
import { staticPageMetadata } from "@/lib/seo";

export const metadata: Metadata = staticPageMetadata(
  "Insights | AmeriLife",
  "Magazine-style stories on health, wealth, and leadership from AmeriLife — America’s leading health and wealth distribution company.",
  "/insights/",
);

export default async function InsightsPage() {
  const [{ posts, pageInfo }, insightsAds] = await Promise.all([
    getInsightsMagazineBundle(),
    getInsightsAdsSettings(),
  ]);

  return (
    <InsightsMagazinePage
      posts={posts}
      listPageInfo={pageInfo}
      insightsAds={insightsAds}
    />
  );
}

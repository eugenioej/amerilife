import type { Metadata } from "next";
import { IdeaXchangeMagazinePage } from "@/app/components/ideaxchange/magazine/IdeaXchangeMagazinePage";
import { requireIdeaxchangeAuth } from "@/lib/ideaxchange-auth";
import { IDEAXCHANGE_HOME_FEED_PATH } from "@/lib/ideaxchange-constants";
import { getIdeaxchangeMagazineBundle } from "@/lib/ideaxchange-data";
import { getInsightsAdsSettings } from "@/lib/insights-data";
import { privatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = privatePageMetadata(
  "ideaXchange Home",
  "Your personalized ideaXchange feed — articles and updates across AmeriLife pillars.",
);

export default async function IdeaxchangeHomePage() {
  const auth = await requireIdeaxchangeAuth(IDEAXCHANGE_HOME_FEED_PATH);

  const [bundle, insightsAds] = await Promise.all([
    getIdeaxchangeMagazineBundle(auth.persona),
    getInsightsAdsSettings(),
  ]);

  return (
    <IdeaXchangeMagazinePage
      posts={bundle.posts}
      listPageInfo={bundle.pageInfo}
      insightsAds={insightsAds}
    />
  );
}

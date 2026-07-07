import type { Metadata } from "next";
import { RecruitingHubPage } from "@/app/components/ideaxchange/recruiting/RecruitingHubPage";
import { requireIdeaxchangeAuth } from "@/lib/ideaxchange-auth";
import { IDEAXCHANGE_RECRUITING_HUB_PATH } from "@/lib/ideaxchange-constants";
import { getIdeaxchangeRecruitMagazineBundle } from "@/lib/ideaxchange-data";
import {
  getCaseStudiesList,
  getRecruitingHubBundle,
} from "@/lib/ideaxchange-recruiting-data";
import { getInsightsAdsSettings } from "@/lib/insights-data";
import { privatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = privatePageMetadata(
  "Recruiting Hub | ideaXchange",
  "Recruiting campaigns, case studies, and success stories for AmeriLife affiliates.",
);

export default async function RecruitingHubIndexPage() {
  await requireIdeaxchangeAuth(IDEAXCHANGE_RECRUITING_HUB_PATH);

  const [{ posts }, allCampaigns, recruitBundle, insightsAds] = await Promise.all([
    getRecruitingHubBundle(),
    getCaseStudiesList(),
    getIdeaxchangeRecruitMagazineBundle(),
    getInsightsAdsSettings(),
  ]);

  return (
    <RecruitingHubPage
      posts={posts}
      allCampaigns={allCampaigns}
      recruitPosts={recruitBundle.posts}
      recruitListPageInfo={recruitBundle.pageInfo}
      insightsAds={insightsAds}
    />
  );
}

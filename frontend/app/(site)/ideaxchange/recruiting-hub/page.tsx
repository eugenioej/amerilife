import type { Metadata } from "next";
import { RecruitingHubPage } from "@/app/components/ideaxchange/recruiting/RecruitingHubPage";
import {
  filterIdeaxchangeAdsSettingsByAudience,
  getIdeaxchangeAdAudienceFromPersona,
} from "@/app/components/ideaxchange/shared/ideaxchange-ads";
import { requireIdeaxchangeAuth } from "@/lib/ideaxchange-auth";
import { IDEAXCHANGE_RECRUITING_HUB_PATH } from "@/lib/ideaxchange-constants";
import {
  getIdeaxchangeAdsSettings,
  getIdeaxchangeRecruitMagazineBundle,
} from "@/lib/ideaxchange-data";
import {
  getCaseStudiesList,
  getRecruitingHubBundle,
} from "@/lib/ideaxchange-recruiting-data";
import { privatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = privatePageMetadata(
  "Recruiting Hub | ideaXchange",
  "Recruiting campaigns, case studies, and success stories for AmeriLife affiliates.",
);

export default async function RecruitingHubIndexPage() {
  const auth = await requireIdeaxchangeAuth(IDEAXCHANGE_RECRUITING_HUB_PATH);
  const adAudience = getIdeaxchangeAdAudienceFromPersona(auth.persona);

  const [{ posts }, allCampaigns, recruitBundle, ideaxchangeAds] = await Promise.all([
    getRecruitingHubBundle(auth.persona),
    getCaseStudiesList(auth.persona),
    getIdeaxchangeRecruitMagazineBundle(auth.persona),
    getIdeaxchangeAdsSettings(),
  ]);

  const visibleIdeaxchangeAds = filterIdeaxchangeAdsSettingsByAudience(
    ideaxchangeAds,
    adAudience,
  );

  return (
    <RecruitingHubPage
      posts={posts}
      allCampaigns={allCampaigns}
      recruitPosts={recruitBundle.posts}
      recruitListPageInfo={recruitBundle.pageInfo}
      ideaxchangeAds={visibleIdeaxchangeAds}
    />
  );
}
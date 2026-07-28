import type { Metadata } from "next";
import { RecruitingHubPage } from "@/app/components/ideaxchange/recruiting/RecruitingHubPage";
import {
  getIdeaxchangeAdAudienceFromPersona,
  getVisibleIdeaxchangeAdsSettings,
} from "@/app/components/ideaxchange/shared/ideaxchange-ads";
import {
  getEffectiveIdeaxchangePersona,
  getIdeaxchangeDevViewMode,
} from "@/lib/ideaxchange-dev";
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
  const devView = await getIdeaxchangeDevViewMode();

  const effectivePersona = getEffectiveIdeaxchangePersona(
    auth.persona,
    devView,
  );

  const adAudience = getIdeaxchangeAdAudienceFromPersona(effectivePersona);

  const [{ posts }, allCampaigns, recruitBundle, ideaxchangeAds] =
    await Promise.all([
      getRecruitingHubBundle(effectivePersona),
      getCaseStudiesList(effectivePersona),
      getIdeaxchangeRecruitMagazineBundle(effectivePersona),
      getIdeaxchangeAdsSettings(),
    ]);

  const visibleIdeaxchangeAds = getVisibleIdeaxchangeAdsSettings(
    ideaxchangeAds,
    adAudience,
    devView,
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
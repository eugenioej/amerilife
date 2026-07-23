import type { Metadata } from "next";
import { SalesSuccessPage } from "@/app/components/ideaxchange/sales-success/SalesSuccessPage";
import {
  filterIdeaxchangeAdsSettingsByAudience,
  getIdeaxchangeAdAudienceFromPersona,
} from "@/app/components/ideaxchange/shared/ideaxchange-ads";
import { requireIdeaxchangeAuth } from "@/lib/ideaxchange-auth";
import { IDEAXCHANGE_SALES_SUCCESS_PATH } from "@/lib/ideaxchange-constants";
import {
  getIdeaxchangeAdsSettings,
  getIdeaxchangeInitiativeMagazineBundle,
} from "@/lib/ideaxchange-data";
import { privatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = privatePageMetadata(
  "Sales Success | ideaXchange",
  "Sales incentives, contests, and recognition programs for AmeriLife associates.",
);

export default async function SalesSuccessIndexPage() {
  const auth = await requireIdeaxchangeAuth(IDEAXCHANGE_SALES_SUCCESS_PATH);
  const adAudience = getIdeaxchangeAdAudienceFromPersona(auth.persona);

  const [initiativeBundle, ideaxchangeAds] = await Promise.all([
    getIdeaxchangeInitiativeMagazineBundle(auth.persona),
    getIdeaxchangeAdsSettings(),
  ]);

  const visibleIdeaxchangeAds = filterIdeaxchangeAdsSettingsByAudience(
    ideaxchangeAds,
    adAudience,
  );

  return (
    <SalesSuccessPage
      posts={initiativeBundle.posts}
      pageInfo={initiativeBundle.pageInfo}
      ideaxchangeAds={visibleIdeaxchangeAds}
    />
  );
}
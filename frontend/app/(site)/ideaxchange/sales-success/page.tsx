import type { Metadata } from "next";
import { SalesSuccessPage } from "@/app/components/ideaxchange/sales-success/SalesSuccessPage";
import {
  getIdeaxchangeAdAudienceFromPersona,
  getVisibleIdeaxchangeAdsSettings,
} from "@/app/components/ideaxchange/shared/ideaxchange-ads";
import { requireIdeaxchangeAuth } from "@/lib/ideaxchange-auth";
import { IDEAXCHANGE_SALES_SUCCESS_PATH } from "@/lib/ideaxchange-constants";
import {
  getEffectiveIdeaxchangePersona,
  getIdeaxchangeDevViewMode,
} from "@/lib/ideaxchange-dev";
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
  const devView = await getIdeaxchangeDevViewMode();

  const effectivePersona = getEffectiveIdeaxchangePersona(
    auth.persona,
    devView,
  );

  const adAudience = getIdeaxchangeAdAudienceFromPersona(effectivePersona);

  const [initiativeBundle, ideaxchangeAds] = await Promise.all([
    getIdeaxchangeInitiativeMagazineBundle(effectivePersona),
    getIdeaxchangeAdsSettings(),
  ]);

  const visibleIdeaxchangeAds = getVisibleIdeaxchangeAdsSettings(
    ideaxchangeAds,
    adAudience,
    devView,
  );

  return (
    <SalesSuccessPage
      posts={initiativeBundle.posts}
      pageInfo={initiativeBundle.pageInfo}
      ideaxchangeAds={visibleIdeaxchangeAds}
    />
  );
}
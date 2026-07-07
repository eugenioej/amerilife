import type { Metadata } from "next";
import { SalesSuccessPage } from "@/app/components/ideaxchange/sales-success/SalesSuccessPage";
import { requireIdeaxchangeAuth } from "@/lib/ideaxchange-auth";
import { IDEAXCHANGE_SALES_SUCCESS_PATH } from "@/lib/ideaxchange-constants";
import { getIdeaxchangeInitiativeMagazineBundle } from "@/lib/ideaxchange-data";
import { getInsightsAdsSettings } from "@/lib/insights-data";
import { privatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = privatePageMetadata(
  "Sales Success | ideaXchange",
  "Sales incentives, contests, and recognition programs for AmeriLife associates.",
);

export default async function SalesSuccessIndexPage() {
  await requireIdeaxchangeAuth(IDEAXCHANGE_SALES_SUCCESS_PATH);

  const [initiativeBundle, insightsAds] = await Promise.all([
    getIdeaxchangeInitiativeMagazineBundle(),
    getInsightsAdsSettings(),
  ]);

  return (
    <SalesSuccessPage
      posts={initiativeBundle.posts}
      pageInfo={initiativeBundle.pageInfo}
      insightsAds={insightsAds}
    />
  );
}

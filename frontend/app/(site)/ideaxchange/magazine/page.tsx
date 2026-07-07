import type { Metadata } from "next";
import { IdeaXchangeMagazinePage } from "@/app/components/ideaxchange/magazine/IdeaXchangeMagazinePage";
import { requireIdeaxchangeAuth } from "@/lib/ideaxchange-auth";
import { getIdeaxchangeMagazineBundle } from "@/lib/ideaxchange-data";
import { getInsightsAdsSettings } from "@/lib/insights-data";
import { privatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = privatePageMetadata(
  "ideaXchange | AmeriLife",
  "Internal ideaXchange magazine for AmeriLife employees and affiliates.",
);

export default async function IdeaxchangeMagazineIndexPage() {
  await requireIdeaxchangeAuth("/ideaxchange/magazine/");

  const [{ posts, pageInfo }, insightsAds] = await Promise.all([
    getIdeaxchangeMagazineBundle(),
    getInsightsAdsSettings(),
  ]);

  return (
    <IdeaXchangeMagazinePage posts={posts} listPageInfo={pageInfo} insightsAds={insightsAds} />
  );
}

import type { Metadata } from "next";
import { ResourcesPage } from "@/app/components/ideaxchange/resources/ResourcesPage";
import {
  getIdeaxchangeAdAudienceFromPersona,
  getVisibleIdeaxchangeAdsSettings,
} from "@/app/components/ideaxchange/shared/ideaxchange-ads";
import {
  getEffectiveIdeaxchangePersona,
  getIdeaxchangeDevViewMode,
} from "@/lib/ideaxchange-dev";
import { requireIdeaxchangeAuth } from "@/lib/ideaxchange-auth";
import { IDEAXCHANGE_RESOURCES_PATH } from "@/lib/ideaxchange-constants";
import { getIdeaxchangeAdsSettings } from "@/lib/ideaxchange-data";
import { privatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = privatePageMetadata(
  "Resources | ideaXchange",
  "Explore resources, tools, and learning opportunities available through ideaXchange.",
);

export default async function ResourcesIndexPage() {
  const auth = await requireIdeaxchangeAuth(IDEAXCHANGE_RESOURCES_PATH);
  const devView = await getIdeaxchangeDevViewMode();

  const effectivePersona = getEffectiveIdeaxchangePersona(
    auth.persona,
    devView,
  );

  const adAudience = getIdeaxchangeAdAudienceFromPersona(effectivePersona);

  const ideaxchangeAds = await getIdeaxchangeAdsSettings();

  const visibleIdeaxchangeAds = getVisibleIdeaxchangeAdsSettings(
    ideaxchangeAds,
    adAudience,
    devView,
  );

  return <ResourcesPage ideaxchangeAds={visibleIdeaxchangeAds} />;
}
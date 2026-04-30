import type { Metadata } from "next";
import type { LocationData } from "@/lib/locations-data";
import { getAllLocationSlugs, getLocationBySlug } from "@/lib/locations-data";
import { FindAgentContent } from "@/app/components/locations/FindAgentContent";
import { staticPageMetadata } from "@/lib/seo";
import { fetchLocationsForFindAgentPage } from "@/lib/agencies";
import { FIND_AN_AGENT_FORM_ID, fetchGravityForm } from "@/lib/gf-client";

export const metadata: Metadata = staticPageMetadata(
  "Find An Agent | AmeriLife",
  "Locate an AmeriLife agency near you. Connect with licensed agents for Medicare, health insurance, life insurance, and annuities.",
  "/find-an-agent/"
);

export default async function FindAnAgentPage() {
  const [locationsResult, form] = await Promise.allSettled([
    fetchLocationsForFindAgentPage().catch(() => [] as LocationData[]),
    fetchGravityForm(FIND_AN_AGENT_FORM_ID),
  ]);

  let locations: LocationData[] =
    locationsResult.status === "fulfilled" ? locationsResult.value : [];

  if (locations.length === 0) {
    const slugs = getAllLocationSlugs();
    locations = slugs
      .map((slug) => getLocationBySlug(slug))
      .filter((l): l is NonNullable<typeof l> => l !== null);
  }

  const connectForm = form.status === "fulfilled" ? (form.value ?? null) : null;

  return <FindAgentContent locations={locations} connectForm={connectForm} />;
}

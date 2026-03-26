import type { Metadata } from "next";
import { getAllLocationSlugs, getLocationBySlug } from "@/lib/locations-data";
import { FindAgentContent } from "@/app/components/locations/FindAgentContent";
import { staticPageMetadata } from "@/lib/seo";

export const metadata: Metadata = staticPageMetadata(
  "Find An Agent | AmeriLife",
  "Locate an AmeriLife agency near you. Connect with licensed agents for Medicare, health insurance, life insurance, and annuities.",
  "/find-an-agent/"
);

export default function FindAnAgentPage() {
  const slugs = getAllLocationSlugs();
  const locations = slugs
    .map((slug) => getLocationBySlug(slug))
    .filter((l): l is NonNullable<typeof l> => l !== null);

  return <FindAgentContent locations={locations} />;
}

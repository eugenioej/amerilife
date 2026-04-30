import { OfficeInfoHero } from "./OfficeInfoHero";
import { AgentsGrid } from "./AgentsGrid";
import { FeaturesGrid } from "./FeaturesGrid";
import type { LocationData } from "@/lib/locations-data";
import type { GfFormData } from "@/lib/gf-types";

type LocationPageTemplateProps = {
  location: LocationData;
  connectForm: GfFormData | null;
};

export function LocationPageTemplate({ location, connectForm }: LocationPageTemplateProps) {
  const showAgentsGrid = location.agents.length > 1;

  return (
    <article className="bg-white">
      <OfficeInfoHero location={location} connectForm={connectForm} />
      {showAgentsGrid ? (
        <AgentsGrid agents={location.agents} locationSlug={location.slug} />
      ) : null}
      <FeaturesGrid features={location.features} />
    </article>
  );
}

import { OfficeInfoHero } from "./OfficeInfoHero";
import { AgentsGrid } from "./AgentsGrid";
import { ConnectAgentBanner } from "./ConnectAgentBanner";
import { FeaturesGrid } from "./FeaturesGrid";
import type { LocationData } from "@/lib/locations-data";

type LocationPageTemplateProps = {
  location: LocationData;
};

export function LocationPageTemplate({ location }: LocationPageTemplateProps) {
  return (
    <article className="bg-white">
      <OfficeInfoHero location={location} />
      <AgentsGrid agents={location.agents} locationSlug={location.slug} />
      <ConnectAgentBanner location={location} />
      <FeaturesGrid features={location.features} />
    </article>
  );
}

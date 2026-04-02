import { OfficeInfoHero } from "./OfficeInfoHero";
import { AgentsGrid } from "./AgentsGrid";
import { ConnectAgentBanner } from "./ConnectAgentBanner";
import { FeaturesGrid } from "./FeaturesGrid";
import type { LocationData } from "@/lib/locations-data";
import type { GfFormData } from "@/lib/gf-types";

type LocationPageTemplateProps = {
  location: LocationData;
  connectForm: GfFormData | null;
};

export function LocationPageTemplate({ location, connectForm }: LocationPageTemplateProps) {
  return (
    <article className="bg-white">
      <OfficeInfoHero location={location} />
      <AgentsGrid agents={location.agents} locationSlug={location.slug} />
      <ConnectAgentBanner location={location} connectForm={connectForm} />
      <FeaturesGrid features={location.features} />
    </article>
  );
}

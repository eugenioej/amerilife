import { OfficeInfoHero } from "./OfficeInfoHero";
import { AgentsGrid } from "./AgentsGrid";
import { FeaturesGrid } from "./FeaturesGrid";
import type { LocationData } from "@/lib/locations-data";
import type { GfFormData } from "@/lib/gf-types";
import { HideContactButton } from "@/app/components/layout/HideContactButton";
import { AgencyFooterDisclaimerSetter } from "./AgencyFooterDisclaimerSetter";


type LocationPageTemplateProps = {
  location: LocationData;
  connectForm: GfFormData | null;
};

export function LocationPageTemplate({ location, connectForm }: LocationPageTemplateProps) {
  const showAgentsGrid = location.agents.length > 1;

  return (
    <>
      <HideContactButton />
      
      <AgencyFooterDisclaimerSetter
        disclaimer={location.footerDisclaimer}
      />
    
      <article className="bg-white agency-page">
        <OfficeInfoHero location={location} connectForm={connectForm} />
        {showAgentsGrid ? (
          <AgentsGrid agents={location.agents} locationSlug={location.slug} />
        ) : null}
        <FeaturesGrid features={location.features} />
      </article>
    </>
  );
}

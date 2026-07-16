import { IdeaXchangePillarBanner } from "@/app/components/ideaxchange/shared/IdeaXchangePillarBanner";
import type { CarrierListItem } from "@/lib/ideaxchange-carrier-queries";
import { partitionCarriers } from "@/lib/ideaxchange-carrier-utils";
import { CarrierSpotlightAdditionalGrid } from "./CarrierSpotlightAdditionalGrid";
import { CarrierSpotlightHeroGrid } from "./CarrierSpotlightHeroGrid";

type Props = {
  carriers: CarrierListItem[];
};

export function CarrierSpotlightPage({ carriers }: Props) {
  const { hero, additional } = partitionCarriers(carriers);

  return (
    <div className="bg-white pb-16 md:pb-20">
      <IdeaXchangePillarBanner title="Career Spotlight" />
      <CarrierSpotlightHeroGrid carriers={hero} />

      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)] py-10 md:py-14">
        <CarrierSpotlightAdditionalGrid carriers={additional} />
      </div>
    </div>
  );
}

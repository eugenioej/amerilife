import { IdeaXchangePillarBanner } from "@/app/components/ideaxchange/shared/IdeaXchangePillarBanner";
import { IdeaxchangeHorizontalAdSlot } from "@/app/components/ideaxchange/shared/IdeaxchangeHorizontalAdSlot";
import { ResourcesIntro } from "./ResourcesIntro";
import { ResourcesGrid } from "./ResourcesGrid";
import type { IdeaxchangeAdsSettings } from "@/lib/queries";

type Props = {
  ideaxchangeAds?: IdeaxchangeAdsSettings | null;
};

export function ResourcesPage({
  ideaxchangeAds,
}: Props) {
  return (
    <div className="bg-white pb-16 md:pb-20">
      <IdeaXchangePillarBanner title="Resources" />

      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)] py-10 md:py-14">
        <ResourcesIntro />
        <ResourcesGrid />
        <IdeaxchangeHorizontalAdSlot
          slot={ideaxchangeAds?.homePrimaryHorizontal}
          className="mt-20"
        />
      </div>
    </div>
  );
}
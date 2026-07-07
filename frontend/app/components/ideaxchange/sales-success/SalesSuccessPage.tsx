import { IdeaXchangeNewsroomColumn } from "@/app/components/ideaxchange/magazine/IdeaXchangeNewsroomColumn";
import { INSIGHTS_NEWSROOM_INITIAL } from "@/app/components/ideaxchange/magazine/ideaxchange-utils";
import { IdeaXchangePillarBanner } from "@/app/components/ideaxchange/shared/IdeaXchangePillarBanner";
import { IdeaxchangeHorizontalAdSlot } from "@/app/components/ideaxchange/shared/IdeaxchangeHorizontalAdSlot";
import { IdeaxchangeSidebarAdSlot } from "@/app/components/ideaxchange/shared/IdeaxchangeSidebarAdSlot";
import type { IdeaxchangeListItem } from "@/lib/ideaxchange-queries";
import type { InsightsAdsSettings } from "@/lib/queries";
import { IDEAXCHANGE_SALES_SUCCESS_PATH } from "@/lib/ideaxchange-constants";
import { IDEAXCHANGE_INITIATIVE_TAG_SLUG } from "@/lib/ideaxchange-data";
import { SalesSuccessFeaturedHero } from "./SalesSuccessFeaturedHero";
import { partitionSalesSuccessPosts, SALES_SUCCESS_BADGE_LABEL } from "./sales-success-utils";

type Props = {
  posts: IdeaxchangeListItem[];
  pageInfo?: {
    hasNextPage: boolean;
    endCursor: string | null;
  };
  insightsAds?: InsightsAdsSettings | null;
};

export function SalesSuccessPage({ posts, pageInfo, insightsAds }: Props) {
  const { featured, rest } = partitionSalesSuccessPosts(posts);

  return (
    <div className="bg-white pb-16 md:pb-20">
      <IdeaXchangePillarBanner title="Sales Success" />
      {featured ? <SalesSuccessFeaturedHero post={featured} /> : null}

      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)] py-10 md:py-14">
        <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-brand-primary)]">
          Newsroom
        </h2>

        <IdeaxchangeHorizontalAdSlot slot={insightsAds?.primaryHorizontal} className="mt-8" />

        <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-8">
            <IdeaXchangeNewsroomColumn
              initialPosts={rest.slice(0, INSIGHTS_NEWSROOM_INITIAL)}
              deferredBatchPosts={rest.slice(INSIGHTS_NEWSROOM_INITIAL)}
              initialHasNextPage={pageInfo?.hasNextPage ?? false}
              initialEndCursor={pageInfo?.endCursor ?? null}
              tagSlug={IDEAXCHANGE_INITIATIVE_TAG_SLUG}
              badgeLabel={SALES_SUCCESS_BADGE_LABEL}
              articleBasePath={IDEAXCHANGE_SALES_SUCCESS_PATH}
            />
          </div>

          <aside className="lg:col-span-4">
            <IdeaxchangeSidebarAdSlot slot={insightsAds?.sidebarVertical} />
          </aside>
        </div>
      </div>
    </div>
  );
}

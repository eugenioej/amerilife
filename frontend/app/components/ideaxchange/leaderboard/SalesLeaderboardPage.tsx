import { Link } from "@/app/components/ui/Link";
import { IdeaXchangeNewsroomColumn } from "@/app/components/ideaxchange/magazine/IdeaXchangeNewsroomColumn";
import {
  INSIGHTS_NEWSROOM_INITIAL,
  partitionNewsroomWithSidebar,
} from "@/app/components/ideaxchange/magazine/ideaxchange-utils";
import { IdeaXchangeMagazineSidebar } from "@/app/components/ideaxchange/magazine/IdeaXchangeMagazineSidebar";
import { IdeaXchangeHeroGrid } from "@/app/components/ideaxchange/shared/IdeaXchangeHeroGrid";
import { IdeaXchangePillarBanner } from "@/app/components/ideaxchange/shared/IdeaXchangePillarBanner";
import type { IdeaxchangeCardItem } from "@/app/components/ideaxchange/shared/ideaxchange-card-types";
import type { IdeaxchangeListItem } from "@/lib/ideaxchange-queries";
import type { IdeaxchangeAdsSettings } from "@/lib/queries";
import { IDEAXCHANGE_LEADERBOARD_PATH } from "@/lib/ideaxchange-constants";
import { IDEAXCHANGE_SALES_TAG_SLUG } from "@/lib/ideaxchange-data";
import {
  LEADERBOARD_TABLE_CONFIG,
  type LeaderboardTableData,
} from "@/lib/ideaxchange-leaderboard-data";
import { LeaderboardQuickNav } from "./LeaderboardQuickNav";
import { LeaderboardSection } from "./LeaderboardSection";
import { IdeaxchangeHorizontalAdSlot } from "@/app/components/ideaxchange/shared/IdeaxchangeHorizontalAdSlot";

type Props = {
  heroStories: IdeaxchangeCardItem[];
  tableData: Record<string, LeaderboardTableData>;
  salesPosts: IdeaxchangeListItem[];
  salesListPageInfo?: {
    hasNextPage: boolean;
    endCursor: string | null;
  };
  ideaxchangeAds?: IdeaxchangeAdsSettings | null;
};

export function SalesLeaderboardPage({
  heroStories,
  tableData,
  salesPosts,
  salesListPageInfo,
  ideaxchangeAds,
}: Props) {
  const { spotlight, recentSidebar, newsroomRest } =
    partitionNewsroomWithSidebar(salesPosts);

  return (
    <div className="bg-white pb-16 md:pb-20">
      <IdeaXchangePillarBanner title="Sales Leaderboard" />
      <IdeaXchangeHeroGrid items={heroStories} defaultBadge="SALES" />

      <IdeaXchangePillarBanner
        title="The Health and Wealth Distribution Standings"
        className="mt-0 min-h-[100px] md:min-h-[120px]"
      />

      <LeaderboardQuickNav />

      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)] py-10 md:py-14">
        {LEADERBOARD_TABLE_CONFIG.map((section) => (
          <LeaderboardSection key={section.slug} section={section} tableData={tableData} />
        ))}

        <section className="mt-16 border-t border-[var(--color-border)] pt-12 md:mt-20 md:pt-16">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-brand-primary)]">
                Sales
              </h2>
              <p className="mt-2 text-sm text-[var(--color-muted)]">
                Latest articles for Brokerage teams.
              </p>
            </div>
            <Link
              href={IDEAXCHANGE_LEADERBOARD_PATH}
              variant="button"
              className="inline-flex min-h-[44px] items-center justify-center rounded-sm bg-[var(--color-brand-primary)] px-6 text-sm font-bold uppercase tracking-wide text-white hover:bg-[var(--color-brand-primary-hover)]"
            >
              View Leaderboard
            </Link>
          </div>

          <IdeaxchangeHorizontalAdSlot
            slot={ideaxchangeAds?.homeSecondaryHorizontal}
            className="mt-10"
          />

          <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-8">
              <IdeaXchangeNewsroomColumn
                initialPosts={newsroomRest.slice(0, INSIGHTS_NEWSROOM_INITIAL)}
                deferredBatchPosts={newsroomRest.slice(INSIGHTS_NEWSROOM_INITIAL)}
                initialHasNextPage={salesListPageInfo?.hasNextPage ?? false}
                initialEndCursor={salesListPageInfo?.endCursor ?? null}
                tagSlug={IDEAXCHANGE_SALES_TAG_SLUG}
                badgeLabel="SALES"
                badgeHref={IDEAXCHANGE_LEADERBOARD_PATH}
              />
            </div>

            <aside className="lg:col-span-4">
              <IdeaXchangeMagazineSidebar
                spotlight={spotlight}
                recentSidebar={recentSidebar}
                spotlightBadgeLabel="SALES"
                spotlightBadgeHref={IDEAXCHANGE_LEADERBOARD_PATH}
                adSlot={ideaxchangeAds?.homeSidebarVertical}
              />
            </aside>
          </div>
        </section>
      </div>
    </div>
  );
}

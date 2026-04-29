import { SiteBreadcrumb } from "@/app/components/layout/SiteBreadcrumb";
import type { InsightListItem, InsightsAdsSettings } from "@/lib/queries";
import { AdBannerHorizontal, hasInsightsAdSlotImage } from "./InsightsAds";
import { InsightsCategoryArticlesSection } from "./InsightsCategoryArticlesSection";
import { InsightsCategoryPagination } from "./InsightsCategoryPagination";
import { InsightsNewsroomColumn } from "./InsightsNewsroomColumn";

type Props = {
  topicSlug: string;
  topicName: string;
  posts: InsightListItem[];
  currentPage: number;
  totalPages: number;
  insightsAds?: InsightsAdsSettings | null;
};

export function InsightsCategoryPage({
  topicSlug,
  topicName,
  posts,
  currentPage,
  totalPages,
  insightsAds,
}: Props) {
  return (
    <div className="bg-white pb-16 md:pb-20">
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)] pt-8 md:pt-10">
        <SiteBreadcrumb
          className="mb-6"
          items={[
            { label: "Home", href: "/" },
            { label: "Insights", href: "/insights/" },
            { label: topicName, className: "max-w-[min(100%,20rem)] truncate" },
          ]}
        />
        <h1 className="font-sans text-3xl font-bold tracking-tight text-[var(--color-brand-dark)] md:text-4xl">
          {topicName}
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-[var(--color-muted)]">
          Articles and resources in the {topicName} category.
        </p>

        {hasInsightsAdSlotImage(insightsAds?.primaryHorizontal) ? (
          <div className="mt-10">
            <AdBannerHorizontal slot={insightsAds?.primaryHorizontal} />
          </div>
        ) : null}

        <InsightsCategoryArticlesSection>
          <InsightsNewsroomColumn
            initialPosts={posts}
            deferredBatchPosts={[]}
            initialEndCursor={null}
            initialHasNextPage={false}
            enableLoadMore={false}
          />
          <InsightsCategoryPagination
            topicSlug={topicSlug}
            currentPage={currentPage}
            totalPages={totalPages}
          />
        </InsightsCategoryArticlesSection>
      </div>
    </div>
  );
}

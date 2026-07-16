import { SiteBreadcrumb } from "@/app/components/layout/SiteBreadcrumb";
import { IdeaxchangeHorizontalAdSlot } from "@/app/components/ideaxchange/shared/IdeaxchangeHorizontalAdSlot";
import { IDEAXCHANGE_HOME_FEED_PATH } from "@/lib/ideaxchange-constants";
import type { IdeaxchangeListItem } from "@/lib/ideaxchange-queries";
import type { InsightsAdsSettings } from "@/lib/queries";
import { IdeaXchangeCategoryArticlesSection } from "./IdeaXchangeCategoryArticlesSection";
import { IdeaXchangeCategoryPagination } from "./IdeaXchangeCategoryPagination";
import { IdeaXchangeNewsroomColumn } from "./IdeaXchangeNewsroomColumn";

type Props = {
  topicSlug: string;
  topicName: string;
  posts: IdeaxchangeListItem[];
  currentPage: number;
  totalPages: number;
  insightsAds?: InsightsAdsSettings | null;
};

export function IdeaXchangeCategoryPage({
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
            { label: "ideaXchange", href: IDEAXCHANGE_HOME_FEED_PATH },
            { label: topicName, className: "max-w-[min(100%,20rem)] truncate" },
          ]}
        />
        <h1 className="font-sans text-3xl font-bold tracking-tight text-[var(--color-brand-dark)] md:text-4xl">
          {topicName}
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-[var(--color-muted)]">
          Articles and resources in the {topicName} category.
        </p>

        <IdeaxchangeHorizontalAdSlot slot={insightsAds?.primaryHorizontal} className="mt-10" />

        <IdeaXchangeCategoryArticlesSection>
          <IdeaXchangeNewsroomColumn
            initialPosts={posts}
            deferredBatchPosts={[]}
            initialEndCursor={null}
            initialHasNextPage={false}
            enableLoadMore={false}
          />
          <IdeaXchangeCategoryPagination
            topicSlug={topicSlug}
            currentPage={currentPage}
            totalPages={totalPages}
          />
        </IdeaXchangeCategoryArticlesSection>
      </div>
    </div>
  );
}

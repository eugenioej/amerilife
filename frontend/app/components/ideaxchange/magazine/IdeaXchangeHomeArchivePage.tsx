import { SiteBreadcrumb } from "@/app/components/layout/SiteBreadcrumb";
import { IdeaxchangeHorizontalAdSlot } from "@/app/components/ideaxchange/shared/IdeaxchangeHorizontalAdSlot";
import { IDEAXCHANGE_HOME_FEED_PATH } from "@/lib/ideaxchange-constants";
import type { IdeaxchangeListItem } from "@/lib/ideaxchange-queries";
import type { IdeaxchangeAdSlot } from "@/lib/queries";
import { IdeaXchangeCategoryArticlesSection } from "./IdeaXchangeCategoryArticlesSection";
import { IdeaXchangeNewsroomColumn } from "./IdeaXchangeNewsroomColumn";
import { IdeaXchangePagination } from "./IdeaXchangePagination";

type Props = {
  posts: IdeaxchangeListItem[];
  currentPage: number;
  totalPages: number;
  adSlot?: IdeaxchangeAdSlot | null;
};

export function IdeaXchangeHomeArchivePage({
  posts,
  currentPage,
  totalPages,
  adSlot,
}: Props) {
  return (
    <div className="bg-white pb-16 md:pb-20">
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)] pt-8 md:pt-10">
        <SiteBreadcrumb
          className="mb-6"
          items={[
            { label: "Home", href: "/" },
            { label: "ideaXchange", href: IDEAXCHANGE_HOME_FEED_PATH },
            { label: "All articles" },
          ]}
        />
        <h1 className="font-sans text-3xl font-bold tracking-tight text-[var(--color-brand-dark)] md:text-4xl">
          All articles
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-[var(--color-muted)]">
          Browse every ideaXchange article by page.
        </p>

        <IdeaxchangeHorizontalAdSlot slot={adSlot} className="mt-10" />

        <IdeaXchangeCategoryArticlesSection>
          <IdeaXchangeNewsroomColumn
            initialPosts={posts}
            deferredBatchPosts={[]}
            initialEndCursor={null}
            initialHasNextPage={false}
            enableLoadMore={false}
          />
          <IdeaXchangePagination
            basePath={IDEAXCHANGE_HOME_FEED_PATH}
            currentPage={currentPage}
            totalPages={totalPages}
            ariaLabel="Home article pages"
            includePageOneQuery
          />
        </IdeaXchangeCategoryArticlesSection>
      </div>
    </div>
  );
}

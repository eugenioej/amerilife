import { SiteBreadcrumb } from "@/app/components/layout/SiteBreadcrumb";
import { IdeaxchangeHorizontalAdSlot } from "@/app/components/ideaxchange/shared/IdeaxchangeHorizontalAdSlot";
import { IDEAXCHANGE_HOME_FEED_PATH } from "@/lib/ideaxchange-constants";
import type { IdeaxchangeListItem } from "@/lib/ideaxchange-queries";
import type { IdeaxchangeAdSlot } from "@/lib/queries";
import { IdeaXchangeTagArticlesSection } from "./IdeaXchangeTagArticlesSection";
import { IdeaXchangeTagPagination } from "./IdeaXchangeTagPagination";
import { IdeaXchangeNewsroomColumn } from "./IdeaXchangeNewsroomColumn";

type Props = {
  tagSlug: string;
  tagName: string;
  posts: IdeaxchangeListItem[];
  currentPage: number;
  totalPages: number;
  adSlot?: IdeaxchangeAdSlot | null;
};

export function IdeaXchangeTagPage({
  tagSlug,
  tagName,
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
            { label: tagName, className: "max-w-[min(100%,20rem)] truncate" },
          ]}
        />
        <h1 className="font-sans text-3xl font-bold tracking-tight text-[var(--color-brand-dark)] md:text-4xl">
          {tagName}
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-[var(--color-muted)]">
          Articles and resources tagged with {tagName}.
        </p>

        <IdeaXchangeTagArticlesSection>
          <IdeaXchangeNewsroomColumn
            initialPosts={posts}
            deferredBatchPosts={[]}
            initialEndCursor={null}
            initialHasNextPage={false}
            enableLoadMore={false}
          />
          <IdeaXchangeTagPagination
            tagSlug={tagSlug}
            currentPage={currentPage}
            totalPages={totalPages}
          />
          <IdeaxchangeHorizontalAdSlot slot={adSlot} className="mt-10" />
        </IdeaXchangeTagArticlesSection>
      </div>
    </div>
  );
}

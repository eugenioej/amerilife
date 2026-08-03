// app/components/insights/InsightsCategoryPage.tsx

import { SiteBreadcrumb } from "@/app/components/layout/SiteBreadcrumb";
import type { InsightListItem, InsightsAdsSettings } from "@/lib/queries";
import { InsightsCategoryCardGrid } from "./InsightsCategoryCardGrid";
import { InsightsCategoryPagination } from "./InsightsCategoryPagination";
import {
  InsightsListingToolbar,
  type InsightCategoryOption,
} from "./InsightsListingToolbar";

type Props = {
  topicSlug: string;
  topicName: string;
  posts: InsightListItem[];
  currentPage: number;
  totalPages: number;
  categories: InsightCategoryOption[];
  insightsAds?: InsightsAdsSettings | null;
};

export function InsightsCategoryPage({
  topicSlug,
  topicName,
  posts,
  currentPage,
  totalPages,
  categories,
}: Props) {
  return (
    <section className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)] py-12">
      <SiteBreadcrumb
        className="mb-6"
        items={[
          { label: "Home", href: "/" },
          { label: "Insights", href: "/insights/" },
          { label: topicName },
        ]}
      />

      <header className="mb-6">
        <h1 className="text-3xl font-bold text-[var(--color-fg)] sm:text-4xl">
          {topicName}
        </h1>

        <p className="mt-3 max-w-2xl text-[var(--color-muted)]">
          Browse all {topicName.toLowerCase()} updates from AmeriLife.
        </p>
      </header>

      <InsightsListingToolbar categories={categories} />

      {posts.length === 0 ? (
        <p className="text-[var(--color-muted)]">
          No posts found in this category.
        </p>
      ) : (
        <InsightsCategoryCardGrid posts={posts} />
      )}

      <InsightsCategoryPagination
        topicSlug={topicSlug}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </section>
  );
}
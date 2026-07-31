import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { InsightsCategoryPage } from "@/app/components/insights/InsightsCategoryPage";
import {
  getCanonicalInsightPath,
  getInsightBySlug,
  getInsightCategoryPageData,
  getInsightTopicSlugs,
  getInsightsAdsSettings,
} from "@/lib/insights-data";
import { staticPageMetadata } from "@/lib/seo";

type PageParams = Promise<{ category: string }>;
type SearchParams = Promise<{ page?: string | string[] }>;

function parseCategoryPage(sp: { page?: string | string[] }): number {
  const raw = sp.page;
  const s = Array.isArray(raw) ? raw[0] : raw;
  const n = s ? parseInt(s, 10) : 1;
  if (!Number.isFinite(n) || n < 1) return 1;
  return Math.floor(n);
}

export async function generateStaticParams() {
  const slugs = await getInsightTopicSlugs();

  return slugs.map((slug) => ({
    category: slug,
  }));
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: PageParams;
  searchParams: SearchParams;
}): Promise<Metadata> {
  const { category } = await params;
  const page = parseCategoryPage(await searchParams);
  const data = await getInsightCategoryPageData(category, page);

  if (!data) return {};

  const name = data.topicName?.trim() || data.topicSlug;
  const titlePage =
    data.currentPage > 1 ? ` (Page ${data.currentPage})` : "";
  const description = `Browse ${name} articles and resources from AmeriLife Insights${data.currentPage > 1 ? ` (page ${data.currentPage})` : ""}.`;
  const path =
    data.currentPage > 1
      ? `/insights/${data.topicSlug}/?page=${data.currentPage}`
      : `/insights/${data.topicSlug}/`;

  return staticPageMetadata(
    `${name} Insights${titlePage} | AmeriLife`,
    description,
    path,
  );
}

export default async function InsightCategoryArchivePage({
  params,
  searchParams,
}: {
  params: PageParams;
  searchParams: SearchParams;
}) {
  const { category } = await params;
  const page = parseCategoryPage(await searchParams);

  const [data, insightsAds] = await Promise.all([
    getInsightCategoryPageData(category, page),
    getInsightsAdsSettings(),
  ]);

  if (!data) {
    const post = await getInsightBySlug(category);
    const canonicalPath = post ? getCanonicalInsightPath(post) : null;

    if (canonicalPath) {
      permanentRedirect(canonicalPath);
    }

    notFound();
  }

  const topicName = data.topicName?.trim() || data.topicSlug;

  return (
    <InsightsCategoryPage
      topicSlug={data.topicSlug}
      topicName={topicName}
      posts={data.posts}
      currentPage={data.currentPage}
      totalPages={data.totalPages}
      insightsAds={insightsAds}
    />
  );
}
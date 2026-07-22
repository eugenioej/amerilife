import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IdeaXchangeCategoryPage } from "@/app/components/ideaxchange/magazine/IdeaXchangeCategoryPage";
import { requireIdeaxchangeAuth } from "@/lib/ideaxchange-auth";
import { IDEAXCHANGE_CATEGORY_PATH } from "@/lib/ideaxchange-constants";
import {
  getIdeaxchangeAdsSettings,
  getIdeaxchangeCategoryPageData,
  getIdeaxchangeTopicSlugs,
} from "@/lib/ideaxchange-data";
import { privatePageMetadata } from "@/lib/seo";

type PageParams = Promise<{ slug: string }>;
type SearchParams = Promise<{ page?: string | string[] }>;

function parseCategoryPage(sp: { page?: string | string[] }): number {
  const raw = sp.page;
  const s = Array.isArray(raw) ? raw[0] : raw;
  const n = s ? parseInt(s, 10) : 1;
  if (!Number.isFinite(n) || n < 1) return 1;
  return Math.floor(n);
}

export async function generateStaticParams() {
  const slugs = await getIdeaxchangeTopicSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: PageParams;
  searchParams: SearchParams;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = parseCategoryPage(await searchParams);
  const data = await getIdeaxchangeCategoryPageData(slug, page);
  if (!data) return {};

  const name = data.topicName?.trim() || data.topicSlug;
  const titlePage = data.currentPage > 1 ? ` (Page ${data.currentPage})` : "";
  const description = `Browse ${name} articles and resources on AmeriLife ideaXchange${
    data.currentPage > 1 ? ` (page ${data.currentPage})` : ""
  }.`;

  return privatePageMetadata(`${name} Articles${titlePage} | ideaXchange`, description);
}

export default async function IdeaxchangeCategoryArchivePage({
  params,
  searchParams,
}: {
  params: PageParams;
  searchParams: SearchParams;
}) {
  const { slug } = await params;
  const page = parseCategoryPage(await searchParams);
  const auth = await requireIdeaxchangeAuth(`${IDEAXCHANGE_CATEGORY_PATH}${slug}/`);

  const [data, ideaxchangeAds] = await Promise.all([
    getIdeaxchangeCategoryPageData(slug, page, auth.persona),
    getIdeaxchangeAdsSettings(),
  ]);

  if (!data) notFound();

  const topicName = data.topicName?.trim() || data.topicSlug;

  return (
    <IdeaXchangeCategoryPage
      topicSlug={data.topicSlug}
      topicName={topicName}
      posts={data.posts}
      currentPage={data.currentPage}
      totalPages={data.totalPages}
      adSlot={ideaxchangeAds?.homePrimaryHorizontal}
    />
  );
}

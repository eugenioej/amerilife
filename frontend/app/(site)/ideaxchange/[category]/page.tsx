import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IdeaXchangeCategoryPage } from "@/app/components/ideaxchange/magazine/IdeaXchangeCategoryPage";
import {
  filterIdeaxchangeAdSlotByAudience,
  getIdeaxchangeAdAudienceFromPersona,
} from "@/app/components/ideaxchange/shared/ideaxchange-ads";
import { requireIdeaxchangeAuth } from "@/lib/ideaxchange-auth";
import {
  getIdeaxchangeAdsSettings,
  getIdeaxchangeCategoryPageData,
  getIdeaxchangeTopicSlugs,
} from "@/lib/ideaxchange-data";
import { privatePageMetadata } from "@/lib/seo";

type PageParams = Promise<{
  category: string;
}>;

type SearchParams = Promise<{
  page?: string | string[];
}>;

function parseCategoryPage(sp: {
  page?: string | string[];
}): number {
  const raw = sp.page;
  const value = Array.isArray(raw) ? raw[0] : raw;
  const page = value ? parseInt(value, 10) : 1;

  if (!Number.isFinite(page) || page < 1) {
    return 1;
  }

  return Math.floor(page);
}

export async function generateStaticParams() {
  const slugs = await getIdeaxchangeTopicSlugs();

  return slugs.map((category) => ({
    category,
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

  const data = await getIdeaxchangeCategoryPageData(
    category,
    page,
  );

  if (!data) {
    return {};
  }

  const name =
    data.topicName?.trim() || data.topicSlug;

  const titlePage =
    data.currentPage > 1
      ? ` (Page ${data.currentPage})`
      : "";

  const description =
    `Browse ${name} articles and resources on AmeriLife ideaXchange` +
    `${
      data.currentPage > 1
        ? ` (page ${data.currentPage})`
        : ""
    }.`;

  return privatePageMetadata(
    `${name} Articles${titlePage} | ideaXchange`,
    description,
  );
}

export default async function IdeaxchangeCategoryArchivePage({
  params,
  searchParams,
}: {
  params: PageParams;
  searchParams: SearchParams;
}) {
  const { category } = await params;
  const page = parseCategoryPage(await searchParams);

  const categoryPath = `/ideaxchange/${category}/`;

  const auth = await requireIdeaxchangeAuth(categoryPath);

  const adAudience =
    getIdeaxchangeAdAudienceFromPersona(auth.persona);

  const [data, ideaxchangeAds] = await Promise.all([
    getIdeaxchangeCategoryPageData(
      category,
      page,
      auth.persona,
    ),
    getIdeaxchangeAdsSettings(),
  ]);

  if (!data) {
    notFound();
  }

  const topicName =
    data.topicName?.trim() || data.topicSlug;

  return (
    <IdeaXchangeCategoryPage
      topicSlug={data.topicSlug}
      topicName={topicName}
      posts={data.posts}
      currentPage={data.currentPage}
      totalPages={data.totalPages}
      adSlot={filterIdeaxchangeAdSlotByAudience(
        ideaxchangeAds?.homePrimaryHorizontal,
        adAudience,
      )}
    />
  );
}
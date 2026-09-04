import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IdeaXchangeTagPage } from "@/app/components/ideaxchange/magazine/IdeaXchangeTagPage";
import {
  filterIdeaxchangeAdSlotByAudience,
  getIdeaxchangeAdAudienceFromPersona,
} from "@/app/components/ideaxchange/shared/ideaxchange-ads";
import { requireIdeaxchangeAuth } from "@/lib/ideaxchange-auth";
import {
  getIdeaxchangeAdsSettings,
  getIdeaxchangeTagPageData,
  getIdeaxchangeTagSlugs,
} from "@/lib/ideaxchange-data";
import { privatePageMetadata } from "@/lib/seo";

type PageParams = Promise<{
  tag: string;
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
  const slugs = await getIdeaxchangeTagSlugs();

  return slugs.map((tag) => ({
    tag,
  }));
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: PageParams;
  searchParams: SearchParams;
}): Promise<Metadata> {
  const { tag } = await params;
  const page = parseCategoryPage(await searchParams);

  const data = await getIdeaxchangeTagPageData(
    tag,
    page,
  );

  if (!data) {
    return {};
  }

  const name =
    data.tagName?.trim() || data.tagSlug;

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

export default async function IdeaxchangeTagArchivePage({
  params,
  searchParams,
}: {
  params: PageParams;
  searchParams: SearchParams;
}) {
  const { tag } = await params;
  const page = parseCategoryPage(await searchParams);

  const tagPath = `/ideaxchange/tags/${tag}/`;

  const auth = await requireIdeaxchangeAuth(tagPath);

  const adAudience =
    getIdeaxchangeAdAudienceFromPersona(auth.persona);

  const [data, ideaxchangeAds] = await Promise.all([
    getIdeaxchangeTagPageData(
      tag,
      page,
      auth.persona,
    ),
    getIdeaxchangeAdsSettings(),
  ]);

  if (!data) {
    notFound();
  }

  const tagName =
    data.tagName?.trim() || data.tagSlug;

  return (
    <IdeaXchangeTagPage
      tagSlug={data.tagSlug}
      tagName={tagName}
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
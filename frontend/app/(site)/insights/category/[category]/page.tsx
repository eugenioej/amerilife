import { permanentRedirect } from "next/navigation";

type PageParams = Promise<{ category: string }>;
type SearchParams = Promise<{ page?: string | string[] }>;

function getPageParam(searchParams: { page?: string | string[] }): string | null {
  const raw = searchParams.page;
  const value = Array.isArray(raw) ? raw[0] : raw;

  if (!value) return null;

  const n = parseInt(value, 10);

  if (!Number.isFinite(n) || n <= 1) return null;

  return String(Math.floor(n));
}

export default async function LegacyInsightCategoryRedirectPage({
  params,
  searchParams,
}: {
  params: PageParams;
  searchParams: SearchParams;
}) {
  const { category } = await params;
  const page = getPageParam(await searchParams);

  const target = page
    ? `/insights/${category}/?page=${page}`
    : `/insights/${category}/`;

  permanentRedirect(target);
}
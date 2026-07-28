import type { Metadata } from "next";
import { Link } from "@/app/components/ui/Link";
import { SiteBreadcrumb } from "@/app/components/layout/SiteBreadcrumb";
import { requireIdeaxchangeAuth } from "@/lib/ideaxchange-auth";
import {
  IDEAXCHANGE_HOME_FEED_PATH,
  IDEAXCHANGE_SEARCH_PATH,
} from "@/lib/ideaxchange-constants";
import {
  searchIdeaxchangePages,
  type IdeaxchangePageSearchResult,
} from "@/lib/ideaxchange-search-index";
import {
  searchIdeaxchangeArticlesLocal,
  searchIdeaxchangeCarriersLocal,
  searchIdeaxchangeCaseStudiesLocal,
  searchIdeaxchangeCompaniesLocal,
  type IdeaxchangeContentSearchHit,
} from "@/lib/ideaxchange-search";
import { formatInsightExcerptPlain } from "@/lib/insight-excerpt";
import { privatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = privatePageMetadata(
  "Search | ideaXchange",
  "Search ideaXchange articles, campaigns, companies, carriers, and pillar pages.",
);

type Props = {
  searchParams: Promise<{ q?: string }>;
};

type UnifiedResult =
  | { type: "page"; result: IdeaxchangePageSearchResult }
  | { type: "article"; hit: IdeaxchangeContentSearchHit }
  | { type: "campaign"; hit: IdeaxchangeContentSearchHit }
  | { type: "company"; hit: IdeaxchangeContentSearchHit }
  | { type: "carrier"; hit: IdeaxchangeContentSearchHit };

function searchSnippet(html: string | null | undefined): string {
  return formatInsightExcerptPlain(html).replace(/\s+/g, " ").trim();
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function PageCard({ result }: { result: IdeaxchangePageSearchResult }) {
  return (
    <article className="group rounded-lg border border-[var(--color-border)] bg-white p-5 transition-shadow hover:shadow-md">
      <div className="mb-1.5 flex items-center gap-2 text-xs text-[var(--color-muted)]">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-brand-primary)]">
          Page
        </span>
        <span className="text-[var(--color-border)]">·</span>
        <span className="truncate">{result.path}</span>
      </div>
      <h2 className="text-lg font-semibold text-[var(--color-fg)] transition-colors group-hover:text-[var(--color-brand-primary)]">
        <Link href={result.path} variant="button" className="hover:no-underline">
          {result.title}
        </Link>
      </h2>
      <p className="mt-1 text-sm leading-relaxed text-[var(--color-muted)]">{result.description}</p>
    </article>
  );
}

function ContentCard({
  hit,
  badge,
}: {
  hit: IdeaxchangeContentSearchHit;
  badge: string;
}) {
  const excerpt = searchSnippet(hit.excerpt);
  const truncated = excerpt.length > 200 ? `${excerpt.slice(0, 200)}…` : excerpt;

  return (
    <article className="group rounded-lg border border-[var(--color-border)] bg-white p-5 transition-shadow hover:shadow-md">
      <div className="mb-1.5 flex items-center gap-2 text-xs text-[var(--color-muted)]">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-brand-primary)]">
          {badge}
        </span>
        {hit.date ? (
          <>
            <span className="text-[var(--color-border)]">·</span>
            <time dateTime={hit.date}>{formatDate(hit.date)}</time>
          </>
        ) : null}
      </div>
      <h2 className="text-lg font-semibold text-[var(--color-fg)] transition-colors group-hover:text-[var(--color-brand-primary)]">
        <Link href={hit.href} variant="button" className="hover:no-underline">
          {hit.title}
        </Link>
      </h2>
      {truncated ? (
        <p className="mt-1 text-sm leading-relaxed text-[var(--color-muted)]">{truncated}</p>
      ) : null}
    </article>
  );
}

export default async function IdeaxchangeSearchPage({ searchParams }: Props) {
  const { q: rawQ } = await searchParams;
  const q = rawQ?.trim() ?? "";
  const auth = await requireIdeaxchangeAuth(
    q ? `${IDEAXCHANGE_SEARCH_PATH}?q=${encodeURIComponent(q)}` : IDEAXCHANGE_SEARCH_PATH,
  );

  const pageResults = q ? searchIdeaxchangePages(q, auth.persona) : [];
  let articles: IdeaxchangeContentSearchHit[] = [];
  let campaigns: IdeaxchangeContentSearchHit[] = [];
  let companies: IdeaxchangeContentSearchHit[] = [];
  let carriers: IdeaxchangeContentSearchHit[] = [];

  if (q) {
    [articles, campaigns, companies, carriers] = await Promise.all([
      searchIdeaxchangeArticlesLocal(q, auth.persona, 20),
      searchIdeaxchangeCaseStudiesLocal(q, auth.persona, 20),
      searchIdeaxchangeCompaniesLocal(q, auth.persona, 20),
      searchIdeaxchangeCarriersLocal(q, auth.persona, 20),
    ]);
  }

  const unified: UnifiedResult[] = [
    ...pageResults.map((result) => ({ type: "page" as const, result })),
    ...articles.map((hit) => ({ type: "article" as const, hit })),
    ...campaigns.map((hit) => ({ type: "campaign" as const, hit })),
    ...companies.map((hit) => ({ type: "company" as const, hit })),
    ...carriers.map((hit) => ({ type: "carrier" as const, hit })),
  ];

  return (
    <div className="bg-white pb-16 md:pb-20">
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)] pt-8 md:pt-10">
        <SiteBreadcrumb
          className="mb-6"
          items={[
            { label: "Home", href: "/" },
            { label: "ideaXchange", href: IDEAXCHANGE_HOME_FEED_PATH },
            { label: "Search" },
          ]}
        />

        <h1 className="text-3xl font-bold text-[var(--color-fg)]">
          Search
          {q ? (
            <span className="ml-2 font-normal text-[var(--color-muted)]">
              for &ldquo;{q}&rdquo;
            </span>
          ) : null}
        </h1>

        {!q ? (
          <p className="mt-6 text-[var(--color-muted)]">
            Enter a search term to find ideaXchange articles, campaigns, companies, carriers, and
            pages.
          </p>
        ) : null}

        {q && unified.length === 0 ? (
          <p className="mt-6 text-[var(--color-muted)]">
            No results found for &ldquo;{q}&rdquo;. Try a different search term.
          </p>
        ) : null}

        {unified.length > 0 ? (
          <>
            <p className="mt-4 text-sm text-[var(--color-muted)]">
              {unified.length} result{unified.length !== 1 ? "s" : ""} found
            </p>
            <div className="mt-6 space-y-4">
              {unified.map((item) => {
                if (item.type === "page") {
                  return <PageCard key={item.result.path} result={item.result} />;
                }
                const badge =
                  item.type === "article"
                    ? "Article"
                    : item.type === "campaign"
                      ? "Campaign"
                      : item.type === "company"
                        ? "Company"
                        : "Carrier";
                return (
                  <ContentCard key={`${item.type}-${item.hit.id}`} hit={item.hit} badge={badge} />
                );
              })}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

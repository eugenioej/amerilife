import type { Metadata } from "next";
import { Link } from "@/app/components/ui/Link";
import { privatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = privatePageMetadata(
  "Search | AmeriLife",
  "Search AmeriLife pages, news, Insights articles, and agency locations."
);

import { searchPages, type SearchResult } from "@/lib/search-index";
import { fetchGraphQL } from "@/lib/wp-client";
import {
  SEARCH_POSTS,
  type AgencySearchNode,
  type InsightSearchNode,
  type PostSearchNode,
  type PostsSearchResult,
} from "@/lib/queries";
import { formatInsightExcerptPlain } from "@/lib/insight-excerpt";
import { searchAgenciesLocal } from "@/lib/search-agencies";
import { searchInsightsLocal } from "@/lib/search-insights";

type Props = {
  searchParams: Promise<{ q?: string }>;
};

type UnifiedResult =
  | { type: "page"; result: SearchResult }
  | { type: "post"; node: PostSearchNode }
  | { type: "insight"; node: InsightSearchNode }
  | { type: "agency"; node: AgencySearchNode };

function stripTags(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

/** Plain-text snippet for search cards — strips HTML and decodes WP entities (&#8220;, &#8230;, etc.). */
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

function PageCard({ result }: { result: SearchResult }) {
  return (
    <article className="group rounded-lg border border-[var(--color-border)] bg-white p-5 transition-shadow hover:shadow-md">
      <div className="mb-1.5 flex items-center gap-2 text-xs text-[var(--color-muted)]">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-brand-primary)]">
          {result.path === "/" ? "Home" : "Page"}
        </span>
        <span className="text-[var(--color-border)]">·</span>
        <span className="truncate">{result.path}</span>
      </div>
      <h2 className="text-lg font-semibold text-[var(--color-fg)] transition-colors group-hover:text-[var(--color-brand-primary)]">
        <Link href={result.path} variant="button" className="hover:no-underline">
          {result.title}
        </Link>
      </h2>
      <p className="mt-1 text-sm leading-relaxed text-[var(--color-muted)]">
        {result.description}
      </p>
    </article>
  );
}

function agencySearchSnippet(node: AgencySearchNode): string {
  const content = node.content ? stripTags(node.content) : "";
  if (content) return content;
  const f = node.agencyFields;
  const line = [f?.addressLine1, [f?.addressCity, f?.addressState].filter(Boolean).join(", "), f?.addressZip]
    .filter(Boolean)
    .join(" · ");
  return line;
}

function InsightCard({ node }: { node: InsightSearchNode }) {
  const excerpt = searchSnippet(node.excerpt);
  const truncated = excerpt.length > 200 ? excerpt.slice(0, 200) + "…" : excerpt;
  const slug = node.slug ?? "";
  const topicSlug =
    node.insightTopics?.nodes?.[0]?.slug ?? "";
  const href =
    slug && topicSlug
      ? `/insights/${topicSlug}/${slug}/`
      : "#";

  return (
    <article className="group rounded-lg border border-[var(--color-border)] bg-white p-5 transition-shadow hover:shadow-md">
      <div className="mb-1.5 flex items-center gap-2 text-xs text-[var(--color-muted)]">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-brand-primary)]">
          Insight
        </span>
        {node.date && (
          <>
            <span className="text-[var(--color-border)]">·</span>
            <time dateTime={node.date}>{formatDate(node.date)}</time>
          </>
        )}
      </div>
      <h2 className="text-lg font-semibold text-[var(--color-fg)] transition-colors group-hover:text-[var(--color-brand-primary)]">
        <Link href={href} variant="button" className="hover:no-underline">
          {node.title}
        </Link>
      </h2>
      {truncated && (
        <p className="mt-1 text-sm leading-relaxed text-[var(--color-muted)]">{truncated}</p>
      )}
    </article>
  );
}

function AgencyCard({ node }: { node: AgencySearchNode }) {
  const snippet = agencySearchSnippet(node);
  const truncated = snippet.length > 200 ? snippet.slice(0, 200) + "…" : snippet;
  const slug = node.slug ?? "";
  const href = slug ? `/${slug}/` : "#";

  return (
    <article className="group rounded-lg border border-[var(--color-border)] bg-white p-5 transition-shadow hover:shadow-md">
      <div className="mb-1.5 flex items-center gap-2 text-xs text-[var(--color-muted)]">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-brand-primary)]">
          Agency
        </span>
        <span className="text-[var(--color-border)]">·</span>
        <span className="truncate">{href}</span>
      </div>
      <h2 className="text-lg font-semibold text-[var(--color-fg)] transition-colors group-hover:text-[var(--color-brand-primary)]">
        <Link href={href} variant="button" className="hover:no-underline">
          {node.title}
        </Link>
      </h2>
      {truncated && (
        <p className="mt-1 text-sm leading-relaxed text-[var(--color-muted)]">{truncated}</p>
      )}
    </article>
  );
}

function PostCard({ node }: { node: PostSearchNode }) {
  const excerpt = searchSnippet(node.excerpt);
  const truncated = excerpt.length > 200 ? excerpt.slice(0, 200) + "…" : excerpt;
  const categorySlug = node.categories?.nodes?.[0]?.slug ?? "announcements";
  const slug = node.slug ?? "";
  const href = slug ? `/newsroom/${categorySlug}/${slug}/` : "#";

  return (
    <article className="group rounded-lg border border-[var(--color-border)] bg-white p-5 transition-shadow hover:shadow-md">
      <div className="mb-1.5 flex items-center gap-2 text-xs text-[var(--color-muted)]">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-brand-primary)]">
          Article
        </span>
        {node.date && (
          <>
            <span className="text-[var(--color-border)]">·</span>
            <time dateTime={node.date}>{formatDate(node.date)}</time>
          </>
        )}
      </div>
      <h2 className="text-lg font-semibold text-[var(--color-fg)] transition-colors group-hover:text-[var(--color-brand-primary)]">
        <Link href={href} variant="button" className="hover:no-underline">
          {node.title}
        </Link>
      </h2>
      {truncated && (
        <p className="mt-1 text-sm leading-relaxed text-[var(--color-muted)]">
          {truncated}
        </p>
      )}
    </article>
  );
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;

  const pageResults = q ? searchPages(q) : [];
  let postNodes: PostSearchNode[] = [];
  let insightNodes: InsightSearchNode[] = [];
  let agencyNodes: AgencySearchNode[] = [];

  if (q) {
    const [postsData, insightsLocal, agencyLocal] = await Promise.all([
      fetchGraphQL<PostsSearchResult>(SEARCH_POSTS, { search: q, first: 20 }).catch(() => null),
      searchInsightsLocal(q, 20),
      searchAgenciesLocal(q, 20),
    ]);
    postNodes = (postsData?.posts?.nodes ?? []).filter(
  (node) =>
    (node.categories?.nodes?.length ?? 0) > 0 &&
    !node.uri?.startsWith("/ideaxchange-article/") &&
    !node.uri?.startsWith("/insight/")
);

 
    insightNodes = insightsLocal;
    agencyNodes = agencyLocal;
  }

  const unified: UnifiedResult[] = [
    ...pageResults.map((result) => ({ type: "page" as const, result })),
    ...postNodes.map((node) => ({ type: "post" as const, node })),
    ...insightNodes.map((node) => ({ type: "insight" as const, node })),
    ...agencyNodes.map((node) => ({ type: "agency" as const, node })),
  ];

  return (
    <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)] py-12">
      <h1 className="text-3xl font-bold text-[var(--color-fg)]">
        Search
        {q && (
          <span className="ml-2 font-normal text-[var(--color-muted)]">
            for &ldquo;{q}&rdquo;
          </span>
        )}
      </h1>

      {!q && (
        <p className="mt-6 text-[var(--color-muted)]">
          Enter a search term to find pages, news articles, Insights, and agency locations.
        </p>
      )}

      {q && unified.length === 0 && (
        <p className="mt-6 text-[var(--color-muted)]">
          No results found for &ldquo;{q}&rdquo;. Try a different search term.
        </p>
      )}

      {unified.length > 0 && (
        <>
          <p className="mt-4 text-sm text-[var(--color-muted)]">
            {unified.length} result{unified.length !== 1 ? "s" : ""} found
          </p>
          <div className="mt-6 space-y-4">
            {unified.map((item) =>
              item.type === "page" ? (
                <PageCard key={item.result.path} result={item.result} />
              ) : item.type === "post" ? (
                <PostCard key={item.node.id} node={item.node} />
              ) : item.type === "insight" ? (
                <InsightCard key={item.node.id} node={item.node} />
              ) : (
                <AgencyCard key={item.node.id} node={item.node} />
              )
            )}
          </div>
        </>
      )}
    </div>
  );
}

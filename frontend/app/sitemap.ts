import type { MetadataRoute } from "next";
import { fetchGraphQL } from "@/lib/wp-client";
import {
  GET_AGENCIES_FOR_SITEMAP,
  GET_LEADERS,
  GET_PAGES_SITEMAP,
  GET_POSTS_SITEMAP,
  type AgenciesSitemapResult,
  type LeadersQueryResult,
  type PagesSitemapResult,
  type PostsSitemapResult,
} from "@/lib/queries";
import { getSiteUrl } from "@/lib/seo";
import {
  DISALLOWED_SITEMAP_PATHS,
  STATIC_SITEMAP_PATHS,
} from "@/lib/sitemap-config";

const BATCH = 100;
const MAX_PAGES = 200;

function normalizePathname(uri: string): string {
  const t = uri.trim();
  const withSlash = t.startsWith("/") ? t : `/${t}`;
  const noTrail =
    withSlash.length > 1 && withSlash.endsWith("/")
      ? withSlash.slice(0, -1)
      : withSlash;
  return noTrail === "" ? "/" : noTrail;
}

function isDisallowedPathname(pathname: string): boolean {
  const n = normalizePathname(pathname);
  if (DISALLOWED_SITEMAP_PATHS.has(n)) return true;
  for (const d of DISALLOWED_SITEMAP_PATHS) {
    if (n.startsWith(`${d}/`)) return true;
  }
  return false;
}

function toAbsoluteUrl(pathOrUri: string, base: URL): string {
  const p = pathOrUri.startsWith("/") ? pathOrUri : `/${pathOrUri}`;
  return new URL(p, base).toString();
}

async function collectPageUris(): Promise<string[]> {
  const out: string[] = [];
  let after: string | null = null;
  let hasNext = true;
  let iterations = 0;
  while (hasNext && iterations < MAX_PAGES) {
    iterations += 1;
    const data: PagesSitemapResult = await fetchGraphQL<PagesSitemapResult>(
      GET_PAGES_SITEMAP,
      {
        first: BATCH,
        after,
      }
    );
    const nodes = data.pages?.nodes ?? [];
    for (const n of nodes) {
      const uri = n.uri?.trim();
      if (uri && !isDisallowedPathname(uri)) out.push(uri);
    }
    hasNext = data.pages?.pageInfo.hasNextPage ?? false;
    after = data.pages?.pageInfo.endCursor ?? null;
    if (!hasNext || !after) break;
  }
  return out;
}

async function collectPostUris(): Promise<string[]> {
  const out: string[] = [];
  let after: string | null = null;
  let hasNext = true;
  let iterations = 0;
  while (hasNext && iterations < MAX_PAGES) {
    iterations += 1;
    const data: PostsSitemapResult = await fetchGraphQL<PostsSitemapResult>(
      GET_POSTS_SITEMAP,
      {
        first: BATCH,
        after,
      }
    );
    const nodes = data.posts?.nodes ?? [];
    for (const n of nodes) {
      const uri = n.uri?.trim();
      if (uri && !isDisallowedPathname(uri)) out.push(uri);
    }
    hasNext = data.posts?.pageInfo.hasNextPage ?? false;
    after = data.posts?.pageInfo.endCursor ?? null;
    if (!hasNext || !after) break;
  }
  return out;
}

async function collectLeaderUrls(base: URL): Promise<string[]> {
  try {
    const data = await fetchGraphQL<LeadersQueryResult>(GET_LEADERS);
    const nodes = data.leaders?.nodes ?? [];
    return nodes
      .map((n) => n.slug?.trim())
      .filter((s): s is string => Boolean(s))
      .map((slug) => toAbsoluteUrl(`/about-us/our-leaders/${slug}/`, base));
  } catch {
    return [];
  }
}

async function collectAgencyAndAgentUrls(base: URL): Promise<string[]> {
  try {
    const data = await fetchGraphQL<AgenciesSitemapResult>(
      GET_AGENCIES_FOR_SITEMAP
    );
    const nodes = data.agencies?.nodes ?? [];
    const urls: string[] = [];
    for (const n of nodes) {
      const agencySlug = n.slug?.trim();
      if (!agencySlug) continue;
      urls.push(toAbsoluteUrl(`/${agencySlug}/`, base));
      const agents = n.officeAgents ?? [];
      for (const a of agents) {
        const agentSlug = a?.slug?.trim();
        if (!agentSlug) continue;
        urls.push(toAbsoluteUrl(`/${agencySlug}/${agentSlug}/`, base));
      }
    }
    return urls;
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseStr = getSiteUrl();
  const base = new URL(baseStr.endsWith("/") ? baseStr : `${baseStr}/`);

  const seen = new Set<string>();
  const out: MetadataRoute.Sitemap = [];

  function add(
    url: string,
    opts: {
      changeFrequency: NonNullable<
        MetadataRoute.Sitemap[number]["changeFrequency"]
      >;
      priority: number;
    }
  ) {
    if (seen.has(url)) return;
    seen.add(url);
    out.push({ url, ...opts });
  }

  for (const path of STATIC_SITEMAP_PATHS) {
    const url = toAbsoluteUrl(path, base);
    add(url, {
      changeFrequency: "weekly",
      priority: path === "/" ? 1 : 0.8,
    });
  }

  const settled = await Promise.allSettled([
    collectPageUris(),
    collectPostUris(),
    collectLeaderUrls(base),
    collectAgencyAndAgentUrls(base),
  ]);

  const pageUris =
    settled[0].status === "fulfilled" ? settled[0].value : [];
  const postUris =
    settled[1].status === "fulfilled" ? settled[1].value : [];
  const leaderUrls =
    settled[2].status === "fulfilled" ? settled[2].value : [];
  const agencyUrls =
    settled[3].status === "fulfilled" ? settled[3].value : [];

  for (const uri of pageUris) {
    add(toAbsoluteUrl(uri, base), {
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }
  for (const uri of postUris) {
    add(toAbsoluteUrl(uri, base), {
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }
  for (const url of leaderUrls) {
    add(url, { changeFrequency: "monthly", priority: 0.65 });
  }
  for (const url of agencyUrls) {
    add(url, { changeFrequency: "monthly", priority: 0.6 });
  }

  return out;
}

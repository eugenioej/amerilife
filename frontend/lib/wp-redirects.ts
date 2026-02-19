import { fetchGraphQL } from "./wp-client";
import { GET_REDIRECTS } from "./queries";

type WpRedirect = {
  origin: string;
  target: string;
  type: number;
  matchType?: string;
};

type RedirectsResponse = {
  redirection?: {
    redirects: WpRedirect[];
  } | null;
};

export type NextRedirect = {
  source: string;
  destination: string;
  permanent: boolean;
};

/**
 * Extracts the actual URL from Redirection plugin's target field.
 * The plugin stores PHP serialized data (e.g. a:3:{s:8:"url_from";s:31:"https://..."})
 * rather than a plain URL. Parse url_from when present; otherwise use target as-is.
 */
function parseRedirectionTarget(target: string): string | null {
  const trimmed = target.trim();
  if (!trimmed) return null;
  // Plain URL – use as-is
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("/")) {
    return trimmed;
  }
  // PHP serialized: extract url_from value
  const match = trimmed.match(/url_from";s:\d+:"([^"]*)"/);
  return match ? match[1] : trimmed;
}

/**
 * Fetches redirects from the WPGraphQL Redirection Addon and maps them to
 * Next.js redirect format. Returns empty array if the addon is not installed
 * or the fetch fails.
 */
export async function getRedirectsFromWP(): Promise<NextRedirect[]> {
  const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT?.trim();
  if (!endpoint) return [];

  try {
    const data = await fetchGraphQL<RedirectsResponse>(GET_REDIRECTS);
    const redirects = data?.redirection?.redirects ?? [];
    if (!Array.isArray(redirects) || redirects.length === 0) return [];

    return redirects
      .filter((r) => r?.origin && r?.target)
      .map((r) => {
        const dest = parseRedirectionTarget(r.target);
        if (!dest) return null;
        const source = normalizePath(r.origin);
        const destination = normalizeTarget(dest);
        const permanent = r.type === 301 || r.type === 308;
        return { source, destination, permanent };
      })
      .filter((r): r is NextRedirect => r !== null);
  } catch {
    return [];
  }
}

/** Ensure path has leading slash, strip query/hash. Preserve trailing slash from WordPress. */
function normalizePath(path: string): string {
  const trimmed = path.trim();
  if (!trimmed) return "/";
  const withLeading = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return withLeading.split("?")[0]?.split("#")[0] ?? withLeading;
}

/** Preserve full URLs; ensure relative paths have leading slash. */
function normalizeTarget(target: string): string {
  const trimmed = target.trim();
  if (!trimmed) return "/";
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

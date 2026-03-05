import { fetchGraphQL } from "./wp-client";
import { GET_REDIRECTS } from "./queries";

type WpRedirect = {
  origin: string;
  target: string;
  type: string;
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
  if (!endpoint) {
    console.error("[wp-redirects] NEXT_PUBLIC_GRAPHQL_ENDPOINT not set — skipping WP redirects");
    return [];
  }

  // Abort after 10 s so a hung build server connection doesn't block the build.
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10_000);

  try {
    const data = await fetchGraphQL<RedirectsResponse>(GET_REDIRECTS, undefined, controller.signal);
    clearTimeout(timer);
    const redirects = data?.redirection?.redirects ?? [];
    if (!Array.isArray(redirects) || redirects.length === 0) {
      console.error("[wp-redirects] GraphQL returned 0 redirects");
      return [];
    }
    console.error(`[wp-redirects] Loaded ${redirects.length} redirects from WordPress`);

    return redirects
      .filter((r) => r?.origin && r?.target)
      .map((r) => {
        const dest = parseRedirectionTarget(r.target);
        if (!dest) return null;
        const source = normalizePath(r.origin);
        const destination = normalizeTarget(dest);
        // WPGraphQL Redirection Addon does not expose the HTTP status code field;
        // the `type` field is the match strategy ("url", "regex"), not a status code.
        // All redirects managed via WordPress are treated as permanent (301).
        const permanent = true;
        return { source, destination, permanent };
      })
      .filter((r): r is NextRedirect => r !== null);
  } catch (err) {
    clearTimeout(timer);
    console.error("[wp-redirects] Failed to fetch redirects from WordPress:", String(err));
    return [];
  }
}

/**
 * Normalize a redirect source path.
 * - Ensures a leading slash
 * - Strips query string and hash
 * - Strips trailing slash (Atlas/Cloudflare removes trailing slashes before
 *   the request reaches Next.js, so sources must not have them to match)
 */
function normalizePath(path: string): string {
  const trimmed = path.trim();
  if (!trimmed) return "/";
  const withLeading = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  const withoutQH = withLeading.split("?")[0]?.split("#")[0] ?? withLeading;
  return withoutQH.length > 1 ? withoutQH.replace(/\/+$/, "") : withoutQH;
}

/** Normalize a redirect destination. Preserve full URLs; strip trailing slash from relative paths. */
function normalizeTarget(target: string): string {
  const trimmed = target.trim();
  if (!trimmed) return "/";
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  const withLeading = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return withLeading.length > 1 ? withLeading.replace(/\/+$/, "") : withLeading;
}

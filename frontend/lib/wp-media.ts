function getHeadlessWpBaseUrl(): string | null {
  const explicit = process.env.NEXT_PUBLIC_WORDPRESS_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");

  const graphql = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT?.trim();
  if (!graphql) return null;

  // Common case: https://example.com/graphql -> https://example.com
  return graphql.replace(/\/graphql\/?$/, "").replace(/\/$/, "");
}

function getLiveUploadHosts(): Set<string> {
  // Comma-separated. Keep defaults small and explicit.
  const raw = (process.env.NEXT_PUBLIC_LIVE_UPLOAD_HOSTS ?? "amerilife.com,www.amerilife.com,uatamerilife.wpengine.com")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return new Set(raw);
}

function tryParseUrl(input: string): URL | null {
  try {
    // Support protocol-relative URLs: //amerilife.com/wp-content/uploads/...
    if (input.startsWith("//")) return new URL(`https:${input}`);
    return new URL(input);
  } catch {
    return null;
  }
}

/**
 * If `inputUrl` points at a "live" WP uploads URL, rewrite it to the headless WP base,
 * preserving the `/wp-content/uploads/...` path.
 *
 * Set NEXT_PUBLIC_USE_LIVE_IMAGES=1 to skip rewriting and load images directly from
 * amerilife.com (or UAT) — use when headless WP doesn't have images synced yet.
 */
export function rewriteUploadsUrl(inputUrl: string): string {
  if (process.env.NEXT_PUBLIC_USE_LIVE_IMAGES === "1") {
    return inputUrl;
  }

  const u = tryParseUrl(inputUrl);
  if (!u) return inputUrl;

  const uploadsIdx = u.pathname.indexOf("/wp-content/uploads/");
  if (uploadsIdx === -1) return inputUrl;

  const liveHosts = getLiveUploadHosts();
  const host = u.hostname.toLowerCase();
  if (!liveHosts.has(host)) return inputUrl;

  const headlessBase = getHeadlessWpBaseUrl();
  if (!headlessBase) return inputUrl;

  const rewritten = `${headlessBase}${u.pathname}${u.search}${u.hash}`;
  return rewritten;
}

/**
 * If `inputUrl` points at a "live" WordPress `wp-content` URL (uploads/themes/plugins),
 * rewrite it to the headless WP base, preserving the `/wp-content/...` path.
 */
export function rewriteWpContentUrl(inputUrl: string): string {
  if (process.env.NEXT_PUBLIC_USE_LIVE_IMAGES === "1") {
    return inputUrl;
  }

  const u = tryParseUrl(inputUrl);
  if (!u) return inputUrl;

  const wpContentIdx = u.pathname.indexOf("/wp-content/");
  if (wpContentIdx === -1) return inputUrl;

  const liveHosts = getLiveUploadHosts();
  const host = u.hostname.toLowerCase();
  if (!liveHosts.has(host)) return inputUrl;

  const headlessBase = getHeadlessWpBaseUrl();
  if (!headlessBase) return inputUrl;

  return `${headlessBase}${u.pathname}${u.search}${u.hash}`;
}

/**
 * Rewrite any `<img src>`, `srcset`, CSS URLs, etc. that reference a "live" uploads URL.
 * This is intentionally conservative and only touches URLs that contain `/wp-content/uploads/`
 * AND whose hostname matches `NEXT_PUBLIC_LIVE_UPLOAD_HOSTS`.
 */
export function rewriteUploadsInHtml(html: string): string {
  if (!html) return html;
  if (process.env.NEXT_PUBLIC_USE_LIVE_IMAGES === "1") return html;

  const liveHosts = getLiveUploadHosts();
  const headlessBase = getHeadlessWpBaseUrl();
  if (!headlessBase || liveHosts.size === 0) return html;

  // Matches:
  // - https://headlessameril.wpenginepowered.com/wp-content/uploads/...
  // - https://headlessameril.wpenginepowered.com/wp-content/uploads/...
  // - //amerilife.com/wp-content/uploads/...
  //
  // Captures:
  //  1 = protocol (http/https or //)
  //  2 = hostname
  //  3 = rest of URL (path+query+hash) starting with /wp-content/uploads/
  const re =
    /(https?:\/\/|\/\/)([a-z0-9.-]+)(\/wp-content\/uploads\/[^\s"'<>)]*)/gi;

  return html.replace(re, (_m, proto: string, hostname: string, rest: string) => {
    const host = String(hostname).toLowerCase();
    if (!liveHosts.has(host)) return `${proto}${hostname}${rest}`;
    return `${headlessBase}${rest}`;
  });
}

/**
 * Rewrite any URL in HTML that references a "live" `/wp-content/...` path
 * (uploads/themes/plugins), swapping the hostname to the headless WP base.
 */
export function rewriteWpContentInHtml(html: string): string {
  if (!html) return html;
  if (process.env.NEXT_PUBLIC_USE_LIVE_IMAGES === "1") return html;

  const liveHosts = getLiveUploadHosts();
  const headlessBase = getHeadlessWpBaseUrl();
  if (!headlessBase || liveHosts.size === 0) return html;

  const re =
    /(https?:\/\/|\/\/)([a-z0-9.-]+)(\/wp-content\/[^\s"'<>)]*)/gi;

  return html.replace(re, (_m, proto: string, hostname: string, rest: string) => {
    const host = String(hostname).toLowerCase();
    if (!liveHosts.has(host)) return `${proto}${hostname}${rest}`;
    return `${headlessBase}${rest}`;
  });
}


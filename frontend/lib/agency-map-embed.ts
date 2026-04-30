import type { LocationData } from "@/lib/locations-data";

/** Build embed URL when CMS `mapSearchUrl` query param is unavailable. */
export function buildMapsEmbedUrl(location: LocationData): string {
  const addr = [
    location.address.line1,
    location.address.line2,
    location.address.city,
    location.address.state,
    location.address.zip,
  ]
    .filter(Boolean)
    .join(", ");
  const encoded = encodeURIComponent(addr);
  return `https://www.google.com/maps?q=${encoded}&output=embed`;
}

/** Prefer CMS `mapSearchUrl` (import) so iframe matches stored map query. */
export function embedUrlFromMapSearchUrl(stored: string | undefined): string | null {
  if (!stored?.trim()) return null;
  try {
    const u = new URL(stored);
    const q = u.searchParams.get("query");
    if (q) {
      return `https://www.google.com/maps?q=${encodeURIComponent(q)}&output=embed`;
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function agencyMapsEmbedUrl(location: LocationData): string {
  return embedUrlFromMapSearchUrl(location.mapSearchUrl) ?? buildMapsEmbedUrl(location);
}

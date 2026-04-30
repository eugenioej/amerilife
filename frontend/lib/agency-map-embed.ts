import type { LocationData } from "./locations-data";

/** Single-line place string from agency address fields (matches CMS imports). */
function locationAddressPlaceString(location: LocationData): string {
  return [
    location.address.line1,
    location.address.line2,
    location.address.city,
    location.address.state,
    location.address.zip,
  ]
    .filter(Boolean)
    .join(", ");
}

/**
 * Keyless Google Maps iframe — same pattern as `ContactFormDialog` (`maps.google.com` + `output=embed`).
 * Avoids `www.google.com/maps?q=…&output=embed` + ad‑hoc `z=` which often fails in iframes.
 */
function googleMapsIframeEmbedUrl(placeQueryEncoded: string, zoom = 16): string {
  return `https://maps.google.com/maps?q=${placeQueryEncoded}&t=&z=${zoom}&ie=UTF8&iwloc=&output=embed`;
}

/** Build embed from address when CMS `mapSearchUrl` is missing. */
export function buildMapsEmbedUrl(location: LocationData): string {
  return googleMapsIframeEmbedUrl(encodeURIComponent(locationAddressPlaceString(location)), 16);
}

/** Prefer CMS `mapSearchUrl` (e.g. `…/maps/search/?api=1&query=…`) so iframe matches WP import. */
export function embedUrlFromMapSearchUrl(stored: string | undefined): string | null {
  if (!stored?.trim()) return null;
  try {
    const u = new URL(stored.trim());
    const query = u.searchParams.get("query") ?? u.searchParams.get("q");
    if (query) {
      return googleMapsIframeEmbedUrl(encodeURIComponent(query), 16);
    }
  } catch {
    return null;
  }
  return null;
}

export function agencyMapsEmbedUrl(location: LocationData): string {
  return embedUrlFromMapSearchUrl(location.mapSearchUrl) ?? buildMapsEmbedUrl(location);
}

/**
 * Second map — structured address + zoom step so URL differs when CMS query matches `agencyMapsEmbedUrl`.
 */
export function agencyMapsSecondaryEmbedUrl(location: LocationData): string {
  const primary = agencyMapsEmbedUrl(location);
  const encoded = encodeURIComponent(locationAddressPlaceString(location));
  for (const z of [14, 15, 17, 13, 12] as const) {
    const candidate = googleMapsIframeEmbedUrl(encoded, z);
    if (candidate !== primary) return candidate;
  }
  return googleMapsIframeEmbedUrl(encoded, 14);
}

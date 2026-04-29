/**
 * Maps blog category slugs to pill background colors.
 * Unknown categories get a deterministic color from a small palette.
 * Known categories use navy / teal / seafoam / gold aligned with globals.css tokens.
 */
const CATEGORY_COLORS: Record<string, string> = {
  announcements: "#67c084", // seafoam (--color-gradient-end)
  blog: "#009b7c", // teal (--color-gradient-mid2)
  partnerships: "#003a74", // blue (--color-gradient-mid)
  "in-the-news": "#e67e22", // orange
  leadership: "#244260", // navy (--color-brand-dark)
  "mergers-and-acquisitions": "#e67e22", // orange
  "merger-and-acquisitions": "#e67e22", // orange (alternate slug)
  "gives-back": "#6b4c9a", // purple
  awards: "#8a6419", // gold (readable with white label text)
  award: "#8a6419", // WP may use singular slug
};

const FALLBACK_COLORS = [
  "#3fa590",
  "#009b7c",
  "#003a74",
  "#e67e22",
  "#244260",
  "#6b4c9a",
  "#67c084",
];

function hashSlug(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) {
    h = (h << 5) - h + slug.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function getCategoryPillColor(slug: string): string {
  const normalized = slug?.toLowerCase().trim() ?? "";
  if (CATEGORY_COLORS[normalized]) {
    return CATEGORY_COLORS[normalized];
  }
  const idx = hashSlug(normalized) % FALLBACK_COLORS.length;
  return FALLBACK_COLORS[idx];
}

/**
 * Maps blog category slugs to pill background colors.
 * Unknown categories get a deterministic color from a small palette.
 * Known categories use navy / teal / seafoam / gold aligned with globals.css tokens.
 */
const CATEGORY_COLORS: Record<string, string> = {
  "mergers-and-acquisitions": "#67c084", // seafoam (--color-gradient-end)
  blog: "#009b7c", // teal (--color-gradient-mid2)
  "company-news": "#244260", // navy (--color-brand-dark)
  technology: "#e67e22", // orange
  community: "#6b4c9a", // purple
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

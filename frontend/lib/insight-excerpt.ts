function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&nbsp;/gi, " ")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => {
      const code = parseInt(hex, 16);
      return Number.isFinite(code) ? String.fromCodePoint(code) : _;
    })
    .replace(/&#(\d+);/g, (_, num) => {
      const code = parseInt(num, 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : _;
    })
    .replace(/&hellip;/gi, "…")
    .replace(/&mdash;/gi, "—")
    .replace(/&ndash;/gi, "–")
    .replace(/&apos;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&amp;/gi, "&");
}

/**
 * Full insight excerpt as plain text: preserves paragraph breaks from WP HTML and decodes entities.
 */
export function formatInsightExcerptPlain(html: string | null | undefined): string {
  if (!html) return "";
  let t = html.trim();
  t = t.replace(/\r\n/g, "\n");
  t = t.replace(/<\/p>\s*/gi, "\n\n");
  t = t.replace(/<\s*br\s*\/?>/gi, "\n");
  t = t.replace(/<\/\s*(div|h[1-6]|li|blockquote)\s*>/gi, "\n\n");
  t = t.replace(/<[^>]+>/g, " ");
  t = t.replace(/[ \t]+\n/g, "\n");
  t = t.replace(/\n[ \t]+/g, "\n");
  t = t.replace(/\n{3,}/g, "\n\n");
  t = t.replace(/ {2,}/g, " ").trim();
  return decodeHtmlEntities(t);
}

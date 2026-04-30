/**
 * Clickable phone href for typical US NANP numbers (`tel:+1…`).
 * Accepts display strings such as `(863) 291-4111`.
 */
export function telHrefPlusOne(phone: string): string | null {
  const d = phone.replace(/\D/g, "");
  if (d.length === 10) return `tel:+1${d}`;
  if (d.length === 11 && d.startsWith("1")) return `tel:+1${d.slice(1)}`;
  return d.length > 0 ? `tel:+${d}` : null;
}

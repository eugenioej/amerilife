/**
 * Divi pages often repeat the same agent block (responsive duplicate, twin column, etc.).
 * Merge rows that share the same work email, or the same display name when email is absent.
 */
export function dedupeAgentsByEmailOrName(agents) {
  if (!Array.isArray(agents) || agents.length < 2) return agents;
  const seen = new Map();
  const out = [];
  for (const a of agents) {
    const email = String(a.email || "")
      .toLowerCase()
      .trim();
    const nameKey = String(a.name || "")
      .trim()
      .toLowerCase();
    const key = email || nameKey;
    if (!key) {
      out.push(a);
      continue;
    }
    if (seen.has(key)) {
      const i = seen.get(key);
      const cur = out[i];
      if (!cur.imageUrl && a.imageUrl) cur.imageUrl = a.imageUrl;
      if (!cur.email && a.email) {
        cur.email = a.email;
        if (a.amlhCode) cur.amlhCode = a.amlhCode;
      }
      continue;
    }
    seen.set(key, out.length);
    out.push({ ...a });
  }
  return out;
}

import type { NavItem } from "@/lib/wp-menus";

function menuPath(href: string): string {
  const h = href.trim();
  if (!h) return "/";
  try {
    if (h.startsWith("http://") || h.startsWith("https://")) {
      return new URL(h).pathname.replace(/\/+$/, "") || "/";
    }
  } catch {
    /* ignore */
  }
  return h.startsWith("/") ? h.replace(/\/+$/, "") || "/" : `/${h.replace(/\/+$/, "")}`;
}

/** Primary menu item that should open the header Contact popup instead of navigating. */
export function isContactNavItem(item: NavItem): boolean {
  const label = (item.label ?? "").trim().toLowerCase();
  const path = menuPath(item.href ?? "");
  return (
    label === "contact" ||
    label === "contact us" ||
    path === "/contact"
  );
}

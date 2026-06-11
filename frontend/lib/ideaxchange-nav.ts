import type { NavItem } from "@/lib/wp-menus";

export const IDEAXCHANGE_LOGO_SRC =
  "https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/05/ideaXchange-2-scaled.png";

/** True for gated magazine routes only (not the public login page). */
export function isIdeaxchangePath(pathname: string): boolean {
  const normalized = pathname.replace(/\/+$/, "") || "/";
  return (
    normalized === "/ideaxchange/magazine" ||
    normalized.startsWith("/ideaxchange/magazine/")
  );
}

/** Content verticals — matches insight / ideaxchange topic slugs in WordPress. */
export const IDEAXCHANGE_VERTICAL_NAV: NavItem[] = [
  { label: "Magazine", href: "/ideaxchange/magazine/" },
  { label: "Health", href: "/ideaxchange/magazine/category/health/" },
  { label: "Wealth", href: "/ideaxchange/magazine/category/wealth/" },
  { label: "Leadership", href: "/ideaxchange/magazine/category/leadership/" },
  { label: "Life", href: "/ideaxchange/magazine/category/life/" },
];

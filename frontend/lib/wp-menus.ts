// lib/wp-menus.ts
// Header/Footer menus from WordPress. Tries WP first, falls back to static.
//
// To use your WP header menu:
// 1. In WordPress: Appearance > Menus, create/edit your "Header" menu with your links
// 2. Assign the menu to a theme location (e.g. "Primary" or "Header")
// 3. Menus must be assigned to a location to be visible in GraphQL

import { fetchGraphQL } from "./wp-client";
import { GET_MENUS, GET_MENU_BY_SLUG, GET_MENU_ITEMS_PRIMARY, GET_MENU_ITEMS_HEADER } from "./queries";

export type NavItem = {
  label: string;
  href: string;
  children?: NavItem[];
};

/** Static fallback when WP menus are empty (e.g. not yet configured). */
const STATIC_PRIMARY_NAV: NavItem[] = [
  {
    label: "About Us",
    href: "/about-us/",
    children: [
      { label: "Who We Are", href: "/about-us/who-we-are/" },
      { label: "Our Leaders", href: "/about-us/our-leaders/" },
      {
        label: "Our Distribution",
        href: "/about-us/our-distribution/",
        children: [
          { label: "Career Agency", href: "/about-us/our-distribution/career-agency/" },
          { label: "Health Distribution", href: "/about-us/our-distribution/health-distribution/" },
          { label: "Wealth Distribution", href: "/about-us/our-distribution/wealth-distribution/" },
          { label: "Worksite Distribution", href: "/about-us/our-distribution/worksite-distribution/" },
        ],
      },
      { label: "AmeriLife Gives Back Foundation", href: "/givesback/" },
    ],
  },
  {
    label: "Our Solutions",
    href: "/our-solutions/",
    children: [
      { label: "For Affiliates", href: "/our-solutions/affiliates/" },
      { label: "For Agents & Advisors", href: "/our-solutions/agents-and-advisors/" },
      { label: "For Carrier Partners", href: "/our-solutions/carriers/" },
      { label: "For Consumers", href: "/our-solutions/consumers/" },
      { label: "For Our Employees", href: "/our-solutions/employees/" },
      { label: "Newsroom", href: "/newsroom/" },
      { label: "Join Our Team", href: "/join-our-team/" },
    ],
  },
  { label: "Contact Us", href: "/contact/" },
];

/** Static footer links (legal + utility). */
const STATIC_FOOTER_LINKS: NavItem[] = [
  { label: "Privacy Policy", href: "/privacy/" },
  { label: "Terms of Use", href: "/terms/" },
  { label: "Contact Us", href: "/contact/" },
];

function normalizeMenuItems(
  items: { id: string; label: string; url: string; path?: string; parentId?: string | null }[]
): NavItem[] {
  return buildHierarchy(items, null);
}

function buildHierarchy(
  items: { id: string; label: string; url: string; path?: string; parentId?: string | null }[],
  parentId: string | null = null
): NavItem[] {
  const result: NavItem[] = [];
  for (const item of items) {
    const itemParentId = item.parentId ?? null;
    if (String(itemParentId) !== String(parentId)) continue;

    const href = item.path ?? item.url ?? "#";
    const normalizedHref = href.startsWith("http") ? new URL(href).pathname : href;

    const children = buildHierarchy(items, item.id);
    result.push({
      label: item.label || "Untitled",
      href: normalizedHref,
      children: children.length ? children : undefined,
    });
  }
  return result;
}

type MenuNode = {
  id?: string;
  name?: string;
  slug?: string;
  menuItems?: { nodes: { id: string; label: string; url: string; path?: string; parentId?: string | null }[] };
};

export async function getPrimaryMenu(): Promise<NavItem[]> {
  // 1. Try menu items by theme location (most reliable when menu is assigned to header)
  type MenuItemsRes = { menuItems?: { nodes: { id: string; label: string; url: string; path?: string; parentId?: string | null }[] } };
  for (const query of [GET_MENU_ITEMS_PRIMARY, GET_MENU_ITEMS_HEADER]) {
    try {
      const data = await fetchGraphQL<MenuItemsRes>(query);
      const nodes = data?.menuItems?.nodes;
      if (nodes?.length) {
        return normalizeMenuItems(nodes);
      }
    } catch {
      // Location may not exist in theme, try next
    }
  }

  // 2. Try menus list and find primary/header by slug or name
  try {
    const data = await fetchGraphQL<{ menus?: { nodes: MenuNode[] } }>(GET_MENUS);
    const menus = data?.menus?.nodes ?? [];
    const primary =
      menus.find(
        (m) =>
          m.slug === "primary" ||
          m.name?.toLowerCase().includes("primary") ||
          m.name?.toLowerCase().includes("header")
      ) ?? menus[0];

    if (primary?.menuItems?.nodes?.length) {
      return buildHierarchy(primary.menuItems.nodes);
    }

    for (const slug of ["primary", "header", "main"]) {
      const menuBySlug = await fetchGraphQL<{ menu?: MenuNode | null }>(
        GET_MENU_BY_SLUG,
        { slug }
      );
      if (menuBySlug?.menu?.menuItems?.nodes?.length) {
        return buildHierarchy(menuBySlug.menu.menuItems.nodes);
      }
    }
  } catch {
    // Fall through to static fallback
  }
  return STATIC_PRIMARY_NAV;
}

export async function getFooterMenu(): Promise<NavItem[]> {
  try {
    const data = await fetchGraphQL<{ menus?: { nodes: MenuNode[] } }>(GET_MENUS);

    const menus = data?.menus?.nodes ?? [];
    const footer =
      menus.find(
        (m) =>
          m.slug === "footer" || m.name?.toLowerCase().includes("footer")
      ) ?? menus[1];

    if (footer?.menuItems?.nodes?.length) {
      return buildHierarchy(footer.menuItems.nodes);
    }
  } catch {
    // Fall through to static fallback
  }
  return STATIC_FOOTER_LINKS;
}

"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Link } from "../ui/Link";
import { ChevronDownIcon, ChevronRightIcon } from "../ui/ChevronDownIcon";
import { MobileNav } from "./MobileNav";
import { HeaderSearch } from "./HeaderSearch";
import { useContactPopup } from "./ContactPopupProvider";
import type { NavItem } from "@/lib/wp-menus";
import { isContactNavItem } from "@/lib/nav-contact";
import {
  IDEAXCHANGE_LOGO_SRC,
} from "@/lib/ideaxchange-nav";
import {
  type IdeaxchangePersona,
  getIdeaxchangeHomeForPersona,
  getIdeaxchangeNavForPersona,
} from "@/lib/ideaxchange-persona";
import type { IdeaxchangeDevViewMode } from "@/lib/ideaxchange-dev";
import { rewriteUploadsUrl } from "@/lib/wp-media";

type SiteHeaderProps = {
  primaryMenu: NavItem[];
  ideaxchangePersona?: IdeaxchangePersona | null;
  ideaxchangeDevView?: IdeaxchangeDevViewMode;
  inIdeaxchange?: boolean;
};

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <span className="flex h-6 w-6 flex-col justify-center gap-1">
      <span
        className={`block h-0.5 w-full bg-[#244260] transition-transform ${open ? "translate-y-1.5 rotate-45" : ""}`}
      />
      <span className={`block h-0.5 w-full bg-[#244260] transition-opacity ${open ? "opacity-0" : ""}`} />
      <span
        className={`block h-0.5 w-full bg-[#244260] transition-transform ${open ? "-translate-y-1.5 -rotate-45" : ""}`}
      />
    </span>
  );
}

export function SiteHeader({
  primaryMenu,
  ideaxchangePersona = null,
  ideaxchangeDevView = "off",
}: SiteHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const isIdeaxchangeRoute =
  pathname === "/ideaxchange" ||
  pathname.startsWith("/ideaxchange/");
  const { openContactPopup } = useContactPopup();

  const isActiveNavHref = (href: string) => {
    const normalizedPath = pathname.replace(/\/+$/, "") || "/";
    const normalizedHref = href.replace(/\/+$/, "") || "/";
    return (
      normalizedPath === normalizedHref || normalizedPath.startsWith(`${normalizedHref}/`)
    );
  };

  const navItems = isIdeaxchangeRoute
  ? getIdeaxchangeNavForPersona(
      ideaxchangePersona ?? "brokerage",
      ideaxchangeDevView,
    )
  : primaryMenu;

const logoUrl = rewriteUploadsUrl(
  isIdeaxchangeRoute
    ? IDEAXCHANGE_LOGO_SRC
    : "https://headlessameril.wpenginepowered.com/wp-content/uploads/2022/01/amerilife.svg",
);

const logoHref = isIdeaxchangeRoute
  ? getIdeaxchangeHomeForPersona(ideaxchangePersona ?? "brokerage")
  : "/";

const logoAlt = isIdeaxchangeRoute
  ? "AmeriLife ideaXchange"
  : "AmeriLife";

const logoAriaLabel = isIdeaxchangeRoute
  ? "ideaXchange Home"
  : "AmeriLife Home";

  return (
    <>
      <header
        className="sticky top-0 z-[var(--z-header)] border-b border-[var(--color-border)]"
        style={{ background: "#ffffff" }}
      >
        <div
          className="mx-auto flex h-[var(--header-height)] max-w-[var(--container-max)] items-center justify-between px-[var(--container-padding-x)]"
          style={{ height: "var(--header-height)" }}
        >
          <Link href={logoHref} variant="button" className="flex items-center shrink-0" aria-label={logoAriaLabel}>
            <Image
              src={logoUrl}
              alt={logoAlt}
              width={isIdeaxchangeRoute ? 160 : 140}
              height={isIdeaxchangeRoute ? 48 : 40}
              className={
                isIdeaxchangeRoute
                  ? "h-7 w-auto max-w-[160px] object-contain lg:h-9"
                  : "h-6 w-auto lg:h-8"
              }
            />
          </Link>

          {/* Desktop nav */}
          <nav
            className="hidden items-center gap-8 lg:flex"
            aria-label={isIdeaxchangeRoute ? "ideaXchange pillars" : "Main navigation"}
          >
            {navItems.map((item) => {
              if (isIdeaxchangeRoute && item.disabled) {
                return (
                  <span
                    key={item.label}
                    className="cursor-not-allowed px-2 py-1 text-base font-semibold text-[var(--color-muted)] opacity-60"
                    aria-disabled="true"
                  >
                    {item.label}
                  </span>
                );
              }

              if (!isIdeaxchangeRoute && isContactNavItem(item)) {
                return (
                  <div key={item.href + item.label} className="relative">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 px-2 py-1 text-base font-semibold text-[var(--color-brand-dark)] transition-colors hover:text-[var(--color-brand-primary)]"
                      onClick={openContactPopup}
                    >
                      {item.label}
                    </button>
                  </div>
                );
              }

              const hasChildren = !isIdeaxchangeRoute && item.children && item.children.length > 0;
              const isActive = isIdeaxchangeRoute && isActiveNavHref(item.href);
              return (
                <div key={item.href + item.label} className="relative group">
                  <Link
                    href={item.href}
                    variant="button"
                    aria-current={isActive ? "page" : undefined}
                    className={`inline-flex items-center gap-1 px-2 py-1 text-base font-semibold transition-colors ${
                      isActive
                        ? "text-[var(--color-brand-primary)]"
                        : "text-[var(--color-brand-dark)] hover:text-[var(--color-brand-primary)]"
                    }`}
                  >
                    {item.label}
                    {hasChildren ? (
                      <ChevronDownIcon size={14} className="text-[var(--color-brand-primary)]" />
                    ) : null}
                  </Link>
                  {hasChildren ? (
                    <div className="absolute left-0 top-full pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all delay-75">
                      <ul className="min-w-[200px] rounded-md bg-white/95 py-2 shadow-lg ring-1 ring-black/5">
                        {item.children!.map((child) => {
                          const childHasChildren = child.children && child.children.length > 0;
                          return (
                            <li key={child.href + child.label}>
                              {childHasChildren ? (
                                <div className="relative group/sub">
                                  <Link
                                    href={child.href}
                                    variant="button"
                                    className="flex items-center justify-between gap-2 px-4 py-2 text-base text-[var(--color-brand-dark)] transition-colors hover:bg-black/5 hover:text-[var(--color-brand-primary)]"
                                  >
                                    {child.label}
                                    <ChevronRightIcon size={14} />
                                  </Link>
                                  <div className="absolute left-full top-0 pl-1 opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all">
                                    <ul className="min-w-[200px] rounded-md bg-white/95 py-2 shadow-lg ring-1 ring-black/5">
                                      {child.children!.map((grand) => (
                                        <li key={grand.href + grand.label}>
                                          <Link
                                            href={grand.href}
                                            variant="button"
                                            className="block px-4 py-2 text-base text-[var(--color-brand-dark)] transition-colors hover:bg-black/5 hover:text-[var(--color-brand-primary)]"
                                          >
                                            {grand.label}
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              ) : (
                                <Link
                                  href={child.href}
                                  variant="button"
                                  className="block px-4 py-2 text-base text-[var(--color-brand-dark)] transition-colors hover:bg-black/5 hover:text-[var(--color-brand-primary)]"
                                >
                                  {child.label}
                                </Link>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </nav>

          <div className="flex items-center gap-4">
            {isIdeaxchangeRoute ? (
              <HeaderSearch
                resultsPath="/ideaxchange/search"
                placeholder="Search ideaXchange..."
              />
            ) : (
              <HeaderSearch />
            )}
            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              className="flex h-10 w-10 items-center justify-center rounded lg:hidden"
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              <HamburgerIcon open={mobileOpen} />
            </button>
          </div>
        </div>
      </header>

      <MobileNav
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        items={navItems}
        onContactSelect={
          isIdeaxchangeRoute
            ? undefined
            : () => {
                setMobileOpen(false);
                openContactPopup();
              }
        }
      />
    </>
  );
}

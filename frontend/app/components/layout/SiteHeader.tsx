"use client";

import { useState } from "react";
import Image from "next/image";
import { Link } from "../ui/Link";
import { MobileNav } from "./MobileNav";
import { HeaderSearch } from "./HeaderSearch";
import type { NavItem } from "@/lib/wp-menus";

type SiteHeaderProps = {
  primaryMenu: NavItem[];
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

export function SiteHeader({ primaryMenu }: SiteHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = primaryMenu;

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
          <Link href="/" variant="button" className="flex items-center shrink-0" aria-label="AmeriLife Home">
            <Image
              src="https://amerilife.com/wp-content/uploads/2022/01/amerilife.svg"
              alt="AmeriLife"
              width={140}
              height={40}
              className="h-8 w-auto"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 lg:flex" aria-label="Main navigation">
            {navItems.map((item) => (
              <div key={item.href + item.label} className="relative group">
                <Link
                  href={item.href}
                  variant="button"
                  className="inline-flex items-center gap-1 px-2 py-1 text-base font-semibold text-[var(--color-brand-dark)] transition-colors hover:text-[var(--color-brand-primary)]"
                >
                  {item.label}
                </Link>
                {item.children && item.children.length > 0 && (
                  <div className="absolute left-0 top-full pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <ul className="min-w-[200px] rounded-md bg-white/95 py-2 shadow-lg">
                      {item.children.map((child) => (
                        <li key={child.href + child.label}>
                          <Link
                            href={child.href}
                            variant="button"
                            className="block px-4 py-2 text-base text-[var(--color-brand-dark)] transition-colors hover:bg-black/5 hover:text-[var(--color-brand-primary)]"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <HeaderSearch />
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
        items={primaryMenu}
      />
    </>
  );
}

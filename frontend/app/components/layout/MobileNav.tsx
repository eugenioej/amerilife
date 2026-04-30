"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { Link } from "../ui/Link";
import { Sheet } from "../ui/Sheet";
import { ChevronDownIcon } from "../ui/ChevronDownIcon";
import { FOOTER_LOGO_SRC } from "./SiteFooter";
import type { NavItem } from "@/lib/wp-menus";
import { isContactNavItem } from "@/lib/nav-contact";
import { rewriteUploadsUrl } from "@/lib/wp-media";

type MobileNavProps = {
  open: boolean;
  onClose: () => void;
  items: NavItem[];
  /** Opens the header Contact popup (same as desktop Contact). */
  onContactSelect?: () => void;
};

/** WP / theme menus often use `#` (or empty) for parent items that only expand submenus. */
function isHashToggleHref(href: string): boolean {
  const t = href.trim();
  return t === "#" || t === "";
}

function MobileNavItem({
  item,
  onClose,
  onContactSelect,
  level = 0,
}: {
  item: NavItem;
  onClose: () => void;
  onContactSelect?: () => void;
  level?: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const submenuId = useId();
  const hasChildren = item.children && item.children.length > 0;
  const paddingLeft = level === 0 ? 24 : 24 + level * 32;
  const contactAsPopup = Boolean(onContactSelect && isContactNavItem(item));
  const hashToggleParent = hasChildren && isHashToggleHref(item.href);

  return (
    <li>
      {contactAsPopup ? (
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            className="flex-1 px-6 py-3 text-left text-base font-semibold text-white"
            style={{ paddingLeft }}
            onClick={() => {
              onContactSelect?.();
              onClose();
            }}
          >
            {item.label}
          </button>
        </div>
      ) : hashToggleParent ? (
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 border-0 bg-transparent px-6 py-3 text-left text-base font-semibold text-white"
          style={{ paddingLeft }}
          onClick={() => setExpanded((e) => !e)}
          aria-expanded={expanded}
          aria-controls={submenuId}
        >
          <span>{item.label}</span>
          <span
            className="flex h-12 w-12 shrink-0 items-center justify-center text-white/80"
            aria-hidden
          >
            <ChevronDownIcon size={18} open={expanded} />
          </span>
        </button>
      ) : isHashToggleHref(item.href) ? (
        <span
          className="block px-6 py-3 text-base font-semibold text-white/90"
          style={{ paddingLeft }}
        >
          {item.label}
        </span>
      ) : (
        <div className="flex items-center justify-between gap-2">
          <Link
            href={item.href}
            variant="nav"
            className="flex-1 px-6 py-3 text-base font-semibold"
            style={{ paddingLeft }}
            onClick={onClose}
          >
            {item.label}
          </Link>
          {hasChildren && (
            <button
              type="button"
              onClick={() => setExpanded((e) => !e)}
              className="flex h-12 w-12 shrink-0 items-center justify-center text-white/80"
              aria-expanded={expanded}
              aria-controls={submenuId}
              aria-label={expanded ? "Collapse submenu" : "Expand submenu"}
            >
              <ChevronDownIcon size={18} open={expanded} />
            </button>
          )}
        </div>
      )}
      {hasChildren && (
        <ul
          id={submenuId}
          className={`ml-4 flex flex-col gap-1 border-l-2 border-white/30 pl-4 overflow-hidden transition-[max-height,opacity] duration-200 ${
            expanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {item.children!.map((child) => (
            <MobileNavItem
              key={child.href + child.label}
              item={child}
              onClose={onClose}
              onContactSelect={onContactSelect}
              level={level + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

function NavItemList({
  items,
  onClose,
  onContactSelect,
}: {
  items: NavItem[];
  onClose: () => void;
  onContactSelect?: () => void;
}) {
  return (
    <ul className="flex flex-col gap-1">
      {items.map((item) => (
        <MobileNavItem
          key={item.href + item.label}
          item={item}
          onClose={onClose}
          onContactSelect={onContactSelect}
        />
      ))}
    </ul>
  );
}

/** Same SVG as header/footer; filtered to white on the drawer background. */
const mobileMenuLogoSvgUrl = rewriteUploadsUrl(FOOTER_LOGO_SRC);

export function MobileNav({ open, onClose, items, onContactSelect }: MobileNavProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const focusable = panelRef.current?.querySelectorAll(
      'a[href], button'
    ) as NodeListOf<HTMLElement> | undefined;
    if (!focusable?.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <Sheet open={open} onClose={onClose} aria-label="Navigation menu">
      <div ref={panelRef} className="flex h-full min-h-0 flex-col">
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/20 px-4 py-3">
          <Link
            href="/"
            variant="button"
            className="flex shrink-0 items-center"
            aria-label="AmeriLife Home"
            onClick={onClose}
          >
            <Image
              src={mobileMenuLogoSvgUrl}
              alt="AmeriLife"
              width={140}
              height={40}
              className="h-7 w-auto brightness-0 invert"
              sizes="128px"
            />
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 min-w-11 shrink-0 items-center justify-center rounded-md border border-white/35 text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            aria-label="Close navigation menu"
          >
            <span className="text-3xl font-light leading-none" aria-hidden>
              ×
            </span>
          </button>
        </div>
        <nav className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-8 pt-2">
          <NavItemList items={items} onClose={onClose} onContactSelect={onContactSelect} />
        </nav>
      </div>
    </Sheet>
  );
}

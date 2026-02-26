"use client";

import { useEffect, useRef, useState } from "react";
import { Link } from "../ui/Link";
import { Sheet } from "../ui/Sheet";
import { ChevronDownIcon } from "../ui/ChevronDownIcon";
import type { NavItem } from "@/lib/wp-menus";

type MobileNavProps = {
  open: boolean;
  onClose: () => void;
  items: NavItem[];
};

function MobileNavItem({ item, onClose, level = 0 }: { item: NavItem; onClose: () => void; level?: number }) {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const paddingLeft = level === 0 ? 24 : 24 + level * 32;

  return (
    <li>
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
            aria-label={expanded ? "Collapse submenu" : "Expand submenu"}
          >
            <ChevronDownIcon size={18} open={expanded} />
          </button>
        )}
      </div>
      {hasChildren && (
        <ul
          className={`ml-4 flex flex-col gap-1 border-l-2 border-white/30 pl-4 overflow-hidden transition-[max-height,opacity] duration-200 ${
            expanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {item.children!.map((child) => (
            <MobileNavItem key={child.href + child.label} item={child} onClose={onClose} level={level + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

function NavItemList({ items, onClose }: { items: NavItem[]; onClose: () => void }) {
  return (
    <ul className="flex flex-col gap-1">
      {items.map((item) => (
        <MobileNavItem key={item.href + item.label} item={item} onClose={onClose} />
      ))}
    </ul>
  );
}

export function MobileNav({ open, onClose, items }: MobileNavProps) {
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
      <div ref={panelRef} className="flex h-full flex-col pt-20">
        <nav className="flex-1 overflow-y-auto px-4">
          <NavItemList items={items} onClose={onClose} />
        </nav>
      </div>
    </Sheet>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { Link } from "../ui/Link";
import { Sheet } from "../ui/Sheet";
import type { NavItem } from "@/lib/wp-menus";

type MobileNavProps = {
  open: boolean;
  onClose: () => void;
  items: NavItem[];
};

function NavItemList({ items, onClose }: { items: NavItem[]; onClose: () => void }) {
  return (
    <ul className="flex flex-col gap-1">
      {items.map((item) => (
        <li key={item.href + item.label}>
          <Link
            href={item.href}
            variant="nav"
            className="block px-6 py-3 text-base font-semibold"
            onClick={onClose}
          >
            {item.label}
          </Link>
          {item.children && item.children.length > 0 && (
            <ul className="ml-6 mt-1 flex flex-col gap-1 border-l-2 border-white/30 pl-4">
              {item.children.map((child) => (
                <li key={child.href + child.label}>
                  <Link
                    href={child.href}
                    variant="nav"
                    className="block py-2 text-sm"
                    onClick={onClose}
                  >
                    {child.label}
                  </Link>
                  {child.children?.map((grand) => (
                    <li key={grand.href + grand.label}>
                      <Link
                        href={grand.href}
                        variant="nav"
                        className="block py-1.5 pl-4 text-sm opacity-90"
                        onClick={onClose}
                      >
                        {grand.label}
                      </Link>
                    </li>
                  ))}
                </li>
              ))}
            </ul>
          )}
        </li>
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

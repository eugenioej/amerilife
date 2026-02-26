"use client";

import { useState } from "react";

export type KickoffAccordionItem = {
  title: string;
  content: React.ReactNode;
};

type KickoffAccordionProps = {
  items: KickoffAccordionItem[];
  className?: string;
};

export function KickoffAccordion({ items, className = "" }: KickoffAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className={`space-y-2 ${className}`.trim()}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className="overflow-hidden rounded border border-[var(--color-border)] bg-[#e8e9eb]"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full cursor-pointer items-center justify-between px-4 py-4 text-left text-base font-semibold text-[var(--color-fg)] transition-colors hover:bg-[#dfe0e2]"
              aria-expanded={isOpen}
            >
              {item.title}
              <span
                className={`ml-4 shrink-0 text-[var(--color-muted)] transition-transform ${
                  isOpen ? "rotate-45" : ""
                }`}
                aria-hidden
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </span>
            </button>
            <div
              className={`overflow-hidden transition-all duration-200 ${
                isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="border-t border-[var(--color-border)] bg-white px-4 py-4">
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

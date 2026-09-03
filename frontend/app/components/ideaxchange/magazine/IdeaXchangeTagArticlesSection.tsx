"use client";

import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

/**
 * Client boundary wraps the category articles landmark so the section + sr-only
 * heading hydrate in the same tree as the newsroom list (avoids RSC/client edge mismatches).
 */
export function IdeaXchangeTagArticlesSection({ children }: Props) {
  return (
    <section className="mt-10 md:mt-12">
      <h2 className="sr-only">Articles</h2>
      {children}
    </section>
  );
}

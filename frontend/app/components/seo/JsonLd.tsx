import type { ReactNode } from "react";

type Props = {
  schema: Record<string, unknown>;
};

/**
 * Server-safe JSON-LD script for structured data (Organization, Article, BreadcrumbList, etc.).
 */
export function JsonLd({ schema }: Props): ReactNode {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

import type { ReactNode } from "react";
import {
  SiteBreadcrumb,
  type SiteBreadcrumbItem,
} from "@/app/components/layout/SiteBreadcrumb";

type LegalPageLayoutProps = {
  title: string;
  description?: string;
  breadcrumb?: SiteBreadcrumbItem[];
  /**
   * Typography aligned with amerilife.com legal pages (Divi Child: `.aml-plain-text .text` —
   * navy body #244260, 27px paragraph line-height; h1 weight 600 / 48px desktop).
   */
  amlPlainText?: boolean;
  children: ReactNode;
};

export function LegalPageLayout({
  title,
  description,
  breadcrumb,
  amlPlainText,
  children,
}: LegalPageLayoutProps) {
  const headerTitleClass = amlPlainText
    ? "text-[32px] font-semibold leading-[38px] text-[#244260] lg:text-[48px] lg:leading-[64px]"
    : "text-3xl font-bold text-[var(--color-fg)] lg:text-4xl";

  const bodyClass = amlPlainText
    ? [
        "space-y-6 text-[#244260]",
        "[&_p]:leading-[27px]",
        "[&_h2]:mt-8 [&_h2]:text-base [&_h2]:font-bold [&_h2]:leading-[27px] [&_h2]:text-[#244260]",
        "[&_h3]:mt-6 [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-[#244260]",
        "[&_a]:text-[#3FA590] [&_a]:font-normal [&_a]:underline",
        "[&_a:hover]:font-bold [&_a:hover]:text-[#3FA590]",
      ].join(" ")
    : "space-y-6 text-[var(--color-fg)] [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-bold [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-semibold [&_p]:leading-relaxed [&_a]:text-[var(--color-link)] [&_a]:underline [&_a:hover]:text-[var(--color-link-hover)]";

  return (
    <article className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)] py-12 lg:py-16">
      {breadcrumb?.length ? (
        <SiteBreadcrumb items={breadcrumb} className="mb-8" />
      ) : null}
      <header className="mb-10">
        <h1 className={headerTitleClass}>{title}</h1>
        {description ? (
          <p className="mt-2 text-base text-[var(--color-muted)]">{description}</p>
        ) : null}
      </header>
      <div className={bodyClass}>{children}</div>
    </article>
  );
}

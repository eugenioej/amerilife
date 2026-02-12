import type { ReactNode } from "react";

type LegalPageLayoutProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export function LegalPageLayout({ title, description, children }: LegalPageLayoutProps) {
  return (
    <article className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)] py-12 lg:py-16">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-[var(--color-fg)] lg:text-4xl">{title}</h1>
        {description && (
          <p className="mt-2 text-base text-[var(--color-muted)]">{description}</p>
        )}
      </header>
      <div className="space-y-6 text-[var(--color-fg)] [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-bold [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-semibold [&_p]:leading-relaxed [&_a]:text-[var(--color-link)] [&_a]:underline [&_a:hover]:text-[var(--color-link-hover)]">
        {children}
      </div>
    </article>
  );
}

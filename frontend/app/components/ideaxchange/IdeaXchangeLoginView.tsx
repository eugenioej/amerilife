import { Suspense } from "react";
import { Link } from "@/app/components/ui/Link";
import { IdeaXchangeLoginForm } from "./IdeaXchangeLoginForm";
import { IdeaXchangeWordmark } from "./IdeaXchangeLogo";

const JOIN_OUR_TEAM_PATH = "/join-our-team/";

export function IdeaXchangeLoginView() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)] py-12 sm:py-16 lg:py-20">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between lg:gap-16 xl:gap-20">
          <div className="min-w-0 flex-1 pt-2 lg:max-w-2xl lg:pt-6">
            <h1 className="text-[32px] font-semibold leading-tight text-[var(--color-brand-dark)] sm:text-[40px] sm:leading-[1.15]">
              Welcome to <IdeaXchangeWordmark />.
            </h1>
            <p className="mt-6 text-base leading-relaxed text-[var(--color-muted)] sm:text-lg">
              ideaXchange is AmeriLife&apos;s internal online magazine, created to keep our employees and
              affiliates informed and inspired. Check back often for the latest company news, product
              updates, and more.
            </p>

            <div className="mt-10">
              <Link
                href={JOIN_OUR_TEAM_PATH}
                className="text-sm font-bold uppercase tracking-[var(--tracking-wide)] text-[var(--color-brand-primary)] no-underline hover:text-[var(--color-brand-primary-hover)] hover:no-underline"
              >
                Learn more about AmeriLife careers
              </Link>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-[var(--color-muted)]">
                Not an AmeriLife employee or affiliate? Explore opportunities and learn more about careers
                at AmeriLife instead.
              </p>
              <Link
                href={JOIN_OUR_TEAM_PATH}
                variant="button"
                className="mt-6 inline-flex items-center justify-center rounded-sm bg-[var(--color-brand-dark)] px-8 py-3 text-sm font-bold uppercase tracking-[var(--tracking-normal)] text-white no-underline transition-colors hover:bg-[#1a3550] hover:text-white hover:no-underline focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-dark)] focus:ring-offset-2"
              >
                Discover more
              </Link>
            </div>
          </div>

          <div className="flex w-full shrink-0 justify-center lg:w-[380px] lg:justify-end">
            <Suspense fallback={<div className="h-[420px] w-full max-w-[380px] animate-pulse rounded-lg bg-[var(--color-border)]/40" />}>
              <IdeaXchangeLoginForm />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
}

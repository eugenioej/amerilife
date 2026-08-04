import { Link } from "@/app/components/ui/Link";
import { IdeaXchangePillarBanner } from "@/app/components/ideaxchange/shared/IdeaXchangePillarBanner";
import { IdeaXchangeHeroGrid } from "@/app/components/ideaxchange/shared/IdeaXchangeHeroGrid";import type { IdeaxchangeCardItem } from "@/app/components/ideaxchange/shared/ideaxchange-card-types";
import type { IdeaxchangeListItem } from "@/lib/ideaxchange-queries";
import {
  IDEAXCHANGE_LEADERBOARD_PATH,
  IDEAXCHANGE_RECRUITING_HUB_PATH,
} from "@/lib/ideaxchange-constants";
import {
  getCareerLeaderboardTablesBySlug,
  type CareerLeaderboardPageData,
} from "@/lib/ideaxchange-career-leaderboard-data";
import { CareerLeaderboardQuickNav } from "./CareerLeaderboardQuickNav";
import { CareerLeaderboardSection } from "./CareerLeaderboardSection";

type Props = {
  data: CareerLeaderboardPageData;
  careerSalesPosts: IdeaxchangeListItem[];
};
export function CareerLeaderboardPage({ data, careerSalesPosts }: Props) {
  const tablesBySlug = getCareerLeaderboardTablesBySlug(data.tables);

  const careerSalesHeroItems: IdeaxchangeCardItem[] = careerSalesPosts
  .slice(0, 3)
  .map((post) => {
    const topicSlug = post.ideaxchangeTopics?.nodes?.[0]?.slug?.trim();

    return {
      id: post.id,
      slug: post.slug,
      title: post.title,
      date: post.date,
      excerpt: post.excerpt,
      href:
        post.slug && topicSlug
          ? `/ideaxchange/${topicSlug}/${post.slug}/`
          : IDEAXCHANGE_LEADERBOARD_PATH,
      featuredImage: post.featuredImage,
      badgeLabel: "SALES",
      badgeHref: IDEAXCHANGE_LEADERBOARD_PATH,
    };
  });

  return (
    <div className="bg-white pb-16 md:pb-20">
      <IdeaXchangePillarBanner title="Career Leaderboard" />

      <IdeaXchangeHeroGrid
        items={careerSalesHeroItems}
        defaultBadge="SALES"
      />

      <IdeaXchangePillarBanner
        title="Career Agency Incentive Standings"
        className="mt-0 min-h-[100px] md:min-h-[120px]"
      />

      {data.usingSeedFallback ? (
        <div className="border-b border-amber-200 bg-amber-50">
          <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)] py-3 text-center text-sm text-amber-900">
            {data.piperConfigured ? (
              <>
                Live Piper data is temporarily unavailable
                {data.piperStatus ? ` (HTTP ${data.piperStatus})` : ""}. Showing demo
                standings until the feed reconnects.
                {data.piperError ? (
                  <span className="mt-1 block text-xs text-amber-800/90">
                    {data.piperError}
                  </span>
                ) : null}
              </>
            ) : (
              "Piper API is not configured. Set PIPER_API_KEY in server env to load live Career standings."
            )}
          </div>
        </div>
      ) : null}

      <CareerLeaderboardQuickNav />

      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)] py-10 md:py-14">
        {data.sections.map((section) => (
          <CareerLeaderboardSection
            key={section.slug}
            section={section}
            tablesBySlug={tablesBySlug}
          />
        ))}

        <section className="mt-16 border-t border-[var(--color-border)] pt-12 md:mt-20 md:pt-16">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-brand-primary)]">
                Recruiting Hub
              </h2>
              <p className="mt-2 text-sm text-[var(--color-muted)]">
                Campaigns, case studies, and recruiting resources for Career teams.
              </p>
            </div>
            <Link
              href={IDEAXCHANGE_RECRUITING_HUB_PATH}
              variant="button"
              className="inline-flex min-h-[44px] items-center justify-center rounded-sm bg-[var(--color-brand-primary)] px-6 text-sm font-bold uppercase tracking-wide text-white hover:bg-[var(--color-brand-primary-hover)]"
            >
              View Recruiting Hub
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

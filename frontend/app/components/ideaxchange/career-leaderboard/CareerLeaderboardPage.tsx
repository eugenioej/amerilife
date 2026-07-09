import { Link } from "@/app/components/ui/Link";
import { IdeaXchangePillarBanner } from "@/app/components/ideaxchange/shared/IdeaXchangePillarBanner";
import { IDEAXCHANGE_RECRUITING_HUB_PATH } from "@/lib/ideaxchange-constants";
import {
  formatCareerLeaderboardUpdatedDate,
  getCareerLeaderboardTablesBySlug,
  type CareerLeaderboardPageData,
} from "@/lib/ideaxchange-career-leaderboard-data";
import { CareerLeaderboardQuickNav } from "./CareerLeaderboardQuickNav";
import { CareerLeaderboardSection } from "./CareerLeaderboardSection";

type Props = {
  data: CareerLeaderboardPageData;
};

export function CareerLeaderboardPage({ data }: Props) {
  const tablesBySlug = getCareerLeaderboardTablesBySlug(data.tables);
  const formattedUpdated = formatCareerLeaderboardUpdatedDate(data.lastUpdated);

  return (
    <div className="bg-white pb-16 md:pb-20">
      <IdeaXchangePillarBanner title="Career Leaderboard" />

      <IdeaXchangePillarBanner
        title="Career Agency Incentive Standings"
        className="mt-0 min-h-[100px] md:min-h-[120px]"
      />

      {formattedUpdated ? (
        <div className="border-b border-[var(--color-border)] bg-[#f7faf9]">
          <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)] py-4 text-center text-sm text-[var(--color-muted)] sm:text-right">
            Data last updated on {formattedUpdated}
          </div>
        </div>
      ) : null}

      {data.usingSeedFallback ? (
        <div className="border-b border-amber-200 bg-amber-50">
          <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)] py-3 text-center text-sm text-amber-900">
            {data.piperConfigured
              ? "Live Piper data is temporarily unavailable. Showing demo standings until the feed reconnects."
              : "Piper API is not configured. Set PIPER_API_KEY in server env to load live Career standings."}
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

import { Link } from "@/app/components/ui/Link";
import { IdeaXchangeNewsroomColumn } from "@/app/components/ideaxchange/magazine/IdeaXchangeNewsroomColumn";
import {
  INSIGHTS_NEWSROOM_INITIAL,
  partitionNewsroomWithSidebar,
} from "@/app/components/ideaxchange/magazine/ideaxchange-utils";
import { IdeaXchangeMagazineSidebar } from "@/app/components/ideaxchange/magazine/IdeaXchangeMagazineSidebar";
import { IdeaXchangeFeaturedGrid } from "@/app/components/ideaxchange/shared/IdeaXchangeFeaturedGrid";
import { IdeaXchangeHeroGrid } from "@/app/components/ideaxchange/shared/IdeaXchangeHeroGrid";
import { IdeaXchangePillarBanner } from "@/app/components/ideaxchange/shared/IdeaXchangePillarBanner";
import type { IdeaxchangeCardItem } from "@/app/components/ideaxchange/shared/ideaxchange-card-types";
import type { CaseStudyListItem } from "@/lib/ideaxchange-recruiting-queries";
import type { IdeaxchangeListItem } from "@/lib/ideaxchange-queries";
import type { InsightsAdsSettings } from "@/lib/queries";
import { IDEAXCHANGE_MAGAZINE_PATH } from "@/lib/ideaxchange-constants";
import { IDEAXCHANGE_RECRUIT_TAG_SLUG } from "@/lib/ideaxchange-data";
import {
  caseStudyHref,
  companyLabel,
  isCaseStudyFeatured,
  toCampaignTableRow,
} from "@/lib/ideaxchange-recruiting-utils";
import { RecruitingCampaignsTable } from "./RecruitingCampaignsTable";
import { IdeaxchangeHorizontalAdSlot } from "@/app/components/ideaxchange/shared/IdeaxchangeHorizontalAdSlot";

type Props = {
  posts: CaseStudyListItem[];
  allCampaigns: CaseStudyListItem[];
  recruitPosts: IdeaxchangeListItem[];
  recruitListPageInfo?: {
    hasNextPage: boolean;
    endCursor: string | null;
  };
  insightsAds?: InsightsAdsSettings | null;
};

function dedupeById(posts: CaseStudyListItem[]): CaseStudyListItem[] {
  const seen = new Set<string>();
  const out: CaseStudyListItem[] = [];
  for (const p of posts) {
    const id = p.id?.trim();
    if (!id || seen.has(id)) continue;
    seen.add(id);
    out.push(p);
  }
  return out;
}

function takeFeatured(pool: CaseStudyListItem[], count: number): CaseStudyListItem[] {
  const ids = new Set<string>();
  const out: CaseStudyListItem[] = [];
  const add = (p: CaseStudyListItem) => {
    const id = p.id?.trim();
    if (!id || ids.has(id) || out.length >= count) return;
    ids.add(id);
    out.push(p);
  };
  for (const p of pool) {
    if (out.length >= count) break;
    if (isCaseStudyFeatured(p)) add(p);
  }
  for (const p of pool) {
    if (out.length >= count) break;
    add(p);
  }
  return out;
}

function partitionPosts(posts: CaseStudyListItem[]) {
  const unique = dedupeById(posts);
  const hero = unique.slice(0, 3);
  const remaining = unique.slice(3);
  const featured = takeFeatured(remaining, 4);
  return { hero, featured };
}

function toCardItem(post: CaseStudyListItem): IdeaxchangeCardItem {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    date: post.date,
    excerpt: post.excerpt,
    badgeLabel: companyLabel(post),
    href: caseStudyHref(post.slug),
    featuredImage: post.featuredImage,
    isFeatured: isCaseStudyFeatured(post),
    isSpotlight: post.ideaxchangeCaseStudyFields?.isSpotlight === true,
  };
}

export function RecruitingHubPage({
  posts,
  allCampaigns,
  recruitPosts,
  recruitListPageInfo,
  insightsAds,
}: Props) {
  const { hero, featured } = partitionPosts(posts);
  const campaignRows = dedupeById(allCampaigns).map(toCampaignTableRow);
  const { spotlight, recentSidebar, newsroomRest } =
    partitionNewsroomWithSidebar(recruitPosts);

  return (
    <div className="bg-white pb-16 md:pb-20">
      <IdeaXchangePillarBanner title="Recruiting Hub" />
      <IdeaXchangeHeroGrid items={hero.map(toCardItem)} defaultBadge="RECRUITING" />

      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)] py-10 md:py-14">
        <IdeaXchangeFeaturedGrid
          items={featured.map(toCardItem)}
          heading="Featured campaigns"
          defaultBadge="RECRUITING"
        />

        <section className="mt-16 md:mt-20">
          <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-brand-primary)]">
            View all of our campaigns
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--color-muted)]">
            Learn more about each of our campaign case studies. Below is a snapshot of our
            available campaign stats. Click the icon for a quick overview. Want to learn more?
            View the full case study along with downloadable resources by clicking on the
            campaign title.
          </p>
          <div className="mt-8">
            <RecruitingCampaignsTable rows={campaignRows} />
          </div>

          <IdeaxchangeHorizontalAdSlot
            slot={insightsAds?.primaryHorizontal}
            className="mt-10"
          />
        </section>

        <section className="mt-16 border-t border-[var(--color-border)] pt-12 md:mt-20 md:pt-16">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-brand-primary)]">
                Recruit
              </h2>
              <p className="mt-2 text-sm text-[var(--color-muted)]">
                Latest recruiting-focused articles from ideaXchange magazine.
              </p>
            </div>
            <Link
              href={IDEAXCHANGE_MAGAZINE_PATH}
              variant="button"
              className="inline-flex min-h-[44px] items-center justify-center rounded-sm bg-[var(--color-brand-primary)] px-6 text-sm font-bold uppercase tracking-wide text-white hover:bg-[var(--color-brand-primary-hover)]"
            >
              View magazine
            </Link>
          </div>

          <IdeaxchangeHorizontalAdSlot
            slot={insightsAds?.secondaryHorizontal}
            className="mt-10"
          />

          <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-8">
              <IdeaXchangeNewsroomColumn
                initialPosts={newsroomRest.slice(0, INSIGHTS_NEWSROOM_INITIAL)}
                deferredBatchPosts={newsroomRest.slice(INSIGHTS_NEWSROOM_INITIAL)}
                initialHasNextPage={recruitListPageInfo?.hasNextPage ?? false}
                initialEndCursor={recruitListPageInfo?.endCursor ?? null}
                tagSlug={IDEAXCHANGE_RECRUIT_TAG_SLUG}
                badgeLabel="RECRUIT"
              />
            </div>

            <aside className="lg:col-span-4">
              <IdeaXchangeMagazineSidebar
                spotlight={spotlight}
                recentSidebar={recentSidebar}
                spotlightBadgeLabel="RECRUIT"
                insightsAds={insightsAds}
              />
            </aside>
          </div>
        </section>
      </div>
    </div>
  );
}

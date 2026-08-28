import { IdeaXchangeNewsroomColumn } from "@/app/components/ideaxchange/magazine/IdeaXchangeNewsroomColumn";
import {
  INSIGHTS_NEWSROOM_INITIAL,
  partitionNewsroomWithSidebar,
} from "@/app/components/ideaxchange/magazine/ideaxchange-utils";
import { IdeaXchangeFeaturedGrid } from "@/app/components/ideaxchange/shared/IdeaXchangeFeaturedGrid";
import { IdeaXchangeHeroGrid } from "@/app/components/ideaxchange/shared/IdeaXchangeHeroGrid";
import { IdeaXchangePillarBanner } from "@/app/components/ideaxchange/shared/IdeaXchangePillarBanner";
import type { IdeaxchangeCardItem } from "@/app/components/ideaxchange/shared/ideaxchange-card-types";
import type { CaseStudyListItem } from "@/lib/ideaxchange-recruiting-queries";
import type { IdeaxchangeListItem } from "@/lib/ideaxchange-queries";
import type { IdeaxchangeAdsSettings } from "@/lib/queries";
import { IDEAXCHANGE_RECRUITING_HUB_PATH } from "@/lib/ideaxchange-constants";
import { IDEAXCHANGE_RECRUIT_TAG_SLUG } from "@/lib/ideaxchange-data";
import {
  caseStudyHref,
  isCaseStudyFeatured,
  isCaseStudyHeroFeatured,
  toCampaignTableRow,
} from "@/lib/ideaxchange-recruiting-utils";
import { RecruitingCampaignsTable } from "./RecruitingCampaignsTable";
import { IdeaxchangeHorizontalAdSlot } from "@/app/components/ideaxchange/shared/IdeaxchangeHorizontalAdSlot";
import { RecruitingResourcesSection } from "./RecruitingResourcesSection";
import { IdeaXchangeLeaderboardCtaBanner } from "../shared/IdeaXchangeLeaderboardCtaBanner";

type Props = {
  posts: CaseStudyListItem[];
  allCampaigns: CaseStudyListItem[];
  recruitPosts: IdeaxchangeListItem[];
  recruitListPageInfo?: {
    hasNextPage: boolean;
    endCursor: string | null;
  };
  ideaxchangeAds?: IdeaxchangeAdsSettings | null;
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
  const hero = unique.filter(isCaseStudyHeroFeatured).slice(0, 3);
  const heroIds = new Set(hero.map((p) => p.id));
  const remaining = unique.filter((p) => !heroIds.has(p.id));
  const featured = takeFeatured(remaining, 4);
  return { hero, featured };
}


function toCardItem(post: CaseStudyListItem): IdeaxchangeCardItem {
  console.log(
    "CASE STUDY",
    post.title,
    post.ideaxchangeCaseStudyFields
  );

  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    date: post.date,
    excerpt: post.excerpt,
    href: caseStudyHref(post.slug),
    featuredImage: post.featuredImage,
    isFeatured: isCaseStudyFeatured(post),
    isSpotlight: post.ideaxchangeCaseStudyFields?.isSpotlight === true,
    isPopup: post.ideaxchangeCaseStudyFields?.isPopup === true,
    featuredVideoUrl:
      post.ideaxchangeCaseStudyFields?.featuredVideoUrl ?? null,
  };
}

export function RecruitingHubPage({
  posts,
  allCampaigns,
  recruitPosts,
  recruitListPageInfo,
  ideaxchangeAds,
}: Props) {
  const { hero, featured } = partitionPosts(posts);
  const allUniqueCampaigns = dedupeById(allCampaigns);
  const resourceCampaigns = allUniqueCampaigns.filter((campaign) =>
    campaign.ideaxchangeCaseStudyTags?.nodes?.some(
      (tag) => tag.name === "Resource"
    )
  );
  const tableCampaigns = allUniqueCampaigns.filter(
    (campaign) =>
      !campaign.ideaxchangeCaseStudyTags?.nodes?.some(
        (tag) => tag.name === "Resource"
      )
  );
  const campaignRows = tableCampaigns.map(toCampaignTableRow);
  const { newsroomRest } =
    partitionNewsroomWithSidebar(recruitPosts);

  return (
    <div className="bg-white pb-16 md:pb-20">
      <IdeaXchangePillarBanner title="Recruiting Hub" />
      <IdeaXchangeHeroGrid items={hero.map(toCardItem)} />

      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)] py-10 md:py-14">
        <IdeaXchangeFeaturedGrid
          items={featured.map(toCardItem)}
          heading="Featured campaigns"
        />

        <section className="mt-16 md:mt-20">
          <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-brand-primary)]">
            View all of our campaigns
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted)]">
            Learn more about each of our campaign case studies. Below is a snapshot of our
            available campaign stats. Click the icon for a quick overview. Want to learn more?
            View the full case study along with downloadable resources by clicking on the
            campaign title.
          </p>
          <div className="mt-8">
            <RecruitingCampaignsTable rows={campaignRows} />
          </div>

          <RecruitingResourcesSection resources={resourceCampaigns}/>

          <IdeaxchangeHorizontalAdSlot
            slot={ideaxchangeAds?.homePrimaryHorizontal}
            className="mt-10"
          />
        </section>

        <section>
          <IdeaXchangeLeaderboardCtaBanner
              className="mt-10 md:mt-12"
              href={'/national-recruiting'}
              heading={'Become part of the National Recruiting Campaign.'}
              buttonLabel={'Learn More'}
            />              

          <IdeaxchangeHorizontalAdSlot
            slot={ideaxchangeAds?.homeSecondaryHorizontal}
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
                badgeHref={IDEAXCHANGE_RECRUITING_HUB_PATH}
              />
            </div>

          </div>
        </section>
      </div>
    </div>
  );
}

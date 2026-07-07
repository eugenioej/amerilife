import type { IdeaxchangeListItem } from "@/lib/ideaxchange-queries";
import type { InsightsAdsSettings } from "@/lib/queries";
import { IdeaXchangeFeaturedGrid } from "@/app/components/ideaxchange/shared/IdeaXchangeFeaturedGrid";
import { IdeaXchangeHeroGrid } from "@/app/components/ideaxchange/shared/IdeaXchangeHeroGrid";
import { IdeaXchangeLeaderboardCtaBanner } from "@/app/components/ideaxchange/shared/IdeaXchangeLeaderboardCtaBanner";
import { IdeaxchangeHorizontalAdSlot } from "@/app/components/ideaxchange/shared/IdeaxchangeHorizontalAdSlot";
import type { IdeaxchangeCardItem } from "@/app/components/ideaxchange/shared/ideaxchange-card-types";
import {
  ideaxchangeHref,
  INSIGHTS_NEWSROOM_INITIAL,
  isIdeaxchangeFeatured,
  topicLabel,
} from "./ideaxchange-utils";
import { IdeaXchangeMagazineSidebar } from "./IdeaXchangeMagazineSidebar";
import { IdeaXchangeNewsroomColumn } from "./IdeaXchangeNewsroomColumn";

type Props = {
  posts: IdeaxchangeListItem[];
  listPageInfo?: {
    hasNextPage: boolean;
    endCursor: string | null;
  };
  insightsAds?: InsightsAdsSettings | null;
};

function dedupeById(posts: IdeaxchangeListItem[]): IdeaxchangeListItem[] {
  const seen = new Set<string>();
  const out: IdeaxchangeListItem[] = [];
  for (const p of posts) {
    const id = p.id?.trim();
    if (!id || seen.has(id)) continue;
    seen.add(id);
    out.push(p);
  }
  return out;
}

const FEATURED_COUNT = 4;

function takeFeatured(pool: IdeaxchangeListItem[], count: number): IdeaxchangeListItem[] {
  const ids = new Set<string>();
  const out: IdeaxchangeListItem[] = [];
  const add = (p: IdeaxchangeListItem) => {
    const id = p.id?.trim();
    if (!id || ids.has(id) || out.length >= count) return;
    ids.add(id);
    out.push(p);
  };
  for (const p of pool) {
    if (out.length >= count) break;
    if (isIdeaxchangeFeatured(p)) add(p);
  }
  for (const p of pool) {
    if (out.length >= count) break;
    add(p);
  }
  return out;
}

function partitionPosts(posts: IdeaxchangeListItem[]) {
  const unique = dedupeById(posts);
  const hero = unique.slice(0, 3);
  let remaining = unique.slice(3);

  let spotlight: IdeaxchangeListItem | null = null;
  const spotlightIdx = remaining.findIndex((p) => p.ideaxchangeFields?.isSpotlight);
  if (spotlightIdx >= 0) {
    spotlight = remaining[spotlightIdx]!;
    remaining = remaining.filter((_, i) => i !== spotlightIdx);
  } else if (remaining.length > 0) {
    spotlight = remaining[0]!;
    remaining = remaining.slice(1);
  }

  const featured = takeFeatured(remaining, FEATURED_COUNT);
  const featuredIds = new Set(featured.map((p) => p.id).filter(Boolean) as string[]);
  remaining = remaining.filter((p) => !p.id || !featuredIds.has(p.id));

  return {
    hero,
    spotlight,
    featured,
    recentSidebar: remaining.slice(0, 4),
    newsroomRest: remaining.slice(4),
  };
}

function toCardItem(post: IdeaxchangeListItem): IdeaxchangeCardItem {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    date: post.date,
    excerpt: post.excerpt,
    badgeLabel: topicLabel(post),
    href: ideaxchangeHref(post.slug),
    featuredImage: post.featuredImage,
    isFeatured: isIdeaxchangeFeatured(post),
    isSpotlight: post.ideaxchangeFields?.isSpotlight === true,
  };
}

export function IdeaXchangeMagazinePage({ posts, listPageInfo, insightsAds }: Props) {
  const { hero, spotlight, featured, recentSidebar, newsroomRest } = partitionPosts(posts);

  return (
    <div className="bg-white">
      <h1 className="sr-only">ideaXchange Magazine</h1>

      <IdeaXchangeHeroGrid items={hero.map(toCardItem)} defaultBadge="MAGAZINE" />

      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)] py-10 md:py-14">
        <IdeaxchangeHorizontalAdSlot slot={insightsAds?.primaryHorizontal} />

        <IdeaXchangeFeaturedGrid
          items={featured.map(toCardItem)}
          heading="Featured articles"
          defaultBadge="MAGAZINE"
        />

        <IdeaXchangeLeaderboardCtaBanner className="mt-12 md:mt-16" />

        <IdeaxchangeHorizontalAdSlot
          slot={insightsAds?.secondaryHorizontal}
          className="mt-12 md:mt-16"
        />

        <div className="mt-12 grid grid-cols-1 gap-12 lg:mt-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-8">
            <IdeaXchangeNewsroomColumn
              initialPosts={newsroomRest.slice(0, INSIGHTS_NEWSROOM_INITIAL)}
              deferredBatchPosts={newsroomRest.slice(INSIGHTS_NEWSROOM_INITIAL)}
              initialHasNextPage={listPageInfo?.hasNextPage ?? false}
              initialEndCursor={listPageInfo?.endCursor ?? null}
            />
          </div>

          <aside className="lg:col-span-4">
            <IdeaXchangeMagazineSidebar
              spotlight={spotlight}
              recentSidebar={recentSidebar}
              insightsAds={insightsAds}
            />
          </aside>
        </div>
      </div>
    </div>
  );
}

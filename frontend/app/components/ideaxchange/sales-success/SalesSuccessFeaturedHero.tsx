import Image from "next/image";
import { Link } from "@/app/components/ui/Link";
import type { IdeaxchangeListItem } from "@/lib/ideaxchange-queries";
import { rewriteUploadsUrl } from "@/lib/wp-media";
import {
  formatBylineDate,
  formatInsightExcerptPlain,
  INSIGHT_IMG_QUALITY,
  resolveIdeaxchangeBadge,
} from "@/app/components/ideaxchange/magazine/ideaxchange-utils";
import { ideaxchangeFeaturedImageSrc } from "@/app/components/ideaxchange/shared/ideaxchange-card-types";
import { IDEAXCHANGE_SALES_SUCCESS_PATH } from "@/lib/ideaxchange-constants";
import { SALES_SUCCESS_BADGE_LABEL, salesSuccessHref } from "./sales-success-utils";

type Props = {
  post: IdeaxchangeListItem;
};

export function SalesSuccessFeaturedHero({ post }: Props) {
  const img = ideaxchangeFeaturedImageSrc(post.featuredImage?.node?.sourceUrl);
  const href = salesSuccessHref(post.slug);
  const excerpt = formatInsightExcerptPlain(post.excerpt);
  const badge = resolveIdeaxchangeBadge(post, {
    label: SALES_SUCCESS_BADGE_LABEL,
    href: IDEAXCHANGE_SALES_SUCCESS_PATH,
  });

  return (
    <section className="w-full">
      <Link
        href={href}
        variant="button"
        className="group relative block min-h-[52vh] w-full overflow-hidden md:min-h-[56vh]"
      >
        <Image
          src={rewriteUploadsUrl(img)}
          alt=""
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          sizes="100vw"
          quality={INSIGHT_IMG_QUALITY}
          priority
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10"
          aria-hidden
        />
        <div className="absolute inset-0 flex items-end">
          <div className="relative z-[1] w-full px-[var(--container-padding-x)] py-8 md:py-12">
            <div className="mx-auto max-w-[var(--container-max)]">
              <span className="relative z-[2] mb-3 inline-block bg-[var(--color-brand-primary)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                {badge.label}
              </span>
              <h2 className="max-w-4xl text-2xl font-bold leading-tight text-white drop-shadow-sm sm:text-3xl md:text-4xl">
                {post.title}
              </h2>
              {post.date ? (
                <p className="mt-3 text-sm text-white/90 md:text-base">
                  {formatBylineDate(post.date)}
                </p>
              ) : null}
              {excerpt ? (
                <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/85 md:text-base">
                  {excerpt}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
}

import Image from "next/image";
import { Link } from "@/app/components/ui/Link";
import { rewriteUploadsUrl } from "@/lib/wp-media";
import { formatMonthYear } from "@/app/components/ideaxchange/magazine/ideaxchange-utils";
import {
  IDEAXCHANGE_IMG_QUALITY,
  ideaxchangeFeaturedImageSrc,
  type IdeaxchangeCardItem,
} from "./ideaxchange-card-types";

type Props = {
  items: IdeaxchangeCardItem[];
  defaultBadge?: string;
};

const badgeClass =
  "relative z-[2] mb-2 inline-block w-fit max-w-full self-start bg-[var(--color-brand-primary)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white";

export function IdeaXchangeHeroGrid({ items, defaultBadge = "RECRUITING" }: Props) {
  if (items.length === 0) return null;

  return (
    <section className="grid min-h-[52vh] w-full grid-cols-1 md:grid-cols-3 md:min-h-[56vh]">
      {items.map((item, hi) => {
        const img = ideaxchangeFeaturedImageSrc(item.featuredImage?.node?.sourceUrl);
        const badge = item.badgeLabel?.trim() || defaultBadge;
        const badgeHref = item.badgeHref?.trim();
        return (
          <article
            key={item.id}
            className="group relative flex min-h-[280px] flex-col justify-end overflow-hidden md:min-h-0"
          >
            <Link
              href={item.href}
              variant="button"
              className="absolute inset-0 z-0"
              aria-label={item.title ?? "Read article"}
            >
              <Image
                src={rewriteUploadsUrl(img)}
                alt=""
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                sizes="(max-width:768px) 100vw, 33vw"
                quality={IDEAXCHANGE_IMG_QUALITY}
                priority={hi < 2}
              />
              <span
                className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent"
                aria-hidden
              />
            </Link>
            <div className="relative z-[1] flex flex-col p-5 pb-6 text-left md:p-6">
              {badgeHref ? (
                <Link href={badgeHref} variant="button" className={badgeClass}>
                  {badge}
                </Link>
              ) : (
                <span className={badgeClass}>{badge}</span>
              )}
              <Link href={item.href} variant="button" className="text-left hover:no-underline">
                <p className="mb-2 text-lg font-bold leading-snug text-white drop-shadow-sm md:text-xl">
                  {item.title}
                </p>
              </Link>
              {item.date ? (
                <p className="text-sm text-white/90">{formatMonthYear(item.date)}</p>
              ) : null}
            </div>
          </article>
        );
      })}
    </section>
  );
}

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
  heading?: string;
  defaultBadge?: string;
};

const badgeClass =
  "mb-2 inline-block w-fit bg-[var(--color-brand-primary)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white";

export function IdeaXchangeFeaturedGrid({
  items,
  heading = "Featured campaigns",
  defaultBadge = "RECRUITING",
}: Props) {
  if (items.length === 0) return null;

  return (
    <section className="mt-12 md:mt-16">
      <h2 className="mb-6 text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-brand-primary)] md:mb-8">
        {heading}
      </h2>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {items.map((item) => {
          const img = ideaxchangeFeaturedImageSrc(item.featuredImage?.node?.sourceUrl);
          const badge = item.badgeLabel?.trim() || defaultBadge;
          const badgeHref = item.badgeHref?.trim();

          return (
            <article key={item.id} className="group flex flex-col">
              <Link
                href={item.href}
                variant="button"
                className="relative mb-3 block aspect-[16/10] w-full overflow-hidden bg-[var(--color-border)]/40"
              >
                <Image
                  src={rewriteUploadsUrl(img)}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"
                  quality={IDEAXCHANGE_IMG_QUALITY}
                />
              </Link>
              {badgeHref ? (
                <Link href={badgeHref} variant="button" className={badgeClass}>
                  {badge}
                </Link>
              ) : (
                <span className={badgeClass}>{badge}</span>
              )}
              <Link href={item.href} variant="button" className="text-left hover:no-underline">
                <h3 className="text-base font-bold leading-snug text-[var(--color-fg)] transition-colors group-hover:text-[var(--color-brand-primary)]">
                  {item.title}
                </h3>
              </Link>
              {item.date ? (
                <p className="mt-2 text-sm text-[var(--color-muted)]">{formatMonthYear(item.date)}</p>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}

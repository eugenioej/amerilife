"use client";

import { useState } from "react";
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

function getVideoEmbedUrl(url: string): string {
  const trimmed = url.trim();

  if (trimmed.includes("player.vimeo.com/video/")) {
    return trimmed;
  }

  const vimeoMatch = trimmed.match(/vimeo\.com\/(\d+)/);

  if (vimeoMatch?.[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  return trimmed;
}

export function IdeaXchangeHeroGrid({ items, defaultBadge }: Props) {
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);

  if (items.length === 0) return null;

  return (
    <section className="grid min-h-[52vh] w-full grid-cols-1 md:grid-cols-3 md:min-h-[56vh]">
      {items.map((item, hi) => {
        const img = ideaxchangeFeaturedImageSrc(item.featuredImage?.node?.sourceUrl);
        const badge = item.badgeLabel?.trim() || defaultBadge?.trim() || "";
        const badgeHref = item.badgeHref?.trim();
        const popupVideoUrl = item.isPopup ? item.featuredVideoUrl?.trim() : "";
            
        return (
          <article
            key={item.id}
            className="group relative flex min-h-[280px] flex-col justify-end overflow-hidden md:min-h-0"
          >
            
            {popupVideoUrl ? (
              <button
                type="button"
                className="absolute inset-0 z-0 cursor-pointer"
                aria-label={`Watch video: ${item.title ?? "Featured case study"}`}
                onClick={() => setActiveVideoUrl(getVideoEmbedUrl(popupVideoUrl))}
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
              </button>
            ) : (
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
            )}


            <div className="relative z-[1] flex flex-col p-5 pb-6 text-left md:p-6">
              {badge ? (
                badgeHref ? (
                  <Link href={badgeHref} variant="button" className={badgeClass}>
                    {badge}
                  </Link>
                ) : (
                  <span className={badgeClass}>{badge}</span>
                )
              ) : null}
              
              {popupVideoUrl ? (
                <button
                  type="button"
                  className="text-left hover:no-underline"
                  onClick={() => setActiveVideoUrl(getVideoEmbedUrl(popupVideoUrl))}
                >
                  <p className="mb-2 text-lg font-bold leading-snug text-white drop-shadow-sm md:text-xl cursor-pointer">
                    {item.title}
                  </p>
                </button>
              ) : (
                <Link href={item.href} variant="button" className="text-left hover:no-underline">
                  <p className="mb-2 text-lg font-bold leading-snug text-white drop-shadow-sm md:text-xl">
                    {item.title}
                  </p>
                </Link>
              )}
              {item.date ? (
                <p className="text-sm text-white/90">{formatMonthYear(item.date)}</p>
              ) : null}
            </div>
          </article>
        );
      })}
      {activeVideoUrl ? (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 px-4 py-8"
          role="button"
          tabIndex={0}
          onClick={() => setActiveVideoUrl(null)}
          onKeyDown={(e) => {
            if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
              setActiveVideoUrl(null);
            }
          }}
        >
          <button
            type="button"
            className="absolute right-4 top-4 z-[10000] text-xl uppercase tracking-wide text-white hover:scale-110 cursor-pointer"
            onClick={() => setActiveVideoUrl(null)}
          >
            <span aria-hidden>✕</span>
          </button>

          <div className="w-full max-w-5xl relative z-[10000]">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black shadow-2xl">
              <iframe
                src={`${activeVideoUrl}?autoplay=1`}
                title="Featured video"
                className="absolute inset-0 h-full w-full"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

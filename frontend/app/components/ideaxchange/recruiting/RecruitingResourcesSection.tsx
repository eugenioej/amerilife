"use client";

import { useState } from "react";
import { Link } from "@/app/components/ui/Link";
import type { CaseStudyListItem } from "@/lib/ideaxchange-recruiting-queries";
import {
  caseStudyHref,
  cleanOverviewText,
} from "@/lib/ideaxchange-recruiting-utils";
import { Info } from "lucide-react";


type Props = {
  resources: CaseStudyListItem[];
};

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

export function RecruitingResourcesSection({
  resources,
}: Props) {
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);

  if (resources.length === 0) return null;

  return (
    <section className="mt-16">
      <div>
        <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-brand-primary)]">
          Resources
        </h2>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Additional recruiting resources and supporting materials.
        </p>
      </div>

      <div>
        {resources.map((resource, index) => {
            const fields = resource.ideaxchangeCaseStudyFields;
            const overview =
              cleanOverviewText(fields?.campaignOverview) ||
              cleanOverviewText(resource.excerpt);
                    
            const popupVideoUrl =
              fields?.isPopup && fields?.featuredVideoUrl
                ? fields.featuredVideoUrl.trim()
                : "";
              
            return (
            <div 
              key={index} 
              className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between py-6 border-b border-[var(--color-border)]"
            >
                <div className="flex items-center gap-2">
                  

                  {popupVideoUrl ? (
                    <button
                      type="button"
                      onClick={() => setActiveVideoUrl(getVideoEmbedUrl(popupVideoUrl))}
                      className="text-left font-semibold text-[var(--color-brand-primary)] cursor-pointer hover:text-[var(--color-brand-primary)]/70"
                    >
                      {resource.title}
                    </button>
                  ) : (
                    <Link
                      href={caseStudyHref(resource.slug)}
                      variant="button"
                      className="text-left font-semibold text-[var(--color-brand-primary)] hover:text-[var(--color-brand-primary)]/70"
                    >
                      {resource.title}
                    </Link>
                  )}
                  {overview ? (
                    <button
                      type="button"
                      title={overview}
                      aria-label={`Overview: ${resource.title}`}
                      className="mt-0.5 shrink-0 text-[var(--color-muted)] hover:text-[var(--color-brand-primary)] cursor-pointer"
                    >
                      <Info className="h-4 w-4" aria-hidden />
                    </button>
                  ) : null}
                </div>

                {popupVideoUrl ? (
                  <button
                    type="button"
                    onClick={() => setActiveVideoUrl(getVideoEmbedUrl(popupVideoUrl))}
                    className="inline-flex min-h-[44px] items-center justify-center rounded-sm bg-[var(--color-brand-primary)] px-6 text-sm font-bold uppercase tracking-wide text-white hover:bg-[var(--color-brand-primary-hover)] cursor-pointer"
                  >
                    View Resource
                  </button>
                ) : (
                  <Link
                    href={caseStudyHref(resource.slug)}
                    variant="button"
                    className="inline-flex min-h-[44px] items-center justify-center rounded-sm bg-[var(--color-brand-primary)] px-6 text-sm font-bold uppercase tracking-wide text-white hover:bg-[var(--color-brand-primary-hover)] cursor-pointer"
                  >
                      View Resource
                  </Link>
                )}
            </div>
        )}
        )}
      </div>
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

          <div 
            className="w-full max-w-5xl relative z-[10000]"
          >
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
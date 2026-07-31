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

export function RecruitingResourcesSection({
  resources,
}: Props) {
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
              
            return (
            <div 
              key={index} 
              className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between py-6 border-b border-[var(--color-border)]"
            >
                <div className="flex items-center gap-2">
                  <Link
                    href={caseStudyHref(resource.slug)}
                    variant="button"
                    className="text-left font-semibold text-[var(--color-brand-primary)] hover:underline"
                  >
                    {resource.title}
                  </Link>
                  {overview ? (
                    <button
                      type="button"
                      title={overview}
                      aria-label={`Overview: ${resource.title}`}
                      className="mt-0.5 shrink-0 text-[var(--color-muted)] hover:text-[var(--color-brand-primary)]"
                    >
                      <Info className="h-4 w-4" aria-hidden />
                    </button>
                  ) : null}
                </div>

                <Link
                  href={caseStudyHref(resource.slug)}
                  variant="button"
                  className="inline-flex min-h-[44px] items-center justify-center rounded-sm bg-[var(--color-brand-primary)] px-6 text-sm font-bold uppercase tracking-wide text-white hover:bg-[var(--color-brand-primary-hover)]"
                >
                    View Resource
                </Link>
            </div>
        )}
        )}
      </div>
    </section>
  );
}
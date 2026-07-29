import { Clock } from "lucide-react";
import { Link } from "@/app/components/ui/Link";
import { SiteBreadcrumb } from "@/app/components/layout/SiteBreadcrumb";
import { InsightPostChrome } from "@/app/components/insights/InsightPostChrome";
import type { CaseStudyDetail, CaseStudyListItem } from "@/lib/ideaxchange-recruiting-queries";
import { IDEAXCHANGE_HOME_PATH, IDEAXCHANGE_RECRUITING_HUB_PATH } from "@/lib/ideaxchange-constants";
import {
  caseStudyHref,
  companyHref,
  companyLabel,
} from "@/lib/ideaxchange-recruiting-utils";
import { rewriteUploadsInHtml } from "@/lib/wp-media";
import {
  formatBylineDate,
  formatInsightExcerptPlain,
} from "@/app/components/ideaxchange/magazine/ideaxchange-utils";
import { RunThisCampaignSidebar } from "./RunThisCampaignSidebar";

type Props = {
  post: CaseStudyDetail;
  relatedPosts: CaseStudyListItem[];
};

function estimateReadMinutes(html: string): number {
  const text = html.replace(/<[^>]+>/g, " ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function CaseStudyTemplate({ post, relatedPosts }: Props) {
  const html = post.content ? rewriteUploadsInHtml(post.content) : "";
  const excerptPlain = formatInsightExcerptPlain(post.excerpt);
  const company = post.caseStudyCompany;
  const companyName = company?.title?.trim() || "Recruiting";
  const companySlug = company?.slug?.trim();
  const readMin = estimateReadMinutes(html);
  const assets = post.ideaxchangeCaseStudyFields?.campaignAssets ?? [];
  const marketingCtaUrl = post.ideaxchangeCaseStudyFields?.marketingCtaUrl;

  const proseClasses =
    "ideaxchange-article-body max-w-none font-sans text-[var(--color-fg)] [&_h1]:font-sans [&_h2]:font-sans [&_h3]:font-sans [&_p]:mb-4 [&_p]:leading-relaxed [&_a]:text-[var(--color-link)] [&_a]:underline [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-base [&_h2]:font-bold [&_h2]:uppercase [&_h2]:tracking-wide [&_h2]:!text-[var(--color-brand-primary)]";

  return (
    <InsightPostChrome>
      <SiteBreadcrumb
        className="mb-6"
        items={[
          { label: "Home", href: "/" },
          { label: "ideaXchange", href: IDEAXCHANGE_HOME_PATH },
          { label: "Recruiting Hub", href: IDEAXCHANGE_RECRUITING_HUB_PATH },
          ...(companySlug
            ? [{ label: companyName, href: companyHref(companySlug) }]
            : []),
          {
            label: post.title ?? "Case study",
            className: "truncate text-[var(--color-muted)] sm:max-w-[28rem]",
          },
        ]}
      />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-8">
          <h1 className="max-w-4xl font-sans text-3xl font-bold leading-tight tracking-tight text-[var(--color-brand-dark)] sm:text-4xl">
            {post.title}
          </h1>

          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-[var(--color-border)] pb-8 text-sm text-[var(--color-muted)]">
            <span>
              By:{" "}
              {companySlug ? (
                <Link
                  href={companyHref(companySlug)}
                  className="font-semibold text-[var(--color-brand-primary)] hover:underline"
                >
                  {companyName}
                </Link>
              ) : (
                <span className="font-semibold">{companyName}</span>
              )}
            </span>
            {post.date ? (
              <>
                <span aria-hidden>·</span>
                <time dateTime={post.date}>{formatBylineDate(post.date)}</time>
              </>
            ) : null}
            <span aria-hidden>·</span>
            <span className="flex items-center gap-1.5">
              <Clock className="size-4 shrink-0" aria-hidden />
              {readMin} min read
            </span>
          </div>

          {html ? (
            <div
              className={`${proseClasses} mt-10`}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          ) : null}

          {relatedPosts.length > 0 ? (
            <section className="mt-14 border-t border-[var(--color-border)] pt-10">
              <h2 className="mb-6 text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-brand-primary)]">
                More campaigns
              </h2>
              <ul className="grid gap-6 sm:grid-cols-2">
                {relatedPosts.slice(0, 4).map((item) => (
                  <li key={item.id}>
                    <Link
                      href={caseStudyHref(item.slug)}
                      variant="button"
                      className="text-left text-base font-bold text-[var(--color-fg)] hover:text-[var(--color-brand-primary)]"
                    >
                      {item.title}
                    </Link>
                    <p className="mt-1 text-xs uppercase tracking-wide text-[var(--color-muted)]">
                      {companyLabel(item)}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>

        <div className="lg:col-span-4">
          <RunThisCampaignSidebar assets={assets} marketingCtaUrl={marketingCtaUrl} />
        </div>
      </div>
    </InsightPostChrome>
  );
}

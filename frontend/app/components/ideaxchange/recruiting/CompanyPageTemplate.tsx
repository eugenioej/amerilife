import Image from "next/image";
import { Link } from "@/app/components/ui/Link";
import { SiteBreadcrumb } from "@/app/components/layout/SiteBreadcrumb";
import type { IdeaxchangeCompanySummary } from "@/lib/ideaxchange-recruiting-queries";
import { IDEAXCHANGE_HOME_PATH, IDEAXCHANGE_RECRUITING_HUB_PATH } from "@/lib/ideaxchange-constants";
import { rewriteUploadsInHtml, rewriteUploadsUrl } from "@/lib/wp-media";
import { ideaxchangeFeaturedImageSrc } from "@/app/components/ideaxchange/shared/ideaxchange-card-types";
import { formatInsightExcerptPlain, INSIGHT_IMG_QUALITY } from "@/app/components/ideaxchange/magazine/ideaxchange-utils";

type Props = {
  company: IdeaxchangeCompanySummary;
};

export function CompanyPageTemplate({ company }: Props) {
  const logo = ideaxchangeFeaturedImageSrc(company.featuredImage?.node?.sourceUrl);
  const fields = company.ideaxchangeCompanyFields;
  const website = fields?.websiteUrl?.trim();
  const learnMore = fields?.learnMoreUrl?.trim() || website;
  const html = company.content ? rewriteUploadsInHtml(company.content) : "";
  const excerpt = formatInsightExcerptPlain(company.excerpt);

  return (
    <div className="bg-white pb-16 md:pb-20">
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)] pt-8 md:pt-10">
        <SiteBreadcrumb
          className="mb-8"
          items={[
            { label: "Home", href: "/" },
            { label: "ideaXchange", href: IDEAXCHANGE_HOME_PATH },
            { label: "Recruiting Hub", href: IDEAXCHANGE_RECRUITING_HUB_PATH },
            { label: company.title ?? "Company", className: "truncate" },
          ]}
        />

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start lg:gap-14">
          <div className="lg:col-span-5">
            <div className="flex aspect-square max-w-md items-center justify-center rounded-2xl bg-[var(--color-brand-dark)] p-10 lg:max-w-none">
              <div className="relative h-full w-full min-h-[200px]">
                <Image
                  src={rewriteUploadsUrl(logo)}
                  alt=""
                  fill
                  className="object-contain"
                  sizes="(max-width:1024px) 80vw, 40vw"
                  quality={INSIGHT_IMG_QUALITY}
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <h1 className="font-sans text-4xl font-bold tracking-tight text-[var(--color-brand-dark)] md:text-5xl">
              {company.title}
            </h1>

            {website ? (
              <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-lg font-medium text-[var(--color-brand-primary)] hover:underline"
              >
                {website.replace(/^https?:\/\//, "")}
              </a>
            ) : null}

            {html ? (
              <div
                className="prose prose-sm mt-6 max-w-2xl text-[var(--color-muted)] [&_p]:mb-4"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            ) : null}

            {learnMore ? (
              learnMore.startsWith("http") ? (
                <a
                  href={learnMore}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex min-h-[48px] items-center justify-center rounded-sm bg-[var(--color-brand-primary)] px-10 text-sm font-bold uppercase tracking-wide text-white hover:bg-[var(--color-brand-primary-hover)]"
                >
                  Learn more
                </a>
              ) : (
                <Link
                  href={learnMore}
                  variant="button"
                  className="mt-8 inline-flex min-h-[48px] items-center justify-center rounded-sm bg-[var(--color-brand-primary)] px-10 text-sm font-bold uppercase tracking-wide text-white hover:bg-[var(--color-brand-primary-hover)]"
                >
                  Learn more
                </Link>
              )
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

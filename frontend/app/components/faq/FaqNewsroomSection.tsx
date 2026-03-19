import Link from "next/link";

const NEWSROOM_ARTICLES = [
  {
    title:
      "Brian Krantz and Plan Medicare Partner with AmeriLife to Expand White-Glove Medicare Support for Financial Advisors Nationwide",
    excerpt:
      "Industry veteran and respected licensed health insurance producer joins one of the nation's largest FMOs to scale an advisor-first Medicare service model for wealth management firms and their clients NEW YORK and CLEARWATER, Fla. – January 20, 2026 – AmeriLife Group,...",
    href: "/newsroom/",
  },
  {
    title: "Todd Buchanan Named President of AmeriLife Wealth",
    excerpt:
      "Industry veteran brings nearly three decades of experience to lead AmeriLife's expanding Wealth Distribution platform CLEARWATER, Fla. – January 14, 2026 – AmeriLife Group, LLC (\"AmeriLife\"), a national leader in developing, marketing, and distributing life and health...",
    href: "/newsroom/",
  },
  {
    title:
      "American Alliance Marketing Group and AmeriLife's Pinnacle Financial Services Form Strategic Alliance",
    excerpt:
      "Partnership enables an expansive health distribution network and resources with specialized expertise in the Medicare and senior health insurance market CLEARWATER, Fla. – December 18, 2025 - Pinnacle Financial Services, one of the nation's leading full-service...",
    href: "/newsroom/",
  },
  {
    title:
      "Tyler Insurance Group and AmeriLife's Pinnacle Financial Services Announces Partnership to Scale Mission and Serve More Families",
    excerpt:
      "Alliance empowers family-run brokerage to accelerate its growth while continuing its legacy of care and advocacy CLEARWATER, Fla. – December 10, 2025 – AmeriLife Group, LLC (\"AmeriLife\"), a national leader in life and health insurance distribution, wealth management,...",
    href: "/newsroom/",
  },
  {
    title: "AmeriLife Names Sulabh Srivastava Chief Information Officer",
    excerpt:
      "Newly created role to accelerate AmeriLife's digital transformation and enhance technology integration across the company's expansive affiliate network CLEARWATER, Fla., December 1, 2025 - AmeriLife Group, LLC (\"AmeriLife\"), a national leader in life and health...",
    href: "/newsroom/",
  },
  {
    title: "To Revive The Soul Of Your Business, Reverse The Erosion Of Intent",
    excerpt: "",
    href: "/newsroom/",
  },
  {
    title: "AmeriLife Recognized as a 2025 Inc. Power Partner Award Winner for the Third Consecutive Year",
    excerpt:
      "The annual list recognizes the leading B2B companies that have proven track records of supporting entrepreneurs and helping companies grow CLEARWATER, Fla. – November 13, 2025 – AmeriLife, a national leader in life and health insurance distribution, wealth...",
    href: "/newsroom/",
  },
  {
    title: "What Really Fuels Growth? Rethinking Producer Productivity",
    excerpt: "",
    href: "/newsroom/",
  },
  {
    title: "How Servant Leadership Can Drive Collective Achievement",
    excerpt: "",
    href: "/newsroom/",
  },
  {
    title: "Why Your Sales Funnel Is Leaking (And 5 Ways To Fix It)",
    excerpt: "",
    href: "/newsroom/",
  },
];

export function FaqNewsroomSection() {
  return (
    <div className="space-y-8">
      {NEWSROOM_ARTICLES.map((article, index) => (
        <article key={index} className="border-b border-[var(--color-border)] pb-8 last:border-0 last:pb-0">
          <Link
            href={article.href}
            className="block group"
          >
            <h2 className="mb-2 text-xl font-semibold text-[var(--color-fg)] transition-colors group-hover:text-[var(--color-brand-primary)]">
              {article.title}
            </h2>
            {article.excerpt && (
              <p className="text-base leading-relaxed text-[var(--color-muted)]">
                {article.excerpt}
              </p>
            )}
          </Link>
        </article>
      ))}
    </div>
  );
}

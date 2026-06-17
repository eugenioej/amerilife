import { rewriteUploadsUrl } from "@/lib/wp-media";
import { Link } from "../ui/Link";

const BANNER_10 = "https://headlessameril.wpenginepowered.com/wp-content/uploads/2021/12/banner-10.png";

export function ContributorBecomeOne() {
  return (
      <div
        className="relative min-h-[320px] w-full overflow-hidden bg-cover bg-center py-16 lg:py-20"
        style={{ backgroundImage: `url(${rewriteUploadsUrl(BANNER_10)})` }}
      >
        <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-4 text-2xl font-bold text-white sm:text-4xl tracking-wide">
              WANT TO BECOME A CONTRIBUTOR?
            </h2>

            <p className="mb-6 text-base leading-relaxed text-white">
              You&apos;ve built real expertise in your field, and AmeriLife Insights is the place to put it to work. We&apos;re actively seeking subject matter expert contributors across insurance, retirement planning, and financial wellness to help educate and empower our audience. Submit your pitch and let&apos;s get your insights in front of the readers who need them most.
            </p>

            <p className="text-base leading-relaxed text-white">
              Thought leadership is a powerful content marketing tool for building awareness and influence. The AmeriLife Insights editorial team will help you write persuasive, educational, and thought-provoking articles that fit your goals, share your experience, and position you as an industry-leading subject matter expert.
            </p>

            <Link
              href="/contact"
              variant="button"
              className="motion-cta mt-10 inline-flex w-fit items-center gap-2 rounded-[var(--radius-full)] bg-[var(--color-brand-primary)] px-6 py-3 text-sm font-bold uppercase tracking-[var(--tracking-normal)] text-white transition-colors hover:bg-[var(--color-brand-primary-hover)]"
            >
              CONTACT US
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
      </div>
    );
}
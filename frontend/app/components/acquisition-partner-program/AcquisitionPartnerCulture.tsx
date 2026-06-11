import { Link } from "@/app/components/ui/Link";
import { CULTURE_VIDEOS } from "./constants";

export function AcquisitionPartnerCulture() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
        <p className="mx-auto mb-12 max-w-4xl text-center text-base leading-relaxed text-[var(--color-fg)]">
          Core values and culture are critical to us when considering a partnership. Take a look
          below at what AmeriLife does in the community, and for our employees, to demonstrate our
          commitment to improving the lives of our clients, employees and our affiliate partners.
        </p>
        <div className="grid gap-10 lg:grid-cols-2">
          {CULTURE_VIDEOS.map((video) => (
            <div key={video.title}>
              <h3 className="mb-4 text-xl font-bold text-[var(--color-fg)]">{video.title}</h3>
              <div className="relative aspect-video w-full overflow-hidden bg-[var(--color-brand-dark)]">
                <iframe
                  src={video.embedSrc}
                  title={video.iframeTitle}
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                  className="absolute inset-0 h-full w-full border-0"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/givesback/"
            className="text-[var(--color-link)] underline-offset-4 hover:text-[var(--color-link-hover)] hover:underline"
          >
            Learn more about AmeriLife Gives Back
          </Link>
        </div>
      </div>
    </section>
  );
}

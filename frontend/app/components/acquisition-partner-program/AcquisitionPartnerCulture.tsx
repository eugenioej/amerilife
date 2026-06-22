import { Link } from "@/app/components/ui/Link";
import { CULTURE_VIDEOS } from "./constants";
import { Star } from "lucide-react";

export function AcquisitionPartnerCulture() {

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
        <div className="flex justify-center">
          <Star className="w-8 h-8 text-[var(--color-brand-primary)] fill-[var(--color-brand-primary)] mb-2" />
        </div>
        <p className="mx-auto mb-12 max-w-4xl text-center text-base leading-relaxed text-[var(--color-fg)]">
          Core values and culture are critical to us when considering a partnership. Take a look
          below at what AmeriLife does in the community, and for our employees, to demonstrate our
          commitment to improving the lives of our clients, employees and our affiliate partners.
        </p>
        <div className="grid gap-10 lg:grid-cols-2">
          {CULTURE_VIDEOS.map((video, index) => (
            <div className="text-center" key={video.title}>
              <h3 className="mb-4 text-xl font-bold text-[var(--color-brand-primary)]">
                {index === 1 ? (
                  <Link
                    href="/givesback/"
                  >
                    {video.title}
                  </Link>
                ) : (
                  video.title
                )}
              </h3>
              
              <div className="relative aspect-video w-full overflow-hidden bg-[var(--color-brand-dark)] shadow-xl">
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
      </div>
    </section>
  );
}

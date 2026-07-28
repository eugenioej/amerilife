import Image from "next/image";
import { Link } from "@/app/components/ui/Link";
import type { CarrierListItem } from "@/lib/ideaxchange-carrier-queries";
import { carrierBrandColor, carrierHref } from "@/lib/ideaxchange-carrier-utils";
import { rewriteUploadsUrl } from "@/lib/wp-media";
import {
  IDEAXCHANGE_IMG_QUALITY,
  ideaxchangeFeaturedImageSrc,
} from "@/app/components/ideaxchange/shared/ideaxchange-card-types";

type Props = {
  carriers: CarrierListItem[];
};

export function CarrierSpotlightAdditionalGrid({ carriers }: Props) {
  if (carriers.length === 0) return null;

  return (
    <section className="mt-12 md:mt-16">
      <h2 className="mb-6 text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-brand-primary)] md:mb-8">
        Additional carrier spotlights
      </h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5">
        {carriers.map((carrier) => {
          const bg = carrierBrandColor(carrier);
          const logo = ideaxchangeFeaturedImageSrc(carrier.featuredImage?.node?.sourceUrl);
          return (
            <Link
              key={carrier.id}
              href={carrierHref(carrier.slug)}
              variant="button"
              className="group relative flex aspect-square items-center justify-center overflow-hidden p-6"
              style={{ backgroundColor: bg }}
            >
              <div className="relative h-full w-full">
                <Image
                  src={rewriteUploadsUrl(logo)}
                  alt=""
                  fill
                  className="object-contain transition-transform duration-300 group-hover:scale-[1.04]"
                  sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
                  quality={IDEAXCHANGE_IMG_QUALITY}
                />
              </div>
              <span className="sr-only">{carrier.title}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

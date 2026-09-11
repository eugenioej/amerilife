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

export function CarrierSpotlightHeroGrid({ carriers }: Props) {
  if (carriers.length === 0) return null;

  return (
    <section className="grid w-full grid-cols-1 md:grid-cols-3 md:min-h-[56vh]">
      {carriers.map((carrier, hi) => {
        const bg = carrierBrandColor(carrier);
        const logo = ideaxchangeFeaturedImageSrc(carrier.featuredImage?.node?.sourceUrl);
        const slug = carrier.slug ?? "";
        return (
          <Link
            key={carrier.id}
            href={carrierHref(slug)}
            variant="button"
            className="group relative flex min-h-[280px] flex-col items-center justify-center overflow-hidden md:min-h-[56vh]"
            style={{ backgroundColor: bg }}
          >
            <div className="relative flex h-44 w-72 items-center justify-center px-4 md:h-56 md:w-[420px]">
              <Image
                src={rewriteUploadsUrl(logo)}
                alt=""
                fill
                className="object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                sizes="(max-width:768px) 80vw, 33vw"
                quality={IDEAXCHANGE_IMG_QUALITY}
                priority={hi < 2}
              />
            </div>
          </Link>
        );
      })}
    </section>
  );
}

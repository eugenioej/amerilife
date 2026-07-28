import Image from "next/image";
import { rewriteUploadsUrl } from "@/lib/wp-media";

const COMPASS_BG =
  "https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/07/Kickoff26-MapCompassGraphic-100925-CG.png";

interface Props {
  title: string;
}

export function KickoffSectionBanner({ title }: Props) {
  return (
    <div className="relative mx-auto mb-10 h-[150px] overflow-hidden">
      <Image
        src={rewriteUploadsUrl(COMPASS_BG)}
        alt=""
        fill
        className="object-cover"
      />

      <div className="absolute inset-0 flex items-center justify-center">
        <h2 className="text-2xl font-medium uppercase tracking-wide text-black md:text-5xl">
          {title}
        </h2>
      </div>
    </div>
  );
}
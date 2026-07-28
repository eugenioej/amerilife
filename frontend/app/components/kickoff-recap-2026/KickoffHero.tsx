import Image from "next/image";
import { rewriteUploadsUrl } from "@/lib/wp-media";

const HERO_BG =
  "https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/07/Kickoff2026-Poster-BACKGROUND-011025-CG.png";

const HERO_LOGO =
  "https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/07/EXPEDITION-Kickoff2026-Logo-Black-010225-CG-e1768323733649.png";

export function KickoffHero() {
  return (
    <section className="relative h-[600px] overflow-hidden">
      <Image
        src={rewriteUploadsUrl(HERO_BG)}
        alt=""
        fill
        priority
        className="object-cover"
      />

      <div className="absolute inset-0 flex items-center justify-center py-6">
        <Image
          src={rewriteUploadsUrl(HERO_LOGO)}
          alt="Expedition Kickoff 2026"
          width={1080}
          height={250}
          className="h-auto w-full max-w-[1080px]"
          priority
        />
      </div>
    </section>
  );
}

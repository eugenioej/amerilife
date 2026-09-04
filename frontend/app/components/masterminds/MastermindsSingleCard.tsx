

import Image from "next/image";
import Link from "next/link";

/* ========================================
   CONSTANTS
======================================== */
const UPLOADS =
  "https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/05";

const IMAGES = {
  wordmark: `${UPLOADS}/Masterminds26-Wordmark-White-Shaded-031026-CG.png`,
  icon: `${UPLOADS}/Masterminds26-Icon-Green-031026-CG.png`,
  footerBg: `${UPLOADS}/AdobeStock_1515066628.png`,
  footerLogo: `${UPLOADS}/Masterminds26-Logo-White-031026-CG.png`,
  amerilife:
    "https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/04/AmeriLife-Logo-white-s.webp",
};
type MastermindsSingleCardsProps = {
    eventOne: string;
    eventOnedesc: string;

};
/* ========================================
   PAGE
======================================== */
export default function Page({eventOne, eventOnedesc}: MastermindsSingleCardsProps) {
  return (
    <div className="mx-auto max-w-[900px] pb-40 px-5 sm:px-6">

        <div className="grid grid-cols-1 max-w-md mx-auto">

          {/* A&RI */}
          <Link
  href="/masterminds/a-ri"
  className="group rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-white transition hover:bg-white/10 hover:border-[#03f080]/40 hover:scale-[1.02]"
>
  {/* ICON ABOVE */}
  <div className="mb-4 flex justify-center">
    <Image
      src={IMAGES.icon}
      alt=""
      width={40}
      height={40}
      className="transition group-hover:scale-110 w-10 h-10"
    />
  </div>

  <h2 className="text-xl font-semibold mb-3">
    {eventOne}
  </h2>

  <p className="text-sm text-white/70 leading-relaxed">
    {eventOnedesc}
  </p>

  <span className="inline-block mt-6 text-sm font-semibold text-[#03f080]">
    View Agenda →
  </span>
</Link>


         

        </div>

      </div>
    
  );
}



"use client";

import MastermindsAgendaHeader from "@/app/components/masterminds/MastermindsAgendaHeader";
import MastermindsCards from "@/app/components/masterminds/MastermindsCards";
import MastermindsFooter from "@/app/components/masterminds/MastermindsFooter";
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

/* ========================================
   PAGE
======================================== */
export default function Page() {
  return (
    <div className="masterminds-page bg-[#091229] min-h-screen">
      <MastermindsAgendaHeader 
      selector="Agenda" note="Please choose your track below to view your personalized Masterminds agenda."/>
      <MastermindsCards 
      eventOne="A&amp;RI Agenda" 
      eventOnedesc="View the Accumulation &amp; Retirement Income agenda." 
      eventTwo="Health Agenda" 
      eventTwodesc="View the Health track agenda."/>
      {/* Optional — remove if you don't want footer */}
      <MastermindsFooter/>
    </div>
  );
}



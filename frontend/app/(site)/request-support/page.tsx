import Image from "next/image";
import Link from "next/link";
import Script from "next/script";

/* ========================================
   CONSTANTS
======================================== */
const UPLOADS =
  "https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/05";

const IMAGES = {
  
  amerilife:
    "https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/04/AmeriLife-Logo-white-s.webp",
  blueamerilife:
  "https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/07/PNG-Logo-AmeriLife-Logo-BLUE-1.png",
};

/* ========================================
   PAGE
======================================== */
export default function Page() {
  return (
    <div className="masterminds-page">
      <HeroSection />
      <AgendaSection />
      <FooterSection />
    </div>
  );
}

/* ========================================
   HERO
======================================== */
function HeroSection() {
  return (
    <section className="sticky top-0 z-50 bg-[#FFFFFF] flex justify-center">
        <div className="justify-between w-[70%] flex  p-6 sm:p-8 lg:p-12">
            <BlueAmeriLifeLogo />
          </div>
      
    </section>
  );
}

/* ========================================
   AGENDA
======================================== */
function AgendaSection() {
  return (
    <section className="bg-[#FFFFFF] flex justify-center py-14 sm:p-20 " id="agenda">
      {/* Agenda Content */}
      <div className="flex justify-between w-[70%]">
        <div className="w-[45%] mt-[40px]">
            <h3 className="leading-[44px] text-[#40A590] text-[25px]">We're Here to Help!</h3>
            <h1 className="leading-[54px] text-[40px]">REQUEST SUPPORT</h1>
            <p className="text-[18px]">Complete the form and we will be in touch if we have any questions. </p>
            <p className="mt-[10px] text-[18px] text-[#40A590]">IMPORTANT: Any requests received after 3:00 pm will be processed on the following business day.</p>
        </div>
        <div className=" w-[50%] bg-[#c6c8ca]">
                <Script
                    src="https://js.hsforms.net/forms/embed/23344415.js"
                    strategy="afterInteractive"
                  />
                <div className="hs-form-frame" data-region="na1" data-form-id="2f4fbd59-3188-4a80-beed-d2d69a147b74" data-portal-id="23344415"></div>
        </div>
      </div>
    </section>
  );
}

/* ========================================
   FOOTER
======================================== */
function FooterSection() {
  return (
    <section className="relative overflow-hidden bg-[#244260] pt-10 pb-16 sm:pb-32 text-white">
      {/* Footer Content */}
      <div className="justify-between  flex  p-8 sm:p-18 lg:p-26">
            <AmeriLifeLogo />
            <div>
                <p>AmeriLife ©2026 All rights reserved. For Agent Use Only.</p>
               
                <span className="text-[#40A590]"><Link href="/privacy">Privacy</Link> . <Link href="/terms">Terms and Conditions</Link></span>
            </div>
        </div>
      <div>
        <span className="flex justify-center text-[#40A590]"><Link href="https://share.hsforms.com/1IP0WmS3AS8GpLurK4fuixAdwcnz">Internal Creative Request</Link> | <Link href="https://share.hsforms.com/15RNYwmMYR0eeJbvxHWPacAdwcnz">AL Career Only Request</Link> | <Link href="https://share.hsforms.com/1yYT8FJrITVWbh3lrHu9S5Qdwcnz">IT Domain Acquisition</Link></span>
      </div>
    </section>
  );
}

/* ========================================
   AMERILIFE LOGO
======================================== */
function AmeriLifeLogo() {
  return (
    <div className="pt-6 sm:pt-10">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={IMAGES.amerilife}
        alt="AmeriLife"
        className="mx-auto w-[150px] sm:w-[200px] h-auto opacity-80"
      />
    </div>
  );
}

/* ========================================
   Blue AMERILIFE LOGO
======================================== */
function BlueAmeriLifeLogo() {
  return (
    <div className="pt-6 sm:pt-10">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={IMAGES.blueamerilife}
        alt="AmeriLife"
        className="mx-auto w-[150px] sm:w-[200px] h-auto opacity-80"
      />
    </div>
  );
}
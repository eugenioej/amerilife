import Image from "next/image";

const UPLOADS =
  "https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/05";

// ✅ Assets
const HERO_IMAGE = `${UPLOADS}/stefano-bucciarelli-59HOF9zHKNs-unsplash.jpg`;
const WORDMARK = `${UPLOADS}/Masterminds26-Wordmark-White-Shaded-031026-CG.png`;
const SCROLL_ICON = `${UPLOADS}/Masterminds26-Icon-Green-031026-CG.png`;

export default function Page() {
  return (
    <div className="masterminds-page">
      
      {/* ================= HERO ================= */}
      <section className="relative flex min-h-screen items-center overflow-hidden bg-[#091229] text-white">

        {/* Background */}
        <div className="absolute inset-0">
          <Image
            src={HERO_IMAGE}
            alt=""
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-[#091229]" />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#091229]/95 via-[#091229]/80 to-[#091229]/95" />
        <div className="absolute bottom-0 left-0 right-0 h-40 backdrop-blur-[2px] bg-gradient-to-b from-transparent via-[#091229]/50 to-[#091229]" />

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-[820px] px-6 text-center">

          {/* ✅ WIDER WORDMARK */}
          <div className="mx-auto mb-6 w-[300px] sm:w-[380px] lg:w-[340px]">
            <Image
              src={WORDMARK}
              alt="Masterminds"
              width={420}
              height={120}
              className="w-full h-auto"
            />
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold sm:text-5xl">
            Masterminds <span className="text-[#03f080]">Agenda</span>
          </h1>

          {/* Date + Location */}
          <p className="mt-4 inline-block rounded-full border border-[#03f080]/40 bg-[#03f080]/10 px-8 py-2 text-sm font-semibold tracking-wide text-white">
  June 15 – 17, 2026 • Grand Hyatt Tampa Bay, FL
            </p>

          {/* Description */}
          <p className="mx-auto mt-5 max-w-[600px] text-sm leading-relaxed text-white/85">
            Scan the QR codes below for detailed agendas by track. Business casual attire is recommended for meetings, and resort casual for group dinners. Unless otherwise noted, group functions combine the Health and A&amp;RI distributions. The agenda may change.
          </p>

        </div>

        {/* Scroll cue */}
        <a
          href="#agenda"
          className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center text-[#03f080]"
        >
          <div className="mb-2 animate-[pulse_2.5s_infinite] drop-shadow-[0_0_16px_rgba(3,240,128,0.8)]">
            <Image
              src={SCROLL_ICON}
              alt="Scroll to agenda"
              width={44}
              height={44}
            />
          </div>

          <span className="text-xs tracking-wider">VIEW AGENDA</span>
        </a>
      </section>

      {/* ================= AGENDA ================= */}
<section id="agenda" className="bg-[#091229] py-24">

  <div className="mx-auto max-w-[1000px] px-6">

    {/* ✅ CARD */}
    <div className="rounded-2xl bg-[#f0fdf4] px-6 py-10 sm:px-18 shadow-xl">

      {/* ✅ HEADER */}
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold text-[#091229]">
          Event Schedule
        </h2>

        <p className="mt-3 text-sm text-gray-500">
          June 15 – 17, 2026 • Grand Hyatt Tampa Bay, FL
        </p>
      </div>

      {/* ✅ DAYS */}
      <div className="space-y-12">

        {/* MONDAY */}
        <div className="border-l-4 border-[#03f080] pl-6">
          <h3 className="mb-4 text-xl font-semibold text-[#091229]">
            Monday, June 15, 2026
          </h3>

          <ul className="space-y-2 text-gray-700">
            <li><strong>12:30 PM:</strong> Conference Check-in Begins</li>
            <li><strong>1:00 PM – 4:00 PM:</strong> A&amp;RI General Session, Audubon Ballroom</li>
            <li><strong>6:00 PM – 8:00 PM:</strong> Group Dinner, Oystercatchers</li>
          </ul>

          <p className="mt-3 text-xs text-gray-500">
            Please note that this location is a 10-minute walk from the hotel.
            Hotel shuttles are available upon request.
          </p>
        </div>

        {/* TUESDAY */}
        <div className="border-l-4 border-[#03f080] pl-6">
          <h3 className="mb-4 text-xl font-semibold text-[#091229]">
            Tuesday, June 16, 2026
          </h3>

          <ul className="space-y-2 text-gray-700">
            <li><strong>8:00 AM – 9:00 AM:</strong> Group Breakfast &amp; Networking</li>
            <li><strong>9:00 AM – 11:30 AM:</strong> General Sessions</li>

            <li className="pl-4 text-gray-600">Health: Audubon Ballroom</li>
            <li className="pl-4 text-gray-600">A&amp;RI: White Ibis</li>

            <li><strong>11:30 AM – 12:30 PM:</strong> Group Lunch</li>
            <li><strong>12:30 PM – 4:30 PM:</strong> General Sessions</li>

            <li className="pl-4 text-gray-600">Health: Audubon Ballroom</li>
            <li className="pl-4 text-gray-600">A&amp;RI: White Ibis</li>

            <li><strong>6:00 PM – 8:00 PM:</strong> Offsite Dinners</li>
          </ul>
        </div>

        {/* WEDNESDAY */}
        <div className="border-l-4 border-[#03f080] pl-6">
          <h3 className="mb-4 text-xl font-semibold text-[#091229]">
            Wednesday, June 17, 2026
          </h3>

          <ul className="space-y-2 text-gray-700">
            <li><strong>8:00 AM – 9:00 AM:</strong> Group Breakfast</li>
            <li><strong>9:00 AM – 12:00 PM:</strong> General Sessions</li>

            <li className="pl-4 text-gray-600">Health: Audubon Ballroom</li>
            <li className="pl-4 text-gray-600">A&amp;RI: White Ibis</li>

            <li><strong>12:00 PM – 12:30 PM:</strong> Grab ‘n’ Go Lunches</li>
          </ul>
        </div>

      </div>
    </div>

  </div>
</section>

      {/* ================= CONTACT ================= */}
      <section className="bg-[#d2fad6] py-20">
        <div className="mx-auto max-w-[900px] space-y-6 px-6 text-center text-[#091229]">

          <h2 className="text-2xl font-bold">
            AmeriLife On-Site Contacts
          </h2>

          <div className="space-y-2 text-sm">
            <p>Megan Hill • Hotel • (727) 505-5133</p>
            <p>Amanda Spadafora • Hotel • (727) 366-6092</p>
            <p>Taylor Perko • All Other Inquiries • (727) 403-9295</p>
          </div>

          <div className="pt-6">
            <p className="font-semibold">Air Transfers</p>
            <p className="text-sm">
              Kris Gudenrath, EPIC Travel Partners<br />
              (480) 209-1863 • KrisG@EpicIntl.net
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}
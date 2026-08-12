"use client";


import MastermindsHeader from "@/app/components/masterminds/MastermindsHeader";
import MastermindsAgenda from "@/app/components/masterminds/MastermindsAgenda";
import MastermindsFooter from "@/app/components/masterminds/MastermindsFooter";

/* ========================================
   CONSTANTS
======================================== */
const UPLOADS =
  "https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/05";

const IMAGES = {
  wordmark: `${UPLOADS}/Masterminds26-Wordmark-White-Shaded-031026-CG.png`,
  footerBg: `${UPLOADS}/AdobeStock_1515066628.png`,
  footerLogo: `${UPLOADS}/Masterminds26-Logo-White-031026-CG.png`,
  qrCode: `${UPLOADS}/MASTERMINDS_Digital_Agenda_Page-scaled.png`,
  
amerilife:
  "https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/04/AmeriLife-Logo-white-s.webp",

};
const AgendaDays = [
  {
    title: "Tuesday, September 15, 2026",
    items: [
      {
        text: "Arrivals - please utilize Ubers/Lyft",
      },
      {
        text: "1:30 PM – 4:00 PM: General Session, St. Petersburg Ballroom I & II",
        children: [
          {
            text: "1:30 PM – 2:00 PM: Welcome",
            children: [
              {
                text:
                  "Speakers: Brian Peterson, Brian Kunkel, and Steve Cooney",
              },
            ],
          },
          {
            text: "2:00 PM – 4:00 PM: Best Practices Roundtable",
          },
        ],
      },
      {
        text: "6:00 PM – 8:00 PM: Group Dinner",
      },
    ],
  },

  {
    title: "Wednesday, September 16, 2026",
    items: [
      {
        text:
          "8:00 AM – 8:30 AM: Group Breakfast, St. Petersburg Ballroom III",
      },
      {
        text:
          "8:30 AM – 12:00 PM: General Session, St. Petersburg Ballroom I & II",
        children: [
          {
            text: "8:30 AM – 8:45 AM: Day 1 Recap",
            children: [
              {
                text: "Speaker: Brian Peterson",
              },
            ],
          },
          {
            text:
              "8:45 AM – 9:45 AM: Fueling Financial Professional Growth Panel",
          },
          {
            text: "9:45 AM – 10:00 AM: Break",
          },
          {
            text: "10:00 AM – 12:00 PM: Carrier Speed Dating",
          },
        ],
      },
      {
        text:
          "12:00 PM – 12:45 PM: Group Lunch, St. Petersburg Ballroom III",
      },
      {
        text:
          "12:45 PM – 4:00 PM: General Session, St. Petersburg Ballroom I & II",
        children: [
          {
            text: "12:45 PM – 2:15 PM: Carrier Speed Dating",
          },
          {
            text: "2:15 PM – 2:30 PM: Break",
          },
          {
            text: "2:30 PM – 4:00 PM: Wholesaler Showdown",
            children: [
              {
                text: "Speaker: Brian Kunkel",
              },
            ],
          },
        ],
      },
      {
        text: "5:30 PM – 9:00 PM: Group Dinner",
      },
    ],
  },

  {
    title: "Thursday, September 17, 2026",
    items: [
      {
        text:
          "8:00 AM – 9:00 AM: Group Breakfast, St. Petersburg Ballroom III",
      },
      {
        text:
          "9:00 AM – 11:00 AM: General Session, St. Petersburg Ballroom I & II",
        children: [
          {
            text: "9:00 AM – 11:00 AM: Elite Wholesaler Prospecting",
            children: [
              {
                text: "Speaker: Sarano Kelley",
              },
            ],
          },
          {
            text: "11:00 AM: Wrap-Ups",
            children: [
              {
                text: "Speaker: Brian Peterson",
              },
            ],
          },
        ],
      },
      {
        text: "11:00 AM: Grab 'n' Go Lunches",
      },
      {
        text: "Departures – please utilize Ubers/Lyft",
      },
    ],
  },
];

/* ========================================
   PAGE
======================================== */
export default function Page() {
  return (
    <div className="masterminds-page bg-[#091229]">
      <MastermindsHeader 
        eventtype="A&RI Agenda" 
        dateOfEvent="September 15 – 17, 2026 Hilton St. Petersburg Bayfront, FL" 
        note="Please note the agenda is subject to change. Attire is business casual for meetings and resort casual for group dinners. Unless otherwise noted, group meals combine Health and A&RI distributions."/>
      <MastermindsAgenda 
        agendaDays={AgendaDays}/>
      <MastermindsFooter/>
    </div>
  );
}




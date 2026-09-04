"use client";

import MastermindsHeader from "@/app/components/masterminds/MastermindsHeader";
import MastermindsAgenda from "@/app/components/masterminds/MastermindsAgenda";
import MastermindsFooter from "@/app/components/masterminds/MastermindsFooter";

/* ========================================
   CONSTANTS
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
======================================== */

const agendaDays = [
  {
    title: "Monday, June 15, 2026",
    items: [
      {
        text: "Arrivals - please utilize Ubers/Lyft",
      },
      {
        text: "3:00 PM: Carrier booth set-up, Audubon Ballroom",
      },
      {
        text: "6:00 PM – 8:00 PM: Group Dinner, Oystercatchers",
        children: [
          {
            text:
              "Please note that this location is a 10-minute walk from the hotel. For easy access, kindly take the walkway located beyond the surface parking lot. If needed, hotel shuttles are available upon request at the front drive (valet stand) of the hotel for transportation.",
          },
        ],
      },
    ],
  },

  {
    title: "Tuesday, June 16, 2026",
    items: [
      {
        text: "7:00 AM: Carrier booth set-up, Audubon Ballroom",
      },
      {
        text:
          "8:00 AM – 9:00 AM: Group Breakfast & Networking, Audubon Ballroom A",
      },
      {
        text: "9:00 AM – 11:30 AM: General Session, Audubon Ballroom",
        children: [
          {
            text:
              "9:00 AM – 9:30 AM: Opening Session: Powering the Next Surge in Senior Market Expansion",
            children: [
              {
                text: "Speakers: Jim Palmer",
              },
            ],
          },
          {
            text:
              "9:30 AM – 9:45 AM: Orientation: How the Product Marketing Labs Work",
            children: [
              {
                text:
                  "Rotations include Final Expense and Health Specialty",
              },
              {
                text: "Final Expense: David Paul",
              },
              {
                text: "Health Specialty: Jamie Sarno",
              },
            ],
          },
          {
            text: "9:50 AM – 11:20 AM: Product Marketing Lab Rotation 1",
          },
        ],
      },
      {
        text:
          "11:30 AM – 12:30 PM: Group Lunch, Audubon Ballroom A",
      },
      {
        text: "12:30 PM – 4:00 PM: General Session, Audubon Ballroom",
        children: [
          {
            text: "12:30 PM – 2:00 PM: Product Marketing Lab Rotation 2",
          },
          {
            text:
              "2:10 PM – 3:00 PM: Growth Session: The Power of the Process: Solutions First, Products Second",
            children: [
              {
                text: "Speaker: Rick Banville",
              },
            ],
          },
          {
            text: "3:00 PM – 3:30 PM: Carrier Networking",
          },
          {
            text:
              "3:30 PM – 4:00 PM: Closing: Pulse Check: Connecting Today’s Product Line Insights",
            children: [
              {
                text:
                  "Speakers: Bobby Bache, Eric Brennan, Darren Houck, & Brian Luben",
              },
            ],
          },
        ],
      },
      {
        text:
          "5:30 PM – 8:00 PM: Offsite Group Dinner, Whiskey Cakes",
        children: [
          {
            text:
              "5:30 PM: Please meet near the front drive (valet stand) for group transportation",
          },
          {
            text:
              "8:00 PM: Group transportation pick-up at Whiskey Cakes",
          },
          {
            text:
              "Transportation to and from the restaurant is approximately 10 minutes.",
          },
          {
            text: "Health + Health Carrier tracks only",
          },
        ],
      },
    ],
  },

  {
    title: "Wednesday, June 17, 2026",
    items: [
      {
        text:
          "8:00 AM – 9:00 AM: Group Breakfast, Audubon Ballroom A",
      },
      {
        text: "9:00 AM – 12:00 PM: General Session, Audubon Ballroom",
        children: [
          {
            text:
              "9:00 AM – 9:45 AM: Tapping into the Current: The Agent Need – Value Proposition Connection",
            children: [
              {
                text:
                  "Speakers: David Paul, Eric Brennan & Darren Houck",
              },
            ],
          },
          {
            text:
              "9:45 AM – 10:30 AM: Growth Session: Powering Up: Where Under 65 Growth Is Accelerating",
            children: [
              {
                text: "Speaker: JC Moreno",
              },
            ],
          },
          {
            text: "10:30 AM – 10:45 AM: Break",
          },
          {
            text:
              "10:45 AM – 11:25 AM: Flip the Switch: Execute, Implement, and Scale",
            children: [
              {
                text:
                  "Speakers: Bobby Bache, Eric Brennan, Matt Graham, Darren Houck, Brian Luben, JC Moreno, Jim Palmer, David Paul, Steve Patton, & Jamie Sarno",
              },
            ],
          },
          {
            text: "11:30 AM: Carrier Raffles",
            children: [
              {
                text:
                  "Moderated by: Steve Patton & Matt Graham",
              },
            ],
          },
        ],
      },
      {
        text:
          "12:00 PM – 12:30 PM: Grab 'n' Go Lunches, Audubon Foyer",
      },
      {
        text:
          "12:00 PM – 12:30 PM: Carrier booth break-down, Audubon Ballroom",
      },
      {
        text:
          "Departures – Please utilize rideshare. Hotel shuttles are available at the hotel valet.",
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
      eventtype="Health Agenda" 
      note="Please note the agenda is subject to change. Attire is business casual for meetings and resort casual for group dinners. Unless otherwise noted, group meals combine Health and A&RI distributions."/>
      <MastermindsAgenda 
      agendaDays={agendaDays}/>
      <MastermindsFooter/>
    </div>
  );
}


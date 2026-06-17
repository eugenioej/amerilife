import type { LucideIcon } from "lucide-react";
import {
  Building2,
  CheckCircle2,
  Handshake,
  Layers,
  PiggyBank,
  TrendingUp,
} from "lucide-react";

const UAT_UPLOADS = "https://uatamerilife.wpengine.com/wp-content/uploads";

export const HERO_IMAGE = `${UAT_UPLOADS}/2021/12/business_people_hands_high_five_2880x764.png`;

export type TeamMember = {
  name: string;
  title: string;
  imageSrc: string;
};

/** Updated roster per M&A team refresh (Feb 2026). */
export const CORP_DEV_TEAM: TeamMember[] = [
  {
    name: "Mike Tobitsch",
    title: "Head of Corporate Development",
    imageSrc: `${UAT_UPLOADS}/2025/02/Mike-Tobitsch.png`,
  },
  {
    name: "Stephen Smith",
    title: "Vice President of Corporate Development",
    imageSrc: "/images/acquisition-partner-program/team/stephen-smith.jpeg",
  },
  {
    name: "Victoria Lucas",
    title: "Corporate Development Manager",
    imageSrc: `${UAT_UPLOADS}/2025/02/Victoria-Lucas.png`,
  },
  {
    name: "Lauren Pacifico",
    title: "Corporate Development Manager",
    imageSrc: `${UAT_UPLOADS}/2025/02/Lauren-Pacifico.png`,
  },
  {
    name: "Austin Sellers",
    title: "Corporate Development Associate",
    imageSrc: "/images/acquisition-partner-program/team/austin-sellers.png",
  },
  {
    name: "Joseph Reichert",
    title: "Corporate Development Associate",
    imageSrc: "/images/acquisition-partner-program/team/joseph-reichert.jpg",
  },
  {
    name: "Nicholas Gunn",
    title: "Corporate Development Associate",
    imageSrc: "/images/acquisition-partner-program/team/nicholas-gunn.jpg",
  },
  {
    name: "Laurel Jones",
    title: "Corporate Development Associate",
    imageSrc: `${UAT_UPLOADS}/2025/02/Laurel-Jones.png`,
  },
  {
    name: "Michael Ogden",
    title: "Corporate Development Associate",
    imageSrc: `${UAT_UPLOADS}/2025/02/Michael-Ogden.png`,
  },
];

export type ApproachItem = {
  icon: LucideIcon;
  title: string;
  bullets: string[];
};

export const PARTNERSHIP_APPROACH: ApproachItem[] = [
  {
    icon: Building2,
    title: "Culture First Approach",
    bullets: [
      "Over nearly 100 new partners have joined the AmeriLife family within the past 5 years",
      "Alignment of core values and leadership a top priority",
    ],
  },
  {
    icon: TrendingUp,
    title: "Retained Upside",
    bullets: [
      "Transaction structure that allows seller to preserve minority interest in his/her entity, which creates significant upside in successful partnership",
    ],
  },
  {
    icon: Handshake,
    title: "Partner Integration Resources",
    bullets: [
      "Access to best in class technologies for leads management, CRM, reporting, enrollment and employee benefits administration",
      "Back-office infrastructure, including IT, cybersecurity, accounting, human resources, compliance, legal and more",
    ],
  },
  {
    icon: Layers,
    title: "Access to Deep, Holistic Product Portfolio",
    bullets: [
      "Access to AmeriLife's premier carrier partnerships, industry-leading contracts, and competitive proprietary products",
      "Ability to deliver to clients through multiple channels",
    ],
  },
  {
    icon: CheckCircle2,
    title: "Focus on Business Growth",
    bullets: [
      "Capital resources to help execute your M&A strategy",
      "Cross-selling opportunities",
      "Access to a robust marketing toolkit",
    ],
  },
  {
    icon: PiggyBank,
    title: "Investment in the Future",
    bullets: [
      "Succession planning for when the time is right",
      "Professional development opportunities for your employees and company leadership",
      "Profit sharing program for all employees",
    ],
  },
];

export const CULTURE_VIDEOS = [
  {
    title: "Employee Profit Sharing Program",
    embedSrc:
      "https://player.vimeo.com/video/1137024919?h=ee08e6a536&badge=0&autopause=0&player_id=0",
    iframeTitle: "AmeriLife Hall for All | Share Our Success",
  },
  {
    title: "AmeriLife Gives Back",
    embedSrc:
      "https://player.vimeo.com/video/1137018781?h=c6acc8d623&badge=0&autopause=0&player_id=0",
    iframeTitle:
      "Supporting Our Veterans: AmeriLife Gives Back Foundation & Honor Flight Network",
  },
] as const;

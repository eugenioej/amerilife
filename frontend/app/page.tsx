import { HeroSection } from "./components/home/HeroSection";
import { LegacySection } from "./components/home/LegacySection";
import { StatBannerSection } from "./components/home/StatBannerSection";
import { FaqSection } from "./components/home/FaqSection";

const STAT_SECTIONS = [
  {
    heading: "STRENGTH IN SCALE",
    statNumber: "166",
    statLabel: "Unique IMOs, Agencies & Financial Firms",
    description:
      "Every year, more than 5 million Americans are advised on and delivered the health and financial solutions they need through AmeriLife's vast, nationwide distribution. And our network continues to grow at a rapid pace with 32 new organizations having joined AmeriLife in the past three years.",
    ctaText: "GET TO KNOW OUR NETWORK",
    ctaHref: "/national-network/",
    imageUrl: "https://amerilife.com/wp-content/uploads/2022/01/GettyImages-1214224199_Resize-scaled.jpg",
    imageAlt: "AmeriLife network and distribution",
    direction: "left" as const,
  },
  {
    heading: "Culture of Service",
    statNumber: "300,000+",
    statLabel: "Client-Centered Agents & Advisors",
    description:
      "AmeriLife unites insurance agents, financial advisors, and industry experts who — alongside our leaders and corporate support staff — are passionate about cultivating meaningful relations with clients.",
    ctaText: "READ OUR STORY",
    ctaHref: "/about-us/who-we-are/",
    imageUrl: "https://amerilife.com/wp-content/uploads/2022/01/Join_Agent_VideoPreview.png",
    imageAlt: "AmeriLife agents and advisors",
    direction: "right" as const,
  },
  {
    heading: "Technology That Works (For You)",
    statNumber: "Thousands",
    statLabel: "of Agents Powered by Agent Xcelerator®",
    description:
      "From smart lead scoring and real-time sales analytics to leveraging the full potential of powerful CRM technology, AmeriLife offers an extensive suite of technology, tools and insights that's re-defining the industry and helping marketers, agents and advisors do what they do best — serve their clients better than anyone else.",
    ctaText: "POWER YOUR BUSINESS",
    ctaHref: "/technology-and-analytics/",
    imageUrl: "https://amerilife.com/wp-content/uploads/2022/02/Power_Tech_Home_1422x1144.png",
    imageAlt: "Agent Xcelerator technology",
    direction: "left" as const,
  },
  {
    heading: "PLATFORM TO ACCELERATE YOUR GROWTH",
    statNumber: "3,600",
    statLabel: "AmeriLife employees supporting your business",
    description:
      "At AmeriLife, we believe that the journey to accelerated, sustainable business growth is rooted in an active partnership and a commitment to collaboration, innovation, and personal and professional development.",
    ctaText: "START YOUR JOURNEY",
    ctaHref: "/join-our-team/",
    imageUrl: "https://amerilife.com/wp-content/uploads/2022/11/Home-Page-Platform-Growth_1422x1144.png",
    imageAlt: "AmeriLife platform growth",
    direction: "right" as const,
  },
];

export default function Home() {
  return (
    <>
      <HeroSection />
      <LegacySection />
      <div className="flex flex-col [&>section]:flex-shrink-0">
        {STAT_SECTIONS.map((props, i) => (
          <StatBannerSection key={i} {...props} />
        ))}
      </div>
      <FaqSection />
    </>
  );
}

import GivesBackHero from "@/app/components/givesback/GivesBackHero";
import GivesBackContentFeatureSection from "@/app/components/givesback/GivesBackContentFeatureSection";
import GivesBackTimeline from "@/app/components/givesback/GivesBackTimeline";
import GivesBackDonorTierCarousel from "@/app/components/givesback/GivesBackDonorTierCarousel";
import GivesBackCommunityPartners from "./GivesBackCommunityPartners";
import GivesBackGivingTree from "./GivesBackGivingTree";
import GivesBackWhatIsSection from "./GivesBackWhatIsSection";
import GivesBackDonateCTA from "./GivesBackDonateCTA";
// import GivesBackBoardMemberCard from "@/app/components/givesback/GivesBackBoardMemberCard";
// import GivesBackSectionContainer from "@/app/components/givesback/GivesBackSectionContainer";

import {
  fetchAffiliateNodes,
  affiliatesInCategory,
  affiliateNodesToCarouselLogos,
} from "@/lib/affiliates";

export default async function GivesBackPage() {
  const affiliateNodes = await fetchAffiliateNodes();
  const communityPartnerLogos =
    affiliateNodesToCarouselLogos(
      affiliatesInCategory(
        affiliateNodes,
        "community-partners"
      )
    );

  return (
    <main className="bg-white">
      <GivesBackHero />

      <GivesBackContentFeatureSection />

      <GivesBackTimeline />
      
      <GivesBackCommunityPartners
        logos={communityPartnerLogos}
      />

      <GivesBackGivingTree />

      <GivesBackWhatIsSection />

      <GivesBackDonorTierCarousel />

      <GivesBackDonateCTA />
    </main>
  );
}
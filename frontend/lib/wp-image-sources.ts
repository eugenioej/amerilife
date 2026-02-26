/**
 * Centralized image source URLs for the AmeriLife frontend.
 *
 * Image paths were verified against:
 * - Production: https://amerilife.com
 * - UAT: https://uatamerilife.wpengine.com
 *
 * Partner logos and some assets use 2021/12 or 2023/02 paths (not 2023/01).
 * The sync-wp-images script uses SYNC_WP_SOURCE_HOSTS to try alternate hosts on 404.
 */

const UPLOADS = "https://amerilife.com/wp-content/uploads";

export const WP_IMAGE_SOURCES = {
  /** Foundation logo */
  givesbackFoundationLogo: `${UPLOADS}/2023/01/agb-logo.png`,

  /** Partner logos – paths and links from https://amerilife.com/givesback/ */
  givesbackPartnerLogos: [
    { src: `${UPLOADS}/2021/12/logo-1b.png`, alt: "Hope Children's Home", href: "https://hopechildrenshome.org/" },
    { src: `${UPLOADS}/2021/12/logo-2.png`, alt: "Cystic Fibrosis Foundation", href: "https://www.cff.org/" },
    {
      src: `${UPLOADS}/2023/02/1aaa66e3-8a88-4001-b952-fdc7104e34b9-TICKET.hs_file_upload-Feeding_America_187x107.png`,
      alt: "Feeding America",
      href: "https://www.feedingamerica.org/",
    },
    { src: `${UPLOADS}/2021/12/logo-3.png`, alt: "Christmas Wish Tampa", href: "https://christmaswishtampa.com/" },
    { src: `${UPLOADS}/2021/12/logo-4.png`, alt: "CMA Aquarium", href: "https://www.cmaquarium.org/" },
    { src: `${UPLOADS}/2021/12/logo-5.png`, alt: "Habitat for Humanity", href: "https://habitatpwp.org/" },
    { src: `${UPLOADS}/2021/12/logo-6.png`, alt: "The Arc Tampa Bay Foundation", href: "https://thearctbfoundation.org/" },
    { src: `${UPLOADS}/2021/12/logo-7a.png`, alt: "Hope Villages of America", href: "https://hopevillagesofamerica.org/" },
    { src: `${UPLOADS}/2021/12/logo-8.png`, alt: "St. Jude Children's Research Hospital", href: "https://www.stjude.org/" },
    { src: `${UPLOADS}/2021/12/logo-9.png`, alt: "Kidz 1st Fund", href: "https://www.kidz1stfund.com/" },
    { src: `${UPLOADS}/2021/12/logo-10.png`, alt: "Atrium Health Levine Children's Hospital", href: "https://atriumhealth.org/medical-services/childrens-services/levine-childrens-hospital" },
    { src: `${UPLOADS}/2021/12/logo-11.png`, alt: "American Heart Association", href: "https://www.heart.org/" },
    { src: `${UPLOADS}/2023/12/HEP_LOGO_182x107.jpg`, alt: "HEP Empowers", href: "https://www.hepempowers.org/" },
    { src: `${UPLOADS}/2021/12/logo-13.png`, alt: "BayCare St. Joseph's Hospital", href: "https://baycare.org/hospitals/st-josephs-childrens-hospital/patients-and-visitors" },
  ],

  /** Affiliates page – hero, quote banner, and affiliated company logos */
  affiliates: {
    heroImage: `${UPLOADS}/2022/01/Affiliates_Hero_a_1420x1124.png`,
    quoteBannerImage: `${UPLOADS}/2021/12/banner-10.png`,
    affiliateLogos: [
      { src: `${UPLOADS}/2026/01/bobby-brock-insurance-logo-362-x-214.png`, alt: "Bobby Brock Insurance" },
      { src: `${UPLOADS}/2025/08/Agent-Boost-Marketing_AmeriLife_362x214.png`, alt: "Agent Boost Marketing" },
      { src: `${UPLOADS}/2026/01/camasprairieinsurnace-362-x-214.png`, alt: "Camas Prairie Insurance" },
      { src: `${UPLOADS}/2025/08/Davies-Agency_AmeriLife_362x214.png`, alt: "Davies Agency" },
      { src: `${UPLOADS}/2026/01/Diversified-Health-Services-Logo-362-x-214.png`, alt: "Diversified Health Services" },
      { src: `${UPLOADS}/2024/08/Affiliates-Page_Elite-Insurance-Group.jpg`, alt: "Elite Insurance Group" },
      { src: `${UPLOADS}/2026/01/gm_logo-362-x-214.png`, alt: "GM" },
      { src: `${UPLOADS}/2026/01/HIPE-logo-362-x-214.png`, alt: "HIPE" },
      { src: `${UPLOADS}/2026/01/Insurance_Specialist_Group_logo-362-x-214.png`, alt: "Insurance Specialist Group" },
      { src: `${UPLOADS}/2026/01/kmeinsurancebrokerageinc_cover-362-x-214.png`, alt: "KME Insurance Brokerage" },
      { src: `${UPLOADS}/2025/10/Levinson_362x214.png`, alt: "Levinson" },
      { src: `${UPLOADS}/2026/01/meritage_wia_cover-362-x-214.png`, alt: "Meritage" },
      { src: `${UPLOADS}/2025/08/The-Ohlson-Group_AmeriLife_362x214.png`, alt: "The Ohlson Group" },
      { src: `${UPLOADS}/2025/08/Peak-Financial_AmeriLife_362x214.png`, alt: "Peak Financial" },
      { src: `${UPLOADS}/2026/01/Plan-Medicare_362x214.png`, alt: "Plan Medicare" },
      { src: `${UPLOADS}/2026/01/Platinum_Choice_logo-362-x-214.png`, alt: "Platinum Choice" },
      { src: `${UPLOADS}/2026/01/PSMBrokerage-logo-Black-2-362-x-214.png`, alt: "PSM Brokerage" },
      { src: `${UPLOADS}/2026/01/Paul-Proffitt-Logo-362-x-214.png`, alt: "Paul Proffitt" },
      { src: `${UPLOADS}/2026/01/rb_insurance_group_llc_cover-362-x-214.png`, alt: "RB Insurance Group" },
      { src: `${UPLOADS}/2025/08/SAM_AmeriLife_362x214.png`, alt: "SAM" },
      { src: `${UPLOADS}/2026/01/Saybrus-362-x-214.png`, alt: "Saybrus" },
      { src: `${UPLOADS}/2026/01/SES_Logo-362-x-214.png`, alt: "SES" },
      { src: `${UPLOADS}/2026/01/seniorhealthcaredirect-362-x-214.png`, alt: "Senior Healthcare Direct" },
      { src: `${UPLOADS}/2025/08/SHID_AmeriLife_362x214.png`, alt: "SHID" },
      { src: `${UPLOADS}/2026/01/sherman-insurance-logo-362-x-214.png`, alt: "Sherman Insurance" },
      { src: `${UPLOADS}/2025/08/SterlingBridge_AmeriLife_362x214.png`, alt: "Sterling Bridge" },
      { src: `${UPLOADS}/2026/01/sucession-362-x-214.png`, alt: "Succession" },
      { src: `${UPLOADS}/2026/01/the_hoffman_financial_group_logo-362-x-214.png`, alt: "The Hoffman Financial Group" },
      { src: `${UPLOADS}/2024/08/Affiliates-Page_USA-Financial.jpg`, alt: "USA Financial" },
      { src: `${UPLOADS}/2026/01/YourFamily-362-x-214.png`, alt: "YourFamily" },
      { src: `${UPLOADS}/2025/04/One-Health-Benefits-Logo-362-x-214.png`, alt: "One Health Benefits" },
      { src: `${UPLOADS}/2025/04/Parket-Marketing-362-x-214.png`, alt: "Parket Marketing" },
      { src: `${UPLOADS}/2025/03/crump-logo-362x214-1.png`, alt: "Crump" },
      { src: `${UPLOADS}/2025/02/Allied-Elite-Financial-1.png`, alt: "Allied Elite Financial" },
      { src: `${UPLOADS}/2026/01/mylifewerksfinal-362-x-214.png`, alt: "MyLifeWerks" },
    ],
    worksiteLogos: [
      { src: `${UPLOADS}/2026/01/logo.usabg-plain.md-362-x-214.png`, alt: "AmeriLife Benefits" },
      { src: "https://uatamerilife.wpengine.com/wp-content/uploads/2022/03/Benefits-direct-362x214-1.png", alt: "Benefits Direct" },
      { src: "https://uatamerilife.wpengine.com/wp-content/uploads/2022/03/Flex-Made-Easy-logo-362x214-1.png", alt: "Flex Made Easy" },
    ],
  },

  /** Consumers page – hero, quote banner, CTA background */
  consumers: {
    heroImage: `${UPLOADS}/2022/01/Consumers_Hero_1420x1144.png`,
    quoteBannerImage: `${UPLOADS}/2021/12/banner-10.png`,
    ctaBannerImage: `${UPLOADS}/2021/12/banner-3.png`,
  },

  /** Shared CTA banner (agents-and-advisors, employees, consumers) */
  ctaBanner: `${UPLOADS}/2021/12/banner-3.png`,

  /** Flexibility & Optionality page */
  flexibilityOptionality: {
    heroImage: `${UPLOADS}/2022/01/Flex_Option_HeroA_1420x1144.png`,
  },

  /** National Network page */
  nationalNetwork: {
    heroImage: `${UPLOADS}/2021/12/National_Network_1420x1144.png`,
  },

  /** Solutions & Opportunities page */
  solutionsOpportunities: {
    heroImage: `${UPLOADS}/2022/01/Solutions_Opportunities_HeroA_1420x1144.png`,
  },

  /** Career Agency page (about-us/our-distribution/career-agency) */
  careerAgency: {
    frankHeadshot: "https://headlessameril.wpenginepowered.com/wp-content/uploads/2021/12/Frank_Tebyani_275x275.png",
    groupImage: "https://headlessameril.wpenginepowered.com/wp-content/uploads/2022/01/Career_Hero1a_1420x1144.png",
    familyImage: "https://headlessameril.wpenginepowered.com/wp-content/uploads/2021/12/Career_Agency_Page_2_1422x1144.png",
  },

  /** Wealth Distribution page (about-us/our-distribution/wealth-distribution) */
  wealthDistribution: {
    toddHeadshot: `https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/01/Todd-Buchanan-HS-light.png`,
    accumulationImage: `${UPLOADS}/2021/12/New_RIA_Page_1422x1144.png`,
    protectionImage: `${UPLOADS}/2023/06/protection_wealth-page-1024x683-1.jpeg`,
    advisoryImage: `${UPLOADS}/2023/06/advisory_services_wealth-page-1024x683-1.jpeg`,
  },

  /** Health Distribution page (about-us/our-distribution/health-distribution) */
  healthDistribution: {
    scottyHeadshot: `${UPLOADS}/2024/11/Scotty-head-shot-3-scaled.jpg`,
    heroImage: `${UPLOADS}/2021/12/Life_and_Health_Page_1422x1144.png`,
  },

  /** Kickoff Recap 2025 page */
  kickoffRecap2025: {
    headerImage: `${UPLOADS}/2025/02/Kickoff2025-LandingPage-Header-012825-CG-1-e1738097748658.png`,
    photoGalleriesBanner: `${UPLOADS}/2025/02/Kickoff2025-LandingPage-01-PhotoGalleries-122424-CG.png`,
    day1RecapBanner: `${UPLOADS}/2025/02/Kickoff2025-LandingPage-02-Day1Recap-122424-CG.png`,
    guestSpeakersBanner: `${UPLOADS}/2025/02/Kickoff2025-LandingPage-03-GuestSpeakers-122424-CG.png`,
    day2RecapBanner: `${UPLOADS}/2025/02/Kickoff2025-LandingPage-04-Day2Recap-122424-CG.png`,
    incentivesBanner: `${UPLOADS}/2025/02/Kickoff2025-LandingPage-05-2025Incentives-122424-CG.png`,
    stormTroopersImage: `${UPLOADS}/2025/02/0118-1024x684-1.jpg`,
  },

  /** Expectations When You Join Our Team page */
  expectationsJoinTeam: {
    icons: {
      training: `${UPLOADS}/2017/08/CorporateResponsibility2-Icon-Green-071117-BL.png`,
      agentSupport: `${UPLOADS}/2017/08/Money2-Icon-Green-071117-BL.png`,
      first90: `${UPLOADS}/2017/08/Timeline2-Icon-Green-071117-BL.png`,
      products: `${UPLOADS}/2017/08/Products2-Icon-Green-071117-BL.png`,
    },
  },

  /** Worksite Distribution page (about-us/our-distribution/worksite-distribution) */
  worksiteDistribution: {
    barbaraHeadshot: `${UPLOADS}/2021/12/Barbara_Stewart_275x275.png`,
    heroImage1: `${UPLOADS}/2021/12/Worksite_Page_1_1422x1144.png`,
    heroImage2: `${UPLOADS}/2021/12/Worksite_Page_2_1422x1144.png`,
  },
} as const;

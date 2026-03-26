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

  /** Affiliates marketing page — hero only (company logos come from WordPress Affiliate CPT). */
  affiliatesPage: {
    heroImage: `${UPLOADS}/2022/01/Affiliates_Hero_a_1420x1124.png`,
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

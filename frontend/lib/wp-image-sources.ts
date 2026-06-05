/**
 * Centralized image source URLs for the AmeriLife frontend.
 *
 * Media is served from headless WordPress (`headlessameril.wpenginepowered.com`).
 * The sync-wp-images script can set `SYNC_WP_SOURCE_HOSTS` to pull from other origins on 404.
 */

const UPLOADS = "https://headlessameril.wpenginepowered.com/wp-content/uploads";
/** Headless WP uploads (2026) — partner logos on /givesback/ */
const GB_2026 = "https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/04";

export const WP_IMAGE_SOURCES = {
  /** Foundation logo (matches production givesback page) */
  givesbackFoundationLogo: `${UPLOADS}/2023/11/AML-Gives-Back_FIFU_500x500.png`,

  /** Partner logos – headless 2026 assets; links aligned to each logo file */
  givesbackPartnerLogos: [
    { src: `${GB_2026}/logo-1b.webp`, alt: "Hope Children's Home", href: "https://hopechildrenshome.org/" },
    { src: `${GB_2026}/logo-2.webp`, alt: "Cystic Fibrosis Foundation", href: "https://www.cff.org/" },
    { src: `${GB_2026}/logo-3.webp`, alt: "Christmas Wish Tampa", href: "https://christmaswishtampa.com/" },
    {
      src: `${GB_2026}/1aaa66e3-8a88-4001-b952-fdc7104e34b9-TICKET.hs_file_upload-Feeding_America_187x107.webp`,
      alt: "Feeding America",
      href: "https://www.feedingamerica.org/",
    },
    { src: `${GB_2026}/logo-4.webp`, alt: "CMA Aquarium", href: "https://www.cmaquarium.org/" },
    { src: `${GB_2026}/logo-6.webp`, alt: "The Arc Tampa Bay Foundation", href: "https://thearctbfoundation.org/" },
    { src: `${GB_2026}/logo-5.webp`, alt: "Habitat for Humanity", href: "https://habitatpwp.org/" },
    { src: `${GB_2026}/logo-7a.webp`, alt: "Hope Villages of America", href: "https://hopevillagesofamerica.org/" },
    { src: `${GB_2026}/logo-8.webp`, alt: "St. Jude Children's Research Hospital", href: "https://www.stjude.org/" },
    { src: `${GB_2026}/logo-10.webp`, alt: "Atrium Health Levine Children's Hospital", href: "https://atriumhealth.org/medical-services/childrens-services/levine-childrens-hospital" },
    { src: `${GB_2026}/logo-9.webp`, alt: "Kidz 1st Fund", href: "https://www.kidz1stfund.com/" },
    { src: `${GB_2026}/logo-11.webp`, alt: "American Heart Association", href: "https://www.heart.org/" },
    { src: `${GB_2026}/HEP_LOGO_182x107.jpg`, alt: "HEP Empowers", href: "https://www.hepempowers.org/" },
    { src: `${GB_2026}/logo-13.webp`, alt: "BayCare St. Joseph's Hospital", href: "https://baycare.org/hospitals/st-josephs-childrens-hospital/patients-and-visitors" },
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

  /** Employees page — Total Rewards column (full-res webp; load unoptimized in page to avoid softening) */
  employees: {
    totalRewardsImage:
      "https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/04/ARC_HeroIMG.webp",
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

  /** Wealth Distribution (about-us/our-distribution/wealth-distribution) — headless 2026/04 */
  wealthDistribution: {
    toddHeadshot: `${GB_2026}/Todd-Headshot-030626-TM-e1773145904519.jpg`,
    accumulationImage: `${GB_2026}/New_RIA_Page_1422x1144-scaled.png`,
    protectionImage: `${GB_2026}/protection_wealth-page-1024x683-1.jpeg`,
    advisoryImage: `${GB_2026}/advisory_services_wealth-page-1024x683-1.jpeg`,
  },

  /** Health Distribution page (about-us/our-distribution/health-distribution) */
  healthDistribution: {
    scottyHeadshot: `${UPLOADS}/2024/11/Scotty-head-shot-3-scaled.jpg`,
    /** Our Offerings column — headless 2026 webp */
    heroImage:
      "https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/04/Life_and_Health_Page_1422x1144.webp",
  },

  /** Direct-to-Consumer (about-us/our-distribution/direct-to-consumer) */
  directToConsumer: {
    jimHeadshot:
      "https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/04/Jim_Palmer_02_275x275.png",
    pageImage:
      "https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/04/DTC_Page_1422x1144.png",
  },

  /** Kickoff Recap 2025 page — sources mirror headless WP; page uses KICKOFF_IMAGES in page.tsx */
  kickoffRecap2025: {
    headerImage: `${UPLOADS}/2025/02/Kickoff2025-LandingPage-Header-012825-CG-1-e1738097748658.png`,
    photoGalleriesBanner: `${UPLOADS}/2025/02/Kickoff2025-LandingPage-01-PhotoGalleries-122424-CG.png`,
    eventPhoto: `${UPLOADS}/2025/02/0118-1024x684-1.jpg`,
    day1RecapBanner: `${UPLOADS}/2025/02/Kickoff2025-LandingPage-02-Day1Recap-122424-CG-1280x381.png`,
    guestSpeakersBanner: `${UPLOADS}/2025/02/Kickoff2025-LandingPage-03-GuestSpeakers-122424-CG.png`,
    day2RecapBanner: `${UPLOADS}/2025/02/Kickoff2025-LandingPage-04-Day2Recap-122424-CG.png`,
    incentivesBanner: `${UPLOADS}/2025/02/Kickoff2025-LandingPage-05-2025Incentives-122424-CG.png`,
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

  /** Worksite Distribution page — headless 2026 webp (about-us/our-distribution/worksite-distribution) */
  worksiteDistribution: {
    barbaraHeadshot: `${GB_2026}/Barbara_Stewart_275x275.webp`,
    heroImage1: `${GB_2026}/Worksite_Page_1_1422x1144.webp`,
    heroImage2: `${GB_2026}/Worksite_Page_2_1422x1144.webp`,
  },

  /**
   * Thank-you page hero — headless WP canonical URL
   * (/wp-content/uploads/2017/10/Thank-You-IMG.jpg).
   */
  thankYouHero:
    "https://headlessameril.wpenginepowered.com/wp-content/uploads/2017/10/Thank-You-IMG.jpg",
} as const;

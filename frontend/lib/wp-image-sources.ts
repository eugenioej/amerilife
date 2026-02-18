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
    { src: `${UPLOADS}/2021/12/logo-13.png`, alt: "BayCare St. Joseph's Children's Hospital", href: "https://baycare.org/hospitals/st-josephs-childrens-hospital/patients-and-visitors" },
  ],
} as const;

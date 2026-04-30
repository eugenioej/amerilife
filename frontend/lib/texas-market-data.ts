/** Google My Maps “Texas Career Agency Offices” embed (matches amerilife.com/texas/). */
export const TEXAS_MY_MAP_EMBED_SRC =
  "https://www.google.com/maps/d/u/0/embed?mid=1fkU_FFKMpU8NUgv1zxGyhPu1oyMKADI&ehbc=2E312F";

/** Texas market landing — office blocks (content aligned with amerilife.com/texas/). */
export type TexasMarketOffice = {
  name: string;
  /** Agency URL segment — matches CMS paths (e.g. /dallas/, /fortworth/). */
  officeSlug: string;
  /** e.g. Managing Director, Agency Manager */
  roleLabel: string;
  contactName: string;
  email: string;
  phoneDisplay: string;
  /** Staff headshot — same WP assets as live Texas page */
  photoUrl: string;
  /** Street and suite lines as shown on the site */
  addressLines: string[];
  /** Google Maps URL */
  mapUrl: string;
};

export const TEXAS_MARKET_OFFICES: TexasMarketOffice[] = [
  {
    name: "Dallas Office",
    officeSlug: "dallas",
    roleLabel: "Managing Director",
    contactName: "Travis Frier",
    email: "AMLH191@amerilife.com",
    phoneDisplay: "972-550-7259",
    photoUrl:
      "https://amerilife.com/wp-content/uploads/2022/10/travis-frier-headshot-300px.png",
    addressLines: ["1333 Corporate Dr, Suite 310", "Irving, TX 75038"],
    mapUrl: "https://goo.gl/maps/hCChwHdwtp4s8Du37",
  },
  {
    name: "FT. Worth Office",
    officeSlug: "fortworth",
    roleLabel: "Agency Manager",
    contactName: "Danny Coffman",
    email: "AMLH193@AmeriLife.com",
    phoneDisplay: "682-626-5307",
    photoUrl:
      "https://amerilife.com/wp-content/uploads/2022/10/daniel-coffman-headshot-300px.png",
    addressLines: ["235 NE Loop 820, Suite 100", "Hurst, TX 76053"],
    mapUrl: "https://goo.gl/maps/3LU3pf1wEW7zvMcv8",
  },
  {
    name: "McKinney Office",
    officeSlug: "mckinney",
    roleLabel: "Agency Manager",
    contactName: "Todd Wechter",
    email: "AMLH195@AmeriLife.com",
    phoneDisplay: "469-640-1028",
    photoUrl:
      "https://amerilife.com/wp-content/uploads/2022/09/todd-wechter-headshot-300px.png",
    addressLines: ["5900 South Lake Forest #260", "McKinney, TX 75070"],
    mapUrl: "https://goo.gl/maps/crHjNdZ8Z3k7bA2N9",
  },
  {
    name: "Mansfield Office",
    officeSlug: "mansfield",
    roleLabel: "Agency Manager",
    contactName: "Anthony \"Tony\" Burnley",
    email: "AMLH192@AmeriLife.com",
    phoneDisplay: "817-225-2994",
    photoUrl:
      "https://amerilife.com/wp-content/uploads/2022/09/anthony-burnley-headshot-300px.png",
    addressLines: ["1900 Matlock Road, Suite 800A", "Mansfield, TX 76063"],
    mapUrl:
      "https://www.google.com/maps/place/1900+Matlock+Rd+%23800a,+Mansfield,+TX+76063/@32.5912167,-97.1066998,17z",
  },
  {
    name: "Highland Village Office",
    officeSlug: "highland-village",
    roleLabel: "Agency Manager",
    contactName: "Kathy Campbell",
    email: "AMLH191A@AmeriLife.com",
    phoneDisplay: "469-405-8880",
    photoUrl:
      "https://amerilife.com/wp-content/uploads/2024/01/Campbell-Kathy_headshot-HR-300x300-1.jpg",
    addressLines: ["2840 Village Parkway, Suite 120", "Highland Village, TX 75077"],
    mapUrl: "https://maps.app.goo.gl/MdxW4R3Nsa2Ka6pQ8",
  },
  {
    name: "Rockwall Office",
    officeSlug: "rockwall",
    roleLabel: "Agency Manager",
    contactName: "Julie Wright",
    email: "AMLH195A@AmeriLife.com",
    phoneDisplay: "469-902-9890",
    photoUrl:
      "https://amerilife.com/wp-content/uploads/2024/08/8854d1a5-df78-4db8-8d61-733037779819-supporting_files-IMG_7209-e1724264028118.jpeg",
    addressLines: ["55 Noble Court, Suite 100", "Heath, TX 75032"],
    mapUrl: "https://maps.app.goo.gl/aUKSCSXQtXziE1226",
  },
];

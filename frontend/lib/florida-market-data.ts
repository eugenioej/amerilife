/**
 * Florida market (West Palm Beach / Fort Lauderdale) — headless WP media (`/florida/`).
 */
const WP_FLORIDA_HEADSHOTS =
  "https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/05";

export type FloridaMarketOffice = {
  name: string;
  officeSlug: string;
  roleLabel: string;
  contactName: string;
  email: string;
  phoneDisplay: string;
  photoUrl: string;
  addressLines: string[];
  mapUrl: string;
};

export const FLORIDA_MARKET_OFFICES: FloridaMarketOffice[] = [
  {
    name: "West Palm Beach Office",
    officeSlug: "florida-west-palm-beach",
    roleLabel: "Managing Director",
    contactName: "Bret Allan",
    email: "AMLH120@AmeriLife.com",
    phoneDisplay: "561-615-9164",
    photoUrl: `${WP_FLORIDA_HEADSHOTS}/gm-120.jpg`,
    addressLines: ["1475 Centrepark Blvd, Suite 205", "West Palm Beach, FL 33401"],
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=1475%20Centrepark%20Blvd%2C%20Suite%20205%2C%20West%20Palm%20Beach%2C%20FL%2033401",
  },
  {
    name: "Fort Lauderdale Office",
    officeSlug: "florida-fort-lauderdale",
    roleLabel: "Licensed Insurance Agent",
    contactName: "Neira Garcia Tovar",
    email: "AMLH120@AmeriLife.com",
    phoneDisplay: "954-772-2143",
    photoUrl: `${WP_FLORIDA_HEADSHOTS}/Neira-Garcia-Tovar.png`,
    addressLines: ["800 West Cypress Creek Road, Suite 530", "Fort Lauderdale, FL 33309"],
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=800%20West%20Cypress%20Creek%20Road%2C%20Suite%20530%2C%20Fort%20Lauderdale%2C%20FL%2033309",
  },
];

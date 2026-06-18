const UPLOADS = "https://headlessameril.wpenginepowered.com/wp-content/uploads";

export const HERO_IMAGE = `${UPLOADS}/2026/06/AdobeStock_1818758041-1.png`;

export type TeamMember = {
  name: string;
  title?: string;
  company?: string;
  bio?: string;
  imageSrc: string;
  linkedin?: string;
  featured?: boolean;
  slug?: string;
};


export const CONTRIBUTOR_TEAM: TeamMember[] = [
  { name: "Amber Allen", slug: "amber-allen", title: "Contributor", imageSrc: `${UPLOADS}/2026/06/Amber-Allen.png`, featured: true },
  { name: "AmeriLife Editorial Team", slug: "amerilife-editorial-team", title: "Contributor", imageSrc: `${UPLOADS}/2026/06/AmeriLife-Editorial-Team.png`, featured: true },
  { name: "Robert Bache", slug: "robert-bache", title: "Contributor", imageSrc: `${UPLOADS}/2026/06/Robert-Bache.png` },
  { name: "Caroline Brooks", slug: "caroline-brooks", title: "Contributor", imageSrc: `${UPLOADS}/2026/06/Caroline-Brooks.png` },

  { name: "Bob Brzyski", slug: "bob-brzyski", title: "Contributor", imageSrc: `${UPLOADS}/2026/06/Bob-Brzyski.png` },
  { name: "Todd Buchanan", slug: "todd-buchanan", title: "Contributor", imageSrc: `${UPLOADS}/2026/06/Todd-Buchanan.png` },
  { name: "William DeCourcy", slug: "william-decourcy", title: "Contributor", imageSrc: `${UPLOADS}/2026/06/William-DeCourcy.png` },
  { name: "Sylvia Gordon", slug: "sylvia-gordon", title: "Contributor", imageSrc: `${UPLOADS}/2026/06/Sylvia-Gordon.png` },

  { name: "Matthew Graham", slug: "matthew-graham", title: "Contributor", imageSrc: `${UPLOADS}/2026/06/Matthew-Graham.png` },
  { name: "Federico Guardia", slug: "federico-guardia", title: "Contributor", imageSrc: `${UPLOADS}/2026/06/Federico-Guardia.png` },
  { name: "Nick Hildenbrand", slug: "nick-hildenbrand", title: "Contributor", imageSrc: `${UPLOADS}/2026/06/Nick-Hildenbrand.png` },
  { name: "Bryan Keeven", slug: "bryan-keeven", title: "Contributor", imageSrc: `${UPLOADS}/2026/06/Bryan-Keeven.png` },

  { name: "Stephanie Kirk", slug: "stephanie-kirk", title: "Contributor", imageSrc: `${UPLOADS}/2026/06/Stephanie-Kirk.png` },
  { name: "Kelly Kleinsasser", slug: "kelly-kleinsasser", title: "Contributor", imageSrc: `${UPLOADS}/2026/06/Kelly-Kleinsasser.png` },
  { name: "Brian Kunkel", slug: "brian-kunkel", title: "Contributor", imageSrc: `${UPLOADS}/2026/06/Brian-Kunkel.png` },
  { name: "Bill Levinson", slug: "bill-levinson", title: "Contributor", imageSrc: `${UPLOADS}/2026/06/Bill-Levinson.png` },

  { name: "Brian Luben", slug: "brian-luben", title: "Contributor", imageSrc: `${UPLOADS}/2026/06/Brian-Luben.png` },
  { name: "Jason Mack", slug: "jason-mack", title: "Contributor", imageSrc: `${UPLOADS}/2026/06/Jason-Mack.png` },
  { name: "Val Majewski", slug: "val-majewski", title: "Contributor", imageSrc: `${UPLOADS}/2026/06/Val-Majewski.png` },
  { name: "Benjamin Martin", slug: "benjamin-martin", title: "Contributor", imageSrc: `${UPLOADS}/2026/06/Benjamin-Martin.png`, featured: true },

  { name: "Ian McDowell", slug: "ian-mcdowell", title: "Contributor", imageSrc: `${UPLOADS}/2026/06/Ian-McDowell.png` },
  { name: "Mark Milbrod", slug: "mark-milbrod", title: "Contributor", imageSrc: `${UPLOADS}/2026/06/Mark-Milbrod.png` },
  { name: "Ray Mohan", slug: "ray-mohan", title: "Contributor", imageSrc: `${UPLOADS}/2026/06/Ray-Mohan.png` },
  { name: "JC Moreno", slug: "jc-moreno", title: "Contributor", imageSrc: `${UPLOADS}/2026/06/JC-Moreno.png` },

  { name: "Scott Morris", slug: "scott-morris", title: "Contributor", imageSrc: `${UPLOADS}/2026/06/Scott-Morris.png` },
  { name: "Julian Novesian", slug: "julian-novesian", title: "Contributor", imageSrc: `${UPLOADS}/2026/06/Julian-Novesian.png` },
  { name: "Joseph Orsini", slug: "joseph-orsini", title: "Contributor", imageSrc: `${UPLOADS}/2026/06/Joseph-Orsini.png` },
  { name: "Angela Palo", slug: "angela-palo", title: "Contributor", imageSrc: `${UPLOADS}/2026/06/Angela-Palo.png`, featured: true },

  { name: "Jeff Palo", slug: "jeff-palo", title: "Contributor", imageSrc: `${UPLOADS}/2026/06/Jeff-Palo.png` },
  { name: "Steve Patton", slug: "steve-patton", title: "Contributor", imageSrc: `${UPLOADS}/2026/06/Steve-Patton.png` },
  { name: "David Paul", slug: "david-paul", title: "Contributor", imageSrc: `${UPLOADS}/2026/06/David-Paul.png` },
  { name: "Kathy Pauley", slug: "kathy-pauley", title: "Contributor", imageSrc: `${UPLOADS}/2026/06/Kathy-Pauley.png` },

  { name: "Brian Peterson", slug: "brian-peterson", title: "Contributor", imageSrc: `${UPLOADS}/2026/06/Brian-Peterson.png` },
  { name: "Randy Pierson", slug: "randy-pierson", title: "Contributor", imageSrc: `${UPLOADS}/2026/06/Randy-Pierson.png` },
  { name: "John Poston", slug: "john-poston", title: "Contributor", imageSrc: `${UPLOADS}/2026/06/John-Poston.png` },
  { name: "Frank Ragsdale", slug: "frank-ragsdale", title: "Contributor", imageSrc: `${UPLOADS}/2026/06/Frank-Ragsdale.png` },

  { name: "Alan Romant", slug: "alan-romant", title: "Contributor", imageSrc: `${UPLOADS}/2026/06/Alan-Romant.png`, featured: true },
  { name: "Darryl Ronconi", slug: "darryl-ronconi", title: "Contributor", imageSrc: `${UPLOADS}/2026/06/Darryl-Ronconi.png` },
  { name: "Jay Scheiner", slug: "jay-scheiner", title: "Contributor", imageSrc: `${UPLOADS}/2026/06/Jay-Scheiner.png` },
  { name: "Louis Slagle", slug: "louis-slagle", title: "Contributor", imageSrc: `${UPLOADS}/2026/06/Louis-Slagle.png` },

  { name: "Sulabh Srivastava", slug: "sulabh-srivastava", title: "Contributor", imageSrc: `${UPLOADS}/2026/06/Sulabh-Srivastava.png` },
  { name: "Jay Thudium", slug: "jay-thudium", title: "Contributor", imageSrc: `${UPLOADS}/2026/06/Jay-Thudium.png` },
  { name: "James Underwood", slug: "james-underwood", title: "Contributor", imageSrc: `${UPLOADS}/2026/06/James-Underwood.png` },
  { name: "Chase Ulrich", slug: "chase-ulrich", title: "Contributor", imageSrc: `${UPLOADS}/2026/06/Chase-Ulrich.png` },

  { name: "Lucas Vandenberg", slug: "lucas-vandenberg", title: "Contributor", imageSrc: `${UPLOADS}/2026/06/Lucas-Vandenberg.png` },
  { name: "Jacob Wilson", slug: "jacob-wilson", title: "Contributor", imageSrc: `${UPLOADS}/2026/06/Jacob-Wilson.png` },
  { name: "Greg Yodis", slug: "greg-yodis", title: "Contributor", imageSrc: `${UPLOADS}/2026/06/Greg-Yodis.png` },
  { name: "Dean Zayed", slug: "dean-zayed", title: "Contributor", imageSrc: `${UPLOADS}/2026/06/Dean-Zayed.png` },

  { name: "Austin James", slug: "austin-james", title: "Contributor", imageSrc: `${UPLOADS}/2026/06/Austin-James.png`, featured: true },
  { name: "Barry Hensley", slug: "barry-hensley", title: "Contributor", imageSrc: `${UPLOADS}/2026/06/Barry-Hensley.png`, featured: true },
  { name: "Aaron Zolbrod", slug: "aaron-zolbrod", title: "Contributor", imageSrc: `${UPLOADS}/2026/06/Aaron-Zolbrod.png`, featured: true },
];



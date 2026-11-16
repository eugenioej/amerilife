import Image from "next/image";

type Resource = {
  title: string;
  image?: string;
  description: React.ReactNode;
  href: string;
};

const resources: Resource[] = [
  {
    title: "Lead Star",
    image:
      "https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/11/Leadstar-CoBrandLogo-091726-EM_Primary-1.png",
    description: (
      <>
        LeadStar powers growth through <strong>sales education, coaching and development</strong> for AmeriLife agents and advisors. Build skills, sharpen performance and stay current with practical training, proven strategies and industry best practices.
      </>
    ),
    href: "#",
  },
  {
    title: "Life @ AmeriLife",
    image:
      "https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/11/Layer_1.png",
    description: (
      <>
        Life@AmeriLife celebrates the people and experiences that shape our culture. Discover <strong>employee stories, events, recognition and community initiatives</strong> that inspire connection, engagement and professional growth.
      </>
    ),
    href: "#",
  },
  {
    title: "AmeriLife Knowledge Assistant",
    image:
      "https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/11/AML-Knowledge-Assistant-Logo-110325-1.png",
    description: (
      <>
        Knowledge Assistant puts essential information and guidance within easy reach. Find policies, <strong>procedures and organizational resources</strong> in one place so you can act quickly and work confidently.
        <span className="mt-3 block text-xs font-bold italic">
          *MUST BE ON VPN TO ACCESS
        </span>
      </>
    ),
    href: "#",
  },
  {
    title: "Recruiting Hub",
    description: (
      <>
        Recruiting Hub equips AmeriLife teams to grow. Tap into <strong>collateral, best practices, training and proven campaigns</strong> to attract, engage and onboard prospective agents, advisors and affiliates.
      </>
    ),
    href: "/ideaxchange/recruiting-hub/",
  },
  {
    title: "Marketing Masterminds",
    image:
      "https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/11/MM-Logo-Color-Black-Text-1.png",
    description: (
      <>
        Marketing Masterminds turns shared expertise and industry insight into action. Explore <strong>educational content, conversations and expert perspectives</strong> that build skills, uncover trends and fuel business growth.
      </>
    ),
    href: "#",
  },
];

export function ResourcesGrid() {
  return (
    <section className="mt-16 md:mt-20">
      <div className="flex flex-wrap justify-center gap-6">
        {resources.map((resource) => (
          <article
            key={resource.title}
            className="flex w-full flex-col items-center rounded-[28px] bg-[#f5f5f5] px-8 py-10 text-center text-[#244260] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
          >
            <div className="flex h-24 w-full items-center justify-center">
              {resource.image ? (
                <Image
                  src={resource.image}
                  alt={resource.title}
                  width={260}
                  height={100}
                  className="max-h-24 w-auto max-w-full object-contain"
                  unoptimized
                />
              ) : (
                <h3 className="text-4xl font-bold leading-tight max-w-[200px]">
                  {resource.title}
                </h3>
              )}
            </div>

            <div className="mt-6 flex-1 text-sm leading-relaxed">
              {resource.description}
            </div>

            <a
              href={resource.href}
              className="mt-8 inline-flex min-h-11 items-center justify-center rounded-full bg-[#40A691] px-7 py-3 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#348a79]"
            >
              Learn More
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
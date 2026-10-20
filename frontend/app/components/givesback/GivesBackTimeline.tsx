"use client";

import Image from "next/image";
import { useRef, useState } from "react";


const timelineItems = [
  {
    year: "1971",
    title: "Company Founded",
    description:
      "AmeriLife was established as a pioneer in insurance distribution, opening its first office in Clearwater, Florida.",
  },
  {
    year: "1990",
    title: "Regional Expansion",
    description:
      "Successfully expanded operations and footprint across the southeastern United States, broadening the carrier portfolio.",
  },
  {
    year: "2000",
    title: "100+ Partners",
    description:
      "Achieved a major scale milestone by reaching over 100 marketing organization partnerships and nationwide alliances.",
  },
  {
    year: "2010",
    title: "Digital Transformation",
    description:
      "Launched state-of-the-art digital platform solutions to revolutionize and modernize insurance distribution channels.",
  },
  {
    year: "2016",
    title: "National Reach",
    description:
      "Grew to an expansive, highly efficient national distribution network spanning all 50 states.",
  },
  {
    year: "2019",
    title: "Strategic Investment",
    description:
      "Partnered with premium private equity investors to inject growth capital and accelerate technology capabilities.",
  },
  {
    year: "2022",
    title: "166 IMOs & Agencies",
    description:
      "Rebounded and scaled to include 166 unique independent marketing organizations and leading financial firms in the alliance.",
  },
  {
    year: "2024",
    title: "Industry Leader",
    description:
      "Solidified market-leader status with a powerful platform supporting over 300,000 independent agents nationwide.",
  },
];

const timelineY = 280;

export default function GivesBackTimeline() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const dragStartX = useRef(0);
  const dragStartScrollLeft = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  function measureMilestone(
  element: HTMLDivElement | null,
  isTop: boolean
) {
  if (!element) return;

  const card = element.querySelector<HTMLElement>(
    "[data-timeline-card]"
  );

  if (!card) return;

  if (isTop) {
    const connectorHeight =
      timelineY - (element.offsetTop + card.offsetHeight);

    element.style.setProperty(
      "--connector-height",
      `${connectorHeight}px`
    );
  } else {
    const connectorHeight =
      element.offsetTop - timelineY;

    element.style.setProperty(
      "--connector-height",
      `${connectorHeight}px`
    );
  }
}

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
  if (event.pointerType !== "mouse" || event.button !== 0) {
    return;
  }

  const scroller = scrollRef.current;

  if (!scroller) {
    return;
  }

  event.preventDefault();

  isDraggingRef.current = true;
  setIsDragging(true);

  dragStartX.current = event.clientX;
  dragStartScrollLeft.current = scroller.scrollLeft;

  scroller.setPointerCapture(event.pointerId);
}

function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
  const scroller = scrollRef.current;

  if (
    !scroller ||
    !isDraggingRef.current ||
    event.pointerType !== "mouse"
  ) {
    return;
  }

  event.preventDefault();

  const distance = event.clientX - dragStartX.current;

  scroller.scrollLeft = dragStartScrollLeft.current - distance;
}

function stopDragging(event: React.PointerEvent<HTMLDivElement>) {
  const scroller = scrollRef.current;

  isDraggingRef.current = false;
  setIsDragging(false);

  if (scroller?.hasPointerCapture(event.pointerId)) {
    scroller.releasePointerCapture(event.pointerId);
  }
}

  return (
    <section className="relative overflow-hidden pt-24">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/09/AmeriLife-Wave-Grey-1.png"
          alt=""
          fill
          draggable={false}
          className="object-cover pointer-events-none"
        />
      </div>

      <div className="relative opacity-40" />

      <div className="relative z-10">
        <div className="w-full">
         
          <div className="relative min-h-[650px]">
            {/* Timeline Line */}
            

            {/* Cards */}
            <div
              ref={scrollRef}
              role="region"
              aria-label="AmeriLife Gives Back Foundation timeline"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={stopDragging}
              onPointerCancel={stopDragging}
              onLostPointerCapture={() => {
                isDraggingRef.current = false;
                setIsDragging(false);
              }}

              className={`timeline-scrollbar overflow-x-auto overscroll-x-contain select-none ${
                isDragging
                  ? "cursor-grabbing scroll-auto"
                  : "cursor-grab scroll-smooth"
              }`}
            >
              <div className="relative flex min-h-[650px] min-w-max items-start gap-16 px-56">
                {/* Timeline Line */}
                <div
                  style={{ top: timelineY }}
                  className="pointer-events-none absolute left-60 right-60 h-[4px] -translate-y-1/2 bg-[var(--color-brand-primary)]"
                />
                {/* Beginning label */}
                <div
                  style={{ top: timelineY }}
                  className="pointer-events-none absolute left-35 -translate-y-1/2"
                >
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                    Beginning
                  </span>
                </div>

              {timelineItems.map((item, index) => {
                const isTop = index % 2 === 0;

                return (
                  <div
                    key={item.year}
                    ref={(el) => measureMilestone(el, isTop)}
                    className={`relative flex h-fit w-[300px] flex-shrink-0 flex-col md:w-[350px] lg:w-[450px] ${
                      isTop ? "mb-[320px]" : "mt-[320px]"
                    }`}
                  >
                    {/* Connector */}
                    <div
                      className={`absolute left-1/2 w-px -translate-x-1/2 border-l-2 border-dashed border-white/60 ${
                        isTop
                          ? "top-full"
                          : "bottom-full"
                      }`}
                      style={{
                        height: "var(--connector-height)"
                      }}
                    />

                    {/* Dot */}
                    <div
                      style={isTop ? { top: timelineY } : undefined}
                      className={`absolute left-1/2 -translate-x-1/2 -translate-y-1/2 ${
                        isTop ? "" : "top-[-40px]"
                      }`}
                    >
                      <div className="flex h-6 w-6 items-center justify-center rounded-full border-[3px] border-[var(--color-brand-primary)] bg-white">
                        <div className="h-3 w-3 rounded-full bg-[var(--color-brand-primary)]" />
                      </div>
                    </div>

                    {/* Card */}
                    <div
                      data-timeline-card
                      className="rounded-[16px] bg-white p-6 shadow-lg"
                    >

                      <div className="mb-6 inline-flex rounded-[3px] bg-[var(--color-brand-dark)] px-4 py-2 text-sm font-bold text-white">
                        {item.year}
                      </div>

                      <h3 className="mb-4 text-[20px] font-bold text-[var(--color-brand-primary)]">
                        {item.title}
                      </h3>

                      <p className="text-[16px] leading-[1.7]">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
              {/* Current label */}
              <div
                style={{ top: timelineY }}
                className="pointer-events-none absolute right-35 -translate-y-1/2"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                  Current
                </span>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
"use client";
export default function DisclaimerMessage() {
const messages = [
  {
    start: "2026-11-20",
    end: "2026-11-29",
    text: (
      <>
        Office will be closed <strong>12:00 PM EST</strong> on{" "}
        <strong>11/25</strong> and closed all day{" "}
        <strong>11/26</strong> &amp; <strong>11/27</strong>.
      </>
    ),
    resume: (
      <>
        Will resume regular hours on <strong>11/30</strong>.
      </>
    ),
  },
  {
    start: "2026-12-21",
    end: "2026-12-27",
    text: (
      <>
        Office will be closed all day <strong>12/24</strong> &amp;{" "}
        <strong>12/25</strong>.
      </>
    ),
    resume: (
      <>
        Will resume regular hours on <strong>12/28</strong>.
      </>
    ),
  },
  {
    start: "2026-12-28",
    end: "2027-01-03",
    text: (
      <>
        Office will be closed <strong>12:00 PM EST</strong> on{" "}
        <strong>12/31</strong> and closed all day <strong>01/01</strong>.
      </>
    ),
    resume: (
      <>
        Will resume regular hours on <strong>01/04</strong>.
      </>
    ),
  },
];
  const todayEST = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
  }).format(new Date());
  const activeMessage = messages.find((message) => 
   todayEST >= message.start && todayEST <= message.end);
  if (!activeMessage) {
    return null;
  }

  return (
    <section className="mt-4 border-t border-[#3fa590]/30 pt-4">
    <div className="mx-auto">
        <p className="text-base leading-8 text-[#244260]">
          {activeMessage.text}
        </p>

        <div className="mt-4">
          <p className="text-base leading-8 text-[#244260]">
            {activeMessage.resume}
          </p>
        </div>
      </div>
    </section>
  );
}
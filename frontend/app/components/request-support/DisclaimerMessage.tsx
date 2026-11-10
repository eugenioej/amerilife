export default function DisclaimerMessage() {
  const today = new Date();

  // MM-DD format
  const currentMonthDay = String(today.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(today.getDate()).padStart(2, "0");

  const messages = [
  {
    start: "11-20",
    end: "11-30",
    text: (
      <>
        Office will be closed <strong>12pm EST</strong> on{" "}
        <strong>11/25</strong> and closed all day <strong>11/26</strong> &{" "}
        <strong>11/27</strong>.
      </>
    ),
    resume: (
      <>
        Will resume regular hours on <strong>11/30</strong>.
      </>
    ),
  },
  {
    start: "12-21",
    end: "12-27",
    text: (
      <>
        Office will be closed all day <strong>12/24</strong> &{" "}
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
    start: "12-28",
    end: "01-04",
    text: (
      <>
        Office will be closed <strong>12pm EST</strong> on{" "}
        <strong>12/31</strong> and closed all day <strong>1/1</strong>.
      </>
    ),
    resume: (
      <>
        Will resume regular hours on <strong>1/4</strong>.
      </>
    ),
  },
];

  const activeMessage = messages.find(({ start, end }) => {
    // Handle ranges that cross into a new year
    if (start > end) {
      return currentMonthDay >= start || currentMonthDay <= end;
    }

    return currentMonthDay >= start && currentMonthDay <= end;
  });

  if (!activeMessage) {
    return null;
  }

  return (
    <section className="border-t border-[#3fa590] mt-2">
      <div className="mx-auto mt-2">
        <p className="text-base leading-8 text-[#244260]">
          {activeMessage.text}
        </p>
        <p className="text-base leading-8 text-[#244260]">
          {activeMessage.resume}
        </p>
      </div>
    </section>
  );
}
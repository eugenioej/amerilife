export default function DisclaimerMessage() {
  const currentYear = new Date().getFullYear();
 function getThanksgiving(year: number) {
  const date = new Date(year, 10, 1); // Nov 1
  let thursdays = 0;

  while (thursdays < 4) {
    if (date.getDay() === 4) {
      thursdays++;
    }

    if (thursdays < 4) {
      date.setDate(date.getDate() + 1);
    }
  }

  return date;
}
const formatDate = (date: Date) =>
  date.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
  });

const formatISODate = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;
const thanksgiving = getThanksgiving(currentYear);

const dayBefore = new Date(thanksgiving);
dayBefore.setDate(dayBefore.getDate() - 1);
const dayAfter = new Date(thanksgiving);
dayAfter.setDate(dayAfter.getDate() + 1);

const startDate = new Date(thanksgiving);
startDate.setDate(startDate.getDate() - 7);

const endDate = new Date(thanksgiving);
endDate.setDate(endDate.getDate() + 3);
const endDatelabel = new Date(thanksgiving);
endDatelabel.setDate(endDatelabel.getDate() + 4);
const today = new Date();

const newYearsStartYear =
  today.getMonth() === 0 ? today.getFullYear() - 1 : today.getFullYear();
  const messages = [
    {
      start: formatISODate(startDate),
      end: formatISODate(endDate),
      text: (
        <>
          Office will be closed <strong>12:00 PM EST</strong> on{" "}
          <strong>{formatDate(dayBefore)}</strong> and closed all day{" "}
          <strong>{formatDate(thanksgiving)}</strong> & <strong>{formatDate(dayAfter)}</strong>.
        </>
      ),
      resume: (
        <>
          Will resume regular hours on <strong>{formatDate(endDatelabel)}</strong>.
        </>
      ),
    },
    {
      start: `${currentYear}-12-21`,
      end: `${currentYear}-12-27`,
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
      start: `${newYearsStartYear}-12-28`,
      end: `${newYearsStartYear +1}-01-03`,
      text: (
        <>
          Office will be closed <strong>12:00 PM EST</strong> on{" "}
          <strong>12/31</strong> and closed all day{" "}
          <strong>01/01</strong>.
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
    <section className="border-t border-[#3fa590]/30 mt-4">
      <div className="mx-auto mt-4">
        <p className="text-base leading-8 text-[#244260]">
          {activeMessage.text}
        </p>

        <div className="mt-4 ">
          <p className="text-base leading-8 text-[#244260]">
            {activeMessage.resume}
          </p>
        </div>
      </div>
    </section>
  );
}
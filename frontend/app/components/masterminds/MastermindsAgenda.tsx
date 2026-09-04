"use client";

import dynamic from "next/dynamic";

const AddToHomeScreen = dynamic(

() => import("./AddToHomeScreen"),

{

ssr: false,

}

);


type AgendaItem = {
  text: string;
  children?: AgendaItem[];
};

type DayProps = {
  title: string;
  items: AgendaItem[];
};
type AgendaDay = {

title: string;

items: AgendaItem[];

};
type MastermindsAgendaProps = {

    agendaDays: AgendaDay[];

};



export default function MastermindsAgenda({agendaDays}:MastermindsAgendaProps) {
  return (
      <div className=" mx-auto max-w-[1000px] px-5 pb-14 sm:pb-20 sm:px-6">
        {/* SCHEDULE CARD */}
        <div className="rounded-2xl bg-[#f0fdf4] px-4 py-7 sm:px-10 sm:py-10 shadow-xl">

<div className="space-y-10 sm:space-y-14">
    
    {agendaDays.map((day) => (
        <Day
        key={day.title}
        title={day.title}
        items={day.items}
        />
    ))}
    </div>
    </div>
 {/* INSTALL BUTTON */}
    <div className="mt-10 text-center">
        <AddToHomeScreen />
    </div>

{/* QR SECTION */}
<div className="mt-12 text-center">
  

    <p className="text-[white]">Attire is business casual for meetings and resort casual for group dinners. 
  Attendees are responsible for their transportation to and from the airport</p>
    {/* GREEN TITLE */}
    <p className="text-base font-semibold text-[#03f080] tracking-wide">
      Please note the agenda is subject to change.
    </p>

 
</div>


      </div>
    
  );
}

function Day({ title, items }: DayProps) {
  return (
    <div className="border-l-4 border-[#03f080] pl-4">
      <h3 className="mb-3 text-base font-semibold text-[#091229] sm:text-xl">
        {title}
      </h3>

      <ul className="space-y-3">
        {items.map((item, index) => (
          <AgendaNode
            key={index}
            item={item}
            level={0}
          />
        ))}
      </ul>
    </div>
  );
}

function AgendaNode({
  item,
  level,
}: {
  item: AgendaItem;
  level: number;
}) {
  const isSpeaker = item.text.toLowerCase().startsWith("speakers");
  const isNote = item.text.toLowerCase().startsWith("please note");

  return (
    <li>
      <div
        className={`
          flex items-start gap-2
          ${
            level === 0
              ? "font-medium text-gray-800"
              : level === 1
              ? "pl-4 text-[13px] text-gray-700"
              : "pl-6 text-[12px] text-gray-500"
          }
          ${isSpeaker ? "italic text-gray-500" : ""}
          ${isNote ? "mt-1 italic text-gray-500" : ""}
        `}
      >
        {level === 1 && (
          <span className="mt-[6px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400" />
        )}

        {level === 2 && (
          <span className="mt-[6px] h-1 w-1 flex-shrink-0 rounded-full border border-gray-400" />
        )}

        <span>{formatText(item.text)}</span>
      </div>

      {item.children && (
        <ul className="mt-1 space-y-1">
          {item.children.map((child, index) => (
            <AgendaNode
              key={index}
              item={child}
              level={level + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

function formatText(text: string) {
  const match = text.match(
    /^(\d{1,2}:\d{2}\s?(AM|PM)(\s?–\s?\d{1,2}:\d{2}\s?(AM|PM))?)/
  );

  if (!match) return text;

  const time = match[0];
  const rest = text.replace(time, "").trim();

  return (
    <>
      <span className="font-semibold text-gray-900">{time}</span>{" "}
      <span className="text-gray-700">{rest}</span>
    </>
  );
}

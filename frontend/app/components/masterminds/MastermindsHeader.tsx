import Image from "next/image";
import { IMAGES } from "./MastermindsConstants";
import Link from "next/link";

type MastermindsHeaderProps = {
  dateOfEvent: string;
  note: string;
  eventtype: string;
};


export default function MastermindsHeader({dateOfEvent, note, eventtype}:MastermindsHeaderProps) {
  return (
    <section className=" relative flex justify-center items-center overflow-hidden bg-[#091229] text-white pt-20 sm:pt-20">
    
    
         {/* HEADER */}
        <div className="mb-10 sm:mb-14 text-center text-white">

          <div className="mx-auto mb-6 w-[220px] sm:w-[300px]">
            <Link href="/masterminds/agendas/" className="block">
              <Image
                src={IMAGES.wordmark}
                alt="Masterminds"
                width={420}
                height={120}
                className="w-full h-auto cursor-pointer transition hover:scale-102"
              />
            </Link>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold">
            Masterminds <span className="text-[#03f080]">{eventtype}</span>
          </h1>

          <p className="mt-3 inline-block px-4 py-2 text-sm font-semibold tracking-wide text-white rounded-full border border-[#03f080]/40 bg-[#03f080]/20">
            {dateOfEvent}
          </p>

          <p className="mx-auto mt-3 max-w-[600px] text-xs text-white/60">
            {note}
          </p>

        </div>
    
          
        </section>
  );
}
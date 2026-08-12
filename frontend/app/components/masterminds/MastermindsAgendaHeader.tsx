import Image from "next/image";
import { IMAGES } from "./MastermindsConstants";
import Link from "next/link";

type MastermindsAgendaHeaderProps = {
  note: string;
  selector: string;
  
};


export default function MastermindsHeader({note, selector}:MastermindsAgendaHeaderProps) {
  return (
    <div className="text-center text-white py-14 sm:py-20 px-5">

      {/* LOGO */}
      
<div className="mx-auto mb-6 w-[220px] sm:w-[300px]">
  <Link href="/masterminds/" className="block">
    <Image
      src={IMAGES.wordmark}
      alt="Masterminds"
      width={420}
      height={120}
      className="w-full h-auto cursor-pointer transition hover:scale-102"
    />
  </Link>
</div>


      {/* TITLE */}
      <h1 className="text-2xl sm:text-4xl font-bold mb-4">
        Select Your <span className="text-[#03f080]">{selector}</span>
      </h1>

      {/* SUBTEXT */}
      <p className="mx-auto max-w-[520px] text-sm sm:text-base text-white/80 mb-10">
        {note}
      </p>

    </div>
  );
}
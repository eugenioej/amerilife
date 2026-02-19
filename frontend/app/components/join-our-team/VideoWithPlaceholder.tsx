"use client";

import Image from "next/image";
import { useState } from "react";
import { rewriteUploadsUrl } from "@/lib/wp-media";

type VideoWithPlaceholderProps = {
  previewImage: string;
  videoId: string;
  videoTitle?: string;
};

export function VideoWithPlaceholder({
  previewImage,
  videoId,
  videoTitle = "Play video",
}: VideoWithPlaceholderProps) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <div className="relative aspect-video w-full overflow-hidden bg-black lg:aspect-auto lg:min-h-[400px]">
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1`}
          title={videoTitle}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className="group relative aspect-video w-full overflow-hidden bg-black lg:aspect-auto lg:min-h-[400px] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:ring-offset-2"
      aria-label={videoTitle}
    >
      <Image
        src={rewriteUploadsUrl(previewImage)}
        alt=""
        fill
        className="object-cover transition-opacity group-hover:opacity-95"
        sizes="(max-width: 1024px) 100vw, 50vw"
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/30">
        <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-white/20 shadow-lg transition-transform group-hover:scale-110">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="white"
            className="ml-1 h-10 w-10"
            aria-hidden
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
    </button>
  );
}
